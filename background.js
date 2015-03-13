
function onClickHandler(info, tab) {
    console.log(info);
    if (info.menuItemId === 'child1') {
		console.log("中翻英");
		var q = info.selectionText;
		chrome.tabs.create({
			"url" : "https://script.google.com/macros/s/AKfycbzVbbioKRcPimW2ZGN0kAEZKgDSqV2bZ44GIr6HDvQOy4lcpeM/exec?q="+q+"&source=zh-TW&target=en"
		});
    } else {
		console.log("英翻中");
		var q = info.selectionText;
		chrome.tabs.create({
			//"url" : "https://translate.google.com.tw/?hl=zh-TW&tab=wT#en/zh-TW/" + st
			"url" : "https://script.google.com/macros/s/AKfycbzVbbioKRcPimW2ZGN0kAEZKgDSqV2bZ44GIr6HDvQOy4lcpeM/exec?q="+q+"&source=en&target=zh-TW"
		});
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
});