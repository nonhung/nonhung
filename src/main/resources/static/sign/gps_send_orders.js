layui.use(['table', 'laydate', 'form'], function () {
    var table = layui.table;
    var form = layui.form;
    var laydate = layui.laydate;
    table.render({
        elem: '#dataList'
        , height: 'full-120'
        , url: '/order/gps/gpsSendOrdersList' //数据接口
        , cols: [  [ //表头
            {field: 'loanNo', title: '项目编号', width: '180', sort: false}
            , {field: 'memberName', title: '客户姓名', width: '120', sort: false}
            , {field: 'productName', title: '产品', width: '130'}
            , {field: 'carPlateNo', title: '车牌号', width: '130'}
            , {field: 'carModelName', title: '品牌型号', width: '250'}
            , {field: 'carFrameNo', title: '车架号', width: '150'}
            // , {field: 'gmtCreate', title: '创建时间', width: '170'}
            // , {field: 'workOrderNo', title: '工单号', width: '150'}
            // , {field: 'vendorName', title: 'GPS供应商', width: '180'}
            // , {field: 'gpsSendStateStr', title: '派单状态', width: '120'}
            // , {field: 'sendReturnRemark', title: '备注', width: '120'}
            , {field: 'poperation', title: '操作', width: '100', toolbar: '#barDemo'}
        ]]
        , page: true //开启分页
        , id: 'dataReload'
        , done: function (res, curr, count) {
        }

    });
    //监听工具条
    table.on('tool(eventool)', function (obj) {
        var data = obj.data;
        // console.log('/order/gps/gpsSendOrderChoiceVendor?loanNo=' + data.loanNo);
        if (obj.event === 'edit') {
            layer.open({
                type: 2,
                title: 'GPS派单',
                area: ['660px', '530px'],
                content: '/order/gps/gpsSendOrderChoiceVendor?loanNo=' + data.loanNo,
                end: function () {
                    table.reload('dataReload', {});
                }
            });

        }
    })
    var $ = layui.$, active = {
        reload: function () {
            //执行重载
            table.reload('dataReload', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {
                    id: '',
                    loanNo: $('#loanNo').val(),
                    searchText: $('#searchText').val(),
                    productNo: $('#productNo').val(),
                    createTimeStr: $('#createTimeStr').val(),
                    // workOrderNo: $('#workOrderNo').val(),
                    // vendorName: $('#vendorName').val(),
                    // gpsSendState: $('#gpsSendState').val(),
                }

            });

        }
    };
    $('.searchTable .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    // laydate.render({
    //     elem: '#createTimeStr'
    //     , type: 'date'
    //     , range: '-'
    //     , format: 'yyyy-MM-dd'
    // });

});