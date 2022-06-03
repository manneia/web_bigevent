$(function () {
  //调用getUserInfo方法获取用户的基本信息
  gettUserInfo();
  const layer = layui.layer;
  //点击退出按钮，退出登录
  $(".BtnLogOut").on("click", function () {
    //提示用户是否确定退出登录
    layer.confirm(
      "确定退出登录?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        //清空本地存储中的token
        localStorage.removeItem("token");
        //重新跳转到登录页面
        location.href = "/login.html";
        //关闭confirm弹框
        layer.close(index);
      }
    );
  });
});

//获取用户的基本信息
function gettUserInfo() {
  $.ajax({
    method: "get",
    url: "/my/userinfo",
    // //请求头
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败");
      }
      //调用renderAvatar渲染用户头像
      renderAvatar(res.data);
    },
  });
}

//渲染用户头像
function renderAvatar(user) {
  //获取用户的名称
  let name = user.nickname || user.username;
  //设置欢迎的文本
  $("#welcome").html(`欢迎&nbsp;&nbsp;${name}&nbsp;&nbsp;回来`);
  //按需渲染用户的头像
  if (user.user_pic !== null) {
    //如果用户有头像，则渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    //如果用户没有头像，则渲染文本头像
    const first = name[0].toUpperCase();
    $(".layui-nav-img").hide();
    $("text-avatar").html(first).show();
  }
}
