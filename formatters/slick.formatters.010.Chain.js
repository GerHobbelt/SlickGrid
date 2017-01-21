//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















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

