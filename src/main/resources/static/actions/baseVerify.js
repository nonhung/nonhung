layui.use('form', function () {
    var form = layui.form;
    form.verify({
        moneyFormat: function (value, item) {
            //金额格式
            if(value){
                if (!new RegExp("^(([1-9]\\d*(\\.\\d{1,2})?)|(0(\\.\\d[1-9]{1})?)|(0(\\.\\d{1})?)|(0(\\.[1-9]{1}\\d{1})?))$").test(value)) {
                    return '请输入大于0的数字，只能保留2位小数！';
                }
            }
        },
        percentFormat: function (value, item) {
            //百分比格式
            if (!new RegExp("^(([1-9]\\d{0,2}(\\.\\d{1,2})?)|(0(\\.\\d[1-9]{1})?)|(0(\\.\\d{1})?)|(0(\\.[1-9]{1}\\d{1})?))$").test(value)) {
                return '只能输入0.01-999.99的数字！';
            }
        },
        socialCreditCode: function(value){
            if(value.length < 18){
                return '统一社会信用代码至少为18位';
            };
            if(value.length > 40){
                return '统一社会信用代码最多为40位';
            };
            var str=/^[A-Z\d]+$/;
            if(null==value.match(str)){
                return '统一社会信用代码只能为数字和大写字母'
            }
        },
        idCardNo: function (value) {
            if(value){
                if (!new RegExp("^(\\d{15}$)|(^\\d{17}(x|X|\\d)$)").test(value)) {
                    return '请输入正确的身份证号';
                }
            }

        },
        mobilePhone: function (value) {
            var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
            if (!myreg.test(value)) {
                return '请输入正确的手机号';
            }

        }
    });
});