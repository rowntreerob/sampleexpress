var body;

let apidev = {
    hostparse : process.env.PARSE_URL ,
  parseheaders: {
    'X-Parse-Application-Id':  process.env.PARSE_APPLICATION_ID ,
    'X-Parse-REST-API-Key':  process.env.PARSE_REST_API_KEY ,
    'Content-Type': 'image/jpeg',
    'Access-Control-Allow-Headers':
    'X-Parse-Master-Key,X-Parse-REST-API-Key'
    +',X-Parse-Javascript-Key,X-Parse-Application-Id'
    +',X-Parse-Client-Version,X-Parse-Session-Token'
    +',Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,HEAD,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Origin': '*'
    },
  twtrhdrs:{"Authorization":
  'Bearer '}
}

export function getConf(env) {
  if(env == 'production'){
    return {api: apidev};
  }else{
    return {api: apidev};
  }
}
