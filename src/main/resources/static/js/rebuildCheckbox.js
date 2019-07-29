$(document.body).append("<style>.layui-table-view .layui-form-checkbox { display: none;}</style>");

var layuiCheckbox = {
  getTable: function (element = '') {
    return $(element).siblings('.layui-form').find('.layui-table');
  },
  setChecked: function (element, checked = ['ifCheck', '1']) {
    var _this = this;
    var data = $(element).data('data-source');
    data.map((item, index) => {
       if (item[checked[0]] && item[checked[0]] === checked[1]) {
          $(_this.getTable(element))
            .last()
            .find('tr')
            .eq(index)
            .find('input.selectsingle[type="checkbox"]')
            .trigger('click');
       }
    });
  },
  getChecked: function (element, field = 'id') {
    var data = $(element).data('data-source');
    var checkedResult = [];
    $('input.selectsingle[type="checkbox"]:checked', this.getTable(element)).each(function () {
      if (field == 'getAll') {
        checkedResult.push(data[$(this).parents('tr').attr('data-index')]);
      } else {
        checkedResult.push(data[$(this).parents('tr').attr('data-index')][field]);
      }
    });
    return checkedResult;
  },
  rebuild: function (element, data, checked) {
    var _this = this;
    _this.init(element, data);
    $('input[type="checkbox"][name="layTableCheckbox"]', _this.getTable(element)).each(function () {
      var $this = $(this);
      var isDisabled = $this.is(':disabled');
      var $layuiCheckbox = $this.siblings('.layui-unselect');
      var $checkbox = $('<input type="checkbox">')
        .show()
        .css({
          'width': '18px',
          'height': '18px',
          'vertical-align': 'middle'
        })
        .attr('disabled', isDisabled)
        .click(function () {
          if ($checkbox.hasClass('selectall')) {
            if ($checkbox.is(':checked')) {
              $('input.selectsingle:not(:checked)', _this.getTable(element)).trigger('click');
            } else {
              $('input.selectsingle:checked', _this.getTable(element)).trigger('click');
            }
          } else {
            $layuiCheckbox.trigger('click');
          }
        });
      $('<div class="rebuild"></div>')
        .append($checkbox)
        .prependTo($(this).parent('.layui-table-cell'));
      if ($this.attr('lay-filter')) {
        $checkbox.addClass('selectall');
      } else {
        $checkbox.addClass('selectsingle');
      }
    });
    _this.setChecked(element, checked);
  },
  init: function (element, data) {
    $(element).data('data-source', data);
    var $rebuild = $('.rebuild', this.getTable(element));
    if ($rebuild && $rebuild.length) {
      $rebuild.remove();
    }
  }
}