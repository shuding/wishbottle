/**
 * Created by shuding on 9/18/15.
 * <ds303077135@gmail.com>
 */

function Wish(data, ctx, sz, callback) {
    this.data       = data;
    this.firstLine  = (data.name || '无名氏');
    this.secondLine = '的祝福';

    this.x  = .5;
    this.y  = 1 - (70 + Math.random() * 10) / sz.height;
    this.dx = (Math.random() * 0.005 - 0.0025);
    this.dy = -Math.random() * 0.0005 - 0.0005;
    this.fy = -0.001;
    this.fx = 0;
    this.r  = 0;

    this.paused   = false;
    this.playing = false;

    var self = this;

    var colors     = ["white", "#FF5959", "#FFB84D", "#78DDFF", "#80FF9F", "#ED74C9"];
    var bottleSize = [5, 100];

    this.color     = colors[~~(Math.random() * 6)];
    this.leftPos   = .5 - bottleSize[0] / sz.width;
    this.rightPos  = .5 + bottleSize[0] / sz.width;
    this.topPos    = 1 - 130 / sz.height;
    this.bottomPos = 1 - 70 / sz.height;

    this.left = function () {
        if (self.y < self.topPos) {
            return false;
        }
        return self.x < self.leftPos;
    };

    this.right = function () {
        if (self.y < self.topPos) {
            return false;
        }
        return self.x > self.rightPos;
    };

    this.bottom = function () {
        return self.y > self.bottomPos;
    };

    this.exit = function () {
        return self.y < -0.1 || self.x < -0.1 || self.x > 1.1;
    };

    this.move = function () {
//        transformList.forEach(function (t) {
//            self.el.style[t] = 'translateX(' + (self.x * sz.width) + 'px) translateY(' + (self.y * sz.height) + 'px)';
//        });

        var x = self.x * sz.width * 2;
        var y = self.y * sz.height * 2;

        ctx.beginPath();
        ctx.arc(x, y, self.r, 0, Math.PI * 2, true);
        ctx.closePath();

        var gradient  = ctx.createRadialGradient(x, y, 0, x, y, self.r);
        gradient.addColorStop(0., 'rgba(255, 255, 255, .7)');
        gradient.addColorStop(.3, 'rgba(255, 255, 255, .4)');
        gradient.addColorStop(1., 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        if (self.r < 60) {
            self.r += 0.3;
        }

        if (self.y < self.topPos) {
            ctx.fillStyle = self.color;
            ctx.font      = "24px sans-serif";
            ctx.fillText(self.firstLine, x - 40, y - 10, 120);
            ctx.fillText(self.secondLine, x - 40, y + 20, 120);
        }
    };

    this.detectClick = function (x, y) {
        if (x > this.x - 50 / sz.width && x < this.x + 50 / sz.width && y > this.y - 50 / sz.height && y < this.y + 50 / sz.height) {
            callback();
            return true;
        }
        return false;
    };
}

Wish.prototype.frame = function () {
    if (this.paused) {
        // Paused
        return;
    }
    if (!this.playing) {
        // Stopped
        return;
    }

    this.dy = this.dy * 9 - this.fy;
    this.dx = this.dx * 9 - this.fx;
    this.dx /= 10;
    this.dy /= 10;

    if (this.left() || this.right()) {
        this.dx *= -1;
        this.fx *= -1;
    }

    if (this.bottom()) {
        this.dy *= -1;
        this.fy *= -1;
    }

    if (this.exit()) {
        this.stop();
    }

    this.x += this.dx;
    this.y += this.dy;

    this.move();
};

Wish.prototype.pause = function () {
    this.paused = true;
};

Wish.prototype.continue = function () {
    this.paused = false;
};

Wish.prototype.play = function () {
    this.playing = true;

    var self = this;

    var randomFySetup = function () {
        if (!self.playing) {
            return;
        }
        if (!self.paused) {
            if (self.y > self.topPos) {
                self.fy = 0.006;
            } else {
                self.fy = self.fy * 5 + (-self.dy / 3) + (Math.random() * .0096 - 0.0036) * 1.2;
            }
            self.fx = self.fx * 5 + (-self.dx / 3) + (Math.random() * .008 - .004) * 1.5;

            self.fx /= 6;
            self.fy /= 6;

            //self.fdx = -self.fdx + (Math.random() * .005);
            //self.dx += self.fdx;
        }
        setTimeout(randomFySetup, Math.random() * 1000);
    };

    setTimeout(randomFySetup, 0);
};

Wish.prototype.stop = function () {
    this.playing = false;

    if (this.stopSetup) {
        this.stopSetup.call(this);
    }
};

Wish.prototype.stopSetup = function (callback) {
    this.stopSetup = callback;
};

module.exports = Wish;
