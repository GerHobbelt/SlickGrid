//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Editors.Float = FloatEditor;

  function FloatEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;
    
    this.defaultDecimalPlaces = null;
    
    this.init = function () {
      $input = $("<INPUT type='text' class='editor-float' />")
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

    // Returns the number of fixed decimal places or `null`
    this.getDecimalPlaces = function () {
      var rtn = args.column && args.column.editorFixedDecimalPlaces;
      if (!rtn && rtn !== 0) { 
        rtn = this.defaultDecimalPlaces;
      }
      return (!rtn && rtn !== 0 ? null : rtn);
    };
  
    this.setDecimalPlaces = function (d) {
      assert(d == null || d === +d);
      this.defaultDecimalPlaces = d;
      return this;
    };

    // Convert input to number, possibly rounded at the configured number of decimals    
    this.mkValue = function (val) {
      val = parseFloat(val);
      if (isNaN(val)) {
        val = 0;
      }

      var decPlaces = this.getDecimalPlaces();
      if (decPlaces !== null 
          && (val || val === 0) 
          && val.toFixed) { 
        val = parseFloat(val.toFixed(decPlaces));
      }
      return val;
    };
    
    this.setDirectValue = function (val) {
      val = this.mkValue(val);
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
      if (v === '') return 0.0;
      return this.mkValue(applyModifier(defaultValue, v)) || 0.0;
    };

    this.applyValue = function (item, state) {
      args.grid.setDataItemValueForColumn(item, args.column, state);
    };

    this.isValueChanged = function () {
      assert(defaultValue != null);
      return $input.val() != (defaultValue + "");
    };

    this.validate = function () {
      var val = $input.val();
      if (isNaN(val) && !isValidModifier(val)) {
        return {
          valid: false,
          msg: "Please enter a valid numeric value"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }


