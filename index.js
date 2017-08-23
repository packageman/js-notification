"use strict"

//桌面提醒  
function notify(title, content) {  
          
    if(!title && !content){  
        title = "桌面提醒";  
        content = "您看到此条信息桌面提醒设置成功";  
    }  
    var iconUrl = "images/send_ok.png";  
      
    if (window.webkitNotifications) {  
        //chrome老版本  
        if (window.webkitNotifications.checkPermission() == 0) {  
            var notif = window.webkitNotifications.createNotification(iconUrl, title, content);  
            notif.display = function() {}  
            notif.onerror = function() {}  
            notif.onclose = function() {}  
            notif.onclick = function() {this.cancel();}  
            notif.replaceId = 'Meteoric';  
            notif.show();  
        } else {  
            window.webkitNotifications.requestPermission($jy.notify);  
        }  
    }  
    else if("Notification" in window){  
        // 判断是否有权限  
        if (Notification.permission === "granted") {
            var notification = new Notification(title, {  
                "icon": iconUrl,  
                "body": content,  
            });  
        }  
        //如果没权限，则请求权限  
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function(permission) {  
                // Whatever the user answers, we make sure we store the  
                // information  
                Notification.requestPermission(function (status) {
                  if (Notification.permission !== status) {
                    Notification.permission = status;
                  }
                }); 
                //如果接受请求  
                if (permission === "granted") {  
                    var notification = new Notification(title, {  
                        "icon": iconUrl,  
                        "body": content,  
                    });  
                }  
            });  
        }  
    }  
}

$(document).ready(function(){
    $(".btn").click(function(){
        notify()
    })

    var introDiv = $('.intro-content');

    introDiv.scroll(function(event) {
        $('.intro-spec').text('');
        $('.intro-spec').append("height: " + $(this).height() + "<br/>");
        $('.intro-spec').append("scrollTop-jquery: " + $(this).scrollTop() + "<br/>");
        $('.intro-spec').append("scrollTop: " + $(this)[0].scrollTop + "<br/>");
        $('.intro-spec').append("scrollHeight: " + $(this)[0].scrollHeight + "<br/>");
        $('.intro-spec').append("clientHeight: " + $(this)[0].clientHeight + "<br/>");    
    })

    $(window).resize(function(event) {
        $('.intro-spec').text('');
        $('.intro-spec').append("height: " + $('.intro-content').height() + "<br/>");
        $('.intro-spec').append("scrollTop-jquery: " + $('.intro-content').scrollTop() + "<br/>");
        $('.intro-spec').append("scrollTop: " + $('.intro-content')[0].scrollTop + "<br/>");
        $('.intro-spec').append("scrollHeight: " + $('.intro-content')[0].scrollHeight + "<br/>");
        $('.intro-spec').append("clientHeight: " + $('.intro-content')[0].clientHeight + "<br/>");    
    })

    introDiv.click(function(event) {
        var scrollTop = $(this)[0].scrollTop;
        var scrollHeight = $(this)[0].scrollHeight;
        var clientHeight = $(this)[0].clientHeight;

        if (scrollHeight - clientHeight - scrollTop == 0) {
            alert("到底了");
        } else if (scrollHeight - clientHeight - scrollTop < 20) {
            alert("快到底了");
        }
    })
    
})

