//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Editors.ReadOnly = ReadOnlyEditor;

  function ReadOnlyEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<span class='editor-text-readonly' />").appendTo(args.container);
      defaultValue = '';
    };

    this.destroy = function () {
      $input.remove();
    };

    this.save = function () {
      // nada
    };

    this.cancel = function () {
      // nada
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

    this.focus = function () { };

    this.setDirectValue = function (val) {
      defaultValue = val;
      if (val == null) val = "";
      $input.text(val);
    };

    this.loadValue = function (item) {
      scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
      $input.select();
    };

    this.serializeValue = function () {
      return defaultValue; // $input.text(); -- make sure the value is NEVER changed, which might happen when it goes 'through the DOM'
    };

    this.applyValue = function (item, state) {
      args.grid.setDataItemValueForColumn(item, args.column, state);
    };

    this.isValueChanged = function () {
      return false;
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

