(function ($) {
  // register namespace
  $.extend(true, window, {
    Slick: {
      ValidationTooltips: ValidationTooltips
    }
  });

  function ValidationTooltips(options) {
    var
      _grid,
      _self = this,
      _defaults = {
        className: "cell-tooltip-validation-error"
      };

    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _grid.onValidationError.subscribe(handleValidationError);
      _grid.onBeforeCellEditorDestroy.subscribe(handleBeforeCellEditDestroy);
    }

    function destroy() {
      _grid.onValidationError.unsubscribe(handleValidationError);
      _grid.onBeforeCellEditorDestroy.unsubscribe(handleBeforeCellEditDestroy);
    }

    function handleValidationError(e, args) {
      var
        validationResult = args.validationResults,
        errorMessage = validationResult.msg,
        $node = $(args.cellNode);

      var ts = $node.data('tooltipsy');
      if (ts) { ts.destroy(); }

      $node.tooltipsy({
        alignTo: "element",
        offset: [0, 8],
        content: errorMessage,
        showEvent: null,
        hideEvent: null,
        className: options.className
      });
      $node.data('tooltipsy').show();
    }

    function handleBeforeCellEditDestroy(e, args) {
      var ts = $(args.grid.getActiveCellNode()).data('tooltipsy');
      if (ts) {
        ts.destroy();
      }
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy
    });
  }
})(jQuery);
