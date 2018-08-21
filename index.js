/*
 * @Author: zhangrongmou
 * @Date: 2018-08-02 22:04:19
 * @Last Modified by: zhangrongmou
 * @Last Modified time: 2018-08-21 20:23:21
 */

const util = require('util');
const querystring = require('querystring');
const request = require('request');
const _ = require('lodash');
const utils = require('./utils/utils.js');

const colors = require('colors');
colors.setTheme({
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue'
});

module.exports = (options) => {
    options = _.defaults(options || {}, {
        body_parse: true,
        proxy_timeout: 3000,
        proxy_methods: ['GET', 'POST', 'PUT', 'DELETE'],
        host: false,
        rules: [],
        gzip: true
    });

    return async (ctx, next) => {

        if (utils.shouldSkipNext(ctx, options)) {
            return await next();
        };

        let opts = {};

        if (utils.shouldParseBody(ctx, options)) {
            ctx.request.body = await utils.execParseBody(ctx, false);
        }

        if (util.isError(ctx.request.body)) {
            ctx.status = 500;
            return;
        }

        opts = utils.configRequestOptions(ctx, options);
        if (!opts.host) {
            delete opts.headers.host;
        }
        await requestWrap(opts).then(res => {
            let result = res.body;
            // 如果是json数据, 则解析为对象
            if (/json/i.test(res.headers['content-type'])) {
                ctx.body = JSON.parse(result);
            }

            ['content-type', 'set-cookie'].forEach(header => {
                res.headers[header] && ctx.set(header, res.headers[header]);
            });
        }).catch(err => {
            ctx.body = err;
        });

    };
};

function requestWrap(opt) {
    return new Promise((resolve, reject) => {
        let fullUrl = opt.url;
        if (querystring.stringify(opt.qs)) {
            fullUrl += '?' + querystring.stringify(opt.qs);
        }
        request(opt, (error, response) => {
            let status = response && response.statusCode;
            // success
            if (!error && +status === 200) {
                console.log(`[proxy] ${fullUrl}`.green);
                console.log(response.body);
                resolve(response);
            } else {
                console.log(`[proxy] ${fullUrl}`.red);
                console.log(response.body);
                reject({
                    result: status,
                    msg: '服务请求出错!'
                });
            }
        })
    });
}