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

  // Slick.Grid
  $.extend(true, window, {
    Slick: {
      Grid: {
        getColumnHeaderElement: getColumnHeaderElement,
        toggleColumnHeaderCssClass: toggleColumnHeaderCssClass,
        removeColumnHeaderCssClass: removeColumnHeaderCssClass,
        addColumnHeaderCssClass: addColumnHeaderCssClass
      }
    }
  });

  function getColumnHeaderElement(columnId) {
    var headers = $( this.getContainerNode() ).find('.slick-header-columns').get(0).children;
    return headers[ this.getColumnIndex(columnId) ];
  }

  function toggleColumnHeaderCssClass(columnId, cssClass) {
    $( this.getColumnHeaderElement(columnId) ).toggleClass(cssClass);
  }

  function removeColumnHeaderCssClass(columnId, cssClass) {
    $( this.getColumnHeaderElement(columnId) ).removeClass(cssClass);
  }

  function addColumnHeaderCssClass(columnId, cssClass) {
    $( this.getColumnHeaderElement(columnId) ).addClass(cssClass);
  }

})(jQuery);
