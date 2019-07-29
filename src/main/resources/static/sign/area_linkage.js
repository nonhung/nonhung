
// 选择省份加载市列表
layui.use('form', function(){
    var form = layui.form;
    // 加载省份列表
    $.ajax({
        url: "/mortgage/list?code=100000",
        type: "get",
        dataType: "json",
        success: function (data) {
            if(data.reCode == "0000"){
                $('#provinceName').html('');
                var options = "<option value=''>请选择省</option>";
                $(data.body).each(function(i,val) {
                    options = options + "<option value=\"" + val.regionCode+","+val.regionName+ "\" >" + val.regionName + "</option>";
                });
                $('#provinceName').append(options);

                try{
                    if (provinceVal) {
                        $('#provinceName').val(provinceVal);
                    }
                }catch(e){
                }

                form.render('select');
            }else {
                layer.open({
                    title: '消息'
                    ,content: data.reMsg
                });
            }
        },
        error: function (msg) {
            layer.open({
                title: '消息'
                ,content: '请求出错'
            });
        }
    })
    //注册地址下拉选择
    form.on('select(provinceName)', function(data){
        if(data.value == ''){
            layer.open({
                title: '消息'
                ,content: '请选择省份'
            });
            return false;
        }

        var _data = data.value.split(",");
        $('#pCode').val(_data[0]);
        $('#pName').val(_data[1]);

        $.ajax({
            url: "/mortgage/list?code="+_data[0],
            type: "get",
            dataType: "json",
            success: function (data) {
                if(data.reCode == "0000"){
                    $('#cityName').html('');
                    $('#districtName').html('');
                    // if ($('#shopNameDev')) {
                    //     $('#shopName').val("");
                    //     $('#shopNameDev').addClass('layui-hide');
                    // }
                    // if ($('#vendor')){
                    //     $('#vendor').html('');
                    //     $('#vendorNo').val('');
                    //     $('#vendorName').val('');
                    // }


                    var options = "<option value=''>请选择市</option>";
                    $(data.body).each(function(i,val) {
                        options = options + "<option value=\"" + val.regionCode+","+val.regionName+ "\" >" + val.regionName + "</option>";
                    });
                    $('#cityName').append(options);
                    form.render('select');
                }else {
                    layer.open({
                        title: '消息'
                        ,content: data.reMsg
                    });
                }
            },
            error: function (msg) {
                layer.open({
                    title: '消息'
                    ,content: '请求出错'
                });
            }
        })
    });

    // 选择市加载区域列表
    form.on('select(cityName)', function(data){
        console.log(data.value); //得到被选中的值
        if(data.value == ''){
            layer.open({
                title: '消息'
                ,content: '请选择城市'
            });
            return false;
        }

        var _data = data.value.split(",");
        $('#cCode').val(_data[0]);
        $('#cName').val(_data[1]);

        $.ajax({
            url: "/mortgage/list?code="+_data[0],
            type: "get",
            dataType: "json",
            success: function (data) {
                if(data.reCode == "0000"){
                    $('#districtName').html('');
                    var options = "<option value=''>请选择区</option>";
                    $(data.body).each(function(i,val) {
                        options = options + "<option value=\"" + val.regionCode+","+val.regionName+ "\" >" + val.regionName + "</option>";
                    });
                    $('#districtName').append(options);
                    form.render('select');
                }else {
                    layer.open({
                        title: '消息'
                        , content: data.obj.reMsg
                    });
                }
            },
            error: function (msg) {
                layer.open({
                    title: '消息'
                    ,content: '请求出错'
                });
            }
        })
    });

    // 选择区下拉框后给隐藏input赋值
    form.on('select(districtName)', function(data){
        if(data.value != ''){
            var _data = data.value.split(",");
            $('#dCode').val(_data[0]);
            $('#dName').val(_data[1]);
        }
    });
});