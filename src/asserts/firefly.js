/**
 * Created by shuding on 9/13/15.
 * <ds303077135@gmail.com>
 */

var Firefly = function (p) {
    var M = Math;

    this.x  = M.random();
    this.y  = M.random();
    this.r  = p;
    this.o  = 0;
    this.dx = (M.random() - .5) * .005;
    this.dy = (M.random() - .5) * .005;
    this.dr = (M.random() * 0.02 + 0.01);

    this.blink = function () {
        this.r += this.dr;
        this.o  = 1 / (this.r + .5) - 0.6;

        if (this.r > 1 || this.r < 0) {
            this.dr *= -1;
        }
    };

    this.move = function () {
        this.x += this.dx * this.o;
        this.y += this.dy * this.o;
        if (this.x > 1.1 || this.x < -.1) {
            this.dx *= -1;
        }
        if (this.y > 1.1 || this.y < -.1) {
            this.dy *= -1;
        }
    };

    this.draw = function (ctx, width, height) {
        var x = this.x * width;
        var y = this.y * height;
        var r = M.max(this.r * 6, 0);

        ctx.beginPath();
        ctx.arc(x, y, r, 0, M.PI * 2, true);
        ctx.closePath();

        var gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0., 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(.5, 'rgba(255, 255, 255, .4)');
        gradient.addColorStop(1., 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
    };
};

module.exports = Firefly;
