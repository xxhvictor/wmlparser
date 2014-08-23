//define function
function changeMIME() {
    var listener  = function(details) {
        var headers = details.responseHeaders;
        var hasChangeMime = false;

        //do replace "text/vnd.wap.wml" with "text/html"
        headers.forEach(function(head) {
            if (head && head.name.toLowerCase() == "content-type" && head.value.toLowerCase().substring(0, 16) == "text/vnd.wap.wml") {
                head.value = "text/html";
                hasChangeMime = true
            }
        });

        //prevent the wml source being downloaded
        if (hasChangeMime) {
            headers.forEach(function(head) {
                if (head.name.toLowerCase() == "content-disposition") {
                    head.value = "inline"
                }
            });
        }
        return { responseHeaders: headers };
    };

    var c = chrome.webRequest != undefined ? chrome.webRequest.onHeadersReceived: null;
    if (c != null) {
        c.addListener(listener, {
            urls: ["http://*/*", "https://*/*"]
        },
        ["blocking", "responseHeaders"])
    }
};

//start change
changeMIME();
