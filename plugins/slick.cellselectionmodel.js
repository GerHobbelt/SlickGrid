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
      CellSelectionModel: CellSelectionModel
    }
  });


  function CellSelectionModel(options) {
    var _grid;
    var _canvas;
    var _ranges = [];
    var _self = this;
    var _selector = new Slick.CellRangeSelector({
      selectionCss: {
        border: "2px solid black"
      }
    });
    var _options;
    var _defaults = {
      selectActiveCell: true,
      useDefaultSelectedRangesFilter: true          // set to FALSE if you don't want to apply the default `removeInvalidRanges()` range filter; specify a *function* if you wish to apply a custom filter function.
    };

    function init(grid) {
      _options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _canvas = _grid.getCanvasNode();
      _grid.onActiveCellChanged.subscribe(handleActiveCellChange);
      _grid.onKeyDown.subscribe(handleKeyDown);
      _grid.registerPlugin(_selector);
      _selector.onCellRangeSelected.subscribe(handleCellRangeSelected);
      _selector.onBeforeCellRangeSelected.subscribe(handleBeforeCellRangeSelected);
    }

    function destroy() {
      _grid.onActiveCellChanged.unsubscribe(handleActiveCellChange);
      _grid.onKeyDown.unsubscribe(handleKeyDown);
      _selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected);
      _selector.onBeforeCellRangeSelected.unsubscribe(handleBeforeCellRangeSelected);
      _grid.unregisterPlugin(_selector);
    }

    function removeInvalidRanges(ranges) {
      var result = [];

      if (ranges) {
        for (var i = 0; i < ranges.length; i++) {
          var r = ranges[i];
          if (_grid.canCellBeSelected(r.fromRow, r.fromCell) && _grid.canCellBeSelected(r.toRow, r.toCell)) {
            result.push(r);
          }
        }
      }

      return result;
    }

    function setSelectedRanges(ranges) {
      // simple check for: empty selection doesn't change anything from existing empty selection, prevent firing `onSelectedRangesChanged`
      if ((!_ranges || _ranges.length === 0) && (!ranges || ranges.length === 0)) { 
        return; 
      }

      _ranges = removeInvalidRanges(ranges);
      _self.onSelectedRangesChanged.notify(_ranges);
    }

    function getSelectedRanges() {
      return _ranges;
    }

    // return FALSE when the drag should NOT start.
    // args = cell
    function handleBeforeCellRangeSelected(e, args) {
      if (_grid.getEditorLock().isActive()) {
        e.stopPropagation();
        return false;
      }
    }

    function handleCellRangeSelected(e, args) {
      setSelectedRanges([args.range]);
    }

    function handleActiveCellChange(e, args) {
      if (_options.selectActiveCell && typeof args.row !== 'undefined' && typeof args.cell !== 'undefined') {
        setSelectedRanges([new Slick.Range(args.row, args.cell)]);
      }
    }

    function handleKeyDown(e) {
      assert(!(e instanceof Slick.EventData));

      var ranges, last;
      var active = _grid.getActiveCell();

      if (active && e.shiftKey && !e.ctrlKey && !e.altKey &&
          (e.which === Slick.Keyboard.LEFT || e.which === Slick.Keyboard.RIGHT || e.which === Slick.Keyboard.UP || e.which === Slick.Keyboard.DOWN) ) {

        ranges = getSelectedRanges();
        if (!ranges.length) {
          ranges.push(new Slick.Range(active.row, active.cell));
        }

        // keyboard can work with last range only
        last = ranges.pop();

        // can't handle selection which is outside the active cell
        if (!last.contains(active.row, active.cell)) {
          last = new Slick.Range(active.row, active.cell);
        }

        var dRow = last.toRow - last.fromRow,
            dCell = last.toCell - last.fromCell,
            // walking direction
            dirRow = active.row == last.fromRow ? 1 : -1,
            dirCell = active.cell == last.fromCell ? 1 : -1;

        if (e.which === Slick.Keyboard.LEFT) {
          dCell -= dirCell;
        } else if (e.which === Slick.Keyboard.RIGHT) {
          dCell += dirCell;
        } else if (e.which === Slick.Keyboard.UP) {
          dRow -= dirRow;
        } else if (e.which === Slick.Keyboard.DOWN) {
          dRow += dirRow;
        }

        // define new selection range
        var new_last = new Slick.Range(active.row, active.cell, active.row + dirRow * dRow, active.cell + dirCell * dCell);
        if (removeInvalidRanges([new_last]).length) {
          ranges.push(new_last);
          // scroll the grid automatically when selection expands out of viewport
          var viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow;
          var viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;
          //_grid.scrollRowIntoView(viewRow); -- implicit in `scrollCellIntoView()`
          _grid.scrollCellIntoView(viewRow, viewCell);
        } else {
          ranges.push(last);
        }

        setSelectedRanges(ranges);

        e.preventDefault();
        e.stopPropagation();
      }
      else if (!e.shiftKey && !e.ctrlKey && !e.altKey && e.which == Slick.Keyboard.ESC) {
        setSelectedRanges([]);
        e.preventDefault();
        e.stopPropagation();
      }
    }

    $.extend(this, {
      "getSelectedRanges": getSelectedRanges,
      "setSelectedRanges": setSelectedRanges,

      "init": init,
      "destroy": destroy,

      "onSelectedRangesChanged": new Slick.Event()
    });
  }
})(jQuery);
