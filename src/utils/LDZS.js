// 常用方法
import Axios from "axios";
import url from "@build/api";
var shareConfig = {};
export default {
  shareObj: "",
  //到某一个时间的倒计时 动态倒计时需要自己添加定时器
  //getEndTime('2017/7/22 16:0:0')
  //result："剩余时间6天 2小时 28 分钟20 秒"
  getEndTime: function getEndTime(endTime) {
    var startDate = new Date(); //开始时间，当前时间
    //var endDate = new Date(endTime); //结束时间，需传入时间参数
    var endDate = endTime * 1000; //结束时间，需传入时间参数
    var t = endDate.getTime() - startDate.getTime(); //时间差的毫秒数
    var d = 0,
      h = 0,
      m = 0,
      s = 0;
    if (t >= 0) {
      d = Math.floor(t / 1000 / 3600 / 24);
      h = Math.floor((t / 1000 / 60 / 60) % 24);
      m = Math.floor((t / 1000 / 60) % 60);
      s = Math.floor((t / 1000) % 60);
    }
    return (
      "\u5269\u4F59\u65F6\u95F4" +
      d +
      "\u5929" +
      h +
      "\u5C0F\u65F6" +
      m +
      "\u5206\u949F" +
      s +
      '\u79D2"'
    );
  },

  downTime: function getEndTime(endTime) {
    // 参数为秒
    var endDate = endTime * 1000; //结束时间，需传入时间参数
    var t = endDate //时间差的毫秒数
    var d = 0,
      h = 0,
      m = 0,
      s = 0;
    if (t >= 0) {
      h = Math.floor((t / 1000 / 60 / 60) % 24);
      m = Math.floor((t / 1000 / 60) % 60);
      s = Math.floor((t / 1000) % 60);
      if(h<10){
        h="0"+h
      }
      if(m<10){
        m="0"+m
      }
      if(s<10){
        s="0"+s
      }
    }
    console.log()
    return h + ":" + m + ":" + s + "";
  },
  getTime: function getEndTime(endTime) {
    var startDate = new Date(); //开始时间，当前时间
    var endDate = new Date(endTime); //结束时间，需传入时间参数
    var t = endDate.getTime() - startDate.getTime(); //时间差的毫秒数
    var d = 0,
      h = 0,
      m = 0,
      s = 0;
    if (t >= 0) {
      d = Math.floor(t / 1000 / 3600 / 24);
      h = Math.floor((t / 1000 / 60 / 60) % 24);
      m = Math.floor((t / 1000 / 60) % 60);
      s = Math.floor((t / 1000) % 60);
    }
    return (
      "\u5269\u4F59\u65F6\u95F4" +
      d +
      "\u5929" +
      h +
      "\u5C0F\u65F6" +
      m +
      "\u5206\u949F" +
      s +
      '\u79D2"'
    );
  },
  //设置url参数
  //setUrlPrmt({'a':1,'b':2})
  //result：a=1&b=2
  setUrlPrmt: function setUrlPrmt(obj) {
    var _rs = [];
    for (var p in obj) {
      if (obj[p] != null && obj[p] != "") {
        _rs.push(p + "=" + obj[p]);
      }
    }
    return _rs.join("&");
  },
  //获取url参数 默认url是当前页面的url
  //getUrlPrmt('segmentfault.com/write?draftId=122000011938')
  //result：Object{draftId: "122000011938"}
  getUrlPrmt: function getUrlPrmt(url) {
    url = url ? url : window.location.href;
    var _pa = url.substring(url.indexOf("?") + 1),
      _arrS = _pa.split("&"),
      _rs = {};
    for (var i = 0, _len = _arrS.length; i < _len; i++) {
      var pos = _arrS[i].indexOf("=");
      if (pos == -1) {
        continue;
      }
      var name = _arrS[i].substring(0, pos),
        value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
      _rs[name] = value;
    }
    return _rs;
  },
  //手机类型判断 参数是要判断的类型型号
  browserInfo: function browserInfo(type) {
    switch (type) {
      case "android":
        return navigator.userAgent.toLowerCase().indexOf("android") !== -1;
      case "iphone":
        return navigator.userAgent.toLowerCase().indexOf("iphone") !== -1;
      case "ipad":
        return navigator.userAgent.toLowerCase().indexOf("ipad") !== -1;
      case "weixin":
        return (
          navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1
        );
      default:
        return navigator.userAgent.toLowerCase();
    }
  },

  //  和原生的沟通交互

  // 复制邀请码  uid 为用户的id 复制文本
  codeInvCode: function(uid) {
    window.WebViewJavascriptBridge.callHandler("copyText", uid, function(
      response
    ) {});
  },
  // 分享  type： 分享类型  shareWxhy 分享到微信  shareQhy 分享QQ
  shareWx: function(type) {
    if (!shareConfig.share_url) {
      Axios.get(
        url.returnUrl() +
          "/wap/user/getShareConfig?" +
          window.location.search.split("?")[1]
      ).then(res => {
        if (res.data.status == 1) {
          shareConfig = res.data.data;
          let options = {
            url: shareConfig.share_url,
            thumb: shareConfig.thumb,
            title: shareConfig.title,
            description: shareConfig.description,
            share_way: 1,
            share_way_wechat: 1
          };
          window.WebViewJavascriptBridge.callHandler(type, options);
        } else {
          console.log("获取分享数据错误");
        }
      });
      console.log("调取微信分享" + type);
    } else {
      let options = {
        url: shareConfig.share_url,
        thumb: shareConfig.thumb,
        title: shareConfig.title,
        description: shareConfig.description,
        share_way: 1,
        share_way_wechat: 1
      };
      window.WebViewJavascriptBridge.callHandler(type, options);
      console.log("调取微信分享" + type);
    }
  },
  // 监听返回事件
  listenGoBack: function(callback) {
    window.history.pushState({}, document.title, "#");
    window.addEventListener("popstate", callback(), false);
  },
  // 原生返回上一个页面
  goBackNative: function() {
    window.WebViewJavascriptBridge.callHandler("closeWindow", {}, function(
      response
    ) {});
  },
  // 跳转页面 obj:{url:"",type:""} type : 0  和 原生有交互  1 和原生没有交互 跳别人的链接没有交互 是1   2 打开系统浏览器
  openUrl(action, obj) {
    if (!action || action == "") {
      action = "openSourceUrl";
    }
    if (!obj || action == "") {
      obj = {};
    }
    window.WebViewJavascriptBridge.callHandler(action, obj, function() {});
  },
  // 去提现页面
  goCash: function(type) {
    // 判断是否是大额用户
    if (type == "1") {
      // 非大额用户
      window.WebViewJavascriptBridge.callHandler("toExchange", "{}");
    } else {
      // 大额用户
      window.WebViewJavascriptBridge.callHandler(
        "openSourceUrl",
        {
          url: url.returnHost("") + "/withdraw/large" ,
          type: 0
        },
        function() {}
      );
    }
  },

  //  短信邀请
  toSms: function() {
    inviteCallback();
    if (isAndroid) {
      // 判断是 安卓还是ios
      window.WebViewJavascriptBridge.callHandler("sendSMS", sms, function(
        response
      ) {});
    } else {
      window.WebViewJavascriptBridge.callHandler("ToSms", sms, function(
        response
      ) {});
    }
    $.ajax({
      url: "/invite/callback",
      dataType: "json",
      data: {},
      jsonp: "json",
      timeout: 2e3,
      success: function() {}
    });
  },
  // 微信授权
  checkWxAuth: function() {
    window.WebViewJavascriptBridge.callHandler("bindWechat", {}, function(
      response
    ) {});
    console.log("调取微信授权");
  },
  //跳转小程序 // uid为用户的id
  openWechatApp: function(uid) {
    var d = {
      miniprogram: {
        appId: "wx457cf9ab6f548562", //安卓应用的appID 默认为中青
        miniprogramId: "gh_fde5d3abf478", // gc_开头的id 小程序原始ID 必传
        path: "pages/index/index?app_layer=1&uid=" + uid, //小程序的页面
        miniprogramType: 0 //小城程序的打开方式  默认传0  0 正式版  1 测试版
      },
      task_id: "gh_fde5d3abf478", // 任务id
      reward_flag: 0, //0 不奖励  1 奖励
      record_time: 0
    };
    window.WebViewJavascriptBridge.callHandler("jumpToWeappAd", d, function(
      response
    ) {});
  }
};

