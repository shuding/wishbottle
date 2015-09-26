/**
 * Created by shuding on 9/12/15.
 * <ds303077135@gmail.com>
 */
(function (window, docuemnt, $, undefined) {
    var el = {};
    var st = {};
    var va = {};

    var dataCache = [];
    var dataQueue = [];
    var queueSt   = 0;
    var queueEd   = 0;
    var queueLn   = 15;

    var playList = [];

    var api = new window.API($);

    function framePlay() {
        el.elCtx.clearRect(0, 0, va.width * 2, va.height * 2);
        playList.forEach(function (arr) {
            if (arr.length) {
                arr[1].call(arr[0]);
            }
        });
        requestAnimationFrame(framePlay);
    }

    function pauseAnimation() {
        playList.forEach(function (arr) {
            if (arr.length) {
                arr[0].pause();
            }
        });
    }

    function continueAnimation() {
        playList.forEach(function (arr) {
            if (arr.length) {
                arr[0].continue();
            }
        });
    }

    function canvasClick(x, y) {
        for (var i = 0; i < playList.length; ++i) {
            if (playList[i].length) {
                if (playList[i][0].detectClick(x, y)) {
                    return;
                }
            }
        }
    }

    function addCache(data) {
        [].forEach.call(data, function (item) {
            if (typeof dataCache[item._id] === 'undefined') {
                dataCache[item._id] = true;
                var wish            = new window.Wish(item, el.elCtx, va, function () {
                    editorCompile(item);
                    editorShow();
                });
                dataQueue.push(wish);
            }
        });
    }

    function queuePush(callback) {
        api.get({
            offset: queueEd
        }, function (err, data) {
            if (!err) {
                addCache(data);
            }
            callback && callback(err);
        });
    }

    function queueInit() {
        var stop = function () {
            for (var i = 0; i < playList.length; ++i) {
                if (playList[i][0] == this) {
                    playList[i] = [];
                }
            }
            if (queueEd < dataQueue.length) {
                dataQueue[queueEd].play();
                dataQueue[queueEd].stopSetup(stop);
                playList.push([dataQueue[queueEd], dataQueue[queueEd].frame]);
                queueEd++;
            } else {
                queuePush(stop);
            }
        };

        queuePush(function (err) {
            if (!err) {
                var cnt = 0;
                while (queueEd - queueSt < queueLn) {
                    if (queueEd < dataQueue.length) {
                        (function (index, cnt) {
                            setTimeout(function () {
                                dataQueue[index].stopSetup(stop);
                                dataQueue[index].play();
                                playList.push([dataQueue[index], dataQueue[index].frame]);
                            }, cnt * 1500);
                        })(queueEd, cnt);
                        queueEd++;
                        cnt++;
                    } else {
                        queueInit();
                        break;
                    }
                }
            }
        });
    }

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
            element.width  = va.width * 2;
            element.height = va.height * 2;
            va.elements.push(element);
        };
        $(window).on('resize', function () {
            va.width  = window.innerWidth;
            va.height = window.innerHeight;
            va.elements && va.elements.forEach(function (element) {
                element.width  = va.width * 2;
                element.height = va.height * 2;
            });
        });

        //el.$container.addClass('gradient-' + (~~(Math.random() * 5)));

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
        el.$canvasElements   = $('#canvas-elements');
        el.$canvasBackground = $('#canvas-background');
        el.bgCtx             = el.$canvasBackground[0].getContext('2d');
        el.elCtx             = el.$canvasElements[0].getContext('2d');
        va.bindSize(el.$canvasBackground[0]);
        va.bindSize(el.$canvasElements[0]);

        el.$canvasElements.click(function (event) {
            canvasClick(event.pageX / va.width, event.pageY / va.height);
        });

        var fireflies = [];
        for (var i = 0; i < 30; ++i) {
            fireflies.push(new window.Firefly(i / 30));
        }

        var drawFrame = function () {
            el.bgCtx.clearRect(0, 0, va.width * 2, va.height * 2);
            fireflies.forEach(function (ff) {
                ff.blink();
                ff.move();
                ff.draw(el.bgCtx, va.width * 2, va.height * 2);
            });
            requestAnimationFrame(drawFrame);
        };

        drawFrame();
    }

    function editorLock(name) {
        el.$editorHeading.text((name || '无名氏') + ' 说：');
        el.$editorBox.addClass('submitted');
        el.$editorBox.find('input').attr('disabled', 'disabled');
        el.$editorBox.find('textarea').attr('disabled', 'disabled');
    }

    function editorUnlock() {
        el.$editorHeading.text('写下你的祝福');
        el.$editorBox.removeClass('submitted');
        el.$editorBox.find('input').attr('disabled', null);
        el.$editorBox.find('textarea').attr('disabled', null);
        el.$editorBox.find('input').val('');
        el.$editorBox.find('textarea').val('');
    }

    function editorShow() {
        el.$container.addClass('scaled');
        el.$editor.addClass('expanded');
        st.canvasBackgroundScaled = true;
        pauseAnimation();
    }

    function editorHide() {
        setTimeout(editorUnlock, 1000);
        el.$container.removeClass('scaled');
        el.$editor.removeClass('expanded');
        st.canvasBackgroundScaled = false;
        window.location.hash      = '';
        continueAnimation();

        // Reset share
        wx.onMenuShareTimeline({
            title:   '旦愿: 写下你的祝福 | 中秋，复旦人心在一起',
            link:    window.location.href.split('#')[0],
            imgUrl:  'http://stu.fudan.edu.cn/wish_bottle/static/stu_icon.png',
            success: function () {
                alert('分享成功!');
            },
            cancel:  function () {
            }
        });
    }

    function editorInit() {
        el.$editorBox       = $('#editor-box');
        el.$editorHeading   = el.$editorBox.find('h3');
        el.$buttonClose     = $('#button-close');
        el.$buttonSubmit    = $('#button-submit');
        el.$buttonShare     = $('#button-share');
        el.$buttonContainer = $('#button-container');

        el.$buttonClose.click(function () {
            editorHide();
        });
        el.$editor.click(function (event) {
            if ([].indexOf.call(event.originalEvent.path, el.$editorBox[0]) == -1) {
                editorHide();
                event.preventDefault();
            }
        });

        el.$buttonSubmit.click(function () {
            // TODO: get data
            var data = {
                name:    el.$editorBox.find('input').val(),
                content: el.$editorBox.find('textarea').val()
            };

            api.post(data, function (err, res) {
                if (err) {
                    alert(err);
                } else {
                    editorLock(data.name);
                    try {
                        var r                = JSON.parse(res);
                        window.location.hash = r._id;

                        history.pushState({}, title + '的祝福', "index.html" + '?id=' + r._id);
                        var url              = window.location.href.split('#')[0];

                        wx.onMenuShareTimeline({
                            title:   '旦愿: ' + title + ' 的祝福 | 中秋，复旦人心在一起',
                            link:    url,
                            imgUrl:  'http://stu.fudan.edu.cn/wish_bottle/static/stu_icon.png',
                            success: function () {
                                alert('分享成功!');
                            },
                            cancel:  function () {
                            }
                        });

                    } catch (err) {
                    }
                }
            });
        });
    }

    function editorCompile(data) {
        el.$editorBox.find('input').val(data.name);
        el.$editorBox.find('textarea').val(data.content);
        el.$editorBox.find('p').text(moment(new Date(data.timestamp)).format('lll'));
        window.location.hash = data._id;
        editorLock(data.name);

        var _id   = data._id;
        var title = data.name;

        history.pushState({}, title + '的祝福', "index.html" + '?id=' + _id);
        var url   = window.location.href.split('#')[0];

        wx.onMenuShareTimeline({
            title:   '旦愿: ' + title + ' 的祝福 | 中秋，复旦人心在一起',
            link:    url,
            imgUrl:  'http://stu.fudan.edu.cn/wish_bottle/static/stu_icon.png',
            success: function () {
                alert('分享成功!');
            },
            cancel:  function () {
            }
        });
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
        /*
         if (window.DeviceOrientationEvent) {
         window.addEventListener('deviceorientation', function (event) {
         var x = Math.floor(event.beta);
         var y = Math.floor(event.gamma);
         el.$canvas.css({
         'margin-left': y + 'px',
         'margin-top':  x + 'px'
         });
         });
         }*/
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

        var hash = '';

        if (window.location.hash) {
            hash = window.location.hash.split('#')[1];
        }
        if (!hash) {
            if (window.location.search) {
                var k = window.location.search.split('?')[1].split('&');
                for (var i = 0; i < k.length; ++i) {
                    if (k[i].split('=')[0] == 'id') {
                        hash = k[i].split('=')[1];
                        break;
                    }
                }
            }
        }

        if (!hash) {
            return;
        }

        api.get({
            type: '_id',
            _id:  hash
        }, function (err, data) {
            if (err) {
                alert(err);
            } else {
                addCache(data);
                editorCompile(data[0]);
                editorShow();
            }
        });
    }

    function init() {
        backgroundMusicInit();
        backgroundMusicPlay();
        touchmovePrevent();
        modernizrInit(function () {
            // Canvas valid

            var url = window.location.href.split('#')[0];

            api.signature({
                url: url
            }, function (err, data) {
                data = JSON.parse(data);
                wx.config({
                    debug:     true,
                    appId:     data.appId,
                    timestamp: data.timestamp,
                    nonceStr:  data.nonceStr,
                    signature: data.signature,
                    jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage']
                });
                wx.ready(function () {
                    wx.onMenuShareAppMessage({
                        title:   '旦愿: 写下你的祝福',
                        desc:    '中秋，复旦人心在一起',
                        link:    '',
                        imgUrl:  'http://stu.fudan.edu.cn/wish_bottle/static/stu_icon.png',
                        success: function () {
                        },
                        cancel:  function () {
                        }
                    });

                    wx.onMenuShareTimeline({
                        title:   '旦愿: 写下你的祝福 | 中秋，复旦人心在一起',
                        link:    window.location.href.split('#')[0],
                        imgUrl:  'http://stu.fudan.edu.cn/wish_bottle/static/stu_icon.png',
                        success: function () {
                            alert('分享成功!');
                        },
                        cancel:  function () {
                        }
                    });

                });

                backgroundCanvasInit();
                bottleInit();
                editorInit();
                orientationInit();
                queueInit();
                framePlay();

                detectHash();
            });
        });
    }

    init();

})(window, document, jQuery);
