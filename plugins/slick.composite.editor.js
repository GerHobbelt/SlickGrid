/*!
 * @license
 * slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
 * Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
 *
 * Distributed under MIT license.
 * All rights reserved.
 */




(function ($) {
  "use strict";

  $.extend(true, window, {
    Slick: {
      CompositeEditor: CompositeEditor
    }
  });


// TODO:
//
// Do NOT open all field editors all at once, but manage them: show/open only the active one and close others.
//
// That should fix the current ugliness where all editor overlays all show up at once and are a mess, visually.
//


  /***
   * A composite SlickGrid editor factory.
   * Generates an editor that is composed of multiple editors for given columns.
   * Individual editors are provided given containers instead of the original cell.
   * Validation will be performed on all editors individually and the results will be aggregated into one
   * validation result.
   *
   *
   * The returned editor will have its prototype set to CompositeEditor, so you can use the "instanceof" check.
   *
   * NOTE:  This doesn't work for detached editors since they will be created and positioned relative to the
   *        active cell and not the provided container.
   *
   * @namespace Slick
   * @class CompositeEditor
   * @constructor
   * @param columns {Array} Column definitions from which editors will be pulled.
   * @param containers {Array} Container HTMLElements in which editors will be placed.
   * @param options {Object} Options hash:
   *  validationFailedMsg     -   A generic failed validation message set on the aggregated validation resuls.
   *  hide                    -   A function to be called when the grid asks the editor to hide itself.
   *  show                    -   A function to be called when the grid asks the editor to show itself.
   *  position                -   A function to be called when the grid asks the editor to reposition itself.
   *  destroy                 -   A function to be called when the editor is destroyed.
   */
  function CompositeEditor(columns, containers, options) {
    var defaultOptions = {
      validationFailedMsg: "Some of the fields have failed validation",
      show: null,
      hide: null,
      position: null,
      destroy: null
    };

    var noop = function () {
    };

    var firstInvalidEditor;

    options = $.extend({}, defaultOptions, options);


    function getContainerBox(i) {
      var c = containers[i];
      var offset = $(c).offset();
      var w = $(c).width();
      var h = $(c).height();

      return {
        top: offset.top,
        left: offset.left,
        bottom: offset.top + h,
        right: offset.left + w,
        width: w,
        height: h,
        visible: true
      };
    }


    function editor(args) {
      var editors = [];

      this.init = function () {
        var newArgs = {};
        var idx = columns.length;
        while (idx--) {
          if (columns[idx].editor) {
            newArgs = $.extend({}, args);
            newArgs.container = containers[idx];
            newArgs.column = columns[idx];
            newArgs.position = getContainerBox(idx);
            newArgs.commitChanges = noop;
            newArgs.cancelChanges = noop;

            editors[idx] = new (columns[idx].editor)(newArgs);
          }
        }
      }

      this.destroy = function () {
        var idx = editors.length;
        while (idx--) {
          editors[idx].destroy();
        }

        options.destroy && options.destroy();
      };

      this.save = function () {
        var idx = editors.length;
        while (idx--) {
          editors[idx].save();
        }
      };

      this.cancel = function () {
        var idx = editors.length;
        while (idx--) {
          editors[idx].cancel();
        }
      };

      this.focus = function () {
        // if validation has failed, set the focus to the first invalid editor
        (firstInvalidEditor || editors[0]).focus();
      };

      this.setDirectValue = function (item) {
        var idx = editors.length;
        while (idx--) {
          serializedValue[idx] = editors[idx].setDirectValue(item[idx]);
        }
      };

      this.isValueChanged = function () {
        var idx = editors.length;
        while (idx--) {
          if (editors[idx].isValueChanged()) {
            return true;
          }
        }
        return false;
      };

      this.serializeValue = function () {
        var serializedValue = [];
        var idx = editors.length;
        while (idx--) {
          serializedValue[idx] = editors[idx].serializeValue();
        }
        return serializedValue;
      };

      this.applyValue = function (item, state) {
        var idx = editors.length;
        while (idx--) {
          editors[idx].applyValue(item, state[idx]);
        }
      };

      this.loadValue = function (item) {
        var idx = editors.length;
        while (idx--) {
          editors[idx].loadValue(item);
        }
      };

      this.validate = function () {
        var validationResults;
        var errors = [];

        firstInvalidEditor = null;

        var idx = editors.length;
        while (idx--) {
          validationResults = editors[idx].validate();
          if (!validationResults.valid) {
            firstInvalidEditor = editors[idx];
            errors.push({
              index: idx,
              editor: editors[idx],
              container: containers[idx],
              msg: validationResults.msg
            });
          }
        }

        if (errors.length) {
          return {
            valid: false,
            msg: options.validationFailedMsg,
            errors: errors
          };
        } else {
          return {
            valid: true,
            msg: ""
          };
        }
      };

      this.hide = function () {
        var idx = editors.length;
        while (idx--) {
          editors[idx].hide && editors[idx].hide();
        }
        options.hide && options.hide();
      };

      this.show = function () {
        var idx = editors.length;
        while (idx--) {
          editors[idx].show && editors[idx].show();
        }
        options.show && options.show();
      };

      this.position = function (box) {
        options.position && options.position(box);
      };

      this.init();
    }

    // so we can do "editor instanceof Slick.CompositeEditor
    editor.prototype = this;

    return editor;
  }
})(jQuery);
