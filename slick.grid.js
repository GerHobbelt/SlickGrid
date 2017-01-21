/*!
 * @license
 * slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
 * Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
 *
 * Distributed under MIT license.
 * All rights reserved.
 */




/**
 * Contains main grid SlickGrid class.
 * 
 * @module Grid
 * @memberof Slick
 */



/**
> [Wiki](Home) ▸ **API Reference**

This is the API reference for SlickGrid.

### [[Slick.Grid]]

* <a href="Slick.Grid#wiki-header-constructor">Constructor</a> - Slick.Grid constructor
* <a href="Slick.Grid#wiki-header-core">Core</a> - Core grid functionality
* <a href="Slick.Grid#wiki-header-columns">Columns</a> - Initializing and customizing columns
* <a href="Slick.Grid#wiki-header-cells">Cells</a> - Manipulating cell data and styling
* <a href="Slick.Grid#wiki-header-rendering">Rendering</a> - Rendering methods
* <a href="Slick.Grid#wiki-header-headers">Headers</a> - Column header methods


### [[Obsoleted / Killed Stuff]]

[[Obsolete-Killed-APIs]]


### Events

SlickGrid exposes the following events:

* onScroll
* onSort
* onHeaderMouseEnter
* onHeaderMouseLeave
* onHeaderContextMenu
* onHeaderClick
* onHeaderCellRendered
* onBeforeHeaderCellDestroy
* onHeaderRowCellRendered
* onBeforeHeaderRowCellDestroy
* onFocusOut
* onFocusSet
* onMouseEnter
* onMouseLeave
* onClick
* onDblClick
* onContextMenu
* onKeyDown
* onAddNewRow
* onValidationError
* onCanvasWidthChanged
* onViewportChanged
* onColumnsStartReorder
* onColumnsReordering
* onColumnsReordered
* onColumnsStartResize
* onColumnsResizing
* onColumnsResized
* onCellChange
* onBeforeEditCell
* onBeforeCellEditorDestroy
* onBeforeDestroy
* onActiveCellChanged
* onActiveCellPositionChanged
* onHeaderDragInit
* onHeaderDragStart
* onHeaderDrag
* onHeaderDragEnd
* onDragInit
* onDragStart
* onDrag
* onDragEnd
* onSelectedRowsChanged -- **obsoleted**
* onSelectedRangesChanged 

  ```  
  {
    rows: selectedRows,
    ranges: ranges,
    hash: hash,             // `ranges` filtered through `canCellBeSelected()`, ready for `setCellCssStyles()` et al 
    grid: self
  }
  ```
* onCellCssStylesChanged
* onRowsRendered

You can subscribe to the above events using a syntax similar to:

    gridInstance.onXYZEvent.subscribe(function (e,args) {
        //event handling code.
    });

Event handlers can also be removed with

    gridInstance.onXYZEvent.unsubscribe(fn);





### Options

As included in the examples or described in stable releases:

| Option | Default | Description |
|--------|---------|-------------|
| asyncEditorLoading | false | Makes cell editors load asynchronously after a small delay. This greatly increases keyboard navigation speed.|
| asyncEditorLoadDelay|100|Delay after which cell editor is loaded. Ignored unless asyncEditorLoading is true.|
| asyncPostRenderDelay | 50 ||
| autoEdit | true | Cell will not automatically go into edit mode when selected.|
| autoHeight | false | This disables vertical scrolling. |
| cellFlashingCssClass|"flashing"|A CSS class to apply to flashing cells via flashCell().|
| selectedCellCssClass|"selected"|A CSS class to apply to cells highlighted via XXXXXXXXXXXXXXXXXXXXXXXX().|
| dataItemColumnValueExtractor | null ||
| defaultColumnWidth|80||
| defaultFormatter | defaultFormatter ||
| editable | false ||
| editCommandHandler | queueAndExecuteCommand | _Not listed as a default under options in slick.grid.js_ |
| editorFactory | null | A factory object responsible to creating an editor for a given cell. Must implement getEditor(column). |
| editorLock | Slick.GlobalEditorLock | A Slick.EditorLock instance to use for controlling concurrent data edits. |
| enableAddRow | false | If true, a blank row will be displayed at the bottom - typing values in that row will add a new one. Must subscribe to onAddNewRow to save values. |
| enableAsyncPostRender | false | If true, async post rendering will occur and asyncPostRender delegates on columns will be called. |
| enableCellRangeSelection | null| **WARNING**: Not contained in SlickGrid 2.1, may be deprecated |
| enableCellNavigation | true | Appears to enable cell virtualisation for optimised speed with large datasets |
| enableColumnReorder | true||
| enableRowReordering | null| **WARNING**: Not contained in SlickGrid 2.1, may be deprecated |
| enableTextSelectionOnCells | false||
| explicitInitialization | false | See: [Example: Explicit Initialization](../tree/k0stya-rowspan/examples/example-explicit-initialization.html) |
| forceFitColumns | false | Force column sizes to fit into the container (preventing horizontal scrolling). Effectively sets column width to be 1/Number of Columns which on small containers may not be desirable |
| forceSyncScrolling | false ||
| formatterFactory | null | A factory object responsible to creating a formatter for a given cell. Must implement getFormatter(column). |
| fullWidthRows | false | Will expand the table row divs to the full width of the container, table cell divs will remain aligned to the left |
| headerRowHeight | 25 ||
| leaveSpaceForNewRows | false ||
| multiColumnSort | false | See: [Example: Multi-Column Sort](../tree/k0stya-rowspan/examples/example-multi-column-sort.html) |
| multiSelect | true ||
| rowHeight|25||
| selectedCellCssClass | "selected" ||
| showHeaderRow | false||
| topPanelHeight|25||



























> [Wiki](Home) ▸ [[API Reference]] ▸ **Slick.Grid**

# Table of Contents

* <a href="#wiki-header-constructor">**Constructor**</a>
  * <a href="#wiki-constructor">new Slick.Grid</a>
* <a href="#wiki-header-core">**Core**</a>
  * <a href="#wiki-init">init</a>
  * <a href="#wiki-getData">getData</a>
  * <a href="#wiki-setData">setData</a>
  * <a href="#wiki-getDataItem">getDataItem</a>
  * <a href="#wiki-getSelectionModel">getSelectionModel</a>
  * <a href="#wiki-setOptions">setOptions</a>
* <a href="#wiki-header-columns">**Columns**</a>
  * <a href="#wiki-autosizeColumns">autosizeColumns</a>
  * <a href="#wiki-getColumnIndex">getColumnIndex</a>
  * <a href="#wiki-getColumns">getColumns</a>
  * <a href="#wiki-setColumns">setColumns</a>
  * <a href="#wiki-setSortColumn">setSortColumn</a>
  * <a href="#wiki-setSortColumns">setSortColumns</a>
  * <a href="#wiki-updateColumnHeader">updateColumnHeader</a>
* <a href="#wiki-header-cells">**Cells**</a>
  * <a href="#wiki-addCellCssStyles">addCellCssStyles</a>
  * <a href="#wiki-canCellBeActive">canCellBeActive</a>
  * <a href="#wiki-canCellBeSelected">canCellBeSelected</a>
  * <a href="#wiki-editActiveCell">editActiveCell</a>
  * <a href="#wiki-getActiveCell">getActiveCell</a>
  * <a href="#wiki-getCellEditor">getCellEditor</a>
  * <a href="#wiki-getCellFromEvent">getCellFromEvent</a>
  * <a href="#wiki-getCellFromPoint">getCellFromPoint</a>
  * <a href="#wiki-getCellNode">getCellNode</a>
  * <a href="#wiki-getCellNodeBox">getCellNodeBox</a>
  * <a href="#wiki-gotoCell">gotoCell</a>
  * <a href="#wiki-navigateDown">navigateDown</a>
  * <a href="#wiki-navigateLeft">navigateLeft</a>
  * <a href="#wiki-navigateNext">navigateNext</a>
  * <a href="#wiki-navigatePrev">navigatePrev</a>
  * <a href="#wiki-navigateRight">navigateRight</a>
  * <a href="#wiki-navigateUp">navigateUp</a>
  * <a href="#wiki-removeCellCssStyles">removeCellCssStyles</a>
  * <a href="#wiki-resetActiveCell">resetActiveCell</a>
  * <a href="#wiki-setActiveCell">setActiveCell</a>
  * <a href="#wiki-setCellCssStyles">setCellCssStyles</a>
* <a href="#wiki-header-rendering">**Rendering**</a>
  * <a href="#wiki-getCanvasNode">getCanvasNode</a>
  * <a href="#wiki-getRenderedRange">getRenderedRange</a>
  * <a href="#wiki-getViewport">getViewport</a>
  * <a href="#wiki-invalidate">invalidate</a>
  * <a href="#wiki-invalidateRow">invalidateRow</a>
  * <a href="#wiki-invalidateRows">invalidateRows</a>
  * <a href="#wiki-resizeCanvas">resizeCanvas</a>
  * <a href="#wiki-scrollCellIntoView">scrollCellIntoView</a>
  * <a href="#wiki-scrollRowIntoView">scrollRowIntoView</a>
  * <a href="#wiki-scrollRowToTop">scrollRowToTop</a>
  * <a href="#wiki-updateCell">updateCell</a>
  * <a href="#wiki-updateRow">updateRow</a>
  * <a href="#wiki-updateRowCount">updateRowCount</a>
* <a href="#wiki-header-headers">**Headers**</a>
  * <a href="#wiki-getHeaderRow">getHeaderRow</a>
  * <a href="#wiki-getHeaderRowColumn">getHeaderRowColumn</a>
  * <a href="#wiki-getSortColumns">getSortColumns</a>
  * <a href="#wiki-setHeaderRowVisibility">setHeaderRowVisibility</a>

# <a name="header-constructor" href="Slick.Grid#wiki-header-constructor">#</a> Constructor

<a name="constructor" href="Slick.Grid#wiki-constructor">#</a> var grid = new Slick.Grid(<i>container, data, columns, options</i>);

>`container` - Container node to create the grid in. This can be a DOM Element, a jQuery node, or a jQuery selector.
>
>`data` - Databinding source. This can either be a regular JavaScript array or a custom object exposing getItem(index) and getLength() functions.
>
>`columns` - An array of column definition objects. See [[Column Options]] for a list of options that can be included on each column definition object.
>
>`options` - Additional options. See [[Grid Options]] for a list of options that can be included.

Create an instance of the grid.

Example usage, taken from [the basic Slickgrid example](http://mleibman.github.com/SlickGrid/examples/example1-simple.html):

```javascript
  var grid;
  var columns = [
    {id: "title", name: "Title", field: "title"},
    {id: "duration", name: "Duration", field: "duration"},
    {id: "%", name: "% Complete", field: "percentComplete"},
    {id: "start", name: "Start", field: "start"},
    {id: "finish", name: "Finish", field: "finish"},
    {id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
  ];

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false
  };

  $(function () {
    var data = [];
    for (var i = 0; i < 500; i++) {
      data[i] = {
        title: "Task " + i,
        duration: "5 days",
        percentComplete: Math.round(Math.random() * 100),
        start: "01/01/2009",
        finish: "01/05/2009",
        effortDriven: (i % 5 == 0)
      };
    }

    grid = new Slick.Grid("#myGrid", data, columns, options);
```

# <a name="header-core" href="Slick.Grid#wiki-header-core">#</a> Core

<a name="init" href="Slick.Grid#wiki-init">#</a> grid.<b>init</b>(<i></i>)

Initializes the grid. Called after plugins are registered. Normally, this is called by the constructor, so you don't need to call it. However, in certain cases you may need to delay the initialization until some other process has finished. In that case, set the `explicitInitialization` option to `true` and call the `grid.init()` manually.

<a name="getData" href="Slick.Grid#wiki-getData">#</a> grid.<b>getData</b>(<i></i>)

Returns an array of every data object, unless you're using `DataView` in which case it returns a DataView object.

<a name="getDataItem" href="Slick.Grid#wiki-getDataItem">#</a> grid.<b>getDataItem</b>(<i>index</i>)

>`index` - Item index.

Returns the databinding item at a given position.
```javascript
// Get the id of the 15th item
var id15 = grid.getDataItem(14).id;
```

<a name="setData" href="Slick.Grid#wiki-setData">#</a> grid.<b>setData</b>(<i>newData, scrollToTop</i>)

>`data` - New databinding source. This can either be a regular JavaScript array or a custom object exposing `getItem(index)` and `getLength()` functions.

>`scrollToTop` - If true, the grid will reset the vertical scroll position to the top of the grid. 

Sets a new source for databinding and removes all rendered rows.  Note that this doesn't render the new rows - you can follow it with a call to `render()` to do that.

<a name="getDataLength" href="Slick.Grid#wiki-getDataLength">#</a> grid.<b>getDataLength</b>(<i></i>)

Returns the size of the databinding source.

```javascript
// Create an array of just the ids from every data item
var ids = [];
for (var i=0; i<grid.getDataLength() ; i++) {
  ids.push(grid.getDataItem(i).id);
}
```

<a name="getOptions" href="Slick.Grid#wiki-getOptions">#</a> grid.<b>getOptions</b>(<i></i>)

Returns an object containing all of the Grid options set on the grid. [See a list of Grid Options here](https://github.com/mleibman/SlickGrid/wiki/Grid-Options).

```javascript
// Find all elements that are currently selected
var $selectedCells = $('.' + grid.getOptions().selectedCellCssClass);
```

<a name="getSelectedRows" href="Slick.Grid#wiki-getSelectedRows">#</a> grid.<b>getSelectedRows</b>(<i></i>)

Returns an array of row indices corresponding to the currently selected rows.

<a name="getSelectionModel" href="Slick.Grid#wiki-getSelectionModel">#</a> grid.<b>getSelectionModel</b>(<i></i>)

Returns the current SelectionModel. [See here for more information about SelectionModels](https://github.com/mleibman/SlickGrid/wiki/Handling-selection).

<a name="setOptions" href="Slick.Grid#wiki-setOptions">#</a> grid.<b>setOptions</b>(<i>options</i>)

> `options` - An object with configuration options.

Extends grid options with a given hash. If there is an active edit, the grid will attempt to commit the changes and only continue if the attempt succeeds.

```javascript
// set a new CSS class for selected cells
grid.setOptions( { selectedCellCssClass: "newSelection" } );

// Select the first row
// @TODO: inspect & remove        
grid.setSelectedRows([0]);

// get the elements for the selected cells
$('.newSelection');
```

<a name="setSelectedRows" href="Slick.Grid#wiki-setSelectedRows">#</a> grid.<b>setSelectedRows</b>(<i>rowsArray</i>)

** WARNING **: obsoleted / deprecated; needs rework!

> `rowsArray` - An array of row numbers.

Accepts an array of row indices and applies the current `selectedCellCssClass` to the cells in the row, respecting whether cells have been flagged as `selectable`.

```javascript
// Select the first three rows
// @TODO: inspect & remove        
grid.setSelectedRows([0, 1, 2]);
```

<a name="setSelectionModel" href="Slick.Grid#wiki-setSelectionModel">#</a> grid.<b>setSelectionModel</b>(<i>selectionModel</i>)

`selectionModel` - A [SelectionModel](https://github.com/mleibman/SlickGrid/wiki/Handling-selection).

Unregisters a current selection model and registers a new one. See [the definition of SelectionModel](https://github.com/mleibman/SlickGrid/wiki/Handling-selection) for more information.

# <a name="header-columns" href="Slick.Grid#wiki-header-columns">#</a> Columns
<a name="autosizeColumns" href="Slick.Grid#wiki-autosizeColumns">#</a> grid.<b>autosizeColumns</b>(<i></i>)

Proportionately resizes all columns to fill available horizontal space.  This does not take the cell contents into consideration.

<a name="getColumnIndex" href="Slick.Grid#wiki-getColumnIndex">#</a> grid.<b>getColumnIndex</b>(<i>id</i>)

>`id` - A column id.

Returns the index of a column with a given id.  Since columns can be reordered by the user, this can be used to get the column definition independent of the order:

```javascript
var column = grid.getColumns()[grid.getColumnIndex("title")]
```

<a name="getColumns" href="Slick.Grid#wiki-getColumns">#</a> grid.<b>getColumns</b>(<i></i>)

Returns an array of column definitions, containing the option settings for each individual column.

```javascript
// Log to console whether the first column is sortable
var cols = grid.getColumns();
var sortable = cols[0].sortable;
sortable ? console.log("It's sortable!") : console.log("It's not sortable!");
```

<a name="setColumns" href="Slick.Grid#wiki-setColumns">#</a> grid.<b>setColumns</b>(<i>columnDefinitions</i>)

>`columnDefinitions` - An array of column definitions.

Sets grid columns.  Column headers will be recreated and all rendered rows will be removed.  To re-render the grid (if necessary), call `render()`.

```javascript
// Change the name of the first column to "First"
var data = grid.getColumns();
data[0].name = "First";
grid.setColumns(data);
```

<a name="setSortColumn" href="Slick.Grid#wiki-setSortColumn">#</a> grid.<b>setSortColumn</b>(<i>columnId, ascending</i>)

Accepts a `columnId` string and an `ascending` boolean. Applies a sort glyph in either ascending or descending form to the header of the column. Note that this does _not_ actually sort the column. It only adds the sort glyph to the header.

<a name="setSortColumns" href="Slick.Grid#wiki-setSortColumns">#</a> grid.<b>setSortColumns</b>(<i>cols</i>)

Accepts an array of objects in the form `[ { columnId: [string], sortAsc: [boolean] }, ... ]`. When called, this will apply a sort glyph in either ascending or descending form to the header of each column specified in the array. Note that this does _not_ actually sort the column. It only adds the sort glyph to the header

<a name="updateColumnHeader" href="Slick.Grid#wiki-updateColumnHeader">#</a> grid.<b>updateColumnHeader</b>(<i>columnId, title, toolTip</i>)

>`id` - Column id.
>
> `title` - New column name.
>
> `toolTip` - New column tooltip.

Updates an existing column definition and a corresponding header DOM element with the new title and tooltip.

```javascript
// Change the column with an id of 'FirstName' to have the name "A First Name", and no tooltip.
grid.updateColumnHeader("FirstName", "A First Name");
```

# <a name="header-cells" href="Slick.Grid#wiki-header-cells">#</a> Cells

<a name="addCellCssStyles" href="Slick.Grid#wiki-addCellCssStyles">#</a> grid.<b>addCellCssStyles</b>(<i>key, hash</i>)

> `key` - A unique key you can use in calls to setCellCssStyles and removeCellCssStyles. If a hash with that key has already been set, an exception will be thrown.
>
>`hash` - A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
>
> Example:
>
>```javascript
{
    0:    {
        "number_column":    "cell-bold",
        "title_column":     "cell-title cell-highlighted"
    },
    4:    {
        "percent_column":    "cell-highlighted"
    }
}
>```

Adds an "overlay" of CSS classes to cell DOM elements. SlickGrid can have many such overlays associated with different keys and they are frequently used by plugins. For example, SlickGrid uses this method internally to decorate selected cells with selectedCellCssClass (see options).

<a name="canCellBeActive" href="Slick.Grid#wiki-canCellBeActive">#</a> grid.<b>canCellBeActive</b>(<i>row, col</i>)

>`row` - A row index.
>
>`col` - A column index.

Returns `true` if you can click on a given cell and make it the active focus.

<a name="canCellBeSelected" href="Slick.Grid#wiki-canCellBeSelected">#</a> grid.<b>canCellBeSelected</b>(<i>row, col</i>)

>`row` - A row index.
>
>`col` - A column index.

Returns `true` if selecting the row causes this particular cell to have the `selectedCellCssClass` applied to it. A cell can be selected if it exists and if it isn't on an empty / "Add New" row and if it is not marked as "unselectable" in the column definition.

<a name="editActiveCell" href="Slick.Grid#wiki-editActiveCell">#</a> grid.<b>editActiveCell</b>(<i>editor</i>)

>`editor` - A SlickGrid editor (see examples in `slick.editors.js`).

Attempts to switch the active cell into edit mode. Will throw an error if the cell is set to be not editable. Uses the specified `editor`, otherwise defaults to any default editor for that given cell.

```javascript
// Assuming slick.editors.js is included...
// Set the first cell in the first row to be active
grid.setActiveCell(0,0);

// Invoke the Date editor on that cell
grid.editActiveCell(Slick.Editors.Date);
```

<a name="flashCell" href="Slick.Grid#wiki-flashCell">#</a> grid.<b>flashCell</b>(<i>row, cell, speed</i>)

>`row` - A row index.
>
>`cell` - A column index.
>
>`speed` (optional) - The milliseconds delay between the toggling calls. Defaults to 100 ms.

Flashes the cell twice by toggling the CSS class 4 times.

<a name="getActiveCell" href="Slick.Grid#wiki-getActiveCell">#</a> grid.<b>getActiveCell</b>(<i></i>)

Returns an object representing the coordinates of the currently active cell:

```javascript
{
  row: activeRow, 
  cell: activeCell
}
```

<a name="getActiveCellNode" href="Slick.Grid#wiki-getActiveCellNode">#</a> grid.<b>getActiveCellNode</b>(<i></i>)

Returns the DOM element containing the currently active cell. If no cell is active, null is returned.

```javascript
// Get the element for the active cell
var $active = $(grid.getActiveCellNode())

// Add a new class to the active cell
$active.addClass('myClass');
```

<a name="getActiveCellPosition" href="Slick.Grid#wiki-getActiveCellPosition">#</a> grid.<b>getActiveCellPosition</b>(<i></i>)

Returns an object representing information about the active cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors. The object takes the form:

```javascript
{ 
  bottom:  [numPixels],
  height:  [numPixels],
  left:    [numPixels], 
  right:   [numPixels], 
  top:     [numPixels], 
  visible: [boolean], 
  width:   [numPixels] 
}
```
<a name="getCellCssStyles" href="Slick.Grid#wiki-getCellCssStyles">#</a> grid.<b>getCellCssStyles</b>(<i>key</i>)

>`key` - A string.

Accepts a key name, returns the group of CSS styles defined under that name. See <a href="#wiki-setCellCssStyles">`setCellCssStyles`</a> for more info.

<a name="getCellEditor" href="Slick.Grid#wiki-getCellEditor">#</a> grid.<b>getCellEditor</b>(<i></i>)

Returns the active cell editor.  If there is no actively edited cell, null is returned.

<a name="getCellFromEvent" href="Slick.Grid#wiki-getCellFromEvent">#</a> grid.<b>getCellFromEvent</b>(<i>e</i>)

>`e` - A standard W3C/jQuery event.

Returns a hash containing row and cell indexes from a standard W3C/jQuery event.

<a name="getCellFromPoint" href="Slick.Grid#wiki-getCellFromPoint">#</a> grid.<b>getCellFromPoint</b>(<i>x, y</i>)

>`x` - An x coordinate.
>
>`y` - A y coordinate.

Returns a hash containing row and cell indexes. Coordinates are relative to the top left corner of the grid beginning with the first row (not including the column headers).

<a name="getCellNode" href="Slick.Grid#wiki-getCellNode">#</a> grid.<b>getCellNode</b>(<i>row, cell</i>)

>`row` - A row index.
>
>`cell` - A column index.

Returns a DOM element containing a cell at a given row and cell.

<a name="getCellNodeBox" href="Slick.Grid#wiki-getCellNodeBox">#</a> grid.<b>getCellNodeBox</b>(<i>row, cell</i>)

>`row` - A row index.
>
>`cell` - A column index.

Returns an object representing information about a cell's position. All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors. The object takes the form:

```javascript
{ 
  bottom:  [numPixels],
  height:  [numPixels],
  left:    [numPixels], 
  right:   [numPixels], 
  top:     [numPixels], 
  visible: [boolean], 
  width:   [numPixels] 
}
```

<a name="gotoCell" href="Slick.Grid#wiki-gotoCell">#</a> grid.<b>gotoCell</b>(<i>row, cell, forceEditMode</i>)

Accepts a `row` integer and a `cell` integer, scrolling the view to the row where `row` is its row index, and `cell` is its cell index. Optionally accepts a `forceEditMode` boolean which, if true, will attempt to initiate the edit dialogue for the field in the specified cell.

Unlike `setActiveCell`, this scrolls the row into the viewport and sets the keyboard focus.

<a name="navigateDown" href="Slick.Grid#wiki-navigateDown">#</a> grid.<b>navigateDown</b>(<i></i>)

Switches the active cell one row down skipping unselectable cells. Returns a boolean saying whether it was able to complete or not.

<a name="navigateLeft" href="Slick.Grid#wiki-navigateLeft">#</a> grid.<b>navigateLeft</b>(<i></i>)

Switches the active cell one cell left skipping unselectable cells.  Unline `navigatePrev`, `navigateLeft` stops at the first cell of the row. Returns a boolean saying whether it was able to complete or not.

<a name="navigateNext" href="Slick.Grid#wiki-navigateNext">#</a> grid.<b>navigateNext</b>(<i></i>)

Tabs over active cell to the next selectable cell. Returns a boolean saying whether it was able to complete or not.

<a name="navigatePrev" href="Slick.Grid#wiki-navigatePrev">#</a> grid.<b>navigatePrev</b>(<i></i>)

Tabs over active cell to the previous selectable cell. Returns a boolean saying whether it was able to complete or not.

<a name="navigateRight" href="Slick.Grid#wiki-navigateRight">#</a> grid.<b>navigateRight</b>(<i></i>)

Switches the active cell one cell right skipping unselectable cells.  Unline `navigateNext`, `navigateRight` stops at the last cell of the row. Returns a boolean saying whether it was able to complete or not.

<a name="navigateUp" href="Slick.Grid#wiki-navigateUp">#</a> grid.<b>navigateUp</b>(<i></i>)

Switches the active cell one row up skipping unselectable cells. Returns a boolean saying whether it was able to complete or not.

<a name="removeCellCssStyles" href="Slick.Grid#wiki-removeCellCssStyles">#</a> grid.<b>removeCellCssStyles</b>(<i>key</i>)

>`key` - A string key.

Removes an "overlay" of CSS classes from cell DOM elements.  See <a href="#wiki-setCellCssStyles">`setCellCssStyles`</a> for more.

<a name="resetActiveCell" href="Slick.Grid#wiki-resetActiveCell">#</a> grid.<b>resetActiveCell</b>(<i></i>)

Resets active cell.

<a name="setActiveCell" href="Slick.Grid#wiki-setActiveCell">#</a> grid.<b>setActiveCell</b>(<i>row, cell</i>)

>`row` - A row index.
>
>`cell` - A column index.

Sets an active cell.

<a name="setCellCssStyles" href="Slick.Grid#wiki-setCellCssStyles">#</a> grid.<b>setCellCssStyles</b>(<i>key, hash</i>)

> `key` - A string key. Will overwrite any data already associated with this key.
>
>`hash` - A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
>
> Example:
>
>```javascript
{
    0:    {
        "number_column":    "cell-bold",
        "title_column":     "cell-title cell-highlighted"
    },
    4:    {
        "percent_column":    "cell-highlighted"
    }
}
>```

Sets CSS classes to specific grid cells by calling `removeCellCssStyles(key)` followed by `addCellCssStyles(key, hash)`. `key` is name for this set of styles so you can reference it later - to modify it or remove it, for example. `hash` is a per-row-index, per-column-name nested hash of CSS classes to apply.

Suppose you have a grid with columns:

```javascript
["login", "name", "birthday", "age", "likes_icecream", "favorite_cake"]
```

...and you'd like to highlight the "birthday" and "age" columns for people whose birthday is today, in this case, rows at index 0 and 9. (The first and tenth row in the grid).

```css
   .highlight{ background: yellow } 
```

```javascript
grid.setCellCssStyles("birthday_highlight", {
   0: {
        birthday: "highlight", 
        age: "highlight" 
       },

   9: {
         birthday: "highlight",
         age: "highlight"
       }
})
```

# <a name="header-rendering" href="Slick.Grid#wiki-header-rendering">#</a> Rendering
<a name="getCanvasNode" href="Slick.Grid#wiki-getCanvasNode">#</a> grid.<b>getCanvasNode</b>(<i></i>)

Returns the DIV element matching class `grid-canvas`, which contains every data row currently being rendered in the DOM.

```javascript
// Get the total number of data rows being rendered in the DOM.
var numRenderedRows = $(grid.getCanvasNode()).children().length;
```

<a name="getGridPosition" href="Slick.Grid#wiki-getGridPosition">#</a> grid.<b>getGridPosition</b>(<i></i>)

Returns an object representing information about the grid's position on the page. The object takes the form:

```javascript
{ 
  bottom:  [numPixels],
  height:  [numPixels],
  left:    [numPixels], 
  right:   [numPixels], 
  top:     [numPixels], 
  visible: [boolean], 
  width:   [numPixels] 
}
```

<a name="getRenderedRange" href="Slick.Grid#wiki-getRenderedRange">#</a> grid.<b>getRenderedRange</b>(<i>viewportTop, viewportLeft</i>)

>`viewportTop` (optional) - The number of pixels offset from the top of the grid.
>
>`viewportLeft` (optional) - The number of pixels offset from the left of the grid.

If passed no arguments, returns an object that tells you the range of rows (by row number) currently being rendered, as well as the left/right range of pixels currently rendered. `{ top: [rowIndex], bottom: [rowIndex], leftPx: [numPixels], rightPx: [numPixels] }`

The options `viewportTop` and `viewportLeft` are optional, and tell what what would be rendered at a certain scroll top/left offset. For example, `grid.getRenderedRange(1000)` would essentially be asking: "if I were to scroll 1000 pixels down, what rows would be rendered?"

<a name="getViewport" href="Slick.Grid#wiki-getViewport">#</a> grid.<b>getViewport</b>(<i>viewportTop, viewportLeft</i>)

>`viewportTop` (optional) - The number of pixels offset from the top of the grid.
>
>`viewportLeft` (optional) - The number of pixels offset from the left of the grid.

Returns an object telling you which rows are currently being displayed on the screen, and also the pixel offsets for left/right scrolling. `{ top: [rowIndex], bottom: [rowIndex], leftPx: [numPixels], rightPx: [numPixels] }`

Also accepts `viewportTop` and `viewportLeft` offsets to tell you what would be shown to the user if you were to scroll to that point.

<a name="invalidate" href="Slick.Grid#wiki-invalidate">#</a> grid.<b>invalidate</b>(<i></i>)

Redraws the grid. Invalidates all rows and calls `render()`.

```javascript
// Change the name property of the first row
var data = grid.getData();
data[0].name = "New name!"

// Call invalidate to render the data again. No need to call render, as this calls it for you.
grid.invalidate();
```

<a name="invalidateAllRows" href="Slick.Grid#wiki-invalidateAllRows">#</a> grid.<b>invalidateAllRows</b>(<i></i>)

Tells the grid that all rows in the table are invalid. (If `render()` is called after this, it will redraw the entire grid.)

<a name="invalidateRow" href="Slick.Grid#wiki-invalidateRow">#</a> grid.<b>invalidateRow</b>(<i>row</i>)

> `row` - A row index.

Tells the grid that the row specified by `row` is invalid. (If `render()` is called after this, it will redraw the contents of that row.)

<a name="invalidateRows" href="Slick.Grid#wiki-invalidateRows">#</a> grid.<b>invalidateRows</b>(<i>rows</i>)

> `rows` - An array of row indices.

Accepts an array of row indices, and tells the grid that those rows are invalid. (If `render()` is called after this, it will redraw the contents of those rows.)

```javascript
// Change the name property of the first row
var data = grid.getData();
data[0].name = "New name!"
data[1].name = "Another new name!"

// Call invalidateRows to invalidate the first two rows
grid.invalidateRows([0,1]);

// Call render to render them again
grid.render();
```

<a name="render" href="Slick.Grid#wiki-render">#</a> grid.<b>render</b>(<i></i>)

Rerenders rows in the DOM.

<a name="resizeCanvas" href="Slick.Grid#wiki-resizeCanvas">#</a> grid.<b>resizeCanvas</b>(<i></i>)

Resizes the canvas to fit the current DIV container. (For example, to resize the grid, you would first change the size of the div, then call `resizeCanvas()`.)

<a name="scrollCellIntoView" href="Slick.Grid#wiki-scrollCellIntoView">#</a> grid.<b>scrollCellIntoView</b>(<i>row, cell</i>)

>`row` - A row index.
>
>`cell` - A column index.

Scrolls the indicated cell into view.

Note that this does nothing unless the indicated column is already not in view. For example, if the grid is scrolled to the far left and you were looking at row 0, calling `scrollCellIntoView(100,0)` would not simply scroll you to row 100. But if column 8 were out of view and you called `scrollCellIntoView(100,8)`, then it would scroll down and to the right.

<a name="scrollRowIntoView" href="Slick.Grid#wiki-scrollRowIntoView">#</a> grid.<b>scrollRowIntoView</b>(<i>row, doPaging</i>)

>`row` - A row index.
>
>`doPaging` - A boolean. If `false`, the grid will scroll so the indicated row is at the top of the view. If `true`, the grid will scroll so the indicated row is at the bottom of the view. Defaults to `false`.

Scrolls the view to the indicated row.

<a name="scrollRowToTop" href="Slick.Grid#wiki-scrollRowToTop">#</a> grid.<b>scrollRowToTop</b>(<i>row</i>)

>`row` - A row index.

Scrolls the view to the indicated row, placing the row at the top of the view.

<a name="updateCell" href="Slick.Grid#wiki-updateCell">#</a> grid.<b>updateCell</b>(<i>row, cell</i>)

TODO
```javascript
// put stuff here
```

<a name="updateRow" href="Slick.Grid#wiki-updateRow">#</a> grid.<b>updateRow</b>(<i>row</i>)

TODO
```javascript
// put stuff here
```

<a name="updateRowCount" href="Slick.Grid#wiki-updateRowCount">#</a> grid.<b>updateRowCount</b>(<i></i>)

TODO
```javascript
// put stuff here
```

# <a name="header-headers" href="Slick.Grid#wiki-header-headers">#</a> Headers

<a name="getHeaderRow" href="Slick.Grid#wiki-getHeaderRow">#</a> grid.<b>getHeaderRow</b>(<i></i>)

Returns the element of a DIV row beneath the actual column headers. For an example of how you might use this, see the [header row quick filter example](http://mleibman.github.com/SlickGrid/examples/example-header-row.html), which grabs the element, appends inputs, and delegates events to the inputs.

<a name="getHeaderRowColumn" href="Slick.Grid#wiki-getHeaderRowColumn">#</a> grid.<b>getHeaderRowColumn</b>(<i>columnId</i>)

>`columnId` - The `id` string of a column.

If a header row is implemented and has one child for each column, as seen in the [header row quick filter example](http://mleibman.github.com/SlickGrid/examples/example-header-row.html), you may use this function to pass a columnId and get the individual cell from that header row. Returns a DIV element.

<a name="getSortColumns" href="Slick.Grid#wiki-getSortColumns">#</a> grid.<b>getSortColumns</b>(<i></i>)

Returns an array of objects representing columns that have a sort glyph in the header: 

```javascript
{ 
  columnId: [string],
  sortAsc:  [boolean]
}
```

<a name="getTopPanel" href="Slick.Grid#wiki-getTopPanel">#</a> grid.<b>getTopPanel</b>(<i></i>)

Returns the DIV element of the top panel. The panel is hidden by default, but you can show it by initializing the grid with `showTopPanel` set to `true`, or by calling `grid.setTopPanelVisibility(true)`.

```javascript
// Create a subheader and attach it to the top panel
$("<div>Here is a subheader!</div>")
  .appendTo(grid.getTopPanel());
// Show the top panel
grid.setTopPanelVisibility(true);
```

<a name="setHeaderRowVisibility" href="Slick.Grid#wiki-setHeaderRowVisibility">#</a> grid.<b>setHeaderRowVisibility</b>(<i>visible</i>)

TODO
```javascript
// put stuff here
```































 * @module Grid
 * @memberof Slick
 */














/**
 * NOTES:
 *     Cell/row DOM manipulations are done directly bypassing jQuery's DOM manipulation methods.
 *     This increases the speed dramatically, but can only be done safely because there are no event handlers
 *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
 *     and do proper cleanup.
 */

// make sure required JavaScript modules are loaded
if (typeof jQuery === "undefined") {
  throw new Error("SlickGrid requires jquery module to be loaded");
}
if (!jQuery.fn.drag) {
  throw new Error("SlickGrid requires jquery.event.drag module to be loaded");
}
if (typeof Slick === "undefined") {
  throw new Error("slick.core.js not loaded");
}


(function (window, $) {
  "use strict";

  /// Helper function to aid Chrome/V8 optimizer: for...in loops prevent a function to become JIT compiled so we separate out this bit of code here:
  function __extend_support(dst, src) {
    for (var i in src) {
      dst[i] = src[i];
    }
  }

  /// Helper function: a quick & dirty faster version of $.extend() for our purposes...
  function __extend(dst, dotdotdot) {
    var a = arguments;
    var len = a.length;
    for (var i = 1; i < len; i++) {
      var src = arguments[i];
      if (!src) continue;
      __extend_support(dst, src);
    }
    return dst;
  }

  // shared across all grids on the page
  var scrollbarDimensions;
  var maxSupportedCssHeight;    // browser's breaking point
  var isBrowser;                // browser info to be used for those very special browser quirks & ditto hacks where feature detection doesn't cut it

  /* @const */ var MAX_INT = 2147483647;

  /* @const */ var NAVIGATE_PREV = 1;
  /* @const */ var NAVIGATE_NEXT = 2;
  /* @const */ var NAVIGATE_LEFT = 3;
  /* @const */ var NAVIGATE_RIGHT = 4;
  /* @const */ var NAVIGATE_UP = 5;
  /* @const */ var NAVIGATE_DOWN = 6;
  /* @const */ var NAVIGATE_HOME = 7;
  /* @const */ var NAVIGATE_END = 8;

  /* @const */ var HEADER_ROW_WIDTH_CORRECTION = 2000;

  // debug levels: bitfield

  /* @const */ var DEBUG_RENDER = 0x0001;
  /* @const */ var DEBUG_KEYBOARD = 0x0002;
  /* @const */ var DEBUG_CLICK = 0x0004;
  /* @const */ var DEBUG_MOUSE = 0x0008;
  /* @const */ var DEBUG_DRAG = 0x0010;
  /* @const */ var DEBUG_SCROLL = 0x0020;
  /* @const */ var DEBUG_EVENTS = 0x0040;
  /* @const */ var DEBUG_CONTAINER_EVENTS = 0x0080;
  /* @const */ var DEBUG_FOCUS = 0x0100;
  /* @const */ var DEBUG_MISC = 0x0200;

  //////////////////////////////////////////////////////////////////////////////////////////////
  // SlickGrid class implementation (available as Slick.Grid)

  /**
   * Creates a new instance of the grid.
   * 
   * @param {Node}              container   Container node to create the grid in.
   * @param {Array|Object}      data        An array of objects for databinding.
   * @param {Array}             columns     An array of column definitions.
   * @param {Object}            options     Grid options.
   *
   *
   *  data: Array of data items or an object which implements the data-access functions
   *    {Array} of data items, each item has the following:
   *      id:                 {String}    A unique ID for the item
   *      Other properties as indicated by the `field` entries of the columns array.
   *      For instance, if one of the columns specifies a field value of `name`,
   *      then each item of the data array should have a `name` property.
   *    {Object} implementing the data-access functions:
   *      getLength()         Returns the number of data items (analogous to data.length)
   *      getItem(i)          Returns the i-th data item (analogous to data[i])
   *      getItemMetadata(row, cell)
   *                          Returns the metadata for the given row index.
   *                          `cell` may be FALSE or an index number of the cell currently
   *                          receiving attention -- this is handy when the metadata is
   *                          generated on the fly and the grid is very large/complex,
   *                          i.e. it is costly to cache all row/column metadata.
   *    Slick.DataView is an example of an Object which provides this API. It is essentially
   *    a wrapper around an {Array} of data items which provides additional data manipulation
   *    features, such as filtering and sorting.
   *
   *  columns: Array of objects which specify details about the columns
   *      id:                 {String}    A unique ID for the column
   *      name:               {String}    The name of the column, displayed in column header cell
   *      field:              {String}    The name of the data item property to be displayed in this column
   *      width:              {Number}    The width of the column in pixels
   *      minWidth:           {Number}    The minimum width of the column in pixels
   *      maxWidth:           {Number}    The maximum width of the column in pixels
   *      minHeight:          {Number}    The minimum height of the grid in pixels
   *      maxHeight:          {Number}    The maximum height of the grid in pixels
   *      cssClass:           {String}    The name of the CSS class to use for cells in this column
   *      formatter:          {Function}  formatter(rowIndex, colIndex, cellValue, colInfo, rowDataItem, cellMetaInfo) for grid cells
   *      headerFormatter:    {Function}  formatter(rowIndex, colIndex, cellValue, colInfo, rowDataItem, cellMetaInfo) for header cells
   *      headerRowFormatter: {Function}  formatter(rowIndex, colIndex, cellValue, colInfo, rowDataItem, cellMetaInfo) for headerRow cells (option.showHeaderRow)
   *      editor:             {Function}  The constructor function for the class to use for editing of grid cells
   *      validator:          {Function}  A function to be called when validating user-entered values
   *      cannotTriggerInsert: {Boolean}  An edit attempt in this column cannot add a new row when the active row happens to be the extra 'add new' row 
   *      resizable:          {Boolean}   Whether this column can be resized
   *      selectable:         {Boolean}   Whether this column can be selected
   *      sortable:           {Boolean}   Whether the grid rows can be sorted by this column
   *      children:           {Array}     An optional array of columns which are the children of this parent.
   *
   *  options: Object with additional customization options
   *      explicitInitialization:
   *                          {Boolean}   Defers initialization until the client calls the
   *                                      grid.init() method explicitly. Supports situations in
   *                                      which SlickGrid containers may not be in the DOM at creation.
   *      rowHeight:          {Number}    Height of each row in pixels
   *      autoHeight:         {Boolean}   (?) Don't need vertical scroll bar
   *      defaultColumnWidth: {Number}    Default column width for columns that don't specify a width
   *      minColumnWidth:     {Number}    Default *minimum* column width for columns that don't specify a minimum width
   *      maxColumnWidth:     {Number}    Default *maximum* column width for columns that don't specify a maximum width
   *      enableColumnReorder: {Boolean}  Can columns be reordered?
   *      enableAddRow:       {Boolean}   Can rows be added?
   *      showTopPanel:       {Boolean}   Should the top panel be shown?
   *      topPanelHeight:     {Number}    Height of the top panel in pixels
   *      headerHeight:       {Number}    Height of each column header row in pixels (*not the "extra header row"*)
   *      showHeaderRow:      {Boolean}   Should the extra header row be shown?
   *      headerRowHeight:    {Number}    Height of the extra header row in pixels
   *      showFooterRow:      {Boolean}   Should the extra footer row be shown?
   *      footerRowHeight:    {Number}    Height of the extra footer row in pixels
   *      enableCellNavigation: {Boolean} Should arrow keys navigate between cells?
   *      enableTextSelectionOnCells:
   *                          {Boolean}   Should text selection be allowed in cells? (This is MSIE specific; other browsers always assume `true`)
   *      forceFitColumns:    {Boolean}   Should column widths be automatically resized to fit?
   *      resizeOnlyDraggedColumn
   *                          {Boolean}   Only resize the column being resized, instead of resizing any preceding columns as well when the user drags far left 
   *      dataItemColumnValueExtractor(item, columnDef, rowMetadata, columnMetadata):
   *                          {Function}  If present, will be called to retrieve a data value from the
   *                                      specified item for the corresponding column.
   *                                      Analogous to item[columnDef.field], where item is analogous to data[i].
   *      formatterFactory:   {Object}    If present, its getFormatter(columnInfo, row, cell, rowMetadata, columnMetadata) method will be called
   *                                      to retrieve a formatter for the specified cell
   *      selectedCellCssClass: {String}  CSS class for selected cells
   *      cellFlashingCssClass: {String}  CSS class for flashing cells
   *      enableAsyncPostRender: {Boolean}
   *      asyncPostRenderDelay: {Number}  Delay passed to setTimeout in milliseconds before 
   *                                      the PostRender queue is executed in slices of `asyncPostRenderSlice` 
   *                                      each with a gap of `asyncPostRenderDelay`. 
   *      asyncPostRenderSlice: {Number}  Time slice available for each round of async rendering. 
   *                                      Note that the probably-worst case is where the sync render process 
   *                                      takes about twice this amount of time -- that is assuming 
   *                                      each individual cell's async render action takes that amount 
   *                                      of time or *less*.
   *      editable:           {Boolean}   Is editing table cells supported?
   *      autoEdit:           {Boolean}   Should editing be initiated automatically on cell focus/click?
   *      autoEditAddRow:     {Boolean}   Should editing be initiated automatically on cell focus/click for the empty extra row at the bottom 
   *                                      (which is shown by turning the `enableAddRow` option on)?
   *      editorFactory:      {Object}    If present, its getEditor(columnInfo, row, cell, rowMetadata, columnMetadata) method will be called
   *                                      to retrieve an editor for the specified cell,
   *                                      unless column.editor is specified, which will be used.
   *      editorLock:         {Object}    a Slick.EditorLock instance; the default NULL will make SlickGrid use the Slick.GlobalEditorLock singleton
   *      asyncEditorLoading: {Boolean}   Should editors be loaded asynchronously?
   *      asyncEditorLoadDelay: {Number}  Delay passed to setTimeout in milliseconds
   *      editCommandHandler: {Function}  editCommandHandler(item, column, editCommand) is called from
   *                                      the commitCurrentEdit() function, where it can be used to
   *                                      implement undo/redo, for instance.
   *      fullWidthRows:      {Boolean}   If true, rows are sized to take up the available grid width.
   *      multiColumnSort:    {Boolean}   If true, rows can be sorted by multiple columns.
   *      defaultFormatter:   {Function}  Default function for converting cell values to strings.
   *      defaultEditor:      {Function}  Default function for editing cell values.
   *      defaultRowFormatter: {Function} Default function for formatting each grid row container.
   *      defaultHeaderFormatter: 
   *                          {Function}  The Slick.Formatters compatible cell formatter used to render the header cell.
   *      defaultHeaderRowFormatter: 
   *                          {Function}  The Slick.Formatters compatible cell formatter used to render the headerRow cell.
   *                                      The "headerRow" is the header row shown by SlickGrid when the `option.showHeaderRow` is enabled.
   *      scrollHoldoffX:     {Number | Function}
   *                                      Specify the number of columns away from the edge where keyboard navigation
   *                                      should scroll the view; when specified as a single number, than all four edges
   *                                      (top/bottom/left/right) will "hold off" this amount; otherwise you may specify 
   *                                      a function which should return the number of rows/cells to hold off, depending on
   *                                      the input arguments.
   *      scrollHoldoffY:     {Number | Function}
   *                                      Specify the number of rows away from the edge where keyboard navigation
   *                                      should scroll the view; when specified as a single number, than all four edges
   *                                      (top/bottom/left/right) will "hold off" this amount; otherwise you may specify 
   *                                      a function which should return the number of rows/cells to hold off, depending on
   *                                      the input arguments.
   *      smoothScrolling:    {Boolean}   When set, SlickGrid will scroll the view 1 line/cell at a time, rather than an entire page.
   *      forceSyncScrolling: {Boolean}   If true, renders more frequently during scrolling, rather than
   *                                      deferring rendering until default scroll thresholds are met (asyncRenderDelay).
   *      asyncRenderDelay:   {Number}    Delay passed to setTimeout in milliseconds before view update is actually rendered.
   *      asyncRenderSlice:   {Number}    Number of milliseconds allowed to the render action: when more time than this is spent, the async
   *                                      renderer will postpone the remainder of the render activity until the next time slice.
   *      asyncRenderInterleave: {Number} Number of milliseconds before the next render timeslice will start. 
   *                                      The 'duty cycle' (if you may call it that) of the SlickGrid renderer therefore is 
   *                                           asyncRenderSlice / (asyncRenderSlice + asyncRenderInterleave)
   *                                      or slightly higher -- as the renderer will continue until the `asyncRenderSlice` has actually 
   *                                      *expired*!
   *      pauseRendering:     {Boolean}   when set, SlickGrid will not update/render the grid until the `resumeRendering()` API has been invoked.
   *      addNewRowCssClass:  {String}    specifies CSS class for the extra bottom row: "add new row"
   * 
   * @class 
   * @memberof Slick
   * @constructor
   **/
  function SlickGrid(container, data, columnDefinitions, options) {
    // settings
    // 
    // @const @nocollapse
    var defaults = {
      debug: 0xffff & ~DEBUG_EVENTS & ~DEBUG_MOUSE /* & ~DEBUG_KEYBOARD & ~DEBUG_FOCUS */ & ~DEBUG_CONTAINER_EVENTS & ~DEBUG_RENDER,
      explicitInitialization: false,
      cellsMayHaveJQueryHandlers: false,     // TRUE when the grid is expected to contain one or more grid cells which will have (jQuery) event handlers and/or data attached. This then fixes the inherent memory leaks (issue mleibman/SlickGrid#855).
      rowHeight: 25,
      defaultColumnWidth: 80,
      minColumnWidth: 30,
      maxColumnWidth: Infinity,
      enableAddRow: false,
      leaveSpaceForNewRows: false,
      editable: false,
      autoEdit: true,
      autoEditAddRow: false, 
      enableCellNavigation: true,
      enableColumnReorder: true,
      asyncEditorLoading: false,
      asyncEditorLoadDelay: 100,
      forceFitColumns: false,
      resizeOnlyDraggedColumn: false,
      fitHeaderToContent: false,
      forceFitHeaderToContent: false,
      enableAsyncPostRender: false,
      asyncPostRenderDelay: 50,
      asyncPostRenderSlice: 50,
      enableAsyncPostRenderCleanup: false,                          // TODO: check this feature and re-implement it in my render environment...
      asyncPostRenderCleanupDelay: 40,
      autoHeight: false,
      // WARNING: Instances of SlickGrid should not share one global `EditorLock` by default.
      //
      // When f.e. SlickGrid is used as a part of an editor inside another SlickGrid,
      // sharing a global editor lock will close the editor unexpectedly.
      editorLock: new Slick.EditorLock(),                     
      headerHeight: 25,
      showHeaderRow: false,
      headerRowHeight: 25,
      showFooterRow: false,
      footerRowHeight: 25,
      showTopPanel: false,
      topPanelHeight: 25,
      formatterFactory: null,
      editorFactory: null,
      formatterOptions: {},
      editorOptions: {},
      cellFlashingCssClass: "flashing",
      selectedCellCssClass: "selected",
      multiSelect: true,
      enableTextSelectionOnCells: true,
      dataItemColumnValueExtractor: null,
      dataItemColumnValueSetter: null,
      fullWidthRows: false,
      multiColumnSort: false,
      defaultFormatter: defaultFormatter,
      defaultEditor: null,
      defaultRowFormatter: defaultRowFormatter,
      defaultHeaderFormatter: defaultHeaderFormatter,
      defaultHeaderRowFormatter: defaultHeaderRowFormatter,
      minBufferSize: 3,
      maxBufferSize: 50,
      scrollbarDimensions: null,    // provide a `{width:X, height:Y}` object to override the internal `measureScrollbar()` call; use this when you employ a custom scrollbar component.
      scrollHoldoffX: 2,
      scrollHoldoffY: 3,
      smoothScrolling: true,
      forceSyncScrolling: false,
      asyncRenderDelay: 45,         // this value is picked to 'catch' typematic key repeat rates as low as 12-per-second: 
                                    // keep your navigator keys depressed to see the delayed render + mandatory mini-cell-renders kicking in. 
      asyncRenderSlice: 20,
      asyncRenderInterleave: 2,
      maxRowsRenderedPerRenderSlice: MAX_INT,  // set to a low number, e.g. 1, to have the async renderer only render a single row per time slice
      pauseRendering: false,
      viewportChangedEventThreshold: 20,
      addNewRowCssClass: "new-row",
      editCommandHandler: null,
      clearCellBeforeEdit: true,        // @TODO -- supercede by editor attribute `.suppressClearOnEdit`
      createCssRulesCallback: null,
      skipPaging: false                 // Reveal one hidden row at a time instead of an entirely new page on keypress
    };

    // @const @nocollapse
    var columnDefaults = {
      name: "",
      resizable: true,
      sortable: false,
      width: defaults.defaultColumnWidth,
      minWidth: defaults.minColumnWidth,
      maxWidth: defaults.maxColumnWidth,
      rerenderOnResize: false,
      headerCssClass: null,
      defaultSortAsc: true,
      focusable: true,
      selectable: true,
      reorderable: true,
      dataItemColumnValueExtractor: null,
      headerColSpan: 1,
      headerRowSpan: 1,
      toolTip: null,
      headerRowToolTip: null,
      footerRowToolTip: null,

      // internals:
      headerRow: 0,
      headerRowLayerIndex: 0,
      children: null,
      childrenFirstIndex: 0,     // set to the first flattened column index covered by this column when this column is a parent (forming an inclusive range)
      childrenLastIndex: 0,      // set to the last flattened column index covered by this column when this column is a parent (forming an inclusive range)
    };

    // scroller
    var virtualTotalHeight;   // virtual height
    var scrollableHeight;     // real scrollable height
    var pageHeight;           // page height
    var numberOfPages;        // number of pages
    var jumpinessCoefficient; // "jumpiness" coefficient

    var page = 0;           // current page
    var pageOffset = 0;     // current page offset
    var vScrollDir = 1;

    // private
    var initialized = 0;    // 0/1/2: 2 = fully initialized
    var $container;
    /* @const */ var containerName = "slickgrid";
    var uid = containerName + "_" + Math.round(1000000 * Math.random());
    var self = this;
    var $focusSink, $focusSink2;
    var $headerScroller;
    var $headers;
    var $headerRow, $headerRowScroller;
    var $footerRow, $footerRowScroller;
    var $topPanelScroller;
    var $topPanel;
    var $viewport;
    var $canvas;
    var $style;
    var $boundAncestors;
    var stylesheet, columnCssRulesL, columnCssRulesR, columnCssRulesHL, columnCssRulesHR;
    var viewportH, viewportW;
    var canvasWidth, totalColumnsWidth;
    var viewportHasHScroll, viewportHasVScroll;

    // (Dev Note: we always work in CSS `box-sizing: box-model` -- or rather: any model which does **not**
    // require us to compensate for *borders*: those **MUST** be part of the (header/footer/regular) cells
    // at all times (so that userland code can apply arbitrary custom border styles where it wants
    // without causing a *lot* of trouble all around! The old 'HeightDiff' and 'WidthDiff' hacks were
    // just that -- *hacks* -- which *cannot* deliver when you start customizing your column borders
    // on a per-column basis.)

    var tabbingDirection = 1;
    var activePosY;
    var activePosX;
    var activeRow, activeCell;
    var activeCellNode = null;
    var currentEditor = null;
    var serializedEditorValue;
    var editController = null;

    // It turned out that focusin / focusout events fired by jQuery also occur when we call
    // $el.focus() on any element inside SlickGrid. To prevent very weird event sequences
    // from thus occurring we *block* these events from firing any SlickGrid event (onFocusIn/onFocusOut)
    // or any other SlickGrid-internal activity while we are fully in control of the situation
    // already while we are calling jQuery's $el.focus() on a cell of ours (movingFocusLock > 0)
    var movingFocusLock = 0;
    var movingFocusLockData = [];    

    // To prevent mouseenter/leave events from misfiring while a header/column drag is commencing
    // we introduce yet another lock:
    var headerDragCommencingLock = null;

    // Monitor focus; when it is in a cell (or a child thereof) and that cell is destroyed due to cache invalidation,
    // then switch focus over to the focusSink so that keyboard events do not get lost during the interim
    // while the cells are rerendered.
    var focusMustBeReacquired = false;   

    var cssRulesHashtable = {};
    var cssRulesCount = 0;

    var rowsCache = [];
    // var deletedRowsCache = [];
    var rowsCacheStartIndex = MAX_INT;
    // var deletedRowsCacheStartIndex = MAX_INT;
    var rowPositionCache = [];                      // it's faster to have a column store for the row height and position caches
    var rowHeightCache = [];                        // it's faster to have a column store for the row height and position caches
    var cellSpans = [];
    var cellSpansFillSlotSize = 50;   // this value is adaptive and represents the amount of cellSpans entries which can be filled in about a quarter of an async render timeslice.
    var renderedRows = 0;
    // var previousRenderWasIncomplete = false;
    var prevScrollTop = 0;
    var scrollTop = 0;
    var lastRenderedScrollTop = 0;
    var lastRenderedScrollLeft = 0;
    var prevScrollLeft = 0;
    var scrollLeft = 0;

    var selectionModel;
    var selectedRows = [];

    var plugins = [];
    
    // WARNING: vanilla SlickGrid uses a (row_index, column_ID) hash index, *we* use a (row_index, column_INDEX) hash index as that's consistent with the rest of the APIs and just a tad faster too!
    /* @dict */ var cellCssClasses = {};

    /* @dict */ var columnsById = {};
    var columns = null;
    var columnsDefTree = null;
    var sortColumns = [];
    var columnPosLeft = [];      // this cache array length is +1 longer than columns[] itself as we store the 'right edge + 1 pixel' as the 'left edge' of the first column beyond the grid width just as it would have been anyway. This simplifies the rest of the code.
    //var columnPosRight = [];

    // async call handles
    var h_retry_init = null;
    var h_editorLoader = null;
    var h_render = null;
    var h_postrender = null;
    var postprocess_perftimer = null;
    var render_perftimer = null;
    var postProcessedRows = [];
    var postProcessToRow = 0;
    var postProcessFromRow = MAX_INT;
    var h_postrenderCleanup = null;
    var postProcessedCleanupQueue = [];
    var postProcessgroupId = 0;

    // perf counters
    var counter_rows_rendered = 0;
    var counter_rows_removed = 0;

    var hasNestedColumns = false;
    var nestedColumns = null;   // 2D array: [depth][h_index] -> column reference

    // These two variables work around a bug with inertial scrolling in Webkit/Blink on Mac.
    // See http://crbug.com/312427.
    var rowNodeFromLastMouseWheelEvent;  // this node must not be deleted while inertial scrolling
    var zombieRowNodeFromLastMouseWheelEvent;  // node that was hidden instead of getting deleted
    var zombieRowCacheFromLastMouseWheelEvent;  // row cache for above node
    var zombieRowPostProcessedFromLastMouseWheelEvent;  // post processing references for above node

    // store css attributes if display:none is active in container or parent
    // 
    // @const @nocollapse
    var cssShow = { 
      position: 'absolute', 
      visibility: 'hidden', 
      display: 'block' 
    };
    var $hiddenParents;
    var oldProps = [];

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Constants: lookup tables

    /* @const */ var tabbingDirections = LU(
      NAVIGATE_UP, -1,
      NAVIGATE_DOWN, 1,
      NAVIGATE_LEFT, -1,
      NAVIGATE_RIGHT, 1,
      NAVIGATE_PREV, -1,
      NAVIGATE_NEXT, 1,
      NAVIGATE_HOME, -1,
      NAVIGATE_END, 1
    );
    /* @const */ var stepFunctions = LU(
      NAVIGATE_UP, gotoUp,
      NAVIGATE_DOWN, gotoDown,
      NAVIGATE_LEFT, gotoLeft,
      NAVIGATE_RIGHT, gotoRight,
      NAVIGATE_PREV, gotoPrev,
      NAVIGATE_NEXT, gotoNext,
      NAVIGATE_HOME, gotoHome,
      NAVIGATE_END, gotoEnd
    );

    // Internal use: generate a lookup table for a (key,value) set.
    function LU(/* ... */) {
      var lu = [];
      for (var a = arguments, i = 0, l = a.length; i < l; i += 2) {
        lu[a[i]] = a[i + 1];
      }
      return lu;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////
    // Initialization

    function init() {
      $container = $(container);
      if ($container.length < 1) {
        throw new Error("SlickGrid requires a valid container, " + container + " does not exist in the DOM.");
      }
      if (columns) {
        throw new Error("SlickGrid setColumns or updateColumnWidths have been called before the instance has been properly initialized.");
      }

      if (!columnDefinitions || !columnDefinitions.length) {
        columnDefinitions = [{}];
      }

      if (typeof get_browser_info === "undefined") {
        throw new Error("SlickGrid requires detect_browser.js to be loaded.");
      }
      if (!isBrowser) {
        isBrowser = get_browser_info();
        isBrowser.safari    = /safari/i.test(isBrowser.browser);
        isBrowser.safari605 = isBrowser.safari && /6\.0/.test(isBrowser.version);
        isBrowser.msie      = /msie/i.test(isBrowser.browser);
      }

      // jQuery prior to version 1.8 handles `.width()` setter/getter as a direct CSS write/read.
      // jQuery 1.8 changed `.width()` to read the true inner element width if `box-sizing` is set to `border-box` and introduced a setter for `.outerWidth()`.
      // So for equivalent functionality, prior to 1.8 use `.width()` and after use `.outerWidth()`.
      //
      // *We* expect jQuery 1.8+ and do *not support* older jQuery versions any more.
      var jQueryVersion = parseFloat($.fn.jquery);
      if (jQueryVersion < 1.8) {
        throw new Error("SlickGrid requires jQuery 1.8 or later.");
      }

      cacheCssForHiddenInit();

      // calculate these only once and share between grid instances
      maxSupportedCssHeight = maxSupportedCssHeight || getMaxSupportedCssHeight();
      scrollbarDimensions = scrollbarDimensions || options.scrollbarDimensions || measureScrollbar();

      options = __extend({}, defaults, options);
      validateAndEnforceOptions();

      parseColumns(columnDefinitions);
      assert(columns);
      updateColumnCaches();

      // validate loaded JavaScript modules against requested options
      if (options.enableColumnReorder && !$.fn.sortable) {
        throw new Error("SlickGrid's `enableColumnReorder = true` option requires jquery-ui.sortable module to be loaded");
      }

      editController = {
        commitCurrentEdit: commitCurrentEdit,
        cancelCurrentEdit: cancelCurrentEdit
      };

      $container
          .empty()
          .addClass(containerName + "-container ui-widget " + uid)
          .attr("role", "grid")
          .attr("tabIndex", 0)
          .attr("hideFocus", "true");

      if ($container.css("box-sizing") !== "border-box" && $container.css("-moz-box-sizing") !== "border-box" && $container.css("-webkit-box-sizing") !== "border-box") {
        console.error("SlickGrid requires the grid container and the grid itself to be rendered in CSS border-box box-sizing model.");
        //throw new Error("SlickGrid requires the grid container and the grid itself to be rendered in CSS border-box box-sizing model.");
      }

      // set up a positioning container if needed
      if (!/relative|absolute|fixed/.test($container.css("position"))) {
        $container.css("position", "relative");
      }

      $focusSink = $("<div tabIndex='0' hideFocus='true' style='position:absolute;width:0;height:0;top:0;left:0;outline:0;'></div>").appendTo($container);

      $headerScroller = $("<div class='slick-header ui-state-default' />").appendTo($container);

      $headers = $("<div class='slick-header-columns' role='header-row' />").appendTo($headerScroller);

      $headerRowScroller = $("<div class='slick-headerrow ui-state-default' />").appendTo($container);
      $headerRow = $("<div class='slick-headerrow-columns' />").appendTo($headerRowScroller);

      $topPanelScroller = $("<div class='slick-top-panel-scroller ui-state-default' />").appendTo($container);
      $topPanel = $("<div class='slick-top-panel' />").appendTo($topPanelScroller);

      if (!options.showTopPanel) {
        $topPanelScroller.hide();
      }

      if (!options.showHeaderRow) {
        $headerRowScroller.hide();
      }

      $viewport = $("<div class='slick-viewport' >").appendTo($container);
      //$viewport.css("overflow-y", (options.autoHeight && !clippedAutoSize) ? "auto" : "auto");

      $canvas = $("<div class='grid-canvas' />").appendTo($viewport);

      $footerRowScroller = $("<div class='slick-footerrow' />").appendTo($container);
      $footerRow = $("<div class='slick-footerrow-columns' />").appendTo($footerRowScroller);

      if (!options.showFooterRow) {
        $footerRowScroller.hide();
      }

      assert(!initialized);
      setViewportWidth();
      var rv = updateCanvasWidth();    // note that this call MUST NOT fire the onCanvasChanged event!

      $focusSink2 = $focusSink.clone().appendTo($container); // after the grid, in tab index order.

      if (!options.explicitInitialization) {
        rv &= finishInitializationUntilDone();
      }
      return rv;
    }

    // Stubbornly keep at it until the init is really completely done.
    function finishInitializationUntilDone() {
      clearTimeout(h_retry_init);
      h_retry_init = null;

      // Only execute the initialization when it hasn't run to completion yet:
      if (initialized < 3) {
        if (!finishInitialization()) {
          // When the initialization didn't complete entirely, we have to poll the browser to 
          // get to a state where we get the initialization done -- the culprit is almost always 
          // a delay in the stylesheet node becoming available.
          assert(initialized < 3); 
          assert(!stylesheet);
          h_retry_init = setTimeout(finishInitializationUntilDone, 100);
          return false;
        }
      }
      return true;
    }

    function finishInitialization() {
      if (initialized < 2) {
        initialized = 1;

        setViewportWidth();

        // For usability reasons, all text selection in SlickGrid is disabled
        // with the exception of `input` and `textarea` elements (selection must
        // be enabled there so that editors work as expected); note that
        // selection in grid cells (grid body) is already unavailable in
        // all browsers except IE
        disableSelection($headers); // disable all text selection in header (including `input` and `textarea`)

        if (!options.enableTextSelectionOnCells) {
          // disable text selection in grid cells except in `input` and `textarea` elements
          // (this is IE-specific, because selectstart event will only fire in IE)
          $viewport.bind("selectstart.ui", function (event) {
            return $(event.target).is("input,textarea");
          });
        }

        calcCanvasWidth();
        updateColumnCaches();
        createColumnHeaders();
        setupColumnSort();
        createCssRules();
        var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
        var numberOfRows = dataLengthIncludingAddNew;
        cacheRowPositions(numberOfRows);
        resizeCanvas();
        //updateAntiscroll();
        bindAncestorScrollEvents();

        $container
            // See also http://stackoverflow.com/questions/10086693/jquery-resize-on-div-element
            // 
            // We DO NOT want to use any sort of polling-based mechanism as that would 
            // COST US VERY DEARLY due to continuous (high!) DOM re-layout/re-rendering effort 
            // by the browser. Instead we use the 'iframe in the background' trick described
            // in an answer at the above link:
            .bind("resize." + containerName, function containerResizeHandler(e) {
              if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS)) { console.log("resize canvas event: ", this, arguments, document.activeElement); }
              resizeCanvas();
            })
            .bind("focus." + containerName, function containerFocusHandler(e) {
              var $target = $(e.target);
              var newFocusNode = document.activeElement;
              var focusMovingFrom = $.contains($container[0], e.target);
              var focusMovingInto = $.contains($container[0], newFocusNode);
              var focusMovingInside = focusMovingFrom && focusMovingInto;
              if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS | DEBUG_FOCUS)) { 
                console.log("container EVT FOCUS: ", [this, arguments, $target, newFocusNode], 
                            focusMovingFrom ? "FROM" : "-", focusMovingInto ? "INTO" : "-", 
                            focusMovingInside ? "INSIDE" : "-", movingFocusLock ? "@FOCUS" : "-real-");
              }
            })
            .bind("blur." + containerName, function containerBlurHandler(e) {
              var $target = $(e.target);
              var newFocusNode = document.activeElement;
              var focusMovingFrom = $.contains($container[0], e.target);
              var focusMovingInto = $.contains($container[0], newFocusNode);
              var focusMovingInside = focusMovingFrom && focusMovingInto;
              if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS | DEBUG_FOCUS)) { 
                console.log("container EVT BLUR: ", [this, arguments, $target, newFocusNode], 
                            focusMovingFrom ? "FROM" : "-", focusMovingInto ? "INTO" : "-", 
                            focusMovingInside ? "INSIDE" : "-", movingFocusLock ? "@FOCUS" : "-real-");
              }
            })
            .bind("focusin." + containerName, function containerFocusInHandler(e) {
              var fromNode = e.target;
              if (movingFocusLock) {
                // we MAY see a sequence of focusout+focusin, where in the latter we want to know who really was the previous focus
                fromNode = movingFocusLockData[movingFocusLock - 1].oldNode;
              }
              var $target = $(fromNode);
              var newFocusNode = document.activeElement;
              var focusMovingFrom = $.contains($container[0], fromNode);
              var focusMovingInto = $.contains($container[0], newFocusNode);
              var focusMovingInside = focusMovingFrom && focusMovingInto;
              if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS | DEBUG_FOCUS)) { 
                console.log("container GOT FOCUS: ", [this, arguments, e.target, fromNode, newFocusNode], 
                            focusMovingFrom ? "FROM" : "-", focusMovingInto ? "INTO" : "-", 
                            focusMovingInside ? "INSIDE" : "-", movingFocusLock ? "@FOCUS" : "-real-", movingFocusLockData);
              }

              var handled;
              var evt = new Slick.EventData(e);
              if (movingFocusLock) {
                trigger(self.onFocusMoved, {
                  from:     movingFocusLockData[movingFocusLock - 1].oldNodeInfo,
                  to:       getCellFromElement(newFocusNode),
                  fromNode: movingFocusLockData[movingFocusLock - 1].oldNode,
                  toNode:   newFocusNode,
                  grid:     self  
                }, evt);
                handled = evt.isHandled();
                if (handled) {
                  return;
                }
              } else {
                trigger(self.onFocusIn, null, evt);
                handled = evt.isHandled();
                if (handled) {
                  return;
                }

                // var lock = getEditorLock();
                // if (!lock.isActive(editController) && lock.commitCurrentEdit()) {
                //   lock.activate(editController);
                // }
                // // else: jump back to previously focused element... but we don't know what it is so this is all we can do now...
              }
            })
            .bind("focusout." + containerName, function containerFocusOutHandler(e) {
              var $target = $(e.target);
              var newFocusNode = document.activeElement;
              var focusMovingFrom = $.contains($container[0], e.target);
              var focusMovingInto = $.contains($container[0], newFocusNode);
              var focusMovingInside = focusMovingFrom && focusMovingInto;
              if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS | DEBUG_FOCUS)) { 
                console.log("container LOST FOCUS = autoCOMMIT: ", [this, arguments, e.target, newFocusNode], 
                            focusMovingFrom ? "FROM" : "-", focusMovingInto ? "INTO" : "-", 
                            focusMovingInside ? "INSIDE" : "-", movingFocusLock ? "@FOCUS" : "-real-", {
                              event: e,
                              newNode: newFocusNode,
                              oldNode: e.target,
                              oldNodeInfo: getCellFromElement(e.target)
                            });
              }

              if (movingFocusLock) {
                // we MAY see a sequence of focusout+focusin, where by the time focusin fires, document.activeElement is BODY.
                // movingFocusLockData[movingFocusLock - 1] = {
                //   event: e,
                //   newNode: newFocusNode,
                //   oldNode: e.target,
                //   oldNodeInfo: getCellFromElement(e.target)
                // };
                return;
              }
              var evt = new Slick.EventData(e);
              trigger(self.onFocusOut, null, evt);
              var handled = evt.isHandled();
              if (handled) {
                return;
              }

              // var lock = getEditorLock();
              // if (lock.isActive(editController) && !lock.commitCurrentEdit()) {
              //   // commit failed, jump back to edited field so user can edit it and make sure it passes the next time through
              //   assert(currentEditor);
              //   currentEditor.focus();
              //   assert(document.activeElement !== document.body);
              // }
            })
            .fixClick(handleContainerClickEvent, handleContainerDblClickEvent)
            .bind("contextmenu." + containerName, handleContainerContextMenu)
            .bind("keydown." + containerName, handleContainerKeyDown)
            .bind("keypress." + containerName, handleContainerKeyPress)
            .bind("keyup." + containerName, handleContainerKeyUp);
        $viewport
            .bind("scroll", handleScrollEvent);
        $headerScroller
            .bind("contextmenu", handleHeaderContextMenu)
            .fixClick(handleHeaderClick, handleHeaderDblClick)
            .delegate(".slick-header-column", "mouseenter", handleHeaderMouseEnter)
            .delegate(".slick-header-column", "mouseleave", handleHeaderMouseLeave)
            .bind("draginit", handleHeaderDragInit)
            .bind("dragstart", {distance: 3}, handleHeaderDragStart)
            .bind("drag", handleHeaderDrag)
            .bind("dragend", handleHeaderDragEnd);
        $headerRowScroller
            .bind("scroll", handleHeaderRowScroll);
        $footerRowScroller
            .bind("scroll", handleFooterRowScroll);
        $focusSink.add($focusSink2)
            .bind("keydown", handleKeyDown)
            .bind("keypress", handleKeyPress)
            .bind("keyup", handleKeyUp);
        $canvas
            .bind("keydown", handleKeyDown)
            .bind("keypress", handleKeyPress)
            .bind("keyup", handleKeyUp)
            .fixClick(handleClick, handleDblClick)
            .bind("contextmenu", handleContextMenu)
            .bind("draginit", handleDragInit)
            .bind("dragstart", {distance: 3}, handleDragStart)
            .bind("drag", handleDrag)
            .bind("dragend", handleDragEnd)
            .delegate(".slick-cell", "mouseenter", handleMouseEnter)
            .delegate(".slick-cell", "mouseleave", handleMouseLeave);

        // Work around http://crbug.com/312427.
        if (navigator.userAgent.toLowerCase().match(/webkit/) &&
            navigator.userAgent.toLowerCase().match(/macintosh/)) {
          $canvas.bind("mousewheel", handleMouseWheel);
        }

        initialized = 2;
      } else if (!stylesheet && initialized > 1) {
        // when a previous `init` run did not yet use the run-time stylesheet data, 
        // we have to adjust the canvas while waiting for the browser to actually 
        // parse that style.
        resizeCanvas();
      }

      // Only fire the onAfterInit event when we really have done it all:
      if (stylesheet && initialized === 2) {
        initialized = 3;
        restoreCssFromHiddenInit();
        trigger(self.onAfterInit);
      }

      // report the user whether we are a complete success (truthy) or not (falsey):
      return !!stylesheet;
    }

    function isInitialized() {
      return initialized;
    }

    function cacheCssForHiddenInit() {
      // handle display:none on container or container parents
      $hiddenParents = $container.parents().addBack().not(':visible');
      $hiddenParents.each(function cacheCssForHiddenParents() {
        var old = {};
        for (var name in cssShow) {
          old[name] = this.style[name];
          this.style[name] = cssShow[name];
        }
        oldProps.push(old);
      });
    }

    function restoreCssFromHiddenInit() {
      // finish handle display:none on container or container parents
      // - put values back the way they were
      $hiddenParents.each(function restoreCssForHiddenParents(i) {
        var old = oldProps[i];
        for (var name in cssShow) {
          this.style[name] = old[name];
        }
      });
    }

    /**
     * Register a SlickGrid plugin.
     *
     * @param  {SlickGridPlugIn} plugin The plugin instance you want to register.
     */
    function registerPlugin(plugin) {
      assert(plugin && typeof plugin.init === "function");
      plugins.unshift(plugin);
      plugin.init(self);
    }

    /**
     * Unregister a SlickGrid plugin when it has been previously registered.
     *
     * @param  {SlickGridPlugIn} plugin The plugin instance you want to unregister.
     *
     * Note: the `plugin` parameter may be NULL in which case **all** registered
     * plugins are unregistered!
     */
    function unregisterPlugin(plugin) {
      // Defensive coding / Re-entrant code support:
      // 
      // Account for the obscure issue where unregistering one plugin can cause its
      // `destroy` method to unregister *another* plugin: hence re-evaluate the
      // `plugins.length` on every round!        
      //
      // This makes our `unregisterPlugin()` API re-entrant (like it should be), just
      // like its counterpart `registerPlugin()`.
      // 
      // Otherwise unregister these plugins in the *reverse order* in which they have
      // been registered.
      for (var i = 0; i < plugins.length; i++) {
        if (!plugin || plugins[i] === plugin) {
          if (plugins[i].destroy) {
            plugins[i].destroy();
          }
          plugins.splice(i, 1);
          if (plugin) {
            break;
          }
        }
      }
    }

    function setSelectionModel(model) {
      if (selectionModel) {
        selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged);
        if (selectionModel.destroy) {
          selectionModel.destroy();
        }
      }

      selectionModel = model;
      if (selectionModel) {
        selectionModel.init(self);
        selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged);
      }
    }

    function getSelectionModel() {
      return selectionModel;
    }

    function getCanvasNode() {
      return $canvas[0];
    }

    function measureScrollbar() {
      var $c = $("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body");
      var dim = {
        width: $c.outerWidth() - $c[0].clientWidth,
        height: $c.outerHeight() - $c[0].clientHeight
      };
      $c.remove();
      return dim;
    }

    // Return the pixel positions of the left edge of the column, relative to the left edge of the entire grid.
    function getColumnOffset(cell) {
      var l = columns.length;
      // Is the cache ready? If not, update it.
      if (columnPosLeft.length <= l) {
        updateColumnCaches();
        assert(columnPosLeft.length === l + 1);
      }
      assert(cell >= 0);
      assert(cell < columnPosLeft.length);
      return columnPosLeft[cell];
    }

    function calcCanvasWidth() {
      var availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;

      totalColumnsWidth = getColumnOffset(columns.length);
      canvasWidth = (options.fullWidthRows ? Math.max(totalColumnsWidth, availableWidth) : totalColumnsWidth);

      // see https://github.com/mleibman/SlickGrid/issues/477
      viewportHasHScroll = (canvasWidth >= viewportW - scrollbarDimensions.width);
    }

    var oldViewportW, oldCanvasWidth, oldTotalColumnsWidth;

    function updateCanvasWidth() {
      calcCanvasWidth();

      var cached = false;
      if (canvasWidth !== oldCanvasWidth) {
        $canvas.outerWidth(canvasWidth);
        cached = true;
      }
      if (oldTotalColumnsWidth !== totalColumnsWidth) {
        $topPanel.outerWidth(totalColumnsWidth + HEADER_ROW_WIDTH_CORRECTION);
        $headerRow.outerWidth(totalColumnsWidth + HEADER_ROW_WIDTH_CORRECTION);
        $footerRow.outerWidth(totalColumnsWidth + HEADER_ROW_WIDTH_CORRECTION);
        $headers.outerWidth(totalColumnsWidth + HEADER_ROW_WIDTH_CORRECTION);
        cached = true;
      }
      if (oldViewportW !== viewportW) {
        $topPanelScroller.outerWidth(viewportW);
        $headerRowScroller.outerWidth(viewportW);
        $footerRowScroller.outerWidth(viewportW);
        $headerScroller.outerWidth(viewportW);
        cached = true;
      }

      // When `stylesheet` has not been set yet, it means that any previous call to 
      // applyColumnWidths() did not use up to date values yet as the run-time generated 
      // stylesheet wasn't parsed in time.
      if (canvasWidth !== oldCanvasWidth || !stylesheet || !initialized) {
        if (!applyColumnWidths()) {
          return false;
        }
      }

      // Only fire the event when there's actual change *and* we're past the initialization phase.
      if (cached && initialized) {
        trigger(self.onCanvasWidthChanged, { 
          width: canvasWidth,
          oldWidth: oldCanvasWidth || 0,

          oldTotalColumnsWidth: oldTotalColumnsWidth || 0,
          totalColumnsWidth: totalColumnsWidth,

          oldViewportW: oldViewportW || 0,
          viewportW: viewportW,

          grid: self
        });
      }

      // only update the 'previous/old' markers when we can be sure that the new values are actually sound:
      if (stylesheet && initialized) {
        oldViewportW = viewportW;
        oldCanvasWidth = canvasWidth;
        oldTotalColumnsWidth = totalColumnsWidth;

        // and (re)render the affected columns
        render();

        return true;
      }
      return false;
    }

    function disableSelection($target) {
      if ($target && $target.jquery) {
        $target
            .attr("unselectable", "on")
            .css("MozUserSelect", "none")
            .bind("selectstart.ui", function () {
              return false;
            }); // from jquery:ui.core.js 1.7.2
      }
    }

    function getMaxSupportedCssHeight() {
      var supportedHeight = 1000000;
      // FF reports the height back but still renders blank after ~6M px
      var testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? 6000000 : 1000000000;
      var div = $("<div style='display:none' />").appendTo(document.body);

      while (true) {
        var test = supportedHeight * 2;
        div.css("height", test);
        if (test > testUpTo || div.outerHeight() !== test) {
          break;
        } else {
          supportedHeight = test;
        }
      }

      div.remove();
      return supportedHeight;
    }

    // TODO:  this is static.  need to handle page mutation.
    function bindAncestorScrollEvents() {
      var elem = $canvas[0];
      while ((elem = elem.parentNode) !== document.body && elem != null) {
        // bind to scroll containers only
        if (elem == $viewport[0] || elem.scrollWidth !== elem.clientWidth || elem.scrollHeight !== elem.clientHeight) {
          var $elem = $(elem);
          if (!$boundAncestors) {
            $boundAncestors = $elem;
          } else {
            $boundAncestors = $boundAncestors.add($elem);
          }
          $elem.bind("scroll." + uid, handleActiveCellPositionChange);
        }
      }
    }

    function unbindAncestorScrollEvents() {
      if (!$boundAncestors) {
        return;
      }
      $boundAncestors.unbind("scroll." + uid);
      $boundAncestors = null;
    }

    // title and/or toolTip may be NULL: then the existing value(s) as present in the column
    // definition will be used instead.
    function updateColumnHeader(columnId, title, toolTip) {
      if (!initialized) { return false; }
      var idx = getColumnIndex(columnId);
      if (idx == null) {
        return false;
      }

      var columnDef = columns[idx];
      var headerNode = getHeadersColumn(columnDef.id);
      if (headerNode) {
        if (title !== undefined) {
          columnDef.name = title;
        }
        if (toolTip !== undefined) {
          columnDef.toolTip = toolTip;
        }

        var e = new Slick.EventData();
        trigger(self.onBeforeHeaderCellDestroy, {
          node: headerNode,
          column: columnDef,
          cell: idx,
          grid: self
        }, e);
        if (e.isHandled()) {
          return false;
        }

        // The userland event handler(s) may have patched this column's name and/or tooltip, so
        // fetch it now instead of before.
        title = columnDef.name;
        toolTip = columnDef.toolTip || null;

        var $header = $(headerNode);

        // TODO: RISK: when formatter produces more than *ONE* HTML element, we're toast with nuking the .eq(0) element down here:
        $header
            .attr("title", toolTip)
            .attr("data-title", toolTip)
            .children().eq(0).html(title || "");

        trigger(self.onHeaderCellRendered, {
          node: headerNode,
          column: columnDef,
          cell: idx,
          grid: self
        });
        return true;
      }
      return false;
    }

    function getHeaderRow() {
      return $headerRow[0];
    }

    function getFooterRow() {
      return $footerRow[0];
    }

    function getHeaderRowColumn(columnId) {
      var idx = getColumnIndex(columnId);
      var columnDef = columns[idx];
      assert(columnDef);
      assert(columnDef.headerRow === (hasNestedColumns ? nestedColumns.length - columnDef.headerRowSpan : 0));
      var elId = mkSaneId(columnDef, idx, "headerrow" + columnDef.headerRow);
      var $header = $headerRow.find("#" + elId); // Do not write this as `$("#" + elId)` because the headers may not yet be included in the page DOM! 
      assert(($headerRow.length && $header.length) ? $.contains($headerRow[0], $header[0]) : true);
      return $header && $header[0];
    }

    function getHeadersColumn(columnId) {
      var idx = getColumnIndex(columnId);
      var columnDef = columns[idx];
      assert(columnDef);
      assert(columnDef.headerRow === (hasNestedColumns ? nestedColumns.length - columnDef.headerRowSpan : 0));
      var elId = mkSaneId(columnDef, idx, "header" + columnDef.headerRow);
      var $header = $headers.find("#" + elId); // Do not write this as `$("#" + elId)` because the headers may not yet be included in the page DOM! 
      assert($header.length ? $.contains($headers[0], $header[0]) : true);
      return $header && $header[0];
    }

    function getFooterRowColumn(columnId) {
      var idx = getColumnIndex(columnId);
      var columnDef = columns[idx];
      assert(columnDef);
      assert(columnDef.headerRow === (hasNestedColumns ? nestedColumns.length - columnDef.headerRowSpan : 0));
      var elId = mkSaneId(columnDef, idx, "footer" + columnDef.headerRow);
      var $footer = $footerRow.find("#" + elId); // Do not write this as `$("#" + elId)` because the headers may not yet be included in the page DOM! 
      assert($footer.length ? $.contains($footerRow[0], $footer[0]) : true);
      return $footer && $footer[0];
    }

    function getHeaderColumnFromElement(el) {
      var $header = $(el).closest(".slick-header-column", ".slick-header-columns");
      if ($header.length) {
        assert($header.length === 1);
        var column = $header.data("column");
        if (column) {
          return {
            columnDef: column,
            $header: $header
          };
        }
      }
      return null;
    }

    function mkSaneId(columnDef, cell, row) {
      var s = "" + uid + "_c" + cell + "_r" + row + "_" + columnDef.id;
      s = s.replace(/[^a-zA-Z0-9]+/g, "_");
      //assert($("[aria-describedby=" + s + "]").length === 0);
      return s;
    }

    function extractCellFromDOMid(id) {
      // format of ID is: uid_c<cell>_<blah>
      var m = /_c(\d+)_/.exec(id);
      if (!m) {
        return false;
      }
      return +m[1];
    }

    // This completely redraws the headers and re-binds events
    // 
    // TODO: Visyond uses virtual rendering for the grid itself, but is very slow in rendering (and updating) the headers
    //       as those are rendered in their entirety. We should apply the virtual rendering process to the SlickGrid headers
    //       too (i.e. only render a visible+buffer portion of the headers) but this has a significant impact on the event
    //       handlers too: those would all then have to move to the headers container DIV!
    //       (Think about the impact on contentmenu and similar plugins which add event handlers to the headers' DOM!)
    function createColumnHeaders() {
      function onMouseEnter() {
        $(this).addClass("ui-state-hover");
      }

      function onMouseLeave() {
        $(this).removeClass("ui-state-hover");
      }

      $headers.find(".slick-header-column")
        .each(function h_before_headercell_destroy_f() {
          var columnDef = $(this).data("column");
          assert(columnDef);
          if (columnDef) {
            trigger(self.onBeforeHeaderCellDestroy, {
              node: this,
              column: columnDef,
              grid: self
            });
          }
        });
      $headers.empty();

      // Get the data for each column in the DOM
      $headerRow.find(".slick-headerrow-column")
        .each(function h_before_headerrowcell_destroy_f() {
          var columnDef = $(this).data("column");
          if (columnDef) {
            trigger(self.onBeforeHeaderRowCellDestroy, {
              node: this,
              column: columnDef,
              grid: self
            });
          }
        });
      $headerRow.empty();

      $footerRow.find(".slick-footerrow-column")
        .each(function h_before_footerrowcell_destroy_f() {
          var columnDef = $(this).data("column");
          if (columnDef) {
            trigger(self.onBeforeFooterRowCellDestroy, {
              node: this,
              column: columnDef,
              grid: self
            });
          }
        });
      $footerRow.empty();
              
      // @TO-TEST              
      if (0) {
        // speed improvement? detach the $headers DOM element from the view while we work on it in here:
        $headers = $headers.detach();
      }
      
      function createColumnHeader(columnDef, appendTo, cell) {
        var isLeaf = !columnDef.children;
        var cellCss = [
          "ui-state-default", 
          "slick-header-column", 
          (!isLeaf ? "slick-header-is-parent" : "slick-header-is-leaf"),
          "hl" + cell, 
          "hr" + (cell + columnDef.headerColSpan - 1), 
          "hrt" + columnDef.headerRow, 
          "hrb" + (columnDef.headerRow + columnDef.headerRowSpan - 1)
        ];
        if (columnDef.headerCssClass) {
          cellCss.push(columnDef.headerCssClass);
        }
        var info = {
          cellCss: cellCss,
          cellStyles: [],
          html: "",
          attributes: {},
          toolTip: columnDef.toolTip || null,
          colspan: columnDef.headerColSpan,
          rowspan: columnDef.headerRowSpan,
          //cellHeight: cellHeight,
          //rowMetadata: rowMetadata,
          //columnMetadata: columnMetadata,
          columnHeader: {
            columnDef: columnDef,
            cell: cell
          }
        };
        // I/F: function formatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo)
        info.html = getHeaderFormatter(-2000 + columnDef.headerRow, cell)(-2000 + columnDef.headerRow, cell, columnDef.name, columnDef, null /* rowDataItem */, info);
        var metaData = getAllCustomMetadata(null, null, info) || {};
        patchupCellAttributes(metaData, info, "columnheader");
        metaData.id = mkSaneId(columnDef, cell, "header" + columnDef.headerRow);
        var stringArray = [
          "<div"
        ];
        // I/F: function appendMetadataAttributes(stringArray, row, cell, data, columnDef, rowDataItem, cellMetaInfo)
        appendMetadataAttributes(stringArray, -2000 + columnDef.headerRow, cell, metaData, columnDef, null, info);
  
        stringArray.push(">");

        stringArray.push(info.html);

        stringArray.push("</div>");

        var header = $(stringArray.join(""))
            .data("column", columnDef)
            .appendTo(appendTo);
        return header;
      }

      function createBaseColumnHeader(columnDef, $appendTo, cell) {
        assert(columnDef.children == null);
        var $header = createColumnHeader(columnDef, $appendTo, cell);
        var i, j, len, llen, column;
        var cellCss, info;
        var headerRowCell;
        var footerRowCell;
        var stringArray, metaData;

        if (options.enableColumnReorder || columnDef.sortable) {
          $header
            .on("mouseenter", onMouseEnter)
            .on("mouseleave", onMouseLeave);
        }

        if (columnDef.sortable) {
          $header.addClass("slick-header-sortable");
          $header.prepend("<span class='slick-sort-indicator' />");
        }
        
        if (options.enableColumnReorder && columnDef.reorderable) {
          $header.addClass("slick-header-reorderable");
        }

        trigger(self.onHeaderCellRendered, {
          node: $header[0],
          column: columnDef,
          cell: cell,
          grid: self
        });

        if (options.showHeaderRow) {
          cellCss = [
            "ui-state-default", 
            "slick-headerrow-column", 
            "hl" + cell, 
            "hr" + (cell + columnDef.headerColSpan - 1)
          ];
          if (columnDef.headerCssClass) cellCss.push(columnDef.headerCssClass);
          info = {
            cellCss: cellCss,
            cellStyles: [],
            html: "",
            attributes: {},
            toolTip: columnDef.headerRowToolTip || null,
            colspan: columnDef.headerColSpan,
            rowspan: 1,
            //cellHeight: cellHeight,
            //rowMetadata: rowMetadata,
            //columnMetadata: columnMetadata,
            columnHeader: {
              columnDef: columnDef,
              cell: cell
            }
          };
          info.html = getHeaderRowFormatter(-1000 + columnDef.headerRow, cell)(-1000 + columnDef.headerRow, cell, columnDef.initialHeaderRowValue, columnDef, null /* rowDataItem */, info);
          stringArray = [];
          stringArray.push("<div");

          metaData = getAllCustomMetadata(null, null, info) || {};
          patchupCellAttributes(metaData, info, "columnbaseheader");
          metaData.id = mkSaneId(columnDef, cell, "headerrow" + columnDef.headerRow);
          appendMetadataAttributes(stringArray, -1000 + columnDef.headerRow, cell, metaData, columnDef, null, info);

          stringArray.push(">");

          stringArray.push(info.html);

          stringArray.push("</div>");

          headerRowCell = $(stringArray.join(""))
            .data("column", columnDef)
            .appendTo($headerRow);

          trigger(self.onHeaderRowCellRendered, {
            node: headerRowCell[0],
            column: columnDef,
            cell: cell,
            grid: self
          });
        }
        if (options.showFooterRow) {
          cellCss = [
            "ui-state-default", 
            "slick-footerrow-column", 
            "hl" + cell, 
            "hr" + (cell + columnDef.headerColSpan - 1)
          ];
          if (columnDef.footerCssClass) {
            cellCss.push(columnDef.footerCssClass);
          }
          info = {
            cellCss: cellCss,
            cellStyles: [],
            html: "",
            attributes: {},
            toolTip: columnDef.footerRowToolTip || null,
            colspan: columnDef.headerColSpan,
            rowspan: 1,
            //cellHeight: cellHeight,
            //rowMetadata: rowMetadata,
            //columnMetadata: columnMetadata,
            columnHeader: {
              column: columnDef,
              cell: cell
            }
          };
          info.html = getHeaderRowFormatter(-3000 + columnDef.headerRow, cell)(-3000 + columnDef.headerRow, cell, columnDef.initialFooterRowValue, columnDef, null /* rowDataItem */, info);
          stringArray = [];
          stringArray.push("<div");

          metaData = getAllCustomMetadata(null, null, info) || {};
          patchupCellAttributes(metaData, info, "columnfooter");
          metaData.id = mkSaneId(columnDef, cell, "footer" + columnDef.headerRow);
          appendMetadataAttributes(stringArray, -3000 + columnDef.headerRow, cell, metaData, columnDef, null, info);

          stringArray.push(">");

          stringArray.push(info.html);

          stringArray.push("</div>");

          footerRowCell = $(stringArray.join(""))
              .data("column", columnDef)
              .appendTo($footerRow);

          trigger(self.onFooterRowCellRendered, {
            node: footerRowCell[0],
            column: columnDef,
            cell: cell,
            grid: self
          });
        }
      }

      var i, j, len, column, cell, layer;

      if (hasNestedColumns) {
        for (i = 0, len = nestedColumns.length; i < len; i++) {
          layer = nestedColumns[i];

          for (j = 0, llen = layer.length; j < llen; j++) {
            column = layer[j];
            if (column.children) {
              cell = column.childrenFirstIndex;
              assert(cell != null);
              assert(i === column.headerRow);
              createColumnHeader(column, $headers, cell);
            } else {
              cell = getColumnIndex(column.id);
              assert(cell != null);
              createBaseColumnHeader(column, $headers, cell);
            }
          }
        }

        $headers.addClass("slick-nested-headers");
      } else {
        for (i = 0, len = columns.length; i < len; i++) {
          column = columns[i];
          createBaseColumnHeader(column, $headers, i);
        }
      }

      // @TO-BE-INSPECTED
      
      // fit the header column sizes to its content if corresponding
      // options are specified
      if (options.fitHeaderToContent) {
         for (j = 0; j < columns.length; j++) {
            // get the total width of header
            var headerWidth = headerElements[j].outerWidth();
            columns[j].width = Math.max(columns[j].width, headerWidth);
            if (options.forceFitHeaderToContent) {
              columns[j].minWidth = headerWidth;
            }
         }
      }

      // /@TO-BE-INSPECTED

      // @TO-TEST              
      if (0) {
        // re-attach DOM node to viewport
        $headers = $headers.appendTo($headerScroller);
      }
      
      setSortColumns(sortColumns);
      setupColumnResize();
      if (options.enableColumnReorder) {
        setupColumnReorder();
      }

      // @TO-BE-INSPECTED
      
if (0) {
      // recalculate width of header
      $headers.width(getHeadersWidth());
      // apply column header widths because the widths
      // of the columns have changed eventually
      applyColumnHeaderWidths();
}

      // /@TO-BE-INSPECTED
    }

    function setupColumnSort() {
      $headerScroller.delegate(".slick-header-column", "click", function columnSortClickHandler(e) {
        if (options.debug & (DEBUG_EVENTS | DEBUG_CLICK)) { console.log("column-sort click event: ", this, arguments, document.activeElement); }
        if ($(e.target).hasClass("slick-resizable-handle")) {
          return;
        }

        var headerInfo = getHeaderColumnFromElement(e.target);
        if (!headerInfo) {
          return;
        }
        var column = headerInfo.columnDef;
        assert(column);
        if (column.sortable) {
          if (!getEditorLock().commitCurrentEdit()) {
            return;
          }

          var sortOpts = null;
          var i, len;
          for (i = 0, len = sortColumns.length; i < len; i++) {
            if (sortColumns[i].columnId === column.id) {
              sortOpts = sortColumns[i];
              sortOpts.sortAsc = !sortOpts.sortAsc;
              break;
            }
          }

          if ((e.metaKey || e.ctrlKey) && options.multiColumnSort) {
            if (sortOpts) {
              sortColumns.splice(i, 1);
            }
          } else {
            if ((!e.shiftKey && !e.metaKey && !e.ctrlKey) || !options.multiColumnSort) {
              sortColumns = [];
            }

            if (!sortOpts) {
              sortOpts = { 
                columnId: column.id, 
                sortAsc: column.defaultSortAsc 
              };
              sortColumns.push(sortOpts);
            } else if (sortColumns.length === 0) {
              sortColumns.push(sortOpts);
            }
          }

          setSortColumns(sortColumns);

          if (!options.multiColumnSort) {
            trigger(self.onSort, {
              multiColumnSort: false,
              sortCol: column,
              columnId: column.id,
              sortAsc: sortOpts.sortAsc,
              grid: self
            }, e);
          } else {
            trigger(self.onSort, {
              multiColumnSort: true,
              sortCols: $.map(sortColumns, function sortColumnMapper(col) {
                return {
                  sortCol: columns[getColumnIndex(col.columnId)],
                  columnId: col.columnId,
                  sortAsc: col.sortAsc
                };
              }),
              grid: self
            }, e);
          }
        }
      });
    }

    function setupColumnReorder() {
      if (!jQuery.isEmptyObject($.data($headers, $headers.sortable.prototype.widgetFullName))) {
        $headers.filter(":ui-sortable").sortable("destroy");
      }

      var columnScrollTimer = null;
      var viewportLeft = $viewport.offset().left;

      function scrollColumnsRight() {
        $viewport[0].scrollLeft = $viewport[0].scrollLeft + 10;
      }

      function scrollColumnsLeft() {
        $viewport[0].scrollLeft = $viewport[0].scrollLeft - 10;
      }

      $headers.sortable({
        containment: "parent",
        distance: 3,
        axis: "x",
        cursor: "default",
        tolerance: "intersection",
        helper: "clone",
        delay: 300,
        placeholder: "slick-sortable-placeholder ui-state-default slick-header-column",
        items: ".slick-header-reorderable",
        start: function headersSortStartHandler(e, ui) {
          ui.placeholder.outerWidth(ui.helper.outerWidth());
          trigger(self.onColumnsStartReorder, {
            ui: ui,
            grid: self
          }, e);

          $(ui.helper).addClass("slick-header-column-active");
        },
        beforeStop: function headersSortBeforeStopHandler(e, ui) {
          $(ui.helper).removeClass("slick-header-column-active");
        },
        sort: function headersSortSortHandler(e, ui) {
          trigger(self.onColumnsReordering, {
            ui: ui,
            grid: self
          }, e);

          if (e.originalEvent.pageX > $viewport[0].clientWidth) {
            if (!columnScrollTimer) {
              columnScrollTimer = setInterval(scrollColumnsRight, 100);
            }
          } else if (e.originalEvent.pageX < viewportLeft) {
            if (!columnScrollTimer) {
              columnScrollTimer = setInterval(scrollColumnsLeft, 100);
            }
          } else {
            clearInterval(columnScrollTimer);
            columnScrollTimer = null;
          }
        },
        stop: function headersSortStopHandler(e, ui) {
          clearInterval(columnScrollTimer);
          columnScrollTimer = null;

          if (!getEditorLock().commitCurrentEdit()) {
            $(this).sortable("cancel");
            return;
          }
          $headers.sortable("option", "items", ".slick-header-is-leaf");      // Reset items to grab all columns
          var reorderedIds = $headers.sortable("toArray");                    // Get sorted order
          $headers.sortable("option", "items", ".slick-header-reorderable");  // Revert items
          var reorderedColumns = [];
          assert(reorderedIds.length === columns.length);   // assert we don't loose or grow our columns set
          for (var i = 0, len = reorderedIds.length; i < len; i++) {
            var cell = extractCellFromDOMid(reorderedIds[i]);
            assert(columns[cell]);
            reorderedColumns.push(columns[cell]);
          }
          var rv = setColumns(reorderedColumns);
          assert(rv === true);

          trigger(self.onColumnsReordered, {
            ui: ui,
            grid: self
          }, e);
          e.stopPropagation();
          setupColumnResize();
        }
      });
    }

    function setupColumnResize() {
      var i, columnDef, j, c, pageX, minPageX, maxPageX, firstResizable, lastResizable;
      var columnCount = columns.length;

      for (i = 0; i < columnCount; i++) {
        columnDef = columns[i];
        if (columnDef.resizable) {
          if (firstResizable === undefined) {
            firstResizable = i;
          }
          lastResizable = i;
        }
      }
      if (firstResizable === undefined) {
        return;
      }

      function onColumnResizeDragInit(e, dd, activeColumnIndex) {
        var j, c;
        if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("column-resize drag init event: ", activeColumnIndex, this, arguments, document.activeElement); }
        if (!getEditorLock().commitCurrentEdit()) {
          return false;
        }
        //e.preventDefault();
        //e.stopPropagation();
      }

      function onColumnResizeDragStart(e, dd, activeColumnIndex) {
        var j, c;
        if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("column-resize drag start event: ", activeColumnIndex, this, arguments, document.activeElement); }
        if (!getEditorLock().commitCurrentEdit()) {
          return false;
        }
        var columnCount = columns.length;
        pageX = e.pageX;
        $(this).parent().addClass("slick-header-column-active");

        // Get the dragged column object and set a flag on it
        assert(activeColumnIndex >= 0);
        columns[activeColumnIndex].manuallySized = true;
        
        var shrinkLeewayOnRight = null, stretchLeewayOnRight = null;
        // calculate & cache all invariants to speed up the process:
        for (var i = 0, len = columnCount; i < len; i++) {
          c = columns[i];
          c.__columnResizeInfo = {
            // lock each column's width option to current width
            previousWidth: c.width, // previousWidth should NOT be measured from the UI as this will b0rk the system depending on boxmodel. // $(e).outerWidth();
            absMinWidth: c.minWidth
          };
        }

        if (options.forceFitColumns) {
          shrinkLeewayOnRight = 0;
          stretchLeewayOnRight = 0;
          // columns on right affect maxPageX/minPageX
          for (j = activeColumnIndex + 1; j < columnCount; j++) {
            c = columns[j];
            assert(c);
            assert(c.__columnResizeInfo);
            if (c.resizable) {
              if (stretchLeewayOnRight !== null) {
                if (c.maxWidth) {
                  stretchLeewayOnRight += c.maxWidth - c.__columnResizeInfo.previousWidth;
                } else {
                  stretchLeewayOnRight = null;
                }
              }
              shrinkLeewayOnRight += c.__columnResizeInfo.previousWidth - c.__columnResizeInfo.absMinWidth;
            }
          }
        }
        var shrinkLeewayOnLeft = 0, stretchLeewayOnLeft = 0;
        for (j = 0; j <= activeColumnIndex; j++) {
          // columns on left only affect minPageX
          c = columns[j];
          assert(c);
          assert(c.__columnResizeInfo);
          if (c.resizable) {
            if (stretchLeewayOnLeft !== null) {
              if (c.maxWidth) {
                stretchLeewayOnLeft += c.maxWidth - c.__columnResizeInfo.previousWidth;
              } else {
                stretchLeewayOnLeft = null;
              }
            }
            shrinkLeewayOnLeft += c.__columnResizeInfo.previousWidth - c.__columnResizeInfo.absMinWidth;
          }
        }
        if (shrinkLeewayOnRight === null) {
          shrinkLeewayOnRight = 100000;
        }
        if (shrinkLeewayOnLeft === null) {
          shrinkLeewayOnLeft = 100000;
        }
        if (stretchLeewayOnRight === null) {
          stretchLeewayOnRight = 100000;
        }
        if (stretchLeewayOnLeft === null) {
          stretchLeewayOnLeft = 100000;
        }
        maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft);
        minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
        trigger(self.onColumnsStartResize, null, e); // onColumnsResizeStart
        updateColumnCaches();
        //applyColumnWidths(); -- happens already inside the next statement: updateCanvasWidth(true)
        var rv = updateCanvasWidth();
        assert(rv === true);
        //e.preventDefault();
        //e.stopPropagation();
      }

      function onColumnResizeDrag(e, dd, activeColumnIndex) {
        var actualMinWidth, 
            d = Math.min(maxPageX, Math.max(minPageX, e.pageX)) - pageX, 
            x;
        if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("column-resize drag move event: ", activeColumnIndex, d, this, arguments, document.activeElement); }
        assert(typeof d === "number"); 
        assert(!isNaN(d)); 
        var j, c;
        var columnCount = columns.length;
        if (d < 0) { // shrink column
          x = d;
          if (options.resizeOnlyDraggedColumn) {
            c = columns[activeColumnIndex];
            assert(c.__columnResizeInfo);
            c.width = Math.max(c.previousWidth + x, c.__columnResizeInfo.absMinWidth); // apply shrinkage to this column only.
          } else {
            for (j = activeColumnIndex; j >= 0; j--) {
              c = columns[j];
              assert(c);
              assert(c.__columnResizeInfo);
              if (c.resizable) {
                actualMinWidth = c.__columnResizeInfo.absMinWidth;
                if (x && c.__columnResizeInfo.previousWidth + x < actualMinWidth) {
                  x += c.__columnResizeInfo.previousWidth - actualMinWidth;
                  c.width = actualMinWidth;
                } else {
                  c.width = c.__columnResizeInfo.previousWidth + x;
                  x = 0;
                }
              }
            }
          }

          if (options.forceFitColumns) {
            x = -d;
            for (j = activeColumnIndex + 1; j < columnCount; j++) {
              c = columns[j];
              assert(c);
              assert(c.__columnResizeInfo);
              if (c.resizable) {
                if (x && c.maxWidth && (c.maxWidth - c.__columnResizeInfo.previousWidth < x)) {
                  x -= c.maxWidth - c.__columnResizeInfo.previousWidth;
                  c.width = c.maxWidth;
                } else {
                  c.width = c.__columnResizeInfo.previousWidth + x;
                  x = 0;
                }
              }
            }
          } else if (options.syncColumnCellResize) {
            setCanvasWidth(originalCanvasWidth + d);
          }
        } else { // stretch column
          x = d;
          if (options.resizeOnlyDraggedColumn) {
            c = columns[activeColumnIndex];
            assert(c.__columnResizeInfo);
            c.width = c.previousWidth + x;
            if (x && c.maxWidth && c.maxWidth < c.width) {
              c.width = c.maxWidth;
            }
          } else {
            for (j = activeColumnIndex; j >= 0; j--) {
              c = columns[j];
              assert(c);
              assert(c.__columnResizeInfo);
              if (c.resizable) {
                if (x && c.maxWidth && (c.maxWidth - c.__columnResizeInfo.previousWidth < x)) {
                  x -= c.maxWidth - c.__columnResizeInfo.previousWidth;
                  c.width = c.maxWidth;
                } else {
                  c.width = c.__columnResizeInfo.previousWidth + x;
                  x = 0;
                }
              }
            }
          }

          if (options.forceFitColumns) {
            x = -d;
            for (j = activeColumnIndex + 1; j < columnCount; j++) {
              c = columns[j];
              assert(c);
              assert(c.__columnResizeInfo);
              if (c.resizable) {
                actualMinWidth = c.__columnResizeInfo.absMinWidth;
                if (x && c.__columnResizeInfo.previousWidth + x < actualMinWidth) {
                  x += c.__columnResizeInfo.previousWidth - actualMinWidth;
                  c.width = actualMinWidth;
                } else {
                  c.width = c.__columnResizeInfo.previousWidth + x;
                  x = 0;
                }
              }
            }
          } else if (options.syncColumnCellResize) {
            setCanvasWidth(originalCanvasWidth + d);
          }
        }

        updateColumnCaches();
        //applyColumnWidths(); -- happens already inside the next statement: updateCanvasWidth(true)
        var rv = updateCanvasWidth();
        assert(rv === true);
        trigger(self.onColumnsResizing, null, e);
        //e.preventDefault();
        //e.stopPropagation();
      }
      
      function onColumnResizeDragEnd(e, dd, activeColumnIndex) {
        var newWidth, j, c;
        if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("column-resize drag end event: ", activeColumnIndex, this, arguments, document.activeElement); }
        var columnCount = columns.length;
        var adjustedColumns = [];
        $(this).parent().removeClass("slick-header-column-active");
        assert(columns.length === columnCount);
        for (j = 0; j < columnCount; j++) {
          c = columns[j];
          assert(c);
          assert(c.__columnResizeInfo);
          newWidth = c.width; // again, we should NEVER get the cell width from the UI as that will screw us seven ways to Hell thanks to the CSS boxmodels and the browser repaint costs that come with measuring the DOM // $(columnElements[j]).outerWidth();

          if (c.__columnResizeInfo.previousWidth !== newWidth) {
            adjustedColumns.push(c);
            if (c.rerenderOnResize) {
              invalidateColumn(j);
            }
          }
        }
        var rv = updateCanvasWidth();
        assert(rv === true);
        if (handleScroll()) {
          render();
        }
        trigger(self.onColumnsResized, { 
          adjustedColumns: adjustedColumns, 
          dd: dd,
          success: rv,
          grid: self 
        }, e);
        e.preventDefault();
        e.stopPropagation();
      }
      
      function onColumnResizeDblClick(e, dd, activeColumnIndex) {
        if (options.debug & (DEBUG_EVENTS | DEBUG_CLICK)) { console.log("column-resize double-click event: ", activeColumnIndex, this, arguments, document.activeElement); }
        if (signalEventObserved(e)) {
          return;
        }

        var headerInfo = getHeaderColumnFromElement(e.target);
        if (!headerInfo) {
          return;
        }

        var column = headerInfo.columnDef;
        assert(column);
        assert(column.id || column.id === 0);
        var cell = getColumnIndex(column.id);
        assert(cell != null);
        assert(cell >= 0);
        assert(+cell === cell);
        var columnDef = columns[cell];
        assert(columnDef === column);
        var columnElement = getHeadersColumn(columnDef.id);
        assert(columnElement === headerInfo.$header[0]);
        
        var sizeEvt = new Slick.EventData(e);
        trigger(self.onColumnCalcWidth, {
          cell: cell, 
          column: columnDef,
          grid: self
        }, sizeEvt);
        var handled = sizeEvt.isHandled();
        if (!handled) {
          var aux_width = calculateWordDimensions(columnElement.innerText).width;
          assert(columnDef.values === undefined);
          for (var row = 0, len = getDataLength(); row < len; row++) {
            var rowDataItem = getDataItem(row);
            var value = getDataItemValueForColumn(rowDataItem, columnDef);
            aux_width = Math.max(aux_width, calculateWordDimensions("" + value).width);
          }
          columnDef.width = aux_width;

          // TODO: make autosize faster by introducing a bit of heuristic: longer raw string implies wider cell
          // TODO: apply the proper formatter so that we actually get what we will see when the cell is rendered for real
        }

        updateColumnCaches();
        var rv = updateCanvasWidth();
        assert(rv === true);
        //render();
        trigger(self.onColumnsResized, {
          adjustedColumns: [columnDef],
          cell: cell, 
          column: columnDef,
          success: rv,
          grid: self 
        }, e);
        e.preventDefault();
        e.stopPropagation();
      }

      for (i = 0; i < columnCount; i++) {
        columnDef = columns[i];
        if (columnDef.resizable) {
          var el = getHeadersColumn(columnDef.id);
          assert(el);
          $("<div class='slick-resizable-handle' data-column-index='" + i + "' />")
            .appendTo(el)
            // all touch support here added by KCPT.
            // increase touchable area on touch devices
            // see http://modernizr.github.com/Modernizr/touch.html for discussion of
            // this test as a means to determine that we're running on a touch platform.
            // We also increase the width of the resize area for the last column so that
            // it isn't entirely overlapped/hidden by the divider view.
            .css({ 
              width: "ontouchstart" in window ? 16 : (i === lastResizable ? 8 : 4) 
            });
        }
      }

      $headerScroller
      // .bind("contextmenu", handleHeaderContextMenu)
      // .fixClick(handleHeaderClick, handleHeaderDblClick)
      // .delegate(".slick-header-column", "mouseenter", handleHeaderMouseEnter)
      // .delegate(".slick-header-column", "mouseleave", handleHeaderMouseLeave)
      // .bind("draginit", handleHeaderDragInit)
      // .bind("dragstart", {distance: 3}, handleHeaderDragStart)
      // .bind("drag", handleHeaderDrag)
      // .bind("dragend", handleHeaderDragEnd)
      .delegate(".slick-resizable-handle", "draginit", function headerScrollerDragInitHandler(e, dd) {
        var columnIdx = $(this).attr("data-column-index");
        columnIdx = parseInt(columnIdx);
        onColumnResizeDragInit(e, dd, columnIdx);
      })
      .delegate(".slick-resizable-handle", "dragstart touchstart", {distance: 3}, function headerScrollerDragStartHandler(e, dd) {
        var columnIdx = $(this).attr("data-column-index");
        columnIdx = parseInt(columnIdx);
        onColumnResizeDragStart(e, dd, columnIdx);
      })
      .delegate(".slick-resizable-handle", "drag touchmove", function headerScrollerDragMoveHandler(e, dd) {
        var columnIdx = $(this).attr("data-column-index");
        columnIdx = parseInt(columnIdx);
        onColumnResizeDrag(e, dd, columnIdx);
      })
      .delegate(".slick-resizable-handle", "dragend touchend", function headerScrollerDragEndHandler(e, dd) {
        var columnIdx = $(this).attr("data-column-index");
        columnIdx = parseInt(columnIdx);
        onColumnResizeDragEnd(e, dd, columnIdx);
      })
      .delegate(".slick-resizable-handle", "dblclick", function headerScrollerDoubleClickHandler(e, dd) {
        var columnIdx = $(this).attr("data-column-index");
        columnIdx = parseInt(columnIdx);
        onColumnResizeDblClick(e, dd, columnIdx);
      });
    }

    function calculateWordDimensions(text, escape) {
      if (escape === undefined) {
        escape = true;
      }

      var div = document.createElement("div");
      $(div).css({
          "position": "absolute",
          "visibility": "hidden",
          "height": "auto",
          "width": "auto",
          "white-space": "nowrap",
          "font-family": "Verdana, Arial, sans-serif",
          "font-size": "13px",
          "border": "1px solid transparent",
          "padding": "1px 4px 2px"
      });
      if (escape) {
        $(div).text(text);
      } else {
        div.innerHTML = text;
      }

      document.body.appendChild(div);

      var dimensions = {
        width: jQuery(div).outerWidth() + 30,
        height: jQuery(div).outerHeight()
      };

      div.parentNode.removeChild(div);

      return dimensions;
    }

    // Given an element, return the sum of vertical paddings and borders on that element.
    function getVBoxDelta($el) {
      var h = $el.height();         // jQuery: content only
      var oh = $el.outerHeight();   // jQuery: content + padding + border, excluding margin
      var delta = oh - h;
      assert(delta >= 0);
      return delta;
    }

    function getHBoxDelta($el, metricsRef) {
      var h = $el.width();         // jQuery: content only
      var oh = $el.outerWidth();   // jQuery: content + padding + border, excluding margin
      var delta = oh - h;
      assert(delta >= 0);
      return delta;
    }

    // These rules are responsible for heights and cell widths, but not column header widths.
    //
    // See also github issue #223: stylesheet variable is undefined in Chrome
    //
    // This code is based on
    //     http://davidwalsh.name/add-rules-stylesheets
    function createCssRules() {
      var sheet;
      if (!stylesheet) {
        stylesheet = getStyleSheet();
      }
      if (!stylesheet) {
        $style = $("<style type='text/css' rel='stylesheet' id='" + containerName + "_stylesheet_" + uid + "' />").appendTo($("head"));
        if ($style[0].styleSheet) { // IE
          $style[0].styleSheet.cssText = "";
        } else {
          // WebKit hack
          $style[0].appendChild(document.createTextNode(""));
        }

        // Add a media (and/or media query) here if you'd like!
        // $style[0].setAttribute("media", "screen")
        // $style[0].setAttribute("media", "@media only screen and (max-width : 1024px)")

        sheet = $style[0].sheet;
      } else {
        sheet = stylesheet;
      }

      var rowHeight = options.rowHeight;
      var headersCount = (hasNestedColumns ? nestedColumns.length : 1);
      var headerHeight = headersCount * options.headerHeight;
      var rules = [
        [".slick-top-panel", "height: " + options.topPanelHeight + "px"],
        [".slick-header-columns", "height: " + headerHeight + "px"],
        [".slick-headerrow-columns", "height: " + options.headerRowHeight + "px"],
        [".slick-footerrow-columns", "height: " + options.footerRowHeight + "px"],
        [".slick-cell", "height:" + rowHeight + "px"],
        [".slick-row", "height:" + options.rowHeight + "px"]
      ];

      for (var i = 0, len = columns.length; i < len; i++) {
        rules.push([".l" + i, ""]);
        rules.push([".r" + i, ""]);
        rules.push([".hl" + i, ""]);
        rules.push([".hr" + i, ""]);
      }

      for (i = 0, len = (hasNestedColumns ? nestedColumns.length : 1); i < len; i++) {
        rules.push([".hrt" + i, "top: " + (i * options.headerHeight) + "px"]);
        rules.push([".hrb" + i, "bottom: " + ((headersCount - i - 1) * options.headerHeight) + "px"]);
      }

      if (options.createCssRulesCallback) {
        options.createCssRulesCallback(uid, rules);
      }

      // see also
      //   http://davidwalsh.name/add-rules-stylesheets
      if (sheet) {
        rules.forEach(function ruleAddCssRule_f(d, i) {
          addCSSRule(sheet, d[0], d[1], i); /* i could have been -1 here as each rule can be appended at the end */
        });
      } else {
        throw new Error("run-time generated SlickGrid rules could not be set up");
      }
    }

    function addCSSRule(sheet, selector, rules, index) {
      var entry = {
        css: rules,
        index: index
      };
      cssRulesHashtable[selector] = entry;
      if (cssRulesCount <= index) {
        cssRulesCount = index + 1;
      }
      if (sheet.insertRule) {
        sheet.insertRule("." + containerName + "-container." + uid + " " + selector + " {" + rules + "}", index);
      } else {
        sheet.addRule("." + containerName + "-container." + uid + " " + selector, rules, index);
      }
      assert(sheet.ownerNode);
    }

    // Recalculate the maximum CSS rule index (PLUS ONE) currently in use.
    // This is used as part of a CSS rule DELETE action as a CSS rule DELETE may delete a custom
    // CSS rule at the end of the CSS stylesheet, which means the next CSS rule to INSERT ends
    // up at a lower index as the number of CSS rules has shrunk.
    function recalcCssRulesCount() {
      var count = 0;
      for (var idx in cssRulesHashtable) {
        var entry = cssRulesHashtable[idx];
        if (entry && count <= entry.index) {
          count = entry.index + 1;
        }
      }
    }

    // API: update or insert a SlickGrid-instance specific CSS rule.
    // 
    // The `selector` is automatically prefixed by the appropriate SlickGrid instance UID to make the
    // CSS rule specific to this SlickGrid instance.
    // 
    // When `rule` is FALSE or NULL, the rule will be DELETED.
    // 
    // When `rule` is UNDEFINED, this function will serve as a getter, i.e. it will not change
    // the CSS and only return the previously set rule value, if available.
    // 
    // Returns:
    // - FALSE when the SlickGrid instance stylesheet is not present (yet), i.e. when the
    //   CSS rule could not be applied to the DOM. 
    // - FALSE when the specified rule is *requested* (i.e. when `rule` is NULL or FALSE)
    //   but is not present yet: here FALSE signals the rule does not yet exist.
    // - Otherwise return the previously set CSS rule content and rule index as an object:
    //   `{ css:string, index:n }`.
    // 
    // Hence FALSE signals error/non-existence, any other value signals success.
    function setCssRule(selector, rule) {
      // Check if the stylesheet is instantiated & present yet:
      var sheet;
      if (!stylesheet) {
        stylesheet = getStyleSheet();
      }
      if (!stylesheet) {
        return false;
      } else {
        sheet = stylesheet;
      }
      assert(sheet.ownerNode);

      // check if this is a rule UPDATE or ADD/INSERT:
      var entry = cssRulesHashtable[selector];      
      if (entry) {
        // update. IFF `rule` is not UNDEFINED. (NULL rule will delete the rule!)
        if (rule !== undefined) {
          // The sequence now becomes: UPDATE = DELETE + INSERT (at the same index as before).
          sheet.deleteRule(entry.index);
          cssRulesHashtable[selector] = undefined;
          recalcCssRulesCount();
        }
      }
      // ADD/INSERT/UPDATE rule? yes, IFF rule !== NULL/UNDEFINED/FALSE:
      if (rule || rule === "") {
        var index = (entry ? entry.index : cssRulesCount);
        addCSSRule(sheet, selector, rule, index);
      }
      return cssRulesHashtable[selector] || false;
    }

    function getStyleSheetOwner(sheet) {
      return sheet && (sheet.ownerNode || sheet.owningElement);
    }

    // Fix for Google Chrome
    function getStyleSheet() {
      for (var i = 0, len = document.styleSheets.length; i < len; i++) {
        var sheet = document.styleSheets[i];
        var ownerNode = getStyleSheetOwner(sheet);
        if (ownerNode && ownerNode.id === containerName + "_stylesheet_" + uid) {
          return sheet;
        }
      }
      var $sheet = $("style#" + containerName + "_stylesheet_" + uid);
      if ($sheet.length) {
        assert(0, "should never get here: it's pretty darn bad when jQuery finds what we ourselves cannot");
        return $sheet[0].sheet;
      }
      return null;
    }

    // Return FALSE when the relevant stylesheet has not been parsed yet
    // (previously SlickGrid would throw an exception for this!)
    // otherwise return the style reference.
    function getColumnCssRules(idx) {
      var i, len;
      if (!stylesheet) {
        stylesheet = getStyleSheet();
        if (!stylesheet) {
          console.log("########### Cannot find stylesheet. <STYLE ID>:", containerName + "_stylesheet_" + uid);
          return false;
          //throw new Error("Cannot find stylesheet. <STYLE ID>:" + containerName + "_stylesheet_" + uid);
        }

        // find and cache column CSS rules
        columnCssRulesL = [];
        columnCssRulesR = [];
        columnCssRulesHL = [];
        columnCssRulesHR = [];
        var cssRules = (stylesheet.cssRules || stylesheet.rules);
        var matches, columnIdx;
        for (i = 0, len = cssRules.length; i < len; i++) {
          var selector = cssRules[i].selectorText;
          if ((matches = /\.l\d+/.exec(selector))) {
            columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
            columnCssRulesL[columnIdx] = cssRules[i];
          } else if ((matches = /\.r\d+/.exec(selector))) {
            columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
            columnCssRulesR[columnIdx] = cssRules[i];
          } else if ((matches = /\.hl\d+/.exec(selector))) {
            columnIdx = parseInt(matches[0].substr(3, matches[0].length - 3), 10);
            columnCssRulesHL[columnIdx] = cssRules[i];
          } else if ((matches = /\.hr\d+/.exec(selector))) {
            columnIdx = parseInt(matches[0].substr(3, matches[0].length - 3), 10);
            columnCssRulesHR[columnIdx] = cssRules[i];
          }
        }
      }

      return {
        left: columnCssRulesL[idx],
        right: columnCssRulesR[idx],
        headerLeft: columnCssRulesHL[idx],
        headerRight: columnCssRulesHR[idx],
      };
    }

    function removeCssRules() {
      $style.remove();
      $style = null;
      stylesheet = null;
      assert($("style#" + containerName + "_stylesheet_" + uid).length === 0);
    }

    function destroy() {
      getEditorLock().cancelCurrentEdit();

      trigger(self.onBeforeDestroy);

      // abort any delayed actions in timers:
      if (h_postrender) {
        clearTimeout(h_postrender);
        h_postrender = null;
      }
      if (h_render) {
        clearTimeout(h_render);
        h_render = null;
      }
      if (h_editorLoader) {
        clearTimeout(h_editorLoader);
        h_editorLoader = null;
      }

      var i = plugins.length;
      while (i--) {
        unregisterPlugin(plugins[i]);
      }

      if (options.enableColumnReorder) {
        $headers.filter(":ui-sortable").sortable("destroy");
      }

      unbindAncestorScrollEvents();
      $container.unbind("." + containerName);
      removeCssRules();

      $canvas.unbind();

      $container
          .empty()
          .removeClass(containerName + "-container ui-widget " + uid)
          .attr("role", null);

      $headerScroller.unbind();
      $headers.unbind();
      $viewport.unbind();
      $headerRowScroller.unbind();
      $footerRowScroller.unbind();
      $focusSink.unbind();
      $focusSink2.unbind();
      $container.empty();
      $headerScroller = undefined;
      $headers = undefined;
      $headerRowScroller = undefined;
      $headerRow = undefined;
      $headerRowSpacer = undefined;
      $footerRowScroller = undefined;
      $footerRow = undefined;
      $footerRowSpacer = undefined;
      $canvas = undefined;
      $viewport = undefined;
      $topPanel = undefined;
      $topPanelScroller = undefined;
      $boundAncestors = undefined;
      $focusSink = undefined;
      $focusSink2 = undefined;
      $container = undefined;
      $style = undefined;

      columnDefinitions = undefined;
      options = undefined;
      editController = undefined;
      postProcessedRows = undefined;
      cellCssClasses = undefined;
      rowsCache = undefined;
      // deletedRowsCache = undefined;
      rowPositionCache = undefined;
      rowHeightCache = undefined;
      cellSpans = undefined;
      selectedRows = undefined;
      plugins = undefined;
      columnsById = undefined;
      stylesheet = undefined;

      initialized = 0;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////
    // General

    // A simple way to expose the uid to consumers, who might care which SlickGrid instance they're dealing with.
    function getId() {
      return uid;
    }

    function trigger(evt, args, e) {
      // WARNING: keep in mind that we MAY pass either a Slick.EventData instance or a DOM event instance in `e`! 
      // Both types are accepted and depend on which event is triggered...
      e = e || new Slick.EventData();
      args = args || {};
      args.grid = self;
      return evt.notify(args, e, self);
    }

    function getEditorLock() {
      return options.editorLock;
    }

    /**
     * @return {EditController} return the SlickGrid internal EditController. The EditController is an object
     *         which provides two functions (methods) who are invoked by the EditorLock object when necessary:
     *             commitCurrentEdit: function () {...}
     *             cancelCurrentEdit: function () {...}
     */
    function getEditController() {
      return editController;
    }

    function getColumnIndex(id) {
      return columnsById[id];
    }

    // Given an x and a y coord, return the index of the column
    function getColumnIndexFromEvent(evt) {
      var nearestEl = document.elementFromPoint(evt.clientX, evt.clientY);
      var headerEl = $(nearestEl).closest('.cell');
      if (!headerEl.length) {
        return null;
      }
      return getCellFromNode(headerEl[0]);
    }

    function getColumnFromEvent(evt) {
      return columns[getColumnIndexFromEvent(evt)];
    }

    function autosizeColumns() {
      var i, c, len, width,
          widths = [],
          shrinkLeeway = 0,
          total = 0,
          prevTotal,
          availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;

      for (i = 0, len = columns.length; i < len; i++) {
        c = columns[i];
        widths.push(c.width);
        total += c.width;
        if (c.resizable) {
          shrinkLeeway += c.width - c.minWidth;
        }
      }

      // shrink
      prevTotal = total;
      while (total > availableWidth && shrinkLeeway) {
        var shrinkProportion = (total - availableWidth) / shrinkLeeway;
        for (i = 0, len = columns.length; i < len && total > availableWidth; i++) {
          c = columns[i];
          width = widths[i];
          if (!c.resizable || width <= c.minWidth) {
            continue;
          }
          var absMinWidth = c.minWidth;
          var shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
          shrinkSize = Math.min(shrinkSize, width - absMinWidth);
          total -= shrinkSize;
          shrinkLeeway -= shrinkSize;
          widths[i] -= shrinkSize;
        }
        if (prevTotal <= total) {  // avoid infinite loop
          break;
        }
        prevTotal = total;
      }

      // grow
      prevTotal = total;
      while (total < availableWidth) {
        var growProportion = availableWidth / total;
        for (i = 0, len = columns.length; i < len && total < availableWidth; i++) {
          c = columns[i];
          var currentWidth = widths[i];
          var growSize;

          if (!c.resizable || (c.maxWidth && c.maxWidth <= currentWidth)) {
            growSize = 0;
          } else {
            growSize = Math.min(Math.floor(growProportion * currentWidth) - currentWidth, (c.maxWidth ? c.maxWidth - currentWidth : 0) || 1000000) || 1;
          }
          total += growSize;
          widths[i] += (total <= availableWidth ? growSize : 0);
        }
        if (prevTotal >= total) {  // avoid infinite loop
          break;
        }
        prevTotal = total;
      }

      for (i = 0, len = columns.length; i < len; i++) {
        if (columns[i].rerenderOnResize && columns[i].width !== widths[i]) {
          invalidateColumn(i);
        }
        columns[i].width = widths[i];
      }

      updateColumnCaches();
      //applyColumnWidths(); -- happens already inside the next statement: updateCanvasWidth(true)
      var rv = updateCanvasWidth();
      assert(rv === true);
      //render();
    }

    /**
     * This function tweaks the generated `.l<N>` and `.r<N>` CSS rules, setting their
     * `left` and `right` CSS styles to calculated pixel positions.
     *
     * Also note that this assumes the addressed DOM nodes (cells in columns) have
     *     position: absolute;
     */
    function applyColumnWidths() {
      var x = 0, w, rule;
      assert(canvasWidth != null);
      assert(totalColumnsWidth != null);
      var gridWidth = canvasWidth;
      var headerWidth = totalColumnsWidth + HEADER_ROW_WIDTH_CORRECTION;
      var headerScrollCompensation = scrollbarDimensions.width;
      for (var i = 0, len = columns.length; i < len; i++) {
        w = columns[i].width;

        rule = getColumnCssRules(i);
        if (!rule) {
          // When the styles for one column aren't loaded yet, then you can bet the bank 
          // the others are neither: abort operation!
          return false;             
        }

        rule.left.style.left = x + "px";
        rule.headerLeft.style.left = x + "px";
        x += w;
        rule.right.style.right = (gridWidth - x) + "px";
        rule.headerRight.style.right = (headerWidth - x) + "px";
      }
      return true;
    }

    function setSortColumn(columnId, ascending) {
      assert(columnId != null);
      assert(getColumnIndex(columnId) != null);
      assert(columns[getColumnIndex(columnId)] != null);

      setSortColumns([{
        sortCol: columns[getColumnIndex(columnId)],
        columnId: columnId,
        sortAsc: ascending
      }]);
    }

    // `cols` is an array of object `{ columnId:..., sortAsc:..., sortCol:columnDef }`
    // where the `.sortCol` field is optional.
    function setSortColumns(cols) {
      sortColumns = cols;

      var headerColumnEls = $headers.children();
      headerColumnEls
        .removeClass("slick-header-column-sorted")
        .find(".slick-sort-indicator")
        .removeClass("slick-sort-indicator-asc slick-sort-indicator-desc");

      var sortCol;
      for (var i = 0, len = sortColumns.length; i < len; i++) {
        sortCol = sortColumns[i];
        if (sortCol.sortAsc == null) {
          sortCol.sortAsc = true;
        }
        assert(sortCol.columnId != null);
        assert(getColumnIndex(sortCol.columnId) != null);
        assert(columns[getColumnIndex(sortCol.columnId)] != null);
        if (sortCol.sortCol == null) {
          assert(columns[getColumnIndex(sortCol.columnId)]);
          sortCol.sortCol = columns[getColumnIndex(sortCol.columnId)];
        }
        assert(columns[getColumnIndex(sortCol.columnId)] === sortCol.sortCol);
        var el = getHeadersColumn(sortCol.columnId);
        if (el) {
          $(el)
            .addClass("slick-header-column-sorted")
            .find(".slick-sort-indicator")
            .addClass(sortCol.sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc");
        }
      }
    }

    function getSortColumns() {
      return sortColumns;
    }

    function handleSelectedRangesChanged(e, ranges) {
      selectedRows = [];
      var hash = {};
      var maxRow = getDataLength() - 1;                                             
      var maxCell = columns.length - 1;
      for (var i = 0, len = ranges.length; i < len; i++) {
        for (var j = Math.max(0, ranges[i].fromRow), jlen = Math.min(ranges[i].toRow, maxRow); j <= jlen; j++) {
          if (!hash[j]) {  // prevent duplicates
            selectedRows.push(j);
            hash[j] = {};
          }
          for (var k = Math.max(0, ranges[i].fromCell), klen = Math.min(ranges[i].toCell, maxCell); k <= klen; k++) {
            if (canCellBeSelected(j, k)) {
              hash[j][columns[k].id] = options.selectedCellCssClass;
            }
          }
        }
      }

      setCellCssStyles("selected-ranges", hash);

      trigger(self.onSelectedRangesChanged, {
        rows: selectedRows,
        ranges: ranges,
        hash: hash,
        grid: self
      }, e);
    }

    /**
     * @api
     * 
     * Return the 1D columns array representing the columns as shown in the *datagrid*.
     *
     * Note: you can obtain exactly the same info by calling the `getColumnsInfo()` API and
     * inspecting the `gridColumns` property in the returned result.
     * 
     * This API is here for backwards compatibility of the SlickGrid API.
     *
     * See also: `getLeafColumns()`
     *  
     * @return {Array} The set of column definition objects.
     */
    function getColumns() {
      return columns; // === getColumnsInfo().gridColumns;
    }

    /**
     * @api
     * 
     * Produce the entire column tree as an object containing both the original
     * column definition tree and the flattened lists.
     *
     * Note: technically, `ret.gridColumns` === `ret.lookupMatrix[ret.lookupMatrix.length - 1]` i.e.
     * the flattened array of column definitions used for rendering the datagrid is the last
     * (i.e. 'deepest') row of columns in the nestedColumns 2D lookup matrix.
     * We decide to offer it separately however for ease of use: many applications of this API
     * will look for this list in particular as getColumns() doesn't deliver it.
     */
    function getColumnsInfo() { 
      return {
        definitionTree: columnsDefTree,         // the input
        lookupMatrix: nestedColumns,            // the 2D lookup array which carries all headers, plus fill spacers
        gridColumns: columns                    // the 1D columns array representing the columns as shown in the *datagrid*
      };
    }

    /**
     * @api
     * 
     * Return the 'leaves-only' column definition set, i.e. the set of column definitions which
     * define each individual column without regard for groupings: this is
     * the 1D columns array representing the columns as shown in the *datagrid*.
     *
     * Note: this is technically identical to calling the `getColumns()` API, but this one's 
     * name represents the logic better when header column hierarchies are used with SlickGrid.
     *  
     * @return {Array} The set of column definition objects.
     */
    function getLeafColumns() {
      return columns;
    }

    function updateColumnCaches() {
      // Pre-calculate cell boundaries.
      columnPosLeft = [];
      //columnPosRight = [];
      var x = 0;
      for (var i = 0, len = columns.length; i < len; i++) {
        columnPosLeft[i] = x;
        x += columns[i].width;
        //columnPosRight[i] = x;
      }
      // store the last calculated left edge also in [length] as it equals the right edge (plus one pixel) of the grid:
      // this way we can use a single cache array columnPosLeft[] to store both left and right edges of all columns!
      // Half the storage and less work for the same result!
      columnPosLeft[i] = x;
    }

    /**
     * @api
     * 
     * Set or re-set the columns in the grid
     * @param {array}     columnDefinitions   columns to set
     * @param {object}    opts                mixed in with the `onColumnsChanged` data sent to event handlers
     *                                        `resizeOptions.skipResizeCanvas` let's you skip that step. 
     *                                        This boosts performance if you don't need it because you're planning to 
     *                                        manually call `resizeCanvas()`.
     */
    function setColumns(newColumnDefinitions, resizeOptions) {
      getEditorLock().cancelCurrentEdit();
  
      parseColumns(newColumnDefinitions);
      resizeOptions = resizeOptions || {};
      updateColumnCaches();
      if (initialized) {
        // Kill the active cell when it sits in the column range which doesn't exist any more in the new column definitions / data set.
        if (activeCellNode && activeCell >= columns.length) {
          resetActiveCell();
        }

        invalidateAllRows();
        createColumnHeaders();
        removeCssRules();
        createCssRules();
        if (!resizeOptions.skipResizeCanvas) {
          resizeCanvas(resizeOptions);
        }
        // Warning: the next call would break as the run-time created style in createCssRules() 
        // may not have been parsed by the browser yet! (At least in Chrome/MAC)
        var rv = applyColumnWidths();   
        if (handleScroll()) {
          render();
        }
        trigger(self.onColumnsChanged, {
          resizeOptions: resizeOptions,
          success: rv,
          grid: self
        });
        return rv;
      }
      return false;
    }

    // Given a column definition object, do all the steps required to react to a change in the widths of any of the columns
    function updateColumnWidths(newColumnDefinitions) {
      // cache the old column widths so we can see which ones changed:
      var columnCount = columns.length;
      var oldColumnWidths = new Array(columnCount);
      var j, c;
      for (j = 0; j < columnCount; j++) {
        c = columns[j];
        assert(c);
        oldColumnWidths[j] = c.width;
      }

      parseColumns(newColumnDefinitions);
      updateColumnCaches();
      
      // compare the new column set against the old one:
      assert(columns.length === columnCount);
      var adjustedColumns = [];
      for (j = 0; j < columnCount; j++) {
        c = columns[j];
        assert(c);
        if (oldColumnWidths[j] !== c.width) {
          adjustedColumns.push(c);
          if (c.rerenderOnResize) {
            invalidateColumn(j);
          }
        }
      }
      if (initialized) {
        // Surgically update all cell widths, including header cells:
        //applyColumnWidths(); -- happens already inside the next statement: updateCanvasWidth()
        var rv = updateCanvasWidth();
        trigger(self.onColumnsResized, { 
          adjustedColumns: adjustedColumns, 
          success: rv, 
          grid: self
        });
        return rv;
      }
      return false;
    }

    function getOptions() {
      return options;
    }

    function setOptions(args) {
      if (!getEditorLock().commitCurrentEdit()) {
        return false;
      }

      makeActiveCellNormal();

      var prev = __extend({}, options);    // shallow clone

      options = __extend(options, args);
      validateAndEnforceOptions();

      if (options.enableAddRow !== prev.enableAddRow) {
        invalidateRow(getDataLength());
      }

      if (options.forceFitColumns && options.forceFitColumns !== prev.forceFitColumns) {
        autosizeColumns();
      }

      //$viewport.css("overflow-y", (options.autoHeight && !clippedAutoSize) ? "auto" : "auto");
      render();

      return true;
    }

    function validateAndEnforceOptions() {
      if (options.autoHeight) {
        options.leaveSpaceForNewRows = false;
      }
      assert(options.defaultColumnWidth > 0);
      columnDefaults.width = options.defaultColumnWidth;
      assert(options.minColumnWidth > 0);
      columnDefaults.minWidth = options.minColumnWidth;
      assert(options.maxColumnWidth >= options.minColumnWidth);
      columnDefaults.maxWidth = options.maxColumnWidth;
    }

    // Note: this is a separate function as the for..in causes the code to remain unoptimized
    // ( http://commondatastorage.googleapis.com/io-2013/presentations/223.pdf / https://github.com/paperjs/paper.js/issues/466 )
    function appendCellCssStylesToArray(dst, cellCssClasses, row, cell) {
      for (var key in cellCssClasses) {
        assert(cellCssClasses.hasOwnProperty(key));
        var clsdef = cellCssClasses[key];
        var classes = (clsdef && clsdef[row]);
        if (classes && classes[cell]) {
          dst.push(classes[cell]);
        }
      }
    }

    function setData(newData, scrollToTop) {
      data = newData;
      invalidateAllRows();
      updateRowCount();
      if (scrollToTop) {
        scrollTo(0, 0);
      }
      render();
    }

    function getData() {
      return data;
    }

    function getDataLength() {
      if (data.getLength) {
        return data.getLength();
      } else {
        return data.length;
      }
    }

    function getDataLengthIncludingAddNew() {
      return getDataLength() + (options.enableAddRow ? 1 : 0);
    }

    function getDataItem(row) {
      if (data.getItem) {
        return data.getItem(row);
      } else {
        return data[row];
      }
    }

    function getCellValueAndInfo(row, cell, config) {
      config = __extend({
        value: true,
        node: true,
        height: true,
        uid: true,
        css: true,              // include the custom CSS styles for this cell as registered through `addCellCssStyles()` API
        format: true,

        outputPlainText: true
      }, config);

      // if the cell has other coordinates because of row/cell span, update that cell coordinate
      var colspan = 1;
      var rowspan = 1;
      var spans = getSpans(row, cell);
      assert(spans ? spans.colspan >= 1 : true);
      if (spans) {
        row = spans.row;
        cell = spans.cell;
        rowspan = spans.rowspan;
        colspan = spans.cellspan;
      }

      assert(Math.min(columns.length - 1, cell + colspan - 1) === cell + colspan - 1);

      var m = columns[cell],
          rowDataItem = getDataItem(row);

      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row, cell);
      // look up by id, then index
      var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[m.id] || rowMetadata.columns[cell]);

      var cellCss = [];
      if (config.css) {
        appendCellCssStylesToArray(cellCss, cellCssClasses, row, cell);
      }

      var cellHeight = options.rowHeight;

      var info = {
          cellCss: cellCss,
          cellStyles: [],
          html: "",
          attributes: {},
          row: row,
          cell: cell,
          colspan: colspan,
          rowspan: rowspan,
          cellHeight: cellHeight,
          isNonStandardCellHeight: false,
          column: m,
          rowDataItem: rowDataItem,
          rowMetadata: rowMetadata,
          columnMetadata: columnMetadata,
          formatterOptions: __extend({}, options.formatterOptions, m.formatterOptions),
          editorOptions: __extend({}, options.editorOptions, m.editorOptions),
          outputPlainText: config.outputPlainText || false
      };

      if (config.height) {
        var altCellHeight = getCellHeight(row, rowspan);
        info.isNonStandardCellHeight = (cellHeight !== altCellHeight);
        info.cellHeight = cellHeight;
      }

      if (config.uid) {
        info.uid = mkSaneId(m, cell, row);
      }
      if (config.node) {
        info.cellNode = getCellNode(row, cell, true);
      }

      if (rowDataItem && config.value) {
        var value = getDataItemValueForColumn(rowDataItem, m, rowMetadata, columnMetadata);
        info.value = value;
        info.formatter = getFormatter(row, cell);
        if (config.format) {
          info.html = info.formatter(row, cell, value, m, rowDataItem, info);
        }
      }
      return info;
    }

    function getTopPanel() {
      return $topPanel[0];
    }

    function setTopPanelVisibility(visible) {
      if (options.showTopPanel != visible) {
        options.showTopPanel = visible;
        if (visible) {
          $topPanelScroller.slideDown("fast", resizeCanvas);
        } else {
          $topPanelScroller.slideUp("fast", resizeCanvas);
        }
      }
    }

    function setFooterRowVisibility(visible) {
      if (options.showFooterRow != visible) {
        options.showFooterRow = visible;
        if (visible) {
          $footerRowScroller.slideDown("fast", resizeCanvas);
        } else {
          $footerRowScroller.slideUp("fast", resizeCanvas);
        }
      }
    }

    function setHeaderRowVisibility(visible) {
      if (options.showHeaderRow != visible) {
        options.showHeaderRow = visible;
        if (visible) {
          $headerRowScroller.slideDown("fast", resizeCanvas);
        } else {
          $headerRowScroller.slideUp("fast", resizeCanvas);
        }
      }
    }

    function parseColumns(columnsInput) {
      var maxDepth = 0;

      columns = [];
      columnsById = {};

      function parse(input, depth, parent) {
        var totalHeaderColSpan = 0;
        var colset = [];
        if (depth >= maxDepth) {
          maxDepth = depth + 1;
        }
        assert(input.length > 0);
        parent.childrenFirstIndex = columns.length;
        for (var i = 0, len = input.length; i < len; i++) {
          var column = __extend({}, columnDefaults, input[i]);
          colset.push(column);
          if (column.children) {
            hasNestedColumns = true;
            column.headerColSpan = parse(column.children, depth + 1, column);
            column.headerRowSpan = 1;
          } else {
            // Ensure that the columnsById[] mapping is a guaranteed reversible 1:1 relationship
            // and that the column.id field is always set to something sensible.
            if (columnsById[column.id] !== undefined || column.id == null) {
              column.id = "__uniq_c" + columns.length; // mkSaneId(column, columns.length, "uniq");
              assert(columnsById[column.id] === undefined);
            }
            columnsById[column.id] = columns.length;
            // make sure width is between its bounds: `minWidth <= width <= maxWidth`
            column.width = Math.min(Math.max(column.width, column.minWidth), column.maxWidth);
            column.headerColSpan = 1;
            column.headerRowSpan = 1;
            columns.push(column);
          }
          totalHeaderColSpan += column.headerColSpan;
        }
        parent.children = colset;
        parent.childrenLastIndex = columns.length;
        return totalHeaderColSpan;
      }

      function addToNested(column, depth) {
        if (!nestedColumns) {
          nestedColumns = [];
        }
        if (!nestedColumns[depth]) {
          nestedColumns[depth] = [];
        }
        // The (column.headerRowLayerIndex, column.headerRow) 'coordinate' is an index straight
        // into the nestedColumns[][] 2D array; this info is included with each columnDef to
        // allow userland code to index and use the nestedColumns via `getColumnsInfo().lookupMatrix`.  
        column.headerRow = depth;
        assert(column.headerRowSpan >= 1);
        column.headerRowLayerIndex = nestedColumns[depth].length;
        nestedColumns[depth].push(column);
      }

      function splitIntoLayers(input, depth) {
        for (var index = 0; index < input.length; index++) {
          var column = input[index];
          addToNested(column, depth);
          if (column.children) {
            assert(column.headerRowSpan === 1);
            splitIntoLayers(column.children, depth + 1);
          } else {
            column.headerRowSpan = maxDepth - depth;
          }
        }
      }

      hasNestedColumns = false;
      var super_parent = {};
      parse(columnsInput, 0, super_parent);
      columnsDefTree = super_parent.children;
      assert(columnsDefTree.length === columnsInput.length);

      assert(hasNestedColumns ? maxDepth > 1 : maxDepth === 1);
      if (hasNestedColumns) {
        splitIntoLayers(columnsDefTree, 0);
        assert(nestedColumns.length === maxDepth);
      } else {
        for (var i = 0, len = columns.length; i < len; i++) {
          var columnDef = columns[i];
          columnDef.headerRow = 0;
          columnDef.headerRowLayerIndex = 0;
          assert(columnDef.headerRowSpan === 1);
          assert(columnDef.headerColSpan === 1);
        }
      }
    }

    function getContainerNode() {
      return $container.get(0);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Rendering / Scrolling

    /**
     * @internal 
     * 
     * Update the row pixel position and height info for all rows up to the given row.
     *
     * @param  {Number} row The last row index which must be updated.
     */
    function cacheRowPositions(row) {
      assert(row >= 0);
      assert(row <= getDataLengthIncludingAddNew());
      var height, r;
      var pos = rowPositionCache[row];
      if (pos === undefined) {
        // do not recurse; loop until we hit the last *completely* valid position cache entry (or row === 0)
        for (r = row - 1; r >= 0; r--) {
          height = rowHeightCache[r];
          if (height === undefined) {
            var rowMetadata = data.getItemMetadata && data.getItemMetadata(r, false);
            rowHeightCache[r] = ((rowMetadata && rowMetadata.height) || options.rowHeight);
          } else if (rowPositionCache[r] !== undefined) {
            break;
          }
        }
        // now fill the position cache from that last full slot we found:
        if (r < 0) {
          r = 0; 
        }
        // We now know that all preceding cache elements (up to and including the `[r]` entry) have been set up with a valid height
        // so now all we need to do is update all top position values; all entries' height is valid hence we can run a very tight loop.
        // 
        // Note that we never access the height cache for the bottom row (`row`) which is correct since there won't be any.
        // The height cache is only an intermediate cache: if we ever need to calculate the height of a row, we subtract the two
        // adjacent top position coordinates instead! 
        pos = 0;
        for ( ; r < row; r++) {
          rowPositionCache[r] = pos;
          height = rowHeightCache[r];
          assert(height !== undefined);
          pos += height;
        }
        rowPositionCache[r] = pos;
      }
      return pos;
    }

    /**
     * Return the top pixel position of the row.
     *
     * @param  {Number} row The row index
     *
     * @return {Number}     The pixel position in the grid canvas. 
     *                      Not compensated for either CSS `box-sizing` model 
     *                      nor any paging or scrolling offset.
     */
    function getRowTop(row) {
      assert(row >= 0);
      assert(row <= getDataLengthIncludingAddNew());
      var pos = rowPositionCache[row];
      if (pos === undefined) {
        return cacheRowPositions(row);
      }
      return pos;
    }

    /**
     * Return the height of the row in pixels.
     *
     * @param  {Number} row The row index
     *
     * @return {Number}     The pixel position in the grid canvas. 
     *                      Not compensated for CSS `box-sizing` model. 
     */
    function getRowHeight(row) {
      assert(row >= 0);
      assert(row <= getDataLengthIncludingAddNew() - 1);
      row++;
      var pos = rowPositionCache[row];
      if (pos === undefined) {
        pos = cacheRowPositions(row);
      }
      row--;
      var postop = rowPositionCache[row];
      if (postop === undefined) {
        postop = cacheRowPositions(row);
        assert(rowPositionCache[row] === postop);
      }
      assert(pos - postop > 0);
      return pos - postop;
    }

    /**
     * Return the pixel position **1 (one) pixel _below_** the row bottom.
     *
     * @param  {Number} row The row index
     *
     * @return {Number}     The pixel position in the grid canvas. 
     *                      Not compensated for either CSS `box-sizing` model 
     *                      nor any paging or scrolling offset.
     */
    function getRowBottom(row) {
      assert(row >= 0);
      assert(row <= getDataLengthIncludingAddNew() - 1);
      row++;
      var pos = rowPositionCache[row];
      if (pos === undefined) {
        return cacheRowPositions(row);
      }
      return pos;
    }

    // Return the row index at the given grid pixel coordinate Y.
    //
    // Also return the "fraction" of the index within the row, i.e.
    // if the Y coordinate points at a spot 25% from the top of the row, then
    // `returnValue.fraction` will be 0.25
    //
    // `returnValue.fraction === 0.0` would identify the top pixel within the row.
    //
    // When the Y coordinate points outside the grid, out-of-range numbers 
    // will be produced as this function will estimate the row number using the
    // default row height.
    //
    // The fraction is guaranteed to be less than 1 (value range: [0 .. 1>) *unless* the
    // function reports an out-of-legal-range 'clipped' position: the fraction shows
    // how far out-of-range the given coordinate was as a ratio of the given row height.
    // 
    // Use a binary search alike algorithm to find the row, using 
    // linear estimation to produce the initial split/probe point and probing range: 
    // this improves significantly on the O(log(n)) of a binary search.
    // 
    // @return {Object} The (possibly clipped) row position info:
    //                  ```
    //                  {
    //                    position: {Integer} row index  
    //                    fraction: {Float}   position within row: ratio of the row height: (0 <= fraction < 1)
    //                    height:   {Number}  row height (assumed **default row height** when the position is outside the legal range)
    //                  };
    //                  ```
    function getRowWithFractionFromPosition(posY, clipToValidRange) {
      if (clipToValidRange == null) {
        clipToValidRange = true;
      }

      //assert(posY >= 0); -- posY can be a negative number when this function is called from inside a drag from bottom-bottom to top-top where the user drags until outside the grid canvas area
      assert(rowPositionCache.length === getDataLengthIncludingAddNew() + 1);
      var rowsInPosCache = getDataLengthIncludingAddNew(); // WARNING: here specifically **NOT** `rowPositionCache.length`! 
      var fraction;
      var probe, probe2, top, bottom, probeInfo, height, dy;

      if (!rowsInPosCache) {
        top = getRowTop(0);
        probe = 0;
        fraction = 0;
        height = options.rowHeight;
        assert(height > 0);
        if (!clipToValidRange) {
          // calculate fraction from the top edge:
          // (outside the grid range the rowFraction/cellFraction represents the number of estimated rows/cells it is out of range)
          probe = Math.floor((posY - top) / height);
          fraction = (posY - probe * height) / height;
        }
        return {
          position: probe,
          fraction: fraction,
          height: height
        };
      }

      // perform a binary search, primed by a dual linear estimate probe through the row cache: 
      // O(1) .. O(log2(n)) vs. original linear scan at O(n):
      //
      // This first call to `getRowTop(rowsInPosCache)` is here to help update the row cache
      // at the start of the search; at least for many scenarios where all (or the last) rows
      // have been invalidated.
      //
      // (Dev. Note: indeed we sample the `getRowTop()` for the row index **one past the end of
      // the available set**: this is **not a mistake** but a deliberate action as the height of
      // the last *valid* row is identical to `getRowTop(row + 1) - getRowTop(row)`
      // and we happen to encode the 'bottom edge (+1)' of the grid in the 'top offset' of the
      // next *invalid* row: that way we have a *single* *continuous* array of 'top offsets' to
      // work on/with, speeding up our code by otherwise keeping it as simple as possible.
      bottom = getRowTop(rowsInPosCache);
      if (posY >= bottom) {
        // Return the last row in the grid if we've got to clip, otherwise estimate
        // which row this would have been:
        if (!clipToValidRange) {
          probe = rowsInPosCache;
          height = options.rowHeight;
          posY -= bottom;
          dy = Math.floor(posY / height);
          probe += dy;
          fraction = (posY - dy * height) / height;
          assert(fraction >= 0);
          assert(fraction < 1);
        } else {
          probe = rowsInPosCache - 1;
          top = getRowTop(probe);
          height = bottom - top;
          assert(height > 0);
          fraction = (posY - top) / height;
          assert(fraction >= 1);
        }
        return {
          position: probe,
          fraction: fraction,
          height: height
        };
      }
      top = getRowTop(0);
      if (posY < top) {
        probe = 0;
        // Return the first row in the grid if we've got to clip, otherwise estimate
        // which row this would have been:
        if (!clipToValidRange) {
          height = options.rowHeight;
          posY -= top;
          dy = Math.floor(posY / height);
          assert(dy < 0);
          probe += dy;
          fraction = (posY - dy * height) / height;
          assert(fraction >= 0);
          assert(fraction < 1);
        } else {
          bottom = getRowTop(1);
          height = bottom - top;
          assert(height > 0);
          fraction = (posY - top) / height;
          assert(fraction < 0);
        }
        return {
          position: probe,
          fraction: fraction,
          height: height
        };
      } else if (rowsInPosCache === 1) {
        assert(top <= posY);
        assert(bottom > posY);
        // When there's only a single row we now know we have a solid hit!        
        height = bottom - top;
        assert(height > 0);
        fraction = (posY - top) / height;
        assert(fraction >= 0);
        assert(fraction < 1);
        return {
          position: 0,
          fraction: fraction,
          height: height
        };
      }

      var l = 0;
      var r = rowsInPosCache - 1;
      // Before we enter the binary search, we attempt to improve the initial guess + search range
      // using the heuristic that the variable row height will be close to the *average* row height:
      // we perform two linear estimate probes (the second one minus ≈1‰ interval) to save 10 probes (1000 ≈ 2^10) if we are lucky;
      // we "loose" 1 probe (the second) to inefficiency if we are unlucky (though one may argue
      // that the possibly extremely skewed split point for the first probe is also a loss -- which
      // would be true if the number of rows with non-standard `options.rowHeight` is large and/or deviating
      // from that norm `options.rowHeight` a lot for only rows at the top 
      // or bottom side of the grid, thus moving the targets outside the
      // "is probably within 1‰ of the norm" for most row positions. Any mistake by the first probe
      // 'going wide' will be compensated somewhat by the second linear estimate probe which employs 
      // improved grid info.
      // 
      // Alas, for my tested (large!) grids this heuristic gets us very near O(2) vs O(log2(N)).
      // For grids which do not employ custom `options.rowHeight` at all, the performance is O(1). I like that!
      //
      // (Yes, this discussion ignores the cost of the row position cache table update which
      // is O(N) on its own but which is also to be treated as "negligible cost" when amortized over
      // the number of `getRowWithFractionFromPosition` calls vs. cache invalidation.)
      height = bottom - top;
      assert(height > 0);
      // Linear estimate number 1 & save one division by *not* using an intermediate variable:
      // 
      // ```
      // var averageHeight = Math.max(1, height / rowsInPosCache);
      // probe = (posY / averageHeight) | 0;
      // ```
      // 
      // Note that the 'integer cast' (`y | 0`) takes care of any NaN that *might* have crawled out of the
      // `probe` estimate below -- though `bottom === top` is **highly** unlikely. 
      probe = (posY * rowsInPosCache / height) | 0;
      assert(r >= 1);
      probe = Math.min(r, Math.max(1, probe));    // set a lower bound of *1* to potentially double-duty the next probe to check for any top row hit
      probeInfo = getRowTop(probe);
      if (probeInfo > posY) {
        r = probe - 1;
        bottom = probeInfo;
        height = bottom - top;
        assert(height > 0);
        assert(l === 0);
        // Did we get a hit on the top row now, incidentally?
        if (r === 0) {
          fraction = (posY - top) / height;
          assert(fraction >= 0);
          assert(fraction < 1);
          return {
            position: l,
            fraction: fraction,
            height: height
          };
        }
        // We have updated our 'average row height' knowledge for the range of rows we're going
        // to look at from now on in the `height` value.
        // 
        // Note: we 'overshoot' the second probe by a minimal amount to skew it towards the
        // top:
        assert(r + 1 === probe);
        probe2 = (posY * probe / height - 0.001 * rowsInPosCache) | 0;
        assert(r >= 1);
        probe2 = Math.min(r, Math.max(1, probe2));
        assert(probe2 !== probe);
        probeInfo = getRowTop(probe2);
        if (probeInfo > posY) {
          r = probe2 - 1;
          assert(l === 0);
          assert(r >= l);
          // Did we get a (rare!) hit on the top row now, incidentally?
          if (r === 0) {
            bottom = probeInfo;
            height = bottom - top;
            assert(height > 0);
            assert(l === 0);
            fraction = (posY - top) / height;
            assert(fraction >= 0);
            assert(fraction < 1);
            return {
              position: l,
              fraction: fraction,
              height: height
            };
          }
          assert(r > l);
        } else {
          assert(probeInfo <= posY);
          l = probe2;
          top = probeInfo;
          // what we are *really* going to check here: 
          // 
          // ```
          // if (r + 1 !== l + 1) {
          //   bottom = getRowTop(l + 1);
          // }
          // if (bottom > posY) {
          //   BINGO! HIT!
          // }
          // ```
          // 
          // but this way we keep the old `bottom` edge intact for when we *don't* get a hit
          // bottom now:
          if (r !== l) {
            assert(l + 1 < r + 1);                
            probeInfo = getRowTop(l + 1);
          } else {
            // We've just discovered we're located in the *last* row of the grid:
            probeInfo = bottom;
            assert(probeInfo > posY);
          }
          if (probeInfo > posY) {
            height = probeInfo - top;
            assert(height > 0);
            fraction = (posY - top) / height;
            assert(fraction >= 0);
            assert(fraction < 1);
            return {
              position: l,
              fraction: fraction,
              height: height
            };
          }
          l++;
          top = probeInfo;
          assert(r >= l);
        }
      } else {
        assert(probeInfo <= posY);
        // By necessity both these main branches look quite different: contrary to the
        // main `if()` branch above we're in a position here where our first linear estimate 
        // may deliver a direct hit!
        l = probe + 1;
        top = probeInfo;
        assert(r + 1 === rowsInPosCache);
        if (l !== rowsInPosCache) {
          assert(l < rowsInPosCache);
          probeInfo = getRowTop(l);
        } else {
          // We've just discovered we're located in the *last* row of the grid:
          probeInfo = bottom;
          assert(probeInfo > posY);
        }
        if (probeInfo > posY) {
          height = probeInfo - top;
          assert(height > 0);
          assert(probe === l - 1);
          fraction = (posY - top) / height;
          assert(fraction >= 0);
          assert(fraction < 1);
          return {
            position: probe,
            fraction: fraction,
            height: height
          };
        } else {
          assert(probeInfo <= posY);
          assert(l < rowsInPosCache);
          top = probeInfo;
          // update our 'average row height' knowledge for the range of rows we're going
          // to look at from now on.
          // 
          // Note: we 'overshoot' the second probe by a minimal amount to skew it towards the
          // bottom:
          height = bottom - top;
          assert(height > 0);
          assert(probe === l - 1);
          probe2 = (posY * (r - probe) / height + 0.001 * rowsInPosCache) | 0;
          assert(r >= l + 1);
          probe2 = Math.min(r, Math.max(l + 1, probe2));    // guarantee that `probe2` doesn't probe the same slot as did `probe`; the potential side effect is that `probe2` can do double-duty for checking a direct hit on row `l`.
          probeInfo = getRowTop(probe2);
          if (probeInfo > posY) {
            r = probe2 - 1;
            assert(r >= l);
            // Did we get a (rare) direct hit on the row immediately to the bottom of the initial probe row now, incidentally?
            // (We just happen to have all the relevant info for that row on hand thanks to the position of the second 
            // linear estimate probe...)
            if (r === l) {
              bottom = probeInfo;
              height = bottom - top;
              assert(height > 0);
              assert(l > 0);
              fraction = (posY - top) / height;
              assert(fraction >= 0);
              assert(fraction < 1);
              return {
                position: l,
                fraction: fraction,
                height: height
              };
            }
          } else {
            l = probe2;
            top = probeInfo;
            assert(probeInfo <= posY);
            assert(l < rowsInPosCache);
            // what we *really* check here: 
            // 
            // ```
            // if (r + 1 !== l + 1) {
            //   bottom = getRowTop(l + 1);
            // }
            // if (bottom > posY) {
            //   BINGO! HIT!
            // }
            // ```
            // but this way we keep the old `bottom` edge intact for when we *don't* get a hit
            // bottom now:
            if (r !== l) {
              assert(r > l);
              probeInfo = getRowTop(l + 1);
            } else {
              // We've just discovered we're located in the *last* row of the grid:
              probeInfo = bottom;
              assert(probeInfo > posY);
            }
            if (probeInfo > posY) {
              //bottom = probeInfo;
              height = probeInfo - top;
              fraction = (posY - top) / height;
              assert(fraction >= 0);
              assert(fraction < 1);
              return {
                position: l,
                fraction: fraction,
                height: height
              };
            }
            l++;
            top = probeInfo;
            assert(r >= l);
          }
        }
      }

      assert(l <= r);
      assert(top === getRowTop(l));
      // Regrettably `bottom` is not so useful: it points to the *top* edge of the bottom row `r`.   :-(

      while (l <= r) {
        probe = ((l + r + 1) / 2) | 0; // make sure the probe doesn't test the already previously sampled `l` slot
        probeInfo = getRowTop(probe);
        if (probeInfo > posY) {
          r = probe - 1;
          assert(r >= l);
          // Did we get a (rare) direct hit on the `l` row, incidentally?
          // (We just happen to have all the relevant info for that row on hand...)
          if (r === l) {
            break;        // We choose to break out of the loop instead of immediately the result as that way we shut up any less-than-brilliant code flow analyzers about a possible null-return path.
          }
        } else {
          assert(probeInfo <= posY);
          assert(probe >= l + 1);
          l = probe;
          top = probeInfo;
        }
      }
      assert(r === l);
      bottom = probeInfo;
      height = bottom - top;
      assert(height > 0);
      assert(l > 0);
      fraction = (posY - top) / height;
      assert(fraction >= 0);
      assert(fraction < 1);
      return {
        position: l,
        fraction: fraction,
        height: height
      };
    }

    // Return the column index at the given grid pixel coordinate X.
    //
    // Also return the "fraction" of the index within the column, i.e.
    // if the X coordinate points at a spot 25% from the left of the column, then
    // `returnValue.fraction` will be 0.25
    //
    // `returnValue.fraction === 0.0` would identify the left-most pixel within the column.
    //
    // When the X coordinate points outside the grid, out-of-range numbers 
    // will be produced as this function will estimate the column number using the
    // default column width.
    //
    // The fraction is guaranteed to be less than 1 (value range: [0 .. 1>) *unless* the
    // function reports an out-of-legal-range 'clipped' position: the fraction shows
    // how far out-of-range the given coordinate was as a ratio of the given column width.
    // 
    // Use a binary search alike algorithm to find the column, using 
    // linear estimation to produce the initial split/probe point and probing range: 
    // this improves significantly on the O(log(n)) of a binary search.
    // 
    // @return {Object} The (possibly clipped) cell position info:
    //                  ```
    //                  {
    //                    position: {Integer} cell index  
    //                    fraction: {Float}   position within cell: ratio of the cell width: (0 <= fraction < 1)
    //                    width:    {Number}  cell width (assumed **default cell width** when the position is outside the legal range)
    //                  };
    //                  ```
    function getColumnWithFractionFromPosition(posX, clipToValidRange) {
      if (clipToValidRange == null) {
        clipToValidRange = true;
      }

      //assert(posX >= 0); -- posX can be a negative number when this function is called from inside a drag from bottom-right to top-left where the user drags until outside the grid canvas area
      assert(columnPosLeft.length === columns.length + 1);
      var colsInPosCache = columns.length; // WARNING: here specifically **NOT** columnPosLeft.length! 
      var fraction;
      var probe, probe2, left, right, probeInfo, width, dx;

      if (!colsInPosCache) {
        left = getColumnOffset(0);
        probe = 0;
        fraction = 0;
        width = options.defaultColumnWidth;
        assert(width > 0);
        if (!clipToValidRange) {
          // calculate fraction from the left edge:
          // (outside the grid range the rowFraction/cellFraction represents the number of estimated rows/cells it is out of range)
          probe = Math.floor((posX - left) / width);
          fraction = (posX - probe * width) / width;
        }
        return {
          position: probe,
          fraction: fraction,
          width: width
        };
      }

      // perform a binary search, primed by a dual linear estimate probe through the column cache: 
      // O(1) .. O(log2(n)) vs. original linear scan at O(n):
      //
      // This first call to `getColumnOffset(colsInPosCache)` is here to help update the column cache
      // at the start of the search; at least for many scenarios where all (or the last) columns
      // have been invalidated.
      //
      // (Dev. Note: indeed we sample the `getColumnOffset()` for the column index **one past the end of
      // the available set**: this is **not a mistake** but a deliberate action as the width of
      // the last *valid* column is identical to `getColumnOffset(column + 1) - getColumnOffset(column)`
      // and we happen to encode the 'right edge (+1)' of the grid in the 'left offset' of the
      // next *invalid* column: that way we have a *single* *continuous* array of 'left offsets' to
      // work on/with, speeding up our code by otherwise keeping it as simple as possible.
      right = getColumnOffset(colsInPosCache);
      if (posX >= right) {
        // Return the last column in the grid if we've got to clip, otherwise estimate
        // which column this would have been:
        if (!clipToValidRange) {
          probe = colsInPosCache;
          width = options.defaultColumnWidth;
          posX -= right;
          dx = Math.floor(posX / width);
          probe += dx;
          fraction = (posX - dx * width) / width;
          assert(fraction >= 0);
          assert(fraction < 1);
        } else {
          probe = colsInPosCache - 1;
          left = getColumnOffset(probe);
          width = right - left;
          assert(width > 0);
          fraction = (posX - left) / width;
          assert(fraction >= 1);
        }
        return {
          position: probe,
          fraction: fraction,
          width: width
        };
      }
      left = getColumnOffset(0);
      if (posX < left) {
        probe = 0;
        // Return the first column in the grid if we've got to clip, otherwise estimate
        // which column this would have been:
        if (!clipToValidRange) {
          width = options.defaultColumnWidth;
          posX -= left;
          dx = Math.floor(posX / width);
          assert(dx < 0);
          probe += dx;
          fraction = (posX - dx * width) / width;
          assert(fraction >= 0);
          assert(fraction < 1);
        } else {
          right = getColumnOffset(1);
          width = right - left;
          assert(width > 0);
          fraction = (posX - left) / width;
          assert(fraction < 0);
        }
        return {
          position: probe,
          fraction: fraction,
          width: width
        };
      } else if (colsInPosCache === 1) {
        assert(left <= posX);
        assert(right > posX);
        // When there's only a single column we now know we have a solid hit!        
        width = right - left;
        assert(width > 0);
        fraction = (posX - left) / width;
        assert(fraction >= 0);
        assert(fraction < 1);
        return {
          position: 0,
          fraction: fraction,
          width: width
        };
      }

      var l = 0;
      var r = colsInPosCache - 1;
      // Before we enter the binary search, we attempt to improve the initial guess + search range
      // using the heuristic that the variable cell width will be close to the *average* column width:
      // we perform two linear estimate probes (the second one minus ≈1‰ interval) to save 10 probes (1000 ≈ 2^10) if we are lucky;
      // we "loose" 1 probe (the second) to inefficiency if we are unlucky (though one may argue
      // that the possibly extremely skewed split point for the first probe is also a loss -- which
      // would be true if the number of columns with non-standard `defaultColumnWidth` is large and/or deviating
      // from that norm `options.defaultColumnWidth` a lot for only columns at the left-most 
      // or right-most side of the grid, thus moving the targets outside the
      // "is probably within 1‰ of the norm" for most column positions. Any mistake by the first probe
      // 'going wide' will be compensated somewhat by the second linear estimate probe which employs 
      // improved grid info.
      // 
      // Alas, for my tested (large!) grids this heuristic gets us very near O(2) vs O(log2(N)).
      // For grids which do not employ custom `defaultColumnWidth` at all, the performance is O(1). I like that!
      //
      // (Yes, this discussion ignores the cost of the column position cache table update which
      // is O(N) on its own but which is also to be treated as "negligible cost" when amortized over
      // the number of `getColumnWithFractionFromPosition` calls vs. cache invalidation.)
      width = right - left;
      assert(width > 0);
      // Linear estimate number 1 & save one division by *not* using an intermediate variable:
      // 
      // ```
      // var averageWidth = Math.max(1, width / colsInPosCache);
      // probe = (posX / averageWidth) | 0;
      // ```
      // 
      // Note that the 'integer cast' (`x | 0`) takes care of any NaN that *might* have crawled out of the
      // `probe` estimate below -- though `right === left` is **highly** unlikely. 
      probe = (posX * colsInPosCache / width) | 0;
      assert(r >= 1);
      probe = Math.min(r, Math.max(1, probe));    // set a lower bound of *1* to potentially double-duty the next probe to check for any left-most column hit
      probeInfo = getColumnOffset(probe);
      if (probeInfo > posX) {
        r = probe - 1;
        right = probeInfo;
        width = right - left;
        assert(width > 0);
        assert(l === 0);
        // Did we get a hit on the left-most column now, incidentally?
        if (r === 0) {
          fraction = (posX - left) / width;
          assert(fraction >= 0);
          assert(fraction < 1);
          return {
            position: l,
            fraction: fraction,
            width: width
          };
        }
        // We have updated our 'average column width' knowledge for the range of columns we're going
        // to look at from now on in the `width` value.
        // 
        // Note: we 'overshoot' the second probe by a minimal amount to skew it towards the
        // left:
        assert(r + 1 === probe);
        probe2 = (posX * probe / width - 0.001 * colsInPosCache) | 0;
        assert(r >= 1);
        probe2 = Math.min(r, Math.max(1, probe2));
        assert(probe2 !== probe);
        probeInfo = getColumnOffset(probe2);
        if (probeInfo > posX) {
          r = probe2 - 1;
          assert(l === 0);
          assert(r >= l);
          // Did we get a (rare!) hit on the left-most column now, incidentally?
          if (r === 0) {
            right = probeInfo;
            width = right - left;
            assert(width > 0);
            assert(l === 0);
            fraction = (posX - left) / width;
            assert(fraction >= 0);
            assert(fraction < 1);
            return {
              position: l,
              fraction: fraction,
              width: width
            };
          }
          assert(r > l);
        } else {
          assert(probeInfo <= posX);
          l = probe2;
          left = probeInfo;
          // what we are *really* going to check here: 
          // 
          // ```
          // if (r + 1 !== l + 1) {
          //   right = getColumnOffset(l + 1);
          // }
          // if (right > posX) {
          //   BINGO! HIT!
          // }
          // ```
          // 
          // but this way we keep the old `right` edge intact for when we *don't* get a hit
          // right now:
          if (r !== l) {
            assert(l + 1 < r + 1);                
            probeInfo = getColumnOffset(l + 1);
          } else {
            // We've just discovered we're located in the *last* column of the grid:
            probeInfo = right;
            assert(probeInfo > posX);
          }
          if (probeInfo > posX) {
            width = probeInfo - left;
            assert(width > 0);
            fraction = (posX - left) / width;
            assert(fraction >= 0);
            assert(fraction < 1);
            return {
              position: l,
              fraction: fraction,
              width: width
            };
          }
          l++;
          left = probeInfo;
          assert(r >= l);
        }
      } else {
        assert(probeInfo <= posX);
        // By necessity both these main branches look quite different: contrary to the
        // main `if()` branch above we're in a position here where our first linear estimate 
        // may deliver a direct hit!
        l = probe + 1;
        left = probeInfo;
        assert(r + 1 === colsInPosCache);
        if (l !== colsInPosCache) {
          assert(l < colsInPosCache);
          probeInfo = getColumnOffset(l);
        } else {
          // We've just discovered we're located in the *last* column of the grid:
          probeInfo = right;
          assert(probeInfo > posX);
        }
        if (probeInfo > posX) {
          width = probeInfo - left;
          assert(width > 0);
          assert(probe === l - 1);
          fraction = (posX - left) / width;
          assert(fraction >= 0);
          assert(fraction < 1);
          return {
            position: probe,
            fraction: fraction,
            width: width
          };
        } else {
          assert(probeInfo <= posX);
          assert(l < colsInPosCache);
          left = probeInfo;
          // update our 'average column width' knowledge for the range of columns we're going
          // to look at from now on.
          // 
          // Note: we 'overshoot' the second probe by a minimal amount to skew it towards the
          // right:
          width = right - left;
          assert(width > 0);
          assert(probe === l - 1);
          probe2 = (posX * (r - probe) / width + 0.001 * colsInPosCache) | 0;
          assert(r >= l + 1);
          probe2 = Math.min(r, Math.max(l + 1, probe2));    // guarantee that `probe2` doesn't probe the same slot as did `probe`; the potential side effect is that `probe2` can do double-duty for checking a direct hit on column `l`.
          probeInfo = getColumnOffset(probe2);
          if (probeInfo > posX) {
            r = probe2 - 1;
            assert(r >= l);
            // Did we get a (rare) direct hit on the column immediately to the right of the initial probe column now, incidentally?
            // (We just happen to have all the relevant info for that column on hand thanks to the position of the second 
            // linear estimate probe...)
            if (r === l) {
              right = probeInfo;
              width = right - left;
              assert(width > 0);
              assert(l > 0);
              fraction = (posX - left) / width;
              assert(fraction >= 0);
              assert(fraction < 1);
              return {
                position: l,
                fraction: fraction,
                width: width
              };
            }
          } else {
            l = probe2;
            left = probeInfo;
            assert(probeInfo <= posX);
            assert(l < colsInPosCache);
            // what we *really* check here: 
            // 
            // ```
            // if (r + 1 !== l + 1) {
            //   right = getColumnOffset(l + 1);
            // }
            // if (right > posX) {
            //   BINGO! HIT!
            // }
            // ```
            // but this way we keep the old `right` edge intact for when we *don't* get a hit
            // right now:
            if (r !== l) {
              assert(r > l);
              probeInfo = getColumnOffset(l + 1);
            } else {
              // We've just discovered we're located in the *last* column of the grid:
              probeInfo = right;
              assert(probeInfo > posX);
            }
            if (probeInfo > posX) {
              //right = probeInfo;
              width = probeInfo - left;
              fraction = (posX - left) / width;
              assert(fraction >= 0);
              assert(fraction < 1);
              return {
                position: l,
                fraction: fraction,
                width: width
              };
            }
            l++;
            left = probeInfo;
            assert(r >= l);
          }
        }
      }

      assert(l <= r);
      assert(left === getColumnOffset(l));
      // Regrettably `right` is not so useful: it points to the *left* edge of the right-most column `r`.   :-(

      while (l <= r) {
        probe = ((l + r + 1) / 2) | 0; // make sure the probe doesn't test the already previously sampled `l` slot
        probeInfo = getColumnOffset(probe);
        if (probeInfo > posX) {
          r = probe - 1;
          assert(r >= l);
          // Did we get a (rare) direct hit on the `l` column, incidentally?
          // (We just happen to have all the relevant info for that column on hand...)
          if (r === l) {
            break;        // We choose to break out of the loop instead of immediately the result as that way we shut up any less-than-brilliant code flow analyzers about a possible null-return path.
          }
        } else {
          assert(probeInfo <= posX);
          assert(probe >= l + 1);
          l = probe;
          left = probeInfo;
        }
      }
      assert(r === l);
      right = probeInfo;
      width = right - left;
      assert(width > 0);
      assert(l > 0);
      fraction = (posX - left) / width;
      assert(fraction >= 0);
      assert(fraction < 1);
      return {
        position: l,
        fraction: fraction,
        width: width
      };
    }


    // Return TRUE when the viewport has been actually scrolled;
    // return FALSE when there's been no movement.
    function scrollTo(y, x) {
      if (x == null) {
        x = prevScrollLeft;
      }
      if (y == null) {
        y = prevScrollTop;
      }

      x = Math.max(x, 0);
      y = Math.max(y, 0);
      y = Math.min(y, virtualTotalHeight - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0));

      var oldOffset = pageOffset;

      page = Math.min(numberOfPages - 1, pageHeight > 0 ? Math.floor(y / pageHeight) : 0);
      pageOffset = Math.round(page * jumpinessCoefficient);
      var newScrollTop = y - pageOffset;

      // if (pageOffset !== oldOffset) {
      //   var range = getVisibleRange(newScrollTop);
      //   cleanUpRows(range);
      // }

      var viewportChanged = false;

      if (prevScrollTop !== newScrollTop) {
        if (options.debug & DEBUG_SCROLL) { console.log("scrollTo caused a change!: ", prevScrollTop, newScrollTop, pageOffset, oldOffset, page, y); }
        vScrollDir = (prevScrollTop + oldOffset < newScrollTop + pageOffset) ? 1 : -1;
        $viewport[0].scrollTop = prevScrollTop = scrollTop = newScrollTop;
        viewportChanged = true;
      }

      var newScrollLeft = x;
      if (prevScrollLeft !== newScrollLeft) {
        $viewport[0].scrollLeft = prevScrollLeft = scrollLeft = newScrollLeft;
        viewportChanged = true;
      }

      if (viewportChanged) {
        trigger(self.onViewportChanged);
        return true;
      }
      return false;
    }

    var processHtmlEntities = new Slick.HtmlEntities();

    function defaultFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
      assert(cellMetaInfo);
      if (cellMetaInfo.outputPlainText) {
        if (value == null) {
          return "";
        } else {
          return "" + value;
        }
      } else {
        return processHtmlEntities.encode(value);
      }
    }

    function defaultHeaderFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
      assert(cellMetaInfo);
      // make sure column names with & ampersands and/or < / > less-than/greater-then characters are properly rendered in HTML:
      var output = defaultFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo);
      if (!cellMetaInfo.outputPlainText) {
        // Do create an outer SPAN so that we can style the entire header cell *excluding* the (optional) column resizer component:
        output = "<span class='slick-column-name'>" + output + "</span>";
      }
      return output;
    }

    function defaultHeaderRowFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
      assert(cellMetaInfo);
      // make sure column names with & ampersands and/or < / > less-than/greater-then characters are properly rendered in HTML:
      var output = defaultFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo);
      if (!cellMetaInfo.outputPlainText) {
        // Do create an outer SPAN so that we can style the entire header cell *excluding* the (optional) column resizer component:
        output = "<span class='slick-extra-headerrow-column'>" + output + "</span>";
      }
      return output;
    }

    function defaultRowFormatter(row, rowDataItem, rowMetaInfo) {
      assert(rowMetaInfo);
      // return nothing; all this formatter ever may do is tweak the rowMetaInfo.attributes collective.
    }

    function getRowFormatter(row) {
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row, false);

      return (rowMetadata && rowMetadata.rowFormatter) ||
          (options.formatterFactory && options.formatterFactory.getRowFormatter && options.formatterFactory.getRowFormatter(row, rowMetadata)) ||
          options.defaultRowFormatter;
    }

    function getFormatter(row, cell) {
      var column = columns[cell];
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row, cell);

      // look up by id, then index
      var columnMetadata = rowMetadata &&
          rowMetadata.columns &&
          (rowMetadata.columns[column.id] || rowMetadata.columns[cell]);

      return (columnMetadata && columnMetadata.formatter) ||
          (rowMetadata && rowMetadata.formatter) ||
          column.formatter ||
          (options.formatterFactory && options.formatterFactory.getFormatter && options.formatterFactory.getFormatter(column, row, cell, rowMetadata, columnMetadata)) ||
          options.defaultFormatter;
    }

    /**
     * Returns the header cell formatter for the given header row / column
     *
     * @param {Integer} headerRow the header row number; starts numbering at 0 (zero).
     *                  Vanilla SlickGrid only supports a single header row, which is numbered 0 (zero).
     * @param {Integer} cell the header column number; starts numbering at 0 (zero).
     * @return {Function} a Slick.Formatters compatible formatter.
     *                    In order to allow the user to re-use basic formatters,
     *                    the row number passed to the formatter will start at -2000 (minus two thousand).
     */
    function getHeaderFormatter(headerRow, cell) {
      var column = columns[cell];
      var rowMetadata = data.getHeaderItemMetadata && data.getHeaderItemMetadata(headerRow, cell);

      // look up by id, then index
      var columnOverrides = rowMetadata &&
          rowMetadata.columns &&
          (rowMetadata.columns[column.id] || rowMetadata.columns[cell]);

      return (columnOverrides && columnOverrides.headerFormatter) ||
          (rowMetadata && rowMetadata.headerFormatter) ||
          column.headerFormatter ||
          (options.formatterFactory && options.formatterFactory.getHeaderFormatter && options.formatterFactory.getHeaderFormatter(column, row, cell, rowMetadata, columnMetadata)) ||
          options.defaultHeaderFormatter;
    }

    /**
     * Returns the headerRow cell formatter for the given headerRow row / column.
     *
     * The "headerRow" is the header row shown by SlickGrid when the `option.showHeaderRow` is enabled.
     *
     * @param {Integer} headerRow the headerRow row number; starts numbering at 0 (zero).
     *                  Vanilla SlickGrid only supports a single headerRow row, which is numbered 0 (zero).
     *
     * @param {Integer} cell the headerRow column number; starts numbering at 0 (zero).
     *
     * @return {Function} a Slick.Formatters compatible formatter.
     *                    In order to allow the user to re-use basic formatters,
     *                    the row number passed to the formatter will start at -1000 (minus one thousand).
     */
    function getHeaderRowFormatter(headerRow, cell) {
      var column = columns[cell];
      var rowMetadata = data.getHeaderRowItemMetadata && data.getHeaderRowItemMetadata(headerRow, cell);

      // look up by id, then index
      var columnMetadata = rowMetadata &&
          rowMetadata.columns &&
          (rowMetadata.columns[column.id] || rowMetadata.columns[cell]);

      return (columnMetadata && columnMetadata.headerRowFormatter) ||
          (rowMetadata && rowMetadata.headerRowFormatter) ||
          column.headerRowFormatter ||
          (options.formatterFactory && options.formatterFactory.getHeaderRowFormatter && options.formatterFactory.getHeaderRowFormatter(column, row, cell, rowMetadata, columnMetadata)) ||
          options.defaultHeaderRowFormatter;
    }

    function getEditor(row, cell) {
      var column = columns[cell];
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row, cell);

      // look up by id, then index
      var columnMetadata = rowMetadata &&
          rowMetadata.columns &&
          (rowMetadata.columns[column.id] || rowMetadata.columns[cell]);

      return (columnMetadata && columnMetadata.editor) ||
          (rowMetadata && rowMetadata.editor) ||
          column.editor ||
          (options.editorFactory && options.editorFactory.getEditor && options.editorFactory.getEditor(column, row, cell, rowMetadata, columnMetadata)) ||
          options.defaultEditor;
    }

    function getDataItemValueForColumn(item, columnDef, rowMetadata, columnMetadata) {
      if (columnMetadata && columnMetadata.dataItemColumnValueExtractor) {
        return columnMetadata.dataItemColumnValueExtractor(item, columnDef, rowMetadata, columnMetadata);
      }
      if (rowMetadata && rowMetadata.dataItemColumnValueExtractor) {
        return rowMetadata.dataItemColumnValueExtractor(item, columnDef, rowMetadata, columnMetadata);
      }
      if (columnDef && columnDef.dataItemColumnValueExtractor) {
        return columnDef.dataItemColumnValueExtractor(item, columnDef, rowMetadata, columnMetadata);
      }
      if (options.dataItemColumnValueExtractor) {
        return options.dataItemColumnValueExtractor(item, columnDef, rowMetadata, columnMetadata);
      }
      return item[columnDef.field];
    }

    function setDataItemValueForColumn(item, columnDef, value, rowMetadata, columnMetadata) {
      if (columnMetadata && columnMetadata.dataItemColumnValueSetter) {
        return columnMetadata.dataItemColumnValueSetter(item, columnDef, value, rowMetadata, columnMetadata);
      }
      if (rowMetadata && rowMetadata.dataItemColumnValueSetter) {
        return rowMetadata.dataItemColumnValueSetter(item, columnDef, value, rowMetadata, columnMetadata);
      }
      if (columnDef && columnDef.dataItemColumnValueSetter) {
        return columnDef.dataItemColumnValueSetter(item, columnDef, value, rowMetadata, columnMetadata);
      }
      if (options.dataItemColumnValueSetter) {
        return options.dataItemColumnValueSetter(item, columnDef, value, rowMetadata, columnMetadata);
      }
      return item[columnDef.field] = value;
    }

    // Combines the various obj.attributes collections into one; returns NULL when no custom metadata was obtained at all.
    // 
    // Notes: 
    // - Attributes which are set to UNDEFINED are not included in the output. 
    // - Attributes which are set to NULL, do get included in the returned set.
    // - Attributes specified in a later function argument override the same ones in a previous argument: 
    //   mkCellHtmlOutput has precedence over columnMetadata, which has precedence over rowMetadata.
    function getAllCustomMetadata(rowMetadata, columnMetadata, mkCellHtmlOutput) {
      var obj = {};
      var attr, val, meta;
      var count = 0;

      function collect_meta(obj, meta) {
        var count = 0;
        var attr, val;

        for (attr in meta) {
          assert(meta.hasOwnProperty(attr));
          val = meta[attr];
          if (val !== undefined) {
            obj[attr] = val;
            count++;
          }
        }
        return count;
      }

      if (rowMetadata && rowMetadata.attributes) {
        meta = rowMetadata.attributes;

        count += collect_meta(obj, meta);
      }

      if (columnMetadata && columnMetadata.attributes) {
        meta = columnMetadata.attributes;

        count += collect_meta(obj, meta);
      }

      if (mkCellHtmlOutput && mkCellHtmlOutput.attributes) {
        meta = mkCellHtmlOutput.attributes;
  
        count += collect_meta(obj, meta);
      }

      if (count) {
        return obj;
      }
      return null;
    }

    function mkRowHtml(row, dataLength) {
      var d = getDataItem(row);
      var dataLoading = row < dataLength && !d;
      var rowCss = ["ui-widget-content", "slick-row",
          (row % 2 === 1 ? "odd" : "even"),
          "slick-row-" + row
      ];
      if (dataLoading) {
        rowCss.push("loading");
      }
      if (row === activePosY) {
        rowCss.push("active-row");
      }

      if (!d) {
        rowCss.push(options.addNewRowCssClass);
      }

      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row, false);

      if (rowMetadata && rowMetadata.cssClasses) {
        if (typeof rowMetadata.cssClasses === "function") {
          rowCss = rowCss.concat(rowMetadata.cssClasses(row));
        } else {
          rowCss.push(rowMetadata.cssClasses);
        }
      }

      assert(rowsCache[row]);
      assert(rowsCache[row].cellRenderQueue.length === 0);

      var metaData = getAllCustomMetadata(rowMetadata) || {};
      metaData.role = "row";
      var rowStyles = ["top: " + getRowTop(row) + "px"];
      var rowHeight = getRowHeight(row);
      if (rowHeight !== options.rowHeight) {
        rowStyles.push("height: " + rowHeight + "px");
      }

      var info = __extend({}, options.rowFormatterOptions, {
        rowCss: rowCss,
        rowStyles: rowStyles,
        attributes: metaData,
        rowHeight: rowHeight,
        rowMetadata: rowMetadata,
        rowData: d
      });
      // I/F: function rowFormatter(row, rowDataItem, rowMetaInfo)
      getRowFormatter(row)(row, rowMetadata, info);
      assert(metaData === info.attributes);

      return info;
    }

    function appendRowHtml(stringArray, row, range, dataLength) {
      var info = mkRowHtml(row, dataLength);
      var metaData = info.attributes;

      stringArray.push("<div");

      patchupCellAttributes(metaData, info, "row");
      appendMetadataAttributes(stringArray, row, null, metaData, null, null, info);

      stringArray.push(">");

      var rowMetadata = info.rowMetadata;
      var d = info.rowData;

      var colspan, m, columnData;
      for (var i = 0, ii = columns.length; i < ii; i += colspan) {
        m = columns[i];
        colspan = 1;
        var spanRow = row;
        var spans = getSpans(row, i);
        if (spans) {
          colspan = spans.colspan - i + spans.cell;
          spanRow = spans.row;
        }

        if (spanRow < row) {
          continue;
        }

        // Do not render cells outside of the viewport.
        assert(Math.min(ii, i + colspan) === i + colspan);
        if (columnPosLeft[i + colspan] > range.leftPx) {
          if (columnPosLeft[i] >= range.rightPx) {
            // All columns to the right are outside the range.
            break;
          }

          assert(rowsCache[row]);
          assert(!rowsCache[row].cellNodesByColumnIdx[i]);

          // look up by id, then index
          columnData = rowMetadata && rowMetadata.columns && (rowMetadata.columns[m.id] || rowMetadata.columns[i]);
          // I/F: function appendCellHtml(stringArray, row, cell, rowMetadata, columnMetadata, rowDataItem)
          appendCellHtml(stringArray, row, i, rowMetadata, columnData, d);
        }
      }

      if (rowMetadata && rowMetadata.appendHtml) {
        stringArray.push(rowMetadata.appendHtml);
      }

      stringArray.push("</div>");
    }

    // row, cell: row and column index
    // rowMetadata: ... 
    // columnMetadata: ...
    // rowDataItem: grid data for row
    function mkCellHtml(row, cell, rowMetadata, columnMetadata, rowDataItem) {
      var m = columns[cell];
      assert(m);
      var colspan = 1;
      var rowspan = 1;
      var spans = getSpans(row, cell);
      assert(spans ? spans.colspan >= 1 : true);
      if (spans) {
        assert(row === spans.row);
        assert(cell === spans.cell);
        rowspan = spans.rowspan - row + spans.row;
        colspan = spans.colspan - cell + spans.cell;
      }
      assert(colspan >= 1);
      assert(rowspan >= 1);
      assert(Math.min(columns.length - 1, cell + colspan - 1) === cell + colspan - 1);
      var cellStyles = [];
      var cellCss = ["slick-cell", "l" + cell, "r" + (cell + colspan - 1)];
      if (m.cssClass) {
        cellCss.push(m.cssClass);
      }
      if (colspan > 1) {
        cellCss.push("colspan");
        cellCss.push("colspan" + colspan);
      }
      if (rowspan > 1) {
        cellCss.push("rowspan");
        cellCss.push("rowspan" + rowspan);
      }
      if (columnMetadata && columnMetadata.cssClass) {
        cellCss.push(columnMetadata.cssClass);
      }
      if (columnMetadata && columnMetadata.transparent) {
        cellCss.push("slick-transparent");
      }
      if (row === activeRow && cell === activeCell) {
        cellCss.push("active");
      }

      appendCellCssStylesToArray(cellCss, cellCssClasses, row, cell);

      var cellHeight = getCellHeight(row, rowspan);
      if (cellHeight !== options.rowHeight) {
        cellStyles.push("height:" + cellHeight + "px");
      }

      // if there is a corresponding row (if not, this is the Add New row or this data hasn't been loaded yet)
      var info = __extend({}, options.formatterOptions, m.formatterOptions, {
        cellCss: cellCss,
        cellStyles: cellStyles,
        html: "",
        attributes: {
          // Make every cell keyboard-focusable as per W3C spec ( https://html.spec.whatwg.org/#focus-management-apis ); 
          // without us setting a valid tabindex DOM node attribute any `takeFocus=true` config option for
          // `setActiveCell()` et al will fail to deliver in Chrome 38.x and upwards, at least, as calling `.focus()`
          // on a node which doesn't have this apparently keeps the focus (`document.activeElement`) stuck at BODY
          // level :-(  -- added assertions elsewhere in the code to catch this problem.
          tabindex: 0    
        },
        colspan: colspan,
        rowspan: rowspan,
        cellHeight: cellHeight,
        rowMetadata: rowMetadata,
        columnMetadata: columnMetadata
      });
      if (rowDataItem) {
        var value = getDataItemValueForColumn(rowDataItem, m, rowMetadata, columnMetadata);
        // allow the formatter to edit the outer cell's DIV CSS as well.
        // 
        // I/F: function formatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo)
        info.html = getFormatter(row, cell)(row, cell, value, m, rowDataItem, info);
      }
      return info;
    }

    function patchupCellAttributes(metaData, info, role, ariaRefID) {
      assert(metaData);
      assert(info);
      assert(role);
      metaData.role = role;
      // backwards compatible: use .toolTip when the corresponding DOM attribute isn't set yet
      if (info.toolTip && metaData.title === undefined) {
        metaData.title = metaData["data-title"] = info.toolTip;
      }
      assert(!metaData.style);
      if (info.cellStyles && info.cellStyles.length) {
        metaData.style = info.cellStyles.join("; ") + ";";
      } else if (info.rowStyles && info.rowStyles.length) {
        metaData.style = info.rowStyles.join("; ") + ";";
      }

      assert(!metaData.class);
      if (info.cellCss && info.cellCss.length) {
        metaData.class = info.cellCss.join(" ");
      } else if (info.rowCss && info.rowCss.length) {
        metaData.class = info.rowCss.join(" ");
      }

      if (info.attributes.tabindex != null) {
        metaData.tabindex = info.attributes.tabindex; 
      }

      if (ariaRefID) {
        metaData["aria-describedby"] = ariaRefID;
      }
    }

    function appendCellHtml(stringArray, row, cell, rowMetadata, columnMetadata, rowDataItem) {
      assert(row >= 0);
      assert(cell >= 0);
      var m = columns[cell];
      assert(m);
      // I/F: function mkCellHtml(row, cell, rowMetadata, columnMetadata, rowDataItem)
      var info = mkCellHtml(row, cell, rowMetadata, columnMetadata, rowDataItem);
      
      stringArray.push("<div");

      var metaData = getAllCustomMetadata(null, columnMetadata, info) || {};
      patchupCellAttributes(metaData, info, "gridcell", mkSaneId(m, cell, row));
      appendMetadataAttributes(stringArray, row, cell, metaData, m, rowDataItem, info);

      stringArray.push(">");

      stringArray.push(info.html);

      stringArray.push("</div>");

      rowsCache[row].cellRenderQueue.push(cell);
    }

    function appendMetadataAttributes(stringArray, row, cell, data, columnDef, rowDataItem, cellMetaInfo) {
      if (data) {
        for (var attr in data) {
          assert(data.hasOwnProperty(attr));
          // I/F: function formatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo)
          stringArray.push(" " + attr + "='" + processHtmlEntities.encode(data[attr]) + "'");
        }
      }
    }

    function updateElementHtml($el, info) {
      assert(info);
      var metaData = info.attributes;
      assert(metaData);
      if (info.toolTip && metaData.title === undefined) {
        metaData.title = metaData["data-title"] = info.toolTip;
      }
      assert(!metaData.style);
      if (info.cellStyles && info.cellStyles.length) {
        metaData.style = info.cellStyles.join("; ") + ";";
      } else if (info.rowStyles && info.rowStyles.length) {
        metaData.style = info.rowStyles.join("; ") + ";";
      } else {
        metaData.style = null;
      }
      assert(!metaData.class);
      if (info.cellCss && info.cellCss.length) {
        metaData.class = info.cellCss.join(" ");
      } else if (info.rowCss && info.rowCss.length) {
        metaData.class = info.rowCss.join(" ");
      } else {
        metaData.class = null;
      }

      // apply the new attributes:
      for (var attr in metaData) {
        assert(metaData.hasOwnProperty(attr));
        var val = metaData[attr];
        $el.attr(attr, val);
      }
      if (info.html != null) {
        $el.html(info.html);
      }
    }

    function cleanUpRows(rangeToKeep) {
      assert(cellSpans.length <= getDataLengthIncludingAddNew());
      var deletedRowCount = 0;

      // Pull up the lower bound while we're at it.
      for (var row = 0, endrow = rowsCache.length; row < endrow; row++) {
        if (rowsCache[row]) {
          break;
        }
      }
      //assert(row === rowsCacheStartIndex);
      assert(rowsCache[row] ? row >= rowsCacheStartIndex : true);
      if (!rowsCache[row]) {
        // rowsCache turns out to be completely empty!
        rowsCacheStartIndex = MAX_INT;  
        rowsCache = [];
        endrow = 0;  
      } else {
        rowsCacheStartIndex = row;
      }

      assert(endrow === rowsCache.length);
      for (row = rowsCacheStartIndex; row < endrow; row++) {
        var cacheEntry = rowsCache[row];
        // flush any pending row render queue to cache first:
        if (cacheEntry && cacheEntry.cellRenderQueue.length) {
          assert(0, "should not be necessary any more");
          ensureCellNodesInRowsCache(row);
        }
        if (row !== activeRow) {
          if (row < rangeToKeep.top) {
            // do not remove rows with rowspanned cells overlapping rangeToKeep
            if (cellSpans[row] && row + cellSpans[row].maxRowSpan >= rangeToKeep.top) {
              if (cacheEntry) {
                cleanUpCells(rangeToKeep, row);
              }
              continue;
            }
          } else if (row < rangeToKeep.bottom) {
            if (cacheEntry) {
              cleanUpCells(rangeToKeep, row);
            }
            continue;
          }
          if (cacheEntry) {
            assert(row !== activeRow);
            removeRowFromCache(row);
            deletedRowCount++;
          }
        } else {
          if (cacheEntry) {
            cleanUpCells(rangeToKeep, row);
          }
        }
      }
      // and clip off the tail end of the cache index array itself:
      assert(endrow === rowsCache.length);
      for (row = rowsCacheStartIndex; row <= endrow; endrow--) {
        if (rowsCache[endrow]) {
          endrow++;
          break;
        }
      }
      rowsCache.length = endrow;
      return deletedRowCount;
    }

    function updateAllDirtyCells(rangeToUpdate, checkIfMustAbort) {
      var dataLength = getDataLength();

      // Do not update rows outside the specified range; when there's cells which are 
      // col/rowspanning and overlapping the specified range, than updateCell itself
      // will pick them up; after all, all the grid coordinates (cells) these 
      // row/colspanning nodes overlap are each flagged as "dirty" to ensure that we catch
      // them during this update process. 
      for (var row = Math.max(rowsCacheStartIndex, rangeToUpdate.top), endrow = Math.min(rowsCache.length - 1, rangeToUpdate.bottom - 1); row <= endrow; row++) {
        var cacheEntry = rowsCache[row];
        if (cacheEntry) {
          // flush any pending row render queue to cache first:
          if (cacheEntry.cellRenderQueue.length) {
            assert(0, "should not be necessary any more");
            ensureCellNodesInRowsCache(row);
          }
          var cellCache = cacheEntry.cellNodesByColumnIdx;
          var dirtyFlags = cacheEntry.dirtyCellNodes;
          // Before we update any dirty cells in the row, update the row itself!
          if (cacheEntry.isDirty) {
            updateRowInternal(row, dataLength);
          }
          var colspan;
          for (var cell = cacheEntry.cellNodesByColumnStart, len = Math.min(cellCache.length, columns.length); cell < len; cell += colspan) {
            colspan = 1;
            var spans = getSpans(row, cell);
            var spanRow = row;
            if (spans) {
              assert(row >= spans.row);
              assert(cell >= spans.cell);
              cell = spans.cell;
              spanRow = spans.row;
              colspan = spans.colspan;
            }
            if (columnPosLeft[cell + colspan] > rangeToUpdate.leftPx) {
              if (columnPosLeft[cell] >= rangeToUpdate.rightPx) {
                // All columns to the right are outside the range.
                break;
              }
            }
            if (spanRow === row && cellCache[cell] && dirtyFlags[cell]) {
              updateCellInternal(row, cell, cacheEntry, cellCache[cell]);
              assert(!dirtyFlags[cell]);
            } else if (spanRow < row) {
              // We're looking at a rowspanning cell which starts at a row above us 
              var cacheEntry2 = rowsCache[spanRow];
              if (cacheEntry2) {
                // flush any pending row render queue to cache first:
                if (cacheEntry2.cellRenderQueue.length) {
                  assert(0, "should not be necessary any more");
                  ensureCellNodesInRowsCache(spanRow);
                }
                var cellCache2 = cacheEntry2.cellNodesByColumnIdx;
                var dirtyFlags2 = cacheEntry2.dirtyCellNodes;

                if (cellCache2[cell] && dirtyFlags2[cell]) {
                  // Before we update any dirty cells in the row, update the row itself!
                  if (cacheEntry2.isDirty) {
                    updateRowInternal(spanRow, dataLength);
                  }

                  updateCellInternal(spanRow, cell, cacheEntry2, cellCache2[cell]);
                  assert(!dirtyFlags2[cell]);
                }
              }
            }
          }

          // Kill all cells which are still around after the column count has changed:
          for (var cellToRemove = cellCache.length - 1; cellToRemove >= columns.length; cellToRemove--) {
            var node = cellCache[cellToRemove];
            if (node) {
              if (options.cellsMayHaveJQueryHandlers) {
                $(node).remove();      // remove children from jQuery cache: fix mleibman/SlickGrid#855 :: Memory leaks when cell contains jQuery controls
              } else {
                cacheEntry.rowNode.removeChild(node);
              }
              delete cellCache[cellToRemove];

              if (dirtyFlags[cellToRemove]) {
                dirtyFlags[cellToRemove] = false;
                cacheEntry.isDirty--;
                assert(cacheEntry.isDirty >= 0);
              }
            }
          }

          // We cannot yet flag the row as updated completely, as we only updated the *visible* cells.
          assert(cacheEntry.isDirty >= 0);
        }

        if (checkIfMustAbort && checkIfMustAbort()) {
          break;
        }
      }
    }


    function invalidate() {
      invalidateAllRows();
      updateRowCount();
      trigger(self.onInvalidate);
      render();
    }

    // This removes rows from cache. Would be needed if we were changing rows.
    function invalidateAllRows() {
      if (currentEditor) {
        assert(getEditorLock().isActive());

        makeActiveCellNormal();
        
        assert(!currentEditor);
        assert(!getEditorLock().isActive());
      }

      // for (var row = rowsCacheStartIndex, endrow = rowsCache.length; row < endrow; row++) {
      //   if (rowsCache[row]) {
      //     removeRowFromCache(row);
      //   }
      // }
      // rowsCache = [];
      
      // flag all cached cells as dirty:
      for (var row = rowsCacheStartIndex, len = rowsCache.length; row < len; row++) {
        var cacheEntry = rowsCache[row];
        if (!cacheEntry) {
          continue;
        }
        var cellNodes = cacheEntry.cellNodesByColumnIdx;
        var dirtyFlaggingArray = cacheEntry.dirtyCellNodes;
        for (var cell = cacheEntry.cellNodesByColumnStart, colCount = cellNodes.length; cell < colCount; cell++) {
          if (cellNodes[cell] && !dirtyFlaggingArray[cell]) {
            dirtyFlaggingArray[cell] = true;
            assert(cacheEntry.isDirty >= 0);
            cacheEntry.isDirty++;
          }
        }
      }

      rowPositionCache = [];
      rowHeightCache = [];
      // rowsCacheStartIndex = MAX_INT;
    }

    function removeRowFromCache(row) {
      var cacheEntry = rowsCache[row];
      assert(cacheEntry);
      assert(cacheEntry.rowNode);

      if (row === activeRow && elementHasFocus(cacheEntry.rowNode)) {
        focusMustBeReacquired = {
          row: activeRow,
          cell: activeCell
        };
        // As the active cell is about to loose focus, we (temporarily) switch focus to one of the sinks
        // so that the node removal from the DOM does not drop focus, which would consequently 
        // loose us keyboard events, at least for the (very) short time period between DOM
        // cell removal and re-render. That would cause symptoms of "erratic keyboard behaviour"
        // and we cannot have that!

        if (options.debug & DEBUG_FOCUS) { console.log("focus fixup exec (cache remove row) START: ", document.activeElement); }
        movingFocusLock++;
        // We MAY see a sequence of focusout+focusin, where by the time focusin fires, document.activeElement is BODY.
        // We MAY also see only a focusin, in which case we are to provide the original focused node.
        movingFocusLockData[movingFocusLock - 1] = {
          newNode: $focusSink[0],
          oldNode: activeCellNode
        };
        $focusSink[0].focus();
        assert(document.activeElement === $focusSink[0]);
        movingFocusLock--;
        if (!movingFocusLock) {
          movingFocusLockData = [];
        }
        if (options.debug & DEBUG_FOCUS) { console.log("focus fixup exec (cache remove row) END: ", document.activeElement); }
      }

      if (rowNodeFromLastMouseWheelEvent === cacheEntry.rowNode) {
        cacheEntry.rowNode.style.display = "none";
        zombieRowNodeFromLastMouseWheelEvent = rowNodeFromLastMouseWheelEvent;
        zombieRowCacheFromLastMouseWheelEvent = cacheEntry;
        zombieRowPostProcessedFromLastMouseWheelEvent = postProcessedRows[row];
        // ignore post processing cleanup in this case - it will be dealt with later
      } else {
        if (options.cellsMayHaveJQueryHandlers) {
          if (options.enableAsyncPostRenderCleanup && postProcessedRows[row]) {
            queuePostProcessedRowForCleanup(cacheEntry, postProcessedRows[row], row);
          } else {
            $(cacheEntry.rowNode).remove();      // remove children from jQuery cache: fix mleibman/SlickGrid#855 :: Memory leaks when cell contains jQuery controls
          }
        } else {
          $canvas[0].removeChild(cacheEntry.rowNode);
        }
        // cacheEntry.rowNode.classList.add("destroyed");
        // deletedRowsCache[row] = rowsCache[row];
        // if (deletedRowsCacheStartIndex > row) {
        //   deletedRowsCacheStartIndex = row;
        // }
      }

      rowsCache[row] = undefined;
      postProcessedRows[row] = undefined;
      if (rowsCacheStartIndex === row) {
        rowsCacheStartIndex++;
      }
      renderedRows--;
      counter_rows_removed++;
    }

    function invalidateRows(rows) {
      var i, rl, row, endrow, c, r, span, rowspan, colspan, cacheEntry, cellNodes, dirtyFlaggingArray, cell, colCount;

      if (!rows || !rows.length) {
        return;
      }
      rows.sort(function rowSortComparer_f(a, b) { 
        return a - b; 
      });
      vScrollDir = 0;
      var dataLength = getDataLength();
      var columnCount = columns.length;
      var invalidateTopFrom = dataLength;
      var invalidateFrom = dataLength;
      var invalidateTo = -1;
      // var intersectingCells = [];
      // var intersectingCellsRowStartIndex = MAX_INT;
      // var intersectingCellsColStartIndex = MAX_INT;
      for (i = 0, rl = rows.length; i < rl; i++) {
        row = rows[i];
        if (currentEditor && activeRow === row) {
          assert(getEditorLock().isActive());

          makeActiveCellNormal();
          
          assert(!currentEditor);
          assert(!getEditorLock().isActive());
        }
        // if (rowsCache[row]) {
        //   removeRowFromCache(row);
        // }
        
        // flag all cached cells as dirty:
        cacheEntry = rowsCache[row];
        if (cacheEntry) {
          cellNodes = cacheEntry.cellNodesByColumnIdx;
          dirtyFlaggingArray = cacheEntry.dirtyCellNodes;
          for (cell = cacheEntry.cellNodesByColumnStart, colCount = cellNodes.length; cell < colCount; cell++) {
            if (cellNodes[cell] && !dirtyFlaggingArray[cell]) {
              dirtyFlaggingArray[cell] = true;
              assert(cacheEntry.isDirty >= 0);
              cacheEntry.isDirty++;
            }
          }
        }
        
        var spanRow = cellSpans[row];
        var rowMetadata = data.getItemMetadata && data.getItemMetadata(row, false);
        // if the row height changes, all its successors should invalidate their style.top positions
        var newRowHeight = (rowMetadata && rowMetadata.height) || options.rowHeight;
        if (newRowHeight !== getRowHeight(row)) {
          rowPositionCache[row] = undefined;
          rowHeightCache[row] = newRowHeight;
          if (row < invalidateTopFrom) {
            invalidateTopFrom = row + 1;
            invalidateTo = dataLength - 1;
          }
        }

        if (spanRow) {
          // invalidate (possibly now old = removed) rowspan intersecting cells
          for (c = 0; c < columnCount; c += colspan) {
            colspan = 1;
            span = spanRow[c];
            if (span) {
              colspan = span.colspan;
              r = span.row;
              if (r !== row) {
                // (intersectingCells[r] || (intersectingCells[r] = []))[span.cell] = true;
                // intersectingCellsRowStartIndex = Math.min(intersectingCellsRowStartIndex, r);
                // intersectingCellsColStartIndex = Math.min(intersectingCellsColStartIndex, span.cell);
                invalidateCellSpan(span);
              }
            }
          }

          // Blow away any cellSpans for this invalidated row: if they should remain or change,
          // then they will be recalculated next.
          // 
          // However, we MUST invalidate all cells which belonged to those old spans, as we just did.
          spanRow = cellSpans[row] = undefined;
        }

        // check changes in row/colspans
        if (rowMetadata) {
          for (c = 0; c < columnCount; c += colspan) {
            var columnMetadata = rowMetadata.columns && (rowMetadata.columns[columns[c].id] || rowMetadata.columns[c]);
            colspan = 1;
            if (columnMetadata) {
              rowspan = columnMetadata.rowspan || 1;
              colspan = columnMetadata.colspan || 1;
              if (rowspan > dataLength - row) {
                rowspan = dataLength - row;
              }
              if (colspan === "*") {
                colspan = columnCount - c;
              }
              span = spanRow && spanRow[c];
              var oldRowspan = (span && span.rowspan) || 1;
              var oldColspan = (span && span.colspan) || 1;
              if (oldRowspan !== rowspan || oldColspan !== colspan) {
                // if spans change, fix pointers to span head cell
                span = (rowspan > 1 || colspan > 1) ? {
                  row: row, 
                  cell: c, 
                  rowspan: rowspan, 
                  colspan: colspan
                } : undefined;
                for (var rs = row, rsu = row + Math.max(rowspan, oldRowspan); rs < rsu; rs++) {
                  var maxRowSpan = rowspan + row - rs;
                  var cellSpanRow = cellSpans[rs];
                  if (cellSpanRow) {
                    if (maxRowSpan > cellSpanRow.maxRowSpan) {
                      cellSpanRow.maxRowSpan = maxRowSpan;
                    }
                  } else {
                    cellSpanRow = cellSpans[rs] = {
                      maxRowSpan: maxRowSpan
                    };
                  }
                  for (var cs = c, csu = c + Math.max(colspan, oldColspan); cs < csu; cs++) {
                    if (!span || rs >= row + rowspan || cs >= c + colspan) {
                      cellSpans[rs][cs] = undefined;
                    } else {
                      cellSpans[rs][cs] = span;
                    }
                  }
                }
                // adjust invalidate range
                invalidateFrom = Math.min(invalidateFrom, row);
                invalidateTo = Math.max(invalidateTo, row + oldRowspan - 1, row + rowspan - 1);
              }
            }
          }
        }
      }

      for (row = Math.min(invalidateFrom, invalidateTopFrom); row <= invalidateTo; row++) {
        if (row >= invalidateTopFrom) {
          rowPositionCache[row] = undefined;
        }
        if (currentEditor && activeRow === row) {
          assert(getEditorLock().isActive());

          makeActiveCellNormal();

          assert(!currentEditor);
          assert(!getEditorLock().isActive());
        }

        // if (rowsCache[row]) {
        //   removeRowFromCache(row);
        // }
        
        // flag all cached cells as dirty:
        cacheEntry = rowsCache[row];
        if (cacheEntry) {
          cellNodes = cacheEntry.cellNodesByColumnIdx;
          dirtyFlaggingArray = cacheEntry.dirtyCellNodes;
          for (cell = cacheEntry.cellNodesByColumnStart, colCount = cellNodes.length; cell < colCount; cell++) {
            if (cellNodes[cell] && !dirtyFlaggingArray[cell]) {
              dirtyFlaggingArray[cell] = true;
              assert(cacheEntry.isDirty >= 0);
              cacheEntry.isDirty++;
            }
          }
        }
      }
    }

    function invalidateRow(row) {
      invalidateRows([row]);
    }

    function invalidateCellSpan(span) {
      assert(span);
      var row = span.row;
      var cell = span.cell;
      var endRow = row + span.rowspan;
      var endCell = cell + span.colspan;
      if (currentEditor && activeRow >= row && activeRow < endRow && activeCell >= cell && activeCell < endCell) {
        assert(getEditorLock().isActive());

        makeActiveCellNormal();

        assert(!currentEditor);
        assert(!getEditorLock().isActive());
      }

      for (var r = row; r < endRow; r++) {
        var cacheEntry = rowsCache[r];
        if (cacheEntry) {
          var cellNodes = cacheEntry.cellNodesByColumnIdx;
          var dirtyFlaggingArray = cacheEntry.dirtyCellNodes;
          for (var c = cell; c < endCell; c++) {
            if (cellNodes[c] && !dirtyFlaggingArray[c]) {
              dirtyFlaggingArray[c] = true;
              assert(cacheEntry.isDirty >= 0);
              cacheEntry.isDirty++;
            }
          }
        }
      }
    }

    // Invalidate the entire row/colspan area covered by the cell
    function invalidateCell(row, cell) {
      // Get the old row/colspan for this cell:
      var spanRow = cellSpans[row];
      var spanCell = spanRow && spanRow[cell];
      var oldRowspan = (spanCell && spanCell.rowspan) || 1;
      var oldColspan = (spanCell && spanCell.colspan) || 1;

      // Get the new row/colspan for this cell:
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row, false);
      var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[columns[cell].id] || rowMetadata.columns[cell]);
      var rowspan = (columnMetadata && columnMetadata.rowspan) || 1;
      var colspan = (columnMetadata && columnMetadata.colspan) || 1;

      var span = {
        row: row, 
        cell: cell, 
        rowspan: Math.max(rowspan, oldRowspan), 
        colspan: Math.max(colspan, oldColspan)
      };
      invalidateCellSpan(span);
    }


    function invalidateColumns(cols) {
      var r, c, i, lr, lc, col, spans, rowspan, colspan, rr, cc, node;
      if (!cols || !cols.length) {
        return;
      }
      cols.sort(function columnSortComparer_f(a, b) { 
        return a - b; 
      });
      // flag all cached cells as dirty:
      var colcnt = cols.length;
      for (r = rowsCacheStartIndex, lr = rowsCache.length; r < lr; r++) {
        var cacheEntry = rowsCache[r];
        if (cacheEntry) {
          var cellNodes = cacheEntry.cellNodesByColumnIdx;
          var dirtyFlaggingArray = cacheEntry.dirtyCellNodes;
          for (i = 0; i < colcnt; i++) {
            c = cols[i];
            node = cellNodes[c];
            if (node) {
              if (!dirtyFlaggingArray[c]) {
                if (currentEditor && activeRow === r && activeCell === c) {
                  assert(getEditorLock().isActive());

                  makeActiveCellNormal();

                  assert(!currentEditor);
                  assert(!getEditorLock().isActive());
                }
          
                dirtyFlaggingArray[c] = true;
                assert(cacheEntry.isDirty >= 0);
                cacheEntry.isDirty++;
              }
            } else {
              // When there's no node at the given coordinate, we MAY be looking at a row/colspanning node.
              // (Otherwise, we're just looking at a node which hasn't been cached/rendered yet...)
              spans = getSpans(r, c);
              if (spans) {
                invalidateCellSpan(spans);
              }
            }
          }
        }
      }
    }

    function invalidateColumn(cell) {
      invalidateColumns([cell]);
    }

    function updateCell(row, cell) {
      var cellNode = getCellNode(row, cell);
      if (!cellNode) {
        return;
      }

      var cacheEntry = rowsCache[row];
      assert(cacheEntry);
      assert(cacheEntry.cellNodesByColumnIdx[cell]);

      // if the cell has other coordinates because of row/cell span, update that cell (which will invalidate this cellNode)
      var rowspan = 1;
      var spans = getSpans(row, cell);
      assert(spans ? spans.colspan >= 1 : true);
      if (spans) {
        rowspan = spans.rowspan;

        if (spans.row !== row || spans.cell !== cell) {
          //updateCellInternal(spans.row, spans.cell, cacheEntry, cellNode);
          row = spans.row;
          cell = spans.cell;
          cellNode = getCellNode(row, cell);
          if (!cellNode) {
            return;
          }

          cacheEntry = rowsCache[row];
          assert(cacheEntry);
          assert(cacheEntry.cellNodesByColumnIdx[cell]);
        }
      }

      updateCellInternal(row, cell, cacheEntry, cellNode);
    }

    function updateCellInternal(row, cell, cacheEntry, cellNode) {
      var m = columns[cell],
          d = getDataItem(row);
      assert(m);
      assert(cacheEntry === rowsCache[row]);
      assert(cacheEntry);
      assert(cacheEntry.cellNodesByColumnIdx[cell]);

      // if the cell has other coordinates because of row/cell span, update that cell (which will invalidate this cellNode)
      var rowspan = 1;
      var spans = getSpans(row, cell);
      assert(spans ? spans.colspan >= 1 : true);
      if (spans) {
        rowspan = spans.rowspan;

        // All DOM nodes which are now covered by this row/colspan are nuked by cleanUpRows()/cleanUpCells() later on!

        assert(spans.row === row);
        assert(spans.cell === cell);
      }

      if (cacheEntry.dirtyCellNodes[cell]) {
        cacheEntry.dirtyCellNodes[cell] = false;
        cacheEntry.isDirty--;
        assert(cacheEntry.isDirty >= 0);
      }

      if (currentEditor && activeRow === row && activeCell === cell && d) {
        assert(getEditorLock().isActive());
        currentEditor.loadValue(d);
      } else {
        var rowMetadata = data.getItemMetadata && data.getItemMetadata(row, cell);
        // look up by id, then index
        var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[m.id] || rowMetadata.columns[cell]);

        var cellHeight = getCellHeight(row, rowspan);
        if (cellHeight !== options.rowHeight) {
          cellNode.style.height = cellHeight + "px";
        } else if (cellNode.style.height) {
          cellNode.style.height = "";
        }

        // I/F: function mkCellHtml(row, cell, rowMetadata, columnMetadata, rowDataItem)
        var info = mkCellHtml(row, cell, rowMetadata, columnMetadata, d);
        var $el = $(cellNode);
        assert(info.html != null);
        updateElementHtml($el, info);
        invalidatePostProcessingResults(row, cell);
      }
    }

    function updateRow(row) {
      var node;
      var cacheEntry = rowsCache[row];
      if (!cacheEntry) {
        return;
      }

      ensureCellNodesInRowsCache(row);

      var dataLength = getDataLength();
      updateRowInternal(row, dataLength);

      var cellCache = cacheEntry.cellNodesByColumnIdx;
      var dirtyFlags = cacheEntry.dirtyCellNodes;
      for (var columnIdx = cacheEntry.cellNodesByColumnStart, end = Math.min(cellCache.length, columns.length); columnIdx < end; columnIdx++) {
        node = cellCache[columnIdx];
        if (!node) {
          continue;
        }

        updateCellInternal(row, columnIdx, cacheEntry, node);
      }

      // Kill all cells which are still around after the column count has changed:
      for (var cellToRemove = cellCache.length - 1; cellToRemove >= columns.length; cellToRemove--) {
        node = cellCache[cellToRemove];
        if (node) {
          if (options.cellsMayHaveJQueryHandlers) {
            $(node).remove();      // remove children from jQuery cache: fix mleibman/SlickGrid#855 :: Memory leaks when cell contains jQuery controls
          } else {
            cacheEntry.rowNode.removeChild(node);
          }
          delete cellCache[cellToRemove];

          if (dirtyFlags[cellToRemove]) {
            dirtyFlags[cellToRemove] = false;
            cacheEntry.isDirty--;
            assert(cacheEntry.isDirty >= 0);
          }
        }
      }

      // flag the row as updated completely:
      assert(cacheEntry.isDirty === 0);
      cacheEntry.dirtyCellNodes = [];
      cacheEntry.isDirty = 0;

      invalidatePostProcessingResults(row, null);
    }

    function updateRowInternal(row, dataLength) {
      var cacheEntry = rowsCache[row];
      assert(cacheEntry);
      assert(cacheEntry.isDirty > 0);
      assert(cacheEntry.rowNode);

      var info = mkRowHtml(row, dataLength);
      assert(info.html == null);
      updateElementHtml($(cacheEntry.rowNode), info);
    }

    function getCellHeight(row, rowspan) {
      var rowSpanBottomIdx = row + rowspan - 1;
      var cellHeight = getRowBottom(rowSpanBottomIdx) - getRowTop(row);
      return cellHeight;
    }

    function getContainerWidth() {
      var rv = 0;
      if ($container.is(":visible")) {
        rv = parseFloat($.css($container[0], "width", true /* jQuery: Make numeric if forced or a qualifier was provided and val looks numeric */ ));
        assert(rv === $container.width());
      } else {
        if (options.debug & DEBUG_MISC) { console.warn("What's the width when this shit is hidden? It IS unpredictable!   ", $.css($container[0], "width", true)); }
      }
      return rv;
    }

    function getContainerHeight() {
      var rv = 0;
      if ($container.is(":visible")) {
        rv = parseFloat($.css($container[0], "height", true /* jQuery: Make numeric if forced or a qualifier was provided and val looks numeric */ ));
        assert(rv === $container.height());
      } else {
        if (options.debug & DEBUG_MISC) { console.warn("What's the height when this shit is hidden? It IS unpredictable!   ", $.css($container[0], "height", true)); }
      }
      return rv;
    }

    function getViewportHeight() {
      var rv = getContainerHeight();
      if (rv > 0) {
        var hh = parseFloat($.css($container[0], "paddingTop", true)) +
                 parseFloat($.css($container[0], "paddingBottom", true)) +
                 parseFloat($.css($headerScroller[0], "height")) + 
                 getVBoxDelta($headerScroller) +
                 (options.showTopPanel ? options.topPanelHeight + getVBoxDelta($topPanelScroller) : 0) +
                 (options.showFooterRow ? options.footerRowHeight + getVBoxDelta($footerRowScroller) : 0) +
                 (options.showHeaderRow ? options.headerRowHeight + getVBoxDelta($headerRowScroller) : 0);
        assert(hh > 0);
        rv -= hh;
      }
      return Math.max(0, rv);
    }

    function getViewportWidth() {
      var rv = getContainerWidth();
      return rv;
    }

    /**
     * @api
     * 
     * Returns the size of the content area
     */
    function getContentSize() {
      var canvasWidth = $canvas.outerWidth(),
          canvasHeight = $canvas.height(),
          hasVScroll = canvasHeight > $viewport.height(),
          contentWidth = canvasWidth + (hasVScroll ? scrollbarDimensions.width : 0),
          hasHScroll = contentWidth > $viewport.outerWidth(),
          contentHeight = canvasHeight + (hasHScroll ? scrollbarDimensions.height : 0);
      return { 
        width: contentWidth, 
        height: contentHeight 
      };
    }

    /**
     * @api
     * 
     * Returns the size of the visible area, i.e. between the scroll bars
     */
    function getVisibleSize() {
      var width = $viewport.outerWidth(),
          height = $viewport.height(),
          hasHScroll = $canvas.outerWidth() > width - scrollbarDimensions.width,
          hasVScroll = $canvas.height() > height - scrollbarDimensions.height;
      width -= hasVScroll ? scrollbarDimensions.width : 0;
      height -= hasHScroll ? scrollbarDimensions.height : 0;
      return { 
        width: width, 
        height: height 
      };
    }

    // If you pass resizeOptions.width, the viewport width calculation can be skipped. 
    // This saves 15ms or so.
    function resizeCanvas(resizeOptions) {
      if (!initialized) { return; }

      var estimateH = MAX_INT;
      resizeOptions = resizeOptions || {};

      if (!resizeOptions.skipHeight) {
        if (options.autoHeight) {
          estimateH = getRowBottom(getDataLengthIncludingAddNew());
        } else {
          estimateH = getViewportHeight();
        }
        estimateH = Math.max(options.minHeight || 0, Math.min(options.maxHeight || MAX_INT, estimateH));
        var setHeight = (estimateH !== viewportH || options.minHeight === estimateH || options.maxHeight === estimateH);

        if (setHeight) {
          $viewport.height(estimateH);
          
          // Trouble is now we need to detect if we've been limited by any user styles on the *container*:
          var containerH = getContainerHeight();
          var actualViewportH = getViewportHeight();
          var viewportToContainerDeltaH = containerH - actualViewportH;

          if (viewportH !== actualViewportH) {
            // user CSS rules are apparently kicking in (min-height, max-height); compensate.
            viewportH = actualViewportH;
      
            $viewport.height(viewportH);
          }
        }
      }

      setViewportWidth(resizeOptions.width);

      //$viewport.css("overflow-y", (options.autoHeight && !clippedAutoSize) ? "auto" : "auto");

      if (options.forceFitColumns) {
        autosizeColumns();
      }

      //cleanUpAndRenderCells(getRenderedRange()); -- happens in render()
      updateRowCount();
      // Since the width has changed, force the render() to re-evaluate virtually rendered cells.
      lastRenderedScrollLeft = -1 - options.viewportChangedEventThreshold;
      if (handleScroll()) {
        render();
      }
    }

    // If you pass it a width, that width is used as the viewport width. 
    // If you do not, it is calculated as normal.
    //
    // This is more performant if the canvas size is changed externally: 
    // then the width is already known so we can pass it in instead of recalculating.
    function setViewportWidth(width) {
      viewportW = width || getViewportWidth();
    }

    function updateRowCount() {
      if (!initialized) { 
        return false; 
      }

      var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
      var numberOfRows = dataLengthIncludingAddNew +
          (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);
          
      // if the existing row position & width caches are too large, strip 'em down to the new size.
      if (rowPositionCache.length > numberOfRows + 1) {
        rowPositionCache.length = numberOfRows + 1;
      }
      if (rowHeightCache.length >= numberOfRows) {
        rowHeightCache.length = numberOfRows;
      }
      
      cacheRowPositions(numberOfRows);

      var oldViewportHasVScroll = viewportHasVScroll;
      viewportHasVScroll = (getRowBottom(numberOfRows - 1) > viewportH);

      makeActiveCellNormal();
      assert(!currentEditor);
      assert(!getEditorLock().isActive());

      // Kill the active cell when it sits in the row range which doesn't exist any more in the new data set.
      if (activeCellNode && activeRow >= dataLengthIncludingAddNew) {
        resetActiveCell();
      }

      // remove the rows that are now outside of the data range
      // this helps avoid redundant calls to .removeRow() when the size of the data decreased by thousands of rows
      for (var row = Math.max(rowsCacheStartIndex, dataLengthIncludingAddNew), endrow = rowsCache.length; row < endrow; row++) {
        if (rowsCache[row]) {
          removeRowFromCache(row);
        }
      }
      if (rowsCache.length > dataLengthIncludingAddNew) {
        assert(!rowsCache[dataLengthIncludingAddNew]);
        rowsCache.length = dataLengthIncludingAddNew;
      }

      if (cellSpans.length > dataLengthIncludingAddNew) {
        cellSpans.length = dataLengthIncludingAddNew;
      }

      // if (rowsCache.length > dataLengthIncludingAddNew) {
      //   rowsCache.length = dataLengthIncludingAddNew;
      // }

      var rowMax = getRowTop(dataLengthIncludingAddNew);
      var oldH = scrollableHeight;
      virtualTotalHeight = Math.max(rowMax, viewportH - scrollbarDimensions.height);
      if (virtualTotalHeight < maxSupportedCssHeight) {
        // just one page
        scrollableHeight = pageHeight = virtualTotalHeight;
        numberOfPages = 1;
        jumpinessCoefficient = 0;
      } else {
        // break into pages
        scrollableHeight = maxSupportedCssHeight;
        pageHeight = scrollableHeight / 100;
        numberOfPages = Math.floor(virtualTotalHeight / pageHeight);
        assert(numberOfPages > 1);
        jumpinessCoefficient = (virtualTotalHeight - scrollableHeight) / (numberOfPages - 1);
      }

      if (scrollableHeight !== oldH) {
        $canvas.css("height", scrollableHeight);
        scrollTop = $viewport[0].scrollTop;
      }

      var oldScrollTopInRange = (scrollTop + pageOffset <= virtualTotalHeight - viewportH);

      if (virtualTotalHeight === 0 || scrollTop === 0) {
        page = pageOffset = 0;
      } else if (oldScrollTopInRange) {
        // maintain virtual position
        scrollTo(scrollTop + pageOffset, null);
      } else {
        // scroll to bottom
        scrollTo(virtualTotalHeight - viewportH, null);
      }

      if (scrollableHeight !== oldH && options.autoHeight) {
        resizeCanvas();
      }

      if (options.forceFitColumns && oldViewportHasVScroll !== viewportHasVScroll) {
        autosizeColumns();
      }
      var rv = updateCanvasWidth();

      // @TO-BE-INSPECTED

      // vertical scrollbar could have been added
      // through update so call handleScroll() to
      // sync header scrolling
      handleScroll();

      // /@TO-BE-INSPECTED

      return rv;
    }

    /**
     * WARNING: the returned object `.bottom` attribute points at the first row which is guaranteed to be NOT visible.
     * This was done in the vanilla SlickGrid (the one which doesn't deliver fractional position info). 
     * It is in line with other range info objects which would list the bottom as "one beyond"
     * in order to simplify height calculations (`bottom - top` without the obligatory +1 correction) and looping
     * over the visible row range (`for row = rv.top; row < rv.bottom; row++`).
     * 
     * However, do note that the fractional info is about the (partially visible bottom) row `.bottomVisible`.
     */ 
    function getVisibleRange(viewportTop, viewportLeft, clipToValidRange) {
      if (viewportTop == null) {
        viewportTop = scrollTop;
      }
      if (viewportLeft == null) {
        viewportLeft = scrollLeft;
      }

      var top = getRowWithFractionFromPosition(viewportTop + pageOffset, clipToValidRange);
      var bottom = getRowWithFractionFromPosition(viewportTop + pageOffset + viewportH, clipToValidRange); // test at the first INvisible pixel

      // Use the `getColumnWithFractionFromPosition(...)` API to translate the left/right pixel
      // positions to column indices.
      // 
      // 
      //  
      // (which under the hood employs a fast binary search alike algorithm to find the left and right columns, using 
      // linear estimation to produce the split/probe point):
      // 
      // `getColumnWithFractionFromPosition(...)`
      //  
      return {
        top: top.position,                          // the first visible row
        bottom: bottom.position + 1,                // first row which is guaranteed to be NOT visible, not even partly
        bottomVisible: bottom.position,             // the last visible row
        bottomVisibleFraction: bottom.fraction,     // the vertical fraction of visibility for the last visible row
        topInvisibleFraction: top.fraction,         // the vertical fraction of *IN*visibility for the first visible row
        bottomVisibleHeight: bottom.height,         // the row height for the last visible row
        topInvisibleHeight: top.height,             // the row height for the first visible row
        topPx: viewportTop,
        bottomPx: viewportTop + viewportH,
        leftPx: viewportLeft,
        rightPx: viewportLeft + viewportW    // availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW
      };
    }

    function getRenderedRange(viewportTop, viewportLeft) {
      var visibleRange = getVisibleRange(viewportTop, viewportLeft);
      var minBuffer = options.minBufferSize;
      var buffer = Math.min(options.maxBufferSize, Math.max(minBuffer, visibleRange.bottom - visibleRange.top));

      var range = {
        top: visibleRange.top,                      // the first visible row
        bottom: visibleRange.bottom,                // first row which is guaranteed to be NOT visible, not even partly
        leftPx: visibleRange.leftPx,
        rightPx: visibleRange.rightPx
      };

      if (vScrollDir === -1) {
        range.top -= buffer;
        range.bottom += minBuffer;
      } else if (vScrollDir === 1) {
        range.top -= minBuffer;
        range.bottom += buffer;
      } else {
        range.top -= minBuffer;
        range.bottom += minBuffer;
      }

      range.top = Math.max(0, range.top);
      range.bottom = Math.min(getDataLengthIncludingAddNew(), range.bottom);

      range.leftPx -= viewportW;
      range.rightPx += viewportW;

      assert(canvasWidth != null);
      range.leftPx = Math.max(0, range.leftPx);
      range.rightPx = Math.min(canvasWidth, range.rightPx);

      return range;
    }

    // Return the range of rows which are currently (at least partly) cached:
    // these will be the rows range which must be invalidated if userland code
    // does something drastic (e.g. when changing the grouping of the data:
    // examples/optimizing-dataview)
    // 
    // Also return other internal caching datums which may be relevant for 
    // userland/support code, e.g. when collapsing/expanding grouped rows.
    // (See the grouping examples, for instance.) 
    function getCachedRowRangeInfo() {
      // Side Effect: Pull up the lower bound while we're at it.
      for (var row = rowsCacheStartIndex, endrow = rowsCache.length; row < endrow; row++) {
        if (rowsCache[row]) {
          break;
        }
      }
      //assert(row === rowsCacheStartIndex);
      assert(rowsCache[row] ? row >= rowsCacheStartIndex : true);
      if (!rowsCache[row]) {
        // rowsCache turns out to be completely empty!
        rowsCacheStartIndex = MAX_INT;
        rowsCache = [];
        endrow = 0;  
      } else {
        rowsCacheStartIndex = row;
      }

      // Side Effect: ... and clip off the tail end of the cache index array itself:
      assert(endrow === rowsCache.length);
      for (row = rowsCacheStartIndex; row < endrow; endrow--) {
        if (rowsCache[endrow]) {
          endrow++;
          break;
        }
      }
      rowsCache.length = endrow;

      // Next to reporting the top/bottom rows' cache datums, we also report top/bottom of 
      // the rowspan/colspan cache: userland may want us to clear that cache as well so we
      // should provide the proper hints to enable userland code to accomplish that!
      // (See the grouping examples for instance.)
      var spanBottom = cellSpans.length;
      for (var spanTop = 0; spanTop < spanBottom; spanTop++) {
        if (cellSpans[spanTop]) {
          break;
        }
      }

      return {
        top: rowsCacheStartIndex,                   // the first cached row
        bottom: endrow,                             // first row which is guaranteed to be NOT cached, not even partly

        spanCacheTop: spanTop,
        spanCacheBottom: spanBottom
      };
    }

    function ensureCellNodesInRowsCache(row) {
      var cacheEntry = rowsCache[row];
      if (cacheEntry) {
        assert(cacheEntry.rowNode);
        var minCachedCellNodeIndex = cacheEntry.cellNodesByColumnStart;
        if (cacheEntry.cellRenderQueue.length) {
          var lastChild = cacheEntry.rowNode.lastChild;
          while (cacheEntry.cellRenderQueue.length) {
            assert(lastChild.className.indexOf("slick-cell") >= 0);
            if (lastChild.className.indexOf("slick-cell") >= 0) {
              var columnIdx = cacheEntry.cellRenderQueue.pop();
              assert(!cacheEntry.cellNodesByColumnIdx[columnIdx]);
              cacheEntry.cellNodesByColumnIdx[columnIdx] = lastChild;
              minCachedCellNodeIndex = Math.min(minCachedCellNodeIndex, columnIdx);
            }
            lastChild = lastChild.previousSibling;
          }
          cacheEntry.cellNodesByColumnStart = minCachedCellNodeIndex;
        }
      }
    }

    function cleanUpCells(range, row) {
      //var totalCellsRemoved = 0;
      var cacheEntry = rowsCache[row];
      assert(cacheEntry);

      var activeSpans = getSpans(activeRow, activeCell);
      if (activeSpans) {
        assert(activeSpans.row === activeRow);
        assert(activeSpans.cell === activeCell);
      }

      // Remove cells outside the range.
      // 
      // Also remove the cells inside the range which are overlapped by other row/colspanning cells. 
      // (The latter situation occurs when one or more cells had their row/colspan changed recently.)
      var minCachedCellNodeIndex = cacheEntry.cellNodesByColumnStart;
      var cellCache = cacheEntry.cellNodesByColumnIdx;
      var dirtyFlags = cacheEntry.dirtyCellNodes;
      for (var columnIdx = minCachedCellNodeIndex, end = cellCache.length; columnIdx < end; columnIdx++) {
        var node = cellCache[columnIdx];
        if (!node) {
          continue;
        }

        var colspan = 1;
        var spans = getSpans(row, columnIdx);
        if (spans) {
          assert(row === spans.row);
          colspan = spans.colspan;
          if (columnIdx !== spans.cell) {
            // Remove the cells inside the range which are overlapped by other row/colspanning cells. 
            for (var c = spans.cell + 1, ec = spans.cell + spans.colspan; c < ec; c++) {
              var olNode = cellCache[c];
              if (!olNode) {
                continue;
              }
              // We NEVER nuke the 'active cell', even when it's a cell which is now overlapped by another cell: 
              // when this happens, the userland code which changed the row/colspans that did this must be allowed
              // to change the active cell at their own pace; until that time, you will be stuck with a
              // (temporarily) overlapped~illegal active cell DOM node.
              if (row !== activeRow || columnIdx !== activeCell) {
                if (dirtyFlags[c]) {
                  dirtyFlags[c] = false;
                  cacheEntry.isDirty--;
                  assert(cacheEntry.isDirty >= 0);
                }

                if (options.cellsMayHaveJQueryHandlers) {
                  $(olNode).remove();      // remove children from jQuery cache: fix mleibman/SlickGrid#855 :: Memory leaks when cell contains jQuery controls
                } else {
                  cacheEntry.rowNode.removeChild(olNode);
                }
                delete cellCache[c];
                if (postProcessedRows[row]) {
                  // array element delete vs. setting it to undefined (here: FALSE): http://jsperf.com/delete-vs-undefined-vs-null/19 
                  postProcessedRows[row][c] = false;
                }
                if (minCachedCellNodeIndex === c) {
                  minCachedCellNodeIndex++;
                }

                //totalCellsRemoved++;
              }
            }
            columnIdx = spans.cell + spans.colspan - 1;
            continue;
          }
        }
        assert(columnIdx < columns.length ? Math.min(columns.length, columnIdx + colspan) === columnIdx + colspan : true);
        if (columnIdx >= columns.length ||
            columnPosLeft[columnIdx] >= range.rightPx ||
            columnPosLeft[columnIdx + colspan] <= range.leftPx) {
          if (row !== activeRow || columnIdx !== activeCell) {
            if (dirtyFlags[columnIdx]) {
              dirtyFlags[columnIdx] = false;
              cacheEntry.isDirty--;
              assert(cacheEntry.isDirty >= 0);
            }

            if (options.cellsMayHaveJQueryHandlers) {
              $(node).remove();      // remove children from jQuery cache: fix mleibman/SlickGrid#855 :: Memory leaks when cell contains jQuery controls
            } else {
              cacheEntry.rowNode.removeChild(node);
            }
            delete cellCache[columnIdx];
            if (postProcessedRows[row]) {
              // array element delete vs. setting it to undefined (here: FALSE): http://jsperf.com/delete-vs-undefined-vs-null/19 
              postProcessedRows[row][columnIdx] = false;
            }
            if (minCachedCellNodeIndex === columnIdx) {
              minCachedCellNodeIndex++;
            }

            //totalCellsRemoved++;
          }
        }
      }

      cacheEntry.cellNodesByColumnStart = minCachedCellNodeIndex;
      //cacheEntry.deletedCellNodesByColumnStart = minCachedDeletedCellNodeIndex;
      
      //return totalCellsRemoved;
    }

    function cleanUpAndRenderCells(range, mandatoryRange, checkIfMustAbort) {
      var cacheEntry;
      var minCachedCellNodeIndex;
      var stringArray = [];
      var processedRows = [];
      var cellsAdded;
      //var totalCellsAdded = 0;
      var colspan;
      var columnData;
      var i, ii;
      var rowMetadata;
      var columnMetadata;
      var d;

      assert(range.bottom > range.top || (range.bottom === range.top && getDataLength() === 0));
      for (var row = range.top, btm = range.bottom; row < btm; row++) {
        cacheEntry = rowsCache[row];
        if (!cacheEntry) {
          continue;
        }

        if (cacheEntry.cellRenderQueue.length) {
          assert(0, "should not be necessary any more");
          ensureCellNodesInRowsCache(row);
          assert(cacheEntry.cellRenderQueue.length === 0);
        }

        // if (!mandatoryRange) {
        //   cleanUpCells(range, row);
        // }

        // Render missing cells.
        cellsAdded = 0;

        rowMetadata = data.getItemMetadata && data.getItemMetadata(row, false);

        d = getDataItem(row);

        // TODO:  shorten this loop (index? heuristics? binary search?)
        for (i = 0, ii = columns.length; i < ii; i += colspan) {
          // Cells to the right are outside the range.
          if (columnPosLeft[i] >= range.rightPx) {
            break;
          }

          colspan = 1;
          var spanRow = row;
          var spans = getSpans(row, i);
          if (spans) {
            assert(i === spans.cell);
            colspan = spans.colspan;
            spanRow = spans.row;
          }

          // Already rendered.
          if (cacheEntry.cellNodesByColumnIdx[i]) {
            continue;
          }

          if (spanRow !== row) {
            continue;
          }

          assert(Math.min(ii, i + colspan) === i + colspan);
          if (columnPosLeft[i + colspan] > range.leftPx) {
            // look up by id, then index
            columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[columns[i].id] || rowMetadata.columns[i]);
            // I/F: function appendCellHtml(stringArray, row, cell, rowMetadata, columnMetadata, rowDataItem)
            appendCellHtml(stringArray, row, i, rowMetadata, columnMetadata, d);
            cellsAdded++;
          }
        }

        if (cellsAdded) {
          //totalCellsAdded += cellsAdded;
          processedRows.push(row);
        }

        if (checkIfMustAbort && checkIfMustAbort()) {
          break;
        }
      }

      if (!stringArray.length) {
        return;
      }

      var x = document.createElement("div");
      x.innerHTML = stringArray.join("");

      var processedRow;
      var node;
      while ((processedRow = processedRows.pop()) != null) {
        cacheEntry = rowsCache[processedRow];
        var columnIdx;
        minCachedCellNodeIndex = cacheEntry.cellNodesByColumnStart;
        while ((columnIdx = cacheEntry.cellRenderQueue.pop()) != null) {
          node = x.lastChild;
          cacheEntry.rowNode.appendChild(node);
          assert(!cacheEntry.cellNodesByColumnIdx[columnIdx]);
          cacheEntry.cellNodesByColumnIdx[columnIdx] = node;
          minCachedCellNodeIndex = Math.min(minCachedCellNodeIndex, columnIdx);
        }
        cacheEntry.cellNodesByColumnStart = minCachedCellNodeIndex;
      }
    }

    function renderRows(range, mandatoryRange, checkIfMustAbort) {
      var parentNode = $canvas[0],
          stringArray = [],
          rows = [],
          needToReselectCell = false,
          r, c, l, colspan, spans,
          dataLength = getDataLength(),
          columnCount = columns.length,
          aborted = false,
          line_count = 0;

      // before we render the first row, we check how far our spans cache has been filled:
      // if it turns out it needs a lot of work yet (e.g. after scrolling quickly all the
      // way to the bottom of a large rowset) then we apportion that work too in order
      // to keep renderRows() within reasonably close time limits per render cycle.
      // 
      // (This slicing of the spans cache fill is done after we found that renderRows()
      // can consume quite a large amount of time for this scenario, thus overrunning 
      // the alloted async render timeslot significantly!)
      // 
      // Regrettably this also means we need to use a bit of 'internal knowledge' of the
      // span cache processing: we know it fills from first to last row and we can fill
      // the cache *up to a point* by calling `getSpans()` with a reasonable row index
      // argument: that way the cache will be filled in a controlled manner in multiple
      // steps with a minimum of overhead while we don't run headlong into problems 
      // with edge cases there -- one edge case being the repetitive overlapped rowspanning 
      // of different columns so that row X will end the rowspan for column A while 
      // starting the rowspan for column B, then row X+N does vice versa. 
      // Visually it would look a bit like so:
      //
      //  A  B
      // +--+--+
      // |  |  |
      // +  +--+
      // |  |  |
      // +--+  +
      // |  |  |
      // +  +--+
      // |  |  |
      // +--+  +
      // .  .  .
      // and so on. Note that the rowspans for columns A and B repeat, thus causing the
      // cache filler to fill the entire spans cache in one fell swoop. It has to as otherwise
      // we would end up with a corrupted cache.

      // Note that this bit of code is a partial duplicate/derivative of the code in `getSpans()`.
      // The conditions are meant to reduce the overhead further when `getSpans()` wouldn't 
      // cause CPU load trouble anyway.
      // 
      // Oh, and only perform this incremental cache building when it's actually useful, 
      // i.e. when we're running inside an async scheduled render slice! 
      if (data.getItemMetadata && columnCount > 0 && checkIfMustAbort) {
        assert(range.bottom > range.top || (range.bottom === range.top && getDataLength() === 0));
        c = columnCount - 1;
        var old_r = cellSpans.length;
        assert(range.bottom <= dataLength + 1 /* the optional 'addNewRow' */);
        assert(range.bottom <= getDataLengthIncludingAddNew());
        r = cellSpans.length;
        l = Math.min(range.bottom - 1, dataLength - 1); 
        while (r < l) {
          // calculate the next cellSpan cache slice:
          r = Math.min(r + cellSpansFillSlotSize, l);        
          getSpans(r, c);

          if (checkIfMustAbort()) {
            aborted = true;
            // Also signal our abort to the outside, even when it wasn't due to `checkIfMustAbort() === true`
            checkIfMustAbort(true);

            // adaptive update of the `cellSpansFillSlotSize` setting: EMA at a quarter time slice
            var achieved_count = (r - old_r) / 4;
            cellSpansFillSlotSize = Math.max(10, (cellSpansFillSlotSize * 3 + achieved_count) / 4) | 0;
            if (options.debug & DEBUG_MISC) { console.log("spans cache section done: ", r - old_r, r, achieved_count, cellSpansFillSlotSize, range); }
            break;
          }
        }
      }

      if (!aborted) {
        // collect rows with cell rowspans > 1 and overlapping the range top
        for (c = 0, l = columnCount; c < l; c += colspan) {
          colspan = 1;
          r = range.top;
          spans = getSpans(r, c);
          if (spans) {
            assert(c === spans.cell);
            colspan = spans.colspan;
            r = spans.row;
          }
          assert(c + colspan <= columnCount);
          if (r < range.top && !rowsCache[r] && columnPosLeft[c + colspan] > range.leftPx && columnPosLeft[c] < range.rightPx) {
            rows.push(r);

            if (rowsCache[r]) {
              continue;
            }

            // collect not rendered range rows
            renderedRows++;
            line_count++;

            // Create an entry right away so that appendRowHtml() can
            // start populating it.
            rowsCache[r] = {
              rowNode: null,

              // Cell nodes (by column idx).  Lazy-populated by ensureCellNodesInRowsCache().
              cellNodesByColumnIdx: [],

              // The lowest = starting index for the cellNodesByColumnIdx[] array above.
              cellNodesByColumnStart: MAX_INT,

              // Flags cell nodes as invalidated ("dirty") (indexed by column idx).
              dirtyCellNodes: [],

              // counter to signal if any cells in the row are "dirty" and thus require re-rendering/updating:
              isDirty: 0,

              // deletedCellNodesByColumnIdx: [],

              // // The lowest = starting index for the deletedCellNodesByColumnIdx[] array above.
              // deletedCellNodesByColumnStart: MAX_INT,

              // Column indices of cell nodes that have been rendered, but not yet indexed in
              // cellNodesByColumnIdx.  These are in the same order as cell nodes added at the
              // end of the row.
              cellRenderQueue: []
            };
            rowsCacheStartIndex = Math.min(rowsCacheStartIndex, r);

            appendRowHtml(stringArray, r, range, dataLength);
            //assert(rowsCache[i].rowNode);
            if (activeCellNode && activeRow === r) {
              needToReselectCell = true;
            }
            counter_rows_rendered++;
          }

          if ((line_count >= options.maxRowsRenderedPerRenderSlice && c + colspan < l) || (checkIfMustAbort && checkIfMustAbort())) {
            aborted = true;
            // Also signal our abort to the outside, even when it wasn't due to `checkIfMustAbort() === true`
            if (checkIfMustAbort) {
              checkIfMustAbort(true);
            }
            break;
          }
        }
      }

      // collect not rendered range rows
      if (!aborted) {
        assert(range.bottom > range.top || (range.bottom === range.top && getDataLength() === 0));
        for (r = range.top, l = range.bottom; r < l; r++) {
          if (rowsCache[r]) {
            continue;
          }
          renderedRows++;
          line_count++;
          rows.push(r);

          // Create an entry right away so that appendRowHtml() can
          // start populating it.
          rowsCache[r] = {
            rowNode: null,

            // Cell nodes (by column idx).  Lazy-populated by ensureCellNodesInRowsCache().
            cellNodesByColumnIdx: [],

            // The lowest = starting index for the cellNodesByColumnIdx[] array above.
            cellNodesByColumnStart: MAX_INT,

            // Flags cell nodes as invalidated ("dirty") (indexed by column idx).
            dirtyCellNodes: [],

            // counter to signal if any cells in the row are "dirty" and thus require re-rendering/updating:
            isDirty: 0,

            // deletedCellNodesByColumnIdx: [],

            // // The lowest = starting index for the deletedCellNodesByColumnIdx[] array above.
            // deletedCellNodesByColumnStart: MAX_INT,

            // Column indices of cell nodes that have been rendered, but not yet indexed in
            // cellNodesByColumnIdx.  These are in the same order as cell nodes added at the
            // end of the row.
            cellRenderQueue: []
          };
          rowsCacheStartIndex = Math.min(rowsCacheStartIndex, r);

          appendRowHtml(stringArray, r, range, dataLength);
          //assert(rowsCache[i].rowNode);
          if (activeCellNode && activeRow === r) {
            needToReselectCell = true;
          }
          counter_rows_rendered++;

          if ((line_count >= options.maxRowsRenderedPerRenderSlice && r + 1 < l) || (checkIfMustAbort && checkIfMustAbort())) {
            aborted = true;
            // Also signal our abort to the outside, even when it wasn't due to `checkIfMustAbort() === true`
            if (checkIfMustAbort) {
              checkIfMustAbort(true);
            }
            break;
          }
        }
      }

      if (rows.length === 0) {
        assert(!needToReselectCell); 
      } else {
        assert(rows.length > 0);
        var x = document.createElement("div");
        x.innerHTML = stringArray.join("");

        var rowNodes = [];
        for (r = 0, l = rows.length; r < l; r++) {
          rowsCache[rows[r]].rowNode = parentNode.appendChild(x.firstChild);
          assert(rowsCache[rows[r]].rowNode);
          rowNodes.push(rowsCache[rows[r]]);
          // Safari 6.0.5 doesn't always render the new row immediately.
          // "Touching" the node's offsetWidth is sufficient to force redraw.
          if (isBrowser.safari605) {
            // this is a very costly operation in all browsers, so only run it for those which need it here:
            rowsCache[rows[r]].rowNode.offsetWidth;
          }
        }
        
        trigger(self.onRowsRendered, { 
          rows: rows, 
          nodes: rowNodes,
          mandatory: mandatoryRange,
          mustContinue: aborted, 
          grid: self
        });

        if (needToReselectCell && !mandatoryRange) {
          activeCellNode = getCellNode(activeRow, activeCell, true);
          assert(activeCellNode);
          // When we need to reselect the active cell, it MAY also have lost focus previously,
          // which should then also be re-acquired, unless someone else has been taking over the focus
          // in the meantime:
          if (focusMustBeReacquired && 
              focusMustBeReacquired.row === activeRow && focusMustBeReacquired.cell === activeCell &&
              elementHasFocus($focusSink[0])
          ) {
            if (options.debug & DEBUG_FOCUS) { console.log("focus fixup exec (render row) START: ", document.activeElement); }
            movingFocusLock++;
            // We MAY see a sequence of focusout+focusin, where by the time focusin fires, document.activeElement is BODY.
            // We MAY also see only a focusin, in which case we are to provide the original focused node.
            movingFocusLockData[movingFocusLock - 1] = {
              oldNode: $focusSink[0],
              newNode: activeCellNode
            };
            activeCellNode.focus();
            assert(document.activeElement === activeCellNode);
            movingFocusLock--;
            if (!movingFocusLock) {
              movingFocusLockData = [];
            }
            if (options.debug & DEBUG_FOCUS) { console.log("focus fixup exec (render row) END: ", document.activeElement); }
          } 
          // focusMustBeReacquired is done / outdated: destroy it
          focusMustBeReacquired = false;
        }
      }

      return needToReselectCell;
    }

    function startPostProcessing(renderDelay) {
      if (!options.enableAsyncPostRender) {
        return;
      }
      if (h_postrender) {
        clearTimeout(h_postrender);
      }
      h_postrender = setTimeout(asyncPostProcessRows, renderDelay > 0 ? renderDelay : options.asyncPostRenderDelay);
    }

    function invalidatePostProcessingResults(row, cell) {
      //assert(postProcessedRows[row]);
      if (cell == null) {
        postProcessedRows[row] = undefined;
      } else {
        if (postProcessedRows[row]) {
          postProcessedRows[row][cell] = false;
        }
      }
      postProcessFromRow = Math.min(postProcessFromRow, row);
      postProcessToRow = Math.max(postProcessToRow, row);
      startPostProcessing();
    }

    function invalidateAllPostProcessingResults() {
      postProcessedRows = [];
      postProcessToRow = 0;
      postProcessFromRow = MAX_INT;
      startPostProcessing();
    }

    // Return TRUE when the render is pending (but hasn't executed yet)
    function render(renderImmediately, renderDelay) {
      if (!initialized) { 
        return false; 
      }

      if (h_render) {
        if (options.debug & DEBUG_RENDER) { console.log("render: CLEAR TIMER", this, arguments, document.activeElement); }
        clearTimeout(h_render);
        h_render = null;
      }

      if (options.forceSyncScrolling || renderImmediately || !options.asyncRenderDelay) {
        forcedRender(null, 0);
        return false;
      } else {
        // We may delay rendering the entire grid, but we cannot ever postpone updating the active & focused cells!
        if (activeCellNode) {
          forcedRenderCriticalCell(activeRow, activeCell);
        }

        h_render = setTimeout(function h_render_timer_f() {
          h_render = null;
          forcedRender(null, options.asyncRenderSlice);
        }, renderDelay > 0 ? renderDelay : options.asyncRenderDelay);
        if (options.debug & DEBUG_RENDER) { console.log("render: re-SET TIMER: ", (renderDelay > 0 ? renderDelay : options.asyncRenderDelay), this, arguments, document.activeElement); }
        return true;
      }
    }

    function isRenderPending() {
      return h_render != null;
    }

    /**
     * Invoke this function to stop SlickGrid from rendering the grid until further notice.
     *
     * This call can be used by userland code to help keep the DOM and render costs lean
     * when the grid is not visible: as the render action is held off, it will execute soon
     * after the `resumeRendering()` has been invoked ('soon' rather than 'immediately' as
     * the render activity is an asynchronous process).
     *
     * To ensure that certain assumptions about the grid (and the 'active cell' DOM part) will
     * continue to hold, we *do* permit *forced* render actions during this time until
     * the next `resumeRendering()` invocation.
     */
    function pauseRendering() {
      if (options.debug & DEBUG_RENDER) { console.log("render: PAUSE: ", this, arguments, document.activeElement); }
      options.pauseRendering = true;
    }

    function resumeRendering() {
      if (options.debug & DEBUG_RENDER) { console.log("render: RESUME: ", this, arguments, document.activeElement); }
      options.pauseRendering = false;
    }

    function forcedRenderCriticalCell(row, cell) {
      var cellBoxInfo = getCellNodeBox(row, cell);
      // when the sought-after cell is outside the visible part of the row, we don't render a series but only that single node:
      if (cellBoxInfo) {
        // now construct the range object a la getRenderedRange() to be the minimal area that should get us, at least, the rendered cell DIV we seek here.
        var spanInfo = cellBoxInfo.spanInfo;
        var rendered = {
          top: spanInfo.row,
          bottom: spanInfo.row + spanInfo.rowspan,
          left: spanInfo.cell,
          right: spanInfo.cell + spanInfo.colspan,
          leftPx: cellBoxInfo.left,
          rightPx: cellBoxInfo.right
        };
        if (options.debug & DEBUG_RENDER) { console.log("render: force render of active cell ", row, cell, this, arguments, document.activeElement); }
        return forcedRender(rendered, 0);
      }
      return false;
    }

    function forcedRender(mandatoryRange, timeSlice) {
      if (options.debug & DEBUG_RENDER) { console.log("render action start: ", this, arguments, document.activeElement); }
      var checkTheTime = null;
      if (timeSlice > 0) {
        if (!render_perftimer) {
          render_perftimer = Slick.PerformanceTimer();
        }
        render_perftimer.start();

        if (!options.pauseRendering) { 
          var signal_timeout = false;

          checkTheTime = function h_checkTheTime_f(aborted) {
            if (aborted) {
              //break out;
              signal_timeout = true;
            }

            // Should we stop and postpone the execution of the pending tasks?
            if (!signal_timeout && timeSlice > 0) {
              var delta_t = render_perftimer.mark();
              if (delta_t >= timeSlice) {
                //break out;
                signal_timeout = true;
              }
            }
            return signal_timeout;
          };
        } else {
          checkTheTime = function h_checkTheTimeWhenPaused_f() {
            // always report TRUE. Do not allow the async *chunked* render process
            // to pick up again halfway through the action series in the code below as
            // that would be a risk regarding render assumptions: once the time has
            // been 'flagged' it MUST REMAIN 'flagged':
            return true;
          };
        } 
      }

      //assert($(".slick-row").filter(":not(:visible)").length === 0);

      var visible = getVisibleRange();
      var rendered;
      if (mandatoryRange && typeof mandatoryRange === "object") {
        assert("top" in mandatoryRange);
        assert("bottom" in mandatoryRange);
        assert("left" in mandatoryRange);
        assert("right" in mandatoryRange);
        assert("leftPx" in mandatoryRange);
        assert("rightPx" in mandatoryRange);
        rendered = mandatoryRange;
      } else {
        rendered = getRenderedRange();
      }

      var e = new Slick.EventData();
      trigger(self.onRenderStart, {
        renderedArea: rendered, 
        visibleArea: visible,
        forced: mandatoryRange,
        grid: self
      }, e);
      var handled = e.isHandled();
      if (handled) {
        // userland code decided the render is either already done or premature.
        // 
        // In either case, we don't bother with rendering again until the same userland
        // code deigns to call our render() API again.
        if (options.debug & DEBUG_RENDER) { console.log("renderer: userland onRenderStart signaled completion: ", e, this, arguments, document.activeElement); }
        return false;
      }

      // Delete invisible rows and columns to help speed up the scroll/canvas movement and re-render activity.
      if (!mandatoryRange) {
        // remove rows / columns no longer in the viewport; always perform at least this one task.
        // if (!checkTheTime || !checkTheTime()) {
          cleanUpRows(rendered);
        // }
      } 

      // Add new rows & missing cells in existing rows.
      // 
      // When a "mandatory" render is executed (which usually spans a tiny area)
      // then we must remember if a full render was pending in the meantime as 
      // otherwise the cell cache gets corrupted: the result being rows in the
      // viewport with lots of "missing cells". Then on the next non-mandatory
      // render() round, we should call cleanUpAndRenderCells() again to ensure 
      // those "missing cells" get rendered after all. 
      
      // if (lastRenderedScrollLeft !== scrollLeft || mandatoryRange || previousRenderWasIncomplete) {
      //   if (isRenderPending() && mandatoryRange) {
      //     previousRenderWasIncomplete = true;
      //   } else {
      //     previousRenderWasIncomplete = false;
      //   }
      if (!checkTheTime || !checkTheTime()) {
        cleanUpAndRenderCells(rendered, mandatoryRange, checkTheTime);
      }
      // } else {
      //   assert(0, "I don't expect this to happen in a sane & efficient environment");
      // }

      // // only destroy the nodes which are not going to be replaced by new ones yet:
      // if (!mandatoryRange || 1) {
      //   $canvas.find(".destroyed").remove();
      // } else {
      //   deletedRowsCache[rendered.top].deletedCellNodesByColumnIdx[rendered.left].remove();
      // }

      // render missing rows
      var needToReselectCell = false;
      if (!checkTheTime || !checkTheTime()) {
        needToReselectCell = renderRows(rendered, mandatoryRange, checkTheTime);
      }

      // add all new rendered rows & their cells to the cache
      assert(rendered.bottom > rendered.top || (rendered.bottom === rendered.top && getDataLength() === 0));
      for (var row = rendered.top; row < rendered.bottom; row++) {
        var cacheEntry = rowsCache[row];
        if (cacheEntry && cacheEntry.cellRenderQueue.length) {
          //assert(0, "should not be necessary any more");
          assert(cacheEntry.rowNode);
          ensureCellNodesInRowsCache(row);
        }
      }

      // if (!mandatoryRange) {
      //   // remove rows / columns no longer in the viewport
      //   if (!checkTheTime || !checkTheTime()) {
      //     cleanUpRows(rendered);
      //   }
      // } 

      // update all cells which have been flagged as "dirty":
      if (!checkTheTime || !checkTheTime()) {
        // When we're executing a "forced render", we're only going to update the cells which
        // we want actually rendered right now.
        updateAllDirtyCells((mandatoryRange ? rendered : visible), checkTheTime);
      }

      // Make sure we inspect & post process the entire visible range where necessary:
      if (!checkTheTime || !checkTheTime()) {
        postProcessFromRow = Math.min(postProcessFromRow, visible.top);
        postProcessToRow = Math.max(postProcessToRow, Math.min(getDataLengthIncludingAddNew() - 1, visible.bottom - 1));
        startPostProcessing();
      }

      if (!mandatoryRange) {
        // only set these when we're completely done with the render process:
        lastRenderedScrollTop = scrollTop;
        lastRenderedScrollLeft = scrollLeft;
      } 

      var renderEndInfo = {
        renderedArea: rendered, 
        visibleArea: visible,
        forced: mandatoryRange,
        needToReselectCell: needToReselectCell,
        mustContinue: checkTheTime && checkTheTime(),
        grid: self
      };
      trigger(self.onRenderEnd, renderEndInfo);

      if (checkTheTime && checkTheTime()) {
        // fire the render action again at a later moment to continue the process:
        if (options.debug & DEBUG_RENDER) { console.log("render has not finished yet: retriggering another round: ", options.asyncRenderInterleave, this, arguments, document.activeElement); }
        render(false, options.asyncRenderInterleave);
      }

      if (options.debug & DEBUG_RENDER) { console.log("renderer: end of " + (renderEndInfo.mustContinue ? "partial" : "FINISHED") + " render action: ", renderEndInfo, this, arguments, document.activeElement); }
      return needToReselectCell;
    }

    function handleHeaderRowScroll() {
      if (options.debug & (DEBUG_EVENTS | DEBUG_SCROLL)) { console.log("scroll event @ header: ", this, arguments, document.activeElement); }
      var scrollLeft = $headerRowScroller[0].scrollLeft;
      if (scrollLeft !== $viewport[0].scrollLeft) {
        $viewport[0].scrollLeft = scrollLeft;
      }
    }

    function handleFooterRowScroll() {
      if (options.debug & (DEBUG_EVENTS | DEBUG_SCROLL)) { console.log("scroll event @ footer: ", this, arguments, document.activeElement); }
      var scrollLeft = $footerRowScroller[0].scrollLeft;
      if (scrollLeft !== $viewport[0].scrollLeft) {
        $viewport[0].scrollLeft = scrollLeft;
      }
    }

    var ttt = Slick.PerformanceTimer();

    function handleScrollEvent(e) {
      scrollTop = $viewport[0].scrollTop;
      scrollLeft = $viewport[0].scrollLeft;
      //if (options.debug & DEBUG_EVENTS) { console.log("handle SCROLL EVENT: ", +new Date(), ttt.mark_delta(), this, arguments, document.activeElement, scrollTop, scrollLeft); }
      //if (options.debug & DEBUG_SCROLL) { console.log("handle SCROLL EVENT: ", ttt.mark_delta(), scrollTop, scrollLeft); }

      if (handleScroll()) {
        render();
      }
    }

    function handleScroll() {
      var vScrollDist = Math.abs(scrollTop - prevScrollTop);
      var hScrollDist = Math.abs(scrollLeft - prevScrollLeft);
      var reRender = false;

      if (hScrollDist) {
        prevScrollLeft = scrollLeft;
        $headerScroller[0].scrollLeft = scrollLeft;
        $topPanelScroller[0].scrollLeft = scrollLeft;
        $headerRowScroller[0].scrollLeft = scrollLeft;
        $footerRowScroller[0].scrollLeft = scrollLeft;
        reRender = true;
      } else {
        // @TO-BE-INSPECTED
      
        // when width of headers cells changed and h scrolling
        // has been applied $headerScroller[0].scrollLeft gets 0
        // seometimes so reset it to previous scrollLeft
        $headerScroller[0].scrollLeft = prevScrollLeft;

        // /@TO-BE-INSPECTED
      }

      if (vScrollDist /* && vScrollDist > options.rowHeight */) {
        vScrollDir = prevScrollTop < scrollTop ? 1 : -1;
        prevScrollTop = scrollTop;

        // switch virtual pages if needed
        if (vScrollDist < viewportH) {
          reRender = scrollTo(scrollTop + pageOffset, null);
        } else {
          var oldOffset = pageOffset;
          if (scrollableHeight === viewportH) {
            // see https://github.com/mleibman/SlickGrid/issues/309
            page = numberOfPages - 1;
          } else {
            assert(pageHeight > 0);
            page = Math.min(numberOfPages - 1, Math.floor(scrollTop * ((virtualTotalHeight - viewportH) / (scrollableHeight - viewportH)) / pageHeight));
          }
          pageOffset = Math.round(page * jumpinessCoefficient);
          if (oldOffset !== pageOffset) {
            invalidateAllRows();
            reRender = true;
          }
        }
      }

      if (hScrollDist || vScrollDist) {
        // if (h_render) {
        //   clearTimeout(h_render);
        //   h_render = null;
        // }

        if (Math.abs(lastRenderedScrollTop - scrollTop) > options.viewportChangedEventThreshold ||
            Math.abs(lastRenderedScrollLeft - scrollLeft) > options.viewportChangedEventThreshold) {
          reRender = true;
          trigger(self.onViewportChanged);
        }
      } else {
        assert(!reRender);
      }

      trigger(self.onScroll, {
        scrollLeft: scrollLeft, 
        scrollTop: scrollTop,
        reRender: reRender,
        grid: self
      });
      return reRender;
    }

    function asyncPostProcessRows() {
      h_postrender = null;

      if (!postprocess_perftimer) {
        postprocess_perftimer = Slick.PerformanceTimer();
      }
      postprocess_perftimer.start();
      var requeue = false;

      var dataLength = getDataLength();
      // Only process the rows in the "rendered" range, hence we clip the range accordingly.
      // 
      // We check this on every async round as the visual/rendered range may have changed between
      // individual async rounds!
      // 
      // Also note that we do *not* update the `postProcessFromRow` and `postProcessToRow`
      // globals until we have assured in the final async round (invocation of this function)
      // that all rows/cells have been properly updated. If we would update these globals earlier,
      // while we "clip" our activity to the "rendered" range (i.e. the row/cell DOM cache),
      // then we will run into race conditions which occur, for instance, when the grid is 
      // scrolled in various directions while the async postprocessing is still underway.
      var startRow = Math.max(rowsCacheStartIndex, postProcessFromRow);
      var endRow = Math.min(rowsCache.length - 1, postProcessToRow);
      var rowStep = 1;
      var row = startRow;
      if (vScrollDir < 0) {
        // flip the order in which the rows are updated:
        row = endRow;
        rowStep = -1;
      }
out:      
      for ( ; row >= startRow && row <= endRow; row += rowStep) {
        var cacheEntry = rowsCache[row];
        if (!cacheEntry || row >= dataLength) {
          continue;
        }

        if (!postProcessedRows[row]) {
          postProcessedRows[row] = [];
        }

        // As this is an sync process and the basic grid render itself may have been executed
        // again in between runs of ours, we MAY have
        // some new cells queued from the renderer: apply those before we continue working on
        // our own stuff:
        ensureCellNodesInRowsCache(row);

        var cellCache = cacheEntry.cellNodesByColumnIdx;
        for (var columnIdx = cacheEntry.cellNodesByColumnStart, end = Math.min(cellCache.length, columns.length); columnIdx < end; columnIdx++) {
          var m = columns[columnIdx],
              node = cellCache[columnIdx];
          assert(m);
          if (node && m.asyncPostRender && !postProcessedRows[row][columnIdx]) {
            m.asyncPostRender(node, row, columnIdx, getDataItem(row), m);
            postProcessedRows[row][columnIdx] = true;
            // When there was one async task, there may be more to follow...
            requeue = true;
            // Should we stop and postpone the execution of the pending tasks?
            var delta_t = postprocess_perftimer.mark();
            if (delta_t >= options.asyncPostRenderSlice) {
              // This approach (see the comment above the startRow/endRow loop) makes sure 
              // this row is revisited as we abort here midway through 
              // (i.e. when not all of the async render cells in the current row have been processed yet)!
              break out;
            }
          }
        }
      }

      // When there's anything left to do, queue it for the next time slice:
      if (requeue) {
        startPostProcessing(options.asyncPostRenderDelay);
      } else {
        // There's nothing to update: we can safely declare the async post processing
        // to have completed.
        postProcessToRow = 0;
        postProcessFromRow = MAX_INT;
      }
    }

    function updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
      var node, cell, addedRowHash, removedRowHash;
      for (var row = rowsCacheStartIndex, endrow = rowsCache.length; row < endrow; row++) {
        removedRowHash = removedHash && removedHash[row];
        addedRowHash = addedHash && addedHash[row];

        if (removedRowHash) {
          //@TO-OPT
          for (cell in removedRowHash) {
            cell = +cell;       // make sure to convert the cell index (hash key) to a NUMBER
            if (!addedRowHash || removedRowHash[cell] !== addedRowHash[cell]) {
              node = getCellNode(row, cell);
              if (node) {
                $(node).removeClass(removedRowHash[cell]);
              }
            }
          }
        }

        if (addedRowHash) {
          //@TO-OPT
          for (cell in addedRowHash) {
            cell = +cell;       // make sure to convert the cell index (hash key) to a NUMBER
            if (!removedRowHash || removedRowHash[cell] !== addedRowHash[cell]) {
              node = getCellNode(row, cell);
              if (node) {
                $(node).addClass(addedRowHash[cell]);
              }
            }
          }
        }
      }
    }

    /**
     * Adds an "overlay" of CSS classes to cell DOM elements. SlickGrid can have many such 
     * overlays associated with different keys and they are frequently used by plugins. 
     * For example, SlickGrid uses this method internally to decorate selected cells with 
     * `selectedCellCssClass` (see options).
     *
     * @param {String} key  A unique key you can use in calls to `setCellCssStyles` and `removeCellCssStyles`. 
     *                      If a hash with that key has already been set, an exception will be thrown unless
     *                      you have set the `dontBarf` argument to `true`, in which case this API will
     *                      merely return the boolean value `false`.
     *
     * @param {Hash:Object} hash  
     *                      A 2D hash of additional cell CSS classes keyed by row number 
     *                      and then by column id. Multiple CSS classes can be specified 
     *                      and separated by space.
     *
     *                      Example hash for example key `"formatting"`:
     *
     *                      ```javascript
     *                      {
     *                          0: {
     *                              "number_column": "cell-bold",
     *                              "title_column": "cell-title cell-highlighted"
     *                          },
     *                          4: {
     *                              "percent_column": "cell-highlighted"
     *                          }
     *                      }
     *                      ```
     *
     * **Warning**: this API 'adds' a 'key' to the custom overrides set inside SlickGrid 
     * but do not confuse that with the `upsertCellCssStyles()` API which *appends/replaces* 
     * the (possibly already present) values for the same `key`.
     *
     * @return {Boolean}    Return TRUE when the key has been set for the given cell hash set,
     *                      return FALSE when the key could not be set because it already has been
     *                      set up previously. (If this latter scenario bothers you, you might want 
     *                      to consider using the `upsertCellCssStyles()` API instead.)
     */
    function addCellCssStyles(key, hash, dontBarf) {
      if (cellCssClasses[key]) {
        if (!dontBarf) {
          throw new Error("addCellCssStyles: cell CSS hash with key '" + key + "' already exists.");
        }
        return false;
      }

      cellCssClasses[key] = hash;
      updateCellCssStylesOnRenderedRows(hash, null);

      trigger(self.onCellCssStylesChanged, { 
        key: key, 
        hash: hash,
        //previousHash: null,
        grid: self 
      });
      return true;
    }

    /**
     * Update / insert the CSS class value for the cells listed in the hash to the given `key`.
     *
     * This API is a little costlier to use then the `setCellCssStyles()` and `addCellCssStyles()`
     * APIs which completely replace the hash, i.e. the set of cells addressed by the `key`
     * as this API updates the cell sets: the cell entries in the `addHash` are added to the
     * set, while the cells listed in the `removeHash` are removed from the set.
     *
     * Either `addHash` or `removeHash` may be null when you do not need that half of the
     * functionality.
     *
     * Note that a cell listed in both `addHash` and `removeHash` (a conflict) 
     * will be *removed* from the resulting set as `removeHash` has priority over 
     * `addHash` by design.
     *
     * This API will produce a cleaned-up hash set where empty rows and falsey (nulled) hash entries 
     * have been removed. 
     *
     * **Off topic**: the name of this API is inspired by the query command in advanced SQL DB engines, 
     * such as Oracle and DB2: `UPSERT` name is a contraction of `UPDATE` and `INSERT`.   
     *
     * @param {String} key  A unique key you can use in calls to `setCellCssStyles` and `removeCellCssStyles`. 
     *                      If a hash with that key has already been set, an exception will be thrown unless
     *                      you have set the `dontBarf` argument to `true`, in which case this API will
     *                      merely return the boolean value `false`.
     *
     * @param {Hash:Object} addHash  
     *                      A 2D hash of additional cell CSS classes keyed by row number 
     *                      and then by column id. Multiple CSS classes can be specified 
     *                      and separated by space.
     *
     * @param {Hash:Object} removeHash  
     *                      Ditto as `addHash`; any cells listed in this hash will have their
     *                      CSS class(es) for this key removed. Hence it does not matter what the
     *                      actual *value* for that cell is in this particular hash, just 
     *                      as long as it evaluates as 'truthy'.
     *
     * @return {Hash:Object} 
     *                      Return a *reference* to the new hash set. 
     *                      
     *                      Note: You can obtain the same info by calling the 
     *                      `getCellCssStyles()` API with `options.clone` set to `false`.
     */
    function upsertCellCssStyles(key, addHash, removeHash) {
      var previousHash = cellCssClasses[key];
      var newHash;
      var row, cellId, lineHash, addLineHash, removeLineHash, previousLineHash;

      // now mix the hashes:
      if (!previousHash && !removeHash) {
        newHash = addHash || null;
      } else {
        // clone the existing hash while we mix in the new hashes:
        newHash = {};
        previousLineHash = previousHash && previousHash[row];
        //@TO-OPT
        for (row in previousLineHash) {
          previousLineHash = previousHash[row];
          lineHash = {};
          cellId = null;
          for (cellId in previousLineHash) {
            // Only valid cell values will make it into the new hash  
            if (previousLineHash[cellId]) {
              lineHash[cellId] = previousLineHash[cellId];
            }
          }
          // only set up the row when there's some actual cell content:
          if (cellId !== null) {
            newHash[row] = lineHash; 
          }
        }
        
        //@TO-OPT
        for (row in addHash) {
          // You might think you'ld be able to update the entire row all at once... 
          // but do check against the `removeHash` and do not reference (and modify) 
          // the input `addHash` entry, so no 'shorthand' hacking allowed around here, 
          // so stuff like this is *out*:
          // 
          // ```
          // if (!previousHash[row]) {
          //   lineHash = addHash;
          // } else { ... }
          // ```
          // 
          // Also I assume it's faster in the end to apply all `removeHash`es all at once,
          // thus foregoing a lot of `if(...)` checks in these 'add' loops right here and 
          // then having to bother about the `removeHash` maybe containing rows which are 
          // not in the `addHash` and vice versa... Hence: keep it simple!
          lineHash = newHash[row] || {};
          cellId = null;
          // now mix in the new 'add' values:
          addLineHash = addHash[row];
          for (cellId in addLineHash) {
            // Only valid cell values will make it into the new hash  
            if (addLineHash[cellId]) {
              lineHash[cellId] = addLineHash[cellId];
            }
          }
          // only set up the row when there's some actual cell content:
          if (cellId !== null) {
            newHash[row] = lineHash; 
          }
        }
        
        // As I mentioned above, we're going to kill all `removeHash`es all at once in here:
        // this is going to be faster than mix these actions into the 'add' loops above.
        for (row in removeHash) {
          lineHash = newHash[row];
          // when there's nothing to remove here, take the shortcut:
          if (!lineHash) {
            delete newHash[row];
            continue;
          }
          
          // now mix out the new 'remove' values:
          removeLineHash = removeHash[row];
          for (cellId in removeLineHash) {
            // `removeHash[][]` entry must be *truthy* is all we ask:
            if (removeLineHash[cellId]) {
              delete lineHash[cellId];
            }
          }
          // now check if we emptied the entire row:
          cellId = null;
          for (cellId in lineHash) {
            // no, we didn't. Keep it around!
            break;
          }
          if (cellId === null) {
            delete newHash[row]; 
          }
        }
      }
      cellCssClasses[key] = newHash;
      updateCellCssStylesOnRenderedRows(newHash, previousHash);

      trigger(self.onCellCssStylesChanged, { 
        key: key, 
        hash: newHash,
        previousHash: previousHash,
        grid: self 
      });
    }

    /**
     * Removes an "overlay" of CSS classes from cell DOM elements.  
     * See `setCellCssStyles` for more.
     * 
     * Note: The CSS class values may have been set up previously through calls to either 
     * `setCellCssStyles()`, `addCellCssStyles()` or `upsertCellCssStyles()` APIs.
     *
     * @param {String} key  The key name, e.g. `flashing` or `selected-range`.
     */
    function removeCellCssStyles(key) {
      if (!cellCssClasses[key]) {
        return;
      }

      var prevHash = cellCssClasses[key];
      updateCellCssStylesOnRenderedRows(null, prevHash);
      delete cellCssClasses[key];

      trigger(self.onCellCssStylesChanged, { 
        key: key, 
        //hash: null,
        previousHash: prevHash,
        grid: self 
      });
    }

    /**
     * Sets/Replaces an "overlay" of CSS classes to specific grid cells. SlickGrid can have many such 
     * overlays associated with different keys and they are frequently used by plugins. 
     * For example, SlickGrid uses this method internally to decorate selected cells with 
     * `selectedCellCssClass` (see options).
     *
     * `key` is the name for this set of CSS classes so you can reference it later - to modify it or remove it, for example. 
     * `hash` is a per-row-index, per-column-name (`column.id`) nested hash of CSS classes to apply.
     *
     * @param {String} key  A string key. Will overwrite any data already associated with this key.
     *
     * @param {Array} hash  A 2D hash of additional cell CSS classes keyed by row number 
     *                      and then by column id. Multiple CSS classes can be specified 
     *                      and separated by space.
     *
     *                      Example hash for example key `"formatting"`:
     *
     *                      ```javascript
     *                      {
     *                          0: {
     *                              "number_column": "cell-bold",
     *                              "title_column": "cell-title cell-highlighted"
     *                          },
     *                          4: {
     *                              "percent_column": "cell-highlighted"
     *                          }
     *                      }
     *                      ```
     *
     * ### Example usage
     * 
     * Suppose you have a grid with columns:
     *
     *     ["login", "name", "birthday", "age", "likes_icecream", "favorite_cake"]
     *
     * ... and you'd like to highlight the "birthday" and "age" columns for people 
     * whose birthday is today -- in this case, their rows are at index 0 and 9. 
     * (The first and tenth row in the grid).
     *
     * ```css
     *    .highlight{ background: yellow; } 
     * ```
     * 
     * ```javascript
     * grid.setCellCssStyles("birthday_highlight", {
     *    0: {
     *         birthday: "highlight", 
     *         age: "highlight" 
     *       },
     *    9: {
     *         birthday: "highlight",
     *         age: "highlight"
     *       }
     * })
     * ```
     */
    function setCellCssStyles(key, hash) {
      var prevHash = cellCssClasses[key];

      cellCssClasses[key] = hash;
      updateCellCssStylesOnRenderedRows(hash, prevHash);

      trigger(self.onCellCssStylesChanged, { 
        key: key, 
        hash: hash,
        previousHash: prevHash,
        grid: self 
      });
    }

    /**
     * Clone hash so, for example, `setCellCssStyles()` will be able to see the changes 
     * when you feed it this hash after editing it: cloning MUST be 2 levels deep!
     * 
     * Note: this is a separate function as the `for..in` causes the code to remain unoptimized
     * ( http://commondatastorage.googleapis.com/io-2013/presentations/223.pdf / https://github.com/paperjs/paper.js/issues/466 )
     *
     * @param {Hash:Object} hash  
     *                      A 2D array of CSS class values. The array is indexed by [*row number*][*column ID*].
     *                      (The *column ID* is the `id` property registered in the column definition object.)
     *
     * @return {Hash:Object}      
     *                      A clone of the given 2D hash array or FALSE when the input `hash` was null/falsey.
     *                      (Thus an **empty** `hash` will be cloned, like any other valid `hash` set!)
     */
    function cloneCellCssStylesHash(hash) {
      if (!hash) {
        return false;
      }
      var o = {};
      for (var prop in hash) {
        var s = hash[prop];
        if (s) {
          var d = o[prop] = {};
          for (var p in s) {
            d[p] = s[p];
          }
        }
      }
      return o;
    }

    /**
     * Accepts a key name, returns the group of CSS classes defined under that name. 
     * See `setCellCssStyles` for more info.
     *
     * Note: when you wish to use the returned hash as (edited) input to `setCellCssStyles()`,
     * then the returned hash must be a semi-deep clone (2 levels deep) as otherwise `setCellCssStyles()`
     * won't be able to see the change by setting `options.clone = true`. 
     * See `grid.flashCell() :: toggleCellClass()` for an example.
     *
     * @param {String} key  The key name, e.g. `selected-range` or `flashing`
     *
     * @param {boolean} options.clone  
     *                      When `options.clone` is set, the returned 2D hash object will be a clone
     *                      rather than a direct reference. Use this option when you intend to 
     *                      edit/change the given hash array.
     *
     * @return {Hash:Object}
     *                      A reference (or clone) of the associated 2D hash object. 
     *                      Returns FALSE when no cells have anything set for this particular key!
     */
    function getCellCssStyles(key, options) {
      var hash = cellCssClasses[key];
      if (options && options.clone) {
        hash = cloneCellCssStylesHash(hash);
      }
      return hash || false;
    }

    /*
     * Internal hash to track flashing cells:
     */
    var flash_timer_hh = {};

    /**
     * parameters:
     *   row,cell:    grid cell coordinate
     *   options:
     *     speed:     number of milliseconds one half of each ON/OFF toggle cycle takes (default: 100ms)
     *     times:     number of flash half-cycles to run through (default: 4) - proper "flashing" requires you to set this to an EVEN number
     *     delay:     0/false: start flashing immediately. true: wait one half-cycle to begin flashing. <+N>: wait N milliseconds to begin flashing.
     *     cssClass:  the class to toggle; when set, this overrides the SlickGrid options.cellFlashingCssClass
     *
     * Notes:
     * - when `times` = 0 or ODD, then the `flash` class is SET [at the end of the flash period] but never reset!
     */
    function flashCell(row, cell, flash_options) {
      flash_options = __extend({}, {
        speed: 100,
        times: 4,
        delay: false,
        cssClass: options.cellFlashingCssClass
      }, flash_options);
      // closure variables:
      var key = "flashing";
      var id = (columns[cell] && columns[cell].id);
      var hh = "R" + row + "C" + cell;
      if (flash_timer_hh[hh]) {
        clearTimeout(flash_timer_hh[hh]);
        delete flash_timer_hh[hh];
      }

      // if the cell is at a legal column, this'll do. We don't care if the cell is currently
      // visible or not; whenever it is visible during the flashing period, it *will* flash.
      if (id != null) {
        if (flash_options.delay) {
          flash_timer_hh[hh] = setTimeout(function h_flashcell_timer_f() {
            toggleCellClass(flash_options.times | 0);
          },
          flash_options.delay !== true ? flash_options.delay : flash_options.speed);
        } else {
          toggleCellClass(flash_options.times | 0);
        }
        return true;
      }

      function toggleCellClass(times) {
        delete flash_timer_hh[hh];

        var new_state = (times + 1) % 2;
        var node = getCellNode(row, cell);
        if (node) {
          var $cell = $(node);
          assert($cell);
          assert($cell.length);
          $cell.queue(function h_flashcell_toggle_cell_class_f() {
            var hash = getCellCssStyles(key, { clone: true });
            if (new_state) {
              // switch to ON
              if (!hash[row]) {
                hash[row] = {};
              }
              hash[row][id] = flash_options.cssClass;
            } else {
              // switch to OFF
              if (hash[row]) {
                delete hash[row][id];
              }
            }
            setCellCssStyles(key, hash);
            $cell.dequeue();
          });
        }
        // Don't care if the cell currently exists in the visible cache; keep on flashing
        // because it *may* re-appear in a bit again, we don't (and cannot) know.
        execNextFlashPhase(times - 1);
      }

      function execNextFlashPhase(times) {
        if (times <= 0) {
          return;
        }
        flash_timer_hh[hh] = setTimeout(function h_flashcell_next_phase_f() {
          toggleCellClass(times);
        },
        flash_options.speed);
      }

      return false;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Interactivity

    // Handle header drags the way body drags are handled, so we set up a parallel
    // set of handlers to the ones used for body drags.
    function handleHeaderDragInit(e, dd) {
      var headerInfo = getHeaderColumnFromElement(e.target);
      if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("header drag init event: ", headerInfo, this, arguments, document.activeElement); }
      if (!headerInfo) {
        return false;
      }
      var column = headerInfo.columnDef;
      assert(column);
      dd.column = column;
      var retval = trigger(self.onHeaderDragInit, dd, e);
      var handled = e.isImmediatePropagationStopped() || e.isPropagationStopped() || e.isDefaultPrevented();
      if (handled) {
        return retval;
      }

      // if nobody claims to be handling drag'n'drop by stopping immediate propagation,
      // cancel out of it
      return false;
    }

    function handleHeaderDragStart(e, dd) {
      var headerInfo = getHeaderColumnFromElement(e.target);
      if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("header drag start event: ", headerInfo, this, arguments, document.activeElement); }
      if (!headerInfo) {
        return false;
      }
      var column = headerInfo.columnDef;
      assert(column);
      // signal the start of a drag operation
      headerDragCommencingLock = column;

      dd.column = column;
      var retval = trigger(self.onHeaderDragStart, dd, e);
      var handled = e.isImmediatePropagationStopped() || e.isPropagationStopped() || e.isDefaultPrevented();
      if (handled) {
        return retval;
      }

      return false;
    }

    function handleHeaderDrag(e, dd) {
      if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("header drag move event: ", this, arguments, document.activeElement); }
      return trigger(self.onHeaderDrag, dd, e);
    }

    function handleHeaderDragEnd(e, dd) {
      if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("header drag end event: ", this, arguments, document.activeElement); }
      var rv = trigger(self.onHeaderDragEnd, dd, e);

      // signal the end of a drag operation
      headerDragCommencingLock = null;

      return rv;
    }

    function handleMouseWheel(e) {
      var rowNode = $(e.target).closest(".slick-row")[0];
      assert(rowNode != rowNodeFromLastMouseWheelEvent ? rowNode !== rowNodeFromLastMouseWheelEvent : rowNode === rowNodeFromLastMouseWheelEvent);
      if (options.debug & (DEBUG_EVENTS | DEBUG_MOUSE)) { console.log("mousewheel event: ", rowNode, this, arguments, document.activeElement); }
      if (rowNode !== rowNodeFromLastMouseWheelEvent) {
        if (zombieRowNodeFromLastMouseWheelEvent && zombieRowNodeFromLastMouseWheelEvent !== rowNode) {
          if (options.cellsMayHaveJQueryHandlers) {
            if (options.enableAsyncPostRenderCleanup && zombieRowPostProcessedFromLastMouseWheelEvent) {
              queuePostProcessedRowForCleanup(zombieRowCacheFromLastMouseWheelEvent, zombieRowPostProcessedFromLastMouseWheelEvent);
            } else {
              $(zombieRowNodeFromLastMouseWheelEvent).remove();      // remove children from jQuery cache: fix mleibman/SlickGrid#855 :: Memory leaks when cell contains jQuery controls
            }
          } else {
            $canvas[0].removeChild(zombieRowNodeFromLastMouseWheelEvent);
          }
          zombieRowNodeFromLastMouseWheelEvent = null;
          zombieRowCacheFromLastMouseWheelEvent = null;
          zombieRowPostProcessedFromLastMouseWheelEvent = null;

          if (options.enableAsyncPostRenderCleanup) { startPostProcessingCleanup(); }
        }
        rowNodeFromLastMouseWheelEvent = rowNode;
      }
    }

    function handleDragInit(e, dd) {
      var cell = getCellFromEvent(e);
      if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("canvas drag init event: ", cell, this, arguments, document.activeElement); }
      if (!cell || !cellExists(cell.row, cell.cell)) {
        return false;
      }

      var retval = trigger(self.onDragInit, dd, e);
      var handled = e.isImmediatePropagationStopped() || e.isPropagationStopped() || e.isDefaultPrevented();
      if (handled) {
        return retval;
      }

      // if nobody claims to be handling drag'n'drop by stopping immediate propagation,
      // cancel out of it
      return false;
    }

    function handleDragStart(e, dd) {
      var cell = getCellFromEvent(e);
      if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("canvas drag start event: ", cell, this, arguments, document.activeElement); }
      if (!cell || !cellExists(cell.row, cell.cell)) {
        return false;
      }

      var retval = trigger(self.onDragStart, dd, e);
      var handled = e.isImmediatePropagationStopped() || e.isPropagationStopped() || e.isDefaultPrevented();
      if (handled) {
        return retval;
      }

      return false;
    }

    function handleDrag(e, dd) {
      if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("canvas drag move event: ", cell, this, arguments, document.activeElement); }
      return trigger(self.onDrag, dd, e);
    }

    function handleDragEnd(e, dd) {
      if (options.debug & (DEBUG_EVENTS | DEBUG_DRAG)) { console.log("canvas drag end event: ", cell, this, arguments, document.activeElement); }
      var rv = trigger(self.onDragEnd, dd, e);
      return rv;
    }

    function preventDefaultKeyboardActionHack(evt) {
      try {
        // prevent default behaviour for special keys in IE browsers (F3, F5, etc.)
        evt.keyCode = 0; 
      }
      // ignore exceptions - setting the original event's keycode throws access denied exception for "Ctrl"
      // (hitting control key only, nothing else), "Shift" (maybe others)
      catch (error) {
      }
      if (evt.originalEvent) {
        preventDefaultKeyboardActionHack(evt.originalEvent);
      }
    }

    // See also test/test-event-modification-transferability.html
    // 
    // Tweak the event object to signal any parents who receive this bubbled-up item 
    // that Monsieur SlickGrid has toggled this one already and as with all things fleeting, 
    // once is enough.
    // 
    // Return TRUE when the event has already been observed by SlickGrid; otherwise this
    // event is signaled as having been seen by SlickGrid, hence the code calls this One Stop Stop
    // for both setting unvisited events and testing incoming events which may have been observed
    // already.
    function signalEventObserved(e) {
      var p = e;
      while (p) {
        if (p.__slickgrid_uid__ === uid) {
          return true;
        }
        p = p.originalEvent;
      }
      // Event has not been visited yet: signal it and return FALSE to signal caller it has work to do.
      p = e;
      while (p) {
        p.__slickgrid_uid__ = uid;
        p = p.originalEvent;
      }
      return false;
    }

    function handleContainerKeyDown(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS | DEBUG_KEYBOARD)) { console.log("keydown @ CONTAINER: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      // move focus back into SlickGrid when it's not already there?
      //
      // N.B. keep in mind that we have those special copy/paste tricks which employ root-level temporary DOM nodes which must catch the keyboard event!
      __handleKeyDown(e);
    }

    function handleKeyDown(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_KEYBOARD)) { console.log("keydown: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      __handleKeyDown(e);
    }

    function __handleKeyDown(e) {
      assert(!(e instanceof Slick.EventData));
      var activeCellInfo = null;
      if (activeCellNode) {
        activeCellInfo = {
          row: activeRow, 
          cell: activeCell,
          node: activeCellNode,
          grid: self
        };
      }
      assert("which" in e);
      var which = e.which;
      var shiftKey = e.shiftKey;
      var altKey = e.altKey;
      var ctrlKey = e.ctrlKey;

      if (options.debug & DEBUG_KEYBOARD) { console.log("key @ start: ", which, handled, e, activeCellInfo, getActiveCell(), document.activeElement); }
      trigger(self.onKeyDown, activeCellInfo, e);
      var handled = e.isImmediatePropagationStopped() || e.isPropagationStopped() || e.isDefaultPrevented();

      if (options.debug & DEBUG_KEYBOARD) { console.log("key @ after: ", which, handled, e, activeCellInfo, getActiveCell(), document.activeElement); }
      if (!handled) {
        // Check if we're triggered from inside the grid container: when we are, then 
        // we simply activate the top/left visible cell and proceed from there:
        if (!activeCellNode) {
          assert(!getEditorLock().isActive());
          assert(!currentEditor);
          assert(!activeCell);
          assert(!activeRow);

          var visibleRange = getVisibleRange();
          setActiveCell(visibleRange.row, visibleRange.cell, {
            forceEditMode: 0,
            takeFocus: false
          });
        }

        if (!shiftKey && !altKey && !ctrlKey) {
          switch (which) {
          case Slick.Keyboard.ESCAPE:
            if (!getEditorLock().isActive()) {
              return; // no editing mode to cancel, allow bubbling and default processing (exit without canceling the event)
            }
            cancelEditAndSetFocus();
            //handled = true;
            break;

          case Slick.Keyboard.PAGE_DOWN:
            navigatePageDown();
            handled = true;
            break;

          case Slick.Keyboard.PAGE_UP:
            navigatePageUp();
            handled = true;
            break;

          case Slick.Keyboard.LEFT:
            handled = navigateLeft();
            break;

          case Slick.Keyboard.RIGHT:
            handled = navigateRight();
            break;

          case Slick.Keyboard.UP:
            handled = navigateUp();
            break;

          case Slick.Keyboard.DOWN:
            handled = navigateDown();
            break;

          case Slick.Keyboard.HOME:
            handled = navigateHome();
            break;

          case Slick.Keyboard.END:
            handled = navigateEnd();
            break;

          case Slick.Keyboard.TAB:
            handled = navigateNext();
            break;

          case Slick.Keyboard.ENTER:
          case Slick.Keyboard.F2:
            if (options.editable) {
              if (getEditorLock().isActive()) {
                assert(currentEditor);
                // adding new row
                if (activeRow === getDataLength()) {
                  navigateDown();
                } else {
                  commitEditAndSetFocus();
                  if (options.autoEdit) {
                    navigateDown();
                  }
                }
              } else {
                assert(!getEditorLock().isActive());
                assert(!currentEditor);
                if (false === makeActiveCellEditable() && !getEditorLock().isActive()) {
                  // Nor us, nor any userland code, did start an editor in this cell.
                  assert(!currentEditor);
                  if (!elementHasFocus($container[0])) {
                    setFocus();
                  }
                }
              }
            }
            handled = true;
            break;
          }
        } else if (which === Slick.Keyboard.TAB && shiftKey && !ctrlKey && !altKey) {
          handled = navigatePrev();
        }
      }

      if (handled) {
        // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
        e.stopPropagation();
        e.preventDefault();
        preventDefaultKeyboardActionHack(e);
      }
      if (options.debug & DEBUG_KEYBOARD) { console.log("key @ end: ", which, handled, e, activeCellInfo, getActiveCell(), document.activeElement); }
    }

    function handleContainerKeyPress(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS | DEBUG_KEYBOARD)) { console.log("keypress @ CONTAINER: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      // move focus back into SlickGrid when it's not already there?
      //
      // N.B. keep in mind that we have those special copy/paste tricks which employ root-level temporary DOM nodes which must catch the keyboard event!
      __handleKeyPress(e);
    }

    function handleKeyPress(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_KEYBOARD)) { console.log("keypress: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      __handleKeyPress(e);
    }

    function __handleKeyPress(e) {
      assert(!(e instanceof Slick.EventData));
      var activeCellInfo = null;
      if (activeCellNode) {
        activeCellInfo = {
          row: activeRow, 
          cell: activeCell,
          node: activeCellNode,
          grid: self
        };
      }
      assert("which" in e);
      var which = e.which;
      var shiftKey = e.shiftKey;
      var altKey = e.altKey;
      var ctrlKey = e.ctrlKey;

      if (options.debug & DEBUG_KEYBOARD) { console.log("KEYPRESS: key @ start: ", which, handled, e, activeCellInfo, getActiveCell(), document.activeElement); }
      trigger(self.onKeyPress, activeCellInfo, e);
      var handled = e.isImmediatePropagationStopped() || e.isPropagationStopped() || e.isDefaultPrevented();

      if (options.debug & DEBUG_KEYBOARD) { console.log("KEYPRESS: key @ after: ", which, handled, e, activeCellInfo, getActiveCell(), document.activeElement); }
      if (!handled) {
        //...
      }

      if (handled) {
        // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
        e.stopPropagation();
        e.preventDefault();
        preventDefaultKeyboardActionHack(e);
      }
      if (options.debug & DEBUG_KEYBOARD) { console.log("KEYUP: key @ end: ", which, handled, e, activeCellInfo, getActiveCell(), document.activeElement); }
    }


    function handleContainerKeyUp(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS | DEBUG_KEYBOARD)) { console.log("keyup @ CONTAINER: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      // move focus back into SlickGrid when it's not already there?
      //
      // N.B. keep in mind that we have those special copy/paste tricks which employ root-level temporary DOM nodes which must catch the keyboard event!
      __handleKeyUp(e);
    }

    function handleKeyUp(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_KEYBOARD)) { console.log("keyup: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      __handleKeyUp(e);
    }

    function __handleKeyUp(e) {
      assert(!(e instanceof Slick.EventData));
      var activeCellInfo = null;
      if (activeCellNode) {
        activeCellInfo = {
          row: activeRow, 
          cell: activeCell,
          node: activeCellNode,
          grid: self
        };
      }
      assert("which" in e);
      var which = e.which;
      var shiftKey = e.shiftKey;
      var altKey = e.altKey;
      var ctrlKey = e.ctrlKey;

      if (options.debug & DEBUG_KEYBOARD) { console.log("KEYUP: key @ start: ", which, handled, e, activeCellInfo, getActiveCell(), document.activeElement); }
      trigger(self.onKeyUp, activeCellInfo, e);
      var handled = e.isImmediatePropagationStopped() || e.isPropagationStopped() || e.isDefaultPrevented();

      if (options.debug & DEBUG_KEYBOARD) { console.log("KEYUP: key @ after: ", which, handled, e, activeCellInfo, getActiveCell(), document.activeElement); }
      if (!handled) {
        //...
      }

      if (handled) {
        // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
        e.stopPropagation();
        e.preventDefault();
        preventDefaultKeyboardActionHack(e);
      }
      if (options.debug & DEBUG_KEYBOARD) { console.log("KEYUP: key @ end: ", which, handled, e, activeCellInfo, getActiveCell(), document.activeElement); }
    }

    function handleContainerContextMenu(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS)) { console.log("container CONTEXTMENU: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      // When there's no activeCell yet and the user clicked on a spot which *will* be covered by a
      // cell once the "lazy render" has run, then we should act if that node was clicked already
      // and activate it right away:
      //
      //var info = getCellFromEvent(e, { clipToValidRange: true });    
      //...
      //
      var cell = getCellFromEvent(e, {
        clipToValidRange: true
      });
      if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS)) { console.log("container event: ", cell); }
      if (cell && cell.sourceInfo && cell.sourceInfo.source === "headers") {
        if (cell.sourceInfo.subSource === "header") {
          __handleHeaderContextMenu(e);
        }
      } else {
        __handleContextMenu(e);
      }
    }

    function handleContainerClickEvent(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS)) { console.log("container CLICK: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      // When there's no activeCell yet and the user clicked on a spot which *will* be covered by a
      // cell once the "lazy render" has run, then we should act if that node was clicked already
      // and activate it right away:
      //
      //var info = getCellFromEvent(e, { clipToValidRange: true });    
      //...
      //
      var cell = getCellFromEvent(e, {
        clipToValidRange: true
      });
      if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS)) { console.log("container event: ", cell); }
      if (cell && cell.sourceInfo && cell.sourceInfo.source === "headers") {
        if (cell.sourceInfo.subSource === "header") {
          __handleHeaderClick(e);
        }
      } else {
        __handleClick(e);
      }
    }

    function handleContainerDblClickEvent(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS)) { console.log("container DOUBLE CLICK: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      // When there's no activeCell yet and the user clicked on a spot which *will* be covered by a
      // cell once the "lazy render" has run, then we should act if that node was clicked already
      // and activate it right away:
      //
      //var info = getCellFromEvent(e, { clipToValidRange: true });    
      //...
      //
      var cell = getCellFromEvent(e, {
        clipToValidRange: true
      });
      if (options.debug & (DEBUG_EVENTS | DEBUG_CONTAINER_EVENTS)) { console.log("container event: ", cell); }
      if (cell && cell.sourceInfo && cell.sourceInfo.source === "headers") {
        if (cell.sourceInfo.subSource === "header") {
          __handleHeaderDblClick(e);
        }
      } else {
        __handleDblClick(e);
      }
    }

    function handleClick(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CLICK)) { console.log("canvas click event: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      __handleClick(e);
    }

    function __handleClick(e) {
      assert(!(e instanceof Slick.EventData));

      var cell = getCellFromEvent(e, {
        clipToValidRange: true
      });
      assert(cell);

      trigger(self.onClick, cell, e);
      var handled = e.isImmediatePropagationStopped() || e.isPropagationStopped() || e.isDefaultPrevented();
      if (handled) {
        return;
      }

      if (!cell) {
        return;
      }

      var row = cell.row;
      var col = cell.cell;
      if (cell.spanInfo) {
        row = cell.spanInfo.row;
        col = cell.spanInfo.cell;
      }

      // if this click resulted in some cell child node getting focus in the userland onClick event handler(s),
      // don't steal it back - keyboard events will still bubble up if the userland code wants them to.
      if (activeCellNode !== cell.node && canCellBeActive(row, col)) {
        if (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()) {
          assert(!currentEditor);
          assert(cell.node);
          gotoCell(row, col, {
            forceEditMode: null, 
            takeFocus: false
          });
        }
      } else if (activeCellNode === cell.node && getEditorLock().isActive()) {
        // When there is an editor active, we make sure the focus jumps back to that editor!
        assert(currentEditor);
        currentEditor.focus();
        assert(document.activeElement !== document.body);
      } else if (activeCellNode === cell.node && !getEditorLock().isActive()) {
        // When there's no editor active on the current cell already, simply focus the grid.
        assert(!currentEditor);
        if (!elementHasFocus($container[0])) {
          setFocus();
        }
      }
    }

    function handleContextMenu(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CLICK)) { console.log("canvas contextmenu event: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      __handleContextMenu(e);
    }

    function __handleContextMenu(e) {
      assert(!(e instanceof Slick.EventData));

      var cell = getCellFromEvent(e, {
        clipToValidRange: true
      });
      assert(cell);

      trigger(self.onContextMenu, cell, e);
      // When the right-click context menu event actually was received by any handlers, 
      // then we make sure no default browser right-click popup menu shows up as well:
      if (self.onContextMenu.handlers().length) {
        // http://stackoverflow.com/questions/10483937/need-to-disable-context-menu-on-right-click-and-call-a-function-on-right-click
        e.preventDefault();
        return false;
      }
    }

    function handleDblClick(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CLICK)) { console.log("canvas dblclick event: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      __handleDblClick(e);
    }

    function __handleDblClick(e) {
      assert(!(e instanceof Slick.EventData));

      var cell = getCellFromEvent(e, {
        clipToValidRange: true
      });
      assert(cell);

      trigger(self.onDblClick, cell, e);
      var handled = e.isImmediatePropagationStopped() || e.isPropagationStopped() || e.isDefaultPrevented();
      if (handled) {
        return;
      }

      if (!cell) {
        return;
      }

      var row = cell.row;
      var col = cell.cell;
      if (cell.spanInfo) {
        row = cell.spanInfo.row;
        col = cell.spanInfo.cell;
      }

      // if this double-click resulted in some cell child node getting focus in the userland onClick event handler(s),
      // don't steal it back - keyboard events will still bubble up if the userland code wants them to.
      if (activeCellNode !== cell.node && canCellBeActive(row, col)) {
        if (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()) {
          assert(!currentEditor);
          assert(!getEditorLock().isActive());
          gotoCell(row, col, {
            forceEditMode: (options.editable ? 2 /* truthy value which "wins" over options.asyncEditorLoading: open the editor immediately! */ : null),
            takeFocus: false
          });
        }
      } else if (activeCellNode === cell.node && getEditorLock().isActive()) {
        // When there is an editor active, we make sure the focus jumps back to that editor!
        assert(currentEditor);
        currentEditor.focus();
        assert(document.activeElement !== document.body);
      } else if (activeCellNode === cell.node && !getEditorLock().isActive()) {
        // When there's no editor active on the current cell already, make it so. (forceEditMode=2 like)
        if (options.editable) {
          // if `cfg.forceEditMode > 1` then show the editor immediately (this happens for instance when the cell is double-clicked)
          if (makeActiveCellEditable() || getEditorLock().isActive()) {
            // We, or any userland code, did start an editor in this cell.
            return;
          }
        }
        assert(!currentEditor);
        assert(!getEditorLock().isActive());
        if (!elementHasFocus($container[0])) {
          setFocus();
        }
      }
    }

    function handleHeaderMouseEnter(e) {
      var headerInfo = getHeaderColumnFromElement(e.target);
      if (options.debug & (DEBUG_EVENTS | DEBUG_MOUSE)) { console.log("header mouseenter event: ", headerInfo, e); }
      if (!headerInfo) {
        return;
      }
      var column = headerInfo.columnDef;
      assert(column);
      if (!headerDragCommencingLock) {
        var rv = trigger(self.onHeaderMouseEnter, {
          column: column,
          cell: getColumnIndex(column.id),
          node: headerInfo.$header[0],
          grid: self
        }, e);
        return rv;
      }
    }

    function handleHeaderMouseLeave(e) {
      var headerInfo = getHeaderColumnFromElement(e.target);
      if (options.debug & (DEBUG_EVENTS | DEBUG_MOUSE)) { console.log("header mouseleave event: ", headerInfo, e); }
      if (!headerInfo) {
        return;
      }
      var column = headerInfo.columnDef;
      assert(column);
      if (!headerDragCommencingLock) {
        var rv = trigger(self.onHeaderMouseLeave, {
          column: column,
          cell: getColumnIndex(column.id),
          node: headerInfo.$header[0],
          grid: self
        }, e);
        return rv;
      }
    }

    function handleHeaderContextMenu(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CLICK)) { console.log("header contextmenu event: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      __handleHeaderContextMenu(e);
    }

    function __handleHeaderContextMenu(e) {
      assert(!(e instanceof Slick.EventData));

      var cell = getCellFromEvent(e, {
        clipToValidRange: true
      });
      assert(cell && cell.sourceInfo && cell.sourceInfo.source === "headers");
      assert(cell && cell.sourceInfo && cell.sourceInfo.subSource === "header");

      if (!cell) {
        return;
      }

      var columnDef = columns[cell.cell];
      assert(columnDef);
      trigger(self.onHeaderContextMenu, {
        column: columnDef,
        cell: cell.cell,
        node: cell.node,
        grid: self
      }, e);
      // when the right-click context menu event actually was received by any handlers, then we make sure no default browser right-click popup menu shows up as well:
      if (self.onHeaderContextMenu.handlers().length) {
        // http://stackoverflow.com/questions/10483937/need-to-disable-context-menu-on-right-click-and-call-a-function-on-right-click
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
    }

    function handleHeaderClick(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CLICK)) { console.log("header click event: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      __handleHeaderClick(e);
    }

    function __handleHeaderClick(e) {
      assert(!(e instanceof Slick.EventData));

      var cell = getCellFromEvent(e, {
        clipToValidRange: true
      });
      assert(cell && cell.sourceInfo && cell.sourceInfo.source === "headers");
      assert(cell && cell.sourceInfo && cell.sourceInfo.subSource === "header");

      if (!cell) {
        return;
      }

      var columnDef = columns[cell.cell];
      assert(columnDef);
      trigger(self.onHeaderClick, {
        column: columnDef,
        cell: cell.cell,
        node: cell.node,
        grid: self
      }, e);
    }

    function handleHeaderDblClick(e) {
      assert(!(e instanceof Slick.EventData));
      if (options.debug & (DEBUG_EVENTS | DEBUG_CLICK)) { console.log("header dblclick event: ", this, arguments, document.activeElement); }
      if (signalEventObserved(e)) {
        return;
      }

      __handleHeaderDblClick(e);
    }

    function __handleHeaderDblClick(e) {
      assert(!(e instanceof Slick.EventData));

      var cell = getCellFromEvent(e, {
        clipToValidRange: true
      });
      assert(cell && cell.sourceInfo && cell.sourceInfo.source === "headers");
      assert(cell && cell.sourceInfo && cell.sourceInfo.subSource === "header");

      if (!cell) {
        return;
      }

      var columnDef = columns[cell.cell];
      assert(columnDef);
      trigger(self.onHeaderDblClick, {
        column: columnDef,
        cell: cell.cell,
        node: cell.node,
        grid: self
      }, e);
    }

    function handleMouseEnter(e) {
      var cellInfo = getCellFromEvent(e, {
        clipToValidRange: true
      });
      assert(cellInfo);
      if (options.debug & (DEBUG_EVENTS | DEBUG_MOUSE)) { console.log("SlickGrid: handleMouseEnter: ", cellInfo, e); }
      var rv = trigger(self.onMouseEnter, cellInfo, e);
      return rv;
    }

    function handleMouseLeave(e) {
      var cellInfo = getCellFromEvent(e, {
        clipToValidRange: true
      });
      assert(cellInfo);
      if (options.debug & (DEBUG_EVENTS | DEBUG_MOUSE)) { console.log("SlickGrid: handleMouseLeave: ", cellInfo, e); }
      var rv = trigger(self.onMouseLeave, cellInfo, e);
      return rv;
    }

    function cellExists(row, cell) {
      // catch NaN, undefined, etc. row/cell values by inclusive checks instead of exclusive checks:
      return (row < getDataLength() && row >= 0 && cell < columns.length && cell >= 0);
    }

    // Return the `{row: ?, cell: ?}` row/column grid coordinate at the given grid pixel coordinate (X, Y).
    //
    // Also return the "fraction" of the position within the row and column, i.e.
    // if the Y coordinate points at a spot 25% from the top of the row, then
    // `returnValue.rowFraction` will be 0.25
    //
    // `returnValue.rowFraction === 0.0` would identify the top pixel within the row.
    // `returnValue.cellFraction === 0.0` would identify the left-most pixel within the cell.
    //
    // When the coordinate points outside the grid, out-of-range row/cell coordinates will be produced.
    function getCellFromPoint(x, y, cfg) {
      assert(!isNaN(x));
      assert(!isNaN(y));
      //cfg = cfg || {};
      var clipToValidRange = cfg && cfg.clipToValidRange;

      var rowInfo = getRowWithFractionFromPosition(y + pageOffset /* + scrollTop ??? */, clipToValidRange);
      var colInfo = getColumnWithFractionFromPosition(x /* + scrollLeft ??? */, clipToValidRange);

      var row = rowInfo.position;
      var cell = colInfo.position;
      var spans = getSpans(row, cell);
      if (spans) {
        // assert(row === spans.row);
        // assert(cell === spans.cell);

        // **NOTE**:
        // 
        // `getCellFromPoint()` & `getCellFromEvent()` are special in that we decode the row and column individually and in the
        // fundamental return values do NOT care about actual rowspan/colspan issues at the intersection point.
        // 
        // When the caller of this function/API is interested in the actual 'live cell' they can go 
        // and look at the `.spanInfo` info that we're including further below.
      } else {
        spans = {
          row: row,
          cell: cell,
          rowspan: 1,
          colspan: 1
        };
      }

      return {
        row: row,
        cell: cell,
        rowFraction: rowInfo.fraction,
        cellFraction: colInfo.fraction,
        cellHeight: rowInfo.height,
        cellWidth: colInfo.width,
        spanInfo: spans
      };
    }

    // Given a cell element, read column number from .l<columnNumber> CSS class
    function getCellFromNode(cellNode) {
      var cls = / l(\d+) /.exec(" " + cellNode.className + " ");
      if (!cls) {
        assert(0, "getCellFromNode: cannot get cell - " + cellNode.className);
        return null;
      }
      return +cls[1];
    }

    // Given a dom element for a row, find out which row index it belongs to
    function getRowFromNode(rowNode) {
      assert(rowNode);
      var rws = / slick-row-(\d+) /.exec(" " + rowNode.className + " ");
      if (!rws) {
        assert(0, "getRowFromNode: cannot get row - " + rowNode.className);
        return null;
      }
      return +rws[1];

      // for (var row = rowsCacheStartIndex, endrow = rowsCache.length; row < endrow; row++) {
      //   if (rowsCache[row]) {
      //     assert(rowsCache[row].rowNode);
      //     if (rowsCache[row].rowNode === rowNode) {
      //       return row;
      //     }
      //   }
      // }

      // return null;
    }

    function getCellFromElement(el) {
      if (!el) {
        return null;
      }
      var $cell = $(el).closest(".slick-cell", $canvas);
      if ($cell.length === 0) {
        return null;
      }

      var node = $cell[0];
      var row = getRowFromNode(node.parentNode);
      var cell = getCellFromNode(node);

      if (row == null || cell == null) {
        return null;
      } else {
        var rowspan = 1;
        var colspan = 1;
        var spans = getSpans(row, cell);
        if (spans) {
          assert(row === spans.row);
          assert(cell === spans.cell);
          row = spans.row;
          cell = spans.cell;
          rowspan = spans.rowspan;
          colspan = spans.colspan;
        }
        assert(cellExists(row, cell) || (options.enableAddRow ? (row === getDataLength() && cell < columns.length && cell >= 0) : true));
        return {
          row: row,
          cell: cell,
          rowspan: rowspan,
          colspan: colspan,
          node: node 
        };
      }
    }

    function getCellFromEvent(e, cfg) {
      cfg = cfg || {};
      
      // dive up the original browser event from the depths of the (optional) Slick.EventData
      while (e && !e.target) {
        e = e.sourceEvent;
      }
      assert(e);
      assert(e && e.target);
      if (!e || !e.target) {
        return null;
      }
      var cell = getCellFromElement(e.target);
      if (!cell && initialized) {
        // dive up the original browser event from the depths of the (optional) Slick.EventData
        var originalEvent = e;
        while (originalEvent && originalEvent.sourceEvent) {
          originalEvent = originalEvent.sourceEvent;
        }
        assert(originalEvent);
        assert(originalEvent && originalEvent.target);
        if (!originalEvent || !originalEvent.target) {
          return null;
        }
        var x = originalEvent.pageX;
        var y = originalEvent.pageY;
        // Correct the coordinate to become one that's relative to the grid VIEWPORT, 
        // then derive the coordinate while accounting for the CANVAS scroll position:
        var vpOffset = $viewport.offset();
        x -= vpOffset.left;
        y -= vpOffset.top;
        cell = getCellFromPoint(x + scrollLeft, y + scrollTop, cfg);  // do clip to nearest legal coordinate!
        if (cell) {
          // Make sure all cell info is included in the returned object.
          // This includes making sure the addressed grid node (DOM Element) does exist. Even
          // if we're only addressing it indirectly, i.e. due to the grid coordinate being clipped!
          assert(cell.spanInfo);
          cell.node = getCellNode(cell.spanInfo.row, cell.spanInfo.cell, true);

          // http://ejohn.org/blog/comparing-document-position/
          // We specifically WANT the 'node contains itself' behaviour that's part of the NATIVE DOM /contains() method!
          if ($viewport[0].contains(originalEvent.target)) {
            // When you got an event originating from inside the viewport itself, we're pointing at a cell, or at least at a row.
            // 
            // Here we assume that you always want a cell node, so clicking outside the canvas/grid range will get you a
            // cell coordinate thanks to row/cell clipping.
            assert(y >= 0); // We wouldn't scroll beyond the top row of the grid so negative Y would be very illogical here!
            assert(x >= 0); // Ditto for scrolling beyond the leftmost column: so negative X would be very illogical here!
            // ^--- we MAY have negative X or Y when you have a canvas and/or viewport styled with borders and happen to click on that border...
            // --> To Be Tested!
            cell.sourceInfo = {
              source: "viewport",
              relX: x,
              relY: y
            }; 
            if (options.debug & (DEBUG_EVENTS | DEBUG_MISC)) { console.log("event inside viewport: ", x, y, cell); }
          } else {
            // The event originates from outside the viewport, so we go and check if we got an event from inside the headers/footers:
            // if it is, we're column-only picking.
            // 
            // If, however, the event is coming from outside the grid container, i.e. from the world at large, then we
            // assume you want the nearest cell coordinate as if you clicked inside the viewport.
            //
            // http://ejohn.org/blog/comparing-document-position/
            // And once again, we specifically WANT the 'node contains itself' behaviour that's part of the NATIVE DOM /contains() method!
            if ($container[0].contains(originalEvent.target)) {
              cell.sourceInfo = {
                source: "headers",
                subSource: "header",
                relX: x,
                relY: y    // y <= 0 --> headers, y > 0 --> footers
              }; 
              cell.node = null;
              var columnDefSrc = columns[cell.cell];
              var i, len, $els, el, columnDef;

              // Now determine if the user clicked in the area of the headers, headerRow or footerRow and fake a node accordingly:
              if ($headers[0].contains(originalEvent.target)) {
                // Fake the node as the lowest level column header node:
                $els = $headers.find(".slick-header-column");
                for (i = 0, len = $els.length; i < len; i++) {
                  el = $els[i];
                  columnDef = $(el).data("column");
                  assert(columnDef);
                  if (columnDef === columnDefSrc) {
                    cell.node = el;
                    break;
                  }
                }
              } else if ($headerRow[0].contains(originalEvent.target)) {
                // Fake the node as the lowest level column header node:
                $els = $headerRow.find(".slick-headerrow-column");
                for (i = 0, len = $els.length; i < len; i++) {
                  el = $els[i];
                  columnDef = $(el).data("column");
                  assert(columnDef);
                  if (columnDef === columnDefSrc) {
                    cell.node = el;
                    cell.sourceInfo.subSource = "headerRow";
                    break;
                  }
                }
              } else if ($footerRow[0].contains(originalEvent.target)) {
                // Fake the node as the lowest level column header node:
                $els = $footerRow.find(".slick-footerrow-column");
                for (i = 0, len = $els.length; i < len; i++) {
                  el = $els[i];
                  columnDef = $(el).data("column");
                  assert(columnDef);
                  if (columnDef === columnDefSrc) {
                    cell.node = el;
                    cell.sourceInfo.subSource = "footerRow";
                    break;
                  }
                }
              }
              if (options.debug & (DEBUG_EVENTS | DEBUG_MISC)) { console.log("event inside headers/footers: ", x, y, cell); }
            } else {
              // The event originates from the outside world: clip to legal coordinate
              cell.sourceInfo = {
                source: "outside",
                relX: x,    // x < 0 --> left of viewport, x > 0: right of viewport
                relY: y     // y < 0 --> above viewport, y > 0 --> below viewport
              }; 
              if (options.debug & (DEBUG_EVENTS | DEBUG_MISC)) { console.log("event from outside grid container: ", x, y, cell); }
            }
          }
        }
      }
      return cell;
    }

    function getRowFromEvent(e) {
      // dive up the original browser event from the depths of the (optional) Slick.EventData
      while (e && !e.target) {
        e = e.sourceEvent;
      }
      assert(e);
      assert(e && e.target);
      if (!e || !e.target) {
        return null;
      }
      var $row = $(e.target).closest(".slick-row", $canvas);
      if (!$row.length) {
        return null;
      }
      return getRowFromNode($row[0]);
    }

    function getCellNodeBox(row, cell) {
      if (!cellExists(row, cell)) {
        // Are we perhaps looking at the "new data row at the bottom"?
        // If not, then we are indeed outside the grid allowed area.
        if (!options.enableAddRow || !cellExists(row - 1, cell)) {
          return null;
        }
      }

      var rowspan = 1;
      var colspan = 1;
      var spans = getSpans(row, cell);
      if (spans) {
        assert(row === spans.row);
        assert(cell === spans.cell);
        row = spans.row;
        cell = spans.cell;
        rowspan = spans.rowspan;
        colspan = spans.colspan;
      } else {
        spans = {
          row: row,
          cell: cell,
          rowspan: rowspan,
          colspan: colspan
        };
      }

      var y1 = getRowTop(row) - pageOffset;
      var y2 = getRowTop(row + rowspan) - pageOffset;
      var x1 = getColumnOffset(cell);
      var x2 = getColumnOffset(cell + colspan);

      return {
        top: y1,
        left: x1,
        bottom: y2,
        right: x2,
        spanInfo: spans
      };
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Cell switching

    function resetActiveCell() {
      setActiveCellInternal(null, {
        forceEditMode: 0, 
        takeFocus: false
      });
    }

    function setFocus() {
      var e = new Slick.EventData();
      trigger(self.onFocusSet, null, e);
      var handled = e.isHandled();
      if (handled) {
        return;
      }

      if (options.debug & DEBUG_FOCUS) { console.log("setFocus: SET FOCUS TO A SINK: START"); }
      if (tabbingDirection === -1) {
        $focusSink[0].focus();
        assert(document.activeElement === $focusSink[0]);
      } else {
        $focusSink2[0].focus();
        assert(document.activeElement === $focusSink2[0]);
      }
      if (options.debug & DEBUG_FOCUS) { console.log("setFocus: SET FOCUS TO A SINK: END"); }
    }

    // Return TRUE when the element itself or any of its child nodes has focus.
    function elementHasFocus(el) {
      var activeEl = document.activeElement;
      if (!el || !activeEl || activeEl === document.body) {
        return false;
      }
      var outermost = $container[0].parentNode;
      while (activeEl && activeEl !== outermost && activeEl !== document.body) {
        if (activeEl === el) {
          return true;
        }
        activeEl = activeEl.parentNode;
      }
      return false;
    }

    // This get/set methods are used for keeping text-selection.
    // These don't consider IE because they don't loose text-selection.
    function getTextSelection() {
      var selection = null;
      if (window.getSelection && window.getSelection().rangeCount > 0) {
        selection = window.getSelection().getRangeAt(0);
      }
      return selection;
    }

    function setTextSelection(selection) {
      if (window.getSelection && selection) {
        var target = window.getSelection();
        target.removeAllRanges();
        target.addRange(selection);
      }
    }

    // TODO: commit SHA-1: fc61ae0bbb360fe3b3f8d3dd461431c67537733c :: describe the API. code is TODO.
    function scrollCellIntoView(row, cell, doPaging, doCenteringY) {
      scrollRowIntoView(row, doPaging, doCenteringY);

      // Clip `cell` to renderable range:
      assert(cell >= 0);
      assert(cell < columns.length);
      cell = Math.min(columns.length, Math.max(0, cell));

      var colspan = getColspan(row, cell);
      var left = columnPosLeft[cell],
          right = columnPosLeft[cell + colspan],
          scrollRight = scrollLeft + viewportW;    // availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW

      // TODO: options.scrollHoldoffX
      if (left < scrollLeft) {
        $viewport.scrollLeft(left);
        if (handleScroll()) {
          render();
        }
      } else if (right > scrollRight) {
        $viewport.scrollLeft(Math.min(left, right - $viewport[0].clientWidth));
        if (handleScroll()) {
          render();
        }
      }
    }

    function setActiveCellInternal(newCellNode, /* @const */ cfg) {
      // Also check which node currently has focus *before* we send events and thus give userland
      // code opportunity to revert/modify/move the focus.
      // 
      // Note that the focus doesn't have to be on the activeCellNode right now!
      var oldFocusNode = document.activeElement;
      var oldFocusCellInfo = getCellFromElement(oldFocusNode);

      assert(cfg); // opt_editMode, takeFocus, coordinate
      var forceEditMode = cfg.forceEditMode; 

      var activeCellChanged = (activeCellNode != newCellNode);
      var newActiveRow;
      if (newCellNode != null) {
        newActiveRow = getRowFromNode(newCellNode.parentNode);
        assert(newActiveRow != null);
        if (forceEditMode == null) {
          forceEditMode = (options.enableAddRow && newActiveRow === getDataLength() && options.autoEditAddRow) || options.autoEdit;
        }
      }
      // convert the boolean-or-numeric setting to a guaranteed number 0, 1 or 2/3/...:
      forceEditMode = (forceEditMode && forceEditMode > 1 ? forceEditMode : +!!forceEditMode);

      // onActiveCellChanging should fire before we *might* instantiate an editor!
      // This order of events is important so that the editor-augmented cell instance doesn't get
      // influenced by any initial onActiveCellChanging that concerns the cell itself.
      //
      // It also allows us to renege on the "cell change" inside this event handler without
      // too much trouble (or so we can hope)...
      var e = new Slick.EventData();
      if (activeCellChanged) {
        trigger(self.onActiveCellChanging, {
          activeCell:     newCellNode,
          prevActiveCell: activeCellNode,
          editMode:       forceEditMode,
          grid:           self
        }, e);
        if (e.isHandled()) {
          return false;
        }
      }

      if (activeCellNode != null) {
        makeActiveCellNormal();
        $(activeCellNode)
          .removeClass("active")
          .parent().removeClass("active-row");          // We don't know the old PosY so this only works well for rowspan=1 cells
      }

      var prevActiveCellNode = activeCellNode;
      activeCellNode = newCellNode;

      if (newCellNode != null) {
        assert(activeCellNode);
        activeRow = getRowFromNode(newCellNode.parentNode);
        activeCell = getCellFromNode(newCellNode);
        assert(activeRow != null);
        assert(activeCell != null);
        assert(forceEditMode != null);
        // Only update the active cursor coordinate (which may be anywhere inside the cell span!)
        // when the coordinate is either outside the current cell span OR when the caller has 
        // explicitly demanded we set the cursor coordinate as well:
        var spans = getSpans(activeRow, activeCell);
        if (!spans) {
          spans = {
            row: activeRow,
            cell: activeCell,
            colspan: 1,
            rowspan: 1
          };
        }
        assert(spans.row === activeRow);
        assert(spans.cell === activeCell);
        if (cfg.forcePosition || activePosY == null || activePosX == null || activePosY < spans.row || activePosY >= spans.row + spans.rowspan || activePosX < spans.cell || activePosX >= spans.cell + spans.colspan) {
          activePosY = activeRow;
          activePosX = activeCell;
        }

        assert($(newCellNode).parent()[0] === rowsCache[activeRow].rowNode);
        $(newCellNode)
        .addClass("active");
        if (rowsCache[activePosY] && rowsCache[activePosY].rowNode) {
          $(rowsCache[activePosY].rowNode)
          .addClass("active-row");
        }

        if (activeCellChanged) {
          //activeCellNode.focus();
          trigger(self.onActiveCellChanged, {
            activeCell:     newCellNode,
            prevActiveCell: prevActiveCellNode,
            editMode:       forceEditMode,
            grid:           self
          }, e);
          if (e.isHandled()) {
            return true;
          }
        }

        // When the old active cell had focus, move focus to the new active cell.
        // 
        // Subtleties to mind here: 
        // - the userland code for the event handler above MAY have changed the active cell node on us!
        // - we only SET/MOVE the focus when the current focus is still on the old active cell node
        // - any userland code in the event handlers which places focus elsewhere is therefore rendering
        //   this code nil and void: we won't touch page focus here when this would be the case.
        // - general FOCUS LOSS is recognized by observing that the active focus is on the document 
        //   BODY element. Any userland code which moves the focus around is assumed not to "loose focus"
        //   like that, i.e. such focus-shifting userland code is assumed to set focus to 
        //   *another* DOM element that is not inside SlickGrid AND is not the BODY element itself.
        //    
        var oldFocusNode2 = document.activeElement;
        // TODO: detect focus moving in userland code.
        
        if (!oldFocusCellInfo && (oldFocusNode === document.body || cfg.takeFocus)) {
          // fake it to simplify the conditional check below:
          oldFocusCellInfo = {
            node: oldFocusNode
          };
        }
        var newActiveCellInfo = getCellFromElement(activeCellNode);
        assert(newActiveCellInfo);
        assert(newActiveCellInfo.node);
        if (options.debug & DEBUG_FOCUS) { console.log("focus fixup: ", oldFocusNode, oldFocusCellInfo, activeCellNode, newActiveCellInfo); }
        if (oldFocusCellInfo && oldFocusCellInfo.node !== newActiveCellInfo.node) {
          if (options.debug & DEBUG_FOCUS) { console.log("focus fixup exec START: ", document.activeElement); }
          movingFocusLock++;
          // We MAY see a sequence of focusout+focusin, where by the time focusin fires, document.activeElement is BODY.
          // We MAY also see only a focusin, in which case we are to provide the original focused node.
          movingFocusLockData[movingFocusLock - 1] = {
            newNode: activeCellNode,
            oldNode: oldFocusNode,
            oldNodeInfo: oldFocusCellInfo
          };
          activeCellNode.focus();
          assert(document.activeElement === activeCellNode);
          movingFocusLock--;
          if (!movingFocusLock) {
            movingFocusLockData = [];
          }
          if (options.debug & DEBUG_FOCUS) { console.log("focus fixup exec END: ", document.activeElement); }
        }

        if (options.editable && forceEditMode && isCellPotentiallyEditable(activeRow, activeCell)) {
          // if `forceEditMode > 1` then show the editor immediately (this happens for instance when the cell is double-clicked)
          if (options.asyncEditorLoading >= forceEditMode) {
            h_editorLoader = setTimeout(function h_show_editor_f() {
              makeActiveCellEditable();
            }, options.asyncEditorLoadDelay);
          } else {
            if (false === makeActiveCellEditable() && !getEditorLock().isActive()) {
              // Nor us, nor any userland code, did start an editor in this cell.
              assert(!currentEditor);
              if (!elementHasFocus($container[0])) {
                setFocus();
              }
            }
          }
        }
      } else {
        assert(activeCellNode == null);
        activeRow = activeCell = null;
        activePosX = activePosY = null;

        // when the activeCellNode is reset, we *still* want to retain focus inside SlickGrid
        // if we had it previously: that way we ensure the keyboard events etc. will continue
        // to arrive at the appropriate handlers.
        if (!oldFocusCellInfo && (oldFocusNode === document.body || cfg.takeFocus)) {
          // fake it to simplify the conditional check below:
          oldFocusCellInfo = {
            node: oldFocusNode
          };
        }
        if (oldFocusCellInfo) {
          // As the active cell is about to loose focus, we (temporarily) switch focus to one of the sinks
          // so that the node removal from the DOM does not drop focus, which would consequently 
          // loose us keyboard events, at least for the (very) short time period between DOM
          // cell removal and re-render. That would cause symptoms of "erratic keyboard behaviour"
          // and we cannot have that!

          if (options.debug & DEBUG_FOCUS) { console.log("focus fixup exec (reset active cell) START: ", oldFocusCellInfo); }
          movingFocusLock++;
          // We MAY see a sequence of focusout+focusin, where by the time focusin fires, document.activeElement is BODY.
          // We MAY also see only a focusin, in which case we are to provide the original focused node.
          movingFocusLockData[movingFocusLock - 1] = {
            newNode: $focusSink[0],
            oldNode: oldFocusNode,
            oldNodeInfo: oldFocusCellInfo
          };
          $focusSink[0].focus();
          assert(document.activeElement === $focusSink[0]);
          movingFocusLock--;
          if (!movingFocusLock) {
            movingFocusLockData = [];
          }
          if (options.debug & DEBUG_FOCUS) { console.log("focus fixup exec (reset active cell) END: ", oldFocusCellInfo); }
        }
      }
      return true;
    }

    function clearTextSelection() {
      if (document.selection && document.selection.empty) {
        try {
          // IE fails here if selected element is not in DOM
          document.selection.empty();
        } catch (e) { }
      } else if (window.getSelection) {
        var sel = window.getSelection();
        if (sel && sel.removeAllRanges) {
          sel.removeAllRanges();
        }
      }
    }

    function isCellPotentiallyEditable(row, cell) {
      // is this coordinate legal?
      var dataLength = getDataLength();
      if (!(row <= dataLength && row >= 0 && cell < columns.length && cell >= 0)) {
        return false;
      }

      // is the data for this row loaded?
      if (row < dataLength && !getDataItem(row)) {
        return false;
      }

      // are we in the Add New row?  
      // can we create a new row from this cell?
      assert(columns[cell]);
      if (row === dataLength && (!options.enableAddRow || columns[cell].cannotTriggerInsert)) {
        return false;
      }

      // does this cell have an editor?
      if (!getEditor(row, cell)) {
        return false;
      }

      return true;
    }

    function makeActiveCellNormal() {
      if (!getEditorLock().isActive()) {
        assert(!currentEditor);
        return;
      }

      // Reset the global var as any node.destroy() can trigger additional focusout events which will trigger a commit:
      // only by immediately resetting the global and keeping the "old" value locally for further processing
      // can we prevent nested invocations of this code (and consequent crashes in jQuery).
      assert(currentEditor);
      var editor = currentEditor;
      currentEditor = null;
      var e = new Slick.EventData();
      trigger(self.onBeforeCellEditorDestroy, {
        editor: editor,
        grid: self
      }, e);
      assert(!currentEditor);
      if (e.isHandled()) {
        return;
      }
      editor.destroy();

      if (activeCellNode) {
        var d = getDataItem(activeRow);
        var $activeCellNode = $(activeCellNode);
        $activeCellNode.removeClass("editable invalid");
        var column = columns[activeCell];
        var rowMetadata = data.getItemMetadata && data.getItemMetadata(activeRow, activeCell);
        // look up by id, then index
        var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[column.id] || rowMetadata.columns[activeCell]);
        // I/F: function mkCellHtml(row, cell, rowMetadata, columnMetadata, rowDataItem)
        var info = mkCellHtml(activeRow, activeCell, rowMetadata, columnMetadata, d);
        assert(info.html != null);
        updateElementHtml($activeCellNode, info);
        invalidatePostProcessingResults(activeRow, activeCell);
      }

      // if there previously was text selected on a page (such as selected text in the edit cell just removed),
      // IE can't set focus to anything else correctly
      if (isBrowser.msie) {
        clearTextSelection();
      }

      getEditorLock().deactivate(editController);
    }

    function makeActiveCellEditable(editor) {
      // cancel pending async call if there is one
      clearTimeout(h_editorLoader);
      h_editorLoader = null;

      if (!activeCellNode) {
        return false;
      }
      if (!options.editable) {
        throw new Error("Grid : makeActiveCellEditable : should never get called when options.editable is false");
      }

      if (!isCellPotentiallyEditable(activeRow, activeCell)) {
        return false;
      }

      var columnDef = columns[activeCell];
      var item = getDataItem(activeRow);
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(activeRow, activeCell);

      // look up by id, then index
      var columnMetadata = rowMetadata &&
          rowMetadata.columns &&
          (rowMetadata.columns[column.id] || rowMetadata.columns[activeCell]);

      var e = new Slick.EventData();
      trigger(self.onBeforeEditCell, {
        row: activeRow,
        cell: activeCell,
        item: item,
        column: columnDef,
        rowMetadata: rowMetadata,
        columnMetadata: columnMetadata,
        grid: self
      }, e);
      if (e.isHandled()) {
        if (!elementHasFocus($container[0]) && !currentEditor) {
          setFocus();
        }
        return false;
      }

      getEditorLock().activate(editController);
      $(activeCellNode).addClass("editable");

      // `UseEditor` is a reference to the desired editor *constructor*:
      var UseEditor = editor || getEditor(activeRow, activeCell);
      assert(UseEditor);
    
      // ## About `suppressClearOnEdit` / `clearCellBeforeEdit` settings in other SlickGrid clones
      //
      // We solve this another way by *not* externalizing that bit behaviour from the editor;
      // instead, we always let the editor handle this situation itself for maximum flexibility 
      // and organized control: every editor instance receives a reference to the cell 
      // DOM container node, among other things, so the editor code can perform this optional
      // 'cleanup before we add our own editor-specific DOM content' at initialization time
      // any way it wishes.

      // don't clear the cell if a custom editor is passed through
      if (!editor && options.clearCellBeforeEdit) {
        activeCellNode.innerHTML = "";
      }

      var info = __extend({}, options.editorOptions, columnDef.editorOptions, rowMetadata && rowMetadata.editorOptions, columnMetadata && columnMetadata.editorOptions, {
        grid: self,
        gridPosition: getGridPosition(),
        position: getActiveCellPosition(),
        container: activeCellNode,
        row: activeRow,
        cell: activeCell,
        column: columnDef,
        item: item || {},
        rowMetadata: rowMetadata,
        columnMetadata: columnMetadata,
        commitChanges: commitEditAndSetFocus,
        cancelChanges: cancelEditAndSetFocus
      });
      currentEditor = new UseEditor(info);

      // assert that the complete editor API is available:
      assert(currentEditor);
      assert(typeof currentEditor.init === "function");
      assert(typeof currentEditor.destroy === "function");
      assert(typeof currentEditor.focus === "function");
      assert(typeof currentEditor.setDirectValue === "function");
      assert(typeof currentEditor.loadValue === "function");
      assert(typeof currentEditor.serializeValue === "function");
      assert(typeof currentEditor.applyValue === "function");
      assert(typeof currentEditor.isValueChanged === "function");
      assert(typeof currentEditor.validate === "function");
      assert(typeof currentEditor.save === "function");
      assert(typeof currentEditor.cancel === "function");
      assert(typeof currentEditor.hide === "function");
      assert(typeof currentEditor.show === "function");
      assert(typeof currentEditor.position === "function");

      if (item) {
        currentEditor.loadValue(item);
      }

      serializedEditorValue = currentEditor.serializeValue();

      var cellBox = getActiveCellPosition();
      if (!cellBox.visible) {
        currentEditor.hide();
      } else {
        currentEditor.show();
        currentEditor.focus();
        assert(document.activeElement !== document.body);
      }
      // old code for this chunk was:         handleActiveCellPositionChange();

      return currentEditor; // this is a truthy return value
    }

    function commitEditAndSetFocus() {
      // if the commit fails, it would do so due to a validation error
      // if so, do not steal the focus from the editor
      if (getEditorLock().commitCurrentEdit()) {
        setFocus();
      }
    }

    function cancelEditAndSetFocus() {
      if (getEditorLock().cancelCurrentEdit()) {
        setFocus();
      }
    }

    function getActiveCellPosition() {
      return Slick.BoxInfo(activeCellNode);
    }

    function getGridPosition() {
      return Slick.BoxInfo($container[0]);
    }

    function handleActiveCellPositionChange(evt) {
      if (!activeCellNode) {
        return;
      }

      var e = new Slick.EventData(evt);
      trigger(self.onActiveCellPositionChanged, null, e);
      if (e.isHandled()) {
        return;
      }

      if (currentEditor) {
        var cellBox = getActiveCellPosition();
        if (currentEditor.show && currentEditor.hide) {
          if (!cellBox.visible) {
            currentEditor.hide();
          } else {
            currentEditor.show();
          }
        }

        if (currentEditor.position) {
          currentEditor.position({
            gridPosition: getGridPosition(),
            position: cellBox,
            container: activeCellNode
          });
        }
      }
    }

    function getCellEditor() {
      return currentEditor;
    }

    function getActiveCell() {
      if (!activeCellNode) {
        return null;
      } else {
        return {
          row: activeRow, 
          cell: activeCell,
          grid: self
        };
      }
    }

    function getActiveCellNode() {
      return activeCellNode;
    }

    // TODO: commit SHA-1: fc61ae0bbb360fe3b3f8d3dd461431c67537733c :: describe the API. code is TODO.
    function scrollRowIntoView(row, doPaging, doCenteringY) {
      // Clip `row` to renderable range:
      // assert(row >= 0);
      // assert(row < getDataLengthIncludingAddNew());
      row = Math.min(getDataLengthIncludingAddNew(), Math.max(0, row));

      var height = viewportH - (viewportHasHScroll ? scrollbarDimensions.height : 0);
      var rowAtTop = getRowTop(row);
      var rowAtBottom = getRowBottom(row) - height;

      // TODO: options.scrollHoldoffY

      // need to center row?
      if (doCenteringY) {
        var centerOffset = (height - options.rowHeight) / 2;
        if (scrollTo(rowAtTop - centerOffset, null)) {
          render();
        }
      }
      // need to page down?
      if (getRowBottom(row) > scrollTop + viewportH + pageOffset) {
        if (scrollTo((doPaging ? rowAtTop : rowAtBottom), null)) {
          render();
        }
      }
      // or page up?
      else if (getRowTop(row) < scrollTop + pageOffset) {
        if (scrollTo((doPaging ? rowAtBottom : rowAtTop), null)) {
          render();
        }
      }
    }

    function scrollRowToTop(row) {
      // Clip `row` to renderable range:
      assert(row >= 0);
      assert(row < getDataLengthIncludingAddNew());
      row = Math.min(getDataLengthIncludingAddNew(), Math.max(0, row));

      if (scrollTo(getRowTop(row), null)) {
        render();
      }
    }

    function scrollRowToCenter(row) {
      // Clip `row` to renderable range:
      assert(row >= 0);
      assert(row < getDataLengthIncludingAddNew());
      row = Math.min(getDataLengthIncludingAddNew(), Math.max(0, row));

      // TODO: account for the variable row height: actually measure to determine the offset towards the center
      var height = viewportH - (viewportHasHScroll ? scrollbarDimensions.height : 0);
      var offset = (height - options.rowHeight) / 2;
      if (scrollTo(row * options.rowHeight - offset, null)) {
        render();
      }
    }

    function scrollPage(dir) {
      var topRow = getRowWithFractionFromPosition(scrollTop + pageOffset, false);
      var bottomRow = getRowWithFractionFromPosition(scrollTop + pageOffset + viewportH, false);
      var deltaRows = dir * (bottomRow.position - topRow.position);
      // adjust the page positions according to the scroll direction and "speed" (`dir` can be a number other than +1 or -1):
      topRow.position += deltaRows;
      var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
      if (topRow.position >= dataLengthIncludingAddNew) {
        topRow.position = dataLengthIncludingAddNew - 1;
      }
      if (topRow.position < 0) {
        topRow.position = 0;
      }
      assert(topRow.position >= 0);
      var y = getRowTop(topRow.position);
      if (scrollTo(y, null)) {
        render();
      }

      if (options.enableCellNavigation && activeRow != null) {
        var row = activeRow + deltaRows;
        if (row >= dataLengthIncludingAddNew) {
          row = dataLengthIncludingAddNew - 1;
        }
        if (row < 0) {
          row = 0;
        }

        var cell = 0, prevCell = -1;
        var prevActivePosX = activePosX;
        while (cell <= activePosX) {
          if (canCellBeActive(row, cell)) {
            prevCell = cell;
          }
          cell += getColspan(row, cell);
        }

        if (prevCell !== -1) {
          var node = getCellNode(row, prevCell, true);
          assert(node);
          setActiveCellInternal(node, {
            forceEditMode: null, 
            takeFocus: false
          });
          activePosX = prevActivePosX;
        } else {
          resetActiveCell();
        }
      }
    }

    function navigatePageDown() {
      scrollPage(1);
    }

    function navigatePageUp() {
      scrollPage(-1);
    }

    function getSpans(row, cell) {
      if (!data.getItemMetadata) {
        return null;
      }

      function fillCellSpanCache() {
        var col,
            colspan,
            rowspan,
            metadata,
            columnData,
            iRowSpans,
            iCellSpans,
            colCount = columns.length,
            dataLength = getDataLength(),
            rowI,
            rowU;
        var rowSpanU;

        function fillSpanRow() {
          cellSpans[rowI] = {
            maxRowSpan: 1
          };
          return cellSpans[rowI];
        }

        function fillSpanArea() {
          iCellSpans = {
            row: rowI, 
            cell: ci, 
            rowspan: rowspan, 
            colspan: colspan
          };

          // save pointers to span all cells and rows covered by the span:
          for (var rs = rowI; rs <= rowSpanU; rs++) {
            var cellSpansRow = cellSpans[rs] || (cellSpans[rs] = {
              maxRowSpan: rowSpanU - rowI + 1
            });
            for (var cs = ci; cs < ci + colspan; cs++) {
              cellSpansRow[cs] = iCellSpans;
            }
          }
        }

        for (rowI = cellSpans.length, rowU = row; rowI <= rowU; rowI++) {
          metadata = data.getItemMetadata(rowI, cell);

          // current row might have cell spans filled in prev row iterations
          iRowSpans = cellSpans[rowI] || fillSpanRow();

          if (!metadata || !metadata.columns) {
            continue;
          }

          for (var ci = 0; ci < colCount; ci += colspan) {
            col = columns[ci];

            iCellSpans = iRowSpans[ci];

            // the ci-th cell is occupied by a prev cell with row and/or cell span > 1
            if (iCellSpans) {
              colspan = ci - iCellSpans.cell + iCellSpans.colspan;
              continue;
            }

            // look up by id, then index
            columnData = metadata.columns[col.id] || metadata.columns[ci];
            if (!columnData) {
              colspan = 1;
              continue;
            }

            colspan = columnData.colspan || 1;
            rowspan = columnData.rowspan || 1;
            if (rowspan > dataLength - rowI) {
              rowspan = dataLength - rowI;
            }
            if (colspan === "*") {
              colspan = colCount - ci;
            }
            if (rowspan > iRowSpans.maxRowSpan) {
              iRowSpans.maxRowSpan = rowspan;
            }

            if (rowspan > 1 || colspan > 1) {
              rowSpanU = rowI + rowspan - 1;
              fillSpanArea();
              // We need to collect spans for rows overlapped by the cell as empty/null
              // span slots are assumed to represent 1-by-1 cells:
              if (rowSpanU > rowU) {
                rowU = rowSpanU;
              }
            }
          }
        }
      }

      fillCellSpanCache();

      return cellSpans[row] && cellSpans[row][cell];
    }

    function getColspan(row, cell) {
      var spans = getSpans(row, cell);
      assert(spans ? spans.colspan >= 1 : true);
      return spans ? spans.colspan - cell + spans.cell : 1;
    }

    function getRowspan(row, cell) {
      var spans = getSpans(row, cell);
      assert(spans ? spans.rowspan >= 1 : true);
      return spans ? spans.rowspan - row + spans.row : 1;
    }

    /** Returns the row index of the cell that spans to the cell specified by `row` and `cell`. */
    function getSpanRow(row, cell) {
      var spans = getSpans(row, cell);
      return spans ? spans.row : row;
    }

    /** Returns the column index of the cell that spans to the cell specified by `row` and `cell`. */
    function getSpanCell(row, cell) {
      var spans = getSpans(row, cell);
      return spans ? spans.cell : cell;
    }

    function gotoRight(row, cell, posY, posX) {
      if (row == null || cell == null) {
        assert(0);
        return null;
      }
      assert(posY != null);
      assert(posX != null);

      var lastCell = columns.length - 1;
      var spanRow, endCell;
      var spans;

      row = posY;
      assert(row >= 0);
      assert(cell >= 0);
      assert(cell <= lastCell);
      
      // In the beginning, we may be at a cell that's midway in a span: skip the span we're currently at
      endCell = cell;
      spans = getSpans(row, cell);
      if (spans) {
        assert(cell >= spans.cell);
        endCell = spans.cell + spans.colspan - 1;
      }
      // Find next focusable cell in this row
      for (cell = endCell + 1; cell <= lastCell; cell = endCell + 1) {
        spanRow = row;
        endCell = cell;
        spans = getSpans(row, cell);
        if (spans) {
          spanRow = spans.row;
          assert(cell === spans.cell);
          endCell = spans.cell + spans.colspan - 1;
        }
        if (canCellBeActive(spanRow, cell)) {
          // The returned (row, cell) coordinate MUST be the top/left corner of the cell span:
          return {
            row: spanRow,
            cell: cell,
            posY: posY,
            posX: cell
          };
        }
      }
      return null;
    }

    function gotoLeft(row, cell, posY, posX) {
      if (row == null || cell == null) {
        assert(0);
        return null;
      }
      assert(posY != null);
      assert(posX != null);

      var spanRow, spanCell;
      var spans;

      row = posY;      
      assert(row >= 0);
      assert(cell >= 0);
      assert(cell < columns.length);

      // In the beginning, we may be at a cell that's midway in a span: skip the span we're currently at
      spanCell = cell;
      spans = getSpans(row, cell);
      if (spans) {
        assert(cell >= spans.cell);
        spanCell = spans.cell;
      }
      // Find next focusable cell in this row
      for (cell = spanCell - 1; cell >= 0; cell = spanCell - 1) {
        spanRow = row;
        spanCell = cell;
        spans = getSpans(row, cell);
        if (spans) {
          spanRow = spans.row;
          spanCell = spans.cell;
        }
        if (canCellBeActive(spanRow, spanCell)) {
          // The returned (row, cell) coordinate MUST be the top/left corner of the cell span:
          return {
            row: spanRow,
            cell: spanCell,
            posY: posY,
            posX: spanCell
          };
        }
      }
      return null;
    }

    function gotoDown(row, cell, posY, posX) {
      if (row == null || cell == null) {
        assert(0);
        return null;
      }
      assert(posY != null);
      assert(posX != null);

      var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
      var spanCell, endRow;
      var spans;
      
      cell = posX;
      assert(row >= 0);
      assert(row < dataLengthIncludingAddNew);
      assert(cell >= 0);
      assert(cell < columns.length);
      
      // In the beginning, we may be at a row that's midway in a span: skip the span we're currently at
      endRow = row;
      spans = getSpans(row, cell);
      if (spans) {
        assert(row >= spans.row);
        endRow = spans.row + spans.rowspan - 1;
      }
      // Find next focusable row in this column
      for (row = endRow + 1; row < dataLengthIncludingAddNew; row = endRow + 1) {
        endRow = row;
        spanCell = cell;
        spans = getSpans(row, cell);
        if (spans) {
          spanCell = spans.cell;
          assert(row === spans.row);
          endRow = spans.row + spans.rowspan - 1;
        }
        if (canCellBeActive(row, spanCell)) {
          // The returned (row, cell) coordinate MUST be the top/left corner of the cell span:
          return {
            row: row,
            cell: spanCell,         
            posY: row,
            posX: posX 
          };
        }
      }
      return null;
    }

    function gotoUp(row, cell, posY, posX) {
      if (row == null || cell == null) {
        assert(0);
        return null;
      }
      assert(posY != null);
      assert(posX != null);

      var spanRow, spanCell;
      var spans;

      cell = posX;      
      assert(row >= 0);
      assert(cell >= 0);
      assert(cell < columns.length);

      // In the beginning, we may be at a row that's midway in a span: skip the span we're currently at
      spanRow = row;
      spans = getSpans(row, cell);
      if (spans) {
        assert(row >= spans.row);
        spanRow = spans.row;
      }
      // Find next focusable row in this column
      for (row = spanRow - 1; row >= 0; row = spanRow - 1) {
        spanRow = row;
        spanCell = cell;
        spans = getSpans(row, cell);
        if (spans) {
          spanRow = spans.row;
          spanCell = spans.cell;
        }
        if (canCellBeActive(spanRow, spanCell)) {
          // The returned (row, cell) coordinate MUST be the top/left corner of the cell span:
          return {
            row: spanRow,
            cell: spanCell,
            posY: spanRow,
            posX: posX
          };
        }
      }
      return null;
    }

    function gotoNext(row, cell, posY, posX) {
      var origRow = row, origCell = cell;

      if (row == null && cell == null) {
        row = cell = posY = posX = 0;
      }
      assert(posY != null);
      assert(posX != null);

      var lastCell = columns.length - 1;
      var spanRow, endCell;
      var spans;

      // Scan right, then down, to find the next focusable grid cell.
      // Wrap at the end.
      // 
      // Note: we loop length PLUS ONE lines, because worst case 
      // we may find the "next" focusable cell on the same line we
      // currently are, but just *left* of us!
      var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
      row = posY;
      cell = posX;
      assert(row >= 0);
      assert(cell >= 0);
      assert(cell <= lastCell);
      
      // In the beginning, we may be at a cell that's midway in a span: skip the span we're currently at
      endCell = cell;
      spans = getSpans(row, cell);
      if (spans) {
        assert(cell >= spans.cell);
        endCell = spans.cell + spans.colspan - 1;
      }
      for (var i = 0; i <= dataLengthIncludingAddNew; i++) {
        //var pos = gotoRight(posY, cell, posY, posX);
        // Find next focusable cell in this row
        for (cell = endCell + 1; cell <= lastCell; cell = endCell + 1) {
          spanRow = row;
          endCell = cell;
          spans = getSpans(row, cell);
          if (spans) {
            spanRow = spans.row;
            assert(cell === spans.cell);
            endCell = spans.cell + spans.colspan - 1;
          }
          if (!(spanRow === origRow && cell === origCell) && canCellBeActive(spanRow, cell)) {
            // The returned (row, cell) coordinate MUST be the top/left corner of the cell span:
            return {
              row: spanRow,
              cell: cell,
              posY: posY,
              posX: cell
            };
          }
        }
        // Scan from the start of the next line & wrap at end if we have to
        cell = posX = 0;
        row = posY = (posY + 1) % dataLengthIncludingAddNew;
        // Check the first cell on this new row:
        spanRow = row;
        endCell = cell;
        spans = getSpans(row, cell);
        if (spans) {
          spanRow = spans.row;
          assert(cell === spans.cell);
          endCell = spans.cell + spans.colspan - 1;
        }
        if (!(spanRow === origRow && cell === origCell) && canCellBeActive(spanRow, cell)) {
          // The returned (row, cell) coordinate MUST be the top/left corner of the cell span:
          return {
            row: spanRow,
            cell: cell,
            posY: posY,
            posX: cell
          };
        }
      }
      return null;
    }

    function gotoPrev(row, cell, posY, posX) {
      var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
      var lastCol = columns.length - 1;
      
      var origRow = row, origCell = cell;

      if (row == null && cell == null) {
        row = posY = dataLengthIncludingAddNew - 1;
        cell = posX = lastCol;
      }
      assert(posY != null);
      assert(posX != null);

      var spanRow, spanCell;
      var spans;

      // Scan left, then up, to find the previous focusable grid cell.
      // Wrap at the top.
      // 
      // Note: we loop length PLUS ONE lines, because worst case 
      // we may find the "previous" focusable cell on the same line we
      // currently are, but just *right* of us!
      row = posY;
      cell = posX;      
      assert(row >= 0);
      assert(cell >= 0);
      assert(cell < columns.length);

      // In the beginning, we may be at a cell that's midway in a span: skip the span we're currently at
      spanCell = cell;
      spans = getSpans(row, cell);
      if (spans) {
        assert(cell >= spans.cell);
        spanCell = spans.cell;
      }
      for (var i = 0; i <= dataLengthIncludingAddNew; i++) {
        // Find next focusable cell in this row
        for (cell = spanCell - 1; cell >= 0; cell = spanCell - 1) {
          spanRow = row;
          spanCell = cell;
          spans = getSpans(row, cell);
          if (spans) {
            spanRow = spans.row;
            spanCell = spans.cell;
          }
          if (!(spanRow === origRow && spanCell === origCell) && canCellBeActive(spanRow, spanCell)) {
            // The returned (row, cell) coordinate MUST be the top/left corner of the cell span:
            return {
              row: spanRow,
              cell: spanCell,
              posY: posY,
              posX: spanCell
            };
          }
        }
        // Scan from the end of the previous line & wrap at top if we have to
        cell = posX = lastCol;
        row = posY = (posY - 1 + dataLengthIncludingAddNew) % dataLengthIncludingAddNew;
        // Check the last cell on this new row:
        spanRow = row;
        spanCell = cell;
        spans = getSpans(row, cell);
        if (spans) {
          spanRow = spans.row;
          spanCell = spans.cell;
        }
        if (!(spanRow === origRow && spanCell === origCell) && canCellBeActive(spanRow, spanCell)) {
          // The returned (row, cell) coordinate MUST be the top/left corner of the cell span:
          return {
            row: spanRow,
            cell: spanCell,
            posY: posY,
            posX: spanCell
          };
        }
      }
      return null;
    }

    function gotoEnd(row, cell, posY, posX) {
      var origRow = row, origCell = cell;

      var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
      var lastRow = dataLengthIncludingAddNew - 1;
      var lastCol = columns.length - 1;

      row = posY = lastRow;
      cell = posX = lastCol;
      var spans = getSpans(row, cell);
      if (spans) {
        row = spans.row;
        cell = spans.cell;
      }
      // The returned (row, cell) coordinate MUST be the top/left corner of the cell span:
      var pos = {
        row: row,
        cell: cell,
        posY: posY,
        posX: posX
      };
      // no change: do not end up once again where we already are right now.
      if (!(pos.row === origRow && pos.cell === origCell) && canCellBeActive(row, cell)) {
        return pos;
      }
      return null;
    }

    function gotoHome(row, cell, posY, posX) {
      var origRow = row, origCell = cell;

      row = posY = 0;
      cell = posX = 0;
      // no need to call getSpans(0, 0) as it top/left corner will be (0, 0) no matter what col/rowspan it has.
      var pos = {
        row: row,
        cell: cell,
        posY: posY,
        posX: posX
      };
      // no change: do not end up once again where we already are right now.
      if (!(pos.row === origRow && pos.cell === origCell) && canCellBeActive(row, cell)) {
        return pos;
      }
      return null;
    }

    function navigateRight() {
      return navigate(NAVIGATE_RIGHT);
    }

    function navigateLeft() {
      return navigate(NAVIGATE_LEFT);
    }

    function navigateDown() {
      return navigate(NAVIGATE_DOWN);
    }

    function navigateUp() {
      return navigate(NAVIGATE_UP);
    }

    function navigateNext() {
      return navigate(NAVIGATE_NEXT);
    }

    function navigatePrev() {
      return navigate(NAVIGATE_PREV);
    }

    function navigateHome() {
      return navigate(NAVIGATE_HOME);
    }

    function navigateEnd() {
      return navigate(NAVIGATE_END);
    }

    /**
     * @internal [private description]
     * 
     * @param {string} dir Navigation direction.
     * 
     * @return {boolean} Whether navigation resulted in a change of active cell.
     */
    function navigate(dir) {
      if (!options.enableCellNavigation) {
        return false;
      }

      if (!activeCellNode) {
        // We're not on an active cell right now, so we won't know where to move to next. 
        // See if a cell/row/column has focus and if so, use that one to base the move on unless the 
        // userland event handler tells us otherwise; 
        // simply scroll in the indicated direction if possible.
        // 
        // Note that we MAY arrive at this peculiar situation when we haven't rendered the
        // `activeNode`, hence we *do* check the render-result-independent `activeCell` and
        // `activeRow` settings before we travel any further:
        assert(!activeCell);
        assert(!activeRow);
        assert(!getEditorLock().isActive());
        var focusedNode = getCellFromElement(document.activeElement);
        if (focusedNode) {
          setActiveCellInternal(focusedNode, {
            forceEditMode: null, 
            takeFocus: false
          });
          assert(activeCellNode);
          // and continue with the regular execution path for activeCellNode
        } else {
          // WARNING: the stepFunctions assume a starting coordinate to be valid
          // so that they can properly step through the col/rowspans. 
          // Today we are not located on a cell per se, so we simply move a
          // given number of rows/columns in the indicated direction.
          var visible = getVisibleRange();
          assert(visible);
          var left = getCellFromPoint(visible.topPx, visible.leftPx);
          var right = getCellFromPoint(visible.topPx, visible.rightPx);
          var row, cell;
          switch (dir) {
          case NAVIGATE_UP:
            row = visible.top - 1;
            if (row >= 0) {
              scrollRowIntoView(row, false, false);
            }
            break;

          case NAVIGATE_DOWN:
            row = visible.bottom + 1;
            if (row >= 0) {
              scrollRowIntoView(row, false, false);
            }
            visible.top += 1;
            visible.bottom += 1;
            break;

          case NAVIGATE_LEFT:
            visible.left -= 1;
            visible.right -= 1;
            break;

          case NAVIGATE_RIGHT:
            visible.left += 1;
            visible.right += 1;
            break;

          default:
            assert(0);
            break;
          }
        }

        return false;
      }

      if (!getEditorLock().commitCurrentEdit()) {
        return true;
      }

      tabbingDirection = tabbingDirections[dir];
      setFocus();

      var node;
      var stepFn = stepFunctions[dir];
      assert(activeRow != null);
      assert(activeCell != null);
      assert(activePosY != null);
      assert(activePosX != null);
      var pos = stepFn(activeRow, activeCell, activePosY, activePosX);
      if (pos) {
        assert(pos.row != null);
        assert(pos.cell != null);
        assert(pos.posX != null);
        assert(pos.posY != null);
        activePosY = pos.posY;
        activePosX = pos.posX;
        var isAddNewRow = (pos.row === getDataLength());
        scrollCellIntoView(pos.row, pos.cell, (options.skipPaging ? false : !isAddNewRow));
        node = getCellNode(pos.row, pos.cell, true);
        assert(node);
        setActiveCellInternal(node, {
          forceEditMode: null, 
          takeFocus: false
        });
        return true;
      } else if (activeCellNode) {
        node = getCellNode(activeRow, activeCell, true);
        assert(node);
        setActiveCellInternal(node, {
          forceEditMode: null, 
          takeFocus: false
        });
        return false;
      } else {
        assert(activeRow == null && activeCell == null);
        resetActiveCell();
        return false;
      }
    }

    var callCount = 0;

    /**
     * Get a reference to the grid cell DOM element. When the DOM element exists,
     * it will be refreshed on the spot if it has been invalidated (i.e. flagged "dirty")
     * before.
     *
     * @param  {number} row       The row index
     * @param  {number} cell      The column index
     * @param  {boolean} mandatory When TRUE, the cell will be rendered on the spot if it hasn't been rendered yet.
     *
     * @return {Element}          The DOM Element which represents the grid node at coordinates (row, cell). NULL when the given coordinate has not been rendered yet or does not exist for other reasons (e.g. when the given coordinate is located outside the data range or when the given coordinate sits inside a row/colspanning cell and isn't its top/left corner coordinate).
     */
    function getCellNode(row, cell, mandatory) {
      callCount++;
      assert(callCount === 1);
      var cacheEntry = rowsCache[row];
      if (cacheEntry || mandatory) {
        ensureCellNodesInRowsCache(row);
        var node = cacheEntry && cacheEntry.cellNodesByColumnIdx[cell];
        var dirty = cacheEntry && cacheEntry.dirtyCellNodes[cell];

        var needToReselectCell = false;
        if (!node && mandatory) {
          // force render the new active cell
          // 
          // WARNING: under rare circumstances may the renderer *still* decide *not* to render
          // the grid (e.g. when a custom/user onRenderStart event handler decides to signal 
          // that rendering is currently undesirable) hence we MUST anticipate the unlikely
          // situation where the rowCache will be empty after the next call!
          needToReselectCell = forcedRenderCriticalCell(row, cell);

          // and then attempt fetching the DOM node again:
          if (rowsCache[row]) {
            assert(rowsCache[row].cellNodesByColumnIdx);
            assert(rowsCache[row].cellNodesByColumnIdx.length > cell);
            node = rowsCache[row].cellNodesByColumnIdx[cell];
            assert(node);
            if (needToReselectCell) {
              assert(rowsCache[activeRow]);
              assert(rowsCache[activeRow].cellNodesByColumnIdx);
              assert(rowsCache[activeRow].cellNodesByColumnIdx.length > activeCell);
              activeCellNode = getCellNode(activeRow, activeCell, true);
              assert(activeCellNode);
            }
          } else {
            node = null;
          }
        } else if (dirty) {
          assert(node);
          updateCellInternal(row, cell, cacheEntry, node);
        }
        callCount--;
        return node;
      }
      assert(!mandatory);
      callCount--;
      return null;
    }

    function setActiveCell(row, cell, cfg) {
      cfg = cfg || {};

      if (!initialized) { return; }
      // catch NaN, undefined, etc. row/cell values by inclusive checks instead of exclusive checks:
      if (cellExists(row, cell)) {
        if (!options.enableCellNavigation) {
          return;
        }

        scrollCellIntoView(row, cell, false);
        var node = getCellNode(row, cell, true);
        // assert(node);
        setActiveCellInternal(node, cfg);
      }
    }

    function canCellBeActive(row, cell) {
      // catch NaN, undefined, etc. row/cell values by inclusive checks instead of exclusive checks:
      if (options.enableCellNavigation && row < getDataLengthIncludingAddNew() && row >= 0 && cell < columns.length && cell >= 0) {
        var column = columns[cell];
        var rowMetadata = data.getItemMetadata && data.getItemMetadata(row, cell);
        if (rowMetadata) {
          var columnMetadata = rowMetadata.columns;
          // look up by id, then index
          columnMetadata = columnMetadata && (columnMetadata[column.id] || columnMetadata[cell]);
          if (columnMetadata) {
            if (columnMetadata.transparent) {
              return false;
            }
            if (columnMetadata.focusable != null) {
              return columnMetadata.focusable;
            }
          }

          if (rowMetadata.focusable != null) {
            return rowMetadata.focusable;
          }
        }

        return column.focusable;
      }
      return false;
    }

    function canCellBeSelected(row, cell) {
      // catch NaN, undefined, etc. row/cell values by inclusive checks instead of exclusive checks:
      if (cellExists(row, cell)) {
        var rowMetadata = data.getItemMetadata && data.getItemMetadata(row, cell);
        if (rowMetadata && rowMetadata.selectable != null) {
          return rowMetadata.selectable;
        }

        var column = columns[cell];
        // look up by id, then index
        var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[column.id] || rowMetadata.columns[cell]);
        if (columnMetadata && columnMetadata.selectable != null) {
          return columnMetadata.selectable;
        }

        return column.selectable;
      }
      return false;
    }

    function gotoCell(row, cell, /* @const */ cfg) {
      cfg = cfg || {};

      if (!initialized) { return; }
      if (!canCellBeActive(row, cell)) {
        return;
      }

      if (!getEditorLock().commitCurrentEdit()) {
        return;
      }

      scrollCellIntoView(row, cell, false);

      var newCellNode = getCellNode(row, cell, true);
      assert(newCellNode);

      // if selecting the "add new" row, start editing right away
      setActiveCellInternal(newCellNode, cfg);

      // if no editor was created, set the focus back on the grid
      if (!elementHasFocus($container[0]) && !currentEditor) {
        setFocus();
      }
    }


    //////////////////////////////////////////////////////////////////////////////////////////////
    // IEditor implementation for the editor lock

    function commitCurrentEdit() {
      var item = getDataItem(activeRow);
      var column = columns[activeCell];
      var evt;

      if (currentEditor) {
        if (currentEditor.isValueChanged()) {
          var validationResults = currentEditor.validate();

          if (validationResults.valid) {
            if (activeRow < getDataLength()) {
              assert(item);
              evt = self.onCellChange;
            } else {
              item = item || {};
              evt = self.onAddNewRow;
            }
            var editCommand = {
              grid: self,
              row: activeRow,
              cell: activeCell,
              item: item,
              column: column,
              editor: currentEditor,
              serializedValue: currentEditor.serializeValue(),
              prevSerializedValue: serializedEditorValue,
              execute: function h_exec_edit_cmd_f() {
                assert(this === editCommand);
                this.appliedValue = this.serializedValue;
                this.editor.applyValue(item, this.appliedValue);
                updateCell(this.row, this.cell);
                this.notify();
              },
              undo: function h_undo_edit_cmd_f() {
                assert(this === editCommand);
                this.appliedValue = this.prevSerializedValue;
                this.editor.applyValue(item, this.appliedValue);
                updateCell(this.row, this.cell);
                this.notify();
              },
              notify: function h_notify_edit_cmd_f() {
                assert(this === editCommand);
                trigger(evt, this);
              }
            };

            if (options.editCommandHandler) {
              options.editCommandHandler(item, column, editCommand);
            } else {
              editCommand.execute();
            }
            makeActiveCellNormal();

            // check whether the lock has been re-acquired by event handlers
            return !getEditorLock().isActive();
          } else {
            // Re-add the CSS class to trigger transitions, if any.
            assert(activeCellNode);
            var $activeCellNode = $(activeCellNode);
            $activeCellNode.removeClass("invalid");
            $activeCellNode.outerWidth();  // force layout
            $activeCellNode.addClass("invalid");

            var e = new Slick.EventData();
            var retval = trigger(self.onValidationError, {
              row: activeRow,
              cell: activeCell,
              item: item,
              column: column,
              editor: currentEditor,
              prevSerializedValue: serializedEditorValue,
              cellNode: activeCellNode,
              validationResults: validationResults,
              grid: self
            }, e);
            if (e.isHandled()) {
              return retval;
            }

            currentEditor.focus();
            assert(document.activeElement !== document.body);
            return false;
          }
        }

        makeActiveCellNormal();
      }
      return true;
    }

    function cancelCurrentEdit() {
      makeActiveCellNormal();
      return true;
    }

    /**
     * Produce a set of `Range`s from the given set of row index numbers.
     *
     * @param  {Array} ranges  A set of row index numbers.
     * @param  {Options:Object} cfg    
     *                         These options are supported:
     *                         
     *                         - `sort` : Guarantee that the range set produced is sorted in ascending row order.
     *                         - `merge` : Guarantee that the range set produced has adjacent rows merged into one `Range`;
     *                           with this option *disabled*, each row will be represented by an individual `Range` instance.
     *
     *                         When you do not provide this object (or specify `null` or another falsey value here instead)
     *                         the default settings will be used: both `sort` and `dedup` will be **enabled**. 
     *
     * @return {Array}         A set of `Range` objects representing the given rows.
     */
    function rowsToRanges(rows, cfg) {
      var option_sort, option_merge;
      if (!cfg) {
        option_sort = false;
        option_merge = true;
      } else {
        option_sort = !!cfg.sort;
        option_merge = !!cfg.merge;
      }
      var i, len;      
      var first_row, last_row, current_row;
      var ranges = [];
      if (rows.length === 0) {
        return ranges;
      }
      var lastCell = columns.length - 1;

      // 'sort' is implicit when 'merge' is required:
      if (option_sort || option_merge) {
        rows.sort(function rowSortComparer_f(a, b) { 
          return a - b; 
        });

        if (option_merge) {
          for (i = 0, len = rows.length; i < len; i++) {
            ranges.push(new Slick.Range(rows[i], 0, rows[i], lastCell));
          }
        } else {
          assert(rows.length >= 1);
          first_row = last_row = rows[0];
          for (i = 1, len = rows.length; i < len; i++) {
            current_row = rows[i];
            if (current_row === last_row + 1) {
              last_row = current_row;
            } else {
              ranges.push(new Slick.Range(first_row, 0, last_row, lastCell));
              first_row = last_row = current_row;
            }
          }
          ranges.push(new Slick.Range(first_row, 0, last_row, lastCell));
        }
      }
      return ranges;
    }

    /**
     * Produce a row set from the given set of ranges.
     *
     * @param  {Array} ranges  A set of `Range` objects.
     * @param  {Options:Object} cfg    
     *                         These options are supported:
     *                         
     *                         - `sort` : Guarantee that the row set produced is sorted in ascending order.
     *                         - `dedup` : Guarantee that the row set produced does not contain any duplicate row indices.
     *
     *                         When you do not provide this object (or specify `null` or another falsey value here instead)
     *                         the default settings will be used: both `sort` and `dedup` will be **enabled**. 
     *
     * @return {Array}         A set of row index numbers.
     */
    function rangesToRows(ranges, cfg) {
      var option_sort, option_dedup;
      if (!cfg) {
        option_sort = false;
        option_dedup = true;
      } else {
        option_sort = !!cfg.sort;
        option_dedup = !!cfg.dedup;
      }

      var i, len;
      var rows = [];
      for (i = 0, len = ranges.length; i < len; i++) {
        var range = ranges[i];
        for (var j = range.fromRow, jj = range.toRow; j <= jj; j++) {
          rows.push(j);
        }
      }
      // Note: when `dedup` (deduplicate output) is enabled, this implies `sort = true`
      if (option_dedup || option_sort) {
        rows.sort(function rowSortComparer_f(a, b) { 
          return a - b; 
        });

        if (option_dedup) {
          var previous_row = -1e9;
          var filtered_rows = [];
          for (i = 0, len = rows.length; i < len; i++) {
            var current_row = rows[i];
            if (current_row !== previous_row) {
              filtered_rows.push(current_row);
              previous_row = current_row; 
            }
          }
          rows = filtered_rows;
        }
      } 
      return ranges;
    }

    function getSelectedRows() {
      if (!selectionModel) {
        throw new Error("Selection model is not set");
      }
      return selectedRows;
    }

    function setSelectedRows(rows) {
      if (!selectionModel) {
        throw new Error("Selection model is not set");
      }
      selectionModel.setSelectedRanges(rowsToRanges(rows));
    }
    
    function getSelectedRanges() {
      if (!selectionModel) {
        throw new Error("Selection model is not set");
      }
      return selectedRanges;
    }

    function setSelectedRanges(ranges) {
      if (!selectionModel) {
        throw new Error("Selection model is not set");
      }
      selectionModel.setSelectedRanges(ranges);
    }
    
    function scrollPort(pxVertical, pxHorizontal) {
      if (scrollTo(pxVertical, pxHorizontal)) {
        render();
      }
    }

    // @TO-BE-INSPECTED
      
    function updateColumnWidthBounds() {
      columnsById = {};
      $.each(columns, function (i) {
        var m = columns[i] = $.extend({}, columnDefaults, columns[i]);
        columnsById[m.id] = i;
        // make sure width is between its bounds: `minWidth <= width <= maxWidth`
        m.width = Math.min(Math.max(m.width, m.minWidth), m.maxWidth);
      });
    }

    // /@TO-BE-INSPECTED


    //////////////////////////////////////////////////////////////////////////////////////////////
    // Debug

    this.getStateInfo = function getStateInfo_f() { 
      return {
        rowsCache: rowsCache, // Super important object, responsible for the present rendered dom of the rows
        uiRegions: {
          topViewport: topViewport,
          topCanvas: topCanvas,
          header: header,
          subHeader: subHeader,
          contentViewportWrap: contentViewportWrap,
          contentViewport: contentViewport,
          contentCanvas: contentCanvas,
          rows: rows
        },
        colInfo: {
          columnPosLeft:  columnPosLeft,
          columnPosRight: columnPosRight
        },
        scrollInfo: {
          visibleRange: getVisibleRange(),
          renderedRange: getRenderedRange(),
          offset: offset,
          scrollTop: scrollTop,
          lastRenderedScrollTop: lastRenderedScrollTop,
          lastRenderedScrollLeft: lastRenderedScrollLeft,
          numVisibleRows: numVisibleRows
        }
      } 
    };

    //
    // --STRIP-THIS-CODE--START--
    //
    /* jshint -W061 */     //! jshint : eval can be harmful

    this.debug = function slickGridDebug_f($dst) {
      var s = "";

      s += ("\n" + "counter_rows_rendered:  " + counter_rows_rendered);
      s += ("\n" + "counter_rows_removed:  " + counter_rows_removed);
      s += ("\n" + "renderedRows:  " + renderedRows);
      s += ("\n" + "maxSupportedCssHeight:  " + maxSupportedCssHeight);
      s += ("\n" + "n(umber of pages):  " + numberOfPages);
      s += ("\n" + "(current) page:  " + page);
      s += ("\n" + "page height (pageHeight):  " + pageHeight);
      s += ("\n" + "vScrollDir:  " + vScrollDir);

      if ($dst) {
        $dst.text(s);
      } else {
        alert(s);
      }
    };

    // a debug helper to be able to access private members
    this.eval = function slickGridEval_f(expr) {
      return eval(expr);
    };

    /* jshint +W061 */
    //
    // --STRIP-THIS-CODE--END--
    //

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Public API

    __extend(this, /* @nocollapse */ {
      slickGridVersion: "2.3.18-alpha.1011",

      // Events
      onScroll: new Slick.Event(),
      onSort: new Slick.Event(),
      onHeaderMouseEnter: new Slick.Event(),
      onHeaderMouseLeave: new Slick.Event(),
      onHeaderContextMenu: new Slick.Event(),
      onHeaderClick: new Slick.Event(),
      onHeaderDblClick: new Slick.Event(),
      onHeaderCellRendered: new Slick.Event(),
      onBeforeHeaderCellDestroy: new Slick.Event(),
      onHeaderRowCellRendered: new Slick.Event(),
      onBeforeHeaderRowCellDestroy: new Slick.Event(),
      onFooterRowCellRendered: new Slick.Event(),
      onBeforeFooterRowCellDestroy: new Slick.Event(),
      onFocusIn: new Slick.Event(),
      onFocusOut: new Slick.Event(),
      onFocusMoved: new Slick.Event(),
      onFocusSet: new Slick.Event(),
      onMouseEnter: new Slick.Event(),
      onMouseLeave: new Slick.Event(),
      onClick: new Slick.Event(),
      onDblClick: new Slick.Event(),
      onContextMenu: new Slick.Event(),
      onKeyDown: new Slick.Event(),
      onKeyPress: new Slick.Event(),
      onKeyUp: new Slick.Event(),
      onAddNewRow: new Slick.Event(),
      onValidationError: new Slick.Event(),
      onInvalidate: new Slick.Event(),
      onCanvasWidthChanged: new Slick.Event(),
      onViewportChanged: new Slick.Event(),
      onColumnsStartReorder: new Slick.Event(),
      onColumnsReordering: new Slick.Event(),
      onColumnsReordered: new Slick.Event(),
      onColumnsStartResize: new Slick.Event(), // onColumnsResizeStart
      onColumnsResizing: new Slick.Event(),
      onColumnsResized: new Slick.Event(),
      onColumnCalcWidth: new Slick.Event(),
      onColumnsChanged: new Slick.Event(),
      onCellChange: new Slick.Event(),
      onBeforeEditCell: new Slick.Event(),
      onBeforeCellEditorDestroy: new Slick.Event(),
      onAfterInit: new Slick.Event(),
      onBeforeDestroy: new Slick.Event(),
      onActiveCellChanging: new Slick.Event(),
      onActiveCellChanged: new Slick.Event(),
      onActiveCellPositionChanged: new Slick.Event(),
      onHeaderDragInit: new Slick.Event(),
      onHeaderDragStart: new Slick.Event(),
      onHeaderDrag: new Slick.Event(),
      onHeaderDragEnd: new Slick.Event(),
      onDragInit: new Slick.Event(),
      onDragStart: new Slick.Event(),
      onDrag: new Slick.Event(),
      onDragEnd: new Slick.Event(),
      onSelectedRangesChanged: new Slick.Event(),
      onCellCssStylesChanged: new Slick.Event(),
      onRowsRendered: new Slick.Event(),
      onRenderStart: new Slick.Event(),
      onRenderEnd: new Slick.Event(),

      // Methods
      registerPlugin: registerPlugin,
      unregisterPlugin: unregisterPlugin,
      getId: getId,
      getColumnsInfo: getColumnsInfo,
      getColumns: getColumns,
      getColumnIndexFromEvent: getColumnIndexFromEvent,
      getColumnFromEvent: getColumnFromEvent,
      setColumns: setColumns,
      updateColumnWidths: updateColumnWidths,
      getLeafColumns: getLeafColumns,
      getColumnIndex: getColumnIndex,
      updateColumnHeader: updateColumnHeader,
      setSortColumn: setSortColumn,
      setSortColumns: setSortColumns,
      getSortColumns: getSortColumns,
      autosizeColumns: autosizeColumns,
      setupColumnResize: setupColumnResize,
      getOptions: getOptions,
      setOptions: setOptions,
      getData: getData,
      getDataLength: getDataLength,
      getDataItem: getDataItem,
      setData: setData,
      getSelectionModel: getSelectionModel,
      setSelectionModel: setSelectionModel,
      getSelectedRows: getSelectedRows,
      setSelectedRows: setSelectedRows,
      getSelectedRanges: getSelectedRanges,
      setSelectedRanges: setSelectedRanges,
      getContainerNode: getContainerNode,
      getDataItemValueForColumn: getDataItemValueForColumn,
      setDataItemValueForColumn: setDataItemValueForColumn,
      getCellValueAndInfo: getCellValueAndInfo,
      isInitialized: isInitialized,

      render: render,
      forcedRender: forcedRender,
      isRenderPending: isRenderPending,
      pauseRendering: pauseRendering,
      resumeRendering: resumeRendering,
      invalidate: invalidate,
      invalidateCell: invalidateCell,
      invalidateCellSpan: invalidateCellSpan,
      invalidateColumn: invalidateColumn,
      invalidateColumns: invalidateColumns,
      invalidateRow: invalidateRow,
      invalidateRows: invalidateRows,
      invalidateAllRows: invalidateAllRows,
      invalidateAllPostProcessingResults: invalidateAllPostProcessingResults,
      updateCell: updateCell,
      updateRow: updateRow,
      getCachedRowRangeInfo: getCachedRowRangeInfo,
      getViewport: getVisibleRange,
      getRenderedRange: getRenderedRange,
      getContentSize: getContentSize,
      getVisibleSize: getVisibleSize,
      resizeCanvas: resizeCanvas,
      updateRowCount: updateRowCount,
      scrollRowIntoView: scrollRowIntoView,
      scrollRowToTop: scrollRowToTop,
      scrollRowToCenter: scrollRowToCenter,
      scrollCellIntoView: scrollCellIntoView,
      scrollTo: scrollTo,
      getCanvasNode: getCanvasNode,
      focus: setFocus,

      getCellFromPoint: getCellFromPoint,
      getCellFromElement: getCellFromElement,
      getCellFromEvent: getCellFromEvent,
      getRowFromEvent: getRowFromEvent,
      getActiveCell: getActiveCell,
      setActiveCell: setActiveCell,
      getActiveCellNode: getActiveCellNode,
      getActiveCellPosition: getActiveCellPosition,
      resetActiveCell: resetActiveCell,
      editActiveCell: makeActiveCellEditable,
      commitEditAndSetFocus: commitEditAndSetFocus,
      cancelEditAndSetFocus: cancelEditAndSetFocus,

      getCellEditor: getCellEditor,
      getCellNode: getCellNode,
      getCellNodeBox: getCellNodeBox,
      canCellBeSelected: canCellBeSelected,
      canCellBeActive: canCellBeActive,
      cellExists: cellExists,
      navigatePrev: navigatePrev,
      navigateNext: navigateNext,
      navigateUp: navigateUp,
      navigateDown: navigateDown,
      navigateLeft: navigateLeft,
      navigateRight: navigateRight,
      navigatePageUp: navigatePageUp,
      navigatePageDown: navigatePageDown,
      navigateHome: navigateHome,
      navigateEnd: navigateEnd,
      gotoCell: gotoCell,
      getTopPanel: getTopPanel,
      setTopPanelVisibility: setTopPanelVisibility,
      setHeaderRowVisibility: setHeaderRowVisibility,
      getHeaderRow: getHeaderRow,
      getHeaderRowColumn: getHeaderRowColumn,
      getHeadersColumn: getHeadersColumn,
      setFooterRowVisibility: setFooterRowVisibility,
      getFooterRow: getFooterRow,
      getFooterRowColumn: getFooterRowColumn,
      getGridPosition: getGridPosition,
      flashCell: flashCell,
      addCellCssStyles: addCellCssStyles,
      setCellCssStyles: setCellCssStyles,
      removeCellCssStyles: removeCellCssStyles,
      upsertCellCssStyles: upsertCellCssStyles,
      getCellCssStyles: getCellCssStyles,
      setCssRule: setCssRule,

      handleKeyDown: handleKeyDown,

      init: finishInitialization,
      destroy: destroy,

      // IEditor implementation
      getEditorLock: getEditorLock,
      getEditController: getEditController,

      // export utility function(s)
      scrollPort: scrollPort,
      rangesToRows: rangesToRows,
      rowsToRanges: rowsToRanges
    });

    init();
  }

  // export Slick.Grid
  $.extend(true, window, {
    Slick: {
      Grid: SlickGrid
    }
  });

}(window, jQuery));
