
// 入口函数  页面加载完成
window.onload = function  () {
    closeAd();
    remRespond();
    getTime();
    search();
    banner();
    downTime();
}

// rem适配
function remRespond () {
        // 获取根元素
         var html = document.getElementsByTagName('html')[0];
         // 获取屏幕的宽度
         var width = window.innerWidth;
         // console.log(width);
         // 设置缩放比
         var fontSize = 100 / 640 * width;
         // 判断屏幕宽度是否超过640px 如果超过 则设置一个固定值
         if (width <= 640 && width >= 320) {
            html.style.fontSize = fontSize + "px";
         }else {
            html.style.fontSize = "100px";
         }
}
// 窗体大小发生改变
window.onresize = function  () {
        remRespond();
}

// 弹出广告栏
function closeAd () {
    var bodyBox = document.querySelector(".jd_ad");
    var bodyBox2 = document.querySelector(".jd_ad_box");
    var btnBox = document.getElementById("btn_close");
    var imgBox = document.getElementById("im");
    /*获取弹出框*/
    var win = document.querySelector('.jd_win');
    /*盒子*/
    var box = win.querySelector('.jd_win_box');
    var cancelBox = win.querySelector('.cancel');

    alice.tap(btnBox,function () {
        imgBox.style.display = "none";
        bodyBox.removeChild(bodyBox2);
        /*显示弹出层*/
        win.style.display = "block";
        /*加动画*/
        box.className = "jd_win_box bounceInDown";
        // window.open("video.html");
    });
    alice.tap(cancelBox,function () {
        win.style.display = "none";
    });
}

// 顶部时间
function getTime () {
    //找对象
    var m_time = document.querySelector(".center");
    var spans = m_time.querySelectorAll("span");

    //实现计时功能
    var timer = setInterval(function () {
        // 获取当前时间
        var time = new Date();
        var hour = time.getHours();
        var minute = time.getMinutes();

        // 填充内容
        // 计算十位数
        spans[0].innerHTML = Math.floor(hour / 10);
        //计算个位数
        spans[1].innerHTML = hour % 10;
        spans[3].innerHTML = Math.floor(minute / 10);
        spans[4].innerHTML = minute % 10;

        if(hour < 12) {
            spans[5].innerHTML = "上午";
        }
    },1000);

}

// 头部搜索功能
function search () {
    // 1.滚动页面时，背景颜色渐变
    // 2.滚动到一定距离时，背景色不变
    // 3.背景色渐变的程度与背景色不变    和滚动距离有关

    // 需要操作的dom
    var searchBox = document.querySelector(".header_box");
    // var searchBox = document.querySelector(".header_box");
    var bannerBox = document.querySelector(".jd_banner");
    var height = bannerBox.offsetHeight;
    // 监听滚动事件  不断观察当前滚动距离是否大于轮播图的高度
    window.onscroll = function  (e) {
        var top = document.body.scrollTop;
        var opacity = 0;
        if(top < height) {
            opacity = 0.85 * (top / height);
        }
        else {
             opacity = 0.85;
        }
        searchBox.style.background = "rgba(201,21,35,"+opacity+")";
    }
}

