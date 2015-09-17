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
            element.width  = va.width;
            element.height = va.height;
            va.elements.push(element);
        };
        $(window).on('resize', function () {
            va.width  = window.innerWidth;
            va.height = window.innerHeight;
            va.elements && va.elements.forEach(function (element) {
                element.width  = va.width;
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

    function editorShow() {
        el.$canvasBackground.addClass('scaled');
        el.$editor.addClass('expanded');
        st.canvasBackgroundScaled = true;
    }

    function editorHide() {
        el.$canvasBackground.removeClass('scaled');
        el.$editor.removeClass('expanded');
        st.canvasBackgroundScaled = false;
    }

    function editorInit() {
        el.$buttonClose = $('#button-close');
        el.$buttonSubmit = $('#button-submit');
        el.$buttonShare = $('#button-share');

        el.$buttonClose.click(function () {
            editorHide();
        });
        el.$editor.click(function (event) {
            // TODO: bug with the classList
            console.log(event);
            if ([].indexOf.call(event.target.classList, 'editor-box') == -1) {
                editorHide();
                event.preventDefault();
            }
        });

        el.$buttonSubmit.click(function () {
            // TODO: get data
            var data;
            window.API.post(data, function (err) {
                if (err) {
                    // TODO: handle error
                } else {
                    // TODO: submit success
                }
            });
        });

        el.$buttonShare.click(function () {
            // TODO: share using wechat API
        });
    }

    function editorCompile(data) {
        // TODO
    }

    function bottleInit() {
        el.$bottle = $('#bottle');
        el.$editor = $('#editor');

        el.$bottle.click(function () {
            if (st.canvasBackgroundScaled) {
                editorHide();
            } else {
                editorShow();
            }
        });
    }

    function orientationInit() {
        el.$canvas = $('#canvas');

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function (event) {
                var x = Math.floor(event.beta);
                var y = Math.floor(event.gamma);
                el.$canvas.css({
                    'margin-left': y + 'px',
                    'margin-top':  x + 'px'
                });
            });
        }
    }

    function touchmovePrevent() {
        $('body').on('touchmove', function (event) {
            event.preventDefault();
        });
        $('textarea').on('blur', function () {
            $('body').scrollTop(0); // Wechat auto-scrolling hack
        });
        $('input').on('blur', function () {
            $('body').scrollTop(0); // Wechat auto-scrolling hack
        });
    }

    function detectHash() {
        var hash = window.location.hash;
        if (hash && hash !== '#') {
            try {
                hash = Number(hash.split('#')[0]);
            } catch (err) {
                return;
            }
        } else {
            return;
        }

        window.API.get({
            id: hash
        }, function (err, data) {
            if (err) {
                // TODO: handle error
            } else {
                // TODO: display data
            }
        });
    }

    function init() {
        backgroundMusicInit();
        backgroundMusicPlay();
        touchmovePrevent();
        modernizrInit(function () {
            // Canvas valid
            backgroundCanvasInit();
            bottleInit();
            editorInit();
            orientationInit();

            detectHash();
        });
    }

    init();

})(window, document, jQuery);
