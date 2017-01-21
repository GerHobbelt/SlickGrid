/*!
 * @license
 * slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
 * Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
 *
 * Distributed under MIT license.
 * All rights reserved.
 */




/**
 * Contains SlickGrid model classes.
 * 
 * @memberof Slick
 * @namespace Data
 */



/**
 * Contains SlickGrid data aggregator classes for use with the model classes.
 * 
 * @memberof Slick.Data
 * @namespace Aggregators
 */





/**
 * ## Core concepts

SlickGrid is very flexible in how it consumes the data.  The data is passed to the grid via the constructor and can also be accessed using the `setData(data)` and `getData()` methods.  Data itself can be either an array-like object with a `length` property and an indexer (`data[index]`) or a custom data provider implementing the following interface:

* `getLength()` - returns the number of data items in the set
* `getItem(index)` - returns the item at a given index
* `getItemMetadata(index)` - returns the metadata for the item at a given index (optional)


DataView (`Slick.Data.DataView` included in [slick.dataview.js](../blob/master/slick.dataview.js)) is one such data provider and it is part of the SlickGrid package.
 
If all of the data is available on the client (i.e. in a JavaScript array), DataView can provide many useful features that the grid itself doesn't have. (This fact that the grid lacks these features is by design - SlickGrid tries to keep the core lean and simple while encouraging modular design and data abstraction in its API.)

DataView works by taking in your data and acting as a data provider that you pass to SlickGrid instead of your original data array. For example, if you make DataView group data, it makes the grid think that the "group" rows are just regular data items, so the grid doesn't need to be aware of them. DataView tells the grid that those items have a custom display and behavior and provides implementations of both. You then wire up DataView's `onRowCountChanged` and `onRowsChanged` events to update the grid and voila.

Here's a rough list of features that DataView adds to the grid:

* Paging.
* Multi-column sorting.
* Search.
* Multi-level grouping with totals.
* Expand/collapse groups.

DataView also enables very efficient updates in response to the changing data.  Whenever something changes, it detects which rows need updating, and passes them in the `onRowCountChanged` and `onRowsChanged` events that it fires, so instead of rerendering the entire grid, you can simply invalidate the updated rows.


## Getting started

To use the DataView, include `slick.dataview.js`:

```javascript
// Create the DataView.
var dataView = new Slick.Data.DataView();

//Create columns
var columns = [
  {id: "column1", name: "ID", field: "id"},
  {id: "column2", name: "Language", field: "lang"},
  {id: "column3", name: "Year", field: "year"}
];

// Pass it as a data provider to SlickGrid.
var grid = new Slick.Grid(containerEl, dataView, columns, options);

// Make the grid respond to DataView change events.
dataView.onRowCountChanged.subscribe(function (e, args) {
  grid.updateRowCount();
  grid.render();
});

dataView.onRowsChanged.subscribe(function (e, args) {
  grid.invalidateRows(args.rows);
  grid.render();
});
```

Now we're ready to initialize it with some data.
One important requirement that DataView imposes on the data it consumes is that every item has a unique identifier.  DataView uses it to uniquely identify items and compare them to each other.  By default, DataView uses the `id` property of the data item, but you can specify a different one by passing it in via an optional second argument in the `setItems(data, [objectIdProperty])`.  The `id` value must be serializable to a string.

```javascript
var data = [
  {'id': 'l1', 'lang': 'Java', 'year': 1995},
  {'id': 'l2', 'lang': 'JavaScript', 'year': 1995},
  {'id': 'l3', 'lang': 'C#', 'year': 2000},
  {'id': 'l4', 'lang': 'Python', 'year': 1991}];

// This will fire the change events and update the grid.
dataView.setItems(data);
```

You can call `getItems()` to get the data array back.


## Mapping rows vs items

Ok, let's reiterate - DataView takes in a data array as an input, manipulates it, and presents the results to the grid by acting as a data provider, i.e. exposing the data provider methods `getItem(index)`, `getLength()` and `getItemMetadata(index)`.  In handling grid events, it's important to always keep in mind that the row indexes the grid refers to are, in fact, the indexes into the output of the DataView!  For example, if you're handling a grid `onClick` event and it's giving you a row index, to look up the data item, you need to call `dataView.getItem(rowIndex)` and *not* `data[rowIndex]`.

In general, whenever we talk about *rows*, we mean the data as the grid sees it, so, if you're using a DataView, that would be the *output* of the DataView (`dataView.getItem(index)`).  Whenever we talk about *items*, we mean the *input* of the DataView (`data[index]` or `dataView.getItems()[index]`).  You'll notice that it is somewhat confusing that `getItem(index)` returns a *row* while `getItems()` returns *items*.  Unfortunately, it's this way for historical reasons.  `getItem(index)` is part of the  data provider interface.  In retrospect, it would be better if the DataView exposed a `getDataProvider()` method.

### DataView Methods

Since each item has a unique id, they are often used to keep track of ids/items/rows/indices and to map one to another.

These methods are exposed by the DataView as part of the data provider interface:

* `getItems()` - Returns the original data array.
* `getItem(row)` - With a row index of an item in the grid, return the item.
* `getItemMetadata(idx)` - Returns the item metadata at a given index.
* `getLength()` - Returns the number of rows in the grid.

DataView exposes several methods in order to map ids to items to rows in the grid to indices in the original data array:

* `getItemById(id)` - With an item's id, return the item.
* `getIdxById(id)` - With an item's id, return the index of the item in the original data array.
* `getRowById(id)` - With an item's id, return the row of the item in the grid.
* `getItemByIdx(idx)` - With an index of an item in the original data array, return the item. Equivalent to `getItems()[index]`.
* `mapIdsToRows(idArray)` - Maps an array of item ids into rows in the grid.
* `mapRowsToIds(rowArray)` - Maps an array of rows in the grid into item ids.

## Synchronizing selection & cell CSS styles

** WARNING **: obsoleted / deprecated; needs rework!

One of the most common questions about DataView is how to synchronize the selection or cell CSS styles state on DataView changes.  Let's say that the user selected a row.  If they then change the filter on the DataView to hide some items, the grid gets a call to invalidate all changed rows, including the selected one, but it doesn't know that the item that was displayed there has moved somewhere else.  What we need to do, is to store the ids of items that were selected, and to update the selection on the grid any time the DataView is modified.

Luckily, there is a helper method on the DataView that can take care of that:

* `syncGridSelection(grid, preserveHidden)` - Synchronizes `grid`'s selected rows with the DataView by subscribing to the grid's `onSelectedRowsChanged` event as well as the DataView's `onRowsChanged` & `onRowCountChanged` events.  If `preserveHidden` is true, it will preserve selected items even if they are not visible as rows.  For example, if you select an item, change the DataView filter so that that item is no longer presented to the grid and then change it back, the item will remain selected.  If `preserveHidden` is false, all selected items that can't be mapped onto rows are dropped.

The implementation is really simple, and I'll include it here for the reference:

```javascript
function syncGridSelection(grid, preserveHidden) {
  var self = this;
  var selectedRowIds = self.mapRowsToIds(grid.getSelectedRows());;
  var inHandler;

  function update() {
    if (selectedRowIds.length > 0) {
      inHandler = true;
      var selectedRows = self.mapIdsToRows(selectedRowIds);
      if (!preserveHidden) {
        selectedRowIds = self.mapRowsToIds(selectedRows);
      }
      // @TODO: inspect & remove        
      grid.setSelectedRows(selectedRows);
      inHandler = false;
    }
  }

  grid.onSelectedRowsChanged.subscribe(function(e, args) {
    if (inHandler) { return; }
    selectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
  });

  this.onRowsChanged.subscribe(update);

  this.onRowCountChanged.subscribe(update);
}
```

**NOTE:**  This only works with the RowSelectionModel.  CellSelectionModel isn't supported yet (I'm open to pull requests!).


There is a similar helper method to synchronize the cell CSS styles:

```javascript
function syncGridCellCssStyles(grid, key) {
  var hashById;
  var inHandler;

  // since this method can be called after the cell styles have been set,
  // get the existing ones right away
  storeCellCssStyles(grid.getCellCssStyles(key));

  function storeCellCssStyles(hash) {
    hashById = {};
    for (var row in hash) {
      var id = rows[row][idProperty];
      hashById[id] = hash[row];
    }
  }

  function update() {
    if (hashById) {
      inHandler = true;
      ensureRowsByIdCache();
      var newHash = {};
      for (var id in hashById) {
        var row = rowsById[id];
        if (row != undefined) {
          newHash[row] = hashById[id];
        }
      }
      grid.setCellCssStyles(key, newHash);
      inHandler = false;
    }
  }

  grid.onCellCssStylesChanged.subscribe(function(e, args) {
    if (inHandler) { return; }
    if (key != args.key) { return; }
    if (args.hash) {
      storeCellCssStyles(args.hash);
    }
  });

  this.onRowsChanged.subscribe(update);

  this.onRowCountChanged.subscribe(update);
}
```



## Sorting

Sorting is pretty simple:

```javascript
// Subscribe to the grid's onSort event.
// It only gets fired for sortable columns, so make sure your column definition has `sortable = true`.
grid.onSort.subscribe(function(e, args) {
  // args.multiColumnSort indicates whether or not this is a multi-column sort.
  // If it is, args.sortCols will have an array of {sortCol:..., sortAsc:...} objects.
  // If not, the sort column and direction will be in args.sortCol & args.sortAsc.

  // We'll use a simple comparer function here.
  var comparer = function(a, b) {
    return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
  }

  // Delegate the sorting to DataView.
  // This will fire the change events and update the grid.
  dataView.sort(comparer, args.sortAsc);
});
```

Note that calling `sort()` on the DataView modifies the original `data` array that was passed in to `setItems(data)`!

There's also a `fastSort(field, isAscending)` method on the DataView to do a fast lexicographic search that is especially handy for older versions of IE.


## Updating data

Since DataView can't automatically detect when you're changing the data, you'll need to make these updates via the DataView.  These updates will be applied directly to the original `data` array.

```javascript
// Delete item with id 'l3' ('C#').
dataView.deleteItem('l3');

// Append item to the end.
dataView.addItem({'id': 'l5', 'lang': 'CoffeeScript'});

// Insert item at the beginning.
dataView.insertItem(0, {'id': 'l6', 'lang': 'TypeScript'});

// Update an existing item.
var item = dataView.getItemById('l4');
item['lang'] = 'Clojure';
dataView.updateItem('l4', item);
```

Each one of these updates will fire change events and the grid will get updated automatically.


## Batching updates

Notice that in the example above, each update will result in the DataView recalculating its data and firing change events, resulting in the grid rerendering affected rows.  If you need to make multiple changes, you should batch them up to avoid unnecessary operations:

```javascript
// Suspend recalculations until endUpdate() is called.
dataView.beginUpdate();

dataView.addItem(...);
dataView.addItem(...);
dataView.sort(...);

// Indicate that we're done updating.
dataView.endUpdate();
```


## Filtering




## Paging

## Grouping

## Advanced topics

## API reference



## Events

| Event | Description |
|-------+-------------|
| onPagingInfoChanged | |
| onRowCountChanged | |
| onRowsChanged | |





 * @module DataView
 * @memberof Slick.Data
 */



