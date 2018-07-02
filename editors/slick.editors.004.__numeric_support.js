//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  function applyModifier(val, mod) {
    var m = isValidModifier(mod);
    if (!m)
      return mod;
    var dv = parseFloat(val);
    switch (m.operator) {
    case "+":
      return m.isPercent ? dv * (1 + m.value) : dv + m.value;

    case "-":
      return m.isPercent ? dv * (1 - m.value) : dv - m.value;

    case "*":
      return dv * m.value;

    case "/":
      return dv / m.value;
    }
    assert(0); // should never get here
  }

  function isValidModifier(v) {
    var sv = v.toString().trim();
    var ope = sv.charAt(0);
    if ("+-*/".indexOf(ope) < 0) return false;  // no good if it does not start with an operation
    sv = sv.substr(1);    //remove first char
    if (sv.indexOf('+') >= 0 || sv.indexOf('-') >= 0 || sv.indexOf('*') >= 0 || sv.indexOf('/') >= 0) return false;  // no more signs please.
    var pct = false;
    if (sv.charAt(sv.length - 1) === '%') {
      pct = true;
      sv = sv.slice(0, -1);    // remove also the % char if it is there
    }
    // what remains must be a number
    if (isNaN(sv)) return false;
    return {
      operator: ope,
      isPercent: pct,
      value: parseFloat(sv) / (pct ? 1 : 100)         // when it is a percentage, produce the equivalent perunage
    };
  }

