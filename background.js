var playCount, replay;

function onClickHandler(info, tab) {
    console.log(info);
    playCount = 0;
    var q = info.selectionText;
    if (info.menuItemId === 'child1') {
		console.log("中翻英");
		chrome.tabs.create(translate(q, 'zh-TW', 'en'));
    } else if (info.menuItemId === 'child2') {
		console.log("英翻中");
		chrome.tabs.create(translate(q, 'en', 'zh-TW'));
    } else if (info.menuItemId === 'child3') {
		console.log("TTS API 英語語音 轉換");
        sayByTTS(q);
    } else if (info.menuItemId === 'child4') {
        console.log("Google 英語語音 轉換");
        sayByGoogle(q,'en','normal');
    } else if (info.menuItemId === 'child5') {
        console.log("Google 英語語音(慢速) 轉換 *5");
        sayByGoogle(q,'en','slow');
    } else if (info.menuItemId === 'child6') {
        console.log("Google 國語語音 轉換");
        sayByGoogle(q,'zh-TW');
    }
}

function translate(q, s, t) {
	var q = encodeURIComponent(q);
	//var url = "https://script.google.com/macros/s/AKfycbzVbbioKRcPimW2ZGN0kAEZKgDSqV2bZ44GIr6HDvQOy4lcpeM/exec?q="+q+"&source="+s+"&target="+t;
    var url = String.format("https://translate.google.com.tw/#{0}/{1}/{2}", s, t, q);
	return {'url' : url};
}

function sayByTTS(s, callback) {
	if (s) {
		// 移除先前的
		var beforeSay = document.getElementById('say');
		if (beforeSay !== null) {
			beforeSay.pause();
			beforeSay.currentTime = 0;
			beforeSay.remove();
		}

		var audio = document.createElement('audio');

        audio.addEventListener('error', audioError);

		audio.src = "http://tts-api.com/tts.mp3?q=" + encodeURIComponent(s);
		var canPlayMP3 = (typeof audio.canPlayType === "function" && audio.canPlayType('audio/mpeg'));
		if (canPlayMP3) {
			audio.id = 'say';
			document.body.appendChild(audio);
            audio.load();
            audio.play();
		}
	}
}

function sayByGoogle(q, tl, speed) {

    if (q) {

        // var temp = '';
        // for (var i = 0; i < q.length; i++) {
        //     var ch = q.substr(i,1);
        //     if (ch.haveChinese()) {
        //         temp += ch;
        //     }
        // }

        var textlen = q.length;
        // google語音發音 一次最多100個字(包含空白),超出範圍會 404
        if ( textlen > 100) {
            alert('超出範圍');
            return false;
        }

        // 移除先前的
        var beforeSay = document.getElementById('say');
        if (beforeSay !== null) {
            beforeSay.pause();
            beforeSay.currentTime = 0;
            beforeSay.remove();
        }

        // 語音速率
        var ttsspeed = 1;
        if (speed === 'slow') {
            ttsspeed = 0.24;
            replay = 5;
        }

        var audio = document.createElement('audio');

        audio.addEventListener('error', audioError);

        audio.addEventListener('ended', function() {
            playCount++;
            // 循環播放
            if (replay > 0 && (playCount < replay)) {
                audio.play();
            }
        });

        audio.src = "https://translate.google.com.tw/translate_tts?ie=UTF-8&tl="+tl+"&q=" + encodeURIComponent(q) + '&ttsspeed=' + ttsspeed;
        var canPlayMP3 = (typeof audio.canPlayType === "function" && audio.canPlayType('audio/mpeg'));
        if (canPlayMP3) {
            audio.id = 'say';
            document.body.appendChild(audio);
            audio.load();
            audio.play();
        }
    }
}

function sayBySiri(q,tl) {

    // 移除先前的
    var beforeSay = document.getElementById('say');
    if (beforeSay !== null) {
        beforeSay.pause();
        beforeSay.currentTime = 0;
        beforeSay.remove();
    }

    var request = new XMLHttpRequest();
    var url = 'https://montanaflynn-text-to-speech.p.mashape.com/speak?text='+q;
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            console.log(request);

            var blobURL = window.URL.createObjectURL(request.response);

            var audio = document.createElement('audio');

            audio.addEventListener('error', audioError);

            audio.src = blobURL;
            var canPlayMP3 = (typeof audio.canPlayType === "function" && audio.canPlayType('audio/mpeg'));
            if (canPlayMP3) {
                audio.id = 'say';
                document.body.appendChild(audio);
                audio.load();
                audio.play();
            }
        }
    }
    request.open("GET", url, true);
    request.setRequestHeader("X-Mashape-Key", "aghfoB5ARumshraXxyE8R4xh3RhHp10gcATjsnJKXIqMenhqZZAlex");
    request.responseType = 'blob';
    request.send();
}

function audioError(e) {
    switch (e.target.error.code) {
        case e.target.error.MEDIA_ERR_ABORTED:
            errorMsg = 'You aborted the video playback.';
            break;
        case e.target.error.MEDIA_ERR_NETWORK:
            errorMsg = 'A network error caused the audio download to fail.';
            break;
        case e.target.error.MEDIA_ERR_DECODE:
            errorMsg = 'The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.';
            break;
        case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'The video audio not be loaded, either because the server or network failed or because the format is not supported.';
            break;
        default:
            errorMsg = 'An unknown error occurred.';
            break;
    }
    alert(errorMsg);
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// 檢查是否有中文
﻿String.prototype.haveChinese = function() {
    return this.search(RegExp("[一-" + String.fromCharCode(40869) + "]")) > -1;
};

// 佔位符號
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
    };
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function (details) {

    chrome.contextMenus.create({
        type: 'normal',
        title: '翻譯 %s!',
        id: 'parent',
        contexts: ['selection']
    }, function () {
        console.log('contextMenus are create.');
    });

	chrome.contextMenus.create({
		"title": "英翻中",
		"parentId": "parent",
		"id": "child2",
		contexts: ['selection']
	});

	chrome.contextMenus.create({
		"title": "中翻英",
		"parentId": "parent",
		"id": "child1",
		contexts: ['selection']
	});

    chrome.contextMenus.create({
        "title": "TTS-英語發音",
        "parentId": "parent",
        "id": "child3",
        contexts: ['selection']
    });

    chrome.contextMenus.create({
        "title": "Google小姐-英語發音",
        "parentId": "parent",
        "id": "child4",
        contexts: ['selection']
    });

    chrome.contextMenus.create({
        "title": "Google小姐-英語發音(慢速) *5",
        "parentId": "parent",
        "id": "child5",
        contexts: ['selection']
    });

    chrome.contextMenus.create({
        "title": "Google小姐-國語發音",
        "parentId": "parent",
        "id": "child6",
        contexts: ['selection']
    });

});
