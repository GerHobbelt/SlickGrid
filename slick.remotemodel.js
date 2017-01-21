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

  var defaults = {
    pagesize: 50,
    page_margin: 150,

    responseItemsMemberName:          "items",
    responseTotalCountMemberName:     "total",
    responseItemsCountMemberName:     "count",
    responseOffsetMemberName:         "offset",
    responseLimitMemberName:          "limit",
    responseIdentitiesMemberName:     "identities"
  };

  function PagingAdapter(options) {
    options = $.extend(true, {}, defaults, options);
    return {
      dataLoaded: function(req, res) {
        var
          items = res[options.responseItemsMemberName],
          from = req.fromPage * options.pagesize,
          to = from + items.length,
          count = items.length,
          total = parseInt(res[options.responseTotalCountMemberName], 10);

        return {
          items: items,
          from: from,
          to: to,
          count: count,
          total: total,
          identities: res[options.responseItemsMemberName]
        };
      }
    };
  }

  function ArrayAdapter(options) {
    return {
      dataLoaded: function(req, res) {
        return {
          items: res,
          from: 0,
          to: res.lenth,
          count: res.length,
          total: res.length
        };
      }
    };
  }


  /*

    data provider api: {
      getItem,
      getLength / length if array
      getItemMetadata
    }


  */

  function RemoteModel(options) {
    options = $.extend({ adapter: new PagingAdapter() }, defaults, options);
    var
      _data = { length: 0 },
      _grid,
      _lastQueryParams,
      _identities,
      _sortCols = [],
      _filters = [],
      _ajaxOptions = options.ajaxOptions || {},
      _url = options.url,
      _query = options.query || {},
      //queryStringSep,
      h_request,
      req; // ajax request

    //var urlSplit = urlRoot.split('/');
    //queryStringSep = urlSplit[urlSplit.length-1].indexOf('?') > -1 ? '&' : '?';

    // events
    var
      onDataLoading = new Slick.Event(),
      onDataLoaded = new Slick.Event(),
      onDataLoadError = new Slick.Event(),
      onDataLoadAbort = new Slick.Event();

    function isDataLoaded(from, to) {
      for (var i = from; i <= to; i++) {
        if (_data[i] === undefined || _data[i] === null) {
          return false;
        }
      }
      return true;
    }

    function clear() {
      for (var key in _data) {
        delete _data[key];
      }
      _data.length = 0;
    }

    function refresh() {
      var vp = _grid.getViewport();
      ensureData({
        from: vp.top,
        to: vp.bottom,
        force: true
      });
    }


    function setQuery(obj) {
      _query = obj;
    }

    function addQuery(obj) {
      _query = $.extend(true, _query, obj);
    }

    function clearQuery() {
      setQuery({});
    }


    /**
      * from, to, ajaxOptions, force
      */
    function ensureData(opts) {
      opts = opts || {};

      // calculating pages
      var
        fromPage = Math.floor(Math.max(0, opts.from) / options.pagesize),
        toPage = Math.floor(opts.to / options.pagesize);
      var i;

      while (typeof _data[fromPage * options.pagesize] !== 'undefined' && fromPage < toPage) {
        fromPage++;
      }

      while (typeof _data[toPage * options.pagesize] !== 'undefined' && fromPage < toPage) {
        toPage--;
      }

      if (fromPage > toPage
        || ((fromPage == toPage) && typeof _data[fromPage * options.pagesize] !== 'undefined')
        && (opts.force !== true) ) {
        // TODO:  look-ahead
        return;
      }

      // it there's a running request we cancel it.
      // TODO: not cancel but save the result
      if (req) {
        req.abort();
        for (i = req.fromPage; i <= req.toPage; i++) {
          delete _data[i * options.pagesize];
        }
      }

      // building query
      var queryParams = $.extend(true, {}, {
        $skip: fromPage * options.pagesize,
        $top: ((toPage - fromPage) * options.pagesize) + options.pagesize
      }, _query);

      if (_sortCols && _sortCols.length) {
        var order = '', current;
        for (i = 0; i < _sortCols.length; i++) {
          current = _sortCols[i];
          order += (i > 0 ? ',' : '') + current.field;
          if (i === _sortCols.length - 1
            || (i < _sortCols.length - 1 && _sortCols[i + 1].dir !== current.dir)) {
            order += current.dir === 1 ? ' asc' : ' desc';
          }
        }
        queryParams.$orderby = order;
      }

      // ------------------------------
      // hack to ensure not bombing server with the same requests
      if (!opts.force && _.isEqual(queryParams, _lastQueryParams)) {
        return false;
      }
      _lastQueryParams = queryParams;
      // ------------------------------

      url = _url + '?' + $.param(queryParams).replace(/\%24/g, '$');

      if (h_request !== null) {
        clearTimeout(h_request);
      }

      h_request = setTimeout(function() {
        for (var i = fromPage; i <= toPage; i++) {
          _data[i * options.pagesize] = null; // null indicates a 'requested but not available yet'
        }

        onDataLoading.notify({from: opts.from, to: opts.to});

        req = $.ajax({
          url: url,
          contentType: 'application/json',
          dataType: 'json',
          success: onSuccess,
          error: function(err) {
            onError(fromPage, toPage, err);
          }
        }/*, ajaxOptions)*/);

        req.fromPage = fromPage;
        req.toPage = toPage;
      }, 50);
    }


    function onError(fromPage, toPage, error) {
      if (error && error.statusText === 'abort') {
        onDataLoadAbort.notify({
          fromPage: fromPage,
          toPage: toPage,
          error: error
        });
        return;
      }

      console.error("error loading pages " + fromPage + " to " + toPage, error);
      onDataLoadError.notify({
        fromPage: fromPage,
        toPage: toPage,
        error: error
      });
    }

    function onSuccess(res) {
      //Solution to keep the data array bounded to pagesize + window: Call the clear method to have only 2*PAGESIZE elements in the data array at any given point
      clear();
      var tx = options.adapter.dataLoaded(req, res);
      _data.length = tx.total;

      for (var i = 0; i < tx.count; i++) {
        _data[tx.from + i] = tx.items[i];
        _data[tx.from + i].index = tx.from + i;
      }

      _identities = tx.identities;

      req = null;

      onDataLoaded.notify({
        from: tx.from,
        to: tx.to,
        count: tx.count,
        total: tx.total,
        identities: _identities
      });
    }


    function getIdentities() {
      return _identities;
    }


    /*
     *  Plugin
     */
    function init(slickgrid) {
      _grid = slickgrid;
      slickgrid.onViewportChanged.subscribe(refresh);
      slickgrid.onSort.subscribe(onGridSort);
      onDataLoaded.subscribe(updatreGridOnDataLoaded);
    }

    function destroy() {
      onDataLoaded.unsubscribe(updatreGridOnDataLoaded);
      _grid.onSort.unsubscribe(onGridSort);
      _grid.onViewportChanged.unsubscribe(onGridViewportChanged);
    }

    function onGridSort(e, args) {
      var
        result = [], column,
        cols = _grid.getColumns(),
        sortCols = _grid.getSortColumns();

      $.each(sortCols, function(k, col) {
        column = cols[_grid.getColumnIndex(col.columnId)];

        var direction = col.sortAsc ? 1 : -1;
        if (column.order_fields) {
          $.each(column.order_fields, function(k, v) {
            result.push({
              field: v,
              dir: direction
            });
          });
        } else {
          result.push({
            field: column.field,
            dir: direction
          });
        }
      });
      _sortCols = result;
      refresh();
    }

    function updatreGridOnDataLoaded(e, args) {
      for (var i = args.from; i <= args.to; i++) {
        _grid.invalidateRow(i);
      }
      _grid.updateRowCount();
      _grid.render();
    }

    return {
      // properties
      "data": _data,
      "defaults": defaults,

      // methods
      "clear": clear,
      "init": init,
      "isDataLoaded": isDataLoaded,
      "refresh": refresh,
      "ensureData": ensureData,
      //"reloadData": reloadData,
      "getIdentities": getIdentities,

      "setQuery": setQuery,
      "addQuery": addQuery,
      "clearQuery": clearQuery,

      // events
      "onDataLoading": onDataLoading,
      "onDataLoaded": onDataLoaded,
      "onDataLoadError" : onDataLoadError,
      "onDataLoadAbort": onDataLoadAbort
    };
  }

  function ODataSortAdapter(argument) {
    // ...
  }


  // Slick.Data.RemoteModel
  RemoteModel.PagingAdapter = PagingAdapter;
  RemoteModel.ArrayAdapter = ArrayAdapter;


  $.extend(true, window, {
    Slick: {
      Data: {
        RemoteModel: RemoteModel,
        ODataSortAdapter: ODataSortAdapter
      }
    }
  });
})(jQuery);
