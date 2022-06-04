$(function () {
  /**
   * 昵称长度限制
   * 初始化用户信息
   */
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    nickname: function (value) {
      // console.log(123);
      // console.log(value);
      if (value.length > 6) return "昵称长度必须在1~6个字符之间";
    },
  });
  //初始化用户信息
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) return layer.msg("获取用户信息失败");
        console.log(res.data);
        //调用form.val()快速为表单赋值
        form.val("formUserInfo", res.data);
      },
    });
  }
  //点击重置按钮,清空表单
  $("#btnReset").on("click", function (e) {
    //阻止表单的默认重置行为
    e.preventDefault();
    initUserInfo();
  });
  //点击提交按钮,提交表单,更新数据
  //监听表单的提交事件
  $(".layui-form").on("submit", function (e) {
    //阻止表单的默认提交行为
    e.preventDefault();
    initUserInfo();
    // console.log($("#updateUserInfo").serialize());
    //发起ajax请求,更新数据
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $("#updateUserInfo").serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg("更新用户信息失败!");
        layer.msg("更新用户信息成功!");
        //调用父页面中的方法,重新渲染用户的头像和信息
        // console.log(res);
        // console.log(window.parent)
        // console.log(window.parent.getUserInfo)
        window.parent.getUserInfo();
      },
    });
  });
});
