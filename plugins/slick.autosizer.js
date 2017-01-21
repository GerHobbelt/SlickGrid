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

  // register namespace
  $.extend(true, window, {
    Slick: {
      AutoSizer: AutoSizer
    }
  });

  var defaults = {
    pollInterval: 1500
  };

  function AutoSizer(options) {
    var
      _isDestroyed,
      _options = $.extend(true, defaults, options),
      $container = $(_options.container),
      h, ch, to;

    if ($container.length !== 1) {
      throw new Error('missing argument: container');
    }

    function init(grid) {
      pollSizeChanged();
    }

    function destroy() {
      _isDestroyed = true;
      _options = null;
      $container = null;

      clearTimeout(to);
      to = null;
    }

    function pollSizeChanged() {
      if (_isDestroyed) return;

      ch = $container.height();
      if (h !== ch) {
        h = ch;
        $container.trigger('resize.slickgrid');
      }

      to = setTimeout(pollSizeChanged, _options.pollInterval);
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy
    });
  }
})(jQuery);
