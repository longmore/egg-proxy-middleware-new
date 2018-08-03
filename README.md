# egg-proxy-middleware

proxy plugin for egg.

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
    gzip: true // default value is true
};
```

```js
// app/middleware/egg_proxy.js

// wrapper
module.exports = require('@ac/egg-proxy-middleware');

```

## Questions & Suggestions

Please open an issue [here](http://git.corp.kuaishou.com/acfun-frontend/modules/egg-proxy-middleware/issues).

## License

[MIT](LICENSE)
