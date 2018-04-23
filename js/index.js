$('.topbar-button').addEventListener('click',function () {
    $('.aside').classList.add('block')
},false)


$('.aside .close').onclick = function () {
    $('.aside.block').classList.remove('block')
}

var musicList = []
var currentIndex = 0
var audio = new Audio()
audio.autoplay = true
getMusicList(function (list) {
    musicList = list
    console.log(list)  //数据到来后的处理
    loadMusic(list[currentIndex])
    generateList(list)
})

audio.ontimeupdate = function () {
//			console.log(this.currentTime)
    $('.musicbox .progress-now').style.width = (this.currentTime/this.duration)*100+'%'
//			var min = Math.floor(this.currentTime/60)
//			var sec = Math.floor(this.currentTime%60) + ''
//			sec = sec.length === 2? sec : '0'+sec
//			$('.musicbox .time').innerText = min + ':' + sec
}
audio.onplay = function () {
    clock = setInterval(function () {
        var min = Math.floor(audio.currentTime/60)
        var sec = Math.floor(audio.currentTime%60)+''
        sec = sec.length === 2? sec : '0'+sec
        var mins = Math.floor(audio.duration/60)
        var secs = Math.floor(audio.duration%60)+''
        secs = secs.length === 2? secs : '0'+secs
        $('.musicbox .time').innerText = min + ':' + sec + '/' + mins +  ':' +secs
    },1000)
}
audio.onpause = function () {
    clearInterval(clock)
}
audio.onended = function () {
    currentIndex = (++currentIndex)%musicList.length
    loadMusic(musicList[currentIndex])
}

audio.onvolumechange = function () {
    $('.musicbox .sound-now').style.width = (audio.volume)*100+'%'
    $('.musicbox .soundlevel').innerText = Math.floor((audio.volume)*10) + '/10'
}

$('.musicbox .play').onclick = function () {
    if (audio.paused){
        audio.play()
        this.querySelector('.iconfont').classList.remove('icon-bofang')
        this.querySelector('.iconfont').classList.add('icon-zanting')
    }else{
        audio.pause()
        this.querySelector('.iconfont').classList.remove('icon-zanting')
        this.querySelector('.iconfont').classList.add('icon-bofang')
    }
}
$('.musicbox .forward').onclick = function () {
    currentIndex = (++currentIndex)%musicList.length
    loadMusic(musicList[currentIndex])
}
$('.musicbox .back').onclick = function () {
    currentIndex = (musicList.length+(--currentIndex))%musicList.length
    loadMusic(musicList[currentIndex])
}
$('.musicbox .bar').onclick = function (e) {
    var percent = e.offsetX / parseInt(getComputedStyle(this).width)
    audio.currentTime = audio.duration * percent
}
audio.volume = 0.2
$('.musicbox .sound').onclick = function (e) {
    var percent = e.offsetX / parseInt(getComputedStyle(this).width)
    audio.volume = percent
}

function $(selector) {
    return document.querySelector(selector)
}
function getMusicList(callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET','./js/music.json',true)
    xhr.onload = function(){
        if((xhr.status >= 200 && xhr.status < 300 ) || xhr.status === 304){
            callback(JSON.parse(this.responseText))  //callback函数的参数是响应的数据
        }else{
            console.log('数据获取失败')
        }
    }
    xhr.error = function () {
        console.log('网络异常')
    }
    xhr.send()
}

function loadMusic(musicObj){
    console.log('begin play',musicObj)
    $('.musicbox .title').innerText = musicObj.title
    $('.musicbox .author').innerText = musicObj.author
    //$('.cover').style.backgroundImage = 'url(' + musicObj.img + ')'
    audio.src = musicObj.src
}
function generateList(list){
    for(let j=0;j<list.length;j++){
        var lists = document.createElement('li')
        lists.innerText = list[j].title
        lists.setAttribute('sub',j)
        $('.list').appendChild(lists)
    }
}
$('.aside .list').addEventListener('click',function (e) {
    if(e.target.tagName.toLowerCase() === 'li'){
        getMusicList(function (list) {
            musicList = list
            loadMusic(list[e.target.getAttribute('sub')])
        })
    }
})
