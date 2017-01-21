//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Editors.YesNoSelect = YesNoSelectEditor;

  function YesNoSelectEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>")
          .appendTo(args.container)
          .focus()
          .select();
    };

    this.destroy = function () {
      $select.remove();
    };

    this.save = function () {
      args.commitChanges();
    };

    this.cancel = function () {
      this.setDirectValue(defaultValue);
      args.cancelChanges();
    };

    this.hide = function () {
      $select.hide();
    };

    this.show = function () {
      $select.show();
    };

    this.position = function (position) {
      // nada 
    };

    this.focus = function () {
      $select.focus();
    };

    this.setDirectValue = function (val) {
      val = !!val;
      defaultValue = val;
      $select.val(val ? "yes" : "no");
    };

    this.loadValue = function (item) {
      scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
      $select.select();
    };

    this.serializeValue = function () {
      return ($select.val() === "yes");
    };

    this.applyValue = function (item, state) {
      args.grid.setDataItemValueForColumn(item, args.column, state);
    };

    this.isValueChanged = function () {
      return scope.serializeValue() != defaultValue;
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

