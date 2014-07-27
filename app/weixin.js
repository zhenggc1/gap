var webot = require('weixin-robot');

function search(keyword){
    return "U are searching " + keyword;
}
// 指定回复消息
webot.set('hi', '你好');

webot.set('subscribe', {
  pattern: function(info) {
    return info.is('event') && info.param.event === 'subscribe';
  },
  handler: function(info) {
    return '欢迎订阅微信机器人';
  }
});

webot.set('/*/', {
  handler: function(info, next) {
    next(null, search(info.text));
  }
});

function watchWeixin(app){
    webot.watch(app, { token: 'gapapp', path: '/token' });
}

exports.watchWeixin = watchWeixin;
