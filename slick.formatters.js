/*!
 * @license
 * slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
 * Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
 *
 * Distributed under MIT license.
 * All rights reserved.
 */




//! Source: formatters/slick.formatters.js.prelude

/***
 * Contains basic SlickGrid formatters.
 *
 * NOTE:  These are merely examples.  You will most likely need to implement something more
 *        robust/extensible/localizable/etc. for your use!
 *
 * @module Formatters
 * @namespace Slick
 */

(function (window, $) {
  "use strict";

  // register namespace
  $.extend(true, window, {
    Slick: {
      Formatters: {
      }
    }
  });

  var Slick = window.Slick;


//! Source: formatters/slick.formatters.001.PercentComplete.js

















  // register namespace
  Slick.Formatters.PercentComplete = PercentCompleteFormatter;

  function PercentCompleteFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
    assert(cellMetaInfo);
    if (cellMetaInfo.outputPlainText) {
      if (value == null || value === "") {
        return "";
      } else {
        return "" + value + "%";
      }
    }

    if (value == null || value === "") {
      return "-";
    } else if (value < 50) {
      return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
    } else {
      return "<span style='color:green'>" + value + "%</span>";
    }
  }

//! Source: formatters/slick.formatters.002.PercentCompleteBar.js

















  // register namespace
  Slick.Formatters.PercentCompleteBar = PercentCompleteBarFormatter;

  function PercentCompleteBarFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
    if (value == null || value === "") {
      return "";
    }

    var color;

    if (value < 30) {
      color = "red";
    } else if (value < 70) {
      color = "silver";
    } else {
      color = "green";
    }

    assert(cellMetaInfo);
    if (cellMetaInfo.outputPlainText) {
      return "" + value + "%";
    }

    return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
  }

//! Source: formatters/slick.formatters.003.YesNo.js

















  // register namespace
  Slick.Formatters.YesNo = YesNoFormatter;

  function YesNoFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
    assert(cellMetaInfo);
    if (cellMetaInfo.outputPlainText) {
      return !!value;
    }

    return value ? "Yes" : "No";
  }


//! Source: formatters/slick.formatters.004.Checkmark.js

















  // register namespace
  Slick.Formatters.Checkmark = CheckmarkFormatter;

  function CheckmarkFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
    assert(cellMetaInfo);
    if (cellMetaInfo.outputPlainText) {
      return !!value;
    }

    return value ? "<img src='../images/tick.png'>" : "";
  }


//! Source: formatters/slick.formatters.005.Color.js

















  // register namespace
  Slick.Formatters.Color = ColorFormatter;

  function ColorFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
    assert(cellMetaInfo);
    if (cellMetaInfo.outputPlainText) {
      return value;
    }

    return "<span style='color:" + value  + "'>" + value + "</span>";
  }


//! Source: formatters/slick.formatters.006.BackColor.js

















  // register namespace
  Slick.Formatters.BackColor = BackColorFormatter;

  function BackColorFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
    assert(cellMetaInfo);
    if (cellMetaInfo.outputPlainText) {
      return value;
    }

    //return "<span style='background:" + value  + "'>" + value + "</span>";
    cellMetaInfo.cellStyles.push("background:" + value);
    return "<span style='color:black; padding-left: 1px; padding-right: 1px; background-color: rgba(255, 255, 255, 0.4); text-shadow: 1px 1px 3px white; -webkit-box-shadow: 0px 0px 3px 1px rgba(255, 255, 255, 0.4); box-shadow: 0px 0px 3px 1px rgba(255, 255, 255, 0.4);'>" + value + "</span>";
  }


//! Source: formatters/slick.formatters.007.Text.js

















  // register namespace
  Slick.Formatters.Text = TextFormatter;

  // identical to the SlickGrid internal defaultFormatter except this one wraps the value in a SPAN tag.
  function TextFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
    assert(cellMetaInfo);
    if (value == null) {
      return "";
    } else {
      if (cellMetaInfo.outputPlainText) {
        return "" + value;
      }
      // Safari 6 fix: (value + "") instead of .toString()
      value = (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return "<span>" + value + "</span>";
    }
  }


//! Source: formatters/slick.formatters.008.ReferenceValue.js

















  // register namespace
  Slick.Formatters.ReferenceValue = ReferenceValueFormatter;

  function ReferenceValueFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
    assert(cellMetaInfo);
    var options = cellMetaInfo.options;

    if (cellMetaInfo.outputPlainText) {
      if (value == null) {
        return "";
      } else {
        return "" + value;
      }
    }

    if (options) {
      var match;
      for (var i in options) {
        if (options[i].id === value || options[i].key === value) {
          match = options[i];
          break;
        }
      }

      if (match) {
        return match.value || match.label || value;
      }
    }
    return value;
  }


//! Source: formatters/slick.formatters.009.Date.js

















  // register namespace
  Slick.Formatters.Date = DateFormatter;

  /*
   *  depends on Moment.js
   *  (http://momentjs.com/)
   */
  function DateFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
    var options = $.extend({
        format: 'YYYY-MM-DD HH:mm:ss'
    }, cellMetaInfo.options);

    if (cellMetaInfo.outputPlainText) {
      if (value == null) {
        return "";
      } else if (value.toISOString) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
        return value.toISOString();
      }
      return "" + value;
    }

    if (value == null || value === "") {
      return "";
    } else if (value && typeof moment !== 'undefined') {
      return moment(value).format(options.format);
    } else if (value.toISOString) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
      return value.toISOString();
    } else {
      return "" + value;
    }
  }


//! Source: formatters/slick.formatters.010.Chain.js

















  // register namespace
  Slick.Formatters.Chain = Chain;

  /*
   *  utility for chaining formatters
   */
  function Chain(/* ...formatters */) {
    var formatters = Array.prototype.slice.call(arguments);

    return function(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
      var val = value;
      for (var i in formatters) {
        val = formatters[i](row, cell, val, columnDef, rowDataItem, cellMetaInfo);
      }
      return val;
    };
  }


//! Source: formatters/slick.formatters.011.Link.js

















  // register namespace
  Slick.Formatters.Link = LinkFormatter;

  /*
   * Presents data as href by substituting
   * url template with values
   */
  function LinkFormatter(options) {
    var urlTemplate = typeof options === 'string' ? options : options.urlTemplate;
    var matches = urlTemplate.match(/:(\w+)/g);
    var splatParams = [];
    var i, result, val;

    for (i in matches) {
      splatParams.push(matches[i].substring(1));
    }

    var len = splatParams.length;

    return function(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
      result = urlTemplate;
      for (i = 0; i < len; i++) {
        val = rowDataItem[splatParams[i]];
        if (typeof val != null) {
          result = result.replace(':' + splatParams[i], val);
        }
      }
      return value != null ? '<a href="' + result + '">' + value + '</a>' : null;
    };
  }


//! Source: formatters/slick.formatters.012.Concatenator.js

















  // register namespace
  Slick.Formatters.Concatenator = Concatenator;

  function Concatenator(fields, separator) {
    if (typeof separator === 'undefined') {
      separator = ' ';
    }
    if (typeof fields === 'string') {
      fields = fields.split(',');
    }
    var len = fields.length;

    return function(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
      var result = [];
      var data;
      for (var i = 0; i < len; i++) {
        data = rowDataItem[ fields[i] ];
        if (data != null) {
          result.push(data);
        }
      }
      return result.join(separator);
    };
  }


//! Source: formatters/slick.formatters.js.postlude

})(window, jQuery);
