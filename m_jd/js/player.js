// 页面文档加载完成之后执行
$(function () {
    player();
})

// 视频播放器
function player () {
    // 初始化
    var video = $('video')[0],
        // 播放进度条
        line = $('.line'),
        // 当前时间
        current = $('.current'),
        // 时分秒
        h, m, s;

    // 当视频可以播放时
    video.oncanplay = function () {
        video.style.display = 'block';
        h = Math.floor(video.duration / 3600)
        m = Math.floor(video.duration / 60);
        s = Math.floor(video.duration % 60);

        // 小于10时拼接字符串0
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        // 总共多少时间
        $('.total').text(h + ':' + m + ':' + s);
    }

    // 播放/暂停
    $('.switch').on('click', function () {
        // 切换状态
        $(this).toggleClass('fa-pause fa-play');

        // 切换状态
        if(video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // 播放进度
    video.ontimeupdate = function () {

        var value = 0;

        if (video.currentTime > 0) {
            value = video.currentTime / video.duration * 100;
        }
        line.css('width', value + '%');
        h = Math.floor(video.currentTime / 3600)
        m = Math.floor(video.currentTime / 60);
        s = Math.floor(video.currentTime % 60);
        // 小于10时拼接字符串0
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;

        // 时间进度
        current.text(h + ':' + m + ':' + s);
    }
    // 跳跃播放
    $('.bar').on('click', function (ev) {
        video.currentTime = (ev.offsetX / $(this).width()) * video.duration;
    });

    // 播放完毕
    video.onended = function () {
        // 切换状态
        $('.switch').removeClass('fa-pause').addClass('fa-play');
        // 进度条为0
        line.css('width', 0);
        // 时间还原
        current.text('00:00:00');
        // 播放时间还原
        video.currentTime = 0;
    }
    // 全屏
    $('.expand').on('click', function () {
        video.webkitRequestFullScreen();
    });
}
