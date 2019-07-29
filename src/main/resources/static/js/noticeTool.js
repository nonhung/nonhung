document.write("<style>#noticeTool-container{max-height:400px;overflow:auto;padding:15px 20px 10px;}#noticeTool-container li{height:32px;}#noticeTool-container li > .layui-btn{float:right;}</style>");

(function ($) {

  $.fn.noticeTool = function (options) {

    function Plugin(element, options) {
      var elementId = 'noticeTool-container';
      this.element = '#' + elementId;
      this.options = $.extend({}, $.fn.noticeTool.defaults, options);

      this.msgListToHtml = function () {
        var html = '';
        this.options.msgList.map(item => {
          html += `<li data-item='${JSON.stringify(item)}'>
            <a href="javascript:">${item.text}</a>
            <a class="layui-btn layui-btn-xs">查看</a>
          </li>`;
        });
        return html;
      };

      this.position = function () {
        var $dialog = $(this.element).parents('.layui-layer');
        if (!$('li', this.element).length) {
          $dialog.remove();
        } else {
          $dialog.css({
            'top': (document.documentElement.clientHeight - $dialog.outerHeight()) + 'px',
            'left': (document.documentElement.clientWidth - $dialog.outerWidth()) + 'px'
          });
        }
      };

      this.viewNotice = function () {
        var _this = this;
        $('li', this.element).each(function () {
          var $li = $(this);
          $('a', $li).off('click').click(function () {
            $li.remove();
            _this.position();
            _this.options.click(JSON.parse($li.attr('data-item')));
          });
        })
      };

      this.playNoticeMusic = function () {
        var playButton = $('<div></div>').appendTo(document.body);
        var _this = this;
        new SimpleAudio({
          src: _this.options.musicUrl,
          element: playButton,
          setPlay:function(){
            $(playButton).trigger('click');
          },
          setPause:function(){}
        });
      };

      this.init = function () {
        if (this.options.msgList && this.options.msgList.length) {
          var html = this.msgListToHtml();
          var _this = this;
          if ($(this.element) && !$(this.element).length) {
            layui.layer.open({
              area: _this.options.width + 'px',
              type: 1,
              title: '消息提醒',
              content: `<div style="width: ${_this.options.width - 40}px" id="${elementId}">
                <ul style="width: ${_this.options.width - 40}px">${_this.msgListToHtml()}</ul>
              </div>`,
              shade: 0,
              offset: 'rb',
              anim: 2
            });
          } else {
            if (this.options.msgAddMode == 'html') {
              $(this.element).find('ul').html(html);
            }
            if (this.options.msgAddMode == 'append') {
              $(this.element).find('ul').append(html);
            }
            this.position();
          }
          if (this.options.musicUrl) {
            this.playNoticeMusic();
          }
          if (this.options.click) {
            this.viewNotice();
          }
        }
      }
    }

    return new Plugin(this, options).init();

  };

  $.fn.noticeTool.defaults = {
    width: 400,
    msgList: [],
    msgAddMode: 'html',
    musicUrl: ''
  }

})(jQuery);