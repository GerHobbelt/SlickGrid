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

module("basic");

function assertEmpty(dv) {
    deepEqual(0, dv.getLength(), ".rows is initialized to an empty array");
    deepEqual(dv.getItems().length, 0, "getItems().length");
    deepEqual(undefined, dv.getIdxById("id"), "getIdxById should return undefined if not found");
    deepEqual(undefined, dv.getRowById("id"), "getRowById should return undefined if not found");
    deepEqual(undefined, dv.getItemById("id"), "getItemById should return undefined if not found");
    deepEqual(undefined, dv.getItemByIdx(0), "getItemByIdx should return undefined if not found");
}

function assertConsistency(dv, idProperty, grouping) {
    idProperty = idProperty || "id";
    grouping = grouping || {};
    grouping.totalGroupRows = grouping.totalGroupRows || 0;
    grouping.totalGroupTotalsRows = grouping.totalGroupTotalsRows || 0;
    var items = dv.getItems(),
        filteredOut = 0,
        row,
        id,
        item,
        i, 
        len;
    var groupRows = 0;
    var groupTotalsRows = 0;

    for (i = 0; i < items.length; i++) {
        id = items[i][idProperty];
        deepEqual(dv.getItemByIdx(i), items[i], "getItemByIdx");
        deepEqual(dv.getItemById(id), items[i], "getItemById");
        deepEqual(dv.getIdxById(id), i, "getIdxById");

        row = dv.getRowById(id);
        if (row === undefined) {
            filteredOut++;
        } else {
            deepEqual(dv.getItem(row), items[i], "getRowById");
        }
    }

    for (i = 0, len = dv.getLength(); i < len; i++) {
        item = dv.getItem(i);
        id = item[idProperty];
        if (id != null) {
            row = dv.getRowById(id);
            deepEqual(row, i, "id points to correct row for data item");
            deepEqual(dv.getItemById(id), items[dv.getIdxById(id)], "getItem");
        } else {
            ok(item.__group ^ item.__groupTotals, "all non-data rows are either group header rows or group totals rows");
            if (item.__group) {
                groupRows++;
            }
            else if (item.__groupTotals) {
                groupTotalsRows++;
            }
        }
    }

    deepEqual(groupRows, grouping.totalGroupRows, "expected number of group rows");
    deepEqual(groupTotalsRows, grouping.totalGroupTotalsRows, "expected number of group totals rows");
    deepEqual(grouping.totalGroupRows + grouping.totalGroupTotalsRows + items.length - dv.getLength(), filteredOut, "filtered rows");
}

function assertEventInfo(args, e, dv, self) {
    ok(args && args.dataView === dv, "event args includes DataView reference");
    ok(self === dv, "event callback `this` references the DataView");
}

test("initial setup", function () {
    var dv = new Slick.Data.DataView();
    assertEmpty(dv);
});

test("initial setup, refresh", function () {
    var dv = new Slick.Data.DataView();
    dv.refresh();
    assertEmpty(dv);
});


module("setItems");

test("empty", function () {
    var dv = new Slick.Data.DataView();
    dv.setItems([]);
    assertEmpty(dv);
});

test("basic", function () {
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0}, {id: 1}]);
    deepEqual(2, dv.getLength(), "rows.length");
    deepEqual(dv.getItems().length, 2, "getItems().length");
    assertConsistency(dv);
});

test("alternative idProperty", function () {
    var dv = new Slick.Data.DataView();
    dv.setItems([{uid: 0}, {uid: 1}], "uid");
    assertConsistency(dv, "uid");
});

test("requires an id on objects", function () {
    var dv = new Slick.Data.DataView();
    throws(function () {
        dv.setItems([1, 2, 3]);
    }, /unique/, "exception expected");
});

test("requires a unique id on objects", function () {
    var dv = new Slick.Data.DataView();
    throws(function () {
        dv.setItems([{id: 0}, {id: 0}]);
    }, /unique/, "exception expected");
});

test("requires a unique id on objects (alternative idProperty)", function () {
    var dv = new Slick.Data.DataView();
    throws(function () {
        dv.setItems([{uid: 0}, {uid: 0}], "uid");
    }, /unique/, "exception expected");
});

test("events fired on setItems", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);

        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.previous, 0, "previous arg");
        deepEqual(args.current, 2, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.pageSize, 0, "pageSize arg");
        deepEqual(args.pageNum, 0, "pageNum arg");
        deepEqual(args.totalRows, 2, "totalRows arg");
        count++;
    });
    dv.setItems([{id: 0}, {id: 1}]);
    dv.refresh();
    deepEqual(3, count, "3 events should have been called");
});

test("no events on setItems([])", function () {
    expect(0);
    var dv = new Slick.Data.DataView();
    dv.onRowsChanged.subscribe(function () {
        ok(false, "onRowsChanged called");
    });
    dv.onRowCountChanged.subscribe(function () {
        ok(false, "onRowCountChanged called");
    });
    dv.onPagingInfoChanged.subscribe(function () {
        ok(false, "onPagingInfoChanged called");
    });
    dv.setItems([]);
    dv.refresh();
});

test("no events on setItems followed by refresh", function () {
    expect(0);
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0}, {id: 1}]);
    dv.onRowsChanged.subscribe(function () {
        ok(false, "onRowsChanged called");
    });
    dv.onRowCountChanged.subscribe(function () {
        ok(false, "onRowCountChanged called");
    });
    dv.onPagingInfoChanged.subscribe(function () {
        ok(false, "onPagingInfoChanged called");
    });
    dv.refresh();
});

test("no refresh while suspended", function () {
    var dv = new Slick.Data.DataView();
    dv.beginUpdate();
    dv.onRowsChanged.subscribe(function () {
        ok(false, "onRowsChanged called");
    });
    dv.onRowCountChanged.subscribe(function () {
        ok(false, "onRowCountChanged called");
    });
    dv.onPagingInfoChanged.subscribe(function () {
        ok(false, "onPagingInfoChanged called");
    });
    dv.setItems([{id: 0}, {id: 1}]);
    dv.setFilter(function (o) {
        return true;
    });
    dv.refresh();
    deepEqual(dv.getLength(), 0, "rows aren't updated until resumed");
});

test("refresh fires after resume", function () {
    var dv = new Slick.Data.DataView();
    dv.beginUpdate();
    dv.setItems([{id: 0}, {id: 1}]);
    deepEqual(dv.getItems().length, 2, "items updated immediately");
    dv.setFilter(function (o) {
        return true;
    });
    dv.refresh();

    var count = 0;
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [0, 1]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.previous, 0, "previous arg");
        deepEqual(args.current, 2, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.pageSize, 0, "pageSize arg");
        deepEqual(args.pageNum, 0, "pageNum arg");
        deepEqual(args.totalRows, 2, "totalRows arg");
        count++;
    });
    dv.endUpdate();
    equal(count, 3, "events fired");
    deepEqual(dv.getItems().length, 2, "items are the same");
    deepEqual(dv.getLength(), 2, "rows updated");
});

module("sort");

test("happy path", function () {
    var count = 0;
    var items = [{id: 2, val: 2}, {id: 1, val: 1}, {id: 0, val: 0}];
    var dv = new Slick.Data.DataView();
    dv.setItems(items);
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);

        count++;
    });
    dv.onRowCountChanged.subscribe(function () {
        ok(false, "onRowCountChanged called");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function () {
        ok(false, "onPagingInfoChanged called");
        count++;
    });
    dv.sort(function (x, y) {
        return x.val - y.val;
    }, true);
    equal(count, 1, "events fired");
    deepEqual(dv.getItems(), items, "original array should get sorted");
    deepEqual(items, [{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}], "sort order");
    assertConsistency(dv);
});

test("asc by default", function () {
    var items = [{id: 2, val: 2}, {id: 1, val: 1}, {id: 0, val: 0}];
    var dv = new Slick.Data.DataView();
    dv.setItems(items);
    dv.sort(function (x, y) {
        return x.val - y.val;
    });
    deepEqual(items, [{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}], "sort order");
});

test("desc", function () {
    var items = [{id: 0, val: 0}, {id: 2, val: 2}, {id: 1, val: 1}];
    var dv = new Slick.Data.DataView();
    dv.setItems(items);
    dv.sort(function (x, y) {
        return -1 * (x.val - y.val);
    });
    deepEqual(items, [{id: 2, val: 2}, {id: 1, val: 1}, {id: 0, val: 0}], "sort order");
});

