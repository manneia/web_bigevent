$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);
  // 1.4 绑定上传事件
  $("#btnChooseImage").on("click", () => {
    $("#file").click();
  });

  //为文件选择框绑定change事件
  $("#file").on("change", (e) => {
    //获取用户选择的文件
    var file = e.target.files[0];
    if (file.length === 0) return layui.laer.msg("请选择图片");

    //将文件转换为路径
    const image = URL.createObjectURL(file);
    //重新初始化裁剪区域
    //销毁旧的裁剪区域,避免叠加,生成新的的裁剪区域
    $image.cropper("destroy").attr("src", image).cropper(options);
  });
  //将用户确认的图片上传到服务器
  $("#btnUpload").on("click", () => {
    //1.获取裁剪后的图片
    let dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // console.log(dataURL);
    //2.调用接口,上传到服务器
    $.ajax({
      url: "/my/update/avatar",
      type: "post",
      data: {
        avatar: dataURL,
      },
      success: (res) => {
        if (res.status !== 0) return layui.layer.msg("上传失败");
        //更新用户头像
        layui.layer.msg("上传成功");
        window.parent.getUserInfo();
      },
    });
  });
});
