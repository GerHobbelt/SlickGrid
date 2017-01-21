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
      CellRangeSelector: CellRangeSelector
    }
  });


  function CellRangeSelector(options) {
    var _grid;
    var _canvas;
    var _dragging;
    var _decorator;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _defaults = {
      selectionCss: {
        border: "2px dashed blue"
      }
    };


    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      _decorator = new Slick.CellRangeDecorator(grid, options);
      _grid = grid;
      _canvas = _grid.getCanvasNode();
      _handler
        .subscribe(_grid.onDragInit, handleDragInit)
        .subscribe(_grid.onDragStart, handleDragStart)
        .subscribe(_grid.onDrag, handleDrag)
        .subscribe(_grid.onDragEnd, handleDragEnd);
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleDragInit(e, dd) {
      _dragging = false;
      // prevent the grid from cancelling drag'n'drop by default
      e.stopImmediatePropagation();
    }

    function handleDragStart(e, dd) {
      var cell = _grid.getCellFromEvent(e);
      var evt = new Slick.EventData(e);
      var state = _self.onBeforeCellRangeSelected.notify(cell, evt);
      if (state === false ||
          evt.isHandled() ||
          !_grid.canCellBeSelected(cell.row, cell.cell)) {
        return;
      }
      _dragging = true;
      e.stopImmediatePropagation();

      _grid.focus();

      // comment by prashant
      // note for ger issue #1249
      // i have no idea why ger used the commented code while we get the row and cell in cell variable
      // if any special function let me know
      // same for the handleDrag function bellow.

      // var x, y, o;
      // //o = $(_canvas).offset();
      // o = $($(".grid-canvas")[0]).offset();
      // x = dd.startX - o.left;
      // y = dd.startY - o.top;
      // var start = _grid.getCellFromPoint(x, y, {
      //   clipToValidRange: true
      // });

      var start = cell;
      assert(start);

      dd.range = {
        start: start, 
        end: {}
      };
      dd.currentCell = cell;

      return _decorator.show(new Slick.Range(start.row, start.cell));
    }

    function handleDrag(e, dd) {
      if (!_dragging) {
        return;
      }
      e.stopImmediatePropagation();

      var cell = _grid.getCellFromEvent(e);

      // comment by prashant
      // note for ger issue #1249
      // var x, y, o;
      // o = $($(".grid-canvas")[0]).offset();  
      // x = e.pageX - o.left;
      // y = e.pageY - o.top;
      // var end = _grid.getCellFromPoint(x, y, {
      //   clipToValidRange: true
      // });

      var end = cell;
      assert(end);

      var eventData = {
          range: dd.range,
          currentCell: end
      };
      var evt = new Slick.EventData(e);
      var state = _self.onCellRangeSelectionOngoing.notify(eventData, evt);
      if (state === false ||
          evt.isHandled() ||
          !eventData.currentCell ||
          !_grid.canCellBeSelected(eventData.currentCell.row, eventData.currentCell.cell)) {
        return;
      }

      dd.range.end = eventData.currentCell;
      _decorator.show(new Slick.Range(dd.range.start.row, dd.range.start.cell, dd.range.end.row, dd.range.end.cell));
    }

    function handleDragEnd(e, dd) {
      if (!_dragging) {
        return;
      }

      _dragging = false;
      e.stopImmediatePropagation();

      _decorator.hide();
      var evt = new Slick.EventData(e);
      _self.onCellRangeSelected.notify({
        range: new Slick.Range(
            dd.range.start.row,
            dd.range.start.cell,
            dd.range.end.row,
            dd.range.end.cell
        )
      }, evt);
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,

      "onBeforeCellRangeSelected": new Slick.Event(),
      "onCellRangeSelectionOngoing": new Slick.Event(),
      "onCellRangeSelected": new Slick.Event()
    });
  }
})(jQuery);
