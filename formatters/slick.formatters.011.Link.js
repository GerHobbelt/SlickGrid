//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















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

