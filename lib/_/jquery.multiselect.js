/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, boss:true, undef:true, curly:true, browser:true, jquery:true */
/*
 * jQuery MultiSelect UI Widget 1.14pre
 * Copyright (c) 2012 Eric Hynds
 *
 * http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/
 *
 * Depends:
 *   - jQuery 1.4.2+
 *   - jQuery UI 1.8 widget factory
 *
 * Optional:
 *   - jQuery UI effects
 *   - jQuery UI position utility
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
      define( "jquery.multiselect", [ "jquery", "jquery-ui" ], function (jQuery) {
        return factory(window, jQuery) || jQuery;
      });
    } else {
        // Browser globals
        factory(window, window.jQuery);
    }
  }

// Pass this, window may not be defined yet
}(this, function ( window, $, undefined ) {

  var multiselectID = 0;
  var $doc = $(document);
  // save temp select value
  var beforeSelOpts = "";

  function addOrRemoveDisabledClass(el, add) {
    if (add) {
      el.addClass('ui-state-disabled');
    } else {
      el.removeClass('ui-state-disabled');
    }
  }

  // take this option value and convert it to a string, whether it is itself a function or a string
  function produceString(el, f_or_v) {
    if (typeof f_or_v === 'function') {
      return f_or_v.call(el) || "";
    } else {
      return f_or_v || "";
    }
  }

  $.widget("ech.multiselect", {

    // default options
    options: {
      header: true,                       // may be boolean, text or function which produces text; when true then the header is the combination of `checkAllText` and `uncheckAllText`
      withTitle: true,
      height: 175,
      width: undefined,
      minWidth: 225,
      minMenuWidth: 225,
      menuWidth: null,
      classes: '',
      checkAllText: 'Check all',           // set to falsey value (e.g. null) to remove this checkbox entirely; may be text or function which produces text
      uncheckAllText: 'Uncheck all',       // set to falsey value (e.g. null) to remove this checkbox entirely; may be text or function which produces text
      noneSelectedText: 'Select options',  // may be text or function which produces text
      allSelectedText: 'All selected',     // may be text or function which produces text
      selectedText: '# selected',          // may be text or function which produces text; when a string, the first `#` is replaced by the number of options selected, the second `#` in the string will be replaced by the number of available options
      selectedList: 0,                     // number: the maximum number of options listed as a separator-separated list; larger sets are reported as '# of #' via `selectedText` 
      selectedListSeparator: ', ',
      htmlButtonValue: false,
      show: null,
      hide: null,
      autoOpen: false,
      fireChangeOnClose: false,
      multiple: true,
      selectOnSpace: true,
      showAllSelectedText: false,
      position: {},
      highlightSelected: false,
      enableCloseIcon: true,
      appendTo: "body",
      uniqueId: 'multiselect-#',            // the `#` is replaced by the `uniqueID` number assigned to this multiselect instance at run-time
      menuId: "multiselectMenu-#",          // the `#` is replaced by the `uniqueID` number assigned to this multiselect instance at run-time 
      icons: {
        close: 'ui-icon-circle-close',
        activeHeader: "ui-icon-triangle-1-s",
        header: "ui-icon-triangle-1-e"
      }
    },

    _create: function () {
      var el = this.element.hide();
      var o = this.options;

      if (!o.appendTo) { o.appendTo = document.body; }

      // bump unique ID
      multiselectID++;

      this.speed = $.fx.speeds._default; // default speed for effects
      this._isOpen = false; // assume no

      this.uniqueID = multiselectID;
      o.uniqueId = o.uniqueId.replace('#', this.uniqueID);
      o.menuId = o.menuId.replace('#', this.uniqueID);

      // create a unique namespace for events that the widget
      // factory cannot unbind automatically. Use eventNamespace if on
      // jQuery UI 1.9+, and otherwise fallback to a custom string.
      this._namespaceID = this.eventNamespace || o.uniqueId;

      var button = (this.button = $('<button type="button"><span class="ui-icon ui-icon-triangle-1-s"></span></button>'))
        .addClass('ui-multiselect ui-widget ui-state-default ui-corner-all')
        .addClass(o.classes)
        .attr({ 
          'title': el.attr('title'), 
          'aria-haspopup': true, 
          'tabIndex': el.attr('tabIndex') 
        })
        .insertAfter(el),

        buttonlabel = (this.buttonlabel = $('<span />'))
          .html(produceString(el, o.noneSelectedText))
          .appendTo(button),

        menu = (this.menu = $('<div />'))
          .addClass('ui-multiselect-menu ui-widget ui-widget-content ui-corner-all')
          .addClass(o.classes)
          .attr('id', o.menuId)
          .appendTo($(o.appendTo)),

        header = (this.header = $('<div />'))
          .addClass('ui-widget-header ui-corner-all ui-multiselect-header ui-helper-clearfix')
          .appendTo(menu),

        headerLinkContainer = (this.headerLinkContainer = $('<ul />'))
          .addClass('ui-helper-reset')
          .html(function () {
            if (o.header === true) {
              var header_html = '';
              if (o.checkAllText) {
                header_html += '<li><a class="ui-multiselect-all" href="#"><span class="ui-icon ui-icon-check"></span><span>' + produceString(el, o.checkAllText) + '</span></a></li>';
              }
              if (o.uncheckAllText) {
                header_html += '<li><a class="ui-multiselect-none" href="#"><span class="ui-icon ui-icon-closethick"></span><span>' + produceString(el, o.uncheckAllText) + '</span></a></li>';
              }
              return header_html;
            } else if (typeof o.header === "string" || typeof o.header === "function") {
              return '<li>' + produceString(el, o.header) + '</li>';
            } else {
              return '';
            }
          })
          .append(!o.enableCloseIcon ? '' : '<li class="ui-multiselect-close"><a href="#" class="ui-multiselect-close"><span class="ui-icon ' + o.icons.close + '"></span></a></li>')
          .appendTo(header),

        checkboxContainer = (this.checkboxContainer = $('<div />'))
          .addClass('ui-multiselect-checkboxes')
          .appendTo(menu);

      // perform event bindings
      this._bindEvents();

      // build menu
      this.refresh(true);

      // some addl. logic for single selects
      if (!o.multiple) {
        menu.addClass('ui-multiselect-single');
      }
    },

    _init: function () {
      var o = this.options;
      if (!o.header) {
        this.header.hide();
      }
      if (!o.multiple) {
        this.headerLinkContainer.find('.ui-multiselect-all, .ui-multiselect-none').hide();
      }
      if (o.autoOpen) {
        this.open();
      }
      if (this.element.is(':disabled')) {
        this.disable();
      }
    },

    refresh: function (init) {
      var self = this;
      var el = this.element;
      var o = this.options;
      var menu = this.menu;
      var checkboxContainer = this.checkboxContainer;
      var optgroups = [];
      var html = "";
      var id = el.attr('id') || o.uniqueId; // unique ID for the label & option tags
      var inOptGroup = false;
      var inUl = false;
      var optName = el.attr('name') || id;

      // build items
      el.find('option').each(function (i) {
        var $this = $(this);
        var parent = this.parentNode;
        var title = $this.text(); // this.innerHTML;
        var description = o.withTitle ? (this.title || title) : '';
        var value = this.value;
        var inputID = 'ui-multiselect-' + id + '-' + (this.id || 'option-' + i);
        var isDisabled = this.disabled;
        var isSelected = this.selected;
        var labelClasses = ['ui-corner-all'];
        var liClasses = (isDisabled ? 'ui-multiselect-disabled ' : ' ') + this.className;
        var optLabel;

        // is this an optgroup?
        if (parent.tagName.toLowerCase() === 'optgroup') {
          if (!$(parent).prop('jquery-multiselect-parsed')) {
            $(parent).prop('jquery-multiselect-parsed', true);

            inOptGroup = true;
            if (inUl) {
              html += '</ul>';
            }
            html += '<ul class="ui-helper-reset ' + parent.className + '">';
            inUl = true;

            optLabel = parent.getAttribute('label');
            if (optLabel) {
              html += '<li class="ui-multiselect-optgroup-label ' + parent.className + '"><span class="ui-multiselect-header-icon ui-icon ' + o.icons.activeHeader + '"></span><a href="#">' + optLabel + '</a></li>';
            }
          }
        } else if (inOptGroup) {
          html += '</ul>';
          inUl = false;
          inOptGroup = false;
        }

        if (!inUl) {
          html += '<ul class="ui-helper-reset">';
          inUl = true;
        }

        if (isDisabled) {
          labelClasses.push('ui-state-disabled');
        }

        // browsers automatically select the first option
        // by default with single selects
        if (isSelected && !o.multiple) {
          labelClasses.push('ui-state-active');
        }

        html += '<li class="' + liClasses + '">';

        // if pre-selected, add the highlight class to the label class list.
        if (isSelected) {
          labelClasses.push('ui-state-highlight');
        }

        // create the label
        html += '<label for="' + inputID + '" title="' + description + '" class="' + labelClasses.join(' ') + '">';

        if ($this.attr("data-image")) {
          html += '<img src="' + $this.attr("data-image") + '" class="data-image" />';
        }

        html += '<input id="' + inputID + '" name="' + optName + '" type="' + (o.multiple ? "checkbox" : "radio") + '" value="' + value + '" title="' + title + '"';
        if ($this.attr("data-image")) {
          html += 'data-image="' + $this.attr("data-image") + '"';
        }

        // pre-selected?
        if (isSelected) {
          html += ' checked="checked"';
          html += ' aria-selected="true"';
        }

        // disabled?
        if (isDisabled) {
          html += ' disabled="disabled"';
          html += ' aria-disabled="true"';
        }

        // add the description and close everything off
        html += ' /><span>' + description + '</span></label></li>';
      });

      // close last item properly
      html += '</ul>';

      // remove any added data from select
      $(el).find("optgroup").removeProp("jquery-multiselect-parsed");

      // insert into the DOM
      checkboxContainer.html(html);

      // cache some moar useful elements
      this.labels = menu.find('label');
      this.inputs = this.labels.children('input');

      // set widths
      this._setButtonWidth();
      this._setMenuWidth();

      // remember default value
      this.button[0].defaultValue = this.update();

      // broadcast refresh event; useful for widgets
      if (!init) {
        this._trigger('refresh');
      }
    },

    // updates the button text. call refresh() to rebuild
    update: function () {
      var o = this.options;
      var $inputs = this.inputs;
      var $checked = $inputs.filter(':checked');
      var numTotal = $inputs.length;
      var numChecked = $checked.length;
      var value;

      if (numChecked === 0) {
        value = produceString(this, o.noneSelectedText);
      } else if (numChecked === numTotal && o.showAllSelectedText) {
        value = produceString(this, o.allSelectedText);
      } else {
        if ($.isFunction(o.selectedText)) {
          value = o.selectedText.call(this, numChecked, $inputs.length, $checked.get());
        } else if (/\d/.test(o.selectedList) && o.selectedList > 0 && numChecked <= o.selectedList) {
          // Call `.text()` method rather than `.html()`, as the setButtonValue will call `.text()` too.
          value = $checked.map(function() {
            if (o.htmlButtonValue && $(this).attr("data-image")) {
              var html = '<img src="' + $(this).attr("data-image") + '" class="data-image" />';
              html += $(this).next().html();
              return html;
            } else {
              return $(this).next().text();
            }
          }).get().join(o.selectedListSeparator);
        } else {
          value = o.selectedText.replace('#', numChecked).replace('#', $inputs.length);
        }
      }

      this._setButtonValue(value);

      return value;
    },

    // this exists as a separate method so that the developer
    // can easily override it.
    _setButtonValue: function (value) {
      if (this.options.htmlButtonValue) {
        this.buttonlabel.html(value);
      } else {
        this.buttonlabel.text(value);
      }
      this._trigger('buttonvaluechanged');
    },

    // binds events
    _bindEvents: function () {
      var self = this;
      var button = this.button;

      function clickHandler() {
        if (self._isOpen) {
          self.close();
        } else {
          self.open();
        }
        return false;
      }

      // webkit doesn't like it when you click on the span :(
      button
        .find('span')
        .bind('click.multiselect', clickHandler);

      // button events
      button.bind({
        click: clickHandler,
        keydown: function (e) {
          switch (e.which) {
            case 27: // esc
            case 38: // up
            case 37: // left
              self.close();
              break;
            case 39: // right
            case 40: // down
              self.open();
              break;
          }
        },
        mouseenter: function () {
          if (!button.hasClass('ui-state-disabled')) {
            $(this).addClass('ui-state-hover');
          }
        },
        mouseleave: function () {
          $(this).removeClass('ui-state-hover');
        },
        focus: function () {
          if (!button.hasClass('ui-state-disabled')) {
            $(this).addClass('ui-state-focus');
          }
        },
        blur: function () {
          $(this).removeClass('ui-state-focus');
        }
      });

      // header links
      this.header.delegate('a', 'click.multiselect', function (e) {
        // close link
        if ($(this).hasClass('ui-multiselect-close')) {
          self.close();

          // check all / uncheck all
        } else {
          if ($(this).hasClass('ui-multiselect-all')) {
            self.checkAll();
          } else {
            self.uncheckAll();
          }
        }

        e.preventDefault();
      });

      // optgroup label toggle support
      this.menu.delegate('li.ui-multiselect-optgroup-label a', 'click.multiselect', function (e) {
        e.preventDefault();

        var $this = $(this);
        var $inputs = $this.parent().nextUntil('li.ui-multiselect-optgroup-label').filter(':not(.ui-multiselect-filtered)').find('input:not(:disabled)');
        var nodes = $inputs.get();
        var label = $this.parent().text();

        // trigger event and bail if the return is false
        if (self._trigger('beforeoptgrouptoggle', e, { inputs: nodes, label: label }) === false) {
          return;
        }

        // toggle inputs
        self._toggleChecked(
          $inputs.filter(':checked').length !== $inputs.length,
          $inputs
        );

        self._trigger('optgrouptoggle', e, {
          inputs: nodes,
          label: label,
          checked: nodes[0].checked
        });
      })
      .delegate('li.ui-multiselect-optgroup-label span.ui-icon', 'click.multiselect', function (e) {
        var $this = $(this);
        self._toggleCollapsed($this.hasClass(self.options.icons.activeHeader), $this);
      })
      .delegate('label', 'mouseenter.multiselect', function () {
        if (!$(this).hasClass('ui-state-disabled')) {
          self.labels.removeClass('ui-state-hover');
          $(this).addClass('ui-state-hover');
        }
      })
      .delegate('label', 'keydown.multiselect', function (e) {
        e.preventDefault();

        switch (e.which) {
          case 9: // tab
          case 27: // esc
            self.close();
            button.focus();
            break;
          case 38: // up
          case 40: // down
          case 37: // left
          case 39: // right
            self._traverse(e.which, this);
            break;
          case 13: // enter
            $(this).find('input')[0].click();
            break;
          case 32: // space
            if (self.options.selectOnSpace) {
              $(this).find('input')[0].click();
            }
            break;
        }
      })
      .delegate('label', 'keyup.multiselect', function (e) {
        switch (e.which) {
          case 9: // tab
          case 27: // esc
          case 38: // up
          case 40: // down
          case 37: // left
          case 39: // right
          case 13: // enter
            e.preventDefault();
            break;
          case 32: // space
            if (self.options.selectOnSpace) {
              e.preventDefault();
            }
            break;
        }
      })
      .delegate('input[type="checkbox"], input[type="radio"]', 'click.multiselect', function (e, extraParameters) {
        var $this = $(this);
        var val = this.value;
        var checked = this.checked;
        var tags = self.element.find('option');
        var clickArguments = { value: val, text: this.title, checked: checked };

        // if trigger sent extra parameters we pass them on.
        if (extraParameters) {
          clickArguments.extraParameters = extraParameters;
        }

        // bail if this input is disabled or the event is canceled
        if (this.disabled || self._trigger('click', e, clickArguments) === false) {
          e.preventDefault();
          return;
        }

        // make sure the input has focus. otherwise, the esc key
        // won't close the menu after clicking an item.
        $this.focus();

        // toggle aria state
        $this.attr('aria-selected', checked);

        // if selected, add the highlight class to the label class list.
        if (self.options.highlightSelected) {
          if (checked) {
            $this.closest('label').addClass('ui-state-highlight');
          } else {
            $this.closest('label').removeClass('ui-state-highlight');
          }
        }

        // change state on the original option tags
        tags.each(function () {
          if (this.value === val) {
            this.selected = checked;
          } else if (!self.options.multiple) {
            this.selected = false;
            this.removeAttribute('selected'); // this.selected = false; does not remove the 'selected' attr
          }
        });

        // some additional single select-specific logic
        if (!self.options.multiple) {
          self.labels.removeClass('ui-state-active');
          $this.closest('label').toggleClass('ui-state-active', checked);

          // close menu
          self.close();
        }

        // fire change on the select box
        if (self.options.fireChangeOnClose) {
          self.didChanged = true;
        }
        else {
          self.element.trigger("change");
        }

        // setTimeout is to fix multiselect issue #14 and #47. caused by jQuery issue #3827
        // http://bugs.jquery.com/ticket/3827
        setTimeout($.proxy(self.update, self), 10);
      });

      // close each widget when clicking on any other element/anywhere else on the page
      $doc.bind('mousedown.' + this._namespaceID + ' touchstart.' + this._namespaceID, function (event) {
        var target = event.target;

        if (self._isOpen
            && target !== self.button[0]
            && target !== self.menu[0]
            && !$.contains(self.menu[0], target)
            && !$.contains(self.button[0], target)
          ) {
          self.close();
        }
      });

      // deal with form resets.  the problem here is that buttons aren't
      // restored to their defaultValue prop on form reset, and the reset
      // handler fires before the form is actually reset.  delaying it a bit
      // gives the form inputs time to clear.
      $(this.element[0].form).bind('reset.' + this._namespaceID, function () {
        setTimeout($.proxy(self.refresh, self), 10);
      });
    },

    // set button width
    _setButtonWidth: function () {
      var o = this.options;
      var width;

      if (typeof o.width === 'undefined') {
        width = this.element.outerWidth();

        if (o.minWidth === "auto") {
          width = o.minWidth;
        }
        else if ( /\d(%|em)/.test( o.minWidth ) ) {
          width = o.minWidth;
        }
        else if (/\d/.test(o.minWidth) && width < o.minWidth) {
          width = o.minWidth;
        }
      } else {
        width = typeof o.width === 'function' ? o.width() : o.width;
        if (/\d$/.test(width)) { width = width + 'px'; }
      }

      // set widths
      this.button.outerWidth(width);
    },

    // set menu width
    _setMenuWidth: function () {
      var m = this.menu;
      var o = this.options;
      var width;

      if (o.menuWidth && /\d/.test(o.menuWidth)) {
        width = o.menuWidth;
      } else {
        width = this.button.outerWidth();
      }

      if (/\d/.test(o.minMenuWidth) && width < o.minMenuWidth) {
        width = o.minMenuWidth;
      }

      m.outerWidth(width);
    },

    // move up or down within the menu
    _traverse: function (which, start) {
      var $start = $(start);
      var moveToLast = which === 38 || which === 37;
      var label;

      // select the first li that isn't an optgroup label / disabled
      var $next;
      var $parent = $start.parent();
      /* @const */ var selector = 'li:not(.ui-multiselect-disabled, .ui-multiselect-optgroup-label):visible';
      if (moveToLast) {
        $next = $parent.prevAll(selector).last();
      } else {
        $next = $parent.nextAll(selector).first();
      }

      // if at the first/last element
      if (!$next.length) {
        var $container = this.menu.find('ul').last();

        // move to the first/last
        label = this.menu.find('li:visible label');
        if (moveToLast) {
          label = label.last();
        } else {
          label = label.first();
        }
        label.find('input').focus();
        label.trigger('mouseover');

        // set scroll position
        $container.scrollTop(moveToLast ? $container.height() : 0);

      } else {
        label = $next.find('label');
        label.find('input').focus();
        label.trigger('mouseover');
      }
    },

    // This is an internal function to toggle the checked property and
    // other related attributes of a checkbox.
    //
    // The context of this function should be a checkbox; do not proxy it.
    _toggleState: function (prop, flag, highlightSelected) {
      return function () {
        if (!this.disabled) {
          this[prop] = flag;
        }

        if (flag) {
          this.setAttribute('aria-selected', true);
          if (highlightSelected) {
            $(this).closest('label').addClass('ui-state-highlight');
          }
        } else {
          this.removeAttribute('aria-selected');
          if (highlightSelected) {
            $(this).closest('label').removeClass('ui-state-highlight');
          }
        }
      };
    },

    _toggleChecked: function (flag, group) {
      var $inputs = (group && group.length) ? group : this.inputs;
      var self = this;

      // toggle state on inputs
      $inputs.each(this._toggleState('checked', flag, self.options.highlightSelected));

      // give the first input focus
      $inputs.eq(0).focus();

      // update button text
      this.update();

      // gather an array of the values that actually changed
      var values = $inputs.map(function () {
        return this.value;
      }).get();

      // toggle state on original option tags
      this.element
        .find('option')
        .each(function () {
          if (!this.disabled && $.inArray(this.value, values) > -1) {
            self._toggleState('selected', flag).call(this);
          }
        });

      // trigger the change event on the select
      if ($inputs.length) {
        this.element.trigger("change");
      }
    },

    _toggleDisabled: function (flag) {
      var btn = this.button.attr({ 
        'disabled': flag, 
        'aria-disabled': flag 
      });
      addOrRemoveDisabledClass(btn, flag);

      var inputs = this.menu.find('input');
      var key = "ech-multiselect-disabled";

      if (flag) {
        // remember which elements this widget disabled (not pre-disabled)
        // elements, so that they can be restored if the widget is re-enabled.
        inputs = inputs.filter(':enabled').data(key, true);
      } else {
        inputs = inputs.filter(function () {
          return $.data(this, key) === true;
        }).removeData(key);
      }

      var parent = inputs
        .attr({ 
          'disabled': flag, 
          'aria-disabled': flag 
        })
        .parent();
      addOrRemoveDisabledClass(parent, flag);

      this.element.attr({
        'disabled': flag,
        'aria-disabled': flag
      });
    },

    _toggleCollapsed: function (flag, group) {
      var groups = (group && group.length) ? group : this.menu.find("li.ui-multiselect-optgroup-label span.ui-icon");
      var icons = this.options.icons;

      if (flag) {
        // Collapse
        groups
          .removeClass(icons.activeHeader).addClass(icons.header)
          .parent().nextUntil('li.ui-multiselect-optgroup-label').addClass("ui-multiselect-collapsed");
      } else {
        // Expand
        groups
          .removeClass(icons.header).addClass(icons.activeHeader)
          .parent().nextUntil('li.ui-multiselect-optgroup-label').removeClass("ui-multiselect-collapsed");
      }
    },

    // get select value
    getSelectValue: function () {
      var o = this.options;
      var $inputs = this.inputs;
      var $checked = $inputs.filter(':checked');
      var numChecked = $checked.length;
      var value;
      if (numChecked === 0) {
        value = "";
      }
      else {
        value = $checked.map(function () { return this.value; }).get().join(',');
      }
      return value;
    },

    // open the menu
    open: function (e) {
      var self = this;
      var button = this.button;
      var menu = this.menu;
      var speed = this.speed;
      var o = this.options;
      var args = [];

      // bail if the multiselect open event returns false, this widget is disabled, or is already open
      if (this._trigger('beforeopen') === false || button.hasClass('ui-state-disabled') || this._isOpen) {
        return;
      }
      // set before select option value
      beforeSelOpts = this.getSelectValue();

      var $container = menu.find('div').last();
      var effect = o.show;

      // figure out opening effects/speeds
      if ($.isArray(o.show)) {
        effect = o.show[0];
        speed = o.show[1] || self.speed;
      }

      // if there's an effect, assume jQuery UI is in use
      // build the arguments to pass to show()
      if (effect) {
        args = [effect, speed];
      }

      // set the scroll of the checkbox container
      $container.scrollTop(0).height(o.height);

      // position
      this.position();

      // show the menu, maybe with a speed/effect combo
      $.fn.show.apply(menu, args);

      // select the first not disabled option
      // triggering both mouseover and mouseenter because 1.4.2+ has a bug where triggering mouseover
      // will actually trigger mouseenter.  the mouseenter trigger is there for when it's eventually fixed
      this.labels.filter(':not(.ui-state-disabled)').eq(0).trigger('mouseover').trigger('mouseenter').find('input').trigger('focus');

      button.addClass('ui-state-active');
      this._isOpen = true;
      this._trigger('open');
    },

    // close the menu
    close: function () {
      if (this._trigger('beforeclose') === false) {
        return;
      }

      var o = this.options;
      var effect = o.hide;
      var speed = this.speed;
      var args = [];

      // figure out opening effects/speeds
      if ($.isArray(o.hide)) {
        effect = o.hide[0];
        speed = o.hide[1] || this.speed;
      }

      if (effect) {
        args = [effect, speed];
      }

      $.fn.hide.apply(this.menu, args);
      this.button.removeClass('ui-state-active').trigger('blur').trigger('mouseleave');
      // fire change on the select box
      if (o.fireChangeOnClose && this.didChanged) {
        this.element.trigger('change');
        this.didChanged = false;
      }
      this._isOpen = false;
      this._trigger('close');
      // if the select value is changed fire the `changed` event
      if (beforeSelOpts !== this.getSelectValue()) {
        this._trigger('changed');
      }
    },

    enable: function () {
      this._toggleDisabled(false);
    },

    disable: function () {
      this._toggleDisabled(true);
    },

    checkAll: function (e) {
      this._trigger('beforeCheckAll');
      this._toggleChecked(true);
      this._trigger('checkAll');
    },

    uncheckAll: function () {
      this._trigger('beforeUncheckAll');
      this._toggleChecked(false);
      this._trigger('uncheckAll');
    },

    getChecked: function () {
      return this.menu.find('input').filter(':checked');
    },

    getUnchecked: function () {
      return this.menu.find('input[type="checkbox"]').filter(':not(:checked)');
    },

    destroy: function () {
      // remove classes + data
      $.Widget.prototype.destroy.call(this);

      // unbind events
      $doc.unbind(this._namespaceID);
      $(this.element[0].form).unbind(this._namespaceID);

      this.button.remove();
      this.menu.remove();
      this.element.show();

      return this;
    },

    isOpen: function () {
      return this._isOpen;
    },

    widget: function () {
      return this.menu;
    },

    getButton: function () {
      return this.button;
    },

    collapseAll: function () {
      this._toggleCollapsed(true)
      return this;
    },

    expandAll: function () {
      this._toggleCollapsed(false)
      return this;
    },

    position: function () {
      var o = this.options;

      // use the position utility if it exists and options are specified
      if ($.ui.position && !$.isEmptyObject(o.position)) {
        o.position.of = o.position.of || this.button;

        this.menu
          .show()
          .position(o.position)
          .hide();

        // otherwise fallback to custom positioning
      } else {
        var pos = this.button.offset();
        var bottom = pos.top +  (o.height === 'auto' ? this.menu.height() : o.height) + this.button.outerHeight();
        // popup on top of the button if menu will be cut off by the bottom of the window.
        this.menu.css({
          top: ( bottom < $(window).height() ) ? pos.top + this.button.outerHeight() : pos.top - this.menu.outerHeight(),
          left: pos.left
        });
      }
    },

    // react to option changes after initialization
    //
    // Options which are not supported here (yet?):
    //
    //     width
    //     htmlButtonValue
    //     show
    //     hide
    //     autoOpen
    //     highlightSelected
    //     enableCloseIcon
    //     appendTo
    //     icons
    //
    _setOption: function (key, value) {
      var menu = this.menu;

      switch (key) {
      case 'header':
        var $header = menu.find('div.ui-multiselect-header');
        if (value) {
          $header.show();
        } else {
          $header.hide();
        }
        break;
      case 'checkAllText':
        menu.find('a.ui-multiselect-all span').eq(-1).html(value);
        break;
      case 'uncheckAllText':
        menu.find('a.ui-multiselect-none span').eq(-1).html(value);
        break;
      case 'height':
        menu.find('div').last().height(parseInt(value, 10));
        break;
      case 'width':
      case 'minWidth':
        this.options[key] = value;
        this._setButtonWidth();
        this._setMenuWidth();
        break;
      case 'menuWidth':
      case 'minMenuWidth':
        this.options[key] = value;
        this._setMenuWidth();
        break;
      case 'selectedText':
      case 'selectedList':
      case 'noneSelectedText':
      case 'selectedListSeparator':
      case 'allSelectedText':
        this.options[key] = value; // these all needs to update immediately for the update() call
        this.update();
        break;
      case 'classes':
        menu.add(this.button).removeClass(this.options.classes).addClass(value);
        break;
      case 'multiple':
        menu.toggleClass('ui-multiselect-single', !value);
        this.options.multiple = value;
        this.element[0].multiple = value;
        this.refresh();
        break;
      case 'selectOnSpace':
      case 'showAllSelectedText':
        this.options[key] = !!value;
        break;
      case 'position':
        this.position();
        break;
      }

      $.Widget.prototype._setOption.apply(this, arguments);
    }
  });

}));

