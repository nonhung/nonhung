
var basicInfo = new Vue({
  el: '#basicInfo',
  data() {
    return {
        channelType: '',
        parentMerchant: '',
        parentMerchantName:'',
        parentDept:'',
        parentDeptName:'',
        deptCode:'',
        merchantNo:'',
        corpName:'',
        xtree1: null,
        ifSignPlace:'',
        fileList: [],
        formData: {
            fileTrueName: '', // 文件的真实名
            fileName: '', // 输入的文件名
            filePath: '',
            fileType: ''
        },
        uploading: false,
        ischecken:''
    }
  },
  methods: {
    renderTree() {
      $.ajax({
          type: 'get',
          url: '/merchant/merchantTree',
          success(data) {
              basicInfo.xtree1 = new layuiXtree({
                  elem: 'xtree1'   //(必填) 放置xtree的容器，样式参照 .xtree_contianer
                  , form: layui.form     //(必填) layui 的 from
                  , checked: basicInfo.parentMerchant
                  , data: data.list     //(必填) json数据
                  , isopen: false
              });
          },
          error(xth) {
            layer.alert('请求失败');
          }
      });
    },
      renderDeptTree(checked) {
          $.ajax({
              type: 'get',
              url: '/merchant/deptTree',//待修改
              success(data) {
                  basicInfo.xtree1 = new layuiXtree({
                      elem: 'xtree1'   //(必填) 放置xtree的容器，样式参照 .xtree_contianer
                      , form: layui.form     //(必填) layui 的 from
                      , data: data.list     //(必填) json数据
                      , isopen: false
                      , checked: checked
                  });
              },
              error(xth) {
                  layer.alert('请求失败');
              }
          });
      },
    selectParentMerchant() {
        layer.open({
            type: 2,
            title: '选择',
            area: ['60%', '80%'],
            // content: `<form class="layui-form">
            //       <div id="xtree1" class="xtree_contianer"></div>
            //     </form>`,
            content:['/merchant/parentMerchantInit','no']
            // btn: ['确定', '取消'], //可以无限个按钮
            // success: function(index) {
            //     basicInfo.renderTree();
            // },
            // yes: function(index) {
            //    // console.log(basicInfo.xtree1.GetChecked());
            //    // basicInfo.parentMerchant = basicInfo.xtree1.GetChecked()
            //    //  basicInfo.parentMerchantName=basicInfo.xtree1.GetChecked('title')
            //    // layer.close(index);
            // }
        });
    },
      selectParentDept() {
          layer.open({
              type: 1,
              title: '选择',
              area: ['40%', '80%'],
              content: `<form class="layui-form">
                  <div id="xtree1" class="xtree_contianer"></div>
                </form>`,
              btn: ['确定', '取消'], //可以无限个按钮
              success: function(index) {
                  basicInfo.renderDeptTree(basicInfo.parentDept);
              },
              yes: function(index) {
                  // layer.close(index);
                  basicInfo.parentDept = basicInfo.xtree1.GetChecked()
                  basicInfo.parentDeptName=basicInfo.xtree1.GetChecked('title')
                  layer.close(index);
              }
          });
      },

      selectCorpMrg(){
        layer.open({
            type: 2,
            title: '选择',
            area: ['60%', '80%'],
            content:['/merchant/initMgrs?deptCode='+basicInfo.parentDept,'no']
            // btn: ['确定', '取消'], //可以无限个按钮
        })
      },

    saveBasicInfo() {

    },
      getLngLat(){
          layer.open({
              id: 'layui-layer-iframe1',
              type: 2,
              title: '设置点',
              area: ['1000px', '500px'],
              content: '/merchant/initMapPage?lng='+$("#lng").val()+'&lat='+$("#lat").val(),
              btn: ['确定', '取消'],
              yes: function (index) {
                  var point = $('iframe', '#layui-layer-iframe1').contents().find('#mapimpl').attr('location');
                  var bd09togcj02 = coordtransform.bd09togcj02(JSON.parse(point).lng, JSON.parse(point).lat);
                  var gcj02towgs84 = coordtransform.gcj02towgs84(bd09togcj02[0], bd09togcj02[1]);
                  $("#lnglat").val(gcj02towgs84[0]+" "+gcj02towgs84[1]);
                  $("#lng").val(gcj02towgs84[0]);
                  $("#lat").val(gcj02towgs84[1]);
                  layer.close(index);
              }
          });
      },
      getFileData() {
          var fileData = [];
          $('li', '#upload-file-list').each(function (index) {
              var $this = $(this);
              fileData.push({
                  attachName: $this.attr('title'),
                  attachUrl: $this.attr('url'),
                  attachType: $this.attr('fileType'),
                  index: index + 1
              });
          });
          return fileData;
      },
      getFileSuffix(fileUrl) {
          if (fileUrl) {
              return fileUrl.substring(fileUrl.lastIndexOf('.') + 1).toLowerCase();
          } else {
              return '';
          }
      },
      isImg(fileUrl) {
          let suffix = this.getFileSuffix(fileUrl);
          return suffix === 'png' ||
              suffix === 'jpg' ||
              suffix === 'gif' ||
              suffix === 'jpeg' ||
              suffix === 'bmp' ||
              suffix === 'pic';
      },
      isVideo(fileUrl) {
          let suffix = this.getFileSuffix(fileUrl);
          return suffix === 'mp4' ||
              suffix === 'avi' ||
              suffix === 'mpeg4' ||
              suffix === 'rmvb' ||
              suffix === 'mkv' ||
              suffix === 'mov' ||
              suffix === 'f4v';
      },
      suffix(fileUrl) {
          let suffix = this.getFileSuffix(fileUrl);
          switch (suffix) {
              case 'png':
                  return 'png';
              case 'doc':
                  return 'docx_win';
              case 'docx':
                  return 'docx_win';
              case 'xls':
                  return 'xlsx_win';
              case 'xlsx':
                  return 'xlsx_win';
              case 'ppt':
                  return 'pptx_mac';
              case 'pptx':
                  return 'pptx_mac';
              case 'zip':
                  return 'zip';
              case 'rar':
                  return 'rar';
              case 'gif':
                  return 'gif';
              case 'bmp':
                  return 'bmp';
              case 'jpeg':
                  return 'jpeg';
              case 'txt':
                  return 'text';
              case 'pdf':
                  return 'pdf';
              case 'mp4' || 'avi' || 'mpeg4' || 'rmvb' || 'mkv' || 'mov' || 'f4v':
                  return 'mpeg';
              default:
                  return 'file';
          }
      },
      initViewer() {
          this.$nextTick(function () {
              if (viewer) {
                  viewer.destroy();
              }
              viewer = new Viewer(document.getElementById('upload-file-list'));
          });
      },
      uploadFile() {
          layui.upload.render({
              elem: '#upload-file' //绑定元素
              , url: '/common/upload' //上传接口
              , accept: 'file'
              , size: 20 * 1024
              , before: function (res) {
                  basicInfo.uploading = true;
              }
              , done: function (res) {
                  //上传完毕回调
                  basicInfo.uploading = false;
                  if (res.success) {
                      basicInfo.formData.fileTrueName = res.body.fileName;
                      basicInfo.formData.fileName = res.body.fileName;
                      basicInfo.formData.filePath = res.body.url;
                      var attachType;
                      if (basicInfo.isImg(res.body.url)) {
                          attachType='1';
                      } else if (basicInfo.isVideo(res.body.url)) {
                          attachType='2';
                      } else {
                          attachType='3'
                      }
                      basicInfo.formData.fileType = attachType;
                  }
              }
              , error: function () {
                  //请求异常回调
                  basicInfo.uploading = false;
              }
          });
      },
      addFile() {
          this.$data.formData.fileTrueName = '';
          this.$data.formData.fileName = '';
          this.$data.formData.filePath = '';
          this.$data.formData.fileType = '';
          this.$data.uploading = false;
          layui.layer.open({
              type: 1,
              title: '添加',
              content: $('.add-file-modal'),
              btnAlign: 'c',
              btn: ['保存', '取消'],
              btn1: function () {
                  if (basicInfo.uploading) {
                      layui.layer.open({
                          title: '提示',
                          content: '文件正在上传中， 请稍后'
                      });
                  } else {
                      var fileName = basicInfo.formData.fileName;
                      var filePath = basicInfo.formData.filePath;
                      var fileType = basicInfo.formData.fileType;
                      if (!fileName.length) {
                          layui.layer.open({
                              title: '提示',
                              content: '图片名称不能为空'
                          });
                          return false;
                      }
                      if (!filePath.length) {
                          layui.layer.open({
                              title: '提示',
                              content: '请上传图片'
                          });
                          return false;
                      }
                      basicInfo.fileList.push({
                          fileName: fileName,
                          filePath: filePath,
                          fileType: fileType,
                      });

                      basicInfo.initViewer();
                      layui.layer.closeAll();
                  }
              },
              btn2: function () {
                  if (basicInfo.uploading) {
                      basicInfo.beforeCloseLayer();
                      return false;
                  }
              },
              cancel: function () {
                  if (basicInfo.uploading) {
                      basicInfo.beforeCloseLayer();
                      return false;
                  }
              }
          })
      },
      beforeCloseLayer() {
          layer.confirm(`文件正在上传中， 你确定要停止上传并关闭窗口？`, {title: '提示'}, function () {
              layui.layer.closeAll();
          });
      },
      removeFile(index, item) {
          layer.confirm(`确认删除材料${item.fileName}?`, {title: '提示'}, function () {
              var fileIndex = basicInfo.fileList.map((_item, _index) => {
                  if (_item.id == item.id) {
                      return _index;
                  }
              });
              basicInfo.fileList.splice(fileIndex, 1);
              layui.layer.closeAll();
          });
      }

  },
  mounted() {
      var _this = this;
      console.log(_this)
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'upload'], function () {
        var date = new Date();
        var form = layui.form;
        var laydate = layui.laydate;
        var upload = layui.upload;
        var table = layui.table;
        var $ = layui.$;
      layui.laydate.render({
          elem: '#regDate',
          type: 'date',
          max:'date',
      });
      layui.laydate.render({
          elem: '#entryTime',
          type: 'datetime',
          max:'date',
          format:'yyyy-MM-dd HH:mm:ss'
      });
      layui.form.on('select(channelType)', function (data) {
        basicInfo.channelType = data.value;
      });
        layui.form.on('select(ifSignPlace)', function (data) {
            basicInfo.ifSignPlace = data.value;
        });
      basicInfo.saveBasicInfo();
        $("#cancelAdd").on("click", function () {
            parent.layui.layer.closeAll();
        });

        layui.form.on('submit(qdtj)', function (data) {
            if(!zutjboolean){
                layer.tips('请勾选并确定以上内容', '#zutjimg');
                return false;
            }
            if(!zfclboolean){
                layer.tips('请勾选并确定以上内容', '#zfclimg');
                return false;
            }

            var fileArry = _this.getFileData();
            if (fileArry.length > 10) {
                layer.open({
                    title: '提示'
                    , content: '系统支持不超过10个附件，请调整后提交'
                });
            }else if (fileArry.length ==0){
                layer.open({
                    title: '提示'
                    , content: '请选择上传附件'
                });
            }else {
                var date = data.field;
                date.attachmentsStr = JSON.stringify(fileArry);
                $.post("/merchant/addMerchant",date, function(result) {
                    if (result.code == '0000') {
                        basicInfo.merchantNo = result.merchantNo
                        layer.msg(result.msg, {
                            icon: 1,
                        }, function (){
                            parent.tab.tabClose('/merchant/initQueryPage');
                            parent.tab.tabAdd({
                                "url": "/merchant/initQueryPage",
                                "icon": "",
                                "title": "商户列表",
                                "id": Date.parse(new Date)
                            });
                            parent.tab.tabClose(window.location.pathname + window.location.search);
                        });
                    } else {
                        layer.alert(result.msg, {
                            icon: 2,
                        });
                    }
                });
            }
            return false;
        });

        layui.form.on('submit(demo1)', function (data) {
                //捕获页
                layer.open({
                    type: 1,
                    area: ['50%', '30%'],
                    shade: 0.3,
                    title: false, //不显示标题
                    content: $('#qwerty'),
                    cancel: function(){
                    }
                });
                return false;
        });

        layui.form.on('submit(updateInfo)', function (data) {
            var fileArry = _this.getFileData();
            if (fileArry.length > 10) {
                layer.open({
                    title: '提示'
                    , content: '系统支持不超过10个附件，请调整后提交'
                });
            }else if (fileArry.length ==0){
                layer.open({
                    title: '提示'
                    , content: '请选择上传附件'
                });
            }else {
                var verification = false;
                var date = data.field;
                date.attachmentsStr = JSON.stringify(fileArry);
                $.ajaxSettings.async = false;
                $.post("/merchant/verificationUpdate",date, function(result) {
                    if (result.code == '0000') {
                        date.verificationUpdate ="1";
                        verification = true;
                    } else {
                        date.verificationUpdate ="0";
                        verification = false;
                    }
                });
                $.ajaxSettings.async = true;
                if(verification){
                    layer.confirm('本次提交修改了必填项，需重新审核，确定提交?', function(index){
                        $.post("/merchant/addMerchant",date, function(result) {
                            if (result.code == '0000') {
                                basicInfo.merchantNo = result.merchantNo
                                layer.msg(result.msg, {
                                    icon: 1,
                                }, function (){
                                    parent.tab.tabClose('/merchant/initQueryPage');
                                    parent.tab.tabAdd({
                                        "url": "/merchant/initQueryPage",
                                        "icon": "",
                                        "title": "商户列表",
                                        "id": Date.parse(new Date)
                                    });
                                    parent.tab.tabClose(window.location.pathname + window.location.search);
                                });
                            } else {
                                layer.alert(result.msg, {
                                    icon: 2,
                                });

                            }
                        });
                    })
                }else{
                    $.post("/merchant/addMerchant",date, function(result) {
                        if (result.code == '0000') {
                            basicInfo.merchantNo = result.merchantNo
                            layer.msg(result.msg, {
                                icon: 1,
                            }, function (){
                                parent.tab.tabClose('/merchant/initQueryPage');
                                parent.tab.tabAdd({
                                    "url": "/merchant/initQueryPage",
                                    "icon": "",
                                    "title": "商户列表",
                                    "id": Date.parse(new Date)
                                });
                                parent.tab.tabClose(window.location.pathname + window.location.search);
                            });

                        } else {
                            layer.alert(result.msg, {
                                icon: 2,
                            });
                        }
                    });
                }
            }
            return false;
        });
        _this.initViewer();
        _this.uploadFile();
    });
  }
});