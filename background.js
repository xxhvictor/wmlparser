(function() {
    var c = chrome.webRequest != undefined ? chrome.webRequest.onHeadersReceived: null,
    a = function() {
        var d = function(f) {
            var h = f.responseHeaders,
            g = false;
            h.forEach(function(i) {
                if (i && i.name.toLowerCase() == "content-type" && i.value.toLowerCase().substring(0, 16) == "text/vnd.wap.wml") {
                    i.value = "text/html";
                    g = true
                }
            });
            if (g) {
                h.forEach(function(i) {
                    if (i.name.toLowerCase() == "content-disposition") {
                        i.value = "inline"
                    }
                })
            }
            return {
                responseHeaders: h
            }
        };
        return d
    };
    if (c != null) {
        c.addListener(a(), {
            urls: ["http://*/*", "https://*/*"]
        },
        ["blocking", "responseHeaders"])
    }
    } ());
