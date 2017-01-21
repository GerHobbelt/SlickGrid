//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Editors.PercentageComplete = PercentCompleteEditor;

  function PercentCompleteEditor(args) {
    var $input, $picker, $helper;
    var defaultValue;
    var scope = this;

    this.init = function () {
      defaultValue = 0;

      $input = $("<INPUT type='text' class='editor-percentcomplete' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
            if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT) {
              e.stopImmediatePropagation();
            }
          })
          .focus()
          .select();

      $input.outerWidth($(args.container).innerWidth() - 25);

      $picker = $("<div class='editor-percentcomplete-picker' />").appendTo(args.container);

      var $body = $("body");

      $helper = $("\n" +
        "<div class='editor-percentcomplete-helper'>\n" +
        "  <div class='editor-percentcomplete-wrapper'>\n" +
        "    <div class='editor-percentcomplete-slider'>\n" +
        "    </div>\n" +
        "    <div class='editor-percentcomplete-buttons'>\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>").appendTo($body);

      $helper.find(".editor-percentcomplete-buttons")
      .append("<button val='0'>Not started</button>\n" +
        "<br/>\n" +
        "<button val='50'>In Progress</button>\n" +
        "<br/>\n" +
        "<button val='100'>Complete</button>");

      $helper.find(".editor-percentcomplete-slider").slider({
        orientation: "vertical",
        range: "min",
        value: defaultValue,
        slide: function (event, ui) {
          $input.val(ui.value);
        }
      });

      $picker.click(function(e) {
        //$helper.toggle();
        $helper.show();
        if ($helper.is(":visible")) {
          $helper.position({
            my: "left top",
            at: "right top",
            of: $picker,
            collision: "flipfit"
          });
        }
      });
      //$helper.blur(function (e) {
      //  $helper.hide();
      //});

      $helper.find(".editor-percentcomplete-buttons button").bind("click", function (e) {
        $input.val($(this).attr("val"));
        $helper.find(".editor-percentcomplete-slider").slider("value", $(this).attr("val"));
      });
    };

    this.destroy = function () {
      $input.remove();
      $picker.remove();
      $helper.remove();
    };

    this.save = function () {
      args.commitChanges();
    };

    this.cancel = function () {
      this.setDirectValue(defaultValue);
      args.cancelChanges();
    };

    this.hide = function () {
      $input.hide();
      $picker.hide();
      $helper.hide();
    };

    this.show = function () {
      $input.show();
      $picker.show();
      $helper.show();
    };

    this.position = function (position) {
      // nada 
    };

    this.focus = function () {
      $input.focus();
    };

    this.setDirectValue = function (val) {
      val = parseFloat(val);
      if (isNaN(val)) val = 0;
      defaultValue = val;
      $input.val(val);
      $helper.find(".editor-percentcomplete-slider").slider("value", val);
    };

    this.loadValue = function (item) {
      scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
      $input.select();
    };

    this.serializeValue = function () {
      return parseInt($input.val(), 10) || 0;
    };

    this.applyValue = function (item, state) {
      args.grid.setDataItemValueForColumn(item, args.column, state);
    };

    this.isValueChanged = function () {
      assert(defaultValue != null);
      return (parseInt($input.val(), 10) || 0) != defaultValue;
    };

    this.validate = function () {
      if (isNaN(parseInt($input.val(), 10))) {
        return {
          valid: false,
          msg: "Please enter a valid positive number"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

