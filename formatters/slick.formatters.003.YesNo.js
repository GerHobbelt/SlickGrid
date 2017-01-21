//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Formatters.YesNo = YesNoFormatter;

  function YesNoFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
    assert(cellMetaInfo);
    if (cellMetaInfo.outputPlainText) {
      return !!value;
    }

    return value ? "Yes" : "No";
  }

