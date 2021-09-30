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

app.get('/tweets', async function(req, resp, next) {
  const url = "https://api.twitter.com/2/users/1137701/tweets?end_time=2021-09-16T00:00:01Z&max_results=20";
  const opts = {method: 'GET', headers: {
    "Authorization": "Bearer AAAAAAAAAAAAAAAAAAAAADP4kAAAAAAAZFAIe7uhroCEeH6Dm6YllhQGup0%3D43FG0YrTlc6Q8Yn2CFGQO1dLv3dvXOGuLQgzGJqfY9HklYUmqn"} };
  const response = await fetch(url, opts);
  const json = await response.json();
  console.log(JSON.stringify(json));
  resp.send(JSON.stringify(json));
})

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('App listening at http://%s:%s', host, port)
})
