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
      Plugins: {
        HeaderMenu: HeaderMenu
      }
    }
  });


  /***
   * A plugin to add drop-down menus to column headers.
   *
   * USAGE:
   *
   * Add the plugin .js & .css files and register it with the grid.
   *
   * To specify a menu in a column header, extend the column definition like so:
   *
   *   var columns = [
   *     {
   *       id: "myColumn",
   *       name: "My column",
   *
   *       // This is the relevant part
   *       header: {
   *          menu: {
   *              items: [
   *                {
   *                  // menu item options
   *                },
   *                {
   *                  // menu item options
   *                }
   *              ]
   *          }
   *       }
   *     }
   *   ];
   *
   *
   * Available menu options:
   *    tooltip:      Menu button tooltip.
   *
   *
   * Available menu item options:
   *    title:        Menu item text.
   *    disabled:     Whether the item is disabled.
   *    tooltip:      Item tooltip.
   *    command:      A command identifier to be passed to the onCommand event handlers.
   *    iconCssClass: A CSS class to be added to the menu item icon.
   *    iconImage:    A url to the icon image.
   *    
   * **WARNING**: `item.iconImage` is **deprecated**; tweak the relevant 
   * style / LESS theme mixin (`.slick-header-menuicon-theme()`) 
   * instead -- possibly in conjunction with the `item.iconCssClass` option.
   *
   *
   * The plugin exposes the following events:
   *    onBeforeMenuShow:   Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
   *        Event args:
   *            grid:     Reference to the grid.
   *            column:   Column definition.
   *            menu:     Menu options.  Note that you can change the menu items here.
   *
   *    onCommand:    Fired on menu item click for buttons with 'command' specified.
   *        Event args:
   *            grid:     Reference to the grid.
   *            column:   Column definition.
   *            command:  Button command identified.
   *            button:   Button options.  Note that you can change the button options in your
   *                      event handler, and the column header will be automatically updated to
   *                      reflect them.  This is useful if you want to implement something like a
   *                      toggle button.
   *
   *
   * @param options {Object} Options:
   *    buttonCssClass:   an extra CSS class to add to the menu button
   *    buttonImage:      a url to the menu button image (default: '../images/down.gif')
   *    monitorBodyEvents: 
   *                      (default: `true`) monitor body mouse click events: when the user clicks
   *                      outside SlickGrid the menu will be destroyed.
   *
   *                      Note: more complex applications for which this basic functionality is
   *                      unsuitable can handle this themselves by calling the `hideMenu()`
   *                      API when the application logic decides the header menu should go
   *                      away.
   *
   * **WARNING**: `buttonImage` is a **deprecated** option; use relevant style / LESS theme mixin
   * (`.slick-header-menubutton-theme()`) instead -- possibly in conjunction with the 
   * `buttonCssClass` option.
   * 
   * @class Slick.Plugins.HeaderButtons
   * @constructor
   */
  function HeaderMenu(options) {
    var _grid;
    var _self = this;
    var _handler = new Slick.EventHandler();
    
    /* @const */ var _defaults = {
      buttonCssClass: null,
      buttonImage: null,               // deprecated option; use the LESS theme mixins instead (possibly in conjunction with the `buttonCssClass` option).
      monitorBodyEvents: true
    };
    
    var $menu;
    var $activeHeaderColumn;


    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _handler
        .subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered)
        .subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy);

      // Force the grid to re-render the header now that the events are hooked up.
      _grid.setColumns(_grid.getColumns());

      if (options.monitorBodyEvents) {
        // Hide the menu on outside click.
        $(document.body).bind("mousedown", handleBodyMouseDown);
      }
    }


    function destroy() {
      _handler.unsubscribeAll();
      if (options.monitorBodyEvents) {
        $(document.body).unbind("mousedown", handleBodyMouseDown);
      }
      hideMenu();
    }


    function handleBodyMouseDown(e) {
      if ($menu && $menu[0] !== e.target && !$.contains($menu[0], e.target)) {
        hideMenu();
      }
    }


    function hideMenu() {
      if ($menu) {
        $menu.remove();
        $menu = null;
        $activeHeaderColumn
          .removeClass("slick-header-column-active");
      }
    }

    function handleHeaderCellRendered(e, args) {
      /*
       * ```
       * args: {
       *   node: headerNode (DOM element reference)
       *   column: `columnDef` object
       *   cell: column index (0..n-1)
       *   grid: SlickGrid instance
       * }
       * ```
       */
      var column = args.column;
      var menu = column.header && column.header.menu;

      if (menu) {
        var $el = $("<div></div>")
          .addClass("slick-header-menubutton")
          .data("column", column)
          .data("menu", menu);

        if (options.buttonCssClass) {
          $el.addClass(options.buttonCssClass);
        }

        if (options.buttonImage) {
          console.warn("options.buttonImage for slick.headermenu plugin is deprecated; tweak the relevant style / LESS theme mixin (.slick-header-menubutton-theme()) instead.");
          $el.css("background-image", "url(" + options.buttonImage + ")");
        }

        if (menu.tooltip) {
          $el.attr("title", menu.tooltip);
        }

        $el
          .bind("click", showMenu)
          .appendTo(args.node);
      }
    }


    function handleBeforeHeaderCellDestroy(e, args) {
      /*
       * ```
       * args: {
       *   node: headerNode (DOM element reference)
       *   column: `columnDef` object
       *   cell: column index (0..n-1)
       *   grid: SlickGrid instance
       * }
       * ```
       */
      var column = args.column;

      if (column.header && column.header.menu) {
        $(args.node).find(".slick-header-menubutton").remove();
      }
    }


    function showMenu(e) {
      var $menuButton = $(this);
      var menu = $menuButton.data("menu");
      var columnDef = $menuButton.data("column");

      // Let the user modify the menu or cancel altogether,
      // or provide alternative menu implementation.
      var evt = new Slick.EventData(e);
      var rv = _self.onBeforeMenuShow.notify({
          grid: _grid,
          column: columnDef,
          menu: menu
        }, evt, _self);
      if (rv === false || evt.isHandled()) {
        return;
      }

      if (!$menu) {
        $menu = $("<div class='slick-header-menu'></div>")
          .appendTo(_grid.getContainerNode());
      }
      $menu.empty();

      // Construct the menu items.
      for (var i = 0; i < menu.items.length; i++) {
        var item = menu.items[i];

        if (typeof item === "function") {
          item.call(this, menu, columnDef, i, menu.items)
            .appendTo($menu);
        } else {
          var $li = $("<div class='slick-header-menuitem'></div>")
            .data("command", item.command || "")
            .data("column", columnDef)
            .data("item", item)
            .bind("click", handleMenuItemClick)
            .appendTo($menu);

          if (item.disabled) {
            $li.addClass("slick-header-menuitem-disabled");
          }

          if (item.tooltip) {
            $li.attr("title", item.tooltip);
          }

          var $icon = $("<div class='slick-header-menuicon'></div>")
            .appendTo($li);

          if (item.iconCssClass) {
            $icon.addClass(item.iconCssClass);
          }

          if (item.iconImage) {
            console.warn("item.iconImage for slick.headermenu plugin is deprecated; tweak the relevant style / LESS theme mixin (.slick-header-menuicon-theme()) instead (possibly in conjunction with the item.iconCssClass option).");
            $icon.css("background-image", "url(" + item.iconImage + ")");
          }

          $("<span class='slick-header-menucontent'></span>")
            .text(item.title)
            .appendTo($li);
        }
      }

      // Position the menu.
      $menu.position({
        my: "left top",
        at: "left bottom",
        of: $(this)
      });

      // Mark the header as active to keep the highlighting.
      $activeHeaderColumn = $menuButton.closest(".slick-header-column");
      $activeHeaderColumn
        .addClass("slick-header-column-active");

      // Stop propagation so that it doesn't register as a header click event.
      e.preventDefault();
      e.stopPropagation();
    }


    function handleMenuItemClick(e) {
      var command = $(this).data("command");
      var columnDef = $(this).data("column");
      var item = $(this).data("item");

      // Even when an item is *disabled*, we still consume the *click* user input.
      // It's just that we don't do anything with it...
      if (!item.disabled) {
        hideMenu();

        if (command != null && command !== "") {
          _self.onCommand.notify({
              grid: _grid,
              column: columnDef,
              command: command,
              item: item
            }, e, _self);
        }
      }

      // Stop propagation so that it doesn't register as a header click event.
      e.preventDefault();
      e.stopPropagation();
    }

    $.extend(this, {
      init: init,
      destroy: destroy,
      hideMenu: hideMenu,

      onBeforeMenuShow: new Slick.Event(),
      onCommand: new Slick.Event()
    });
  }
})(jQuery);
