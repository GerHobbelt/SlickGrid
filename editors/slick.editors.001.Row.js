//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Editors.RowMulti = RowEditor;

  function RowEditor(args) {
    var theEditor;
    var scope = this;

    this.init = function () {
      //var data = args.grid.getData();
      if (args.item.editor === undefined)
        theEditor = new ReadOnlyEditor(args);
      else
        theEditor = new (args.item.editor)(args);
    };

    this.destroy = function () {
      theEditor.destroy();
    };

    this.save = function () {
      theEditor.save();
    };

    this.cancel = function () {
      theEditor.cancel();
    };

    this.hide = function () {
      theEditor.hide();
    };

    this.show = function () {
      theEditor.show();
    };

    this.position = function (position) {
      theEditor.position(position);
    };

    this.focus = function () {
      theEditor.focus();
    };

    this.setDirectValue = function (val) {
      theEditor.setDirectValue(val);
    };

    this.loadValue = function (item) {
      theEditor.loadValue(item);
    };

    this.serializeValue = function () {
      return theEditor.serializeValue();
    };

    this.applyValue = function (item, state) {
      theEditor.applyValue(item, state);
    };

    this.isValueChanged = function () {
      return theEditor.isValueChanged();
    };

    this.validate = function () {
      return theEditor.validate();
    };

    this.init();
  }



