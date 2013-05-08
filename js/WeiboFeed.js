/**
 * Created by JetBrains WebStorm.
 * User: JKhuang
 * Date: 12-4-23
 * Time: 下午9:21
 * Reference: http://open.weibo.com/wiki/2/statuses/public_timeline
 * To change this template use File | Settings | File Templates.
 */



JQWeibo = {
    user: 'jkhuang23',
    numWeibo: 15,
    appendTo: '#jsWeibo',
    appKey: '82966982',

    loadWeibo: function() {
        $.ajax({
            url: "https://api.weibo.com/2/statuses/public_timeline.json", //"http://api.t.sina.com.cn/statuses/user_timeline.json", //'http://api.t.sina.com.cn/statuses/user_timeline/jkhuang023.json?source=3935721991',
            type: "GET",
            dataType: "jsonp",
            contentType: "application/json",
            data: {
                source: JQWeibo.appKey,
//                screen_name: JQWeibo.user,
                count: JQWeibo.numWeibo
            },
            success: function(json, textStatus, xhr) {
                var html = '<div class="weibo">WEIBO_TEXT<div class="time">AGO</div>';

                // append weibo into page
                for (var i = 0; i < json.data.statuses.length; i++) {
                    $(JQWeibo.appendTo).append(
                        html.replace('WEIBO_TEXT', JQWeibo.ify.clean(json.data.statuses[i].text))
                            .replace(/USER/g, json.data.statuses[i].user.screen_name)
                            .replace('AGO', JQWeibo.timeAgo(json.data.statuses[i].created_at))
                            .replace(/ID/g, json.data.statuses[i].idstr)
                    );
                }
            },
            error: function(result, status) {
                alert(result);
            }
        })
    },

    /**
     * Format date in weibo.
     */
    timeAgo: function(dateString) {
        var rightNow = new Date();
        var then = new Date(dateString);

        if ($.browser.msie) {
            then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
        }

        var diff = rightNow - then;

        var second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7;

        if (isNaN(diff) || diff < 0) {
            return ""; // return blank string if unknown
        }

        if (diff < second * 2) {
            // within 2 seconds
            return "right now";
        }

        if (diff < minute) {
            return Math.floor(diff / second) + " seconds ago";
        }

        if (diff < minute * 2) {
            return "about 1 minute ago";
        }

        if (diff < hour) {
            return Math.floor(diff / minute) + " minutes ago";
        }

        if (diff < hour * 2) {
            return "about 1 hour ago";
        }

        if (diff < day) {
            return  Math.floor(diff / hour) + " hours ago";
        }

        if (diff > day && diff < day * 2) {
            return "yesterday";
        }

        if (diff < day * 365) {
            return Math.floor(diff / day) + " days ago";
        }

        else {
            return "over a year ago";
        }
    },

    addScriptTag: function (src) {
        var script = document.createElement('script');
        script.setAttribute("type", "text/javascript");
        script.src = src;
        document.body.appendChild(script);
    },


    ify:  {
        link: function(weibo) {
            return weibo.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
                var http = m2.match(/w/) ? 'http://' : '';
                return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
            });
        },

        at: function(weibo) {
            return weibo.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
                return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
            });
        },

        list: function(weibo) {
            return weibo.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
                return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
            });
        },

        hash: function(weibo) {
            return weibo.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
                return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
            });
        },

        clean: function(weibo) {
            return this.hash(this.at(this.list(this.link(weibo))));
        }
    } // ify

};


$(document).ready(function() {
    JQWeibo.loadWeibo();
//    JQWeibo.addScriptTag("http://api.t.sina.com.cn/statuses/user_timeline/jkhuang23.json?source=3935721991&screen_name=jkhuang23&callback=myFunction");
})


function createXHR() {
    if (typeof XMLHttpRequest() != "undefined") {
        return new XMLHttpRequest();
    }
    else if (typeof ActiveXObject != "undefined") {
        if (typeof arguments.callee.activeXString != "string") {
            var versions = [
                "MSXML2.XMLHttp6.0",
                "MSXML2.XMLHttp3.0",
                "MSXML2.XMLHttp"];

            for (var i = 0; i < versions.length; i++) {
                try {
                    var xhr = new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    return xhr;
                }
                catch (ex) {

                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        }
        else {
            throw new Error("No XHR object available");
        }

    }
}