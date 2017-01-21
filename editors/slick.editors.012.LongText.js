//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Editors.LongText = LongTextEditor;

  /*
   * An example of a "detached" editor.
   * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
   * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
   */
  function LongTextEditor(args) {
    var $input, $wrapper, $picker, $wrapped_input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<TEXTAREA type='text' class='editor-longtext-basic-input' rows='1' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
            if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT) {
              e.stopImmediatePropagation();
            }
          });

      $input.width($(args.container).innerWidth() - 6);   // textarea with 'resize:none' keeps space at right; we move the edit icon over it...

      $picker = $("<div class='editor-longtext-icon' />").appendTo(args.container);

      var $container = $("body");

      $wrapper = $("<DIV class='slick-editor-longtext' />")
          .appendTo($container);

      $wrapped_input = $("<TEXTAREA rows='5'>")
          .appendTo($wrapper);

      $("<DIV class='buttons-container'><BUTTON class='save-button'>Save</BUTTON><BUTTON class='cancel-button'>Cancel</BUTTON></DIV>")
          .appendTo($wrapper);

      $wrapper.find("button.save-button").bind("click", scope.save);
      $wrapper.find("button.cancel-button").bind("click", scope.cancel);
      $wrapped_input.bind("keydown", scope.handleKeyDown);

      assert(args.container);
      $picker.click(function(e) {
        if (!$wrapper.is(":visible")) {
          showPanel();
        } else {
          hidePanel();
        }
      });
      //$wrapper.blur(function (e) {
      //  hidePanel();
      //});

      $input.focus().select();

      defaultValue = '';
    };

    this.handleKeyDown = function (e) {
      if (e.which == Slick.Keyboard.ENTER && e.ctrlKey) {
        scope.save();
      } else if (e.which == Slick.Keyboard.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == Slick.Keyboard.TAB && e.shiftKey) {
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == Slick.Keyboard.TAB) {
        e.preventDefault();
        args.grid.navigateNext();
      }
    };

    this.save = function () {
      args.commitChanges();
    };

    this.cancel = function () {
      $input.val(defaultValue);
      $wrapped_input.val(defaultValue);
      args.cancelChanges();
    };

    function hidePanel() {
      $input.prop('readonly', null);
      $input.val($wrapped_input.val());

      $wrapper.hide();
    }

    function showPanel() {
      // mark regular input as readonly and copy its content into the panel textarea:
      $input.prop('readonly', true);
      $wrapped_input.val($input.val());

      $wrapper.show();

      scope.position(args);
    }

    this.hide = function () {
      hidePanel();
    };

    this.show = function () {
      showPanel();
    };

    /*
     * info: {
     *         gridPosition: getGridPosition(),
     *         position: cellBox,
     *         container: activeCellNode
     *       }
     */
    this.position = function (info) {
      if ($wrapper.is(":visible")) {
        $wrapper.position({
          my: "left top+2",
          at: "left bottom",
          of: info.container,
          collision: "flipfit"
        });
      }
    };

    this.destroy = function () {
      $wrapper.remove();
      $picker.remove();
      $input.remove();
    };

    this.focus = function () {
      if ($wrapper.is(":visible")) {
        $wrapped_input.focus();
      } else {
        $input.focus();
      }
    };

    this.setDirectValue = function (val) {
      if (val == null) val = "";
      val += "";
      defaultValue = val;
      $input.val(val);
      $wrapped_input.val(val);
    };

    this.loadValue = function (item) {
      scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
      $input.select();
    };

    function getValue() {
      var rv;
      if ($wrapper.is(":visible")) {
        rv = $wrapped_input.val();
      } else {
        rv = $input.val();
      }
      return rv;
    }

    this.serializeValue = function () {
      return getValue();
    };

    this.applyValue = function (item, state) {
      args.grid.setDataItemValueForColumn(item, args.column, state);
    };

    this.isValueChanged = function () {
      assert(defaultValue != null);
      return getValue() != defaultValue;
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }



