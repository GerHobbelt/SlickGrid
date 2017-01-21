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

  // Register namespace
  $.extend(true, window, {
    Slick: {
      AutoTooltips: AutoTooltips
    }
  });

  /**
   * AutoTooltips plugin to show/hide tooltips when columns are too narrow to fit content.
   * @constructor
   * @param {boolean}  [options.enableForCells=true]        - Enable tooltip for grid cells
   * @param {boolean}  [options.enableForHeaderCells=false] - Enable tooltip for header cells
   * @param {number}   [options.maxToolTipLength=0]         - The maximum length for a tooltip
   * @param {function} [options.getTooltip]                 - Produces the tooltip text; 
   *                                                          return empty string if no tooltip should be shown; 
   *                                                          return NULL when the existing tooltip should not be modified
   */
  function AutoTooltips(options) {
    var _grid;
    var _self = this;
    var _defaults = {
      enableForCells: true,
      enableForHeaderCells: false,
      maxToolTipLength: 0,
      getTooltip: function (info) {
        var text, headertext;
        assert(info.$node && info.$node.length === 1);
        if (info.$node.innerWidth() < info.$node[0].scrollWidth) {
          text = $.trim(info.$node.text());
          if (info.options.maxToolTipLength && text.length > info.options.maxToolTipLength) {
            text = text.substr(0, info.options.maxToolTipLength - 3) + "...";
          }
        } else {
          text = "";
        }
        if (info.inHeader) {
          headertext = info.columnDef.toolTip;
          if (!headertext) {
            headertext = info.columnDef.longName ? info.columnDef.longName : info.columnDef.name;
          }
          if (headertext) {
            text = headertext;
          }
        }        
        return text;
      }
    };

    /**
     * Initialize plugin.
     */
    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      if (options.enableForCells) _grid.onMouseEnter.subscribe(handleMouseEnter);
      if (options.enableForHeaderCells) _grid.onHeaderMouseEnter.subscribe(handleHeaderMouseEnter);
    }

    /**
     * Destroy plugin.
     */
    function destroy() {
      if (options.enableForCells) _grid.onMouseEnter.unsubscribe(handleMouseEnter);
      if (options.enableForHeaderCells) _grid.onHeaderMouseEnter.unsubscribe(handleHeaderMouseEnter);
    }

    /**
     * Handle mouse entering grid cell to add/remove tooltip.
     * @param {jQuery.Event} e - The event
     */
    function handleMouseEnter(e, cellInfo) {
      assert(cellInfo);
      assert(cellInfo.node);
      var $node = $(cellInfo.node);
      var columnDef = _grid.getColumns()[cellInfo.cell];
      assert(columnDef);
      assert($node.length === 1);
      var text = options.getTooltip({
          inHeader: false,
          row: cellInfo.row,
          cell: cellInfo.cell,
          columnDef: columnDef,
          $node: $node,
          options: options
      });
      if (text != null && text !== "") {
        $node.attr("title", text);
      }
    }

    /**
     * Handle mouse entering header cell to add/remove tooltip.
     * @param {jQuery.Event} e     - The event
     * @param {object} args.column - The column definition
     */
    function handleHeaderMouseEnter(e, args) {
      var columnDef = args.column,
          $node = $(args.node);
      assert(columnDef);
      assert($node.length === 1);
      assert($(e.target).closest(".slick-header-column")[0] === $node[0]);
      var text = options.getTooltip({
          inHeader: true,
          columnDef: columnDef,
          cell: args.cell,
          $node: $node,
          options: options
      });
      if (text != null && text !== "") {
        $node.attr("title", text);
      }
    }

    // Public API
    $.extend(this, {
      "init": init,
      "destroy": destroy
    });
  }
})(jQuery);