test("sort is stable", function () {
    var items = [{id: 0, val: 0}, {id: 2, val: 2}, {id: 3, val: 2}, {id: 1, val: 1}];
    var dv = new Slick.Data.DataView();
    dv.setItems(items);

    dv.sort(function (x, y) {
        return x.val - y.val;
    });
    deepEqual(items, [{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}, {id: 3, val: 2}], "sort order");

    dv.sort(function (x, y) {
        return x.val - y.val;
    });
    deepEqual(items, [{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}, {id: 3, val: 2}], "sorting on the same column again doesn't change the order");

    dv.sort(function (x, y) {
        return -1 * (x.val - y.val);
    });
    deepEqual(items, [{id: 2, val: 2}, {id: 3, val: 2}, {id: 1, val: 1}, {id: 0, val: 0}], "sort order");
});


module("filtering");

test("applied immediately", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [0]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.previous, 3, "previous arg");
        deepEqual(args.current, 1, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.pageSize, 0, "pageSize arg");
        deepEqual(args.pageNum, 0, "pageNum arg");
        deepEqual(args.totalRows, 1, "totalRows arg");
        count++;
    });
    dv.setFilter(function (o) {
        return o.val === 1;
    });
    equal(count, 3, "events fired");
    deepEqual(dv.getItems().length, 3, "original data is still there");
    deepEqual(dv.getLength(), 1, "rows are filtered");
    assertConsistency(dv);
});

test("re-applied on refresh", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.setFilterArgs(0);
    dv.setFilter(function (o, args) {
        return o.val >= args;
    });
    deepEqual(dv.getLength(), 3, "nothing is filtered out");
    assertConsistency(dv);

    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [0]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.previous, 3, "previous arg");
        deepEqual(args.current, 1, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.pageSize, 0, "pageSize arg");
        deepEqual(args.pageNum, 0, "pageNum arg");
        deepEqual(args.totalRows, 1, "totalRows arg");
        count++;
    });
    dv.setFilterArgs(2);
    dv.refresh();
    equal(count, 3, "events fired");
    deepEqual(dv.getItems().length, 3, "original data is still there");
    deepEqual(dv.getLength(), 1, "rows are filtered");
    assertConsistency(dv);
});

test("re-applied on sort", function () {
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.setFilter(function (o) {
        return o.val === 1;
    });
    deepEqual(dv.getLength(), 1, "one row is remaining");

    dv.onRowsChanged.subscribe(function () {
        ok(false, "onRowsChanged called");
    });
    dv.onRowCountChanged.subscribe(function () {
        ok(false, "onRowCountChanged called");
    });
    dv.onPagingInfoChanged.subscribe(function () {
        ok(false, "onPagingInfoChanged called");
    });
    dv.sort(function (x, y) {
        return x.val - y.val;
    }, false);
    deepEqual(dv.getItems().length, 3, "original data is still there");
    deepEqual(dv.getLength(), 1, "rows are filtered");
    assertConsistency(dv);
});

test("all", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(false, "onRowsChanged called");
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.previous, 3, "previous arg");
        deepEqual(args.current, 0, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.pageSize, 0, "pageSize arg");
        deepEqual(args.pageNum, 0, "pageNum arg");
        deepEqual(args.totalRows, 0, "totalRows arg");
        count++;
    });
    dv.setFilter(function (o) {
        return false;
    });
    equal(count, 2, "events fired");
    deepEqual(dv.getItems().length, 3, "original data is still there");
    deepEqual(dv.getLength(), 0, "rows are filtered");
    assertConsistency(dv);
});

test("all then none", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.setFilterArgs(false);
    dv.setFilter(function (o, args) {
        return args;
    });
    deepEqual(dv.getLength(), 0, "all rows are filtered out");

    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [0, 1, 2]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.previous, 0, "previous arg");
        deepEqual(args.current, 3, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.pageSize, 0, "pageSize arg");
        deepEqual(args.pageNum, 0, "pageNum arg");
        deepEqual(args.totalRows, 3, "totalRows arg");
        count++;
    });
    dv.setFilterArgs(true);
    dv.refresh();
    equal(count, 3, "events fired");
    deepEqual(dv.getItems().length, 3, "original data is still there");
    deepEqual(dv.getLength(), 3, "all rows are back");
    assertConsistency(dv);
});

