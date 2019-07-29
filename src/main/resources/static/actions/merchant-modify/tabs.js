var viewer = null;
var tabs = new Vue({
    el: '#tabs',
    data() {
        return {
            // titleList: [{
            //     name: '图片'
            // }],
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
//           {checkbox: true}
                    {field: 'provinceName', title: '省/直辖市', width: 180}
                    , {field: 'cityName', title: '市', width: 180}
                    // , {field: 'districtName', title: '区/县', width: 180}
                    , {field: 'carLetter', title: '车牌号', width: 180}
                    , {field: 'poperation', title: '操作', width: 150, toolbar: '#barDemo3'}
                ]]
                , id: 'listReload'
                , page: true
            });
            layui.table.on('tool(editAreaTable)', function (obj) {
                var data = obj.data;
                if (obj.event === 'areadelete') {
                    layer.confirm('确定要进行删除操作吗？', function (index) {
                        $.ajax({
                            url: "/merchant/area/delete?cid=" + data.id,
                            type: "get",
                            dataType: "json",
                            success: function (result) {
                                if (result.code == '0000') {
                                    layer.msg(result.msg, {
                                        icon: 1,
                                    });
                                    tabs.renderAreaTable();
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
                        });

                    });
                }else if (obj.event === 'areaUpdate') {
                    layer.open({
                        type: 2,
                        title: '选择业务区域',
                        area: ["720px", "50%"],
                        content: ['/merchant/area/initupdate?merchantNo=' + data.merchantNo+'&id='+data.id,]
                    })
                }
            });
        },
        //添加业务区域
        addArea() {
            if (basicInfo.merchantNo == '') {
                layer.open({
                    title: '提示'
                    , content: '请先保存基本信息'
                });
            } else {
                layer.open({
                    type: 2,
                    title: '选择业务区域',
                    area: ["720px", "50%"],
                    content: ['/merchant/area/initAdd?merchantNo=' + basicInfo.merchantNo,]
                })
            }
        },
        //加载产品列表
        renderProductTable() {
            layui.table.render({
                elem: '#product'
                , url: '/merchant/product/list'
                , where: {merchantNo: basicInfo.merchantNo}//测试默认值  应该使用basicInfo.merchantNo
                , cols: [  [
                    {title: '全选', checkbox: true},
                    {field: 'productNo', title: '产品编号', width: 180}
                    , {field: 'productName', title: '产品名称', width: 180}
                ]]
                , page: false
                , done: function (res, curr, count) {
                    layuiCheckbox.rebuild('#product', res.data);
                }
            });
        },
        //额度流水记录
        renderlimitdetailTable() {
            layui.table.render({
                elem: '#limitdetail'
                , url: '/merchant/credit/record/useLimitRecord'
                , where: {merchantNo: basicInfo.merchantNo}
                , cols: [  [
                    {field: 'bizTypeStr', title: '业务类型', width: 180}
                    ,{field: 'bizDirectionStr', title: '方向', width: 180}
                    , {field: 'limitChange', title: '额度变化（元）', width: 180}
                    , {field: 'creditLimit', title: '授信额度（元）', width: 180}
                    , {field: 'availableLimit', title: '剩余额度（元）', width: 180}
                    , {field: 'freezeLimit', title: '冻结额度（元）', width: 180}
                    , {field: 'usedLimit', title: '使用额度（元）', width: 180}
                    , {field: 'gmtCreate', title: '时间', width: 180}
                    , {field: 'poperation', title: '操作', width: 150, toolbar: '#useLimitRecordBar'}
                ]]
                , page: true
                , done: function (res, curr, count) {
                }
            });
            //监听工具条
            layui.table.on('tool(limitdetailTable)', function(obj) {
                var data = obj.data;
                //选择当前用户，并关闭此页面
                if (obj.event === 'view') {
                    layer.open({
                        type: 2
                        ,title: '查看授信变更明细'
                        ,area: ['90%', '90%']
                        ,content: ['/merchant/credit/limitRecordView?limitUseNo='+data.limitUseNo]
                    });
                }
            });
        },
        //加载角色列表
        renderRoleTable() {
            layui.table.render({
                elem: '#role'
                , url: '/merchant/user/roleList'
                , where: {merchantNo: basicInfo.merchantNo}//测试默认值  应该使用basicInfo.merchantNo
                , cols: [  [
                    {title: '全选', checkbox: true},
                    //{field: 'roleId', title: '角色编号', width: 180},
                    {field: 'roleName', title: '角色名称', width: 180}
                ]]
                , page: false
                , done: function (res, curr, count) {
                    layuiCheckbox.rebuild('#role', res.data);
                }
            });
        },
        //加载只读角色列表
        readOnlyRoleList() {
            layui.table.render({
                elem: '#readOnlyRole'
                , url: '/merchant/user/roleList'
                , where: {merchantNo: basicInfo.merchantNo}//测试默认值  应该使用basicInfo.merchantNo
                , cols: [  [
                    {title: '全选', checkbox: true, disabled: true},
                    //{field: 'roleId', title: '角色编号', width: 180},
                    {field: 'roleName', title: '角色名称', width: 180}
                ]]
                , page: false
                , done: function (res, curr, count) {
                    layuiCheckbox.rebuild('#readOnlyRole', res.data);
                }
            });
        },


        //加载银行卡列表
        renderAcctTable() {
            layui.table.render({
                elem: '#acct'
                , url: '/merchant/acct/list'
                , where: {merchantNo: basicInfo.merchantNo}//测试默认值  应该使用basicInfo.merchantNo
                , cols: [  [
//           {checkbox: true}
                    {field: 'acctName', title: '账户名', width: 180}
                    , {field: 'accountType', title: '账号类型', width: 180}
                    , {field: 'acctNo', title: '账号', width: 180}
                    , {field: 'bankName', title: '银行名称', width: 180}
                    , {field: 'poperation', title: '操作', width: 200, toolbar: '#barDemo1'}
                ]]
                , page: true
                , done: function (res, curr, count) {
                    $("[data-field='accountType']").children().each(function () {
                        if ($(this).text() == '0') {
                            $(this).text("对私");
                        } else if ($(this).text() == '1') {
                            $(this).text("对公");
                        }
                    });
                }
            });
            layui.table.on('tool(editAcctTable)', function (obj) {
                var data = obj.data;
                if (obj.event === 'update') {
                    layer.open({
                        type: 2,
                        title: '修改银行卡',
                        area: ['1100px', '320px'],
                        content: '/merchant/acct/initUpdate?cid=' + data.id,
                    })
                }
                else if (obj.event === 'view') {
                    layer.open({
                        type: 2,
                        title: '银行卡详情',
                        area: ['1100px', '320px'],
                        content: '/merchant/acct/detail?cid=' + data.id,
                    })
                } else if (obj.event === 'del') {
                    layer.confirm('确定要进行删除操作吗？', function (index) {
                        $.ajax({
                            url: "/merchant/acct/delete?merchantNo=" + data.merchantNo + "&acctNo=" + data.acctNo,
                            type: "get",
                            dataType: "json",
                            success: function (result) {
                                if (result.code == '0000') {
                                    layer.msg(result.msg, {
                                        icon: 1,
                                    });
                                    tabs.renderAcctTable();
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
                        });
                    });
                }
            });
        },
        //进入银行卡添加页面
        addAcct() {

            if (basicInfo.merchantNo == '') {
                layer.open({
                    title: '提示'
                    , content: '请先保存基本信息'
                });
            } else {
                layer.open({
                    type: 2,
                    title: '新增银行卡',
                    area: ['1100px', '320px'],
                    content: '/merchant/acct/initAdd?merchantNo=' + basicInfo.merchantNo,
                })
            }
        },
        //加载银行卡列表
        renderGpsAcctTable() {
            layui.table.render({
                elem: '#gpsAcct'
                , url: '/merchant/gpsAcct/list'
                , where: {merchantNo: basicInfo.merchantNo}//测试默认值  应该使用basicInfo.merchantNo
                , cols: [  [
//           {checkbox: true}
                    {field: 'vendorName', title: 'GPS厂商名称', width: 180, align: 'center'}
                    , {field: 'gpsAcctName', title: '账号名称', width: 180, align: 'center'}
                    , {field: 'poperation', title: '操作', width: 200, toolbar: '#gpsAcctbar', align: 'center'}
                ]]
                , page: true
                , done: function (res, curr, count) {
                }
            });
            layui.table.on('tool(editGPSAcctTable)', function (obj) {
                var data = obj.data;
                if (obj.event === 'update') {
                    layer.open({
                        type: 2,
                        title: '修改GPS厂商',
                        area: ['60%', '70%'],
                        content: '/merchant/gpsAcct/initUpdate?gpsNo=' + data.gpsNo,
                    })
                } else if (obj.event === 'del') {
                    layer.confirm('确定要进行删除操作吗？', function (index) {
                        $.ajax({
                            url: "/merchant/gpsAcct/delete?gpsNo=" + data.gpsNo,
                            type: "get",
                            dataType: "json",
                            success: function (result) {
                                if (result.code == '0000') {
                                    layer.msg(result.msg, {
                                        icon: 1,
                                    });
                                    tabs.renderGpsAcctTable();
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
                        });
                    });
                }
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
                    , {field: 'capitalCost', title: '资金成本（%）', width: '150', align: 'center', sort: false}
                    , {field: 'irr', title: 'IRR（%）', width: '150', align: 'center', sort: false}
                    , {field: 'stateMessage', title: '审核状态', width: '200', align: 'center', sort: false}
                    , {field: 'poperation', title: '操作', width: 200, toolbar: '#merchantRebateBar', align: 'center'}
                ] ]
                , page: true
                , done: function (res, curr, count) {
                }
            });
            layui.table.on('tool(merchantRebateTable)', function (obj) {
                var data = obj.data;
                if (obj.event === 'view') {
                    layer.open({
                        type: 2,
                        title: "查看返佣规则",
                        skin: "myclass",
                        area: ["80%", "90%"],
                        content: "/merchant/rebate/toView?merchantRebateNo=" + data.merchantRebateNo,
                    });
                }
            });
        },
        //进入GPS厂商添加页面
        addGPSAcct() {

            if (basicInfo.merchantNo == '') {
                layer.open({
                    title: '提示'
                    , content: '请先保存基本信息'
                });
            } else {
                layer.open({
                    type: 2,
                    title: '新增GPS账号',
                    area: ['60%', '70%'],
                    content: '/merchant/gpsAcct/initAdd?merchantNo=' + basicInfo.merchantNo,
                })
            }
        },

        //保存产品选择
        addProduct() {
            if (basicInfo.merchantNo == '') {
                layer.open({
                    title: '提示'
                    , content: '请先保存基本信息'
                });
            } else {
                $.ajax({
                    url: "/merchant/product/save?products=" + layuiCheckbox.getChecked('#product', 'productNo') + "&merchantNo=" + basicInfo.merchantNo,
                    type: "get",
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
        //保存角色分配
        addRole() {
            if (basicInfo.merchantNo == '') {
                layer.open({
                    title: '提示'
                    , content: '请先保存基本信息'
                });
            } else {
                var roles = layuiCheckbox.getChecked('#role', 'roleId');
                if (!roles.length > 0) {
                    layer.alert("请先选择角色！", {
                        icon: 5,
                    });
                    return false;
                }
                $.ajax({
                    url: "/merchant/user/role?roles=" + roles + "&merchantNo=" + basicInfo.merchantNo,
                    type: "get",
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

        renderUserTable() {
            layui.table.render({
                elem: '#user'
                , url: '/merchant/user/list'
                , where: {merchantNo: basicInfo.merchantNo}//测试默认值  应该使用basicInfo.merchantNo
                , cols: [  [
//           {checkbox: true}
                    {field: 'userNo', title: '操作员编码', width: 100}
                    , {field: 'userName', title: '姓名', width: 100}
                    , {field: 'userMobile', title: '手机号', width: 100}
                    , {field: 'idCardNo', title: '身份证号码', width: 100}
                    , {field: 'isActive', title: '启停状态', width: 100}
                    , {field: 'userLevel', title: '操作员类型', width: 100}
                    , {field: 'qrCodeUrl', title: '二维码', width: 100}
                    , {field: 'poperation', title: '操作', width: 240, toolbar: '#barDemo2'}
                ]]
                , page: true
                , done: function (res, curr, count) {
                    $("[data-field='userLevel']").children().each(function () {
                        if ($(this).text() == '1') {
                            $(this).text("管理员");
                        } else if ($(this).text() == '2') {
                            $(this).text("普通用户");
                        }
                    });
                    $("[data-field='isActive']").children().each(function () {
                        if ($(this).text() == '0') {
                            $(this).text("冻结");
                        } else if ($(this).text() == '1') {
                            $(this).text("激活");
                        }
                    });
                    $("[data-field='qrCodeUrl']").children().each(function () {
                        if ($(this).text() !== "二维码") {
                            var url = $(this).text();
                            $('<img>')
                                .css('cursor', 'pointer')
                                .attr('src', url)
                                .height(30)
                                .click(function () {
                                    layer.open({
                                        type: 1,
                                        title: null,
                                        area: ['300px', '300px'],
                                        content: `<img src="${url}">`
                                    });
                                })
                                .appendTo($(this).empty());
                        }
                    });
                }
            });
            layui.table.on('tool(editUserTable)', function (obj) {
                var data = obj.data;
                if (obj.event === 'resetPwd') {
                    layer.confirm('确定要进行重置密码操作吗？', function (index) {
                        $.post("/merchant/user/resetPsw?userNo=" + data.userNo, function (result) {
                            if (result.code == '0000') {
                                layer.msg(result.msg, {
                                    icon: 1,
                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                });
                                tabs.renderUserTable();
                            } else {
                                layer.alert(result.msg, {
                                    icon: 2,
                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                });
                            }
                        });
                    })
                } else if (obj.event === 'update') {
                    layer.open({
                        type: 2,
                        title: '修改操作员',
                        area: ['1100px', '600px'],
                        content: '/merchant/user/initUpdate?userNo=' + data.userNo,
                    })
                } else if (obj.event === 'open') {
                    layer.confirm('确定要进行激活操作吗？', function (index) {
                        $.post("/merchant/user/status?userNo=" + data.userNo + "&isActive=1", function (result) {
                            if (result.code == '0000') {
                                layer.msg(result.msg, {
                                    icon: 1,
                                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                                });
                                tabs.renderUserTable();
                            } else {
                                layer.alert(result.msg, {
                                    icon: 2,
                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                });
                            }
                        });

                    })
                } else if (obj.event === 'close') {
                    layer.confirm('确定要进行冻结操作吗？', function (index) {
                        $.post("/merchant/user/status?userNo=" + data.userNo + "&isActive=0", function (result) {
                            if (result.code == '0000') {
                                layer.msg(result.msg, {
                                    icon: 1,
                                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                                });
                                tabs.renderUserTable();
                            } else {
                                layer.alert(result.msg, {
                                    icon: 2,
                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                });
                            }
                        });
                    })
                }else if (obj.event === 'delete') {
                    layer.confirm('确定要进行删除操作吗？', function (index) {
                        $.post("/merchant/user/delete?userNo=" + data.userNo, function (result) {
                            if (result.code == '0000') {
                                layer.msg(result.msg, {
                                    icon: 1,
                                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                                });
                                tabs.renderUserTable();
                            } else {
                                layer.alert(result.msg, {
                                    icon: 2,
                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                });
                            }
                        });
                    })
                }
            });
        },
        //服务包
        renderServicePack() {
            layui.table.render({
                elem: '#servicePack'
                , url: '/merchant/servicePack/list'
                , where: {merchantNo: basicInfo.merchantNo}
                , cols: [  [
                    {field: 'packName', title: '服务包名称', width: 150, align: 'center'}
                    , {field: 'categoryName', title: '服务分类', width: 100, align: 'center'}
                    , {field: 'isEnabled', title: '启用状态', width: 100, align: 'center'}
                    , {field: 'poperation', title: '操作', width: 100, toolbar: '#barDemo3', align: 'center'}
                ]],
                id: 'listServicePack'
                , page: true
                , done: function (res, curr, count) {
                    $("[data-field='isEnabled']").children().each(function () {
                        if ($(this).text() == '1') {
                            $(this).text("启用");
                        } else if ($(this).text() == '2') {
                            $(this).text("禁用");
                        }
                    });
                }
            });
            layui.table.on('tool(editServicePack)', function (obj) {
                var data = obj.data;
                if (obj.event === 'delService') {
                    layer.confirm('确定要进行删除操作吗？', function (index) {
                        $.post("/merchant/deleteMeStoreService?storeServiceId=" + data.storeServiceId, function (result) {
                            if (result.code == '0000') {
                                layer.msg(result.msg, {
                                    icon: 1,
                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                });
                                tabs.renderServicePack();
                            } else {
                                layer.alert(result.msg, {
                                    icon: 2,
                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                });
                            }
                        });
                    })
                }
            });
        },
        //历史记录
        renderhistoryRecords() {
            layui.table.render({
                elem: '#historyRecords'
                , url: '/merchant/historyRecords/list'
                , where: {merchantNo: basicInfo.merchantNo}
                , cols: [  [
                    {field: 'createUserCode', title: '姓名', width: 150, align: 'center'}
                    , {field: 'operContentCodeStr', title: '操作', width: 100, align: 'center'}
                    , {field: 'operRole', title: '角色', width: 100, align: 'center'}
                    , {field: 'poperation', title: '操作', width: 100, toolbar: '#barDemo4', align: 'center'}
                ]],
                id: 'listhistoryRecords'
                , page: true
                , done: function (res, curr, count) {

                },

            });
            layui.table.on('tool(editHistoryRecords)', function (obj) {
                var data = obj.data;
                parent.tab.tabAdd({"url":"/merchant/historyRecordsview?operRecordNo="+data.operRecordNo,"icon":"","title":"商户详情","id":Date.parse(new Date)});
            });
        },
        selectStoreService() {
            layui.table.reload('listServicePack', {
                where: {
                    packName: $('#packName').val(),
                    categoryId: $('#categoryId').val(),
                    isEnabled: $('#isEnabled').val(),
                    merchantNo: basicInfo.merchantNo
                }
            });
        },
        addStoreService() {
            if (basicInfo.merchantNo == '') {
                layer.open({
                    title: '提示'
                    , content: '请先保存基本信息'
                });
            } else {
                layer.open({
                    type: 2,
                    title: '选择服务包',
                    //btn: ['确定', '取消'],
                    area: ['70%', '90%'],
                    content: ['/merchant/initServicePack?merchantNo=' + basicInfo.merchantNo]
                })
            }
        },
        selectArea() {
            if (basicInfo.merchantNo == '') {
                layer.open({
                    title: '提示'
                    , content: '请先保存基本信息'
                });
            } else {
                layui.table.reload('listReload', {
                    where: {
                        areaInfo: $('#custName').val(),
                        merchantNo: basicInfo.merchantNo
                    }
                });
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
                if (this.innerText == '产品授权') {
                    tabs.renderProductTable();
                } else if (this.innerText == '账户信息') {
                   /* tabs.renderAcctTable();*/
                    tabs.$nextTick(function () {
                        tabs.initViewertwo();
                    })
                } else if (this.innerText == '授信管理') {
                    tabs.renderlimitdetailTable();
                }else if (this.innerText == '返佣规则') {
                    tabs.renderMerchantRebateTable();
                }else if (this.innerText == 'GPS账号配置') {
                    tabs.renderGpsAcctTable();
                } else if (this.innerText == '角色分配') {
                    tabs.renderRoleTable();
                    tabs.readOnlyRoleList();
                } else if (this.innerText == '门店图片') {
                    $.ajaxSettings.async = false;
                    $.post("/merchant/selectMeAttachList?merchantNo=" + basicInfo.merchantNo, function (result) {
                        if (result) {
                            tabs.fileListdoor = result;
                        }
                    });
                    $.ajaxSettings.async = true;
                    tabs.uploadFile();
                    tabs.$nextTick(function () {
                        tabs.initViewer();
                    })
                } else if (this.innerText == '服务包') {
                    tabs.renderServicePack();
                } else if (this.innerText == '操作员管理') {
                    tabs.renderUserTable();
                }
                else if (this.innerText == '历史记录') {
                    tabs.renderhistoryRecords();
                }
            })
        });
    }
});