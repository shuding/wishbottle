/**
 * Created by shuding on 9/18/15.
 * <ds303077135@gmail.com>
 */

function wish (data) {
    this.data = data;
    this.el = document.createElement('div');

    return this.el;
}

wish.prototype.play = function () {

};

wish.prototype.stop = function () {

};

module.exports = wish;
