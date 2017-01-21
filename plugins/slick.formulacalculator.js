/*!
 * @license
 * slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
 * Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
 *
 * Distributed under MIT license.
 * All rights reserved.
 */




(function($) {
  "use strict";

  $.extend(true, window, {
    Slick: {
      Editors: {
        Formula: FormulaEditor
      },
      FormulaCalculator: FormulaCalculator
    }
  });

  function refKey(ref) {
    return ref.row + ',' + ref.col;
  }

  function parseInt10(str) {
    return parseInt(str, 10);
  }

  function FormulaManager() {
    this.h = {};
  }

  FormulaManager.prototype = {
    set: function (ref, str) {
      this.h[refKey(ref)] = str;
    },
    get: function (ref) {
      return this.h[refKey(ref)];
    }
  };

  function RefManager() {
    this.uh = {};
    this.dh = {};
  }

  RefManager.prototype = {
    clear: function (ref) {
      var k = refKey(ref);
      for (var r in this.getDependentRefs(ref)) {
        delete this.uh[r];
      }
      this.dh[k] = {};
    },
    //val depends on key
    set: function (k, v) {
      k = refKey(k);
      v = refKey(v);
      this.uh[k] = this.uh[k] || {};
      this.dh[v] = this.dh[v] || {};
      if (!this.uh[k][v]) {
        this.uh[k][v] = 1;
      }
      if (!this.dh[v][k]) {
        this.dh[v][k] = 1;
      }
    },
    checkCircle: function (ref, dependentRef) {
      return this.checkCircleHelper(refKey(ref), refKey(dependentRef));
    },
    checkCircleHelper: function (k, dk) {
      var children;
      if (k == dk) {
        return true;
      }
      children = this.dh[dk] || [];
      if (children[k]) {
        return true;
      } else {
        for (var r in children[k]) {
          if (this.checkCircleHelper(k, r)) {
            return true;
          }
        }
      }
      return false;
    },
    getUpdateRefs: function (ref) {
      return this.getHashRefs(this.uh, ref);
    },
    getDependentRefs: function (ref) {
      return this.getHashRefs(this.dh, ref);
    },
    getHashRefs: function (hash, ref) {
      var k = refKey(ref), acc = [];
      hash[k] = hash[k] || {};
      for (var i in hash[k]) {
        acc.push(this.getRefFromString(i));
      }
      return acc;
    },
    getRefFromString: function (str) {
      var coords = str.split(',').map(parseInt10);
      return {
        row: coords[0], 
        col: coords[1]
      };
    },
    refValue: function (ref, grid) {
      return grid.getDataItem(ref.row)[ref.col];
    },
    getRowAndCol: function (cell) {
      return {
        row: parseInt(cell.split(/\D/)[1]),
        col: this.getColIndex(cell.split(/\d/)[0])
      };
    },
    getColIndex: function (col) {
      var c = 0, left = 'a'.charCodeAt(0);
      for (var i = 0; i < col.length; i += 1) {
        c += col.charCodeAt(i) - left;
      }
      return c;
    },
    refDependentRefs: function (ref) {
      ref = ref.toLowerCase().replace('$', '');
      var splitted = ref.split(':');
      var refs, r, c;
      var from = splitted[0], to = splitted[1];
      from = this.getRowAndCol(from);
      if (to) {
        to = this.getRowAndCol(to);
        refs = [];
        if (from.col == to.col) {
          for (r = 0; r <= to.row - from.row; r += 1) {
            refs.push({
              row: from.row + r, 
              col: from.col
            });
          }
        } else {
          for (c = from.col; c <= to.col; c += 1) {
            refs.push({
              row: from.row, 
              col: c
            });
          }
          if (from.row !== to.row) {
            for (r = from.row + 1; r < to.row; r += 1) {
              for (c = 0; c <= to.col; c += 1) {
                refs.push({
                  row: r, 
                  col: c
                });
              }
            }
            for (c = 0; c <= to.col; c += 1) {
              refs.push({
                row: to.row, 
                col: c
              });
            }
          }
        }
        return refs;
      } else {
        return [from];
      }
    },
    evaluateRef: function (ref, grid) {
      ref = ref.toLowerCase().replace('$', '');
      var self = this;
      var values = this.refDependentRefs(ref).map(function(r) {
        return self.refValue(r, grid);
      }).filter(function (r) {
        return typeof r !== "undefined";
      });
      return values.length === 1 ? values[0] : values;
    }
  };

  function traverseTree(node, fn) {
    fn(node);
    if (node.left) {
      traverseTree(node.left, fn);
    }
    if (node.right) {
      traverseTree(node.right, fn);
    }
  }

  var formulaCalculators = {};

  function getFormulaCalculator(grid) {
    var key = grid.getOptions().containerId;
    formulaCalculators[key] = formulaCalculators[key] || new FormulaCalculator(grid);
    return formulaCalculators[key];
  }

  function FormulaCalculator(grid) {
    this.grid = grid;
    this.refManager = new RefManager(grid);
    this.formulaManager = new FormulaManager(grid);
  }

  FormulaCalculator.prototype = {
    updateRefs: function (ref) {
      var refs;
      refs = this.refManager.getUpdateRefs(ref);
      for (var i = 0; i < refs.length; i++) {
        this.evalRefAndDependentRefs(ref);
      }
    },
    evalRefAndDependentRefs: function (ref) {
      var row = ref.row, col = ref.col, item = this.grid.getDataItem(row);
      item[col] = evaluate(this.formulaManager.get(ref), this);
      this.updateRefs(ref);
    },
    evaluateRef: function (ref) {
      return this.refManager.evaluateRef(ref, this.grid);
    },
    evaluateCell: function (ref, value) {
      var refs, tree, result, old = this.formulaManager.get(ref), scope = this;
      if (old) {
        this.refManager.clear(old);
      }
      this.formulaManager.set(ref, value);
      tree = parse(value);
      traverseTree(tree, function (node) {
        if (node.type === 'ref') {
          refs = scope.refManager.refDependentRefs(node.value);
          for (var i = 0; i < refs.length; i += 1) {
            if (!scope.refManager.checkCircle(ref, refs[i])) {
              scope.refManager.set(refs[i], ref);
            } else {
              result = 'circular reference';
              break;
            }
          }
        }
      });
      if (!result) {
        result = evaluate(value, this);
      }
      return result;
    }
  };

  function lex(str) {
    var pos = 0, length = str.length, tokens = [];
    return (function () {
      var type, name, startPos;
      while (!ended()) {
        ignoreSpaces();
        startPos = pos;
        if (isLetter(current()) || current() == '_') {
          type = 'name';
          value = parseName();
        } else if (isDigit(current())) {
          type = 'number';
          value = parseNumber();
        } else if (isOp(current())) {
          type = 'operator';
          value = current();
          step();
        } else if (current() == '(') {
          type = 'lparen';
          value = '(';
          step();
        } else if (current() == ')') {
          type = 'rparen';
          value = ')';
          step();
        } else if (current() == ':') {
          type = 'colon';
          value = ':';
          step();
        } else if (current() == ',') {
          type = 'comma';
          value = ',';
          step();
        } else if (current() == '$') {
          type = 'dollar';
          value = '$';
          step();
        } else {
          type = 'generic';
          value = current();
          step();
        }
        tokens.push({
          type: type, 
          value: value, 
          pos: startPos
        });
        ignoreSpaces();
      }
      tokens.push({
        type: 'eof', 
        value: 'eof', 
        pos: length
      });
      return tokens;
    })();

    function current() {
      return str.charAt(pos);
    }

    function step() {
      pos += 1;
    }

    function ended() {
      return pos >= length;
    }

    function isOp(ch) {
      return '+-*/^'.indexOf(ch) > -1;
    }

    function isLetter(ch) {
      return (ch >= 'A' && ch <= 'Z') ||
        (ch >= 'a' && ch <= 'z');
    }

    function isDigit(ch) {
      return ch >= '0' && ch <= '9';
    }

    function isAlpha(ch) {
      return isLetter(ch) || isDigit(ch) || ch == '_';
    }

    function isWhiteSpace(ch) {
      return (ch === 'u0009') || (ch === ' ') ||
        (ch === 'u00A0');
    }

    function ignoreSpaces() {
      while (!ended() && isWhiteSpace(current())) {
        step();
      }
    }

    function parseDigitSequence() {
      var acc = '';
      while (!ended() && isDigit(current())) {
        acc += current();
        step();
      }
      return acc;
    }

    function parseNumber() {
      var acc = parseDigitSequence();
      if (current() == '.') {
        step();
        acc += '.' + parseDigitSequence();
      }
      return acc;
    }

    function parseName() {
      var acc = '';
      while (!ended() && isAlpha(current())) {
        acc += current();
        step();
      }
      return acc;
    }
  }

  function parse(str) {
    var tokens = lex(str), pos = -1;
    var next = tokens[0];
    return expr();


    function syntaxError(msg) {
      return {
        name: 'syntax error', 
        message: msg
      };
    }

    function peek(n) {
      n = n || 0;
      return tokens[pos + n];
    }

    function consume() {
      pos += 1;
      next = tokens[pos + 1];
    }

    function expect(value) {
      if (next.value !== value) {
        throw syntaxError('expected ' + next.value);
      }
      consume();
    }

    function expr() {
      var t = term();
      while (next.value === '+' || next.value === '-') {
        op = next.value;
        consume();
        t = {
          type: 'binary', 
          op: op, 
          left: t, 
          right: term()
        };
      }
      return t;
    }

    function term() {
      var t = factor();
      while (next.value === '*' || next.value === '/') {
        op = next.value;
        consume();
        t = {
          type: 'binary', 
          op: op, 
          left: t, 
          right: factor()
        };
      }
      return t;
    }

    function factor() {
      var t = primary();
      if (next.value === '^') {
        consume();
        return {
          type: 'binary', 
          op: '^', 
          left: t, 
          right: factor()
        };
      } else {
        return t;
      }
    }

    function primary() {
      var t;
      if (next.type === 'number') {
        t = {
          type: 'numeric', 
          value: next.value
        };
        consume();
        return t;
      } else if (next.type === 'dollar' || next.type === 'name') {
        return name();
      } else if (next.type === 'lparen') {
        consume();
        t = expr();
        expect(')');
        return t;
      } else if (next.value === '-') {
        consume();
        return {
          type: 'unary', 
          op: '-', 
          right: factor()
        };
      } else {
        throw syntaxError('invalid syntax near ' + next.value);
      }
    }

    function name() {
      if (next.value.charAt(0) === '_') {
        var t = {
          type: 'variable', 
          value: next.value
        };
        consume();
        return t;
      } else if (peek(2).type === 'lparen') {
        return func();
      } else if (next.type === 'dollar' || next.type === 'name') {
        var value = cellRef();
        if (next.type === 'colon') {
          consume();
          value += ':' + cellRef();
        }
        return {
          type: 'ref', 
          value: value
        };
      } else {
        throw syntaxError('invalid syntax near ' + next.value);
      }
    }

    function func() {
      var t = {
        type: 'func', 
        value: next.value, 
        args: []
      };
      consume();
      expect('(');
      if (next.type === 'rparen') {
        consume();
        return t;
      } else {
        t.args.push(expr());
        while (next.type === 'comma') {
          consume();
          t.args.push(expr());
        }
        expect(')');
        return t;
      }
    }

    function cellRef() {
      var value = '';
      if (next.type === 'dollar') {
        value += '$';
        consume();
      }
      value += next.value;
      consume();
      if (next.type === 'dollar') {
        value += '$';
        consume();
        value += next.value;
      }
      return value;
    }
  }

  var _ops = {
    '+' : function (a, b) {
      return parseFloat(a) + parseFloat(b);
    },
    '-' : function (a, b) {
      return a - b;
    },
    'unary-': function (a) {
      return -a;
    },
    '*' : function (a, b) {
      return a * b;
    },
    '/' : function (a, b) {
      return a / b;
    },
    '^' : Math.pow
  };

  var _vars = {
    _pi: 3.14159265,
    _e: 2.71828183,
    _phi: 1.61803399
  };

  var _funcs = {
    abs : Math.abs,
    ceiling: Math.ceil,
    floor: Math.floor,
    mod: function (a, b) {
      return a - (b * Math.floor(a / b));
    },
    round: function (n, d) {
      d = d || 0;
      return Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
    },
    trunc: function (n, d) {
      d = d || 0;
      return Math.floor(n * Math.pow(10, d)) / Math.pow(10, d);
    },
    sqrt: Math.sqrt,
    max: function () {
      return Math.max.apply(null, getArrayParams(arguments));
    },
    min: function () {
      return Math.min.apply(null, getArrayParams(arguments));
    },
    sum: function () {
      return getArrayParams(arguments)
             .map(parseFloat)
             .reduce(function (a, b) {
               return a + b;
             });
    },
    product: function () {
      return getArrayParams(arguments)
             .reduce(function (a, b) {
               return a * b;
             });
    },
    average: function () {
      var args = getArrayParams(arguments);
      return _funcs.sum(args) / args.length;
    }
  };

  function getArgs(args) {
    return Array.prototype.slice.call(args);
  }

  function getArrayParams(args) {
    return args.length === 1 && $.isArray(args[0]) ?
      args[0] :
      getArgs(args);
  }

  function getVar(name) {
    name = name.toLowerCase();
    if (_vars[name]) {
      return _vars[name];
    } else {
      throw evaluationError('undefined variable ' + name);
    }
  }

  function getFunc(name) {
    name = name.toLowerCase();
    if (_funcs[name]) {
      return _funcs[name];
    } else {
      throw evaluationError('call to undefined function ' + name);
    }
  }

  function evaluationError(msg) {
    return {
      name: 'evaluation error', 
      message: msg
    };
  }

  function evaluate(param, formulaCalculator) {
    try {
      if (typeof param === 'string') {
        return ev(parse(param));
      }
      return ev(param);
    } catch (e) {
      return e.message;
    }

    function ev(expr) {
      if (expr.type === 'binary') {
        return _ops[expr.op](ev(expr.left), ev(expr.right));
      } else if (expr.type === 'unary') {
        return _ops['unary' + expr.op](ev(expr.right));
      } else if (expr.type === 'numeric') {
        return parseFloat(expr.value);
      } else if (expr.type === 'variable') {
        return getVar(expr.value);
      } else if (expr.type === 'func') {
        return getFunc(expr.value).apply(null, expr.args.map(ev));
      } else if (expr.type === 'ref') {
        return formulaCalculator.evaluateRef(expr.value);
      } else {
        return '';
      }
    }
  }

  function FormulaEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />")
               .appendTo(args.container)
               .bind("keydown.nav", function (e) {
                 if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                   e.stopImmediatePropagation();
                 }
               })
               .focus()
               .select();
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.getValue = function () {
      return $input.val();
    };

    this.setValue = function (val) {
      $input.val(val);
      //TODO: clear formula ?
    };

    this.loadValue = function (item) {
      var cell = args.grid.getActiveCell();
      var ref = {
        row: cell.row, 
        col: cell.cell - 1
      };
      var f = getFormulaCalculator(args.grid).formulaManager.get(ref);
      f = f ? '=' + f : '';
      defaultValue = f || item[args.column.field] || "";
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      var ref, val = $input.val(), cell = args.grid.getActiveCell();
      ref = {
        row: cell.row, 
        col: cell.cell - 1
      };
      if (val.charAt(0) === '=' && val.length > 1) {
        return getFormulaCalculator(args.grid).evaluateCell(ref, val.substring(1));
      } else {
        return val;
      }
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() === "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }
})(jQuery);
