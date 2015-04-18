
function onClickHandler(info, tab) {
    console.log(info);
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
        sayByGoogle(q,'en');
    } else if (info.menuItemId === 'child5') {
        console.log("Google 國語語音 轉換");
        sayByGoogle(q,'zh-TW');
    }
}

function translate(q, s, t) {
	var q = encodeURIComponent(q);
	var url = "https://script.google.com/macros/s/AKfycbzVbbioKRcPimW2ZGN0kAEZKgDSqV2bZ44GIr6HDvQOy4lcpeM/exec?q="+q+"&source="+s+"&target="+t;
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

        audio.addEventListener('error', function (e){

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
        });

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

function sayByGoogle(q,tl) {

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
            return 0;
        }

        // 移除先前的
        var beforeSay = document.getElementById('say');
        if (beforeSay !== null) {
            beforeSay.pause();
            beforeSay.currentTime = 0;
            beforeSay.remove();
        }

        var audio = document.createElement('audio');

        audio.addEventListener('error', function (e){

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
        });

        audio.src = "https://translate.google.com.tw/translate_tts?ie=UTF-8&tl="+tl+"&q=" + encodeURIComponent(q);
        var canPlayMP3 = (typeof audio.canPlayType === "function" && audio.canPlayType('audio/mpeg'));
        if (canPlayMP3) {
            audio.id = 'say';
            document.body.appendChild(audio);
            audio.load();
            audio.play();
        }
    }
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
        "title": "Google小姐-國語發音",
        "parentId": "parent",
        "id": "child5",
        contexts: ['selection']
    });

});