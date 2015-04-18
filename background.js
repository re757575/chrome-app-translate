
function onClickHandler(info, tab) {
    console.log(info);
    var q = info.selectionText;
    if (info.menuItemId === 'child1') {
		console.log("中翻英");
		chrome.tabs.create(translate(q, 'zh-TW', 'en'));
    } else if (info.menuItemId === 'child2') {
		console.log("英翻中");
		chrome.tabs.create(translate(q, 'en', 'zh-TW'));
    } else {
		console.log("語音轉換");
        sayByTTS(q, function(){
            sayByGoogle(q);
        });
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
            // TTS APi 發生錯誤,則執行google的語音發音
            document.getElementById('say').remove();
            callback();
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

// TODO google語音發音 一次最多99個字元(包含空白),超出範圍會 404
function sayByGoogle(s) {
    var beforeSay = document.getElementById('say');

    if (s && beforeSay == null) {
        var audio = document.createElement('audio');

        audio.addEventListener('error', function(e){
            switch (e.target.error.code) {
                case e.target.error.MEDIA_ERR_ABORTED:
                    alert('You aborted the video playback.');
                    break;
                case e.target.error.MEDIA_ERR_NETWORK:
                    alert('A network error caused the audio download to fail.');
                    break;
                case e.target.error.MEDIA_ERR_DECODE:
                    alert('The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.');
                    break;
                case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    alert('The video audio not be loaded, either because the server or network failed or because the format is not supported.');
                    break;
                default:
                    alert('An unknown error occurred.');
                    break;
            }
        }, true);

        audio.src = "https://translate.google.com.tw/translate_tts?ie=UTF-8&tl=en&q=" + encodeURIComponent(s);
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
		"title": "語音轉換",
		"parentId": "parent",
		"id": "child3",
		contexts: ['selection']
	});
});