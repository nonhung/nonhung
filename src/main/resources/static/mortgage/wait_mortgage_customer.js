layui.use(['table', 'laydate', 'form'], function () {
    var table = layui.table;
    var form = layui.form;
    var laydate = layui.laydate;
    table.render({
        elem: '#dataList'
        , height: 'full-120'
        , url: '/mortgage/mortgageWaitCustomerPage' //数据接口
        , cols: [  [ //表头
            {field: 'loanNo', title: '项目编号', width: 150, sort: false}
            , {field: 'memberName', title: '客户姓名', width: 150, sort: false}
            , {field: 'productName', title: '产品', width: 150}
            , {field: 'packageName', title: '产品套餐', width: 150}
            , {field: 'loanPeriods', title: '期数（月）', width: 150}
            , {field: 'financingAmt', title: '融资金额（元）', width: 150}
            , {field: 'approveLimitAmt', title: '实际放款金额（元）', width: 150}
            , {field: 'loanMode', title: '放款方式', width: 150}
            , {field: 'createTime', title: '创建时间', width: 160}
            , {field: 'poperation', title: '操作', width: '250', fixed: 'right', toolbar: '#barDemo'}
        ]]
        , page: true //开启分页
        , id: 'dataReload'
        , done: function (res, curr, count) {
            $("[data-field='loanMode']").children().each(function () {
                if ($(this).text() == 0){
                    $(this).text("先放款后抵押");
                } else if ($(this).text() == 1) {
                    $(this).text("先放款无抵押");
                }else if($(this).text() == 2){
                    $(this).text("先抵押后放款");
                }
            });
        }
    });
    //监听工具条
    table.on('tool(eventool)', function (obj) {
        var data = obj.data;
        if (obj.event === 'authCard') {
            layer.open({
                type: 2
                ,title: '权证信息'
                ,area: ['70%', '90%']
                ,content: ['/mortgage/uploadAuthCard?loanNo='+data.loanNo]
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
                    memberName: $('#memberName').val(),
                    productNo: $('#productNo').val(),
                    applyTimeStr: $('#applyTimeStr').val(),
                }
            });
        }
    };
    $('.searchTable .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    laydate.render({
        elem: '#applyTimeStr'
        , type: 'date'
        , range: '-'
        , format: 'yyyy/MM/dd'
    });
});