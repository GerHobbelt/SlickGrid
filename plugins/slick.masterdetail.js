/*!
 * @license
 * slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
 * Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
 *
 * Distributed under MIT license.
 * All rights reserved.
 */




(function($) {
    "use strict";

    // Register namespace
    $.extend(true, window, {
        SlickGrid : {
            MasterDetail : MasterDetail
        }
    });

    /**
     *
     */
    function MasterDetail(options) {
        var _grid;
        var _self = this;
        var _defaults = {
            detailsPaneProcessor: defaultDetailsPaneProcessor,
            cacheDetailsNodes: true
        };

        var _expandedRows = {};

        /**
         * Initialize plugin.
         */
        function init(grid) {
            options = $.extend(true, {}, _defaults, options);
            _grid = grid;

            _grid.onRowsRendered.subscribe(function(e, args) {
                renderExt(args.rows, args.nodes);
            });
        }

        function defaultDetailsPaneProcessor(row, dataContext) {
            if (dataContext.detailsPane === undefined) {
                throw new Error("Each data element must implement a 'detailsPane' property");
            }

            return $(dataContext.detailsPane);
        }

        function renderExt(rows, rowNodes) {
            for (i = 0; i < rows.length; i++) {
                var rowIndex = rows[i];
                var parentRow = $(rowNodes[i]);
                var childRowDetails = parentRow.children('.slick-row-details');
                if (childRowDetails.length > 0) {
                    childRowDetails.remove();
                }

                childRowDetails = $("<div class=\"slick-row-details\"/>");
                var detailsBlock = $("<div class=\"details-block\"/>");
                childRowDetails.append(detailsBlock);
                parentRow.append(childRowDetails);

                var dataItem = _grid.getDataItem(rowIndex);
                var detailsNode = null;
                if (options.cacheDetailsNodes) {
                    detailsNode = dataItem.__CACHED_DETAILS_NODE__;
                }

                if (detailsNode == null) {
                    detailsNode = options.detailsPaneProcessor(rowIndex, dataItem);
                    if (options.cacheDetailsNodes) {
                        dataItem.__CACHED_DETAILS_NODE__ = detailsNode;
                    }
                }

                if (detailsNode != null) {
                    detailsBlock.append(detailsNode);
                }
            }

            var top = 0;
            var gridCanvas = $(_grid.getCanvasNode());
            var gridRowHeight = _grid.getOptions().rowHeight;
            gridCanvas
                .children(".slick-row")
                .each(function() {
                    var parentRow = $(this);
                    var rowIndex = parentRow.index();
                    var height = gridRowHeight;
                    var expanded = (_expandedRows[rowIndex] == rowIndex);
                    var childRowDetails = parentRow.children('.slick-row-details');

                    if (expanded) {
                        parentRow.addClass('expanded');
                        height += childRowDetails.outerHeight();

                        childRowDetails.css({
                            "margin-top" : gridRowHeight,
                            "width" : "100%"
                        });
                    } else {
                        parentRow.removeClass('expanded');
                    }

                    parentRow.css({
                        "height" : height,
                        "top" : top
                    });

                    top += height;
                });

            gridCanvas.height(top);
            return;
        }

        /**
         * Destroy plugin.
         */
        function destroy() {
        }

        function getExpandedRows() {
            var er = [];
            $.each(_expandedRows, function(key, value) {
                er.push(value);
            });

            return er;
        }

        function setExpandedRows(rows) {
            var expandedRows = {};
            for (i = 0; i < rows.length; i++) {
                expandedRows[i] = i;
            }
            _expandedRows = expandedRows;
        }

        function expandAllDetailsRows() {
            var gridCanvas = $(_grid.getCanvasNode());

            var heightOffset = 0;
            var gridRowHeight = _grid.getOptions().rowHeight;

            gridCanvas.children(".slick-row")
            .each(function() {
                var parentRow = $(this);
                var top = parseInt(parentRow.css('top'))
                        + heightOffset;
                var rowIndex = parentRow.index();

                var childRowDetails = parentRow.children('.slick-row-details');
                if (childRowDetails.size() > 0 && !parentRow.hasClass('expanded')) {
                    parentRow.addClass('expanded');

                    var e = new Slick.EventData();
                    _grid.onDetailsRowExpanded.notify({
                        "grid" : _grid,
                        "row" : rowIndex,
                        "expanded" : true,
                        "target" : childRowDetails
                    }, e, _self);

                    childRowDetails.css({
                        "margin-top" : gridRowHeight
                    });

                    var height = childRowDetails.outerHeight();
                    parentRow.css({
                        "height" : gridRowHeight + height,
                        "top" : top
                    });
                    heightOffset += height;
                    _expandedRows[rowIndex] = rowIndex;
                } else {
                    parentRow.css({
                        "top" : top
                    });
                }
            });

            gridCanvas.height(gridCanvas.height() + heightOffset);
        }

        function collapseAllDetailsRows() {
            var gridCanvas = $(_grid.getCanvasNode());

            var currentTop = 0;
            var gridRowHeight = _grid.getOptions().rowHeight;

            gridCanvas.children(".slick-row").each(function() {
                var parentRow = $(this);
                var rowIndex = parentRow.index();

                if (parentRow.hasClass('expanded')) {
                    parentRow.removeClass('expanded');

                    var e = new Slick.EventData();
                    _grid.onDetailsRowExpanded.notify({
                        "grid" : _grid,
                        "row" : rowIndex,
                        "expanded" : true,
                        "target" : childRowDetails
                    }, e, _self);
                }

                parentRow.css("top", currentTop);
                currentTop += gridRowHeight;
            });

            gridCanvas.height(currentTop);
            _expandedRows = {};
        }

        function toggleDetailsRow(row) {
            var gridCanvas = $(_grid.getCanvasNode());

            var currentTop = 0;
            var gridRowHeight = _grid.getOptions().rowHeight;

            var parentRow = $(gridCanvas.children(".slick-row")[row]);

            function adjustHeight(heightOffset) {
                parentRow.nextAll().each(function() {
                    var siblingRow = $(this);
                    var top = parseInt(siblingRow.css('top'))
                    siblingRow.css("top", top + heightOffset);
                });
                gridCanvas.height(heightOffset + gridCanvas.height());
            }

            var childRowDetails, e, height;

            if (parentRow.hasClass('expanded')) {
                childRowDetails = parentRow.children(".slick-row-details");
                height = -(childRowDetails.outerHeight());
                parentRow.css("height", gridRowHeight);
                adjustHeight(height);
                parentRow.removeClass("expanded");
                delete _expandedRows[row];

                e = new Slick.EventData();
                _grid.onDetailsRowExpanded.notify({
                    "grid" : _grid,
                    "row" : row,
                    "expanded" : false,
                    "target" : childRowDetails
                }, e, _self);
            } else {
                parentRow.addClass('expanded');
                childRowDetails = parentRow.children(".slick-row-details");

                e = new Slick.EventData();
                _grid.onDetailsRowExpanded.notify({
                    "grid" : _grid,
                    "row" : row,
                    "expanded" : true,
                    "target" : childRowDetails
                }, e, _self);

                childRowDetails.css({
                    "margin-top" : gridRowHeight,
                });

                height = childRowDetails.outerHeight();
                parentRow.css("height", _grid.getOptions().rowHeight + height);
                adjustHeight(height);
                _expandedRows[row] = row;
            }
        }

        // Public API
        $.extend(this, {
            "expandAllDetailsRows" : expandAllDetailsRows,
            "collapseAllDetailsRows" : collapseAllDetailsRows,
            "toggleDetailsRow" : toggleDetailsRow,
            "setExpandedRows" : setExpandedRows,
            "getExpandedRows" : getExpandedRows,
            "onDetailsRowExpanded" : new Slick.Event(),

            "init" : init,
            "destroy" : destroy
        });
    }
})(jQuery);
