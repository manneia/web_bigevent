//注意:每次调用$.get或$.post或$.ajax的时候,都会先调用ajaxPrefilter()这个函数,在这个函数中我们可以拿到我们给ajax提供的配置项

$.ajaxPrefilter(function (options) {
  //在发起请求之前,我们可以给ajax提供一些配置项
  options.url = "http://www.liulongbin.top:3007" + options.url;
  //统一为有权限的接口设置headers请求头
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  options.complete = function (res) {
    console.log(res);
    //在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据.
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      //1.强制清空token
      localStorage.removeItem("token");
      //2.强制跳转到登录页面
      location.href = "/login.html";
    }
  };
});
