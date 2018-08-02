/*
 * @Author: zhangrongmou
 * @Date: 2018-08-02 22:04:19
 * @Last Modified by:   zhangrongmou
 * @Last Modified time: 2018-08-02 22:04:19
 */

var util = require('util');
var request = require('request');
var _ = require('underscore');
var utils = require('./utils/utils.js');

module.exports = function (options) {
    options = _.defaults(options || {}, {
        body_parse: true,
        keep_query_string: true,
        proxy_timeout: 3000,
        proxy_methods: ['GET', 'POST', 'PUT', 'DELETE'],
        proxy_rules: []
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

        const res = await requestWrap(opts);
        ctx.body = res;

    };
};

function requestWrap(opt) {
    return new Promise((resolve, reject) => {
        opt.gzip = true;
        request(opt, (error, response) => {
            let status = response && response.statusCode;

            // success
            if (!error && +status === 200) {
                try {
                    let result = response.body;

                    // 如果是json数据, 则解析为对象
                    if (/json/i.test(response.headers['content-type'])) {
                        result = JSON.parse(result);
                    }
                    resolve(result);
                }
                catch (e) {
                    reject();
                }
            } else {
                reject();
            }

        })
    });
}