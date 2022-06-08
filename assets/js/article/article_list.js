$(function () {
  //初始化文章列表
  //导出layer和form对象
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;
  //定义一个查询参数对象,将来请求数据的时候需要将请求参数对象提交到服务器
  let q = {
    //页码值,默认请求第一页的数据
    pagenum: 1,
    //每页显示的条数,默认每页显示2条数据
    pagesize: 2,
    //文章分类的id,默认查询所有的文章
    cate_id: "",
    //文章的状态,默认查询所有的文章 0:未发布 1:已发布
    state: "",
  };
  //调用获取文章列表的方法
  initTable();
  //获取文章列表数据的方法
  /**
   * 1.定义一个函数,调用函数
   * 2.在函数中发起ajax请求,获取数据
   * 3.判断请求是否成功
   * 4.使用模板引擎渲染数据
   * 5.使用laypage插件分页
   */
  function initTable() {
    // console.log(111);
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) return layer.msg("获取文章列表失败");
        //使用模板引擎渲染表格
        const htmlStr = template("tpl-table", res);
        // console.log(res.data);
        $("tbody").html(htmlStr);
        //调用渲染分页的方法
        $("#pagebox").html("");
        if (res.data.length !== 0) return renderPage(res.total);
      },
    });
    //定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (dateStr) {
      //将时间字符串转换为时间对象
      let date = new Date(dateStr);
      //获取年月日
      let year = date.getFullYear();
      let month = addZero(date.getMonth() + 1);
      let day = addZero(date.getDate());
      let hour = addZero(date.getHours());
      let minute = addZero(date.getMinutes());
      let second = addZero(date.getSeconds());
      //返回美化后的时间字符串
      return `${year}-${month}-${day} : ${hour}:${minute}:${second}`;
    };
    //定义补零的函数
    function addZero(num) {
      return num < 10 ? "0" + num : num;
    }
  }
  //调用初始化文章分类的下拉框方法
  initCate();
  //初始化文章分类下拉框的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) return layer.msg("获取文章分类失败");
        //使用模板引擎渲染下拉框
        const htmlStr = template("tpl-cate", res);
        // console.log(htmlStr);
        $("[name=cate_id]").html(htmlStr);
        //初始化下拉框
        form.render("select");
      },
    });
  }
  //实现筛选的功能
  /**
   * 1.为筛选表单绑定submit事件
   * 2.阻止默认表单提交行为
   * 3.获取筛选表单中的数据,并将数据设置到查询参数对象中
   * 4.根据最新的筛选条件重新渲染表格的最新数据
   */
  $("#form-search").on("submit", (e) => {
    //阻止默认表单提交行为
    e.preventDefault();
    //获取筛选表单中的数据,并为查询参数对象赋值
    q.cate_id = $("[name=cate_id]").val();
    // console.log($("[name=cate_id]").val());
    q.state = $("[name=state]").val();
    // console.log($("[name=state]"));
    // console.log(q);
    //根据最新的筛选条件重新渲染表格的最新数据
    initTable();
  });
  //定义渲染分页的方法
  /**
   * @param {*} total
   * @param {*} pagenum
   * @param {*} pagesize
   */
  function renderPage(total) {
    //调用laypage.render的分页方法
    laypage.render({
      elem: "pagebox", //分页容器的id
      count: total, //总条数
      limit: q.pagesize, //每页显示的条数
      curr: q.pagenum, //初始页码
      layout: ["count", "limit", "prev", "next", "page", "skip"],
      limits: [2, 3, 5, 10],
      //分页发生切换时触发jump回调
      /**
       * @param {*} obj
       * @param {*} first
       */
      jump: function (obj, first) {
        /**
         * 触发jump回调的两种方式:
         * 1.点击页码触发
         * 2.只要调用了laypage.render方法,那么就会触发jump回调
         * 3.可以通过first参数来判断是通过哪种方式触发的jump回调
         * 4.如果first的值为true,那么说明是通过调用laypage.render方法触发的jump回调,反之,则是点击页码触发的
         */
        if (!first) {
          //把最新的页码值赋值到查询参数对象中
          q.pagenum = obj.curr;
          //把最新的条目数赋值到查询参数对象中
          q.pagesize = obj.limit;
          //重新渲染表格的最新数据
          initTable();
        }
      },
    });
  }
  //通过代理的方式为每一个删除按钮绑定点击事件
  $("tbody").on("click", ".btn-delete", function () {
    // console.log(111);
    //获取当前页面上有多少条数据
    let total = $(".btn-delete").length;
    //获取当前点击的删除按钮所在行的文章id
    const id = $(this).attr("data-id");
    //弹出确认框,确认后才执行删除操作
    layer.confirm("确定删除吗?", { icon: 3, title: "提示" }, function (index) {
      //发起ajax请求,删除文章
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: (res) => {
          if (res.status !== 0) return layer.msg("删除文章失败");
          layer.msg("删除文章成功");
          //当数据删除完成后,需要判断当前页码是否还有数据,若无数据将页码减一重新赋值给查询参数对象,若有数据,则不需要改变页码
          if (total === 1) {
            //如果total的值为1,证明删除之后,页面上就没有数据了
            //页码值最小为1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });
  // function initArticle(ID) {
  //   //发起ajax请求,获取当前文章的详细信息
  //   $.ajax({
  //     method: "GET",
  //     url: "/my/article/" + ID,
  //     success: (res) => {
  //       console.log(res);
  //       if (res.status !== 0) return layer.msg("获取文章详情失败");
  //       //调用模板引擎的render方法,渲染编辑文章的表单
  //       //为编辑区域的表单快速赋值
  //       form.val("form-edit", res.data);
  //     },
  //   });
  // }
  //通过代理的方式为每一个编辑按钮绑定点击事件
  $("tbody").on("click", ".btn-edit", function () {
    // $("#iframe-edit").css("display", "block");
    //获取到当前点击文章的id
    const Id = $(this).attr("data-id");
    window.open(`/article/article_edit.html?${Id}`);
    //调用initArticle方法,初始化编辑文章的表单
    // initArticle(Id);
  });
});
