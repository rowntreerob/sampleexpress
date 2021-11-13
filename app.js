/**
 * @author Léo Unbekandt
 */
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import util from 'util';
import { URL } from 'url';
import { uploadFile } from 's3-bucket';

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client.js";
// Helper function that creates Amazon S3 service client module.

import { nanoid } from 'nanoid';
import fs from 'fs';
import { getConf } from "./config.js";
const env = process.env.NODE_ENV || 'development';
const region = process.env.AWS_REGION || 'us-east-1';
const bucket = process.env.S3_BUCKET_NAME || 'yayatv-dev';


let Config = getConf(env);
// console.log(JSON.stringify(Config.api.parseheaders) + " ENV")
var app = express()
// const hostWithProtocol = req.protocol + '://' + req.get('host')
const __dirname = new URL('.', import.meta.url).pathname;
app.use(express.static(__dirname + '/public'));
//app.use(cors({corsOptions}));
app.use(cors())
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index', {});
})

app.get('/tweetsol', async function(req, resp, next) {
  const url = "https://api.twitter.com/2/users/1137701/tweets?end_time=2021-09-16T00:00:01Z&max_results=20";
  const opts = {method: 'GET', headers: Config.api.twtrhdrs };
  const response = await fetch(url, opts);
  const json = await response.json();
  console.log(JSON.stringify(json));
  resp.send(JSON.stringify(json));
})

app.get('/tweets',  function(req, resp, next) {
  const url = "https://api.twitter.com/2/users/1137701/tweets?end_time=2021-09-16T00:00:01Z&max_results=20";
  const opts = { method: 'GET', headers: Config.api.twtrhdrs };
  fetch(url, opts)
    .then(response => {
      resp.writeHead(response.status, response.headers);
      response.body.pipe(resp);
    }).catch((error) => {
        console.error(error);
        next(error);
      });
})
// url from and to.. fetch from url1 and POST to url2
// return response.body from saas "sender"
// use a pipe to flip that resp.body to the payload of the POST
// to saas "receiver" returning the POST.response to orig client
app.get('/files/:from/:to',  function(req, resp, next) {
  var url1, url2 = "";
  if (req.params.from)url1 = decodeURI(req.params.from);
  if (req.params.to)url2 = decodeURI(req.params.to);
  fetch(url1)
    .then(response => {
      return response.body;
    }).then(body => {
      var opts2 = {method: 'POST',
        headers: Config.api.parseheaders,
        body: body,
      };
      fetch(url2, opts2 )
        .then(respon2 => {
          resp.writeHead(respon2.status, respon2.headers);
          respon2.body.pipe(resp);
      }) // Promise wrapper for POST action
    })  // Promise wrapper of body of init GET
      .catch((error) => {
        console.error(error);
        next(error);
      });
})

// client side uses POST action with binary file in http.req.body
//note the interface 'req' is piped / set to the body of post#2
// where it satisfies the interface ( cls=ReadableStream)
// from there, the fetch on url#2 has the effect of piping the
// orig req.stream to the 2nd post obj's req.body
// the the file posted to us is proxied out in the 2nd fetch
// to the proper final destination for the file from bubble client side
app.post('/upload',  function(req, resp, next) {
  // console.log("RTE upload post");
  var url2 = Config.api.hostparse + "picture.jpg"
  var opts2 = {method: 'POST',
    headers: Config.api.parseheaders,
    body: req
  };
  fetch(url2, opts2 )
    .then(respon2 => {
      resp.writeHead(respon2.status, respon2.headers);
      respon2.body.pipe(resp);
  }) // Promise wrapper for POST action
  .catch((error) => {
    console.error(error);
    next(error);
  });
})
// handle browser pre-fetch that preceed the post calls below
app.options('/awsupl', cors());
// for POST binary to AWS S3 using npm.s3-bucket
// same protocol as 'upload' with exception for bucket's
// using fs and NOT USING node.STREAMS
// so file output to /tmp and then POST #2 does io on the
// tmpfile from step #1
// binary file in req.body is proxied to S3 Bucket specified
// in the list of env vars used for s3-bucket - see docs in npm
app.post('/awsupl', cors(), function(req, resp, next) {
  // console.log("RTE awsupl post ");
  let _path = '/tmp/' + nanoid();
  req.pipe(fs.createWriteStream(_path))
  .on('close', function() {
    uploadFile({
     filePath: _path,
     Key: 'bubbtst/photo.png'})
     .then(res2 => {
       console.log('response aws ' ,JSON.stringify(res2));
        resp.set({'Content-Type': 'application/json'});
        resp.end(JSON.stringify(res2));
     })
   });
})

// handle browser pre-fetch that preceed the post calls below
app.options('/awsvid', cors());
// for POST binary to AWS S3 using npm.s3-bucket , folder "video"
// same protocol as 'upload' with exception for bucket's
// binary file in req.body is proxied to S3 Bucket /foldr specified
// in the list of env vars used for s3-bucket - see docs in npm
app.post('/awsvid', cors(), function(req, resp, next) {
  // console.log("RTE awsupl post ");
  let _path = '/tmp/' + nanoid();
  req.pipe(fs.createWriteStream(_path))
  .on('close', function() {
    uploadFile({
     filePath: _path,
     Key: 'video/clip.mp4'})
     .then(res2 => {
       console.log('response aws ' ,JSON.stringify(res2));
        resp.set({'Content-Type': 'application/json'});
        resp.end(JSON.stringify(res2));
     })
   });
})

app.options('/awsaud', cors());
// for POST binary to AWS S3 of raw PCM
// Wav mimetpe after addition Wav headers to the blob in post.body
// resultant wav file created in s3-bucket config'd for audio
// get buffer for body , add header , get blob and post to s3
app.post('/awsaud', cors(), async function(req, resp, next) {
  // no header body is raw PCM audio -> stream direct to aws create
  let stream = req.body;
  let data, json;
  const params = {
    Bucket:  bucket,
    Key: 'audio/clip.pcm',
    ContentType: 'audio/pcm',
    Body: stream
  };
  try {
    data = await s3Client.send(new PutObjectCommand(params));
    //console.log(util.inspect(data, false, null, true /* enable colors */))
    resp.set({'Content-Type': 'application/json'});
    resp.end(JSON.stringify(data));
  } catch (error) {
    return resp.status(400).json({ error: error.toString() });
  }
})

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('App listening at http://%s:%s', host, port)
})