test("inlining replaces absolute returns", function () {
    var dv = new Slick.Data.DataView({ inlineFilters: true });
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.setFilter(function (o) {
        if (o.val === 1) {
            return true;
        } else if (o.val === 4) {
            return true;
        }
        return false;
    });
    deepEqual(dv.getLength(), 1, "one row is remaining");

    dv.onRowsChanged.subscribe(function () {
        ok(false, "onRowsChanged called");
    });
    dv.onRowCountChanged.subscribe(function () {
        ok(false, "onRowCountChanged called");
    });
    dv.onPagingInfoChanged.subscribe(function () {
        ok(false, "onPagingInfoChanged called");
    });
    deepEqual(dv.getItems().length, 3, "original data is still there");
    deepEqual(dv.getLength(), 1, "rows are filtered");
    assertConsistency(dv);
});

test("inlining replaces evaluated returns", function () {
    var dv = new Slick.Data.DataView({ inlineFilters: true });
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.setFilter(function (o) {
        if (o.val === 0) {
            return o.id === 2;
        } else if (o.val === 1) {
            return o.id === 2;
        }
        return o.val === 2;
    });
    deepEqual(dv.getLength(), 1, "one row is remaining");

    dv.onRowsChanged.subscribe(function () {
        ok(false, "onRowsChanged called");
    });
    dv.onRowCountChanged.subscribe(function () {
        ok(false, "onRowCountChanged called");
    });
    dv.onPagingInfoChanged.subscribe(function () {
        ok(false, "onPagingInfoChanged called");
    });
    deepEqual(dv.getItems().length, 3, "original data is still there");
    deepEqual(dv.getLength(), 1, "rows are filtered");
    assertConsistency(dv);
});

module("updateItem");

test("basic", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);

    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [1]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(false, "onRowCountChanged called");
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(false, "onPagingInfoChanged called");
    });

    dv.updateItem(1, {id: 1, val: 1337});
    equal(count, 1, "events fired");
    deepEqual(dv.getItem(1), {id: 1, val: 1337}, "item updated");
    assertConsistency(dv);
});

test("updating an item not passing the filter", function () {
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}, {id: 3, val: 1337}]);
    dv.setFilter(function (o) {
        return o.val !== 1337;
    });
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(false, "onRowsChanged called");
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(false, "onRowCountChanged called");
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(false, "onPagingInfoChanged called");
    });
    dv.updateItem(3, {id: 3, val: 1337});
    deepEqual(dv.getItems()[3], {id: 3, val: 1337}, "item updated");
    assertConsistency(dv);
});

test("updating an item to pass the filter", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}, {id: 3, val: 1337}]);
    dv.setFilter(function (o) {
        return o.val !== 1337;
    });
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [3]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.previous, 3, "previous arg");
        equal(args.current, 4, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.pageSize, 0, "pageSize arg");
        deepEqual(args.pageNum, 0, "pageNum arg");
        deepEqual(args.totalRows, 4, "totalRows arg");
        count++;
    });
    dv.updateItem(3, {id: 3, val: 3});
    equal(count, 3, "events fired");
    deepEqual(dv.getItems()[3], {id: 3, val: 3}, "item updated");
    assertConsistency(dv);
});

test("updating an item to not pass the filter", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}, {id: 3, val: 3}]);
    dv.setFilter(function (o) {
        return o.val !== 1337;
    });
    dv.onRowsChanged.subscribe(function (e, args) {
        console.log(args);
        ok(false, "onRowsChanged called");
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.previous, 4, "previous arg");
        equal(args.current, 3, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        deepEqual(args.pageSize, 0, "pageSize arg");
        deepEqual(args.pageNum, 0, "pageNum arg");
        deepEqual(args.totalRows, 3, "totalRows arg");
        count++;
    });
    dv.updateItem(3, {id: 3, val: 1337});
    equal(count, 2, "events fired");
    deepEqual(dv.getItems()[3], {id: 3, val: 1337}, "item updated");
    assertConsistency(dv);
});


module("addItem");

test("must have id", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    throws(function () {
        dv.addItem({val: 1337});
    }, /unique/, "exception thrown");
});

test("must have id (custom)", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{uid: 0, val: 0}, {uid: 1, val: 1}, {uid: 2, val: 2}], "uid");
    throws(function () {
        dv.addItem({id: 3, val: 1337});
    }, /unique/, "exception thrown");
});

