/*!
 * @license
 * slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
 * Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
 *
 * Distributed under MIT license.
 * All rights reserved.
 */




(function ($) {
  $.extend(true, window, {
    Slick: {
      Editors: {
        ImageEditor: ImageEditor,
      }
    }
  });

  function ImageEditor(args) {
    var $input, $images, $wrapper;

    this.init = function () {
      //console.log(args);
    };

    this.destroy = function () {
      // facybox auto destroyed
    };

    this.focus = function () {
      $input.focus();
    };

    this.getValue = function () {
      return $input.val();
    };

    this.setValue = function (val) {
      $input.val(val);
    };

    this.loadValue = function (item) {
      var images = item[args.column.field];
      var image;
      var $facy, $add, $image, $delete, $update, $url;

      if (args.grid.recentEvent) {  // get exact image
        var e = args.grid.recentEvent;
        image = $(e.target).is('img') ? $(e.target).prop('src') : null;
      } else {  // just get the first one
        image = images.length > 0 ? images[0] : null;
      }

      if (image) {
        $.facybox('<div>' +
                    '<img src="' + image + '" /><br />' +
                    '<input type="button" name="delete" value="Delete" /> or &nbsp;' +
                    '<input type="text" name="url" data-default="' + image + '" value="' + image + '" style="width:360px" /> ' +
                    '<input type="button" name="update" value="Update" />' +
                  '</div>');

        $facy = $('#facybox');
        $image = $facy.find('img');
        $delete = $facy.find('input[name=delete]');
        $update = $facy.find('input[name=update]');
        $url = $facy.find('input[name=url]');

        $(document).bind('afterClose.facybox', function() {
          args.grid.resetActiveCell();
        });

        $update.click(function() {
          var index = images.indexOf($url.data('default'));
          if (index != -1) {
            images[index] = $.trim($url.val());
          }
          $(document).trigger('close.facybox');
        })

        $delete.click(function() {
          $url.val('');
          $update.trigger('click');
        })

      } else {  // empty cell
        $.facybox('<div id="popup">' +
                    '<input type="text" name="url" value="" style="width:360px" /> ' +
                    '<input type="button" name="add" value="Add" />' +
                  '</div>');

        $facy = $('#facybox');
        $add = $facy.find('input[name=add]');
        $url = $facy.find('input[name=url]');

        $(document).bind('afterClose.facybox', function() {
          args.grid.resetActiveCell();
        });

        $add.click(function() {
          images.push($.trim($url.val()));
          $(document).trigger('close.facybox');
        })
      }
    };

    this.serializeValue = function () {
    };

    this.applyValue = function (item, state) {
    };

    this.isValueChanged = function () {
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }
})(jQuery);
