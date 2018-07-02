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

  // register namespace
  $.extend(true, window, {
    Slick: {
      CellRangeDecorator: CellRangeDecorator
    }
  });

  /***
   * Displays an overlay on top of a given cell range.
   *
   * TODO:
   * Currently, it blocks mouse events to DOM nodes behind it.
   * Use FF and WebKit-specific "pointer-events" CSS style, or some kind of event forwarding.
   * Could also construct the borders separately using 4 individual DIVs.
   *
   * Currently the above issue is 'fixed' by providing onClick, etc handlers
   * which produce the cell coordinate as part of the event data.
   *
   * @param {Grid} grid
   * @param {Object} options
   */
  function CellRangeDecorator(grid, options) {
    var _elem;
    var _elem_range;
    var $canvas;
    var _self = this;
    var _defaults = {
      borderThickness: 2,
      selectionCssClass: "slick-range-decorator",
      selectionCss: {
        zIndex: "9999",
        border: "dashed red",
        boxSizing: "border-box"
      }
    };

    options = $.extend(true, {}, _defaults, options);

    function calcRangeBox(range) {
      if (!range) {
        return null;
      }
      var from = grid.getCellNodeBox(range.fromRow, range.fromCell);
      var to = grid.getCellNodeBox(range.toRow, range.toCell);

      // prevent JS crash when trying to decorate header cells, as those would
      // produce from/to == null as .fromRow/.toRow would be < 0:
      if (from && to) {
        return {
          top: from.top,
          left: from.left,
          height: to.bottom - from.top,           // box-sizing: border-box CSS means we don't have to subtract (2 * options.borderThickness)!
          width: to.right - from.left - 1
        };
      } else {
        // TBD
        return null;
      }
    }

    function getClickedCellInfo(e) {
      // obtain clicked pixel coordinate relative to CanvasNode:
      var x, y, o;
      o = $canvas.offset();
      x = e.pageX - o.left;
      y = e.pageY - o.top;
      var nodeInfo = grid.getCellFromPoint(x, y, {
        clipToValidRange: true
      });
      assert(nodeInfo);
      nodeInfo.innerEvent = e;
      return nodeInfo;
    }

    function show(range) {
      var _grid_cellsel_model = grid.getSelectionModel();

      if (!range) {
        range = _elem_range;
      } else {
        _grid_cellsel_model.validateRange(range, false);

        // remember our input range (clone!)
        _elem_range = {
          fromRow: range.fromRow,
          fromCell: range.fromCell,
          toRow: range.toRow,
          toCell: range.toCell
        };
      }

      if (!_elem) {
        $canvas = $(grid.getCanvasNode());
        _elem = $("<div></div>", {
                css: $.extend({}, options.selectionCss, {
                  borderSize: options.borderThickness
                })
            })
            .addClass(options.selectionCssClass)
            .css("position", "absolute")
            .appendTo($canvas);

        _elem.on("click", function(e) {
          console.log("range decorator slickgrid ", e);

          var nodeInfo = getClickedCellInfo(e);

          var ev = new Slick.EventData();
          _self.onClick.notify(nodeInfo, ev, _self);

          if (ev.isHandled()) {
            e.preventDefault();
          }
        });

        var ev = new Slick.EventData();
        _self.onCreate.notify({
          el: _elem,
          range: _elem_range,
          grid: grid,
          getClickedCellInfo: getClickedCellInfo
        }, ev, _self);
      }

      var box;
      if (range) {
        box = calcRangeBox(range);
      }
      if (box) {
        _elem.css(box);
      } else {
        // TBD
      }

      return _elem;
    }

    function hide() {
      if (_elem) {
        var ev = new Slick.EventData();
        _self.onDestroy.notify({
          el: _elem,
          range: _elem_range,
          grid: grid
        }, ev, _self);

        _elem.unbind("click");
        _elem.remove();
        _elem = null;
      }
    }

    function getInfo() {
      return {
        el: _elem,
        range: _elem_range,
        grid: grid,
        gridRect: calcRangeBox(_elem_range)
      };
    }

    $.extend(this, {
      "onCreate": new Slick.Event(),
      "onDestroy": new Slick.Event(),
      "onClick": new Slick.Event(),

      "show": show,
      "hide": hide,
      "getInfo": getInfo
    });
  }
})(jQuery);
