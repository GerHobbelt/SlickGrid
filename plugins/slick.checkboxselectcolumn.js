(function ($) {
  // register namespace
  $.extend(true, window, {
    Slick: {
      CheckboxSelectColumn: CheckboxSelectColumn
    }
  });


  function CheckboxSelectColumn(options) {
    var _grid;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _selectedRowsLookup = {};
    var _defaults = {
      columnId: "_checkbox_selector",
      columnName: "checkbox",
      cssClass: null,
      headerCssClass: null,
      selectable: true,
      toolTip: "Select/Deselect All",
      field: "sel",
      width: 30,
      minWidth: 26,
      maxWidth: 40,
      resizable: true,
      sortable: false,
      rowselector: true   // is it a column for grid row selection
    };

    var _options = $.extend(true, {}, _defaults, options);

    var selectionChanged = new Slick.Event();

    function init(grid) {
      _grid = grid;
      _handler
        .subscribe(_grid.onSelectedRowsChanged, handleSelectedRowsChanged)
        .subscribe(_grid.onClick, handleClick)
        .subscribe(_grid.onHeaderClick, handleHeaderClick)
        .subscribe(_grid.onKeyDown, handleKeyDown);
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleSelectedRowsChanged(e, args) {
      if (!_options.rowselector) return;

      var selectedRows = _grid.getSelectedRows();
      var data = _grid.getData();
      var selectableRowCount = 0;
      var lookup = {};
      var row, i, rowSelectable;
      var tx_args = {
        added: [],
        removed: []
      };  // eventargs to transmit

      for (i = 0; i < _grid.getDataLength(); i++) {
        rowSelectable = isRowSelectable(data, i);
        if (rowSelectable) {
          selectableRowCount += 1;
        }
      }
      for (i = 0; i < selectedRows.length; i++) {
        row = selectedRows[i];
        lookup[row] = true;
        if (lookup[row] !== _selectedRowsLookup[row]) {
          tx_args.added.push(row);

          _grid.invalidateRow(row);
          delete _selectedRowsLookup[row];
        }
      }
      for (i in _selectedRowsLookup) {
        tx_args.removed.push(_selectedRowsLookup[i]);

        _grid.invalidateRow(i);
      }
      _selectedRowsLookup = lookup;
      _grid.render();

      if (selectedRows.length === selectableRowCount) {
        _grid.updateColumnHeader(_options.columnId, "<input type='checkbox' checked='checked'>", _options.toolTip);
      } else {
        _grid.updateColumnHeader(_options.columnId, "<input type='checkbox'>", _options.toolTip);
      }

      selectionChanged.notify(tx_args);
    }

    function handleKeyDown(e, args) {
      if (e.which == 32) {
        if (_grid.getColumns()[args.cell].id === _options.columnId) {
          // if editing, try to commit
          if (!_grid.getEditorLock().isActive() || _grid.getEditorLock().commitCurrentEdit()) {
            toggleRowSelection(args.row);
          }
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    }

    function handleClick(e, args) {
      // clicking on a row selects checkbox
      if (_grid.getColumns()[args.cell].id === _options.columnId && $(e.target).is(":checkbox")) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        toggleRowSelection(args.row);
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    function toggleRowSelection(row) {
      var data = _grid.getData();
      if (_selectedRowsLookup[row]) {
        _grid.setSelectedRows($.grep(_grid.getSelectedRows(), function (n) {
          return n != row;
        }));
      } else if (isRowSelectable(data, row)) {
        _grid.setSelectedRows(_grid.getSelectedRows().concat(row));
      }
    }

    function handleHeaderClick(e, args) {
      if (args.column.id == _options.columnId && $(e.target).is(":checkbox")) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        if ($(e.target).is(":checked")) {
          var rows = [],
              data = _grid.getData(),
              rowSelectable;
          for (var i = 0; i < _grid.getDataLength(); i++) {
            rowSelectable = isRowSelectable(data, i);
            if (rowSelectable) {
              rows.push(i);
            }
          }
          _grid.setSelectedRows(rows);
        } else {
          _grid.setSelectedRows([]);
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    function getColumnDefinition() {
      return {
        id: _options.columnId,
        name: _options.columnName,
        toolTip: _options.toolTip,
        field: _options.field,
        width: _options.width,
        minWidth: _options.minWidth,
        maxWidth: _options.maxWidth,
        resizable: _options.resizable,
        sortable: _options.sortable,
        nofilter: true,
        hideable: false,
        cssClass: _options.cssClass,
        headerCssClass: _options.headerCssClass,
        selectable: _options.selectable,
        formatter: checkboxSelectionFormatter,
        headerFormatter: checkboxSelectionHeaderFormatter
      };
    }

    function checkboxSelectionHeaderFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
      var output = columnDef.formatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo);
      if (!cellMetaInfo.outputPlainText) {
        output = "<span class='slick-column-name'>" + output + "</span>";
      }
      return output;
    }

    function checkboxSelectionFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
      if (cellMetaInfo.outputPlainText) {
        if (_selectedRowsLookup[row]) {
          return true;
        } else {
          return false;
        }
      } else {
        if (columnDef.selectable) {
          return _selectedRowsLookup[row]
                 ? "<input type='checkbox' checked='checked'>"
                 : "<input type='checkbox'>";
        } else {
          return _selectedRowsLookup[row]
                 ? "<input type='checkbox' checked='checked' disabled>"
                 : "<input type='checkbox' disabled>";
        }
      }
    }

    function isRowSelectable(data, row) {
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row, false);
      if (rowMetadata) {
        return rowMetadata.selectable;
      }
      // when your data[] is not a DataView (or at least does not provide the getItemMetaData API method) then assume answer 'YES' for this question
      return true;
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,

      "getColumnDefinition": getColumnDefinition,
      "selectionChanged": selectionChanged
    });
  }
})(jQuery);
