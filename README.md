## Bubble utility - binary file mover ( node express server )

A feature to simply move around binary files, with Endpoints or with API Connector using 2, encoded Urls  (from , to) as parameters. For, example to move/copy a jpeg from AWS S3 platform to another, 3rd party fileSys as a service, the Url for the Endpoint/ connector would be :

```
http://localhost:3000/files/https%3A%2F%2Fs3.amazonaws.com%2Fyayatv-dev%2F3c6429451c4c3af2d8e18085f957e612_image.jpeg/https%3A%2F%2Fs3.amazonaws.com%2Fyayatv-dev%2F3c6429451c4c3af2d8e18085f957e612_image.jpeg
```
and the node express route corresponding to the above client request is :

```
app.get('/files/:from/:to',  function(req, resp, next) {
  var url1, url2 = "";
```

Response is standard **http.response**

Full stdout log from curl client moving file from AWS to Parse-Server on [pastBin](https://pastebin.com/uG4p7Qij)

Intended for devs with some node.express and some npm and some git background.

## Download, Install ##
using std. git.clone and node.npm.install

## dev run   localhost:3000 ##
```
cd $PROJECT_ROOT
node app
```

use curl client , use Postman for client
remember to urlencode  each of the 2 url parms located in the full url's path.

# Sample Application with Node.js and Express Framework

This sample is running on: https://node-express.is-easy-on-scalingo.com/

## Deploy via Git

Create an application on https://scalingo.com, then:

```shell
scalingo --app my-app git-setup
git push scalingo master
```

And that's it!

## Deploy via One-Click

[![Deploy to Scalingo](https://cdn.scalingo.com/deploy/button.svg)](https://my.scalingo.com/deploy)

## Running Locally

```shell
docker-compose build
docker-compose run --rm web npm install
docker-compose up
```

## Links

Documentation: https://doc.scalingo.com/languages/javascript/nodejs
