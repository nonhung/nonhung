var viewer = null;
var rebates = new Vue({
    el: '#basicInfo',
    data() {
        return {
            rebate: '',
        }
    },

    methods: {
        renderAreaTable1() {
            layui.table.render({
                elem: '#id1',
                url: '/rebateDetail/queryRebate',
                where: {rebateFixedNo: rebates.rebateFixedNo,fixedNo:rebates.fixedNo,rebateType:'1'},
                id: 'id1',
                page: true,
                cols: [
                    [
                        {field: 'loanNo', title: '项目编号', width: 140, sort: false, align: 'center'},
                        {field: 'memberName', title: '会员名称', width: 120, sort: false, align: 'center'},
                        {field: 'productName', title: '产品名称', width: 120, sort: false, align: 'center'},
                        {field: 'approveLimitAmtStr', title: '实际放款金额（元）', width: 300, sort: false, align: 'center'},
                        {field: 'approveTime', title: '放款时间', width: 300, sort: false, align: 'center'},
                        {field: 'rebateAmtStr', title: '当月返佣金额（元）', width: 120, sort: false, align: 'center'},
                        {field: 'rebateStatusStr', title: '状态', width: 120, sort: false, align: 'center'}
                    ]
                ],
                done: function (res, curr, count) {
                }
            });
        },
        renderAreaTable2() {
            layui.table.render({
                elem: '#id1',
                url: '/rebateDetail/queryRebate',
                where: {rebateFixedNo: rebates.rebateFixedNo,fixedNo:rebates.fixedNo,rebateType:'2'},
                id: 'id1',
                page: true,
                cols: [
                    [
                        {field: 'loanNo', title: '项目编号', width: 140, sort: false, align: 'center'},
                        {field: 'memberName', title: '会员名称', width: 120, sort: false, align: 'center'},
                        {field: 'productName', title: '产品名称', width: 120, sort: false, align: 'center'},
                        {field: 'approveLimitAmtStr', title: '实际放款金额（元）', width: 300, sort: false, align: 'center'},
                        {field: 'approveTime', title: '放款时间', width: 300, sort: false, align: 'center'},
                        {field: 'rebateAmtStr', title: '当月返佣金额（元）', width: 120, sort: false, align: 'center'},
                        {field: 'rebateStatusStr', title: '状态', width: 120, sort: false, align: 'center'}
                    ]
                ],
                done: function (res, curr, count) {
                }
            });
        },
        renderAreaTable3() {
            layui.table.render({
                elem: '#id1',
                url: '/rebateDetail/queryRebate',
                where: {rebateFixedNo: rebates.rebateFixedNo,fixedNo:rebates.fixedNo,rebateType:'3'},
                id: 'id1',
                page: true,
                cols: [
                    [
                        {field: 'deductName', title: '扣除名称', width: 200, sort: false, align: 'center'},
                        {field: 'deductAmt', title: '扣除金额（元）', width: 300, sort: false, align: 'center'},
                        {field: 'createUserCode', title: '操作人', width: 200, sort: false, align: 'center'},
                        {field: 'gmtCreate', title: '操作时间', width: 300, sort: false, align: 'center'}
                    ]
                ],
                done: function (res, curr, count) {
                }
            });
        }
    },
    mounted() {
        layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'upload'], function () {
            rebates.renderAreaTable1();
            layui.element.on('tab(mainTab)', function (data) {
                if (this.innerText == '当期返佣明细') {
                    rebates.renderAreaTable1()
                } else if (this.innerText == '扣回佣金明细') {
                    rebates.renderAreaTable2()
                } else if (this.innerText == '其它扣除明细') {
                    rebates.renderAreaTable3();
                }
            })
       } )
   }
});