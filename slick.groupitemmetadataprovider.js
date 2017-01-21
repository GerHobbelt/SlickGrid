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
      Data: {
        GroupItemMetadataProvider: GroupItemMetadataProvider
      }
    }
  });


  /***
   * Provides item metadata for group (Slick.Group) and totals (Slick.Totals) rows produced by the DataView.
   * This metadata overrides the default behavior and formatting of those rows so that they appear and function
   * correctly when processed by the grid.
   *
   * This class also acts as a grid plugin providing event handlers to expand & collapse groups.
   * If "grid.registerPlugin(...)" is not called, expand & collapse will not work.
   *
   * @class GroupItemMetadataProvider
   * @module Data
   * @namespace Slick.Data
   * @constructor
   * @param options
   */
  function GroupItemMetadataProvider(options) {
    var _grid;
    var _defaults = {
      groupCssClass: "slick-group",
      groupTitleCssClass: "slick-group-title",
      totalsCssClass: "slick-group-totals",
      groupSelectable: false,
      groupFocusable: true,
      totalsSelectable: false,
      totalsFocusable: false,
      toggleCssClass: "slick-group-toggle",
      toggleExpandedCssClass: "expanded",
      toggleCollapsedCssClass: "collapsed",
      enableExpandCollapse: true,
      groupFormatter: defaultGroupCellFormatter,      // function (row, cell, value, columnDef, rowDataItem, info)
      totalsFormatter: defaultTotalsCellFormatter,    // function (row, cell, value, columnDef, rowDataItem, info)
      groupRowFormatter: defaultGroupRowFormatter,    // function (row, rowDataItem, info)
      totalsRowFormatter: defaultTotalsRowFormatter,  // function (row, rowDataItem, info)
      getRowMetadata: null                            // function (item, row, cell, rows)
    };

    options = $.extend(true, {}, _defaults, options);


    function defaultGroupCellFormatter(row, cell, value, columnDef, rowDataItem, info) {
      if (!options.enableExpandCollapse) {
        return rowDataItem.title;
      }

      var indentation = (rowDataItem.level * 15) + "px";

      return "<span class='" + options.toggleCssClass + " " +
          (rowDataItem.collapsed ? options.toggleCollapsedCssClass : options.toggleExpandedCssClass) +
          "' style='margin-left:" + indentation + "'>" +
          "</span>" +
          "<span class='" + options.groupTitleCssClass + "'>" +
            rowDataItem.title +
          "</span>";
    }

    function defaultTotalsCellFormatter(row, cell, value, columnDef, rowDataItem, info) {
      return (columnDef.groupTotalsFormatter && columnDef.groupTotalsFormatter(rowDataItem, columnDef)) || "";
    }

    function defaultGroupRowFormatter(row, rowDataItem, info) {
      assert(info.rowData.__group === true);
      var level = info.rowData.level;
      info.attributes["data-group-level"] = level;
    }

    function defaultTotalsRowFormatter(row, rowDataItem, info) {
      assert(info.rowData.__groupTotals === true);
      assert(info.rowData.group.__group === true);
      var level = info.rowData.group.level;
      info.attributes["data-group-level"] = level;
    }

    function init(grid) {
      _grid = grid;
      _grid.onClick.subscribe(handleGridClick);
      _grid.onKeyDown.subscribe(handleGridKeyDown);
    }

    function destroy() {
      if (_grid) {
        _grid.onClick.unsubscribe(handleGridClick);
        _grid.onKeyDown.unsubscribe(handleGridKeyDown);
      }
    }

    function getOptions() {
      return options;
    }

    function handleGridClick(e, args) {
      var item = this.getDataItem(args.row);
      if (item && item instanceof Slick.Group && $(e.target).hasClass(options.toggleCssClass)) {
        if (_grid.getEditorLock().isActive()) {
          _grid.getEditorLock().commitCurrentEdit();
        }

        var range = _grid.getCachedRowRangeInfo();
        this.getData().setRefreshHints({
          // WARING: do NOT simply use `range.top/bottom` here as the span cache 
          // can be much larger and needs to be cleared entirely too:
          ignoreDiffsBefore: Math.min(range.spanCacheTop, range.top),
          ignoreDiffsAfter: Math.max(range.spanCacheBottom, range.bottom),   
          isFilterNarrowing: !item.collapsed,
          isFilterExpanding: !!item.collapsed
        }); // tell DataView we'll take the diff till `ignoreDiffsAfter` and don't care about anything at or below that row.

        if (item.collapsed) {
          this.getData().expandGroup(item.groupingKey);
        } else {
          this.getData().collapseGroup(item.groupingKey);
        }

        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }

    // TODO:  add -/+ handling
    function handleGridKeyDown(e, args) {
      if (options.enableExpandCollapse && (e.which === Slick.Keyboard.SPACE)) {
        var activeCell = this.getActiveCell();
        if (activeCell) {
          var item = this.getDataItem(activeCell.row);
          if (item && item instanceof Slick.Group) {
            if (_grid.getEditorLock().isActive()) {
              _grid.getEditorLock().commitCurrentEdit();
            }
            var range = _grid.getCachedRowRangeInfo();
            this.getData().setRefreshHints({
              // WARING: do NOT simply use `range.top/bottom` here as the span cache 
              // can be much larger and needs to be cleared entirely too:
              ignoreDiffsBefore: Math.min(range.spanCacheTop, range.top),
              ignoreDiffsAfter: Math.max(range.spanCacheBottom, range.bottom),   
              isFilterNarrowing: !item.collapsed,
              isFilterExpanding: !!item.collapsed   
            }); // tell DataView we'll take the diff till `ignoreDiffsAfter` and don't care about anything at or below that row.

            if (item.collapsed) {
              this.getData().expandGroup(item.groupingKey);
            } else {
              this.getData().collapseGroup(item.groupingKey);
            }

            e.stopImmediatePropagation();
            e.preventDefault();
          }
        }
      }
    }

    function getGroupRowMetadata(item, row, cell, rows) {
      return {
        selectable: options.groupSelectable,
        focusable: options.groupFocusable,
        cssClasses: options.groupCssClass,
        columns: {
          0: {
            colspan: "*",
            formatter: options.groupFormatter,
            editor: null
          }
        },
        rowFormatter: options.groupRowFormatter
      };
    }

    function getTotalsRowMetadata(item, row, cell, rows) {
      return {
        selectable: options.totalsSelectable,
        focusable: options.totalsFocusable,
        cssClasses: options.totalsCssClass,
        formatter: options.totalsFormatter,
        rowFormatter: options.totalsRowFormatter,
        editor: null
      };
    }

    function getRowMetadata(item, row, cell, rows) {
      if (options.getRowMetadata) {
        return options.getRowMetadata(item, row, cell, rows);
      }

      return null;
    }


    return {
      "init": init,
      "destroy": destroy,
      "getOptions": getOptions,
      "getRowMetadata": getRowMetadata,
      "getGroupRowMetadata": getGroupRowMetadata,
      "getTotalsRowMetadata": getTotalsRowMetadata
    };
  }
})(jQuery);
