/**
 * Created by shuding on 9/14/15.
 * <ds303077135@gmail.com>
 */

var API = function (jQuery) {
    if (!jQuery) {
        throw new Error('JQuery object not found in arguments');
    }

    this.domain = 'http://example.com';
    this.path = {
        post: '/',
        get: '/',
        star: '/',
        unstar: '/'
    };

    function parseData (data, params) {
        var ret = {};
        params.forEach(function (param) {
            ret[param] = data[param];
        });
        return ret;
    }

    // Initialization
    this.post = function (data, callback) {
        var pack = parseData(data, ['nickname', 'content']);
        if (!pack.nickname) {
            callback && callback('Nickname should not be empty');
            return;
        }
        if (!pack.content) {
            callback && callback('Content should not be empty');
            return;
        }
        jQuery.post(this.domain + this.path.post, pack).success(function (data) {
            callback && callback(null, data);
        });
    };

    this.get = function (data, callback) {
        var pack = parseData(data, ['offset']);
        if (typeof pack.offset === "undefined" || pack.offset < 0) {
            pack.offset = 0;
        }
        jQuery.get(this.domain + this.path.get, pack).success(function (data) {
            callback && callback(null, data);
        });
    };

    this.star = function (data, callback) {
        var pack = parseData(data, ['id']);
        if (typeof pack.id === "undefined") {
            callback && callback('Id must be set');
            return;
        }
        jQuery.post(this.domain + this.path.star, pack).success(function (data) {
            callback && callback(null, data);
        });
    };

    this.unstar = function (data, callback) {
        var pack = parseData(data, ['id']);
        if (typeof pack.id === "undefined") {
            callback && callback('Id must be set');
            return;
        }
        jQuery.post(this.domain + this.path.unstar, pack).success(function (data) {
            callback && callback(null, data);
        });
    };
};

module.exports = API;
