$(function () {
  let form = layui.form;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位,且不能出现空格"],
    //校验两次密码是否一致
    samePwd: (value) => {
      //通过形参拿到的是确认密码的值,还需要拿到密码的值,在进行一次等于的判断,如果判断失败则return一个提示信息即可
      const pwd = $(".layui-form [name=oldPwd]").val();
      if (pwd === value) return "新旧密码不能一样";
    },
    rePwd: (value) => {
      const pwd = $(".layui-form [name=newPwd]").val();
      if (pwd !== value) return "新密码不能与旧密码一致";
    },
  });
  $(".layui-form").submit(function (e) {
    //阻止表单的默认提交行为
    e.preventDefault();
    //发起ajax请求
    $.ajax({
      method: "post",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layui.layer.msg("更新密码失败!");
        layui.layer.msg("更新密码成功!");
        //重置表单
        $(".layui-form")[0].reset();
      },
    });
  });
});
