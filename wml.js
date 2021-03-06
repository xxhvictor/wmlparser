String.prototype.trim = function() {
    return this.replace(/^\s*/, "").replace(/\s*$/, "")
};
Element.prototype.getParam = function(c, a, e) {
    a = typeof a !== "undefined" ? a: '([^"]*)';
    e = typeof e !== "undefined" ? e: "";
    var d = new RegExp(c + '="' + a + '"', "i");
    var b = new RegExp("(" + c + '="|")', "gi");
    var f = this.outerHTML.match(d);
    if (f == null) {
        f = e
    } else {
        f = f[0].replace(b, "")
    }
    this[c] = f;
    return f
};
Element.prototype.getMethod = function() {
    return this.getParam("method", "(get|post)", "get")
};
Element.prototype.getHref = function() {
    return this.getParam("href")
};
Element.prototype.getValue = function() {
    if (this.value) {
        return this.value
    }
    return this.getParam("value")
};
Element.prototype.getFirstChild = function() {
    var a = this.childNodes[0];
    if (a.textContent.trim() == this.textContent.trim()) {
        a = this.childNodes[1]
    }
    return a
};
url = "about:blank";
var wmlMain = function() {
    var e = {};
    var j = {};
    function g(y) {
        var t = y.replace(/(\$|\(|\))/g, "");
        if (e[t]) {
            return e[t]
        }
        var q = JSON.parse(k("wml_vars") || "{}");
        if (q[t]) {
            return q[t]
        }
        var s = -1;
        if ((s = t.indexOf(":")) != -1) {
            t = t.substring(0, s)
        }
        var w = document.getElementsByName(t);
        for (var r = w.length - 1; r >= 0; r--) {
            if (w[r].tagName.toLowerCase() == "select") {
                var u = [];
                var o = w[r].getElementsByTagName("option");
                for (var p = 0; p < o.length; p++) {
                    if (o[p].selected) {
                        u.push(o[p].getValue())
                    }
                }
                return u.join(";")
            }
            if (w[r].getValue() != undefined && w[r].getValue().charAt(0) != "$" && w[r].getValue() != "") {
                return w[r].getValue()
            }
        }
        return null
    }
    function a(o, q) {
        e[o] = q;
        var p = JSON.parse(k("wml_vars") || "{}");
        p[o] = q;
        m("wml_vars", JSON.stringify(p), 1)
    }
    function k(p) {
        var q = document.cookie;
        var r = q.indexOf(" " + p + "=");
        if (r == -1) {
            r = q.indexOf(p + "=")
        }
        if (r == -1) {
            q = null
        } else {
            r = q.indexOf("=", r) + 1;
            var o = q.indexOf(";", r);
            if (o == -1) {
                o = q.length
            }
            q = unescape(q.substring(r, o))
        }
        return q
    }
    function m(o, r, p) {
        var s = new Date();
        s.setDate(s.getDate() + p);
        var q = escape(r) + ((p == null) ? "": "; expires=" + s.toUTCString());
        document.cookie = o + "=" + q
    }
    var d = function() {
        var p = document.getElementsByTagName("card");
        var D = true;
        for (z = 0; z < p.length; z++) {
            if (p[z].title) {
                p[z].innerHTML = '<b class="wml_title">' + p[z].title + "</b>" + p[z].innerHTML;
                p[z].title = ""
            }
            if (window.timer = p[z].getParam("ontimer")) {
                var F = p[z].getElementsByTagName("timer")[0].getValue() * 100;
                setTimeout(function() {
                    location.href = timer
                },
                F)
            }
            if (D) {
                D = false;
                j = p[z]
            } else {
                p[z].style.display = "none"
            }
        }
        var s = document.getElementsByTagName("refresh");
        for (z = 0; z < s.length; z++) {
            var E = s[z].getElementsByTagName("setvar");
            for (var x = 0; x < E.length; x++) {
                a(E[x].getParam("name"), E[x].getParam("value"))
            }
        }
        var A = document.getElementsByTagName("input");
        for (z = 0; z < A.length; z++) {
            var q;
            if (!A[z].getValue() && (q = g(A[z].getParam("name")))) {
                A[z].value = q
            }
            A[z].onkeyup = function() {
                a(this.getParam("name"), this.value)
            }
        }
        var o = document.getElementsByTagName("anchor");
        var C = null;
        for (z = 0; z < o.length; z++) {
            C = o[z].getFirstChild();
            if (C != "") {
                var w = function() {
                    alert(this.textContent)
                };
                if (C.tagName.toLowerCase() == "prev") {
                    o[z].onclick = function() {
                        parent.history.back()
                    }
                }
                if (C.tagName.toLowerCase() == "go") {
                    var v = C.getMethod();
                    var B = C.getHref();
                    if (v == "get") {
                        if (C.childNodes == null || C.childNodes.length == 0) {
                            o[z].onclick = function() {
                                location.href = this.getFirstChild().getHref().replace(/&amp;/g, "&")
                            }
                        } else {
                            o[z].onclick = function() {
                                f(this.getFirstChild())
                            }
                        }
                    } else {
                        if (v == "post") {
                            o[z].onclick = function() {
                                h(this.getFirstChild())
                            }
                        } else {
                            o[z].onclick = function() {
                                console.log("Error 102: " + v)
                            }
                        }
                    }
                }
            }
        }
        var u = document.getElementsByTagName("a");
        for (var z = 0; z < u.length; z++) {
            if (u[z].href.indexOf("$") != -1) {
                u[z].onclick = function() {
                    l(this)
                }
            }
        }
        var r = document.getElementsByTagName("do");
        for (var z = 0; z < r.length; z++) {
            r[z].getParam("label");
            var y = document.createTextNode(r[z].label);
            r[z].appendChild(y);
            var C = r[z].getFirstChild();
            if (C != "") {
                var w = function() {
                    console.log("Error 101: " + this.textContent)
                };
                if (C.tagName.toLowerCase() == "prev") {
                    w = function() {
                        parent.history.back()
                    }
                }
                if (C.tagName.toLowerCase() == "go") {
                    var v = C.getMethod();
                    var B = C.getHref();
                    if (v == "get") {
                        if (C.childNodes == null || C.childNodes.length == 0) {
                            w = function() {
                                location.href = this.getFirstChild().getHref().replace(/&amp;/gi, "&")
                            }
                        } else {
                            w = function() {
                                f(this.getFirstChild())
                            }
                        }
                    } else {
                        if (v == "post") {
                            w = function() {
                                h(this.getFirstChild())
                            }
                        } else {
                            w = function() {
                                console.log("Error 202: " + v)
                            }
                        }
                    }
                }
                r[z].onclick = w
            }
        }
    };
    if (document.doctype && document.doctype.name && document.doctype.name.toLowerCase() == "wml") {
        d()
    }
    var l = function(o) {
        var s = o.href.match(/\$\([a-z0-9_:]+\)/gi);
        var r = o.href.match(/\$[^& <">.;]+/gi);
        if (r) {
            s.concat(r)
        }
        var p = {};
        for (var q = 0; q < s.length; q++) {
            o.href = o.href.replace(s[q], g(s[q]))
        }
    };
    var n = function(o) {
        return o.getElementsByTagName("postfield")
    };
    var i = function(o) {
        return o.getElementsByTagName("setvar")
    };
    var f = function(t) {
        t.innerHTML = t.innerHTML.replace("</postfield>", "").replace(">", "></postfield>");
        var w = n(t);
        var p = i(t);
        if (p) {
            for (var o = 0; o < p.length; o++) {
                q = p[o].getParam("name");
                u = p[o].getParam("value");
                a(q, u)
            }
        }
        var s = t.getHref().replace(/&amp;/gi, "&");
        if (s.indexOf("?") == -1) {
            s += "?"
        }
        if (s.indexOf("?") != s.length - 1) {
            s += "&"
        }
        for (var r = 0; r < w.length; r++) {
            var q = w[r].getParam("name");
            var u = w[r].getParam("value");
            if (u.charAt(0) == "$") {
                u = g(u)
            }
            if (r > 0) {
                s += "&"
            }
            s += q + "=" + u
        }
        location.href = s;
        return false
    };
    function h(r) {
        r.innerHTML = r.innerHTML.replace(/<\/postfield>/gi, "").replace(/>/gi, "></postfield>");
        var t = n(r);
        var q = r.getHref();
        var u = '<form action="' + r.href + '" method="post" id="dynform">';
        for (var p = 0; p < t.length; p++) {
            if (t[p] instanceof Element) {
                var o = t[p].getParam("name");
                var s = t[p].getParam("value");
                if (s.charAt(0) == "$") {
                    s = g(s)
                }
                u += '<input type="hidden" name="' + o + '" value="' + s + '"/>'
            }
        }
        u += "</form>";
        r.outerHTML += u;
        document.getElementById("dynform").submit();
        return false
    }
    var c = function(p) {
        var o;
        if (typeof p == "undefined") {
            p = "#";
            o = {
                id: "#"
            }
        } else {
            o = b(p)
        }
        var s = document.getElementById(o.id.substring(1));
        if (o.id == "#") {
            s = document.getElementsByTagName("card")[0]
        }
        if (s) {
            j = s;
            var r = document.getElementsByTagName("card");
            for (var q = 0; q < r.length; q++) {
                r[q].style.display = "none"
            }
            s.style.display = "block"
        }
    };
    function b(o) {
        var p = o.substring(o.indexOf("#"));
        var q = -1;
        var r = {
            status: "ok"
        };
        if ((q = p.indexOf("?")) != -1) {
            var u = p.substring(q + 1);
            p = p.substring(0, q);
            if (u) {
                var x = {};
                var w = u.split("&");
                for (var s = 0; s < w.length; s++) {
                    var t = w[s].split("=");
                    x[t[0]] = t[1]
                }
                r.vars = x
            }
        }
        r.id = p;
        return r
    }
    chrome.extension.onMessage.addListener(function(q, p, o) {
        alert("work")
        if (q.url.indexOf("#") != -1) {
            var r = c(url = q.url)
        } else {
            c()
        }
        if (q.vars) {
            setVars(i)
        }
    })
};
document.addEventListener("DOMContentLoaded", wmlMain, false);
