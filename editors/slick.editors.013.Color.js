//!
// @license
// slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
// Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
//
// Distributed under MIT license.
// All rights reserved.
///



















  // register namespace
  Slick.Editors.Color = ColorEditor;

  function ColorEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;
    var isOpen = false;
    var $container = $(args.container);

    this.init = function () {
      $input = $("<input type='color' />")
          .appendTo($container)
          .bind("keydown.nav", function (e) {
            if (e.keyCode === Slick.Keyboard.LEFT || e.keyCode === Slick.Keyboard.RIGHT) {
              e.stopImmediatePropagation();
            }
          })
          .focus()
          .select();
      scope.show();
    };

    this.destroy = function () {
      $input.spectrum("destroy");
      $input.remove();
      isOpen = false;
    };

    this.save = function () {
      args.commitChanges();
    };

    this.cancel = function () {
      this.setDirectValue(defaultValue);
      args.cancelChanges();
    };

    this.show = function () {
      if (!isOpen) {
        $input.spectrum({
            className: "spectrumSlick",
            clickoutFiresChange: true,
            showButtons: false,
            showPalette: true,
            showInput: true,
            showAlpha: false,
            showSelectionPalette: true,
            maxPaletteSize: 16,
            preferredFormat: "hex6",
            appendTo: "body",
            flat: true,
            palette: [
              ["#000000", "#262626", "#464646", "#626262", "#707070", "#7D7D7D", "#898989", "#959595", "#A0A0A0", "#ACACAC", "#B7B7B7", "#C2C2C2", "#D7D7D7", "#E1E1E1", "#EBEBEB", "#FFFFFF"], 
              ["#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#ED1C24", "#FFF200", "#00A651", "#00AEEF", "#2E3192", "#EC008C"], 
              ["#F7977A", "#F9AD81", "#FDC68A", "#FFF79A", "#C4DF9B", "#A2D39C", "#82CA9D", "#7BCDC8", "#6ECFF6", "#7EA7D8", "#8493CA", "#8882BE", "#A187BE", "#BC8DBF", "#F49AC2", "#F6989D"], 
              ["#F26C4F", "#F68E55", "#FBAF5C", "#FFF467", "#ACD372", "#7CC576", "#3BB878", "#1ABBB4", "#00BFF3", "#438CCA", "#5574B9", "#605CA8", "#855FA8", "#A763A8", "#F06EA9", "#F26D7D"], 
              ["#ED1C24", "#F26522", "#F7941D", "#FFF200", "#8DC73F", "#39B54A", "#00A651", "#00A99D", "#00AEEF", "#0072BC", "#0054A6", "#2E3192", "#662D91", "#92278F", "#EC008C", "#ED145B"], 
              ["#9E0B0F", "#A0410D", "#A36209", "#ABA000", "#598527", "#1A7B30", "#007236", "#00746B", "#0076A3", "#004B80", "#003471", "#1B1464", "#440E62", "#630460", "#9E005D", "#9E0039"], 
              ["#790000", "#7B2E00", "#7D4900", "#827B00", "#406618", "#005E20", "#005826", "#005952", "#005B7F", "#003663", "#002157", "#0D004C", "#32004B", "#4B0049", "#7B0046", "#7A0026"], 
            ]
        });
        isOpen = true;
      }
      $input.spectrum("show");
    };

    this.hide = function () {
      if (isOpen) {
        $input.spectrum("hide");
        isOpen = false;
      }
    };

    this.position = function (position) {
      if (!isOpen) return;
      //$cp.css("top", position.top + 20).css("left", position.left);
    };

    this.focus = function () {
      scope.show();
      $input.focus();
    };

    this.setDirectValue = function (val) {
      if (val == null) val = "";
      $input.spectrum("set", val);
      defaultValue = scope.serializeValue();
    };

    this.loadValue = function (item) {
      scope.setDirectValue(args.grid.getDataItemValueForColumn(item, args.column));
      $input.select();
    };

    this.serializeValue = function () {
      return $input.spectrum("get").toString();
    };

    this.applyValue = function (item, state) {
      args.grid.setDataItemValueForColumn(item, args.column, state);
    };

    this.isValueChanged = function () {
      assert(defaultValue != null);
      var v = scope.serializeValue();
      return v != defaultValue;
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }



