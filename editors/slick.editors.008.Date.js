//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Editors.Date = DateEditor;

  function DateEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;
    var calendarOpen = false;
    var imageDir = args.imagesPath || "../images";
    var dateFormat = 0;
    var detectableDateFormats = [
      "yy-mm-dd",   // ISO
      $.datepicker.ISO_8601,
      $.datepicker.COOKIE,
      $.datepicker.RFC_1036,
      $.datepicker.RFC_2822,
      $.datepicker.RFC_850,
      $.datepicker.TIMESTAMP,
      "dd-mm-yyyy",   // European
      "mm/dd/yy",     // US
      "dd-mm-yy",     // European
      $.datepicker.TICKS
    ];
    /* jshint -W069 */     //! jshint : ['...'] is better written in dot notation
    var regionSettings = $.datepicker.regional["en"] || $.datepicker.regional;
    /* jshint +W069 */
    var datepickerParseSettings = {
      shortYearCutoff: 20,
      dayNamesShort: regionSettings.dayNamesShort,
      dayNames: regionSettings.dayNames,
      monthNamesShort: regionSettings.monthNamesShort,
      monthNames: regionSettings.monthNames
    };
    var datePickerOptions = {};
    var datePickerDefaultOptions = {
      dateFormat: "yy-mm-dd",                 // this format is used for displaying the date while editing / picking it
      defaultDate: 0,                         // default date: today
      showOn: "button",
      buttonImageOnly: true,
      buttonImage: args.dateButtonImage || (imageDir + "/calendar.png"),
      buttonText: "Select date"
    };
    var datePickerFixedOptions = {
      beforeShow: function () {
        calendarOpen = true;
      },
      onClose: function () {
        calendarOpen = false;
      }
    };
    // Override DatePicker options from datePickerOptions on column definition.
    // Make sure that beforeShow and onClose events are not clobbered.
    datePickerOptions = $.extend(datePickerOptions, datePickerDefaultOptions,
      args.column.datePickerOptions, datePickerFixedOptions);

    function parseDateStringAndDetectFormat(s) {
      dateFormat = 0;
      if (s instanceof Date) {
        return s;
      }
      var fmt, d;
      for (dateFormat = 0; fmt = detectableDateFormats[dateFormat]; dateFormat++) {
        try {
          d = $.datepicker.parseDate(fmt, s, datepickerParseSettings);
          break;
        } catch (ex) {
          continue;
        }
      }
      return d || false;
    }

    this.init = function () {
      defaultValue = new Date();
      $input = $("<INPUT type='text' class='editor-date' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
            if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT) {
              e.stopImmediatePropagation();
            }
          })
          .focus()
          .select();
      $input.datepicker(datePickerOptions);
      $input.outerWidth($input.outerWidth() - 18);
    };

    this.destroy = function () {
      $.datepicker.dpDiv.stop(true, true);
      $input.datepicker("hide");
      $input.datepicker("destroy");
      $input.remove();
    };

    this.save = function () {
      args.commitChanges();
    };

    this.cancel = function () {
      this.setDirectValue(defaultValue);
      args.cancelChanges();
    };

    this.show = function () {
      if (calendarOpen) {
        $.datepicker.dpDiv.stop(true, true).show();
      }
    };

    this.hide = function () {
      if (calendarOpen) {
        $.datepicker.dpDiv.stop(true, true).hide();
      }
    };

    /*
     * info: {
     *         gridPosition: getGridPosition(),
     *         position: cellBox,
     *         container: activeCellNode
     *       }
     */
    this.position = function (info) {
      if (!calendarOpen) {
        return;
      }
      if (info.position.visible) {
        $.datepicker.dpDiv
              .css("top", info.position.top + 30)
              .css("left", info.position.left);
      }
    };

    this.focus = function () {
      $input.focus();
    };

    this.setDirectValue = function (val) {
      val = parseDateStringAndDetectFormat(val); /* parseISODate() */
      if (!val) val = new Date();
      defaultValue = val;
      $input.datepicker("setDate", val);
    };

    this.loadValue = function (item) {
      scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
      $input.select();
    };

    this.serializeValue = function () {
      return $input.datepicker("getDate");
    };

    this.applyValue = function (item, state) {
      var fmt = detectableDateFormats[dateFormat] || detectableDateFormats[0];
      state = $.datepicker.formatDate(fmt, state); // state.format('isoDate');
      args.grid.setDataItemValueForColumn(item, args.column, state);
    };

    this.isValueChanged = function () {
      var d = $input.datepicker("getDate");
      return !d || !defaultValue || d.getTime() != defaultValue.getTime();
    };

    this.validate = function () {
      var d = $input.datepicker("getDate");
      if (!d) {
        return {
          valid: false,
          msg: "Please enter a valid date"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }


