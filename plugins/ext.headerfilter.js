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
            Plugins: {
                HeaderFilter: HeaderFilter
            }
        }
    });

    /*
     * Based on SlickGrid Header Menu Plugin (https://github.com/mleibman/SlickGrid/blob/master/plugins/slick.headermenu.js)
     *
     * (Can't be used at the same time as the header menu plugin as it implements the dropdown in the same way)
    */

    function HeaderFilter(options) {
        var grid;
        var self = this;
        var handler = new Slick.EventHandler();
        var defaults = {
            buttonImage: "../images/down.png",
            filterImage: "../images/filter.png",
            sortAscImage: "../images/sort-asc.png",
            sortDescImage: "../images/sort-desc.png",
            sortMenuitems: true,
            textFilter: true,
            messages: {
                ok: "OK",
                clear: "Clear",
                cancel: "Cancel",
                textFilter: "Filter",
                selectAll: "Select All",
                sortAsc: "Sort Ascending",
                sortDesc: "Sort Descending",
                empty: "empty",
                trueDesc: "True",
                falseDesc: "False"
            }
        };
        var $menu;

        function init(g) {
            options = $.extend(true, {}, defaults, options);
            grid = g;
            handler.subscribe(grid.onHeaderCellRendered, handleHeaderCellRendered)
                   .subscribe(grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy)
                   .subscribe(grid.onClick, handleBodyMouseDown)
                   .subscribe(grid.onColumnsResized, columnsResized);

            //grid.setColumns(grid.getColumns());

            $(document.body).bind("mousedown", handleBodyMouseDown);
        }

        function destroy() {
            handler.unsubscribeAll();
            $(document.body).unbind("mousedown", handleBodyMouseDown);
        }

        function isValue(val) {
            return typeof val !== "undefined" && val !== null && val !== "";
        }

        function handleBodyMouseDown(e) {
            if ($menu && $menu[0] !== e.target && !$.contains($menu[0], e.target)) {
                hideMenu();
            }
        }

        function hideMenu() {
            if ($menu) {
                $menu.remove();
                $menu = null;
            }
        }

        function handleHeaderCellRendered(e, args) {
            var column = args.column;
            if (column.nofilter) return;

            var $el = $("<div></div>")
                .addClass("slick-header-menubutton")
                .data("column", column);

            if (options.buttonImage) {
                $el.css("background-image", "url(" + options.buttonImage + ")");
            }

            $el.bind("click", showFilter).appendTo(args.node);
        }

        function handleBeforeHeaderCellDestroy(e, args) {
            $(args.node)
                .find(".slick-header-menubutton")
                .remove();
        }

        function addMenuItem(menu, columnDef, title, command, image) {
            var $item = $("<div class='slick-header-menuitem'>")
                         .data("command", command)
                         .data("column", columnDef)
                         .bind("click", handleMenuItemClick)
                         .appendTo(menu);

            var $icon = $("<div class='slick-header-menuicon'>")
                         .appendTo($item);

            if (image) {
                $icon.css("background-image", "url(" + image + ")");
            }

            $("<span class='slick-header-menucontent'>")
             .text(title)
             .appendTo($item);
        }

        function addTextFilter(menu, columnDef, value) {
            var $li = $("<div class='textfilter'>");

            $("<label>").text(options.messages.textFilter).appendTo($li);

            $("<input type='text'>")
                .val(value)
                .on("change", function(e) {
                    var value = $(e.target).val();
                    columnDef.textFilterValue = isValue(value) ? value : null;
                })
                .appendTo($li);

            $li.appendTo(menu);
        }

        function showFilter(e) {
            // Stop propagation so that it doesn't register as a header click event.
            e.stopPropagation();
            e.preventDefault();

            var $menuButton = $(this);
            var columnDef = $menuButton.data("column");

            columnDef.filterValues = columnDef.filterValues || [];

            // WorkingFilters is a copy of the filters to enable apply/cancel behaviour
            var workingFilters = columnDef.filterValues.slice(0);

            var filterItems;

            if (workingFilters.length === 0) {
                // Filter based all available values
                filterItems = getFilterValues(grid.getData(), columnDef);
            } else {
                // Filter based on current dataView subset
                filterItems = getAllFilterValues(grid.getData().getItems(), columnDef);
            }

            if (!$menu) {
                $menu = $("<div class='slick-header-menu'>").appendTo(document.body);
            }

            $menu.empty();

            if (options.sortMenuitems) {
                addMenuItem($menu, columnDef, options.messages.sortAsc, "sort-asc", options.sortAscImage);
                addMenuItem($menu, columnDef, options.messages.sortDesc, "sort-desc", options.sortDescImage);
            }

            if (columnDef.textFilter) {
                addTextFilter($menu, columnDef, columnDef.textFilterValue);
            }

            var filterOptions = "<label><input type='checkbox' value='-1' />(" + options.messages.selectAll + ")</label>";

            for (var i = 0; i < filterItems.length; i++) {
                var filtered = _.contains(workingFilters, filterItems[i].value);

                filterOptions += "<label><input type='checkbox' value='" + i + "'" +
                                (filtered ? " checked='checked'" : "") +
                                " data-filtervalue='" + filterItems[i].value + "'" +
                                "/>" + filterItems[i].title + "</label>";
            }

            var $filter = $("<div class='filter'>")
                           .append($(filterOptions))
                           .appendTo($menu);

            $("<button>" + options.messages.ok + "</button>")
                .appendTo($menu)
                .bind("click", function (ev) {
                    columnDef.filterValues = workingFilters.splice(0);
                    setButtonImage($menuButton, columnDef.filterValues.length > 0 || isValue(columnDef.textFilterValue));
                    handleApply(ev, columnDef);
                });

            $("<button>" + options.messages.clear + "</button>")
                .appendTo($menu)
                .bind("click", function (ev) {
                    columnDef.filterValues.length = 0;
                    columnDef.textFilterValue = null;
                    setButtonImage($menuButton, false);
                    handleApply(ev, columnDef);
                });

            $("<button>" + options.messages.cancel + "</button>")
                .appendTo($menu)
                .bind("click", hideMenu);

            $(":checkbox", $filter).bind("click", function () {
                workingFilters = changeWorkingFilter(filterItems, workingFilters, $(this));
            });

            var offset = $(this).offset();
            var left = offset.left - $menu.width() + $(this).width() - 8;

            $menu.css("top", offset.top + $(this).height())
                 .css("left", (left > 0 ? left : 0));
        }

        function columnsResized() {
            hideMenu();
        }

        function changeWorkingFilter(filterItems, workingFilters, $checkbox) {
            var value = $checkbox.val();
            var $filter = $checkbox.parent().parent();

            if ($checkbox.val() < 0) {
                // Select All
                if ($checkbox.prop("checked")) {
                    $(":checkbox", $filter).prop("checked", true);
                    workingFilters = _.pluck(filterItems.slice(0), "value");
                } else {
                    $(":checkbox", $filter).prop("checked", false);
                    workingFilters.length = 0;
                }
            } else {
                var index = _.indexOf(workingFilters, filterItems[value].value);

                if ($checkbox.prop("checked") && index < 0) {
                    workingFilters.push(filterItems[value].value);
                } else if (index > -1) {
                    workingFilters.splice(index, 1);
                }
            }

            return workingFilters;
        }

        function setButtonImage($el, filtered) {
            var image = "url(" + (filtered ? options.filterImage : options.buttonImage) + ")";

            $el.css("background-image", image);
        }

        function handleApply(e, columnDef) {
            hideMenu();

            self.onFilterApplied.notify({
                grid: grid,
                column: columnDef
            }, e, self);

            e.preventDefault();
            e.stopPropagation();
        }

        function sanitizeFilterValue(value, columnDef) {
            var title = value;
            if (typeof value === "undefined" || value === null || value === "") {
                title = options.messages.empty;
            }
            else if (value === false) {
                title = options.messages.falseDesc;
            }
            else if (value === true) {
                title = options.messages.trueDesc;
            }
            else if (columnDef.formatterName === "sentenceToWords" || columnDef.formatterName === "date" ) {
                // formatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo)
                title = columnDef.formatter(null, null, value, null, null, {
                    cellCss: [], // ["slick-cell", "l" + cell, "r" + (cell + colspan - 1)],
                    cellStyles: [],
                    html: "",
                    colspan: 1,
                    rowspan: 1,
                    cellHeight: _grid.getOptions().rowHeight,
                    rowMetadata: rowMetadata,
                    columnMetadata: columnMetadata,
                    options: $.extend({}, _grid.getOptions().formatterOptions, m.formatterOptions),
                    outputPlainText: true         // this signals the formatter that the plaintext value is required.
                });
            }

            return { title: title, value: value };
        }

        function getFilterValues(dataView, columnDef) {
            var seen = [], items = [];
            for (var i = 0; i < dataView.getLength() ; i++) {
                var v = sanitizeFilterValue(dataView.getItem(i)[columnDef.field], columnDef);

                if (!_.contains(seen, v.value)) {
                    seen.push(v.value);
                    items.push(v);
                }
            }

            return _.sortBy(items, function (v) {
                return v.title;
            });
        }

        function getAllFilterValues(data, columnDef) {
            var seen = [], items = [];
            for (var i = 0; i < data.length; i++) {
                var v = sanitizeFilterValue(data[i][columnDef.field], columnDef);

                if (!_.contains(seen, v.value)) {
                    seen.push(v.value);
                    items.push(v);
                }
            }

            return _.sortBy(items, function (v) {
                return v.title;
            });
        }

        function handleMenuItemClick(e) {
            var command = $(this).data("command");
            var columnDef = $(this).data("column");

            hideMenu();

            self.onCommand.notify({
                grid: grid,
                column: columnDef,
                command: command
            }, e, self);

            // Stop propagation so that it doesn't register as a header click event.
            e.preventDefault();
            e.stopPropagation();
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "onFilterApplied": new Slick.Event(),
            "onCommand": new Slick.Event()
        });
    }
})(jQuery);