/**
 *
 * 原生 事件类型
 *
 *  1.shareWxf  分享到朋友圈  obj={url:分享的url,thumb:分享的图片,title:分享的title,description:分享的描述,from:100,share_way:分享的方式 安卓是0 ios 是 1}
 *  2.openSourceUrl  打开 新页面 无论是web页还是原生页 都用此方法   obj={url:"页面的url",type:0}  type : 0 和 原生有交互  1 和原生没有交互 跳别人的链接没有交互也是这个    2 打开系统浏览器
 *  3.sendSMS/ToSms   短信邀请   android 为 sendSMS  ios  为 ToSms obj = "短信信息"
 *  4.copyText     复制文本  obj = "文本内容"
 *  5.toExchange   跳转到体现页面   obj ={}  这个分小额用户和大额用户 大额用户 跳新的web页面   obj = {url:"/withdraw/large",type:0}
 *  6.closeWindow  关闭当前页面 返回 上一个页面  obj ={}
 *  7.bindWechat   绑定微信    obj = {}  并且授权  bind 微信之前需要 注册 bindWechatCallback 方法  在此方法中返回 用户微信信息然后发送后台保存
 *  8.fill_invite_code  跳转  填写验证码 页面
 *
 *
 *
 * openSourceUrl{// 跳转类型
 *
 *     原生页面
 *
 *     toExchange:跳转 体现 页面  obj={}
 *     wap_login: 用户登陆   obj={}
 *     read_article : 去首页阅读文章  obj ={}
 *
 *     web页面
 *
 *     https://kd.youth.cn/user/qrcode_invite1: 面对面邀请 二维码
 *
 *     https://kd.youth.cn/user/task_video : 观看视频教程
 *
 *
 *
 *
 *
 *
 *
 * }
 */

