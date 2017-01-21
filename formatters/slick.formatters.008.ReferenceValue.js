//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















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

