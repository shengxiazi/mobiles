/*页面文档加载完成之后执行*/
$(function () {
    closeAd();
    var audio = document.getElementById('audio');
    $('html').one('touchstart',function(){
        audio.play();
    });
    player();
});
// 弹出广告栏
function closeAd () {
    var bodyBox = document.querySelector(".jd_ad");
    var bodyBox2 = document.querySelector(".jd_ad_box");
    var box = document.querySelector(".mask");
    var btnBox = document.getElementById("btn_close");
    var imgBox = document.getElementById("im");

    alice.tap(btnBox,function () {
        imgBox.style.display = "none";
        bodyBox.removeChild(bodyBox2);
        // window.open("video.html");
    });
}
/*视频播放器*/
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
/*瀑布流 图片资源*/
window.onload = function () {
    flow();
}
function flow() {
        //高度最小的那一行 然后把图片放到那个位置
        var container = document.getElementById("container");
        var boxes = container.children;
       /* 1.找出谁是第一行  计算第一行有多少张*/
        //一行有多少张实际上 就是    页面的宽度 / 盒子的宽度
        var pageWidth = window.innerWidth;
        var boxWidth = boxes[0].offsetWidth;
        var column = Math.floor(pageWidth / boxWidth);
       /* 2.用数组存储 每一列的高度 找出最小值 和最小值的索引*/
        var arrHeight = [];
        //把每一列的初始高度 保存到数组中
        function waterfall() {
            for (var i = 0; i < boxes.length; i++) {
                //先只找出第一行的所有的盒子
                if (i < column) {
                    //把第一行的盒子的高度放到数组中
                    arrHeight[i] = boxes[i].offsetHeight;
                } else {
                    //根据 保存每行高度的数组中的 最小值去摆放
                var minHeight = getMin(arrHeight).value;
                //高度最小的那一列
                var minHeightIndex = getMin(arrHeight).index;
                //要想设置位置 先要加定位
                boxes[i].style.position = "absolute";
                //设置top值 top值就是高度最小的那一列现在的高度
                // boxes[i].style.top = minHeight + "px";
                boxes[i].style.top = (Math.floor(i / 2)) * 100 + "%";
                // boxes[i].style.left = boxes[minHeightIndex].offsetLeft + "px";
                if (i % 2 == 0) {
                    boxes[i].style.left = 0;
                }else {
                     boxes[i].style.left = "50%";
                }
                //放置图片后 当前列的高度发生了变化 我们要对数组的值进行更新
                //然后 后续的循环才能根据新的数组 来重新寻找最小值

                //给数组中之前 数值最小的那一项  加上当前这个图片的高度
                arrHeight[minHeightIndex] = minHeight + boxes[i].offsetHeight;
                }
            }
        }
        waterfall();
       /* 5.判断触底*/
        window.onscroll = function () {
            if (bottomed()) {
                //加载图片
                var json = [
                    {"src": "images/img02.JPG"},
                    {"src": "images/img01.JPG"},
                    {"src": "images/img05.PNG"},
                    {"src": "images/img03.JPG"},
                ];
             /* 6.创建结构  .box > img*/
                for (var i = 0; i < json.length; i++) {
                    var div = document.createElement("div");
                    div.className = "box";
                    container.appendChild(div);
                    var img = document.createElement("img");
                    img.src = json[i].src;
                    div.appendChild(img);
                    //重新加载出来的盒子 样式有问题
                    waterfall();
                }
            }
        };
        function bottomed() {
            //窗口的高度+页面被卷去的头部 > 最后一个盒子的offsetTop
            var clientHeight = window.innerHeight;
            var scrollTop = window.pageYOffset;
            var lastBox = boxes[boxes.length - 1];//最后的盒子
            var lastBoxTop = lastBox.offsetTop;
            //窗口的高度+页面被卷去的头部 > 最后一个盒子的offsetTop
            if (clientHeight + scrollTop > lastBoxTop) {
                return true;//表示触底了
            }
            return false;//没有触底
        }
        function getMin(arr) {
        var min = {};   //存储高度最小的图片
        min.index = 0;     //最小值的索引
        min.value = arr[min.index];   //最小值的值
        //遍历数组 一个一个比较
        for (var i = 0; i < arr.length; i++) {
            if (min.value > arr[i]) {
                min.value = arr[i];
                min.index = i;
            }
        }
        return min;
        }
};
