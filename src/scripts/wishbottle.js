/**
 * Created by shuding on 9/12/15.
 * <ds303077135@gmail.com>
 */
(function (window, docuemnt, $, undefined) {
    var el = {};
    var st = {};
    var va = {};

    function modernizrInit(callback) {
        el.$copyright = $('#copyright');
        el.$container = $('#container');

        if (window.devicePixelRatio >= 2.0) {
            el.$copyright.find('img').attr('src', 'stu_logo@2x.png');
        }
        va.width    = window.innerWidth;
        va.height   = window.innerHeight;
        va.bindSize = function (element) {
            if (typeof va.elements === 'undefined') {
                va.elements = [];
            }
            element.width = va.width;
            element.height = va.height;
            va.elements.push(element);
        };
        $(window).on('resize', function () {
            va.width  = window.innerWidth;
            va.height = window.innerHeight;
            va.elements && va.elements.forEach(function (element) {
                element.width = va.width;
                element.height = va.height;
            });
        });

        el.$container.addClass('gradient-' + (~~(Math.random() * 5)));

        if (window.Modernizr.canvas) {
            callback();
        }
    }

    function backgroundMusicInit() {
        el.$bgMusic    = $('#bg-music');
        el.$muteButton = $('#mute-button');

        el.$bgMusic.on('play', function () {
            st.bgMusicPlay = true;
            el.$muteButton.find('i').html('&#xE050;');
        }).on('pause', function () {
            st.bgMusicPlay = false;
            el.$muteButton.find('i').html('&#xE04F;');
        });

        el.$muteButton.click(function () {
            if (st.bgMusicPlay) {
                backgroundMusicMute();
            } else {
                backgroundMusicPlay();
            }
        });
    }

    function backgroundMusicPlay() {
        el.$bgMusic[0].play();
    }

    function backgroundMusicMute() {
        el.$bgMusic[0].pause();
    }

    function backgroundCanvasInit() {
        el.$canvasBackground = $('#canvas-background');
        el.bgCtx             = el.$canvasBackground[0].getContext('2d');
        va.bindSize(el.$canvasBackground[0]);

        var fireflies = [];
        for (var i = 0; i < 30; ++i) {
            fireflies.push(new window.Firefly(i / 30));
        }

        var drawFrame = function () {
            el.bgCtx.clearRect(0, 0, va.width, va.height);
            fireflies.forEach(function (ff) {
                ff.blink();
                ff.move();
                ff.draw(el.bgCtx, va.width, va.height);
            });
            requestAnimationFrame(drawFrame);
        };

        drawFrame();
    }

    function init() {
        backgroundMusicInit();
        backgroundMusicPlay();
        modernizrInit(function () {
            // Canvas valid
            backgroundCanvasInit();
        });
    }

    init();

})(window, document, jQuery);
