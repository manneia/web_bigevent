$(function () {
  //重置密码
  /**
   * 1.给表单添加submit事件
   * 2.阻止表单的默认提交行为
   * 3.收集表单数据
   * 4.校验表单数据
   * 5.发起ajax请求,更新数据
   * 6.更新成功后,提示用户
   */
  let form = layui.form;
  //密码校验
  /**
   * 1.长度必须在6~12个字符之间
   * 2.新密码与旧密码不能相同
   * 3.新密码与确认密码必须相同
   */
  form.verify({
    //校验两次密码是否一致
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位,且不能出现空格"],
    //新密码不能与旧密码相同
    samePwd: (value) => {
      //通过形参拿到的是确认密码的值,还需要拿到密码的值,在进行一次等于的判断,如果判断失败则return一个提示信息即可
      const pwd = $(".layui-form [name=oldPwd]").val();
      if (pwd === value) return "新旧密码不能一样";
    },
    //确认密码与新密码必须相同
    rePwd: (value) => {
      const pwd = $(".layui-form [name=newPwd]").val();
      if (pwd !== value) return "新密码不能与旧密码一致";
    },
  });
  /**
   * @author luo
   * @date 2020-06-17
   * @param {string} url 请求地址
   * @param {object} data 请求参数{$oldPwd:$oldPwd,$newPwd:$newPwd}
   * @param {function} success 成功回调函数
   * @param {String} error 错误回调提示信息
   * @returns {msg} 返回提示信息
   */
  $(".layui-form").submit((e) => {
    //阻止表单的默认提交行为
    e.preventDefault();
    //发起ajax请求
    $.ajax({
      method: "post",
      url: "/my/updatepwd",
      data: $('.layui-form').serialize(),
      success: (res) => {
        if (res.status !== 0) return layui.layer.msg("更新密码失败!");
        layui.layer.msg("更新密码成功!");
        //重置表单
        $(".layui-form")[0].reset();
      },
    });
  });
});
