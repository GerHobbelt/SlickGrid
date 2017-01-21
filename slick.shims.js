/*!
 * @license
 * slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
 * Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
 *
 * Distributed under MIT license.
 * All rights reserved.
 */




/***
 * Contains HTML5/ES5 shims for legacy boxes.
 * @module Shims
 * @namespace Slick
 */

(function ($) {
  "use strict";


// the following three function originate from mozilla's mdn
if (!Array.prototype.map) {
  Array.prototype.map = function (callback, thisArg) {
    var T, A, k;
    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if ({}.toString.call(callback) !== "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }
    if (thisArg) {
      T = thisArg;
    }
    A = new Array(len);
    k = 0;
    while (k < len) {
      var kValue, mappedValue;
      if (k in O) {
        kValue = O[k];
        A[k] = mappedValue;
      }
      k++;
    }
    return A;
  };
}

if (!Array.prototype.reduce) {
  Array.prototype.reduce = function reduce(accumulator) {
    if (this === null || this === undefined) throw new TypeError("Object is null or undefined");
    var i = 0, l = this.length >> 0, curr;

    if (typeof accumulator !== "function") {
      // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
      throw new TypeError("First argument is not callable");
    }

    if (arguments.length < 2) {
      if (l === 0) throw new TypeError("Array length is 0 and no second argument");
      curr = this[0];
      i = 1; // start accumulating at the second element
    } else {
      curr = arguments[1];
    }

    while (i < l) {
      if (i in this) {
        curr = accumulator.call(undefined, curr, this[i], i, this);
      }
      ++i;
    }

    return curr;
  };
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function (fun /*, thisp */)  {
    if (this == null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") {
      throw new TypeError();
    }

    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}


})(jQuery);