// 轮播图功能
function banner () {

    // 1.自动轮播
    // 2.小圆点随着图片轮播做改变  对应当前的图片的位置
    // 3.图片可以滑动
    // 4.当滑动的距离不超过一定的距离的时候  可以吸附回去
    // 5.当滑动的距离超过了一定的距离的时候  图片进行相应的滚动  向左或向右
    // 6.一定的距离  就是1/3的图片的宽度

    // 需要操作的dom
    var bannerBox = document.querySelector(".jd_banner");
    // 图片的宽度
    var width = bannerBox.offsetWidth;
    var imageBox = bannerBox.querySelector("ul:first-child");
    var circleBox = bannerBox.querySelector("ul:last-child");
    var circles = circleBox.querySelectorAll("li");

    // 公用方法
    // 添加过渡
    var addTransition = function  (argument) {
        imageBox.style.webkitTransition = "all .2s";
        imageBox.style.transition = "all .2s";
    };
    // 删除过渡
    var removeTransition = function  (argument) {
    imageBox.style.webkitTransition = "none";
    imageBox.style.transition = "none";
    };
    // 设置定位
    var setTranslateX = function  (x) {
    imageBox.style.webkitTransform = "translateX("+x+"px)";
    imageBox.style.transform = "translateX("+x+"px)";
    };

    // 1.自动轮播
    // 当前默认的索引
    var index = 1;
    var timer = setInterval(function(){
        index ++ ;
        // 图片动画轮播
        addTransition();
        /*设置图片当前的位置 */
        setTranslateX(-index*width);
    },3000);
    // 无缝滚动
    // 如果索引是 9  需要瞬间定位到  第一张图片
    // 如果索引是 0  需要瞬间定位到  第八张图片
    // 每一次过度结束都会触发*/
    alice.transitionEnd(imageBox,function(){
        if(index >= 9) {
            // 瞬间定位
            index = 1;
            /*删除过渡*/
            removeTransition();
            // 设置定位
            setTranslateX(-index * width);
        }
        else if(index <= 0) {
            index = 8;
            removeTransition();
            setTranslateX(-index * width);
        }
        /*设置当前的点*/
        setCircle();
    });

    // 2.小圆点随着图片轮播做改变  对应当前的图片的位置
    var setCircle = function(i){
        /*删除当前样式*/
        for(var i = 0 ; i < circles.length ; i ++){
            circles[i].className = " ";
        }
        /*在动画结束的时候设置*/
        /*index已经重置过了*/
        circles[index-1].className = "now";
    };

    // 3.图片可以滑动
    // 触摸点坐标
    var startX = 0;
    var moveX = 0;
    var distanceX = 0;
    // 是否滑动的标记   节流阀
    var isMove = false;
    // 监听触摸事件
    imageBox.addEventListener("touchstart",function  (e) {
        clearInterval(timer);
        startX = e.touches[0].clientX;
    });
    imageBox.addEventListener("touchmove",function  (e) {
        isMove = true;
        moveX = e.touches[0].clientX;
        distanceX = moveX - startX ;
        // 在滑动的过程中不断的定位触摸点    图片的定位和滑动的距离
        removeTransition();
        setTranslateX(-index * width + distanceX);
    });
    //在谷歌模拟器会出现  touchend的时候可能会丢失事件
    window.addEventListener("touchend",function  (e) {

    // 4.当滑动的距离不超过一定的距离的时候  可以吸附回去
    // 5.当滑动的距离超过了一定的距离的时候  图片进行相应的滚动  向左或向右
    // 6.一定的距离  就是1/3的图片的宽度
        if(Math.abs(distanceX) > (width / 3) && isMove) {
            // 判断上一张还是下一张
            if(distanceX > 0) {
                // 向右滑动
                index--;
            }else {
                index++;
            }
            // 动画还原 当前索引
            addTransition();
            setTranslateX(-index * width);
        }
        else {
            addTransition();
            setTranslateX(-index * width);
        }

        // 重置参数  不影响第二次计算
        startX = 0;
        moveX = 0;
        distanceX = 0;
        isMove = false;
        //离开屏幕 清除定时器
        clearInterval(timer);
        timer = setInterval(function  (argument) {
            index++;
            // 继续让图片自动动画轮播
            addTransition();
            setTranslateX(-index * width);
        },3000);
    });
}

// 倒计时
function downTime () {

    // 1.获取需要倒计时的时间    5小时  04 59 59
    // 2.每隔一秒  计算当前的时间格式
    // 3.渲染在页面当中

    // 倒计时的时间 单位 秒
    var time = 5 * 60 * 60;

    // 需要操作的dom
    var skTime = document.querySelector(".sk_time");
    var spans = skTime.querySelectorAll("span");

    var timer = setInterval(function  (argument) {
        time--;
        // 时间不能为负值
        if(time < 0) {
            clearInterval(timer);
            return false;
        }
        else {
            // 格式化时间
            var h = Math.floor(time / 3600);
            var m = Math.floor((time % 3600) / 60);
            var s = time % 60;
            spans[0].innerHTML =  Math.floor(h / 10);
            spans[1].innerHTML =  h % 10;
            spans[3].innerHTML =  Math.floor(m / 10);
            spans[4].innerHTML =  m % 10;
            spans[6].innerHTML =  Math.floor(s / 10);
            spans[7].innerHTML =  s % 10;
        }
    },1000)
}