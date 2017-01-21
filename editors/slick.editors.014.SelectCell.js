//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Editors.Combo = SelectCellEditor;
  Slick.Editors.SelectCell = SelectCellEditor;

  function SelectCellEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;
    var opt;

    function getKeyFromKeyVal(opt, val) {
      var i, v, index = 0;

      for (i in opt) {
        v = opt[i];
        if (v.val === val) {
          index = i;
          break;
        }
      }
      return index;
    }

    this.init = function() {
      var i;

      defaultValue = null;
      opt = (args.metadataColumn && args.metadataColumn.options) || args.column.options;
      assert(opt);
      opt = typeof opt === 'function' ? opt.call(args.column) : opt;
      assert(opt);

      option_str = [];
      for (i in opt) {
        v = opt[i];
        option_str.push("<OPTION value='" + (v.key == null ? v.id : v.key) + "'>" + (v.value == null ? v.label : v.value) + "</OPTION>");
      }
      $select = $("<SELECT tabIndex='0' class='editor-select'>" + option_str.join('') + "</SELECT>")
       .appendTo(args.container)
       .focus()
       .select();

      // this expects the multiselect widget (http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/) to be loaded
      $select.multiselect({
        autoOpen: true,
        minWidth: $(args.container).innerWidth() - 5,
        multiple: false,
        header: false,
        noneSelectedText: "...",
        classes: "editor-multiselect",
        selectedList: 1,
        close: function(event, ui) {
          //args.grid.getEditorLock().commitCurrentEdit();
        }
      });
    };

    this.destroy = function() {
      $select.multiselect("destroy");
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

    this.focus = function() {
      $select.focus();
    };

    this.setDirectValue = function (val) {
      var key = getKeyFromKeyVal(opt, val);
      key = opt[key].key;
      defaultValue = key;
      $select.val(key);
      $select.multiselect("refresh");
    };

    this.loadValue = function (item) {
      scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
      $select.select();
    };

    this.serializeValue = function () {
      return $select.val();
    };

    this.applyValue = function (item, state) {
      args.grid.setDataItemValueForColumn(item, args.column, state);
    };

    this.isValueChanged = function() {
      return scope.serializeValue() != defaultValue;
    };

    this.validate = function() {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