(function ($) {
  "use strict";

  /**
   * A sample Model implementation.
   * Provides a filtered view of the underlying data.
   *
   * Relies on the data item having an "id" property uniquely identifying it.
   *
   *  @param  {Object}      options
   *          {Slick.Data.GroupItemMetadataProvider}
   *                        .groupItemMetadataProvider      Grouping helper.
   *
   *                                                        Interface structure:
   *                                                          { getGroupRowMetadata:  function(item, row, cell, rows) { return meta; },
   *                                                            getTotalsRowMetadata: function(item, row, cell, rows) { return meta; } }
   *          {Slick.Data.GroupItemMetadataProvider}
   *                        .globalItemMetadataProvider     Grouping helper override: when available, will
   *                                                        be invoked for every row before the
   *                                                        options.
   *
   *                                                        Interface structure:
   *                                                          { getRowMetadata:       function(item, row, cell, rows) { return meta; } }
   *          {Boolean}     .inlineFilters                  `true` if the filter expression should
   *                                                        be "compiled" a.k.a. "inlined" internally for performance.
   *                                                        Inlining should lead to better performance,
   *                                                        but may not work in some circumstances.
   *                                                        Default: `false`.
   *          {Boolean}     .inlineAggregators              `true` if the group aggregators should
   *                                                        be "compiled" a.k.a. "inlined" internally for performance.
   *                                                        Inlining should lead to better performance,
   *                                                        but may not work in some circumstances.
   *                                                        Default: `false`.
   *          {Boolean}     .showExpandedGroupRows [KCPT]   If true, group header rows are shown
   *                                                        for expanded groups as well as
   *                                                        collapsed groups. If false, group
   *                                                        header rows are shown only for
   *                                                        collapsed groups.
   *          {String}      .idProperty                     The field in each row (item) which is
   *                                                        a unique index. (default: "id")
   *          {Function}
   *                        .flattenGroupedRows             Overrides the default 'flattener' responsible
   *                                                        for delivering the complete set of data rows
   *                                                        to the SlickGrid instance (via .getItem() et al)
   *
   *                                                        Interface:
   *                                                          function(groups, level, groupingInfos, filteredItems, options) { return rows; }
   * 
   * @class 
   * @memberof Slick.Data
   * @constructor
   */
  function DataView(options) {
    var self = this;

    var defaults = {
      groupItemMetadataProvider: null,        // { getGroupRowMetadata: function(rowData, row, cell /* may be FALSE */, dataRows) , getTotalsRowMetadata: function(rowData, row, cell /* may be FALSE */, dataRows) }
      globalItemMetadataProvider: null,       // { getRowMetadata: function(rowData, row, cell /* may be FALSE */, dataRows) }
      flattenGroupedRows: flattenGroupedRows, // function (groups, level, groupingInfos, filteredItems, options) { return all_rows_you_want_to_see[]; }
      showExpandedGroupRows: true,
      inlineFilters: false,
      inlineAggregators: false,
      idProperty: "id",
      stableSort: true,                       // set this to FALSE if you don't need it for your data (your sort key is always guaranteed unique, for instance) for a sort speedup
      sortAsc: true                           // sort order preference
    };

    options = $.extend(true, {}, defaults, options);

    // private
    var idProperty = options.idProperty;  // property holding a unique row id
    var stableSort = options.stableSort;  // option setting: changes when overridden by the `sort()` API parameter.
    var sortAsc = true;                   // option setting: changes when overridden by the `sort()` API parameter.

    var items = [];         // data by index
    var rows = [];          // data by row
    var idxById = {};       // indexes by id
    var rowsById = null;    // rows by id; lazy-calculated
    var filter = null;      // filter function
    var updated = null;     // updated item ids
    var suspendCount = 0;   // suspends the recalculation
    var sortComparer;
    var refreshHints = {};
    var prevRefreshHints = {};
    var filterArgs;
    var filteredItems = [];
    var compiledFilter;
    var compiledFilterWithCaching;
    var filterCache = [];

    // function compilation support:
    var compileJavaScript = Slick.CompileJavaScript;
    var hasFunctionDisplayName = false;
    var hasFunctionName = false;

    // and disable the related options when we have found that our current browser won't be able to cope anyway:
    if (!compileJavaScript.canDecompile() || !compileJavaScript.canCompile()) {
      options.inlineFilters = false;
      options.inlineAggregators = false;
    }

    // grouping
    var groupingInfoDefaults = {
      getter: null,
      formatter: null,
      comparer: function groupingInfoComparer_f(a, b) { 
        return (a.value === b.value ? 
                0 : 
                (a.value > b.value ? 1 : -1)
               ); 
      },
      predefinedValues: [],
      aggregators: [],
      aggregateEmpty: false,
      aggregateCollapsed: false,
      aggregateChildGroups: false,
      collapsed: false,
      displayTotalsRow: true,
      totalsRowBeforeItems: false,
      lazyTotalsCalculation: false
    };
    var groupingInfos = [];
    var groups = [];
    var toggledGroupsByLevel = [];
    var groupingDelimiter = ':|:';

    var pagesize = 0;
    var pagenum = 0;
    var totalRows = 0;

    // events
    var onRowCountChanged = new Slick.Event();
    var onRowsChanged = new Slick.Event();
    var onPagingInfoChanged = new Slick.Event();

    function beginUpdate() {
      suspendCount++;
    }

    function endUpdate() {
      suspendCount--;
      if (suspendCount === 0) {
        refresh();
      }
    }

    function isUpdating() {
      return suspendCount > 0;
    }

    function setRefreshHints(hints) {
      refreshHints = hints || {};
    }

    function getRefreshHints() {
      return refreshHints;
    }

    function getFilterArgs() {
      return filterArgs;
    }

    function setFilterArgs(args) {
      filterArgs = args;
    }

    function updateIdxById(startingIndex) {
      startingIndex = startingIndex || 0;
      var id;
      for (var i = startingIndex, l = items.length; i < l; i++) {
        id = items[i][idProperty];
        if (id === undefined) {
          throw new Error("Each data element must implement a unique 'id' property, it can't be undefined. The data element at row index " + i + " is therefor illegal.");
        }
        idxById[id] = i;
      }
    }

    /**
     * @internal 
     * 
     * Check if a given single new item `newItem` has a unique ID. When no item
     * is passed to this function the entire data set is tested for proper ID uniqueness.
     *
     * Any ID collisions / omissions are reported by throwing an exception.
     *
     * @param  {Any} newItem    A single item, which will be added to the data set later on.
     *
     *                          This is an optional argument. When not given (or when it is null/false)
     *                          the entire data set will be scanned for ID omissions & collisions. 
     */
    function ensureIdUniqueness(newItem) {
      var id;
      if (newItem) {
        id = newItem[idProperty];
        if (id === undefined) {
          throw new Error("Each data element must implement a unique 'id' property, it can't be undefined. The data element at row index " + i + " is therefor illegal.");
        }
        // When this ID is already known by the lookup table, it means we already have this ID in our present data set.
        if (idxById[id]) {
          throw new Error("Each data element must implement a unique 'id' property. The new item would collide with the 'id' `" + id + "` at row index " + i + ".");
        }
      } else {
        for (var i = 0, l = items.length; i < l; i++) {
          id = items[i][idProperty];
          if (id === undefined || idxById[id] !== i) {
            throw new Error("Each data element must implement a unique 'id' property. 'id' `" + id + "` at row index " + i + " is not unique.");
          }
        }
      }
    }

    function getItems() {
      return items;
    }

    function setItems(data, objectIdProperty) {
      if (objectIdProperty != null) {
        idProperty = objectIdProperty;
      }
      items = filteredItems = data;
      idxById = {};
      updateIdxById();
      ensureIdUniqueness();
      refresh();
    }

    function setPagingOptions(args) {
      if (args.pageSize != null) {
        pagesize = args.pageSize;
        pagenum = pagesize ? Math.min(pagenum, Math.max(0, Math.ceil(totalRows / pagesize) - 1)) : 0;
      }

      if (args.pageNum != null) {
        pagenum = pagesize ? Math.min(args.pageNum, Math.max(0, Math.ceil(totalRows / pagesize) - 1)) : 0;
      }

      onPagingInfoChanged.notify(getPagingInfo(), null, self);

      refresh();
    }

    function getPagingInfo() {
      var totalPages = pagesize ? Math.max(1, Math.ceil(totalRows / pagesize)) : 1;
      return {
        pageSize: pagesize,
        pageNum: pagenum,
        totalRows: totalRows,
        totalPages: totalPages,
        dataView: self
      };
    }

    var defaultSortComparator = {
        valueExtractor: function valueExtractorForSort_f(node) {
          switch (typeof node) {
          case 'boolean':
          case 'number':
          case 'string':
          case 'undefined':
            return node;

          case 'object':
            if (node === null) {
              return node;
            }
            /* falls through */
          default:
            return "x" + node.toString();   // string conversion here ensures the strings come out as NaN when treated as numbers
          }
        },
        
        // default comparator is lexicographic for strings and anything else that is not a boolean or a number.
        //
        // boolean FALSE evaluates as 0-but-smaller-than-0, i.e. in an ascending sort it ends up before the numeric 0,
        // same goes for boolean TRUE and numeric 1.
        //
        // UNDEFINED and NULL are also evaluated as 0-but-smaller-than-0: in an ascending sort the order in which
        // these end up is before FALSE.
        //
        // The ascending sort output order is:
        //
        // -Inf, ...<negative numbers>..., NaN, UNDEFINED, NULL, FALSE, 0, ...<numbers between 0 and 1>..., TRUE, 1, ...<numbers larger than 1>..., +Inf, <strings>
        //
        // Inputs to compare are two objects of format
        //     { value: <value>, order: <sequencenumber> }
        //
        comparator: function comparatorForSort_f(x, y) {
            var xv = x.value;
            var yv = y.value;
            if (xv === yv) {
                return x.order - y.order;
            }
            var r = xv - yv;
            if (r < 0) {
                return -1;
            } else if (r > 0) {
                return 1;
            }
            // now we're stuck with the NaNs, the non-numerics and the 'zeroes'
            //
            // apply the decision matrix
            // true vs. 1
            // false vs. undefined vs. null vs. 0
            switch (typeof xv) {
            case 'boolean':
                switch (typeof yv) {
                case 'boolean':
                    // both booleans and they are identical too or the < or > comparisons above would've caught them!
                    // But wait a minute! When they are identical, the === check at the very top should've caught them already!
                    assert(0);                      // So what are we doin' here, eh?! We should never get here!
                    return x.order - y.order;
                case 'number':
                    if (isNaN(yv)) {
                        return 1;                   // rate a NaN below all booleans
                    } 
                    // otherwise:
                    return -1;                  // rate a boolean below a number when "boolean minus number equals zero"
                case 'string':
                    return -1;
                case 'undefined':
                    return 1;
                case 'object':                      // this is equivalent to y === NULL thanks to the valueExtractor above
                    return 1;
                }
                // This next statement, and all its brethren below, are here merely to appease 
                // the JSHint/JSCS Gods and other less-than-truly-intelligent JIT engines; 
                // *we*, on the other hand, know we'll never get here!               
                break;                              
            case 'number':
                if (isNaN(xv)) {
                    switch (typeof yv) {
                    case 'boolean':
                        return -1;
                    case 'number':
                        // either one or both are NaN or this would've been caught by the === type-equality check at the very start of this comparator:
                        if (isNaN(yv)) {
                            // both NaNs:
                            return x.order - y.order;
                        }
                        xv = 0;
                        r = xv - yv;
                        if (r < 0) {
                            return -1;
                        } else if (r > 0) {
                            return 1;
                        }
                        // yv == 0, xv == NaN -->
                        return -1;
                    case 'string':
                        return -1;
                    case 'undefined':
                        return -1;
                    case 'object':
                        return -1;
                    }
                } else {
                    switch (typeof yv) {
                    case 'boolean':
                        return 1;                   // rate a boolean below a number when "boolean minus number equals zero"
                    case 'number':
                        // either one or both are NaN or same-sign Infinity or this would've been caught by the === or < or > checks at the very start of this comparator:
                        if (xv < 0) {
                            // xv == -Inf
                            if (yv < 0) {
                                // yv == -Inf --> xv - yv = NaN
                                return x.order - y.order;
                            } else if (yv > 0) {
                                // this should've been caught by the < and > checks at the top of this routine
                                assert(0);
                            }
                        } else if (xv > 0) {
                            // xv == +Inf
                            if (yv < 0) {
                                // this should've been caught by the < and > checks at the top of this routine
                                assert(0);
                            } else if (yv > 0) {
                                // yv == +Inf --> xv - yv = NaN
                                return x.order - y.order;
                            }
                        }
                        assert(isNaN(yv));
                        yv = 0;
                        r = xv - yv;
                        if (r < 0) {
                            return -1;
                        } else if (r > 0) {
                            return 1;
                        }
                        // xv == 0, yv == NaN -->
                        return x.order - y.order;
                    case 'string':
                        return -1;
                    case 'undefined':
                        return 1;
                    case 'object':
                        return 1;
                    }
                }
                break;
            case 'string':
                switch (typeof yv) {
                case 'boolean':
                    return 1;
                case 'number':
                    return 1;
                case 'string':
                    if (xv < yv) {
                        return -1;
                    }
                    // otherwise:
                    // equality should've already been caught at the top where we perform the === check, so this must be:
                    assert(xv > yv);
                    return 1;
                case 'undefined':
                    return 1;
                case 'object':
                    return 1;
                }
                break;
            case 'undefined':
                switch (typeof yv) {
                case 'boolean':
                    return -1;
                case 'number':
                    if (isNaN(yv)) {
                        return 1;
                    }
                    xv = 0;
                    r = xv - yv;
                    if (r < 0) {
                        return -1;
                    } else if (r > 0) {
                        return 1;
                    }
                    // xv == undefined, yv == 0 -->
                    return -1;
                case 'string':
                    return -1;
                case 'undefined':
                    // But wait a minute! When they are identical, the === check at the very top should've caught them already!
                    assert(0);                      // So what are we doin' here, eh?! We should never get here!
                    return x.order - y.order;
                case 'object':
                    return -1;
                }
                break;
            case 'object':                          // this is representing NULL
                switch (typeof yv) {
                case 'boolean':
                    return -1;
                case 'number':
                    if (isNaN(yv)) {
                        return 1;
                    }
                    xv = 0;
                    r = xv - yv;
                    if (r < 0) {
                        return -1;
                    } else if (r > 0) {
                        return 1;
                    }
                    // xv == null, yv == 0 -->
                    return -1;
                case 'string':
                    return -1;
                case 'undefined':
                    return 1;
                case 'object':
                    // But wait a minute! When they are identical, the === check at the very top should've caught them already!
                    assert(0);                      // So what are we doin' here, eh?! We should never get here!
                    return x.order - y.order;
                }
                break;
            }
        },
        
        // fast comparator for when you don't care about stable sort provisions nor very tight handling of NULL, UNDEFINED, NaN, etc.
        // because you know your dataset and either really don't care about a stable sort or know for sure that all keys are
        // guaranteed unique.
        //
        // The ascending sort output order is:
        //
        // -Inf, ...<negative numbers>..., NaN, UNDEFINED, NULL, FALSE, 0, ...<numbers between 0 and 1>..., TRUE, 1, ...<numbers larger than 1>..., +Inf, <strings>
        //
        fastComparator: function fastComparatorForSort_f(x, y) {
            // Strings do not 'subtract' so we simply compare.
            if (x.value < y.value) {
                return -1;
            } else if (x.value > y.value) {
                return 1;
            }
            // now we're stuck with the NaNs, possibly a few +/-Infinities and may a couple of NULLs:
            // we don't care and treat them as equals
            return x.order - y.order;
        }
    };

    function getDefaultSortComparator() {
        return defaultSortComparator;
    }


    function sort(comparer, ascending, unstable) {
      sortAsc = (ascending == null ? true : ascending);
      stableSort = (unstable != null ? unstable : stableSort) || false;
      if (typeof comparer === 'function') {
        sortComparer = {
            valueExtractor: function sortComparerFunctionExtractor_f(node) {
                return node;
            },
            comparator: function sortComparerFunctionComparator_f(x, y) {
                var rv = comparer(x.value, y.value);
                if (!rv) {
                    return x.order - y.order;
                }
                return rv;
            }
        };
      } else if (typeof comparer === 'string' || typeof comparer === 'number') {
        sortComparer = {
            valueExtractor: function sortComparerStringExtractor_f(node) {
                return node[comparer];
            },
            comparator: stableSort ? defaultSortComparator.comparator : defaultSortComparator.fastComparator
        };
      } else {
        sortComparer = $.extend({}, defaultSortComparator, {
            comparator: stableSort ? defaultSortComparator.comparator : defaultSortComparator.fastComparator
        }, comparer);
      }
      // check the comparator spec:
      assert(typeof sortComparer.valueExtractor === 'function');
      assert(typeof sortComparer.comparator === 'function');

      if (!sortAsc) {
        items.reverse();
      }

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      //
      // Sorting maps
      // ------------
      //
      // The `comparer` function can be invoked multiple times per element within the array.
      // Depending on the `comparer` function's nature, this may yield a high overhead.
      // The more work a compare function does and the more elements there are to sort, the
      // wiser it may be to consider using a map for sorting.
      //
      // The idea is to walk the array once to extract the actual values used for sorting into
      // a temporary array applying the `mapper` function to each element, sort the temporary
      // array and then walk the temporary array to bring the original array into the right order.
      //
      // ---------------------------------------
      //
      // Extra notes:
      //
      // We also use the mapper phase to turn sort into a stable sort by initializing 
      // the stableSortIdProperty for each data item:
      // by including that one in the comparer check we create a stable sort.

      // temporary holder of position and sort-value
      var map = items.map(function itemMapperForSort(d, i) {
        return {
            value: sortComparer.valueExtractor(d),
            order: i
        };
      });

      // sorting the map containing the reduced values
      map.sort(sortComparer.comparator);

      // apply the map for the resulting order; but keep the 'items' reference itself unchanged however!
      // (we do that so that users can use customized Array-derived instances for `items` and get away with it)
      var rv = items.slice(0);
      map.forEach(function mapCopierForSort(d, i) {
        items[i] = rv[d.order];
      });

      if (!sortAsc) {
        items.reverse();
      }

      idxById = {};
      updateIdxById();
      refresh();
    }

    function reSort() {
      assert(sortComparer);
      sort(sortComparer, sortAsc);
    }

    function setFilter(filterFn) {
      filter = filterFn;
      if (options.inlineFilters) {
        assert(compileJavaScript.canCompile());
        assert(compileJavaScript.canDecompile());
        compiledFilter = compileFilter(filter);
        compiledFilterWithCaching = compileFilterWithCaching(filter);
      }
      refresh();
    }

    function getFilter() {
      return filter;
    }

    function getGrouping() {
      return groupingInfos;
    }

    function setGrouping(groupingInfo) {
      if (!options.groupItemMetadataProvider) {
        options.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
      }

      groups = [];
      toggledGroupsByLevel = [];
      groupingInfo = groupingInfo || [];
      groupingInfos = (groupingInfo instanceof Array) ? groupingInfo : [groupingInfo];

      for (var i = 0; i < groupingInfos.length; i++) {
        var gi = groupingInfos[i] = $.extend(true, {}, groupingInfoDefaults, groupingInfos[i]);
        gi.getterIsAFn = (typeof gi.getter === "function");

        // pre-compile accumulator loops
        gi.compiledAccumulators = [];
        var idx = gi.aggregators.length;
        while (idx--) {
          gi.compiledAccumulators[idx] = compileAccumulatorLoop(gi.aggregators[idx]);
        }

        toggledGroupsByLevel[i] = {};
      }

      refresh();
    }

    /**
     * @deprecated Please use {@link setGrouping}.
     */
    function groupBy(valueGetter, valueFormatter, sortComparer) {
      if (valueGetter == null) {
        setGrouping([]);
        return;
      }

      setGrouping({
        getter: valueGetter,
        formatter: valueFormatter,
        comparer: sortComparer
      });
    }

    /**
     * @deprecated Please use {@link setGrouping}.
     */
    function setAggregators(groupAggregators, includeCollapsed) {
      if (!groupingInfos.length) {
        throw new Error("At least one grouping must be specified before calling setAggregators().");
      }

      groupingInfos[0].aggregators = groupAggregators;
      groupingInfos[0].aggregateCollapsed = includeCollapsed;

      setGrouping(groupingInfos);
    }

    function getItemByIdx(i) {
      return items[i];
    }

    function getIdxById(id) {
      return idxById[id];
    }

    function ensureRowsByIdCache() {
      if (!rowsById) {
        rowsById = {};
        for (var i = 0, l = rows.length; i < l; i++) {
          rowsById[rows[i][idProperty]] = i;
        }
      }
    }

    function getRowById(id) {
      ensureRowsByIdCache();
      return rowsById[id];
    }

    function getItemById(id) {
      return items[idxById[id]];
    }

    function mapIdsToRows(idArray) {
      var rows = [];
      ensureRowsByIdCache();
      for (var i = 0, l = idArray.length; i < l; i++) {
        var row = rowsById[idArray[i]];
        if (row != null) {
          rows[rows.length] = row;
        }
      }
      return rows;
    }

    function mapRowsToIds(rowArray) {
      var ids = [];
      for (var i = 0, l = rowArray.length; i < l; i++) {
        if (rowArray[i] < rows.length) {
          ids[ids.length] = rows[rowArray[i]][idProperty];
        }
      }
      return ids;
    }

    function updateItem(id, item) {
      // see also https://github.com/mleibman/SlickGrid/issues/1082
      if (idxById[id] === undefined) {
        throw new Error("Invalid id");
      }
      // What if the specified item also has an updated idProperty?
      // Then we'll have to update the index as well, and possibly
      // the `updated` cache too.
      if (id !== item[idProperty]) {
        // make sure the new id is unique:
        var newId = item[idProperty];
        if (newId == null) {
          throw new Error("Cannot update item to associate with a null id");
        }
        if (idxById[newId] !== undefined) {
          throw new Error("Cannot update item to associate with a non-unique id");
        }
        idxById[newId] = idxById[id];
        delete idxById[id];

        // Also update the `updated` hashtable/markercache? Yes, `recalc()` inside `refresh()` needs that one!
        if (updated && updated[id]) {
          delete updated[id];
        }

        // Also update the row indexes? Nah, `refresh()` blows away the `rowsById[]` cache!

        id = newId;
      }
      items[idxById[id]] = item;

      // Also update the rows? Nah, `refresh()` blows away the `rows[]` cache and recalculates it via `recalc()`!

      if (!updated) {
        updated = {};
      }
      updated[id] = true;
      refresh();
    }

    function insertItem(insertBefore, item) {
      items.splice(insertBefore, 0, item);
      ensureIdUniqueness(item);
      updateIdxById(insertBefore);
      refresh();
    }

    function addItem(item) {
      items.push(item);
      ensureIdUniqueness(item);
      updateIdxById(items.length - 1);
      refresh();
    }

    function deleteItem(id) {
      var idx = idxById[id];
      if (idx === undefined) {
        throw new Error("Invalid id");
      }
      delete idxById[id];
      items.splice(idx, 1);
      updateIdxById(idx);
      refresh();
    }

    function getLength() {
      return rows.length;
    }

    function getItem(i) {
      var item = rows[i];
      var gi;

      // if this is a group row, make sure totals are calculated and update the title
      if (item && item.__group && item.totals && !item.totals.initialized) {
        gi = groupingInfos[item.level];
        // We'll always have to calculate the totals once we get here as those totals
        // may not just be used in the totals row only: see the 'grouping' example for a 
        // situation where aggregated data is used as part of the group line itself, in 
        // a userland custom formatter.
        // 
        // Hence we do NOT check for `!gi.displayTotalsRow` here.
        // 
        // Also note that a side effect of the totals calculation here is the proper
        // initialization of the group title when lazy calculation for the group has 
        // been enabled: this is the quickest and overall cleanest way to ensure that
        // the optional title userland formatter always is guaranteed to receive 
        // properly initialized group/totals data on invocation.
        // (The 'grouping' example, for instance, would crash without this 'delayed'
        // rendering of the group title.)
        calculateTotals(item.totals);
        assert(item.totals.initialized);
      }
      // if this is a totals row, make sure it's calculated
      else if (item && item.__groupTotals && !item.initialized) {
        calculateTotals(item);
        assert(item.initialized);
      }

      return item;
    }

    function getItemMetadata(row, cell) {
      var item = rows[row];
      if (item === undefined) {
        return null;
      }

      // global override for all rows
      if (options.globalItemMetadataProvider && options.globalItemMetadataProvider.getRowMetadata) {
        return options.globalItemMetadataProvider.getRowMetadata(item, row, cell, rows);
      }

      // overrides for grouping rows
      if (item.__group && options.groupItemMetadataProvider && options.groupItemMetadataProvider.getGroupRowMetadata) {
        return options.groupItemMetadataProvider.getGroupRowMetadata(item, row, cell, rows);
      }

      // overrides for totals rows
      if (item.__groupTotals && options.groupItemMetadataProvider && options.groupItemMetadataProvider.getTotalsRowMetadata) {
        return options.groupItemMetadataProvider.getTotalsRowMetadata(item, row, cell, rows);
      }

      /* overrides for rows with items that supply a custom meta data provider */
      if (item.itemMetadataProvider && item.itemMetadataProvider.getRowMetadata) {
        return item.itemMetadataProvider.getRowMetadata(item, row, cell, rows);
      }

      return null;
    }

    function expandCollapseAllGroups(level, collapse) {
      if (level == null) {
        for (var i = 0; i < groupingInfos.length; i++) {
          toggledGroupsByLevel[i] = {};
          groupingInfos[i].collapsed = collapse;
        }
      } else {
        toggledGroupsByLevel[level] = {};
        groupingInfos[level].collapsed = collapse;
      }
      refresh();
    }

    /**
     * @param level {Number} Optional level to collapse.  If not specified, collapse all levels.
     */
    function collapseAllGroups(level) {
      expandCollapseAllGroups(level, true);
    }

    /**
     * @param level {Number} Optional level to expand.  If not specified, expand all levels.
     */
    function expandAllGroups(level) {
      expandCollapseAllGroups(level, false);
    }

    function expandCollapseGroup(level, groupingKey, collapse) {
      toggledGroupsByLevel[level][groupingKey] = groupingInfos[level].collapsed ^ collapse;
      refresh();
    }

    /**
     * @param groupingValue {vararg} Either a Slick.Group's "groupingKey" property, or a
     *     variable argument list of grouping values denoting a unique path to the row.
     *     For example, calling isGroupCollapsed('high', '10%') will return whether the
     *     '10%' subgroup of the 'high' setGrouping is collapsed.
     */
    function isGroupCollapsed(groupingValue) {
      var args = Array.prototype.slice.call(arguments);
      var level;
      var groupingKey;
      if (args.length === 1 && groupingValue.indexOf(groupingDelimiter) !== -1) {
        level = groupingValue.split(groupingDelimiter).length - 1;
        groupingKey = groupingValue;
      } else {
        level = args.length - 1;
        groupingKey = args.join(groupingDelimiter);
      }
      return toggledGroupsByLevel[level][groupingKey];
    }

    /**
     * @param groupingValue {vararg} Either a Slick.Group's "groupingKey" property, or a
     *     variable argument list of grouping values denoting a unique path to the row.  For
     *     example, calling collapseGroup('high', '10%') will collapse the '10%' subgroup of
     *     the 'high' group.
     */
    function collapseGroup(groupingValue) {
      var args = Array.prototype.slice.call(arguments);
      if (args.length === 1 && groupingValue.indexOf(groupingDelimiter) !== -1) {
        expandCollapseGroup(groupingValue.split(groupingDelimiter).length - 1, groupingValue, true);
      } else {
        expandCollapseGroup(args.length - 1, args.join(groupingDelimiter), true);
      }
    }

    /**
     * @param varArgs Either a Slick.Group's "groupingKey" property, or a
     *     variable argument list of grouping values denoting a unique path to the row.  For
     *     example, calling expandGroup('high', '10%') will expand the '10%' subgroup of
     *     the 'high' group.
     */
    function expandGroup(varArgs) {
      var args = Array.prototype.slice.call(arguments);
      var arg0 = args[0];
      if (args.length === 1 && arg0.indexOf(groupingDelimiter) !== -1) {
        expandCollapseGroup(arg0.split(groupingDelimiter).length - 1, arg0, false);
      } else {
        expandCollapseGroup(args.length - 1, args.join(groupingDelimiter), false);
      }
    }

    function getGroups() {
      return groups;
    }

    function extractGroups(rows, parentGroup, allFilteredItems) {
      var group;
      var val;
      var groups = [];
      var groupsByVal = {};
      var r, i, l;
      var level = parentGroup ? parentGroup.level + 1 : 0;
      var gi = groupingInfos[level];

      if (gi.getGroupRows) {
        rows = gi.getGroupRows.call(self, gi, rows, allFilteredItems, level, parentGroup);
      }

      for (i = 0, l = gi.predefinedValues.length; i < l; i++) {
        val = gi.predefinedValues[i];
        group = groupsByVal[val];
        if (!group) {
          group = new Slick.Group();
          group.value = val;
          group.level = level;
          group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : '') + val;
          groups[groups.length] = group;
          groupsByVal[val] = group;
        }
      }

      for (i = 0, l = rows.length; i < l; i++) {
        r = rows[i];
        val = gi.getterIsAFn ? gi.getter(r) : r[gi.getter];
        group = groupsByVal[val];
        if (!group) {
          group = new Slick.Group();
          group.value = val;
          group.level = level;
          group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : '') + val;
          groups[groups.length] = group;
          groupsByVal[val] = group;
        }

        group.rows[group.count++] = r;
      }

      if (level < groupingInfos.length - 1) {
        for (i = 0; i < groups.length; i++) {
          group = groups[i];
          group.groups = extractGroups(group.rows, group, allFilteredItems);
        }
      }

      groups.sort(groupingInfos[level].comparer);

      return groups;
    }

    function calculateTotals(totals) {
      var group = totals.group;
      var gi = groupingInfos[group.level];
      var isLeafLevel = (group.level === groupingInfos.length);
      var agg, idx = gi.aggregators.length;

      if (!isLeafLevel && gi.aggregateChildGroups) {
        // make sure all the subgroups are calculated
        var i = group.groups.length;
        while (i--) {
          if (!group.groups[i].totals.initialized) {
            calculateTotals(group.groups[i].totals);
          }
        }
      }

      while (idx--) {
        agg = gi.aggregators[idx];
        agg.init(gi, group, totals);
        if (!isLeafLevel && gi.aggregateChildGroups) {
          gi.compiledAccumulators[idx].call(agg, group.groups);
        } else {
          gi.compiledAccumulators[idx].call(agg, group.rows);
        }
        agg.storeResult(totals);
      }
      totals.initialized = true;

      // And when we have lazy initialization enabled, we'll also have to set the title
      // now, because we wouldn't have been able to do that one before!
      
      //if (gi.lazyTotalsCalculation) {
      group.title = gi.formatter ? gi.formatter(group) : group.value;
      //}
    }

    function addGroupTotals(group) {
      var gi = groupingInfos[group.level];
      var totals = new Slick.GroupTotals();
      totals.group = group;
      group.totals = totals;
      if (!gi.lazyTotalsCalculation) {
        calculateTotals(totals);
      }
    }

    function addTotals(groups, level) {
      level = level || 0;
      var gi = groupingInfos[level];
      var groupCollapsed = gi.collapsed;
      var toggledGroups = toggledGroupsByLevel[level];
      var idx = groups.length, g;
      while (idx--) {
        g = groups[idx];

        if (g.collapsed && !gi.aggregateCollapsed) {
          continue;
        }

        // Do a depth-first aggregation so that parent group aggregators can access subgroup totals.
        if (g.groups) {
          addTotals(g.groups, level + 1);
        }

        if (gi.aggregators.length && (
            gi.aggregateEmpty || g.rows.length || (g.groups && g.groups.length))) {
          addGroupTotals(g);
        }

        g.collapsed = groupCollapsed ^ toggledGroups[g.groupingKey];

        if (!gi.lazyTotalsCalculation || (g.totals && g.totals.initialized)) {
          g.title = gi.formatter ? gi.formatter(g) : g.value;
        }
      }
    }

    function flattenGroupedRows(groups, level, groupingInfos, filteredItems, options) {
      //level = level || 0;
      var gi = groupingInfos[level];
      var groupedRows = [], rows, gl = 0, g;
      for (var i = 0, l = groups.length; i < l; i++) {
        g = groups[i];

        if (options.showExpandedGroupRows || g.collapsed) {
          groupedRows[gl++] = g;
        }

        var displayTotalsRow = g.totals && gi.displayTotalsRow && (!g.collapsed || gi.aggregateCollapsed);
        if (displayTotalsRow && gi.totalsRowBeforeItems) {
          groupedRows[gl++] = g.totals;
        }

        if (!g.collapsed) {
          rows = g.groups ? options.flattenGroupedRows(g.groups, level + 1, groupingInfos, filteredItems, options) : g.rows;
          if (!options.rollupSingleChildGroup || (rows && rows.length > 1)) {
            for (var j = 0, jj = rows.length; j < jj; j++) {
              groupedRows[gl++] = rows[j];
            }
          }
        }

        if (displayTotalsRow && !gi.totalsRowBeforeItems) {
          groupedRows[gl++] = g.totals;
        }
      }
      return groupedRows;
    }

    function compileAccumulatorLoop(aggregator) {
      if (options.inlineAggregators) {
        var accumulatorInfo = compileJavaScript.decompile(aggregator.accumulate);
        fn = compileJavaScript("compiledAccumulatorLoop",
            "_items",
            ["for (var " + accumulatorInfo.params[0] + ", _i = 0, _il = _items.length; _i < _il; _i++) {",
                accumulatorInfo.params[0] + " = _items[_i];",
                accumulatorInfo.body,
            "}"]
        );
      } else {
        fn = function vanillaAccumulatorLoop(_items) {
          for (var _a1, _i = 0, _il = _items.length; _i < _il; _i++) {
            _a1 = _items[_i];
            aggregator.accumulate(_a1);
          }
        };
        // The next bits are only enabled on browsers which can handle them; see also issue #1032
        if (hasFunctionDisplayName) { fn.displayName = "vanillaAccumulatorLoop"; }
        if (hasFunctionName) { fn.name = "vanillaAccumulatorLoop"; }
      }
      return fn;
    }

    function compileFilter(filterFn) {
      var filterInfo = compileJavaScript.decompile(filterFn);

      var filterPath1 = "{ continue _coreloop; }$1";
      var filterPath2 = "{ _retval[_idx++] = $item$; continue _coreloop; }$1";
      // make some allowances for minification - there's only so far we can go with RegExes.
      var filterBody = filterInfo.body
          .replace(/return false\s*([;}]|\}|$)/gi, filterPath1)
          .replace(/return!1([;}]|\}|$)/gi, filterPath1)
          .replace(/return true\s*([;}]|\}|$)/gi, filterPath2)
          .replace(/return!0([;}]|\}|$)/gi, filterPath2)
          .replace(/return ([^;}]+?)\s*([;}]|$)/gi, "{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }$2");

      // This preserves the function template code after JS compression,
      // so that replace() commands still work as expected.
      var tpl = [
        //"function (_items, _args) {",
        "var _retval = [], _idx = 0;",
        "var $item$, $args$ = _args;",
        "_coreloop:",
        "for (var _i = 0, _il = _items.length; _i < _il; _i++) {",
        "  $item$ = _items[_i];",
        "  $filter$;",
        "}",
        "return _retval;"
        //"}"
      ].join("\n");
      tpl = tpl.replace(/\$filter\$/gi, filterBody);
      tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
      tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

      var fn = compileJavaScript("compiledFilter", ["_items", "_args"], tpl);
      return fn;
    }

    function compileFilterWithCaching(filterFn) {
      var filterInfo = compileJavaScript.decompile(filterFn);

      var filterPath1 = "{ continue _coreloop; }$1";
      var filterPath2 = "{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }$1";
      // make some allowances for minification - there's only so far we can go with RegEx
      var filterBody = filterInfo.body
          .replace(/return false\s*([;}]|\}|$)/gi, filterPath1)
          .replace(/return!1([;}]|\}|$)/gi, filterPath1)
          .replace(/return true\s*([;}]|\}|$)/gi, filterPath2)
          .replace(/return!0([;}]|\}|$)/gi, filterPath2)
          .replace(/return ([^;}]+?)\s*([;}]|$)/gi,
          "{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }$2");

      // This preserves the function template code after JS compression,
      // so that replace() commands still work as expected.
      var tpl = [
        //"function (_items, _args, _cache) {",
        "var _retval = [], _idx = 0;",
        "var $item$, $args$ = _args;",
        "_coreloop:",
        "for (var _i = 0, _il = _items.length; _i < _il; _i++) {",
        "  $item$ = _items[_i];",
        "  if (_cache[_i]) {",
        "    _retval[_idx++] = $item$;",
        "    continue _coreloop;",
        "  }",
        "  $filter$;",
        "}",
        "return _retval;"
        //"}"
      ].join("\n");
      tpl = tpl.replace(/\$filter\$/gi, filterBody);
      tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
      tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

      var fn = compileJavaScript("compiledFilterWithCaching", ["_items", "_args", "_cache"], tpl);
      return fn;
    }

    function uncompiledFilter(items, args) {
      var retval = [], idx = 0;

      for (var i = 0, ii = items.length; i < ii; i++) {
        if (filter(items[i], args)) {
          retval[idx++] = items[i];
        }
      }

      return retval;
    }

    function uncompiledFilterWithCaching(items, args, cache) {
      var retval = [], idx = 0, item;

      for (var i = 0, ii = items.length; i < ii; i++) {
        item = items[i];
        if (cache[i]) {
          retval[idx++] = item;
        } else if (filter(item, args)) {
          retval[idx++] = item;
          cache[i] = true;
        }
      }

      return retval;
    }

    function getFilteredAndPagedItems() {
      if (filter) {
        var batchFilter = options.inlineFilters ? compiledFilter : uncompiledFilter;
        var batchFilterWithCaching = options.inlineFilters ? compiledFilterWithCaching : uncompiledFilterWithCaching;

        if (refreshHints.isFilterNarrowing) {
          filteredItems = batchFilter(filteredItems, filterArgs);
        } else if (refreshHints.isFilterExpanding) {
          filteredItems = batchFilterWithCaching(items, filterArgs, filterCache);
        } else if (!refreshHints.isFilterUnchanged) {
          filteredItems = batchFilter(items, filterArgs);
        }
      } else {
        // special case:  if not filtering and not paging, the resulting
        // rows collection needs to be a copy so that changes due to sort
        // can be caught
        filteredItems = pagesize ? items : items.concat();
      }

      // get the current page
      var paged;
      if (pagesize) {
        if (filteredItems.length < pagenum * pagesize) {
          pagenum = Math.floor(filteredItems.length / pagesize);
        }
        paged = filteredItems.slice(pagesize * pagenum, pagesize * pagenum + pagesize);
      } else {
        paged = filteredItems;
      }

      return {
        totalRows: filteredItems.length, 
        rows: paged,
        filteredRows: filteredItems,
        pagedRows: paged
      };
    }

    function getRowDiffs(rows, newRows) {
      var item, r, eitherIsNonData, diff = [];
      var from = 0, to = Math.max(newRows.length, rows.length);

      if (refreshHints && refreshHints.ignoreDiffsBefore) {
        from = Math.max(0,
            Math.min(newRows.length, refreshHints.ignoreDiffsBefore));
      }

      if (refreshHints && refreshHints.ignoreDiffsAfter) {
        to = Math.min(to,
            Math.max(0, refreshHints.ignoreDiffsAfter));
      }

      for (var i = from, rl = Math.min(newRows.length, rows.length); i < to; i++) {
        if (i >= rl) {
          diff[diff.length] = i;
        } else {
          item = newRows[i];
          r = rows[i];

          if ((groupingInfos.length && (eitherIsNonData = (item.__nonDataRow) || (r.__nonDataRow)) &&
              item.__group !== r.__group ||
              item.__group && !item.equals(r))
              || (eitherIsNonData &&
              // no good way to compare totals since they are arbitrary DTOs
              // deep object comparison is pretty expensive
              // always considering them 'dirty' seems easier for the time being
                  (item.__groupTotals || r.__groupTotals))
              || item[idProperty] !== r[idProperty]
              || (updated && updated[item[idProperty]])
              ) {
            diff[diff.length] = i;
          }
        }
      }
      return diff;
    }

    function recalc() {
      rowsById = null;

      if (refreshHints.isFilterNarrowing != prevRefreshHints.isFilterNarrowing ||
          refreshHints.isFilterExpanding != prevRefreshHints.isFilterExpanding) {
        filterCache = [];
      }

      var filteredItems = getFilteredAndPagedItems();
      totalRows = filteredItems.totalRows;
      var newRows = filteredItems.rows;

      groups = [];
      if (groupingInfos.length) {
        groups = extractGroups(newRows, null, filteredItems);
        if (groups.length) {
          addTotals(groups);
          newRows = options.flattenGroupedRows(groups, 0, groupingInfos, filteredItems, options);
        }
      }

      if (options.rowProcessor && typeof options.rowProcessor === "function") {
        newRows = options.rowProcessor(newRows);
      }

      var diff = getRowDiffs(rows, newRows);

      rows = newRows;

      return diff;
    }

    function refresh() {
      if (isUpdating()) {
        return;
      }

      var countBefore = rows.length;
      var totalRowsBefore = totalRows;

      var diff = recalc(); // pass as direct refs to avoid closure perf hit

      // If the current page is no longer valid, go to last page and recalc.
      // We suffer a performance penalty here, but the main loop (recalc) remains highly optimized.
      if (pagesize && pagenum && totalRows < pagenum * pagesize) {
        pagenum = Math.max(0, Math.ceil(totalRows / pagesize) - 1);
        diff = recalc();
      }

      updated = null;
      prevRefreshHints = refreshHints;
      refreshHints = {};

      if (totalRowsBefore !== totalRows) {
        onPagingInfoChanged.notify(getPagingInfo(), null, self);
      }
      if (countBefore !== rows.length) {
        onRowCountChanged.notify({
          previous: countBefore, 
          current: rows.length,
          dataView: self
        }, null, self);
      }
      if (diff.length > 0) {
        onRowsChanged.notify({
          rows: diff,
          dataView: self
        }, null, self);
      }
    }

    /**
     * Wires the grid and the DataView together to keep row selection tied to item ids.
     * This is useful since, without it, the grid only knows about rows, so if the items
     * move around, the same rows stay selected instead of the selection moving along
     * with the items.
     *
     * NOTE:  This doesn't work with cell selection model.
     *
     * @param grid {Slick.Grid} The grid to sync selection with.
     * @param preserveHidden {Boolean} Whether to keep selected items that go out of the
     *     view due to them getting filtered out.
     * @param preserveHiddenOnSelectionChange {Boolean} Whether to keep selected items
     *     that are currently out of the view (see preserveHidden) as selected when selection
     *     changes.
     *     
     * @return {Slick.Event} An event that notifies when an internal list of selected row ids
     *     changes.  This is useful since, in combination with the above two options, it allows
     *     access to the full list of selected row ids, and not just the ones visible to the grid.
     *     
     * @method syncGridSelection
     */
    function syncGridSelection(grid, preserveHidden, preserveHiddenOnSelectionChange) {
      var self = this;
      var inHandler;
      var selectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
      var onSelectedRowIdsChanged = new Slick.Event();

      function setSelectedRowIds(rowIds) {
        if (selectedRowIds.join(",") === rowIds.join(",")) {
          return;
        }

        selectedRowIds = rowIds;

        onSelectedRowIdsChanged.notify({
          grid: grid,
          ids: selectedRowIds,
          dataView: self
        }, null, self);
      }

      function update() {
        if (selectedRowIds.length > 0) {
          inHandler = true;
          var selectedRows = self.mapIdsToRows(selectedRowIds);
          if (!preserveHidden) {
            setSelectedRowIds(self.mapRowsToIds(selectedRows));
          }
          // @TODO: inspect & remove        
          grid.setSelectedRows(selectedRows);
          inHandler = false;
        }
      }

      function updateOnRowsChanged(e, args) {
        assert(args);
        assert(args.dataView === self);
        assert(args.rows);

        grid.invalidateRows(args.rows);
        update();
      }

      function updateOnRowCountChanged(e, args) {
        assert(args);
        assert(args.dataView === self);
        assert(args.previous !== args.current);

        grid.updateRowCount();
        update();
      }

      function selectedRangesChangedHandler(e, args) {
        if (inHandler) { return; }
        var newSelectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
        if (!preserveHiddenOnSelectionChange || !grid.getOptions().multiSelect) {
          setSelectedRowIds(newSelectedRowIds);
        } else {
          // keep the ones that are hidden
          var existing = $.grep(selectedRowIds, function selectedRowsGrep_f(id) { 
            return self.getRowById(id) === undefined; 
          });
          // add the newly selected ones
          setSelectedRowIds(existing.concat(newSelectedRowIds));
        }
      }

      grid.onSelectedRangesChanged.subscribe(selectedRangesChangedHandler);

      this.onRowsChanged.subscribe(updateOnRowsChanged);

      this.onRowCountChanged.subscribe(updateOnRowCountChanged);

      return onSelectedRowIdsChanged;
    }

    function syncGridCellCssStyles(grid, key) {
      var hashById;
      var inHandler;

      // since this method can be called after the cell styles have been set,
      // get the existing ones right away
      storeCellCssStyles(grid.getCellCssStyles(key));

      // Warning/Note: this stores *references* to each *row* of CellCssStyles hashes.
      // The way `grid.setCellCssStyles()` works today this '1 level deep clone' approach
      // is sufficient to ensure that `grid.setCellCssStyles()` will observe changes
      // on a *per-entire-row* basis, which is good enough for DataView as it won't *edit*
      // the CellCssStyles but merely must *track* the changes done by the user while
      // rows may be moving around.
      // 
      // Anyway, tread carefully when you want to fiddle with this stuff...   
      // (DataView internally does not care how the entire-row hash is constructed: it is 
      // agnostic in that way so the fact that we changed the `grid.setCellCssStyles()` hash
      // index from (row_index, column_id) to (row_index, column_index) does not affect
      // DataView itself.)
      function storeCellCssStyles(hash) {
        hashById = {};
        for (var row in hash) {
          var id = rows[row][idProperty];
          hashById[id] = hash[row];
        }
      }

      function update() {
        if (hashById) {
          inHandler = true;
          ensureRowsByIdCache();
          var newHash = {};
          for (var id in hashById) {
            var row = rowsById[id];
            if (row != null) {
              newHash[row] = hashById[id];
            }
          }
          grid.setCellCssStyles(key, newHash);
          inHandler = false;
        }
      }

      function cellCssStylesChangedHandler(e, args) {
        assert(e);
        assert(args);
        if (inHandler) { return; }
        if (key !== args.key) { return; }
        if (args.hash) {
          storeCellCssStyles(args.hash);
        }
      }

      grid.onCellCssStylesChanged.subscribe(cellCssStylesChangedHandler);

      this.onRowsChanged.subscribe(update);

      this.onRowCountChanged.subscribe(update);
    }

    /**
     * Report back the currently active set of options, such as the current state of
     * the `sortAsc` and `stableSort` options, which may have changed by some API call
     * parameters overriding the original setting. 
     *
     * @return {Object} A shallow copy of the current `options` object.
     */
    function getOptions() {
      return $.extend(true, {}, options, {
        idProperty: idProperty,
        stableSort: stableSort,
        sortAsc: sortAsc
      });
    }

    function getFilteredItems() {
      return filteredItems;
    }

    $.extend(this, /* @nocollapse */ {
      // methods
      beginUpdate: beginUpdate,
      endUpdate: endUpdate,
      isUpdating: isUpdating,
      setPagingOptions: setPagingOptions,
      getPagingInfo: getPagingInfo,
      getItems: getItems,
      getFilteredAndPagedItems: getFilteredAndPagedItems,
      getFilteredItems: getFilteredItems,
      setItems: setItems,
      setFilter: setFilter,
      getFilter: getFilter,
      getDefaultSortComparator: getDefaultSortComparator,
      getOptions: getOptions,
      sort: sort,
      reSort: reSort,
      setGrouping: setGrouping,
      getGrouping: getGrouping,
      groupBy: groupBy,
      setAggregators: setAggregators,
      collapseAllGroups: collapseAllGroups,
      expandAllGroups: expandAllGroups,
      isGroupCollapsed: isGroupCollapsed,
      collapseGroup: collapseGroup,
      expandGroup: expandGroup,
      getGroups: getGroups,
      getIdxById: getIdxById,
      getRowById: getRowById,
      getItemById: getItemById,
      getItemByIdx: getItemByIdx,
      mapRowsToIds: mapRowsToIds,
      mapIdsToRows: mapIdsToRows,
      setRefreshHints: setRefreshHints,
      getRefreshHints: getRefreshHints,
      getFilterArgs: getFilterArgs,
      setFilterArgs: setFilterArgs,
      refresh: refresh,
      updateItem: updateItem,
      insertItem: insertItem,
      addItem: addItem,
      deleteItem: deleteItem,
      syncGridSelection: syncGridSelection,
      syncGridCellCssStyles: syncGridCellCssStyles,

      // data provider methods
      getLength: getLength,
      getItem: getItem,
      getItemMetadata: getItemMetadata,

      // events
      onRowCountChanged: onRowCountChanged,
      onRowsChanged: onRowsChanged,
      onPagingInfoChanged: onPagingInfoChanged
    });
  }


  /**
   * [AvgAggregator description]
   *
   * @param {String} field [description]
   * 
   * @class 
   * @memberof Slick.Data.Aggregators
   * @constructor
   */
  function AvgAggregator(field) {
    this.field_ = field;

    this.init = function (groupingInfo, group, totals) {
      this.count_ = 0;
      this.nonNullCount_ = 0;
      this.sum_ = 0;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      this.count_++;
      if (val != null && val !== "" && isFinite(val)) {
        this.nonNullCount_++;
        this.sum_ += parseFloat(val);
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.avg) {
        groupTotals.avg = {};
      }
      if (this.nonNullCount_ !== 0) {
        groupTotals.avg[this.field_] = this.sum_ / this.nonNullCount_;
      }
    };
  }

  /**
   * [MinAggregator description]
   *
   * @param {String} field [description]
   * 
   * @class 
   * @memberof Slick.Data.Aggregators
   * @constructor
   */
  function MinAggregator(field) {
    this.field_ = field;

    this.init = function (groupingInfo, group, totals) {
      this.min_ = null;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      if (val != null && val !== "" && isFinite(val)) {
        val = parseFloat(val);
        if (this.min_ == null || val < this.min_) {
          this.min_ = val;
        }
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.min) {
        groupTotals.min = {};
      }
      groupTotals.min[this.field_] = this.min_;
    };
  }

  /**
   * [MaxAggregator description]
   *
   * @param {String} field [description]
   * 
   * @class 
   * @memberof Slick.Data.Aggregators
   * @constructor
   */
  function MaxAggregator(field) {
    this.field_ = field;

    this.init = function (groupingInfo, group, totals) {
      this.max_ = null;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      if (val != null && val !== "" && isFinite(val)) {
        val = parseFloat(val);
        if (this.max_ == null || val > this.max_) {
          this.max_ = val;
        }
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.max) {
        groupTotals.max = {};
      }
      groupTotals.max[this.field_] = this.max_;
    };
  }

  /**
   * [SumAggregator description]
   *
   * @param {String} field [description]
   * 
   * @class 
   * @memberof Slick.Data.Aggregators
   * @constructor
   */
  function SumAggregator(field) {
    this.field_ = field;

    this.init = function (groupingInfo, group, totals) {
      this.sum_ = null;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      if (val != null && val !== "" && isFinite(val)) {
        this.sum_ += parseFloat(val);
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.sum) {
        groupTotals.sum = {};
      }
      groupTotals.sum[this.field_] = this.sum_;
    };
  }

  /**
   * [MdeAggregator description]
   *
   * @param {String} field [description]
   * 
   * @class 
   * @memberof Slick.Data.Aggregators
   * @constructor
   */
  function MdeAggregator(field) {
    this.field_ = field;

    this.init = function (groupingInfo, group, totals) {
      this.pairs_ = [];
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      var found = false;
      if (val != null && val !== "" && isFinite(val)) {
        val = parseFloat(val);
        for (var i = 0, len = this.pairs_.length; i < len; i++) {
          if (this.pairs_[i].value === val) {
            this.pairs_[i].count++;
            found = true;
            break;
          }
        }
        if (!found) {
          this.pairs_.push({
            value: val, 
            count: 1
          });
        }
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.mde) {
        groupTotals.mde = {};
      }
      var maxCountI = 0;
      for (var i = 0, len = this.pairs_.length; i < len; i++) {
        if ((this.pairs_[i].count > this.pairs_[maxCountI].count) || ((this.pairs_[i].count === this.pairs_[maxCountI].count) && (this.pairs_[i].value < this.pairs_[maxCountI].value))) {
          maxCountI = i;
        }
      }
      if (typeof this.pairs_[maxCountI] !== "undefined") {
        groupTotals.mde[this.field_] = this.pairs_[maxCountI].value;
      }
    };
  }

  /**
   * [MdnAggregator description]
   *
   * @param {String} field [description]
   * 
   * @class 
   * @memberof Slick.Data.Aggregators
   * @constructor
   */
  function MdnAggregator(field) {
    this.field_ = field;

    this.init = function (groupingInfo, group, totals) {
      this.sorted_ = [];
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      var spliced = false;
      if (val != null && val !== "" && isFinite(val)) {
        val = parseFloat(val);
        for (var i = 0, len = this.sorted_.length; i < len; i++) {
          if (val < this.sorted_[i]) {
            this.sorted_.splice(i, 0, val);
            spliced = true;
            break;
          }
        }
        if (!spliced) {
          this.sorted_.push(val);
        }
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.mdn) {
        groupTotals.mdn = {};
      }
      var n = this.sorted_.length;
      if (n % 2 === 1) {
        groupTotals.mdn[this.field_] = this.sorted_[(n - 1) / 2];
      } else {
        var i = n / 2;
        groupTotals.mdn[this.field_] = 0.5 * (this.sorted_[i] + this.sorted_[i - 1]);
      }
    };
  }

  /**
   * [StdAggregator description]
   *
   * @param {String} field [description]
   * 
   * @class 
   * @memberof Slick.Data.Aggregators
   * @constructor
   */
  function StdAggregator(field) {
    this.field_ = field;

    this.init = function (groupingInfo, group, totals) {
      this.nonNullCount_ = 0;
      this.Mk_ = null;
      this.Qk_ = 0;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      if (val != null && val !== "" && isFinite(val)) {
        val = parseFloat(val);
        this.nonNullCount_++;
        if (this.Mk_ != null) {
          this.Qk_ = this.Qk_ + (this.nonNullCount_ - 1) * Math.pow((val - this.Mk_), 2) / this.nonNullCount_;
          this.Mk_ = this.Mk_ + (val - this.Mk_) / this.nonNullCount_;
        } else {
          this.Mk_ = val;
        }
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.std) {
        groupTotals.std = {};
      }
      if (this.nonNullCount_) {
        groupTotals.std[this.field_] = Math.sqrt(this.Qk_ / this.nonNullCount_);
      }
    };
  }

  /**
   * [CheckCountAggregator description]
   *
   * @param {String} field [description]
   * 
   * @class 
   * @memberof Slick.Data.Aggregators
   * @constructor
   */
  function CheckCountAggregator(field) {
    this.field_ = field;

    this.init = function () {
      this.count_ = 0;
      this.checkCount_ = 0;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      this.count_++;
      if (val) {
        this.checkCount_++;
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.checkCount) {
        groupTotals.checkCount = {};
      }

      groupTotals.checkCount[this.field_] = {
        checked: this.checkCount_,
        count: this.count_
      };
    };
  }

  /**
   * [DateRangeAggregator description]
   *
   * @param {String} field [description]
   * 
   * @class 
   * @memberof Slick.Data.Aggregators
   * @constructor
   */
  function DateRangeAggregator(field) {
    this.field_ = field;

    this.init = function () {
      this.min_ = null;
      this.max_ = null;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      if (val && val.valueOf) {
        val = val.valueOf();
        if (this.min_ === null || this.min_ > val)
          this.min_ = val;
        if (this.max_ === null || this.max_ < val)
          this.max_ = val;
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.dateRange)
        groupTotals.dateRange = {};

      groupTotals.dateRange[this.field_] = {
        min: this.min_ === null ? null : new Date(this.min_),
        max: this.max_ === null ? null : new Date(this.max_)
      };
    };
  }

  /**
   * [UniqueAggregator description]
   *
   * @param {String} field [description]
   * 
   * @class 
   * @memberof Slick.Data.Aggregators
   * @constructor
   */
  function UniqueAggregator(field) {
    this.field_ = field;

    this.init = function () {
      this.valueSeen_ = null;
      this.isStillUnique_ = true;
    };

    this.accumulate = function (item) {
      var currentValue = item[this.field_];
      if (!this.isStillUnique_)
        return;

      if (this.valueSeen_ === null) {
        this.valueSeen_ = currentValue;
      } else if (this.valueSeen_ !== currentValue) {
        this.valueSeen_ = null;
        this.isStillUnique_ = false;
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.unique) {
        groupTotals.unique = {};
      }
      groupTotals.unique[this.field_] = this.valueSeen_;
    }
  }

  /**
   * [WeightedAverageAggregator description]
   *
   * @param {String} field       [description]
   * @param {String} weightField [description]
   * 
   * @class 
   * @memberof Slick.Data.Aggregators
   * @constructor
   */
  function WeightedAverageAggregator(field, weightField) {
    this.field_ = field;
    this.weightField_ = weightField;

    this.init = function () {
      this.weightedSum_ = null;
      this.weightSum_ = null;
    };

    this.accumulate = function (item) {
      var currentValue = item[this.field_];
      var currentWeight = item[this.weightField_];

      // we only accumulate if both the value and the weight are numbers.
      // this is equivalent to treating null weights or values as zero
      // weight or values.
      if (currentValue != null && currentValue !== "" && isFinite(currentValue) &&
          currentWeight != null & currentWeight !== "" && isFinite(currentWeight)) {
        var parsedWeight = parseFloat(currentWeight);
        this.weightedSum_ += parseFloat(currentValue) * parsedWeight;
        this.weightSum_ += parsedWeight;
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.weightedAverage) {
        groupTotals.weightedAverage = {};
      }
      groupTotals.weightedAverage[this.field_] = this.weightedSum_ / this.weightSum_;
    }
  }

  // TODO:  add more built-in aggregators
  // TODO:  merge common aggregators in one to prevent needless iterating


  $.extend(true, window, /* @nocollapse */ {
    Slick: {
      Data: {
        DataView: DataView,
        Aggregators: {
          Avg: AvgAggregator,
          Mde: MdeAggregator,
          Mdn: MdnAggregator,
          Min: MinAggregator,
          Max: MaxAggregator,
          Sum: SumAggregator,
          Std: StdAggregator,
          CheckCount: CheckCountAggregator,
          DateRange: DateRangeAggregator,
          Unique: UniqueAggregator,
          WeightedAverage: WeightedAverageAggregator
        }
      }
    }
  });

})(jQuery);

