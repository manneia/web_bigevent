$(function () {
  let layer = layui.layer;
  let form = layui.form;
  //获取文章分类列表
  /**
   * 发送ajax请求获取文章类别数据
   *    1. 发送ajax请求
   *    2. 接收服务器返回的数据
   *    3.判断是否获取成功
   * 调用模板引擎渲染页面
   *    1. 引入模板引擎
   *    2. 定义模板id
   *    3. 定义模板数据
   *    <script type="text/html" id="tpl-list"></script>
   *    4. 调用模板引template('模板id',数据)擎渲染页面
   * 将数据渲染到页面中
   */
  function initArticleCateList() {
    $.ajax({
      method: "get",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        console.log(res);
        const htmlStr = template("tpl-table", res);
        // console.log(111);
        $("tbody").html(htmlStr);
      },
    });
  }
  initArticleCateList();
  //为添加按钮绑定点击事件
  let indexAdd = null;
  $("#btnAddCate").on("click", () => {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#addCateBox").html(),
    });
  });
  //通过代理的形式,为form-add添加submit事件
  $("body").on("submit", "#form-add", function (e) {
    //阻止默认提交行为
    e.preventDefault();
    // console.log('ok');
    $.ajax({
      method: "post",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg("新增分类失败");
        initArticleCateList();
        layer.msg("新增分类成功");
        //根据indexAdd关闭弹窗
        layer.close(indexAdd);
      },
    });
  });
  //通过代理的方式,为编辑按钮绑定点击事件
  let indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    //弹出一个修改文章信息分类的层
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    let id = $(this).attr("data-id");
    //发起ajax请求,获取对应id的文章分类信息
    $.ajax({
      method: "get",
      url: "/my/article/cates/" + id,
      success: (res) => {
        if (res.status !== 0) return layer.msg("获取文章分类信息失败");
        // console.log(res);
        //将获取到的文章分类信息,填充到弹窗中
        form.val("form-edit", res.data);
      },
    });
  });
  //通过代理的形式,为form-edit添加submit事件
  $("body").on("submit", "#form-edit", function (e) {
    //阻止默认提交行为
    e.preventDefault();
    //发起ajax请求,修改文章分类信息
    $.ajax({
      method: "post",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg("修改文章分类失败");
        layer.msg("修改文章分类成功");
        initArticleCateList();
        //根据indexEdit关闭弹窗
        layer.close(indexEdit);
      },
    });
  });
  //通过代理的形式,为删除按钮绑定点击事件
  $("tbody").on("click", ".btn-delete", function () {
    //获取当前点击的删除按钮的文章分类id
    let id = $(this).attr("data-id");
    //弹出一个确认框,确认是否删除文章
    layer.confirm(
      "确认删除该文章分类吗?",
      { icon: 3, title: "提示" },
      function (index) {
        //发起ajax请求,删除文章分类
        $.ajax({
          method: "get",
          url: "/my/article/deletecate/" + id,
          success: (res) => {
            //判断删除是否成功
            if (res.status !== 0) return layer.msg("删除文章分类失败");
            layer.msg("删除文章分类成功");
            initArticleCateList();
            layer.close(index); //关闭确认框
          },
        });
      }
    );
  });
});
