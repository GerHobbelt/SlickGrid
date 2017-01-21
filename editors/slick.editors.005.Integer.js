//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Editors.Integer = IntegerEditor;

  function IntegerEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type='number' class='editor-integer' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
            if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT) {
              e.stopImmediatePropagation();
            }
          })
          .focus()
          .select();
      defaultValue = 0;
    };

    this.destroy = function () {
      $input.remove();
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
    };

    this.show = function () {
      $input.show();
    };

    this.position = function (position) {
      // nada 
    };

    this.focus = function () {
      $input.focus();
    };

    this.setDirectValue = function (val) {
      val = parseInt(val);
      if (isNaN(val)) val = 0;
      defaultValue = val;
      $input.val(val);
      $input[0].defaultValue = val;
    };

    this.loadValue = function (item) {
      scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
      $input.select();
    };

    this.serializeValue = function () {
      var v = $input.val();
      if (v === '') return 0;
      return parseInt(applyModifier(defaultValue, v), 10) || 0;
    };

    this.applyValue = function (item, state) {
      args.grid.setDataItemValueForColumn(item, args.column, state);
    };

    this.isValueChanged = function () {
      assert(defaultValue != null);
      return $input.val() != (defaultValue + "");
    };

    this.validate = function () {
      var val = this.serializeValue();
      if (isNaN(val) && !isValidModifier(val)) {
        return {
          valid: false,
          msg: "Please enter a valid integer"
        };
      }
      
      if (args.editorConfig && !isNaN(args.editorConfig.minValue) && val < args.editorConfig.minValue) {
        return {
          valid: false,
          msg: 'Please enter a value no less than ' + args.editorConfig.minValue
        };
      }
      
      if (args.editorConfig && !isNaN(args.editorConfig.maxValue) && val > args.editorConfig.maxValue) {
        return {
          valid: false,
          msg: 'Please enter a value no greater than ' + args.editorConfig.maxValue
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

