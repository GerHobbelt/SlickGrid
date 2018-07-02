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
      CellCopyManager: CellCopyManager
    }
  });


  function CellCopyManager(options) {
    var _grid;
    var _self = this;
    var _copiedRanges;    // keeps track of the last marked (Ctrl-C copied) range
    var _options = options || {};
    var _copiedCellStyleLayerKey = _options.copiedCellStyleLayerKey || "copy-manager";
    var _copiedCellStyle = _options.copiedCellStyle || "copied";

    function init(grid) {
      _grid = grid;
      _grid.onKeyDown.subscribe(handleKeyDown);

      // we need a cell selection model
      var cellSelectionModel = grid.getSelectionModel();
      if (!cellSelectionModel) {
        throw new Error("Selection model is mandatory for this plugin. Please set a selection model on the grid before adding this plugin: grid.setSelectionModel(new Slick.CellSelectionModel())");
      }
      // we give focus on the grid when a selection is done on it.
      // without this, if the user selects a range of cell without giving focus on a particular cell,
      // the grid doesn't get the focus and key stroke handles (ctrl+C) don't work.
      cellSelectionModel.onSelectedRangesChanged.subscribe(function(e, args) {
        _grid.focus();
      });
    }

    function destroy() {
      _grid.onKeyDown.unsubscribe(handleKeyDown);
    }

    function handleKeyDown(e, args) {
      var ranges;
      if (!_grid.getEditorLock().isActive()) {
        if (e.which === Slick.Keyboard.ESCAPE) {
          if (_copiedRanges) {
            e.preventDefault();
            clearCopySelection();
            _self.onCopyCancelled.notify({
              ranges: _copiedRanges,
              rangeIsCopied: _copiedRanges.copy
            });
            _copiedRanges = null;
          }
        }

        // Control+C / Control+X  -- these have the same effect on initial range
        if ((e.which === Slick.Keyboard.C || e.which === Slick.Keyboard.X) && (e.ctrlKey || e.metaKey)) {
          // make sure to clone (shallow) the range set as any subsequent selection action will echo into _copiedRanges!
          ranges = _grid.getSelectionModel().getSelectedRanges().slice(0);

          // also remember whether this was Ctrl-C (copy) or Ctrl-X (cut):
          ranges.copy = (e.which === Slick.Keyboard.C);

          if (ranges.length !== 0) {
            e.preventDefault();
            _copiedRanges = ranges;
            markCopySelection(ranges);
            _self.onCopyCells.notify({
              ranges: ranges, 
              rangeIsCopied: ranges.copy 
            });

            return false;
          }
        }

        // Control+V
        if (e.which === Slick.Keyboard.V && (e.ctrlKey || e.metaKey)) {
          if (_copiedRanges) {
            e.preventDefault();
            ranges = _grid.getSelectionModel().getSelectedRanges();
            var selectedCell = _grid.getActiveCell();
            if (!ranges || ranges.length === 0 || _copiedRanges[0].matches(ranges[0])) {
              if (selectedCell) {
                // only having the active cell implies we want the entire range pasted from this top/left corner...
                var srcRange = _copiedRanges[0];
                ranges = [new Slick.Range(selectedCell.row, selectedCell.cell, selectedCell.row + srcRange.toRow - srcRange.fromRow + 1, selectedCell.cell + srcRange.toCell - srcRange.fromCell + 1)];
              } else {
                // we don't know where to paste
                _self.onCopyCancelled.notify({
                  ranges: _copiedRanges,
                  rangeIsCopied: _copiedRanges.copy,
                  rangeDataFromExternalSource: false,
                  status: "No destination cell or range has been provided"
                });
                return false;
              }
            }

            _self.onPasteCells.notify({
              from: _copiedRanges,
              to: ranges,
              rangeIsCopied: _copiedRanges.copy,
              rangeDataFromExternalSource: false
            });
            // allow for Ctrl-C, Ctrl-V, Ctrl-V, ... repeated paste sequences to be all 'internal' based on that single Ctrl-C copied range!
            //
            // the ctrl-X effect is to delete original range at the first ctrl-V, so no repeat performance for that one though!
            if (!_copiedRanges.copy) {
              clearCopySelection();
              _copiedRanges = null;
            }
          }

          return false;
        }
      }
    }

    function markCopySelection(ranges) {
      clearCopySelection();

      var columns = _grid.getColumns();
      var hash = {};
      for (var i = 0; i < ranges.length; i++) {
        for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
          hash[j] = {};
          for (var k = ranges[i].fromCell; k <= ranges[i].toCell && k < columns.length; k++) {
            hash[j][columns[k].id] = _copiedCellStyle;
          }
        }
      }
      _grid.setCellCssStyles(_copiedCellStyleLayerKey, hash);
    }

    function clearCopySelection() {
      _grid.removeCellCssStyles(_copiedCellStyleLayerKey);
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,
      "clearCopySelection": clearCopySelection,
      "handleKeyDown": handleKeyDown,

      "onCopyCells": new Slick.Event(),
      "onCopyCancelled": new Slick.Event(),
      "onPasteCells": new Slick.Event()
    });
  }
})(jQuery);
