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
      Preloader: Preloader
    }
  });

  function Preloader() {
    var
      self = this,
      _grid;

    function init(grid) {
      _grid = grid;
      return self;
    }

    function destroy() { }

    function getPreloader(center) {
      var $grid = $(_grid.getContainerNode());

      if (!self.$preloader) {
        self.$preloader = $('<div>').addClass('slick-preloader')
          .append($('<div>').addClass('slick-preloader-inner'))
          .appendTo($grid);
      }

      var pos = $grid.offset();
      var height = $grid.height();
      var width = $grid.width();
      var $inner = $grid.find('.slick-preloader-inner');
      $inner
        .css("position", "relative")
        .css("top", height / 2 - $inner.height() / 2 )
        .css("left", width / 2 - $inner.width() / 2 );

      return self.$preloader;
    }

    function show() {
      getPreloader().show();
      return self;
    }

    function hide() {
      getPreloader().fadeOut();
      return self;
    }


    // loader handling (remotemodel)
    // =============================

    var isDataLoading = [];

    function onLoaderDataLoading() {
      isDataLoading.push(true);
      show();
    }

    function onLoaderDataLoaded(e, args) {
      isDataLoading.pop();
      if (!isDataLoading.length) hide();
    }

    function onLoaderDataLoadError(e, args) {
      isDataLoading.pop();
      if (!isDataLoading.length) hide();
    }

    function onLoaderDataLoadAbort(e, args) {
      isDataLoading.pop();
      if (!isDataLoading.length) hide();
    }

    function registerLoader(loader) {
      loader.onDataLoading.subscribe(onLoaderDataLoading);
      loader.onDataLoaded.subscribe(onLoaderDataLoaded);
      loader.onDataLoadError.subscribe(onLoaderDataLoadError);
      loader.onDataLoadAbort.subscribe(onLoaderDataLoadAbort);
    }

    function unregisterLoader(loader) {
      loader.onDataLoading.unsubscribe(onLoaderDataLoading);
      loader.onDataLoaded.unsubscribe(onLoaderDataLoaded);
      loader.onDataLoadError.unsubscribe(onLoaderDataLoadError);
      loader.onDataLoadAbort.unsubscribe(onLoaderDataLoadAbort);
    }

    $.extend(self, {
      "init": init,
      "destroy": destroy,
      "show": show,
      "hide": hide,

      "registerLoader": registerLoader,
      "unregisterLoader": unregisterLoader
    });
  }

})(jQuery);
