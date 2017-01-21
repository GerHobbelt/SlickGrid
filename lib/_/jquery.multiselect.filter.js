/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, boss:true, undef:true, curly:true, browser:true, jquery:true */
/*
 * jQuery MultiSelect UI Widget Filtering Plugin 1.5pre
 * Copyright (c) 2012 Eric Hynds
 *
 * http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/
 *
 * Depends:
 *   - jQuery UI MultiSelect widget
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

(function ( window, factory ) {

  if ( typeof module === "object" && typeof module.exports === "object" ) {
    // Expose a factory as module.exports in loaders that implement the Node
    // module pattern (including browserify).
    // This accentuates the need for a real window in the environment
    // e.g. var jQuery = require("jquery")(window);
    module.exports = function ( w ) {
      w = w || window;
      if ( !w.document ) {
        throw new Error("jQuery plugin requires a window with a document");
      }
      return factory( w, w.jQuery ) || w.jQuery;
    };
  } else {
    // Register as a named AMD module, since jQuery can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase jquery is used because AMD module names are
    // derived from file names, and jQuery is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of jQuery, it will work.
    if ( typeof define === "function" && define.amd ) {
      // AMD. Register as a named module.
      define( "jquery.multiselect.filter", [ "jquery", "jquery-ui", "jquery.multiselect" ], function (jQuery) {
        return factory(window, jQuery) || jQuery;
      });
    } else {
        // Browser globals
        factory(window, window.jQuery);
    }
  }

// Pass this, window may not be defined yet
}(this, function ( window, $, undefined ) {

  var rEscape = /[\-\[\]{}()*+?.,\\\^$|#\s]/g;

  $.widget('ech.multiselectfilter', {

    options: {
      label: 'Filter:',
      width: null, /* override default width set in css file (px). null will inherit */
      placeholder: 'Enter keywords',
      autoReset: false
    },

    _create: function () {
      var opts = this.options;

      // get the multiselect instance: must use the full name for jQuery 1.9+ to find the instance, cf. http://jqueryui.com/upgrade-guide/1.9/#changed-naming-convention-for-data-keys (see also the <jquery-ui.js> definition of $.widget where fullName is constructed)
      var elem = $(this.element);
      var instance = (this.instance = (elem.data("echMultiselect") || elem.data("multiselect") || elem.data("ech-multiselect")));

      if (!instance || !instance.menu) {
        return this;
      }

      // store header; add filter class so the close/check all/uncheck all links can be positioned correctly
      var header = (this.header = instance.menu.find('.ui-multiselect-header').addClass('ui-multiselect-hasfilter'));

      // wrapper elem
      var wrapper = (this.wrapper = $('<div class="ui-multiselect-filter">' + (opts.label.length ? opts.label : '') + '<input placeholder="' + opts.placeholder + '" type="search"' + (/\d/.test(opts.width) ? 'style="width:' + opts.width + 'px"' : '') + ' /></div>').prependTo(this.header));

      // reference to the actual inputs
      this.inputs = instance.menu.find('input[type="checkbox"], input[type="radio"]');

      // build the input box
      this.input = wrapper.find('input').bind({
        keydown: function (e) {
          // prevent the enter key from submitting the form / closing the widget
          if (e.which === 13) {
            e.preventDefault();
          }
        },
        keyup: $.proxy(this._handler, this),
        click: $.proxy(this._handler, this)
      });

      // cache input values for searching
      this.updateCache();

      // rewrite internal _toggleChecked fn so that when checkAll/uncheckAll is fired,
      // only the currently filtered elements are checked
      instance._toggleChecked = function (flag, group) {
        var $inputs = (group && group.length) ? group : this.labels.find('input');
        var _self = this;

        // do not include hidden elems if the menu isn't open.
        var selector = _self._isOpen ?
                        ":disabled, :hidden, .ui-multiselect-filtered" :
                        ":disabled, .ui-multiselect-filtered";

        $inputs = $inputs.not( selector ).each(this._toggleState('checked', flag, _self.options.highlightSelected));

        // update text
        this.update();

        // gather an array of the values that actually changed
        var values = $inputs.map(function () {
          return this.value;
        }).get();

        // select option tags
        this.element.find('option').filter(function () {
          if (!this.disabled && $.inArray(this.value, values) > -1) {
            _self._toggleState('selected', flag).call(this);
          }
        });

        // trigger the change event on the select
        if ($inputs.length) {
          this.element.trigger('change');
        }
      };

      // rebuild cache when multiselect is updated
      var doc = $(document).bind('multiselectrefresh.' + instance._namespaceID, $.proxy(function () {
        this.updateCache();
        this._handler();
      }, this));

      // automatically reset the widget on close?
      if (this.options.autoReset) {
        doc.bind('multiselectclose.' + instance._namespaceID, $.proxy(this._reset, this));
      }
    },

    // thx for the logic here ben alman
    _handler: function (e) {
      var term = $.trim(this.input[0].value.toLowerCase()),

      // speed up lookups
      rows = this.rows, inputs = this.inputs, cache = this.cache;

      if (!term) {
        rows.removeClass('ui-multiselect-filtered');
        inputs.removeClass('ui-multiselect-filtered');
      } else {
        rows.addClass('ui-multiselect-filtered');
        inputs.addClass('ui-multiselect-filtered');

        var regex = new RegExp(term.replace(rEscape, "\\$&"), 'gi');

        $.each(this.groups, function (i, v) {
          if (v.text.search(regex) !== -1) {
            rows.slice(v.start, v.start + v.length).removeClass('ui-multiselect-filtered');
            inputs.slice(v.start, v.start + v.length).removeClass('ui-multiselect-filtered');
          }
        });

        this._trigger("filter", e, $.map(cache, function (v, i) {
          var row = rows.eq(i);
          if (!row.hasClass("ui-multiselect-filtered")) {
            return inputs.get(i);
          }
          if (v.search(regex) !== -1) {
            inputs.eq(i).removeClass('ui-multiselect-filtered');
            row.removeClass('ui-multiselect-filtered');
            return inputs.get(i);
          }

          return null;
        }));
      }

      // show/hide optgroups
      this.instance.menu.find(".ui-multiselect-optgroup-label").each(function () {
        var $this = $(this);
        var isVisible = $this.nextUntil('.ui-multiselect-optgroup-label').filter(":not(.ui-multiselect-filtered)").length;

        $this[isVisible ? 'show' : 'hide']();
      });
    },

    _reset: function () {
      this.input.val('').trigger('keyup');
    },

    updateCache: function () {
      // each list item
      this.rows = this.instance.menu.find(".ui-multiselect-checkboxes li:not(.ui-multiselect-optgroup-label)");
      var groups = [];
      var i = 0;

      // cache
      this.cache = this.element.children().map(function () {
        var elem = $(this);

        // account for optgroups
        if (this.tagName.toLowerCase() === "optgroup") {
          var group = elem.attr('label');
          elem = elem.children();
          groups.push({ 'text': group, 'start': i, 'length': elem.length });
          i = i + elem.length;
        } else {
          i++;
        }

        return elem.map(function () {
          return this.innerHTML.toLowerCase();
        }).get();
      }).get();
      this.groups = groups;
    },

    widget: function () {
      return this.wrapper;
    },

    destroy: function () {
      $.Widget.prototype.destroy.call(this);
      this.input.val('').trigger("keyup");
      this.wrapper.remove();
    }
  });

}));

