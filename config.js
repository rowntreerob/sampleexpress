var body;

let apidev = {
    hostparse : process.env.PARSE_URL ,
  parseheaders: {
    "X-Parse-Application-Id":  process.env.PARSE_APPLICATION_ID ,
    "X-Parse-REST-API-Key":  process.env.PARSE_REST_API_KEY ,
    "Content-Type": "image/jpeg"
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
