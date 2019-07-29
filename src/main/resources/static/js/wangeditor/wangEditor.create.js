
var wangeditor = {
  create: function (html) {
    var wangEditor = window.wangEditor;
    var editor = new wangEditor(document.getElementById('editor'));
    editor.customConfig.debug = true;
// 自定义菜单配置
    editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
//          'list',  // 列表
      'justify',  // 对齐方式
//          'quote',  // 引用
//          'emoticon',  // 表情
      'image',  // 插入图片
//          'table',  // 表格
//          'video',  // 插入视频
//          'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ];
    editor.customConfig.uploadImgServer = '/common/upload';
    // editor.customConfig.uploadImgHeaders = {
    //   'appId': '100006',
    //   'version': '',
    //   'sign': 'songche'
    // };
    // editor.customConfig.uploadImgParams = {
    //   // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
    //   // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
    //   message: '{}'
    // };
    editor.customConfig.uploadFileName = 'file';
    editor.customConfig.uploadImgHooks = {
      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      customInsert(insertImg, res, editor) {
        if (res.success) {
          insertImg(res.body.url);
        }
      }
    };
    editor.create();
    if (html && html.length) {
        editor.txt.html(html);
    }
    return editor;
  }
}