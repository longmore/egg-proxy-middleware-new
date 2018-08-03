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

### Validate Request Body

```js
// {app_root}/app/controller/home.js
exports.index = function*() {
  this.validate({ id: 'id' }); // will throw if invalid
  // or
  const errors = this.validator.validate({ id: 'id' }, this.request.body);
};
```

### Extend Rules

- app.js

```js
app.validator.addRule('jsonString', (rule, value) => {
  try {
    JSON.parse(value);
  } catch (err) {
    return 'must be json string';
  }
});
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
