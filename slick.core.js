/*!
 * @license
 * slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
 * Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
 *
 * Distributed under MIT license.
 * All rights reserved.
 */




/**
 * Contains core SlickGrid classes.
 * 
 * @module Core
 * @namespace Slick
 * @{
 */

(function ($) {
  "use strict";

  /**
   * An event object for passing data to event handlers and letting them control propagation.
   * 
   * This is pretty much identical to how W3C and jQuery implement events.
   * 
   * @class 
   * @constructor
   */
  function EventData(sourceEvent, propagateSignals) {
    var isPropagationStopped = false;
    var isImmediatePropagationStopped = false;
    var isDefaultPrevented = false;

    /**
     * Stops event from executing its default behaviour.
     * 
     * @method 
     */
    this.preventDefault = function (propagateSignalsOverride) {
      isDefaultPrevented = true;
      if ((propagateSignalsOverride == null ? propagateSignals : propagateSignalsOverride) && 
          this.sourceEvent && typeof this.sourceEvent.preventDefault === 'function') {
        this.sourceEvent.preventDefault();
      }
    };

    /**
     * Returns whether preventDefault was called on this event object.
     * 
     * @method 
     * 
     * @return {Boolean}
     */
    this.isDefaultPrevented = function () {
      return isDefaultPrevented;
    };

    /**
     * Stops event from propagating up the DOM tree.
     * 
     * @method 
     */
    this.stopPropagation = function (propagateSignalsOverride) {
      isPropagationStopped = true;
      if ((propagateSignalsOverride == null ? propagateSignals : propagateSignalsOverride) && 
          this.sourceEvent && typeof this.sourceEvent.stopPropagation === 'function') {
        this.sourceEvent.stopPropagation();
      }
    };

    /**
     * Returns whether stopPropagation was called on this event object.
     * 
     * @method
     *  
     * @return {Boolean}
     */
    this.isPropagationStopped = function () {
      return isPropagationStopped;
    };

    /**
     * Prevents the rest of the handlers from being executed.
     * 
     * @method 
     */
    this.stopImmediatePropagation = function (propagateSignalsOverride) {
      isImmediatePropagationStopped = true;
      if ((propagateSignalsOverride == null ? propagateSignals : propagateSignalsOverride) && 
          this.sourceEvent && typeof this.sourceEvent.stopImmediatePropagation === 'function') {
        this.sourceEvent.stopImmediatePropagation();
      }
    };

    /**
     * Returns whether stopImmediatePropagation was called on this event object.
     * 
     * @method 
     * 
     * @return {Boolean}
     */
    this.isImmediatePropagationStopped = function () {
      return isImmediatePropagationStopped;
    }

    /**
     * Returns TRUE when any of these methods of this event has been called:
     * - isImmediatePropagationStopped()
     * - isPropagationStopped()
     * - isDefaultPrevented()
     *
     * This method serves as a shorthand for
     * `e.isImmediatePropagationStopped() || e.isPropagationStopped() || e.isDefaultPrevented()`
     */
    this.isHandled = function () {
      return this.isImmediatePropagationStopped() || this.isPropagationStopped() || this.isDefaultPrevented();
    };

    if (sourceEvent) {
      this.sourceEvent = sourceEvent;
    }
  }

  /**
   * A simple publisher-subscriber implementation.
   * 
   * @class
   * @constructor
   */
  function Event() {
    var handlers = [];

    /**
     * Adds an event handler to be called when the event is fired.
     * 
     * Event handler will receive two arguments - an `EventData` and the `data`
     * object the event was fired with.
     * 
     * @method
     *  
     * @param fn {Function} Event handler.
     * @return {Function} the registered event handler `fn`.
     */
    this.subscribe = function (fn) {
      handlers.push(fn);
      return fn;
    };

    /**
     * Removes an event handler added with `subscribe(fn)`.
     * 
     * @method 
     * 
     * @param fn {Function} Event handler to be removed. When undefined, all event handlers are unsubscribed.
     */
    this.unsubscribe = function (fn) {
      if (!fn) {
        handlers = [];
      } else {
        for (var i = handlers.length - 1; i >= 0; i--) {
          if (handlers[i] === fn) {
            handlers.splice(i, 1);
          }
        }
      }
    };

    /**
     * Returns the list of registered event handlers as an array.
     * 
     * @method 
     * 
     * @return the list of registered event handlers as an array. When no handlers are registered the array is empty.
     */
    this.handlers = function () {
      return handlers;
    };

    /**
     * Fires an event notifying all subscribers.
     * 
     * @method 
     * 
     * @param args {Object} Additional data object to be passed to all handlers.
     * @param e {EventData}
     *      Optional.
     *      An `EventData` object to be passed to all handlers.
     *      For DOM events, an existing W3C/jQuery event object can be passed in.
     * @param scope {Object}
     *      Optional.
     *      The scope ("this") within which the handler will be executed.
     *      If not specified, the scope will be set to the `Event` instance.
     * @return {boolean} the return value produced by the event handlers; boolean TRUE by default.
     */
    this.notify = function (args, e, scope) {
      e = e || new EventData();
      scope = scope || this;

      var returnValue = true;
      for (var i = 0; i < handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()); i++) {
        returnValue = handlers[i].call(scope, e, args, returnValue);
      }

      return returnValue;
    };
  }

  /**
   * [EventHandler description]
   *
   * @class
   * @constructor
   */
  function EventHandler() {
    var handlers = [];

    this.subscribe = function (event, handler) {
      handlers.push({
        event: event,
        handler: handler
      });
      event.subscribe(handler);

      return this;  // allow chaining
    };

    this.unsubscribe = function (event, handler) {
      var i = handlers.length;
      while (i--) {
        if (handlers[i].event === event &&
            handlers[i].handler === handler) {
          handlers.splice(i, 1);
          event.unsubscribe(handler);
          return;
        }
      }

      return this;  // allow chaining
    };

    this.unsubscribeAll = function () {
      var i = handlers.length;
      while (i--) {
        handlers[i].event.unsubscribe(handlers[i].handler);
      }
      handlers = [];

      return this;  // allow chaining
    }
  }

  /**
   * A structure containing a range of cells.
   * 
   * @class
   * @constructor
   * 
   * @param fromRow {Integer} Starting row.
   * @param fromCell {Integer} Starting cell.
   * @param toRow {Integer} Optional. Ending row. Defaults to `fromRow`.
   * @param toCell {Integer} Optional. Ending cell. Defaults to `fromCell`.
   */
  function Range(fromRow, fromCell, toRow, toCell) {
    if (toRow === undefined && toCell === undefined) {
      toRow = fromRow;
      toCell = fromCell;
    }

    /**
     * @property fromRow
     * @type {Integer}
     */
    this.fromRow = Math.min(fromRow, toRow);

    /**
     * @property fromCell
     * @type {Integer}
     */
    this.fromCell = Math.min(fromCell, toCell);

    /**
     * @property toRow
     * @type {Integer}
     */
    this.toRow = Math.max(fromRow, toRow);

    /**
     * @property toCell
     * @type {Integer}
     */
    this.toCell = Math.max(fromCell, toCell);

    /**
     * Returns whether a range represents a single row.
     * 
     * @method 
     * 
     * @return {Boolean}
     */
    this.isSingleRow = function () {
      return this.fromRow == this.toRow;
    };

    /**
     * Returns whether a range represents a single cell.
     * 
     * @method 
     * 
     * @return {Boolean}
     */
    this.isSingleCell = function () {
      return this.fromRow == this.toRow && this.fromCell == this.toCell;
    };

    /**
     * Returns whether a range contains a given cell.
     * 
     * @method 
     * 
     * @param row {Integer}
     * @param cell {Integer}
     * @return {Boolean}
     */
    this.contains = function (row, cell) {
      return row >= this.fromRow && row <= this.toRow &&
          cell >= this.fromCell && cell <= this.toCell;
    };

    /**
     * Returns whether the range matches the given range.
     * 
     * @method 
     * 
     * @param range {Range}
     * @return {Boolean}
     */
    this.matches = function (range) {
      return range.fromRow === this.fromRow && range.toRow === this.toRow &&
          range.fromCell === this.fromCell && range.toCell === this.toCell;
    };
    
    /**
     * Returns a readable representation of a range.
     * 
     * @method 
     * 
     * @return {String}
     */
    this.toString = function () {
      if (this.isSingleCell()) {
        return "(" + this.fromRow + ":" + this.fromCell + ")";
      }
      else {
        return "(" + this.fromRow + ":" + this.fromCell + " - " + this.toRow + ":" + this.toCell + ")";
      }
    }
  }

  /**
   * Used to decorate a master data row with information about a group of nested child rows.
   * 
   * @class
   * @constructor
   * 
   * @param nestingKey {Object} Key uniquely identifying the group.
   */
  function MasterRow(nestingKey) {
    /**
     * Nesting level, starting with 0.
     * @property level
     * @type {Number}
     */
    this.level = 0;

    /**
     * Number of rows in the nesting.
     * @property count
     * @type {Integer}
     */
    this.count = 0;

    /**
     * Rows that are part of the nesting.
     * @property rows
     * @type {Array}
     */
    this.rows = [];

    /**
     * Whether a nesting is expanded.
     * @property expanded
     * @type {Boolean}
     */
    this.expanded = false;

    /**
     * A unique key used to identify the nesting group. This key
     * can be used in calls to NestedModel collapse() or expand().
     * @property nestingKey
     * @type {Object}
     */
    this.nestingKey = (null == nestingKey) ? null : nestingKey;
  }

  /**
   * Used to decorate related nested rows.
   * 
   * @class
   * @constructor
   * 
   * @param masterId {Object} Id of related master row.
   * @param idProperty {String} Defaults to "id".
   */
  function NestedRow(masterId, idProperty) {
    /*
     * Id of related master row.
     * @property id
     * @type {Object}
     */
    this[idProperty || "id"] = masterId;
  }

  /**
   * A dummy loading data row.
   * 
   * @class
   * @constructor
   * 
   * @param id {Object} Unique Id of the row.
   * @param idProperty {String} Defaults to "id".
   */
  function LoadingRow(id, idProperty) {
    this.__loading = true;
    this[idProperty || "id"] = id;
  }

  /**
   * A dummy missing data row.
   * 
   * @class 
   * @constructor
   * 
   * @param id {Object} Unique Id of the row.
   * @param idProperty {String} Defaults to "id".
   */
  function MissingRow(id, idProperty) {
    this.__missing = true;
    this[idProperty || "id"] = id;
  }

  /**
   * A base class that all special / non-data rows (like Group and GroupTotals) derive from.
   * 
   * @class 
   * @constructor
   */
  function NonDataItem() {
    this.__nonDataRow = true;
  }


  /**
   * Information about a group of rows.
   * 
   * @class 
   * @extends Slick.NonDataItem
   * @constructor
   */
  function Group() {
    this.__group = true;

    /**
     * Grouping level, starting with 0.
     * @property level
     * @type {Number}
     */
    this.level = 0;

    /**
     * Number of rows in the group.
     * @property count
     * @type {Integer}
     */
    this.count = 0;

    /**
     * Grouping value.
     * @property value
     * @type {Object}
     */
    this.value = null;

    /**
     * Formatted display value of the group.
     * @property title
     * @type {String}
     */
    this.title = null;

    /**
     * Whether a group is collapsed.
     * @property collapsed
     * @type {Boolean}
     */
    this.collapsed = false;

    /**
     * GroupTotals, if any.
     * @property totals
     * @type {GroupTotals}
     */
    this.totals = null;

    /**
     * Rows that are part of the group.
     * @property rows
     * @type {Array}
     */
    this.rows = [];

    /**
     * Sub-groups that are part of the group.
     * @property groups
     * @type {Array}
     */
    this.groups = null;

    /**
     * A unique key used to identify the group.  This key can be used in calls to DataView
     * collapseGroup() or expandGroup().
     * @property groupingKey
     * @type {Object}
     */
    this.groupingKey = null;
  }

  Group.prototype = new NonDataItem();

  /**
   * Compares two Group instances.
   * 
   * @method 
   * 
   * @return {Boolean}
   * @param group {Group} Group instance to compare to.
   */
  Group.prototype.equals = function (group) {
    return this.value === group.value &&
        this.count === group.count &&
        this.collapsed === group.collapsed &&
        this.title === group.title;
  };

  /**
   * Information about group totals.
   * 
   * An instance of GroupTotals will be created for each totals row and passed to the aggregators
   * so that they can store arbitrary data in it.  That data can later be accessed by group totals
   * formatters during the display.
   * 
   * @class 
   * @extends Slick.NonDataItem
   * @constructor
   */
  function GroupTotals() {
    this.__groupTotals = true;

    /**
     * Parent Group.
     * @param group
     * @type {Group}
     */
    this.group = null;

    /**
     * Whether the totals have been fully initialized / calculated.
     * Will be set to false for lazy-calculated group totals.
     * @param initialized
     * @type {Boolean}
     */
    this.initialized = false;
  }

  GroupTotals.prototype = new NonDataItem();

  /**
   * A locking helper to track the active edit controller and ensure that only a single controller
   * can be active at a time.  This prevents a whole class of state and validation synchronization
   * issues.  An edit controller (such as SlickGrid) can query if an active edit is in progress
   * and attempt a commit or cancel before proceeding.
   * 
   * @class 
   * @constructor
   */
  function EditorLock() {
    var activeEditController = null;

    /**
     * Returns true if a specified edit controller is active (has the edit lock).
     * If the parameter is not specified, returns true if any edit controller is active.
     * 
     * @method 
     * 
     * @param editController {EditController}
     * @return {Boolean}
     */
    this.isActive = function (editController) {
      assert(!editController || (assert(typeof editController.commitCurrentEdit === 'function') && assert(typeof editController.cancelCurrentEdit === 'function')));
      return (editController ? activeEditController === editController : activeEditController !== null);
    };

    /**
     * Sets the specified edit controller as the active edit controller (acquire edit lock).
     * If another edit controller is already active an exception will be thrown.
     * 
     * @method 
     * 
     * @param editController {EditController} edit controller acquiring the lock
     */
    this.activate = function (editController) {
      assert(editController && assert(typeof editController.commitCurrentEdit === 'function') && assert(typeof editController.cancelCurrentEdit === 'function'));
      if (editController === activeEditController) { // already activated?
        return;
      }
      if (activeEditController !== null) {
        throw new Error("SlickGrid.EditorLock.activate: an editController is still active, can't activate another editController");
      }
      if (!editController.commitCurrentEdit) {
        throw new Error("SlickGrid.EditorLock.activate: editController must implement .commitCurrentEdit()");
      }
      if (!editController.cancelCurrentEdit) {
        throw new Error("SlickGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()");
      }
      activeEditController = editController;
    };

    /**
     * Unsets the specified edit controller as the active edit controller (release edit lock).
     * If the specified edit controller is not the active one, an exception will be thrown.
     * 
     * @method 
     * 
     * @param editController {EditController} edit controller releasing the lock
     */
    this.deactivate = function (editController) {
      assert(editController && assert(typeof editController.commitCurrentEdit === 'function') && assert(typeof editController.cancelCurrentEdit === 'function'));
      if (activeEditController !== editController) {
        throw new Error("SlickGrid.EditorLock.deactivate: specified editController is not the currently active one");
      }
      activeEditController = null;
    };

    /**
     * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
     * controller and returns whether the commit attempt was successful (commit may fail due to validation
     * errors, etc.).  Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
     * and false otherwise.  If no edit controller is active, returns true.
     * 
     * @method 
     * 
     * @return {Boolean}
     */
    this.commitCurrentEdit = function commitCurrentEdit() {
      return (activeEditController ? activeEditController.commitCurrentEdit() : true);
    };

    /**
     * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
     * controller and returns whether the edit was successfully canceled.  If no edit controller is
     * active, returns true.
     * 
     * @method 
     * 
     * @return {Boolean}
     */
    this.cancelCurrentEdit = function cancelCurrentEdit() {
      return (activeEditController ? activeEditController.cancelCurrentEdit() : true);
    };
  }




  /**
   * Provide a generic performance timer, which strives to produce highest possible accuracy time measurements.
   * 
   * methods:
   * 
   * - `start()` (re)starts the timer and 'marks' the current time for ID="start". 
   *   `.start()` also CLEARS ALL .mark_delta() timers!
   *
   * - `mark(ID)` calculates the elapsed time for the current timer in MILLISECONDS (floating point) 
   *   since `.start()`. `.mark_delta()` then updates the 'start/mark time' for the given ID.
   *
   *   ID *may* be NULL, in which case `.mark()` will not update any 'start/mark time'.
   *    
   * - `mark_delta(ID, START_ID)` calculates the elapsed time for the current timer in MILLISECONDS (floating point) since 
   *   the last call to `.mark_delta()` or `.mark()` with the same ID. `.mark_delta()` then updates the 
   *   'start/mark time' for the given ID.
   *
   *   When the optional START_ID is specified, the delta is calculated against the last marked time 
   *   for that START_ID.
   *
   *   When the ID is NULL or not specified, then the default ID of "start" will be assumed.
   *   
   *   This results in consecutive calls to `.mark_delta()` with the same ID to produce 
   *   each of the time intervals between the calls, while consecutive calls to
   *   `.mark()` with he same ID would produce an increase each time instead as the time 
   *   between the `.mark()` call and the original `.start()` increases.
   * 
   * Notes:
   * 
   * - when you invoke `.mark()` or `.mark_delta()` without having called .start() before, 
   *   then the timer is started at the mark.
   * 
   * - `.start()` will erase all stored 'start/mark times' which may have been
   *   set by `.mark()` or `.mark_delta()` before -- you may call `.start()` multiple times for
   *   the same timer instance, after all.
   * 
   * - you are responsible to manage the IDs for `.mark()` and `.mark_delta()`. The ID MUST NOT be "start" 
   *   as ID = "start" identifies the .start() timer.
   * 
   * References for the internal implementation:
   * 
   *    - http://updates.html5rocks.com/2012/08/When-milliseconds-are-not-enough-performance-now
   *    - http://ejohn.org/blog/accuracy-of-javascript-time/
   *
   * @class 
   * @constructor
   */
  function PerformanceTimer() {
    /* @private */ var start_time = false;
    var obj = {
    };
    // feature detect:
    /* @private */ var f, tv;
    /* @private */ var p = (typeof window !== 'undefined' && window.performance);
    if (p && p.timing.navigationStart && p.now) {
      f = function () {
        return p.now();
      };
    } else if (p && typeof p.webkitNow === 'function') {
      f = function () {
        return p.webkitNow();
      };
    } else {
      p = (typeof process !== 'undefined' && process.hrtime);
      if (typeof p === 'function') {
        tv = p();
        if (tv && tv.length === 2) {
          f = function () {
            var rv = p();
            return rv[0] * 1e3 + rv[1] * 1e-6;
          };
        } 
      } 
      if (!f) {
        f = function () {
          return Date.now();
        };
        try {
          f();
        } catch (ex) {
          f = function () {
            return +new Date();
          };
        }
      }
    }

    obj.start = function () {
      start_time = {
        start: f()
      };
      return obj;
    };
    
    obj.mark = function (id, start_id) {
      if (start_time === false) this.start();
      var end_time = f();
      var begin_time = start_time[start_id || id || "start"];
      if (!begin_time) {
        begin_time = end_time;
      }
      var rv = end_time - begin_time;
      if (id) {
        start_time[id] = end_time;
      }
      return rv;
    };
    
    obj.mark_delta = function (id) {
      if (start_time === false) this.start();
      id = id || "start";
      var end_time = f();
      var begin_time = start_time[id];
      if (!begin_time) {
        begin_time = end_time;
      }
      var rv = end_time - begin_time;
      start_time[id] = end_time;
      return rv;
    };
    
    obj.reset_mark = function (id) {
      id = id || "start";
      start_time[id] = null;
      return obj;
    };

    obj.get_mark = function (id) {
      id = id || "start";
      return start_time[id];
    };

    obj.mark_sample_and_hold = function (id) {
      if (start_time === false) this.start();
      id = id || "start";
      // sample ...
      var end_time = f();
      var begin_time = start_time[id];
      if (!begin_time) {
        begin_time = end_time;
        // ... and hold
        start_time[id] = begin_time;
      }
      var rv = end_time - begin_time;
      return rv;
    };

    return obj;
  }

  /**
   * Detect which features regarding run-time JavaScript code generation / compilation
   * are available in the current environment.
   *
   * Can we compile a function from a string of source code, and if so, how? 
   *
   * + this class provides a wrapper to encapsulate the warnings and misgivings about this
   *   sort of thing in various browsers.
   *
   * + report whether we can name such generated functions and provide a means to do
   *   so through our compiler wrapper.
   *
   * @constructor
   */
  function CompileJavaScript() {
    var hasFunctionDisplayName = false;
    var hasFunctionName = false;
    var hasFunctionCompilation = false;
    var hasFunctionDecompilation = false;
    // When the current browser is not capable of naming compiled functions, e.g. latest Chrome on OSX,
    // then we have ourselves a look if we can get around that by indirect compilation: that's what's
    // signaled by this flag `hasAltFunctionName`.
    // When it is signaled, the `compiler` below will be generated in a slightly different way:
    // we then use the *alternative* compiler function instance so that we always have the fastest
    // possible available compiler for our current environment.
    var hasAltFunctionName = false;

    // detect browser abilities re function compilation
    try {
      var __fn = new Function("_args", "{return _args;}");                                  // jshint ignore:line
      var filterInfo = getFunctionInfo(__fn);
      if (!filterInfo.params || filterInfo.params.length !== 1 || filterInfo.params[0] !== "_args") {
        throw "_args";
      } 
      if (!filterInfo.body || filterInfo.body !== "{return _args;}") {
        throw "body";
      } 
      hasFunctionDecompilation = false;

      // Test function *naming* support; see also https://github.com/mleibman/SlickGrid/issues/1032
      try {
        __fn.displayName = "sg_foobar___";
        if (__fn(1) === 1 && __fn.displayName === "sg_foobar___") {
          hasFunctionDisplayName = true;
        }
      } catch (ex) {
        console.warn("function compilation browser capability detection @ displayName: ", ex); 
      }

      try {
        __fn.name = "sg_foobar___";
        if (__fn(1) === 1 && __fn.name === "sg_foobar___") {
          hasFunctionName = true;
        }
      } catch (ex) { 
        console.warn("function compilation browser capability detection @ function name: ", ex);

        // Check if we support the alternative way of naming a function: 
        try {
          __fn = new Function("return function sg_foobar___(_args) {return _args;};");
          __fn = __fn();
 
          if (__fn(1) === 1 && __fn.name === "sg_foobar___") {
            hasFunctionName = true;
            hasAltFunctionName = true;
          }
        } catch (ex) { 
          console.warn("function compilation browser capability detection @ ALT function name: ", ex);
        }
      }

      // test compilation last: we only enable that one when we passed the other tests:
      try {
        if (__fn(1) === 1) {
          hasFunctionCompilation = true;
        }
      } catch (ex) { 
      }
    } catch (ex) {
      // something weird crashed in there: kill all the features! 
      hasFunctionDisplayName = false;
      hasFunctionName = false;
      hasFunctionCompilation = false;
      hasAltFunctionName = false;
    }

    /**
     * Decompile a given function into source code
     *
     * @param  {Function} fn The function to decompile
     *
     * @return {Object/Hash} The decompiled parts:
     *
     *                       - `params`: array of function parameters
     *                       - `body`: the function body (source code)
     *                       - `name`: the function name; empty string when this is an anonymous function
     */
    function getFunctionInfo(fn) {
      var fnRegex = /^function\s*([^(]*)\(([^)]*)\)\s*{([\s\S]*)}$/;
      var matches = fn.toString().match(fnRegex);
      // WARNING/NOTE: it turns out that at least Chrome puts some surplus at the end of the 
      // function parameter list when the function has been previously created using the
      // `new Function(...)` operation.
      // 
      // For completeness sake we cover that here too.
      var args = matches[2].replace(/\/\*\*\//g, ' ').trim();
      var fname = matches[1].trim();
      if (fname === "anonymous") {
        fname = "";
      }
      fname = fn.name || fname;
      return {
        params: args.split(","),
        body: matches[3].trim(),
        name: fname 
      };
    }

    /**
     * @api
     * 
     * Compile the given function source code to an executable JavaScript function.
     *
     * @param  {String} functionName       Optional function name. May be `null`.
     * @param  {String/Array} functionParameters 
     *                                     Optional function parameters. May be `null`. 
     *                                     
     *                                     Parameters can be specified
     *                                     as an array of parameter names or pre-combined (comma-separated)
     *                                     into a single string, e.g. "arg1, arg2".
     * @param  {String/Array} functionBody The function *body* source code. May of course be 
     *                                     *empty*, which is assumed when the parameter is 
     *                                     falsey (e.g. `null` or `undefined`) instead of a direct empty string.
     *                                     
     *                                     Body source code can be specified
     *                                     as an array of lines or pre-combined (comma-separated)
     *                                     into a single string, e.g. "var rv = arg1 + arg2; return rv;".
     *                                     Note that when the body is an array of strings, these are
     *                                     combined using only NEWLINE characters; no 'smart stuff' is
     *                                     applied re implicit semicolon fixups nor do we apply any
     *                                     kind of code analysis or uglification/minification.
     *
     * @return {Function}                  The compiled JavaScript function.
     *
     *                                     We will return `null` when the current environment
     *                                     does not support function compilation. 
     *
     * **WARNING**: 
     * 
     * When we cannot compile the given function for whatever *other* reason
     * (than simply that we found that the current environment does not support function
     * compilation at all), **an exception will be thrown**.
     *  
     * The caller is responsible for quality assurance of the inputs and handling this 
     * potential situation.
     */
    var compiler;
    switch (hasAltFunctionName) {
    case false:
      compiler = function compile_javascript(functionName, functionParameters, functionBody) {
        if (Array.isArray(functionParameters)) {
          functionParameters = functionParameters.join(",");
        }
        if (Array.isArray(functionBody)) {
          functionBody = functionBody.join("\n");
        }

        var fn;

        if (hasFunctionCompilation) {
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
          fn = new Function(functionParameters || "", functionBody || "");                    // jshint ignore:line
        } else {
          return null;
        }
        // The next bits are only enabled on browsers which can handle them; see also issue #mleibman/1032 (https://github.com/mleibman/SlickGrid/issues/1032)
        if (functionName) {
          if (hasFunctionDisplayName) { fn.displayName = functionName; }
          if (hasFunctionName) { fn.name = functionName; }
        }
        return fn;
      };
      break;

    default: // case true:
      compiler = function compile_javascript_alternative(functionName, functionParameters, functionBody) {
        if (Array.isArray(functionParameters)) {
          functionParameters = functionParameters.join(",");
        }
        if (Array.isArray(functionBody)) {
          functionBody = functionBody.join("\n");
        }

        var fn;

        if (hasFunctionCompilation) {
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
          fn = new Function("return function " + (functionName || "").replace(/[^a-zA-Z0-9]/g, "_") + "(" + (functionParameters || "") + ") {\n" + (functionBody || "") + "};");                    // jshint ignore:line
          fn = fn();
        } else {
          return null;
        }
        // The next bits are only enabled on browsers which can handle them; see also issue #mleibman/1032 (https://github.com/mleibman/SlickGrid/issues/1032)
        if (functionName) {
          if (hasFunctionDisplayName) { fn.displayName = functionName; }
        }
        return fn;
      };
      break;
    }
    
    /**
     * @api
     *
     * @return {Boolean} `true` when the current environment supports run-time function compilation
     *                   from source.
     */
    compiler.canCompile = function can_we_compilejavascript() {
      return hasFunctionCompilation;
    };

    /**
     * @api
     *
     * @return {Boolean} `true` when the current environment supports run-time function **de**compilation
     *                   *to* source.
     */
    compiler.canDecompile = function can_we_decompilejavascript() {
      return hasFunctionDecompilation;
    };

    /**
     * @api
     *
     * @return {Boolean} `true` when the current environment naming run-time compiled functions.
     *
     * Note that the *way* functions can named differs per browser environment; this is covered
     * by using this compiler class to both compile *and optionally name* the run-time
     * generated function source code.  
     */
    compiler.canNameCompiledFunction = function can_we_namejavascriptfunction() {
      return hasFunctionCompilation && (hasFunctionName || hasFunctionDisplayName);
    };

    /**
     * @api
     * 
     * Decompile a given function into source code.
     *
     * @param  {Function} fn The function to decompile
     *
     * @return {Object/Hash} The decompiled parts:
     *
     *                       - `params`: array of function parameters
     *                       - `body`: the function body (source code)
     */
    compiler.decompile = getFunctionInfo;

    return compiler;
  }


  /// This is inspired by
  /// http://stackoverflow.com/questions/7753448/how-do-i-escape-quotes-in-html-attribute-values
  function HtmlEntities(options) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": "&#39;", // "&apos;"
        "/": "&#x2F;",
        "\n": "&#13;",  // LF
        "\r": "&#13;"   // treat classic Apple CR-only as LF
        /*
        You may add other replacements here for HTML only
        (but it's not necessary).
        Or for XML, only if the named entities are defined in its DTD.
        */
    };
    options = options || {};
    if (!options.suitableForUriPrinting) {
        delete entityMap["/"];
    }
    if (!options.encodeCRLF) {
        delete entityMap["\n"];
        delete entityMap["\r"];
    }
    var crlf_re = /\r\n/g;
    var map_re = new RegExp("[" + entityMap.keys().join("") + "]", "g");

    this.encode = function (s) {
      if (s == null) {
        return "";
      } else {
        return ("" + s) /* Forces the conversion to string. */
            .replace(crlf_re, "\n") // convert CRLF to LF-only before we do anything else 
            .replace(map_re, function (s) {
                return entityMap[s];
            });
      }
    };
  }

  /**
   * similar to jQuery .offset() but provides more info and guaranteed to match its numbers with getGridPosition() and  getActiveCellPosition()      
   * 
   * @param elem may be a DOM Element or a jQuery selector object.
   */
  function BoxInfo(elem) {
    if (!elem) {
      // produce a box which is positioned way outside the visible area.
      // Note: use values > 1e15 to abuse the floating point artifact
      // where adding small values to such numbers is neglected due
      // to mantissa limitations (e.g. 1e30 + 1 === 1e30)
      return {
        top: 1e38,
        left: 1e38,
        bottom: 1e38,
        right: 1e38,
        width: 0,
        height: 0,
        visible: false // <-- that's the important bit!
      };
    }
    var $elem = $(elem);
    elem = $elem[0];

    // See also Sizzle:
    // 
    // jQuery.expr.filters.hidden = function( elem ) {
    //   // Use OR instead of AND as the element is not visible if either is true
    //   // See tickets #10406 and #13132
    //   return !elem.offsetWidth || !elem.offsetHeight;
    // };

    var box = {
      top: elem.offsetTop,
      left: elem.offsetLeft,
      bottom: 0,
      right: 0,
      width: $elem.outerWidth(),
      height: $elem.outerHeight(),
      visible: elem.offsetWidth > 0 && elem.offsetHeight > 0
    };
    box.bottom = box.top + box.height;
    box.right = box.left + box.width;

    // walk up the tree
    var offsetParent = elem;
    // first quickly check visibility:
    while (offsetParent && offsetParent !== document.body) {
      offsetParent = offsetParent.offsetParent;
    }
    if (!offsetParent) {
      // when we end up at elem===null, then the elem has been detached
      // from the DOM and all our size calculations are useless:
      // produce a box which is positioned at (0,0) and has a size of (0,0).
      // return {
      //   top: 0,
      //   left: 0,
      //   bottom: 0,
      //   right: 0,
      //   width: 0,
      //   height: 0,
      //   visible: false // <-- that's the important bit!
      // };
      box.visible = false; // <-- that's the important bit!
      return box;
    }
    // now walk up the tree to calculate the position/clipped-by-viewport visibility:
    offsetParent = elem.offsetParent;
    elem = elem.parentNode;
    while (elem && elem.nodeType === 1 /* ELEMENT_TYPE */) {
      assert(elem.nodeType !== 9 /* DOCUMENT_TYPE */);
      if (box.visible && (!elem.offsetWidth || !elem.offsetHeight)) {
        box.visible = false;
        break;
      }

      if (box.visible && elem.scrollHeight !== elem.offsetHeight && $(elem).css("overflowY") !== "visible") {
        box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight;
      }

      if (box.visible && elem.scrollWidth !== elem.offsetWidth && $(elem).css("overflowX") !== "visible") {
        box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth;
      }

      box.left -= elem.scrollLeft;
      box.top -= elem.scrollTop;

      if (elem === offsetParent) {
        box.left += elem.offsetLeft;
        box.top += elem.offsetTop;
        offsetParent = elem.offsetParent;
      }

      box.bottom = box.top + box.height;
      box.right = box.left + box.width;

      elem = elem.parentNode;
    }

    return box;
  }



  /**
   * Define a keyboard as a set of names for keypress codes, etc. for better code readability.
   *
   * @const Keyboard
   * @readonly
   * @enum {Number}
   * @{
   */
  function Keyboard() {
    // For now, base the keyboard code set off of jQueryUI, if it is present
    var keycodes = $.extend({}, $.ui && $.ui.keyCode, {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38,

      SHIFT: 16,
      ALT: 18,    // Windows/Unix
      OPTION: 18, // OSX
      CONTROL: 17,
      COMMAND: 91,

      F2: 113,
    });

    return keycodes;
  }

  /** @} */


  // register namespace
  $.extend(true, window, {
    Slick: /* @nocollapse */ {
      Event: Event,
      EventData: EventData,
      EventHandler: EventHandler,
      Keyboard: Keyboard(),                      /* only need a single instance of this one */   // jshint ignore:line
      PerformanceTimer: PerformanceTimer,
      CompileJavaScript: CompileJavaScript(),    /* only need a single instance of this one */   // jshint ignore:line
      HtmlEntities: HtmlEntities,
      BoxInfo: BoxInfo,
      Range: Range,
      NonDataRow: NonDataItem,
      Group: Group,
      GroupTotals: GroupTotals,
      MasterRow: MasterRow,
      NestedRow: NestedRow,
      LoadingRow: LoadingRow,
      MissingRow: MissingRow,
      EditorLock: EditorLock,

      /**
       * A global singleton editor lock.
       * 
       * @class GlobalEditorLock
       * @static
       * @constructor
       */
      GlobalEditorLock: new EditorLock()
    }
  });

})(jQuery);

/** @} */


