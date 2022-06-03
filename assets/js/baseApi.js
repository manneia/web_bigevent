//注意:每次调用$.get或$.post或$.ajax的时候,都会先调用ajaxPrefilter()这个函数,在这个函数中我们可以拿到我们给ajax提供的配置项

$.ajaxPrefilter(function (options) {
  //在发起请求之前,我们可以给ajax提供一些配置项
   options.url = "http://www.liulongbin.top:3007" + options.url;
});
