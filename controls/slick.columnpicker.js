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

  function SlickColumnPicker(columns, grid, options) {
    var $menu;
    var columnCheckboxes;
    var onUpdateColumns = new Slick.Event();

    var columnsLookup = {};

    var defaults = {
      fadeSpeed: 250,
      forceFitColumnsText: "Force fit columns",
    };

    function updateColumnLookupTable(list) {
      for (var i = 0; i < list.length; i++) {
        columnsLookup[ list[i].id ] = list[i];
      }
    }

    function init() {
      options = $.extend({}, defaults, options);
      updateColumnLookupTable(columns);
      grid.onHeaderContextMenu.subscribe(handleHeaderContextMenu);
      grid.onColumnsReordered.subscribe(updateColumnOrder);

      $menu = $("<span class='slick-columnpicker' style='display:none;position:absolute;z-index:20;' />").appendTo(document.body);

      $menu.bind("mouseleave", function (e) {
        $(this).fadeOut(options.fadeSpeed);
      });
      $menu.bind("click", updateColumn);
    }

    function destroy() {
      grid.onHeaderContextMenu.unsubscribe(handleHeaderContextMenu);
      grid.onColumnsReordered.unsubscribe(updateColumnOrder);
      $menu.remove();
    }

    function handleHeaderContextMenu(e, args) {
      e.preventDefault();
      $menu.empty();
      updateColumnOrder();
      columnCheckboxes = [];

      var $li, $input;
      for (var i = 0; i < columns.length; i++) {
        // Do not show columns (a.k.a. 'protected columns') in the pick list which either:
        // - have an empty 'name' field in their column definition (they would show up as a checkbox for 'nothing' anyway)
        // - are marked as hidden by having an ID which starts with an underscore, e.g. "_checkbox_selector"
        var colName = columns[i].name; 
        if (typeof colName !== "string" && !colName) continue;
        if (colName === '') continue;
        if (/^_./.test(columns[i].id)) continue;

        $li = $("<li />").appendTo($menu);
        $input = $("<input type='checkbox' />").data("column-id", columns[i].id);
        columnCheckboxes.push($input);

        if (grid.getColumnIndex(columns[i].id) != null) {
          $input.attr("checked", "checked");
        }

        $("<label />")
            .text(columns[i].name)
            .prepend($input)
            .appendTo($li);
      }

      $("<hr/>").appendTo($menu);
      $li = $("<li />").appendTo($menu);
      $input = $("<input type='checkbox' />").data("option", "autoresize");
      $("<label />")
          .text(options.forceFitColumnsText)
          .prepend($input)
          .appendTo($li);
      if (grid.getOptions().forceFitColumns) {
        $input.attr("checked", "checked");
      }

      $menu
          .css("top", Math.min(e.pageY, $(window).height() - $menu.height()) - 10)
          .css("left", Math.min(e.pageX, $(window).width() - $menu.width()) - 10)
          .fadeIn(options.fadeSpeed);
    }

    function updateColumnOrder() {
      // Because columns can be reordered, we have to update the `columns`
      // to reflect the new order, however we can't just take `grid.getColumns()`,
      // as it does not include columns currently hidden by the picker.
      // We create a new `columns` structure by leaving currently-hidden
      // columns in their original ordinal position and interleaving the results
      // of the current column sort.
      var current = grid.getColumns().slice(0);
      var ordered = new Array(columns.length);
      for (var i = 0; i < columns.length; i++) {
        var idx = grid.getColumnIndex(columns[i].id);
        if (idx == null) {
          // If the column doesn't return a value from getColumnIndex,
          // it is not visible. Inject it in its original position.
          ordered[i] = columns[i];
        } else {
          // Otherwise, grab the next visible column.
          ordered[i] = current.shift();
        }
      }
      // Now we MAY arrive at a situation where other (userland) code has added columns
      // while we weren't looking: if there are any, then those will linger in the 
      // `current` array right now and we can simply append them.
      columns = ordered.concat(current);
      updateColumnLookupTable(columns);
    }

    function updateColumn(e) {
      if ($(e.target).data("option") === "autoresize") {
        if (e.target.checked) {
          grid.setOptions({forceFitColumns: true});
          grid.autosizeColumns();
        } else {
          grid.setOptions({forceFitColumns: false});
        }
        return;
      }

      if ($(e.target).is(":checkbox")) {
        var visibleColumns = [];
        var invisibleColumns = [];

        $.each(columnCheckboxes, function (i, e) {
          var columnID = $(e).data("column-id");
          if (columnID != null && columnsLookup[columnID]) {
            if ($(this).is(":checked")) {
              visibleColumns.push( columnsLookup[columnID] );
            } else {
              invisibleColumns.push( columnsLookup[columnID] );
            }
          }
        });

        // Always keep at least one column visible:
        if (!visibleColumns.length) {
          $(e.target).attr("checked", "checked");
          return;
        }

        // Now create the proper columns ordered list for SlickGrid by interleaving the 'protected' columns
        // with the new visible set: hat we do is discard the *in*visible set, because that's the equivalent
        // operation.
        var ordered = columns.slice(0);
        var newColumnSet = ordered.filter(function (col) {
          return (invisibleColumns.indexOf(col) === -1);
        });

        grid.setColumns(newColumnSet);

        // @TODO: inspect & remove        
        if (grid.getSelectedRows().length > 0) {
          grid.setSelectedRows(grid.getSelectedRows());
        }

        var evd = new Slick.EventData();
        evd.hiddenColumns = invisibleColumns;
        evd.visibleColumns = visibleColumns;
        onUpdateColumns.notify(visibleColumns, evd);
      }
    }

    function getAllColumns() {
      return columns;
    }

    init();

    return {
      "getAllColumns": getAllColumns,
      "onUpdateColumns": onUpdateColumns,
      "destroy": destroy
    };
  }


  // Slick.Controls.ColumnPicker
  $.extend(true, window, {
    Slick: {
      Controls: {
        ColumnPicker: SlickColumnPicker
      }
    }
  });

})(jQuery);
