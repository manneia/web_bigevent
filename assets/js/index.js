$(function () {
  //调用getUserInfo方法获取用户的基本信息
  getUserInfo();
  const layer = layui.layer;
  //点击退出按钮，退出登录
  $(".BtnLogOut").on("click", () => {
    //提示用户是否确定退出登录
    layer.confirm("确定退出登录?", { icon: 3, title: "提示" }, (index) => {
      //do something
      //清空本地存储中的token
      localStorage.removeItem("token");
      //重新跳转到登录页面
      location.href = "/login.html";
      //关闭confirm弹框
      layer.close(index);
    });
  });
});

//获取用户的基本信息
function getUserInfo() {
  // console.log("更新失败");
  $.ajax({
    method: "get",
    url: "/my/userinfo",
    // //请求头
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: (res) => {
      // console.log(res)
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败");
      }
      //调用renderAvatar渲染用户头像
      // console.log(res.data);
      renderAvatar(res.data);
    },
  });
}

//渲染用户头像
function renderAvatar(user) {
  // console.log("失败");
  //获取用户的名称
  let name22 = user.nickname || user.username;
  // console.log(user.nickname);
  // console.log(name);
  //设置欢迎的文本
  $("#welcome").html(`欢迎&nbsp;&nbsp;${name22}`);
  //按需渲染用户的头像
  if (user.user_pic !== null) {
    //如果用户有头像，则渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    //如果用户没有头像，则渲染文本头像
    const first = name22[0].toUpperCase();
    // console.log(first);
    $(".layui-nav-img").hide();
    $(".text-avatar").text(first).show();
  }
}
