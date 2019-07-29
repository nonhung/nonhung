var viewer = null;
var tabs = new Vue({
    el: '#tabs',
    data() {
        return {
            // titleList: [{
            //     name: '图片'
            // }],
            creditfileList:[],
            fileListdoor: [],
            fileListacc: [],
            currentFileList: [],
            formDatadoor: {
                fileTrueName: '', // 文件的真实名
                fileName: '', // 输入的文件名
                filePath: ''
            },
            uploading: false
        }
    },

    methods: {
        renderAreaTable() {
            layui.table.render({
                elem: '#area'
                , url: '/merchant/area/list'
                , where: {merchantNo: basicInfo.merchantNo}//测试默认值  应该使用basicInfo.merchantNo
                , cols: [  [
                    {field: 'provinceName', title: '省/直辖市', width: 180, sort: true}
                    , {field: 'cityName', title: '市', width: 180, sort: true}
                    , {field: 'carLetter', title: '车牌号', width: 180, sort: true}
                ]]
                , id: 'listReload'
                , page: true
            });
        },
        //返佣规则
        renderMerchantRebateTable() {
            layui.table.render({
                elem: '#merchantRebate'
                , url: '/merchant/rebate/list'
                , where: {merchantNo: basicInfo.merchantNo}//测试默认值  应该使用basicInfo.merchantNo
                , cols: [  [
                     {field: 'productName', title: '产品名称', width: '200', align: 'center', sort: false}
                    , {field: 'periods', title: '期数（月）', width: '150', align: 'center', sort: false}
                    , {field: 'rebateFirstAmt', title: '首返固定金额（元）', width: '200', align: 'center', sort: false}
                    , {field: 'rebateFirstRate', title: '首返比例（%）', width: '150', align: 'center', sort: false}
                    , {field: 'rebateNextRate', title: '次返比例（%）', width: '150', align: 'center', sort: false}
                    , {field: 'rebateSeasonRate', title: '季返比例（%）', width: '150', align: 'center', sort: false}
                    , {field: 'attachesStr', title: '附件', width: '350', align: 'center', sort: false}
                ] ]
                , page: true
                , done: function (res, curr, count) {
                }
            });
        },
        addAttach() {
            var fileArry = this.getFileData();
            if (basicInfo.merchantNo == '') {
                layer.open({
                    title: '提示'
                    , content: '请先保存基本信息'
                });
                return false;
            }
            if (fileArry.length <= 0) {
                layer.open({
                    title: '提示'
                    , content: '请先上传一张图片'
                });
            } else {
                $.ajax({
                    url: "/merchant/save/attach",
                    type: "post",
                    data: {
                        "merchantNo": basicInfo.merchantNo,
                        "fileList": JSON.stringify(fileArry)
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.code == '0000') {
                            layer.msg(result.msg, {
                                icon: 1,
                            });
                            // window.parent.location.reload();
                        } else {
                            layer.alert(result.msg, {
                                icon: 2,
                            });
                        }
                    },
                    error: function (msg) {
                        layer.open({
                            title: '消息'
                            , content: '请求出错'
                        });
                    }
                })
            }
        },
        addMerchantDesc() {
            var merchantDesc = editor.txt.html();
            if (basicInfo.merchantNo == '') {
                layer.open({
                    title: '提示'
                    , content: '请先保存基本信息'
                });
                return false;
            }
            /*if(merchantDesc == '' && merchantDesc.length <= 0){
                alert("请先输入内容再保存");
            } */ else {
                $.ajax({
                    url: "/merchant/addMerchantIntroduction",
                    type: "post",
                    data: {
                        "merchantNo": basicInfo.merchantNo,
                        "introduction": merchantDesc
                    },
                    dataType: "json",
                    success: function (result) {
                        if (result.code == '0000') {
                            layer.msg(result.msg, {
                                icon: 1,
                            });
                            // window.parent.location.reload();
                        } else {
                            layer.alert(result.msg, {
                                icon: 2,
                            });
                        }
                    },
                    error: function (msg) {
                        layer.open({
                            title: '消息'
                            , content: '请求出错'
                        });
                    }
                })


            }
        },
        getFileSuffix(fileUrl) {
            if (fileUrl) {
                return fileUrl.substring(fileUrl.lastIndexOf('.') + 1).toLowerCase();
            } else {
                return '';
            }
        },
        isImgdoor(fileUrl) {
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
                viewer = new Viewer(document.getElementById('upload-file-list-door'));
                $("#upload-file-list-door").sortable();
            });
        },
        initViewertwo() {
            this.$nextTick(function () {
                if (viewer) {
                    viewer.destroy();
                }
                viewer = new Viewer(document.getElementById('upload-file-list-v'));
                $("#upload-file-list-v").sortable();
            });
        },
        initViewerCredit() {
            this.$nextTick(function () {
                if (viewer) {
                    viewer.destroy();
                }
                viewer = new Viewer(document.getElementById('upload-file-list-c'));
                $("#upload-file-list-c").sortable();
            });
        },
        getFileData() {
            var fileData = [];
            $('li', '#upload-file-list-door').each(function (index) {
                var $this = $(this);
                fileData.push({
                    id: $this.attr('id'),
                    fileName: $this.attr('title'),
                    filePath: $this.attr('url'),
                    index: index + 1
                });
            });
            return fileData;
        },
        uploadFile() {
            layui.upload.render({
                elem: '#upload-file-door' //绑定元素
                , url: '/common/upload' //上传接口
                , accept: 'file'
                , before: function (res) {
                    tabs.uploading = true;
                }
                , done: function (res) {
                    //上传完毕回调
                    tabs.uploading = false;
                    if (res.success) {
                        tabs.formDatadoor.fileTrueName = res.body.fileName;
                        tabs.formDatadoor.filePath = res.body.url;
                    }
                }
                , error: function () {
                    //请求异常回调
                    tabs.uploading = false;
                }
            });
        },
        addFiledoor() {
            this.$data.formDatadoor.fileTrueName = '';
            this.$data.formDatadoor.fileName = '';
            this.$data.formDatadoor.filePath = '';
            this.$data.uploading = false;
            layui.layer.open({
                type: 1,
                title: '添加',
                content: $('.add-file-modal-door'),
                btn: ['保存', '取消'],
                btn1: function () {
                    if (tabs.uploading) {
                        layui.layer.open({
                            title: '提示',
                            content: '文件正在上传中， 请稍后'
                        });
                    } else {
                        var fileName = tabs.formDatadoor.fileName;
                        var filePath = tabs.formDatadoor.filePath;
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
                        tabs.fileListdoor.push({
                            attachName: fileName,
                            attachUrl: filePath
                        });
                        tabs.initViewer();
                        layui.layer.closeAll();
                    }
                },
                btn2: function () {
                    if (tabs.uploading) {
                        tabs.beforeCloseLayer();
                        return false;
                    }
                },
                cancel: function () {
                    if (tabs.uploading) {
                        tabs.beforeCloseLayer();
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
        removeFiledoor(index, item) {
            layer.confirm(`确认删除图片${item.attachName}?`, {title: '提示'}, function () {
                if (item.id) {
                    var obj = {};
                    obj.id = item.id;
                    $.post("/merchant/deleteMerchantAttach", obj, function (result) {
                        if (result.code == '0000') {
                            var fileIndex = tabs.fileListdoor.map((_item, _index) => {
                                if (_item.id == item.id) {
                                    return _index;
                                }
                            });
                            tabs.fileListdoor.splice(fileIndex, 1);
                            tabs.currentFileList.splice(index, 1);
                            layui.layer.closeAll();
                        } else {
                            layer.alert(result.msg, {
                                icon: 2
                            });
                        }
                    });
                } else {
                    tabs.fileListdoor.splice(index, 1);
                    layui.layer.closeAll();
                }

            });
        }

    },
    mounted() {
        layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'upload'], function () {
            tabs.renderAreaTable();
            layui.element.on('tab(merchantTab)', function (data) {
                if (this.innerText == '授信管理') {
                    tabs.$nextTick(function () {
                        tabs.initViewerCredit();
                    })
                } else if (this.innerText == '账户信息') {
                    tabs.$nextTick(function () {
                        tabs.initViewertwo();
                    })
                } else if (this.innerText == '返佣规则') {
                    tabs.renderMerchantRebateTable();
                }
            })
        });
    }
});