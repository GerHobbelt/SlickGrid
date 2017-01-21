//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Editors.Percentage = PercentageEditor;

  function PercentageEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    function roundPerunage(v) {
      return Math.round(v * 1E6) / 1E6;
    }

    function stringToPerunage(val) {
      var multiplier = 1;
      val += "";
      if (val.charAt(val.length - 1) === '%') {
        val = val.slice(0, -1);    // remove also the % char if it is there
        multiplier = 100;
      }
      // what remains must be a number
      val = roundPerunage(parseFloat(val) / multiplier);
      if (isNaN(val)) val = 0;
      return val;
    }

    this.init = function () {
      $input = $("<INPUT type='text' class='editor-percentage' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
            if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT) {
              e.stopImmediatePropagation();
            }
          })
          .focus()
          .select();
      defaultValue = '';
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
      val = stringToPerunage(val);
      val = (val * 100) + " %";
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
      var sv = stringToPerunage(defaultValue) * 100;
      return stringToPerunage(applyModifier(sv, v) / 100) || 0;
    };

    this.applyValue = function (item, state) {
      args.grid.setDataItemValueForColumn(item, args.column, state);
    };

    this.isValueChanged = function () {
      assert(defaultValue != null);
      return $input.val() != defaultValue;
    };

    this.validate = function () {
      var val = $input.val();
      if (val.charAt(val.length - 1) === '%') {
        val = val.slice(0, -1);    // remove also the % char if it is there
      }
      if (isNaN(val) && !isValidModifier(val)) {
        return {
          valid: false,
          msg: "Please enter a valid percentage"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }


