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
      ClipboardCopyManager: ClipboardCopyManager
    }
  });


  function ClipboardCopyManager(options) {
    var _grid;
    var _gridContainer;
    var _gridSelectionModel;
    var _self = this;
    var _copiedRanges;
    var _options;
    var _defaults = {
        cellSeparator: '\t',
        lineSeparator: '\r\n',
        copyHeaders: false
    };

    function init(grid) {
        _grid = grid;
        _gridContainer = _grid.getContainerNode();
        _gridSelectionModel = _grid.getSelectionModel();
        _options = $.extend(true, {}, _defaults, options);

        $(_gridContainer).on('copy', handleCopy);
        _gridSelectionModel.onSelectedRangesChanged.subscribe(handleNewSelection);

        if (_grid.onClearCopySelectionCssStyles) {
            _grid.onClearCopySelectionCssStyles.subscribe(clearCopySelectionCssStyles);
        }
    }

    function destroy() {
        $(_gridContainer).off('copy', handleCopy);
        _gridSelectionModel.onSelectedRangesChanged.unsubscribe(handleNewSelection);

        if (_grid.onClearCopySelectionCssStyles) {
            _grid.onClearCopySelectionCssStyles.unsubscribe(clearCopySelectionCssStyles);
        }
    }

    function formatDelimitedField(value, delimiter, quote) {
        if (arguments.length === 1) {
            delimiter = ',';
            quote = true;
        } else if (arguments.length === 2) {
            quote = false;
        }

        if (value == null) {
            return '';
        }

        if (typeof (value) !== 'string') {
            value = value.toString();
        }

        if (value.contains(delimiter) || value.contains('\n') || value.contains('\r') || value.contains('"')) {
            quote = true;
        }

        if (quote) {
            value = '"' + value.replace(/\"/gim, '""').trim() + '"';
        }

        return value.trim();
    }

    function handleNewSelection(e, args) {
        clearCopySelectionCssStyles();
    }

    function handleCopy(e) {
        var ranges;
        var columns, data, clonedColumns;
        var concatData = '', headerData = '';
        var hash = {};
        var cellStagger = null;
        var isStaggered = false;
        var editorLock = (typeof _grid.getEditorLock === 'function') ? _grid.getEditorLock() : null;

        if (!editorLock || !editorLock.isActive()) {
            e.preventDefault();
            clearCopySelectionCssStyles();
            _copiedRanges = ranges = _gridSelectionModel.getSelectedRanges();
            data = _grid.getData().getItems();
            columns = _grid.getColumns();
            
            for (var i = 0; i < ranges.length; i++) {
                for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
                    hash[j] = {};

                    for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
                        if (_options.copyHeaders) {
                            if (!cellStagger) {
                                cellStagger = {
                                    fromCell: ranges[i].fromCell,
                                    toCell: ranges[i].toCell
                                };
                            } else if (cellStagger.fromCell !== ranges[i].fromCell || cellStagger.toCell !== ranges[i].toCell) {
                                isStaggered = true;
                            }
                        }

                        hash[j][columns[k].id] = "copied";
                        concatData += formatDelimitedField(data[j][columns[k].field], _options.cellSeparator, false);

                        // only add cell separator if not the last cell of the row
                        if (k < ranges[i].toCell) {
                            concatData += _options.cellSeparator;
                        }
                    }
                    
                    // if not the very last row copied for all ranges, add a newline to prepare for next row
                    if (i !== ranges.length - 1 || j !== ranges[i].toRow) {
                        concatData += _options.lineSeparator;
                    }
                }
            }

            // if not copying oddly arranged chunks of cells, also copy appropriate header information
            if (_options.copyHeaders && !isStaggered) {
                for (var x = cellStagger.fromCell; x <= cellStagger.toCell; x++) {
                    headerData += (columns[x].name)

                    // only add cell separator if not the last cell of the header
                    if (x < cellStagger.toCell) {
                        headerData += _options.cellSeparator;
                    }
                }

                if (ranges.length > 0) {
                    headerData += _options.lineSeparator;
                }

                concatData = headerData + concatData;
            }

            e.originalEvent.clipboardData.setData('text/plain', concatData);
            _self.onCopyToClipboard.notify({ ranges: ranges, plainData: concatData });
            _grid.setCellCssStyles("copy-manager", hash);
        }
    }

    function clearCopySelectionCssStyles() {
        _grid.removeCellCssStyles("copy-manager");
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,

      "onCopyToClipboard": new Slick.Event()
    });
  }
})(jQuery);