test("basic", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [3]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.previous, 3, "previous arg");
        equal(args.current, 4, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.pageSize, 0, "pageSize arg");
        equal(args.pageNum, 0, "pageNum arg");
        equal(args.totalRows, 4, "totalRows arg");
        count++;
    });
    dv.addItem({id: 3, val: 1337});
    equal(count, 3, "events fired");
    deepEqual(dv.getItems()[3], {id: 3, val: 1337}, "item updated");
    deepEqual(dv.getItem(3), {id: 3, val: 1337}, "item updated");
    assertConsistency(dv);
});

test("add an item not passing the filter", function () {
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.setFilter(function (o) {
        return o.val !== 1337;
    });
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(false, "onRowsChanged called");
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(false, "onRowCountChanged called");
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(false, "onPagingInfoChanged called");
    });
    dv.addItem({id: 3, val: 1337});
    deepEqual(dv.getItems()[3], {id: 3, val: 1337}, "item updated");
    assertConsistency(dv);
});

module("insertItem");

test("must have id", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    throws(function () {
        dv.insertItem(0, {val: 1337});
    }, /unique/, "exception thrown");
});

test("must have id (custom)", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{uid: 0, val: 0}, {uid: 1, val: 1}, {uid: 2, val: 2}], "uid");
    throws(function () {
        dv.insertItem(0, {id: 3, val: 1337});
    }, /unique/, "exception thrown");
});

test("insert at the beginning", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [0, 1, 2, 3]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.previous, 3, "previous arg");
        equal(args.current, 4, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.pageSize, 0, "pageSize arg");
        equal(args.pageNum, 0, "pageNum arg");
        equal(args.totalRows, 4, "totalRows arg");
        count++;
    });
    dv.insertItem(0, {id: 3, val: 1337});
    equal(count, 3, "events fired");
    deepEqual(dv.getItem(0), {id: 3, val: 1337}, "item updated");
    equal(dv.getItems().length, 4, "items updated");
    equal(dv.getLength(), 4, "rows updated");
    assertConsistency(dv);
});

test("insert in the middle", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [2, 3]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.previous, 3, "previous arg");
        equal(args.current, 4, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.pageSize, 0, "pageSize arg");
        equal(args.pageNum, 0, "pageNum arg");
        equal(args.totalRows, 4, "totalRows arg");
        count++;
    });
    dv.insertItem(2, {id: 3, val: 1337});
    equal(count, 3, "events fired");
    deepEqual(dv.getItem(2), {id: 3, val: 1337}, "item updated");
    equal(dv.getItems().length, 4, "items updated");
    equal(dv.getLength(), 4, "rows updated");
    assertConsistency(dv);
});

test("insert at the end", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [3]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.previous, 3, "previous arg");
        equal(args.current, 4, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.pageSize, 0, "pageSize arg");
        equal(args.pageNum, 0, "pageNum arg");
        equal(args.totalRows, 4, "totalRows arg");
        count++;
    });
    dv.insertItem(3, {id: 3, val: 1337});
    equal(count, 3, "events fired");
    deepEqual(dv.getItem(3), {id: 3, val: 1337}, "item updated");
    equal(dv.getItems().length, 4, "items updated");
    equal(dv.getLength(), 4, "rows updated");
    assertConsistency(dv);
});

module("deleteItem");

test("must have id", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 0, val: 0}, {id: 1, val: 1}, {id: 2, val: 2}]);
    throws(function () {
        dv.deleteItem(-1);
    }, /Invalid/, "exception thrown");
    throws(function () {
        dv.deleteItem(undefined);
    }, /Invalid/, "exception thrown");
    throws(function () {
        dv.deleteItem(null);
    }, /Invalid/, "exception thrown");
    throws(function () {
        dv.deleteItem(3);
    }, /Invalid/, "exception thrown");
});

test("must have id (custom)", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{uid: 0, id: -1, val: 0}, {uid: 1, id: 3, val: 1}, {uid: 2, id: null, val: 2}], "uid");
    throws(function () {
        dv.deleteItem(-1);
    }, /Invalid/, "exception thrown");
    throws(function () {
        dv.deleteItem(undefined);
    }, /Invalid/, "exception thrown");
    throws(function () {
        dv.deleteItem(null);
    }, /Invalid/, "exception thrown");
    throws(function () {
        dv.deleteItem(3);
    }, /Invalid/, "exception thrown");
});

