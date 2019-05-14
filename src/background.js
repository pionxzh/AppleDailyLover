'use strict';

chrome.runtime.onInstalled.addListener(function(){
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'appledaily.com'}})
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }])
    })
})

/*
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        console.log(details)
        console.log(details.requestBody)
        fetch(details.url).then(res => {
            return res.text()
        }).then(content => {
            console.log(content)
            content = content.text().replace(/effects\(.{0,15}\)/g, '')
            // return { redirectUrl: 'data:text/javascript,' + encodeURIComponent(content) }
            return { redirectUrl: 'data:text/html,' + encodeURIComponent(content) }
        })
    },
    { urls: ['*://*.appledaily.com/new/*'] }, ['requestBody'])
*/

/*
chrome.webNavigation.onCompleted.addListener(function(details) {
    chrome.tabs.executeScript(details.tabId, {
        file: 'replace.js'
    })
}, {
    url: [{
        hostContains: 'appledaily.com'
    }]
})
*/
