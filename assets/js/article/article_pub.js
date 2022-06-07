$(function () {
  //导入layer和form对象
  var layer = layui.layer;
  var form = layui.form;
  initCate();
  // 初始化富文本编辑器
  initEditor();
  /**
   * 定义渲染文章分类的方法
   * 1.封装函数,调用方法
   * 2.在函数中发起ajax请求,获取数据
   * 3.判断请求是否成功
   * 4.调用模板引擎渲染下拉框
   */
  //定义加载文章分类的函数
  function initCate() {
    $.ajax({
      url: "/my/article/cates",
      type: "get",
      success: function (res) {
        // console.log(res.data);
        if (res.status !== 0) return layer.msg("获取分类失败");
        //调用模板引擎,渲染分类的下拉菜单
        let htmlStr = template("tpl-pub", res);
        // console.log(htmlStr);
        // console.log($("#cate_id"));
        $("[name=cate_id]").html(htmlStr);
        //调用form.render()渲染下拉菜单
        form.render();
      },
    });
  }
  //初始化封面裁剪区域
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);
  //为选择封面的按钮，绑定点击事件处理函数
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });
  //监听 coverFile 的 change 事件，获取用户选择的文件列表
  $("#coverFile").on("change", function (e) {
    //获取到文件的列表数组
    let files = e.target.files;
    if (files.length === 0) return;
    //根据文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(files[0]);
    //为裁剪区域重新设置图片
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  /**
   * 发布文章的实现步骤
   * 1. 获取表单数据
   *    (1.定义文章的发布状态，默认为0)
   *    (2.获取文章标题)
   *    (3.获取文章分类)
   *    (4.获取文章内容)
   *    (5.获取文章封面)
   * 2. 发送请求，实现文章的发布
   *   (1.发送请求，实现文章的发布)
   *   (2.根据返回结果，进行提示
   *   (3.根据返回结果，进行跳转
   */
  //定义文章的发布状态
  let state = "已发布";
  //为存为草稿按钮绑定点击事件处理函数
  $("#btnSave").on("click", function () {
    state = "草稿";
  });
  //为表单绑定submit事件处理函数
  $("#form-pub").on("submit", function (e) {
    //阻止表单的默认提交行为
    e.preventDefault();
    //基于form表单，快速创建一个formData对象
    let fd = new FormData($(this)[0]);
    // console.log($(this)[0]);
    // console.log(fd);
    //将文章的发布状态存到FormData对象中
    fd.append("state", state);
    // fd.forEach((value, key) => {
    //   console.log(key, value);
    // });
    //将封面裁剪过的图片加入到FormData对象中
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将文件对象，存储到 FormData 对象实例中
        // console.log(blob);
        fd.append("cover_img", blob);
        fd.forEach((value, key) => {
          console.log(key, value);
        });
        publishArticle(fd);
      });
  });
  //定义一个发布文章的方法
  function publishArticle(fd) {
    //发送ajax请求，实现文章的发布
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      //如果向服务器提交的数据是FormData类型，必须设置下面的两个属性
      //告诉$.ajax方法不要解析请求参数
      processData: false,
      //告诉$.ajax方法不要设置请求参数的类型
      contentType: false,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message);
        //提示用户,发布文章成功
        layer.msg(res.message);
        //跳转到文章列表页面
        location.href = "/article/article_list.html";
      },
    });
  }
});
