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
      Plugins: {
        HeaderRowSummary: HeaderRowSummary
      }
    }
  });
 
    function HeaderRowSummary(dataView, options) {
        var _grid;
        var _self = this;
        var _handler = new Slick.EventHandler();
        var _timeout;
        var _defaults = {
            minLabel: 'Min',
            maxLabel: 'Max',
            avgLabel: 'Avg',
            countLabel: 'Cnt',
            sumLabel: 'Sum'            
        };

        function defaultFormatter(row, cell, value) {
            return value;
        }

        function init(grid) {
            options = $.extend(true, {}, _defaults, options);
            _grid = grid;
            _handler
                .subscribe(_grid.onHeaderRowCellRendered, handleHeaderRowCellRendered)
                .subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy)
                .subscribe(dataView.onRowCountChanged, handleRowCountChanged)
                .subscribe(dataView.onRowsChanged, handleRowCountChanged);            
        }

        function destroy() {
            _handler.unsubscribeAll();
        }
        
        function computeAggregates(data, columns) {
            var x;
            var y;
            var length = data.getLength ? data.getLength() : data.length;
            var value;
            var $row;
            var $line;
            var $list;
            var column;

            for (y = 0; y < length; y++) {
                for (x = 0; x < columns.length; x++) {
                    if (columns[x].summaries && columns[x].summaries.length) {
                        value = data.getItem(y)[columns[x].field];
                        column = columns[x];

                        if (y === 0 || column.aggregates == null) {
                            column.aggregates = {
                                sum: Number.NaN,
                                min: Number.NaN,
                                max: Number.NaN,
                                avg: Number.NaN,
                                count: 0
                            };
                        }

                        if (typeof value !== 'undefined' && value !== null && value !== '') {
                            column.aggregates.count++;
                        }

                        if (typeof value === 'number') {
                            if (isNaN(column.aggregates.sum)) {
                                column.aggregates.sum = value;
                                column.aggregates.min = value;
                                column.aggregates.max = value;
                            } else {
                                column.aggregates.sum += value;
                                column.aggregates.min = Math.min(column.aggregates.min, value);
                                column.aggregates.max = Math.max(column.aggregates.max, value);
                            }
                        }
                    }
                }
            }
        }

		function renderAllSummaries(columns, headerRow){
			var i;
			var $row = $(headerRow);
			
			$row.find('.slick-headerrow-column').each(function (idx, el) {
				renderSummaries(columns[idx], el);
			})
		}
		
        function renderSummaries(column, node) {
			var el = node;
			var text = [];
			var idx = _grid.getColumns().indexOf(column);
			var formatter = column.formatter || defaultFormatter;

			$(el).empty();
			$list = $('<ul>').appendTo(el);

			if (!column.summaries || !column.summaries.length || !column.aggregates) {
				return;
			}

			if (column.summaries.indexOf('count') >= 0) {
				$line = $('<li>').appendTo($list);
				$('<label>').text(options.countLabel).appendTo($line);
				$('<span>').html(column.aggregates.count.toString()).appendTo($line);
			}

			if (column.summaries.indexOf('sum') >= 0 && !isNaN(column.aggregates.sum)) {
				$line = $('<li>').appendTo($list);
				$('<label>').text(options.sumLabel).appendTo($line);
				$('<span>').html(formatter(-1, idx, column.aggregates.sum)).appendTo($line);
			}

			if (column.summaries.indexOf('min') >= 0 && !isNaN(column.aggregates.min)) {
				$line = $('<li>').appendTo($list);
				$('<label>').text(options.minLabel).appendTo($line);
				$('<span>').html(formatter(-1, idx, column.aggregates.min)).appendTo($line);
			}

			if (column.summaries.indexOf('max') >= 0 && !isNaN(column.aggregates.max)) {
				$line = $('<li>').appendTo($list);
				$('<label>').text(options.maxLabel).appendTo($line);
				$('<span>').html(formatter(-1, idx, column.aggregates.max)).appendTo($line);
			}

			if (column.summaries.indexOf('avg') >= 0 && column.aggregates.count > 0 && !isNaN(column.aggregates.sum)) {
				$line = $('<li>').appendTo($list);
				$('<label>').text(options.avgLabel).appendTo($line);
				$('<span>').html(formatter(-1, idx, column.aggregates.sum / column.aggregates.count)).appendTo($line);
			}
        }
	
        function handleHeaderRowCellRendered(e, args) {
            $(args.node).empty().data('columnID', args.column.id);

            if (args.column.aggregates == null) {
                computeAggregates(dataView, _grid.getColumns());
            }

			renderSummaries(args.column, args.node);
        }

        function handleRowCountChanged() {
            if (_timeout) {
                window.clearTimeout(_timeout);
            }

            _timeout = window.setTimeout(function () {
                var cols = _grid.getColumns();
				var row = _grid.getHeaderRow();
                computeAggregates(dataView, cols);
                renderAllSummaries(cols, row);
            }, 10);
        }

        function handleBeforeHeaderCellDestroy(e, args) {

        }

        $.extend(this, {
          "init": init,
          "destroy": destroy
        });
    }
})(jQuery);
