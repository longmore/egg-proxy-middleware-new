/*
 * @Author: zhangrongmou
 * @Date: 2018-08-02 22:05:16
 * @Last Modified by: zhangrongmou
 * @Last Modified time: 2018-08-02 22:05:48
 */

var assert = require('assert');
var util = require('util');
var _ = require('underscore');
var parse = require('co-body');
var multipart = require('./multipart');

exports.mergeSafeUrl = function (origin, addition) {
    switch (true) {
        case origin.endsWith('/') && addition.startsWith('/'):
            return origin + addition.slice(1);
            break;
        case !origin.endsWith('/') && !addition.startsWith('/'):
            return origin + '/' + addition;
            break;
        default:
            return origin + addition;
    }
};

exports.resolvePath = function (path, rules) {
    assert.ok(util.isArray(rules), 'Array Rules Required');
    var result = _.find(rules, function (rule) {
        return util.isRegExp(rule.proxy_location) ? rule.proxy_location.test(path) : rule.proxy_location === path;
    })
        , microServiceReg = /^\/(\w+)(\/?.*)$/
        , location;

    if (!result) return false;

    location = result.proxy_pass.replace(/^https?:\/\//, '');
    if (location.indexOf('/') !== -1 && !result.proxy_merge_mode) return result.proxy_pass;
    if (result.proxy_micro_service && microServiceReg.test(path)) path = microServiceReg.exec(path)[2];

    return this.mergeSafeUrl(result.proxy_pass, path);
};

exports.shouldSkipNext = function (self, options) {
    return !this.resolvePath(self.path, options.proxy_rules) || options.proxy_methods.indexOf(self.method) === -1
};

exports.shouldParseBody = function (self, options) {
    return !self.request.body && options.body_parse
};

exports.resolveBody = function (req) {
    return parse(req);
};

exports.execParseBody = function (self, debug) {
    if (_.isString(self.is('json', 'text', 'urlencoded'))) return !debug ? parse(self) : 'co-body';
    if (_.isString(self.is('multipart'))) return !debug ? multipart(self.req) : 'multipart';
    return {};
};

exports.configRequestOptions = function (self, options) {
    var opts = {
        method: self.method,
        url: this.resolvePath(self.path, options.proxy_rules),
        headers: self.header,
        qs: !!options.keep_query_string ? self.query : {}
    };

    switch (true) {
        case _.isEmpty(self.request.body):
            break;
        case self.is('urlencoded') === 'urlencoded':
            opts.form = self.request.body;
            break;
        case self.is('multipart') === 'multipart':
            opts.formData = self.request.body;
            break;
        default:
            opts.body = self.request.body;
            opts.json = self.is('json') === 'json'
    }
    return opts;
};