/*
   函数 dome  

   //短信邀请
function toSms() {
    inviteCallback();
    if(isAndroid){
        window.WebViewJavascriptBridge.callHandler('sendSMS',sms, function(response){});
    }else{
        window.WebViewJavascriptBridge.callHandler('ToSms',sms, function(response){});
    }
}
// 分享到朋友圈
function userShare(share_title,share_thumb,share_desc,share_url,article_id){
        var  share_desc = "阅读："+share_desc;
        var device_type = tool.getQueryString('device_type');
        if(device_type == 'android'){
            var events = 'shareWxf';
            var share_thumbs = [share_thumb];
            var d={url:share_url,thumb:share_thumb,thumbs:share_thumbs,title:share_title,description:share_desc,from:100,share_way:0};
        }else{
            var d={url:share_url,thumb:share_thumb,thumbs:[],title:share_title,desc:share_desc,from:100,share_way:1};
            var events = 'shareWxf';
        }
        window.WebViewJavascriptBridge.callHandler(events,d,function(response){

        });
        shareCallback(article_id); // 分享完成 以后告诉后台 分享过
        $('.layerDraw').hide();
    }

//复制链接
function copyUrl(){
    inviteCallback();
    window.WebViewJavascriptBridge.callHandler('copyText',share_url,function(response){});
}

//复制验证码 
function copyInviteCode(){
    window.WebViewJavascriptBridge.callHandler('copyText',uid,function(response){});
}

// 初始化 bridge  绑定微信 授权 需要 初始化 这些方法  在这里注册原生调用的方法

initBridge:function(){// 初始化
    var that = this;
      LDZS.connectWebViewJavascriptBridge(function (bridge){  // 自运行的一个方法 而不是函数调用
        bridge.init(function(message,responseCallback){
          var data = {
              'Javascript Responds': 'Wee!'
                    }
          console.log('JS responding with', data)
          responseCallback(data)
        });
        bridge.registerHandler('testJavascriptHandler', function (data, responseCallback) {
          var responseData = {
              'Javascript Says': 'Right back atcha!'
          }
          console.log('JS responding with', responseData)
          responseCallback(responseData)
        });
        bridge.registerHandler('bindWechatCallback', function (data, responseCallback) {
          console.log("授权回调",data)  //data 是 用户的微信信息
          var response = JSON.parse(data);
          response.cookie=that.getUrlPrmt().cookie
          response.cookie_id=that.getUrlPrmt().cookie_id
          console.log("请求参数",response)
            that.bindWeichat(response); // 把获取的用户信息发送后台
            that.myWxName=response.nickname
            console.log("授权微信名称",that.myWxName)
        });

      
      })
    },
 
 
 */
