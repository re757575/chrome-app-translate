
function onClickHandler(info, tab) {
    console.log(info);
    if (info.menuItemId === 'child1') {
		console.log("中翻英");
		var q = info.selectionText;
		chrome.tabs.create({
			"url" : "https://script.google.com/macros/s/AKfycbzVbbioKRcPimW2ZGN0kAEZKgDSqV2bZ44GIr6HDvQOy4lcpeM/exec?q="+q+"&source=zh-TW&target=en"
		});
    } else if (info.menuItemId === 'child2') {
		console.log("英翻中");
		var q = info.selectionText;
		chrome.tabs.create({
			//"url" : "https://translate.google.com.tw/?hl=zh-TW&tab=wT#en/zh-TW/" + st
			"url" : "https://script.google.com/macros/s/AKfycbzVbbioKRcPimW2ZGN0kAEZKgDSqV2bZ44GIr6HDvQOy4lcpeM/exec?q="+q+"&source=en&target=zh-TW"
		});
    } else {
		console.log("語音轉換");
		var q = info.selectionText;
		say(q);
    }
}

function say(s) {
	if (s) {
		// 移除先前的
		var beforeSay = document.getElementById('say');
		if (beforeSay !== null) {
			beforeSay.pause();
			beforeSay.currentTime = 0;
			beforeSay.remove();
		}

		var audio = document.createElement('audio');
		audio.src = "http://tts-api.com/tts.mp3?q=" + encodeURIComponent(s);
		var canPlayMP3 = (typeof audio.canPlayType === "function" && audio.canPlayType('audio/mpeg'));
		if (canPlayMP3) {
			audio.id = 'say';
			document.body.appendChild(audio);
			audio.load();
			audio.play();
		}
	}
};

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