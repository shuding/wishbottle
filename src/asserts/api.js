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
        dataType:    'json'
    });

    this.domain = 'http://stu.fudan.edu.cn/wish_bottle/api';
    this.path   = {
        post:      '/post',
        get:       '/get',
        star:      '/star',
        unstar:    '/unstar',
        signature: '/ticket_server/get_signature'
    };
};

// Initialization
API.prototype.post = function (data, callback) {
    var pack = parseData(data, ['name', 'content']);
    if (!pack.name) {
        callback && callback('Nickname should not be empty');
        return;
    }
    if (!pack.content) {
        callback && callback('Content should not be empty');
        return;
    }
    pack.type      = 'time';
    pack.timestamp = (new Date()).getTime();
    this.jQuery.ajax({
        type:        'POST',
        url:         this.domain + this.path.post,
        contentType: 'application/json; charset=utf-8',
        dataType:    'json',
        data:        JSON.stringify(pack),
        complete:    function (jqXHR) {
            if (jqXHR.readyState === 4) {
                callback && callback(null, jqXHR.responseText);
            }
        }
    });
};

API.prototype.get = function (data, callback) {
    var pack = parseData(data, ['offset', 'type', '_id']);
    if (typeof pack.offset === "undefined" || pack.offset < 0) {
        pack.offset = 0;
    }
    if (typeof pack.type === 'undefined') {
        pack.type = 'time';
    }
    pack.timestamp = (new Date()).getTime();
    this.jQuery.get(this.domain + this.path.get, pack).success(function (data) {
        callback && callback(null, data.response);
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

API.prototype.signature = function (data, callback) {
    var pack = parseData(data, ['url']);
    this.jQuery.ajax({
        type:        'POST',
        url:         this.domain + this.path.signature,
        contentType: 'application/json; charset=utf-8',
        dataType:    'json',
        data:        JSON.stringify(pack),
        complete:    function (jqXHR) {
            if (jqXHR.readyState === 4) {
                callback && callback(null, jqXHR.responseText);
            }
        }
    });
};

module.exports = API;