test("delete at the beginning", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 5, val: 0}, {id: 15, val: 1}, {id: 25, val: 2}]);
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [0, 1]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.previous, 3, "previous arg");
        equal(args.current, 2, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.pageSize, 0, "pageSize arg");
        equal(args.pageNum, 0, "pageNum arg");
        equal(args.totalRows, 2, "totalRows arg");
        count++;
    });
    dv.deleteItem(5);
    equal(count, 3, "events fired");
    equal(dv.getItems().length, 2, "items updated");
    equal(dv.getLength(), 2, "rows updated");
    assertConsistency(dv);
});

test("delete in the middle", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 5, val: 0}, {id: 15, val: 1}, {id: 25, val: 2}]);
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, {rows: [1]}, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.previous, 3, "previous arg");
        equal(args.current, 2, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.pageSize, 0, "pageSize arg");
        equal(args.pageNum, 0, "pageNum arg");
        equal(args.totalRows, 2, "totalRows arg");
        count++;
    });
    dv.deleteItem(15);
    equal(count, 3, "events fired");
    equal(dv.getItems().length, 2, "items updated");
    equal(dv.getLength(), 2, "rows updated");
    assertConsistency(dv);
});

test("delete at the end", function () {
    var count = 0;
    var dv = new Slick.Data.DataView();
    dv.setItems([{id: 5, val: 0}, {id: 15, val: 1}, {id: 25, val: 2}]);
    dv.onRowsChanged.subscribe(function (e, args) {
        ok(false, "onRowsChanged called");
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.previous, 3, "previous arg");
        equal(args.current, 2, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.pageSize, 0, "pageSize arg");
        equal(args.pageNum, 0, "pageNum arg");
        equal(args.totalRows, 2, "totalRows arg");
        count++;
    });
    dv.deleteItem(25);
    equal(count, 2, "events fired");
    equal(dv.getItems().length, 2, "items updated");
    equal(dv.getLength(), 2, "rows updated");
    assertConsistency(dv);
});

module("grouping");

function loadData(count, seed, options) {
  // produce predictable 'random' numbers similar to semiRandom.random()
  var semiRandom = new MersenneTwister(seed || 42);
  var someDates = ["01/01/2009", "02/02/2009", "03/03/2009"];
  var data = [];
  // prepare the data
  for (var i = 0; i < count; i++) {
    var d = data[i] = {
       id: i,
       val: ((i ^ 54) % 7),
       title: "Task " + ((i | 6) % 7),
       duration: Math.round(semiRandom.random() * 14),
       percentComplete: Math.round(semiRandom.random() * 100),
       start: someDates[ Math.floor((semiRandom.random() * 2)) ],
       finish: someDates[ Math.floor((semiRandom.random() * 2)) ],
       cost: Math.round(semiRandom.random() * 10000) / 100,
       effortDriven: (i % 5 === 0)
    };
  }
  var dv = new Slick.Data.DataView(options);
  dv.setItems(data);
  return dv;
}

test("does not do anything by default", function () {
    var count = 0;
    var dv = loadData(50, 42);
    equal(dv.getLength(), 50, "no rows are added or removed");
    equal(dv.getItems().length, 50, "each row is an item");
    assertConsistency(dv);
});

test("adds no rows per group (options.showExpandedGroupRows = false)", function () {
    var count = 0;
    var dv = loadData(50, 42, {
        showExpandedGroupRows: false,
        inlineFilters: false
        // idProperty: "id"
        // groupItemMetadataProvider:
        // globalItemMetadataProvider: { getRowMetadata:       function (item, row, cell, rows) { return meta; } }
        // groupItemMetadataProvider:  { getGroupRowMetadata:  function (item, row, cell, rows) { return meta; },
        //                               getTotalsRowMetadata: function (item, row, cell, rows) { return meta; } }
        // flattenGroupedRows: (groups, level, groupingInfos, filteredItems, options) { return rows; }
    });
    var gi = [{
        getter: "val",                  // group by 'val' field
        comparer: function (ga, gb) { return gb.value - ga.value; }, // can also sort by .count, .groups, .rows, .totals (by .level makes no sense)
        formatter: function (g) { return "grouptitle-" + g.value; }, // sets the group.title field
        displayTotalsRow: false,
        collapsed: false,
        aggregateCollapsed: false,
        aggregateEmpty: false
        //aggregators: [...]
        //predefinedValues: [ ... ]
        //getGroupRows: function (self, gi, rows, allFilteredItems, level, parentGroup) { return rows; }
    }];
    dv.setGrouping(gi);

    equal(dv.getLength(), 50, "no rows are added or removed");
    equal(dv.getItems().length, 50, "each row is an item");
    assertConsistency(dv);
});

