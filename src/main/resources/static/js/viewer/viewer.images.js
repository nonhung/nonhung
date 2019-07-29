
(function ($) {

  function createImg(src, $ul) {
    var $li = $('<li></li>').appendTo($ul);
    $('<img />')
      .attr('src', src)
      .appendTo($li);
  }

  $.fn.viewerImages = function (options) {
    var options = $.extend({}, options);
    var id = 'viewer-image-' + new Date().getTime() + Math.random();
    var $ul = $(this)
      .attr('id', id)
      .hide()
      .appendTo(document.body);

    if (options.imgUrl) {
      if (typeof options.imgUrl == 'string') {
        options.imgUrl = options.imgUrl.split(',');
      }
      options.imgUrl.map(item => {
        createImg(item, $ul);
      });
      new Viewer(document.getElementById(id), {
        build: function () {
          setTimeout(function () {
            $('li', $ul)
              .first()
              .find('img')
              .trigger('click');
          }, 100);
        }
      });
    } else {
      $('.viewer-image').each(function () {
        var $this = $(this).click(function () {
          $('img[src="'+ src +'"]', $ul).trigger('click');
        });
        var src = $this.attr('src');
        createImg(src, $ul);
      });
      new Viewer(document.getElementById(id));
    }

  }

  $.fn.viewerImages.default = {
    imgUrl: ''
  }

})(jQuery);