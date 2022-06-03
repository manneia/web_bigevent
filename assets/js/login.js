$(function () {
  /**
   * 点击link_register和link_login时发生切换
   * @param  {[type]} click [description]
   */
  $("#link_register").on("click", () => {
    $(".login-box").hide();
    $(".register-box").show();
  });
  $("#link_login").on("click", () => {
    $(".register-box").hide();
    $(".login-box").show();
  });
  /**
   * 利用Layui制作表单验证
   * layui的自定义验证规则
   */
  //获取form对象
  let form = layui.form;
  let layer = layui.layer;
  //通过form.verify()方法实现自定义验证规则
  form.verify({
    //自定义了一个叫做pwd的校验规则
    pwd: [/^[\s]{6,12}$/, "密码必须6到12位,且不能出现空格"],
    //校验两次密码是否一致
    repwd: function (value) {
      //通过形参拿到的是确认密码的值,还需要拿到密码的值,在进行一次等于的判断,如果判断失败则return一个提示信息即可
      const pwd = $(".register-box [name=password]").val();
      //   console.log(value);
      //   console.log(pwd);
      if (pwd !== value) {
        return "两次密码不一致";
      }
    },
  });
  //监听注册表单的提交事件
  $("#form_register").on("submit", (e) => {
    //阻止默认的提交行为
    e.preventDefault();
    //发起post请求
    let data = {
      username: $("#form_register [name=username]").val(),
      password: $("#form_register [name=password]").val(),
    };
    $.post("/api/reguser", data, (res) => {
      console.log(res);
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg("注册成功,请登录");
      //模拟点击登录
      $("#link_login").click();
    });
  });
  //监听登录表单的提交事件
  $("#form_login").submit((e) => {
    //阻止默认的提交行为
    e.preventDefault();
    //发起post请求
    $.ajax({
      method: "post",
      url: "/api/login",
      data: $("#form_login").serialize(),
      success: (res) => {
        if (res.status !== 0) {
          layer.msg("登录失败");
        }
        layer.msg("登录成功");
        //将登录成功得到的token字符串,存储到LocalStorage中
        localStorage.setItem("token", res.token);
        console.log(res.token);
        location.href = "/index.html";
      },
    });
  });
});