test("adds one row per group when you do not have any aggregators", function () {
    var count = 0;
    var dv = loadData(50, 42, {
        showExpandedGroupRows: true,
        inlineFilters: false
        // idProperty: "id"
        // groupItemMetadataProvider:
        // globalItemMetadataProvider: { getRowMetadata:       function (item, row, cell, rows) { return meta; } }
        // groupItemMetadataProvider:  { getGroupRowMetadata:  function (item, row, cell, rows) { return meta; },
        //                               getTotalsRowMetadata: function (item, row, cell, rows) { return meta; } }
        // flattenGroupedRows: (groups, level, groupingInfos, filteredItems, options) { return rows; }
    });

    var expectation = {
        totalGroupRows: 0,
        totalGroupTotalsRows: 0,
        totalDataItems: 50,
        oldtotalRows: 50,
        updatedRows: {
            rows: [ 0,
                    2, 3, 4, 5, 6, 7, 8, 9, 10,
                    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
                    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56
                ]
        }
    };

    dv.onRowsChanged.subscribe(function (e, args) {
        ok(true, "onRowsChanged called");
        assertEventInfo(args, e, dv, this);
        // and kill the reference to keep subsequent checks simpler
        delete args.dataView;

        deepEqual(args, expectation.updatedRows, "args");
        count++;
    });
    dv.onRowCountChanged.subscribe(function (e, args) {
        ok(true, "onRowCountChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.previous, expectation.oldtotalRows, "previous arg");
        equal(args.current, expectation.totalDataItems + expectation.totalGroupRows + expectation.totalGroupTotalsRows, "current arg");
        count++;
    });
    dv.onPagingInfoChanged.subscribe(function (e, args) {
        ok(true, "onPagingInfoChanged called");
        assertEventInfo(args, e, dv, this);

        equal(args.pageSize, 0, "pageSize arg");
        equal(args.pageNum, 0, "pageNum arg");
        equal(args.totalRows, expectation.totalDataItems + expectation.totalGroupRows + expectation.totalGroupTotalsRows, "totalRows arg");
        count++;
    });

    var gi = [{
        getter: "val",                  // group by 'val' field
        comparer: function (ga, gb) { return gb.value - ga.value; }, // can also sort by .count, .groups, .rows, .totals (by .level makes no sense)
        formatter: function (g) { return "grouptitle-" + g.value; }, // sets the group.title field
        displayTotalsRow: false,
        collapsed: false,
        aggregateCollapsed: false,
        aggregateEmpty: false
        //aggregators: [...]
        //predefinedValues: [ ... ]
        //getGroupRows: function (self, gi, rows, allFilteredItems, level, parentGroup) { return rows; }
    }];

    expectation.totalGroupRows = 7;

    dv.setGrouping(gi);
    equal(count, 2, "events fired");

    equal(dv.getLength(), 50 + 7, "group header rows are included");
    equal(dv.getItems().length, 50, "all data rows remain");
    assertConsistency(dv, null, expectation);

    // clear grouping:
    expectation.totalGroupRows = 0;
    expectation.oldtotalRows = 57;
    expectation.updatedRows = {
        "rows": [ 0,
            2, 3, 4, 5, 6, 7, 8, 9, 10,
            12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
            41, 42, 43, 44, 45, 46, 47, 48, 49
        ]
    };

    dv.setGrouping([]);
    equal(count, 4, "events fired");
    equal(dv.getLength(), 50, "after clear no group header rows are included");
    equal(dv.getItems().length, 50, "all data rows remain");
    assertConsistency(dv, null, expectation);
});



// TODO: paging
// TODO: combination


})(jQuery);
