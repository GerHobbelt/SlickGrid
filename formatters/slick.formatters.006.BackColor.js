  // register namespace
  Slick.Formatters.BackColor = BackColorFormatter;

  function BackColorFormatter(row, cell, value, columnDef, rowDataItem, cellMetaInfo) {
    assert(cellMetaInfo);
    if (cellMetaInfo.outputPlainText) {
      return value;
    }

    //return "<span style='background:" + value  + "'>" + value + "</span>";
    cellMetaInfo.cellStyles.push("background:" + value);
    return "<span style='color:black; padding-left: 1px; padding-right: 1px; background-color: rgba(255, 255, 255, 0.4); text-shadow: 1px 1px 3px white; -webkit-box-shadow: 0px 0px 3px 1px rgba(255, 255, 255, 0.4); box-shadow: 0px 0px 3px 1px rgba(255, 255, 255, 0.4);'>" + value + "</span>";
  }

