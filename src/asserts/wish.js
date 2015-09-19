/**
 * Created by shuding on 9/18/15.
 * <ds303077135@gmail.com>
 */

function Wish(data, $container, sz, callback) {
    this.data         = data;
    this.el           = document.createElement('div');
    this.el.innerText = data.name || '无名氏';
    this.$container   = $container;

    this.x  = Math.random();
    this.y  = Math.random();
    this.dx = (Math.random() - .5) * .002;
    this.dy = (Math.random() - .5) * .002;

    var transformList = ['-webkit-transform', '-moz-transform', '-ms-transform', '-o-transform', 'transform'];

    this.move = function () {
        var self = this;
        transformList.forEach(function (t) {
            self.el.style[t] = 'translateX(' + (self.x * sz.width) + 'px) translateY(' + (self.y * sz.height) + 'px)';
        });
    };

    this.el.onclick = callback;
}

Wish.prototype.play = function () {
    this.$container.append(this.el);

    var self = this;
    var draw = function () {
        self.x += self.dx;
        self.y += self.dy;
        if (self.x < -0.2 || self.x > 1.2) {
            self.dx *= -1;
        }
        if (self.y < -0.2 || self.y > 1.2) {
            self.dy *= -1;
        }

        self.move();
        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
};

Wish.prototype.stop = function () {

};

module.exports = Wish;
