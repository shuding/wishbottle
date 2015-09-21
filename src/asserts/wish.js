/**
 * Created by shuding on 9/18/15.
 * <ds303077135@gmail.com>
 */

function Wish(data, $container, sz, callback) {
    this.data         = data;
    this.el           = document.createElement('div');
    this.el.innerText = (data.name || '无名氏');
    this.el.innerHTML += '<br>的祝福';

    var i = document.createElement('i');

    i.style['left'] = ~~(Math.random() * 40 + 10) + 'px';
    i.style['top']  = ~~(Math.random() * 40 + 10) + 'px';

    this.el.appendChild(i);

    this.$container = $container;

    this.x  = .5;
    this.y  = 1 - 100 / sz.height;
    this.dx = (Math.random() * 0.005 - 0.0025);
    this.dy = -Math.random() * 0.0005;
    this.fy = 0;
    this.fx = 0;

    this.hover   = false;
    this.playing = false;

    var self = this;

    var colors        = ["white", "#FF5959", "#FFB84D", "#78DDFF", "#80FF9F", "#ED74C9"];
    var transformList = ['-webkit-transform', '-moz-transform', '-ms-transform', '-o-transform', 'transform'];
    var bottleSize    = [10, 190];

    this.color     = colors[~~(Math.random() * 6)];
    this.leftPos   = .5 - bottleSize[0] / sz.width;
    this.rightPos  = .5 + bottleSize[0] / sz.width;
    this.topPos    = 1 - 200 / sz.height;
    this.bottomPos = 1 - 80 / sz.height;

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
        return self.y < -0.1;
    };

    this.move = function () {
        transformList.forEach(function (t) {
            self.el.style[t] = 'translateX(' + (self.x * sz.width) + 'px) translateY(' + (self.y * sz.height) + 'px)';
        });
        self.el.style['color'] = (!self.left() && !self.right() && self.y > self.topPos) ? 'transparent' : self.color;
    };

    this.el.onmouseover = function () {
        self.hover = true;
    };

    this.el.onmouseout = function () {
        self.hover = false;
    };

    this.el.onclick = function () {
        callback();
    };
}

Wish.prototype.frame = function () {
    if (this.hover) {
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

Wish.prototype.play = function () {
    this.$container.append(this.el);
    this.playing = true;

    var self = this;

    var randomFySetup = function () {
        if (!self.playing) {
            return;
        }
        if (!self.hover) {
            self.fy = self.fy * 5 + (-self.dy / 3) + (Math.random() * .002 - 0.0009);
            self.fx = self.fx * 5 + (-self.dx / 3) + (Math.random() * .002 - .001);

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
        this.stopSetup();
    }
};

Wish.prototype.stopSetup = function (callback) {
    this.stopSetup = callback;
};

module.exports = Wish;
