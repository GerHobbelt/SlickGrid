  // register namespace
  Slick.Editors.Checkbox = CheckboxEditor;

  function CheckboxEditor(args) {
    var $select;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $select = $("<INPUT type='checkbox' value='true' class='editor-checkbox' hideFocus='true'>")
          .appendTo(args.container)
          .focus()
          .select();
      defaultValue = false;
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
      $select.prop('checked', val);
    };

    this.loadValue = function (item) {
      scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
      $select.select();
    };

    this.serializeValue = function () {
      return $select.prop('checked');
    };

    this.applyValue = function (item, state) {
      args.grid.setDataItemValueForColumn(item, args.column, state);
    };

    this.isValueChanged = function () {
      assert(defaultValue != null);
      return this.serializeValue() !== defaultValue;
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

