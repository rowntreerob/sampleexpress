/**
 * @author Léo Unbekandt 
 */
import fetch from 'node-fetch';
import express from 'express';
import { URL } from 'url';
var app = express()

const __dirname = new URL('.', import.meta.url).pathname;
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index', {});
})

app.get('/tweetsol', async function(req, resp, next) {
  const url = "https://api.twitter.com/2/users/1137701/tweets?end_time=2021-09-16T00:00:01Z&max_results=20";
  const opts = {method: 'GET', headers: {
    "Authorization": "$TOKEN"} };
  const response = await fetch(url, opts);
  const json = await response.json();
  console.log(JSON.stringify(json));
  resp.send(JSON.stringify(json));
})

app.get('/tweets',  function(req, resp, next) {
  const url = "https://api.twitter.com/2/users/1137701/tweets?end_time=2021-09-16T00:00:01Z&max_results=20";
  const opts = {method: 'GET', headers: {
    "Authorization": "$TOKEN"} };
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
      var opts2 = {method: 'POST', headers: {
        "X-Parse-Application-Id": "$ID",
        "X-Parse-REST-API-Key": "$KEY",
        "Content-Type": "	image/jpeg"
        },
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

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('App listening at http://%s:%s', host, port)
})
