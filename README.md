# egg-proxy-middleware

proxy plugin for egg.

## Can I do for you
This is a plugin for egg. Help you to redriect request from browser to other server api wher CORS.

## Install

```bash
$ npm i @ac/egg-proxy-middleware --save
```

## Usage

```js
// config/config.${env}.js

// require
exports.middleware = [
    'eggProxy'
];
// config
exports.eggProxy = {
    rules: [
        {
            proxy_location: '/login.aspx', // redirect url
            proxy_pass: 'http://m.acfun.cn', // target origin
        }
    ],
    body_parse: true,
    proxy_timeout: 3000,
    gzip: true // default value is true
};
```

```js
// app/middleware/egg_proxy.js

// wrapper
module.exports = require('@ac/egg-proxy-middleware');

```

## Support

framework: koa2

request method: get/post/put/delete

request data format: url/form/multipart


## Questions & Suggestions

Please open an issue [here](http://git.corp.kuaishou.com/acfun-frontend/modules/egg-proxy-middleware/issues).

## License

[MIT](LICENSE)
