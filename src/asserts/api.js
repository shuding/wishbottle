/**
 * Created by shuding on 9/14/15.
 * <ds303077135@gmail.com>
 */


function parseData(data, params) {
    var ret = {};
    params.forEach(function (param) {
        ret[param] = data[param];
    });
    return ret;
}

var API = function (jQuery) {
    if (!jQuery) {
        throw new Error('JQuery object not found in arguments');
    }

    this.jQuery = jQuery;
    this.jQuery.ajaxSetup({
        contentType: "text/html; charset=unicode",
        dataType: 'json'
    });

    this.domain = 'http://stu.fudan.edu.cn/wish_bottle/api';
    this.path   = {
        post:   '/',
        get:    '/get',
        star:   '/',
        unstar: '/'
    };
};

// Initialization
API.prototype.post = function (data, callback) {
    var pack = parseData(data, ['nickname', 'content']);
    if (!pack.nickname) {
        callback && callback('Nickname should not be empty');
        return;
    }
    if (!pack.content) {
        callback && callback('Content should not be empty');
        return;
    }
    this.jQuery.post(this.domain + this.path.post, pack).success(function (data) {
        callback && callback(null, data);
    });
};

API.prototype.get = function (data, callback) {
    var pack = parseData(data, ['offset']);
    if (typeof pack.offset === "undefined" || pack.offset < 0) {
        pack.offset = 0;
    }
    this.jQuery.get(this.domain + this.path.get, pack).success(function (data) {
        callback && callback(null, data);
    });
};

API.prototype.star = function (data, callback) {
    var pack = parseData(data, ['id']);
    if (typeof pack.id === "undefined") {
        callback && callback('Id must be set');
        return;
    }
    this.jQuery.post(this.domain + this.path.star, pack).success(function (data) {
        callback && callback(null, data);
    });
};

API.prototype.unstar = function (data, callback) {
    var pack = parseData(data, ['id']);
    if (typeof pack.id === "undefined") {
        callback && callback('Id must be set');
        return;
    }
    this.jQuery.post(this.domain + this.path.unstar, pack).success(function (data) {
        callback && callback(null, data);
    });
};

module.exports = API;
