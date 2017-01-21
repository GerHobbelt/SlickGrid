//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















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
