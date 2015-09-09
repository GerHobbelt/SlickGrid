var grid;//The cell grid object.
var data = [];//The data used by the cell grid
//The Generator  default Parameters or the generator cofiguration
var genName = 'CGPL';
//Below are default values for initialisation, can change if wanted through grid or input tables.
var genRamp = 30;
var genOnBar = 100;
var genDecCap = 110;
//The constituent configuration settings for this particular generator.These are same throughout all revisions.
var constituentNames = ['MSEB', 'GUVNL', 'MPSEB', 'CSEB', 'DD', 'DNH'];
constituentNames['generator'] = genName;
var consReqPercentages = [0.2, 0.3, 0.2, 0.1, 0.1, 0.1];
var consRSDPercentages = [0.2, 0.3, 0.2, 0.1, 0.1, 0.1];
//Temporary Instance Data
var curRev = 0; //can be modified only by loadRevision() function
var markRev = [];
var sectionsArray = [];
var revStrtBlkNums = [];//yet to be used for improved computation optimization.

var tiedToGrid = true;
var tiedToReq = false;
var tiedToDC = false;
var tiedToRamp = false;

//Database Array-Used right now as the database
var revDataArray = new Array();

//cell grid options for customization
var options = {
  editable: true,
  enableAddRow: true,
  enableCellNavigation: true,
  asyncEditorLoading: false,
  autoEdit: false
};

var undoRedoBuffer = {
  commandQueue: [],
  commandCtr: 0,

  queueAndExecuteCommand: function(editCommand) {
    this.commandQueue[this.commandCtr] = editCommand;
    this.commandCtr++;
    editCommand.execute();
  },

  undo: function() {
    if (this.commandCtr == 0)
      return;

    this.commandCtr--;
    var command = this.commandQueue[this.commandCtr];

    if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
      command.undo();
    }
  },
  redo: function() {
    if (this.commandCtr >= this.commandQueue.length)
      return;
    var command = this.commandQueue[this.commandCtr];
    this.commandCtr++;
    if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
      command.execute();
    }
  }
}

// undo shortcut
$(document).keydown(function(e) {
  if (e.which == 90 && (e.ctrlKey || e.metaKey)) { // CTRL + (shift) + Z
    if (e.shiftKey) {
      undoRedoBuffer.redo();
    } else {
      undoRedoBuffer.undo();
    }
  }
});

var pluginOptions = {
  clipboardCommandHandler: function(editCommand) {
    undoRedoBuffer.queueAndExecuteCommand.call(undoRedoBuffer, editCommand);
  },
  includeHeaderWhenCopying: false
};
//cell grid options for customization over

//Setting the Column names of the grid
var columns = [
  {
    id: 'ramp',
    name: 'MaxRamp',
    field: 'rampNum',
    width: 30,
    editor: Slick.Editors.Text
  }, {
    id: 'DC',
    name: 'DC',
    field: 'DC',
    width: 40,
    editor: Slick.Editors.Text
  }, {
    id: "offBarDC",
    name: "OffBarDC",
    field: "offBar",
    width: 40
  }, {
    id: 'onBarDC',
    name: 'OnBarDC',
    field: 'onBar',
    width: 40,
    editor: Slick.Editors.Text
  }, {
    id: "selector",
    name: "BlockNo",
    field: "SNo",
    width: 40
  }, {
    id: "ramp",
    name: "Ramp",
    field: "rampedVal",
    width: 40
  }, {
    id: "availGen",
    name: "AvailableGeneration",
    field: "avail",
    width: 40
  }
];
//Adding Constituent Requisition columns iteratively
for (var i = 0; i < constituentNames.length; i++) {
  columns.push({
    id: i,
    //name field is just for display
    name: constituentNames[i],
    //"field" is the field used by the program a particular cell in row
    field: i,
    width: 50,
    editor: Slick.Editors.Text
  });
}
//Setting the Column names of the grid over

//On loading of the html page do the following
$(function() {
  //Add options to the dropdowns og the following 'select' inouts
  addOptions(['selectRSDConst', 'selectURSConst', 'selectReqConst']);
  /*TODO
  This is to add the select all and deselect all capability to all the  forms with checkboxes
    var checkbox = document.getElementById('no_photo');
    checkbox.addEventListener('click', function() {
      var photo = document.getElementById('photo_upload');
      if(photo.style.display != 'none') {
        photo.style.display = 'none';
      } 
      else if(photo.style.display == 'none') {
        photo.style.display = 'block';
      };
    });
  */
  //Set the whole grid to default values, rsd urs not included
  for (var i = 0; i < 96; i++) {
    //Setting the data values of the grid here...
    //i is iterator for the row i or block i+1...
    var d = (data[i] = {});
    //Creating markRev Array
    var m = (markRev[i] = {});
    d["SNo"] = i + 1;
    d["rampNum"] = genRamp;
    d["DC"] = genDecCap;
    d["onBar"] = genOnBar;
    d["offBar"] = genDecCap - genOnBar;
    var sumgen = 0;
    for (var j = 0; j < constituentNames.length; j++) {
      //j is iterator the column j ...
      //Setting the data value for the cell i,j(row,column) or block i+1,j
      //d[j] = genOnBar*consReqPercentages[j];
      d[j] = 'FULL';
      //Accommodating markRev
      m[j] = 0;
    }    
    d["avail"] = 0;
    if (i > 0) {
      d["rampedVal"] = 0;
    } else
      d["rampedVal"] = "NA";
  }
  //Building the grid and configuring the grid
  grid = new Slick.Grid("#myGrid", data, columns, options);
  grid.setSelectionModel(new Slick.CellSelectionModel());
  grid.registerPlugin(new Slick.AutoTooltips());
  grid.onCellChanged;
  // set keyboard focus on the grid
  grid.getCanvasNode().focus();
  //enabling the excel style functionality by the plugin
  grid.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));
  //Things to do on adding a new Row - TODO - not needed coz we dont add new rows other than 96
  grid.onAddNewRow.subscribe(function(e, args) {
    var item = args.item;
    var column = args.column;
    grid.invalidateRow(data.length);
    data.push(item);
    grid.updateRowCount();
    grid.render();
  });
})

/*
Adds the options as constituent Names into the dropdowns input elements
*/
function addOptions(selNameArray) {
  for (var j = 0; j < selNameArray.length; j++) {
    var selList = document.getElementById(selNameArray[j]);
    selList.innerHTML = '';
    for (var i = 0; i < constituentNames.length; i++) {
      var option = document.createElement('option');
      option.text = constituentNames[i];
      selList.appendChild(option);
    }
  }
}

/*
Returns the cell value as a number
*/
function ConvertCellValToNum(cVal, constIndex, blk, Cat) //Cat = 0:Normal;1:RSD;2:URS
{
  var onBarVal = (data[blk])['onBar'];
  if (isNaN(cVal)) {
    if (cVal.match(/^\FULL$/i))
      return consReqPercentages[constIndex] * onBarVal;
    else if (cVal.match(/^\d+(\.\d+)?\p$/i))
      return consReqPercentages[constIndex] * onBarVal * (+(cVal.substr(0, cVal.length - 1))) * 0.01;
  } else
    return cVal;
}

//Add Row to the tables of input requisitions and rsd and urs tables
function addRow(tableID) {
  var table = document.getElementById(tableID);
  var rowCount = table.rows.length;
  var selectmenu;
  switch (tableID) {
    case 'URSInputTable':
      selectmenu = document.getElementById('selectURSConst');
      break;
    case 'RSDInputTable':
      selectmenu = document.getElementById('selectRSDConst');
      break;
    case 'reqInputTable':
      selectmenu = document.getElementById('selectReqConst');
      break;
  }
  var chosenval;
  if (tableID == 'genDCInputTable')
    chosenval = genName;
  else if(tableID == 'genDecInputTable')
    chosenval = genName;
  else if (tableID == 'genMaxRampInputTable')
    chosenval = "MaxRamp"
  else
    chosenval = constituentNames[selectmenu.selectedIndex];
  //check for duplicates for urs and rsd inputs
  for (var i = 1; i < rowCount && (tableID == "URSInputTable" || tableID == "RSDInputTable"); i++) {
    if (table.rows[i].cells[0].childNodes[0].innerHTML == chosenval) {
      if (tableID == "URSInputTable") {
        var ifok = confirm("Constituent already present, add duplicates?");
        if (ifok == false) {
          return false; //jumping out of the function
        }
      } else //tableID == RSDInputTable
      {
        //No duplicate rsd columns allowed...Can keep alert if wanted design decision
        return false; //jumping out of the function
      }
      break;
    }
  }
  var row = table.insertRow(rowCount);
  var colCount = table.rows[0].cells.length;
  var newcell = row.insertCell(0);
  var t = document.createTextNode(chosenval);
  var s = document.createElement("span");
  s.appendChild(t);
  newcell.appendChild(s);
  for (var i = 1; i < colCount - 1; i++) {
    newcell = row.insertCell(i);
    var t = document.createElement("input");
    t.min = '1';
    t.value = '';
    if (i != colCount - 2) {
      t.type = 'number';
      t.onkeypress = isNumberKey;
      t.min = '1';
    }
    newcell.appendChild(t);
  }
  newcell = row.insertCell(colCount - 1);
  var cb = document.createElement("input");
  cb.type = 'checkbox';
  newcell.appendChild(cb);
  //row inserted in to the table

  //If rsd row is inserted add it to the set of columns of the grid with default value of 0;//TODO - not implemented
  if (tableID == "RSDInputTable") {
    addAnRSDColumnToGrid(chosenval);
  }
}

function isNumberKey(evt) {
  evt = (evt) ? evt : window.event
  var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

function deleteRow(tableID) {
  try {
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    for (var i = 1; i < rowCount; i++) {
      var row = table.rows[i];
      var colCount = table.rows[0].cells.length;
      var chkbox = row.cells[colCount - 1].childNodes[0];
      if (null != chkbox && true == chkbox.checked) {
        table.deleteRow(i);
        rowCount--;
        i--;
      }
    }
  } catch (e) {
    alert(e);
  }
}

function SelectAll(ele, tabname) {
   var table = document.getElementById(tabname);
   var action = true;
   if (!ele.checked) action = false;
   var cb;
   for (var i = 1; i < table.rows.length; i++) {
     cb = table.rows[i].cells[table.rows[i].cells.length - 1].childNodes[0];
     cb.checked = action;
   }
}

function createSumm(overridePermissionRequired) { //by pressing modify revision by input tables button
  var table = document.getElementById("reqInputTable");
  var rowCount = table.rows.length;
  if (rowCount < 2)
    return false;
  //Fisrt validate the input semantics.Allowable values are 1 to 96 in case of block numbers and possitive integers along with null, full, nochange, percentage loads.
  for (var i = 1; i < rowCount; i++) {
    var cellval = table.rows[i].cells[3].childNodes[0].value;
    //For null cell value validation
    if (!cellval) {
      alert('Null values at row ' + i + '. Null values not allowed');
      return false;
    }
    //For cell value validation
    var isValid = cellval.match(/^\d+(\.\d+)?\p$/i) || cellval.match(/^\FULL$/i) || cellval.match(/^[+]?\d+(\.\d+)?$/i);
    if (!isValid) {
      alert('Invalid values at block ' + (i + 1) + '. Invalid values not allowed');
      return false;
    }
    //from block <  to block   
    if (Number(table.rows[i].cells[1].childNodes[0].value) > Number(table.rows[i].cells[2].childNodes[0].value)) {
      alert('From value > TO value at row ' + i);
      return false;
    }
    //from block &  to block belong to [1,96]
    if ((Number(table.rows[i].cells[1].childNodes[0].value) < 1) || (Number(table.rows[i].cells[1].childNodes[0].value) > 96) || (Number(table.rows[i].cells[2].childNodes[0].value) < 1) || (Number(table.rows[i].cells[2].childNodes[0].value) > 96)) {
      alert('From value or TO value not in limits at row ' + i);
      return false;
    }
  }
  //Requisition Table Validation over...
  if (overridePermissionRequired) {
    if (!confirm("Override the grid Data...?"))
      return false;
  }
  //Resetting the table  to a value called  'FULL'
  resetGrid('FULL');
  //changing the table data depending on the requisition input table
  //formulas not implemented 
  for (var i = 1; i < rowCount; i++) { //iterator leaving the the table header
    for (var blkNum = Number(table.rows[i].cells[1].childNodes[0].value) - 1; blkNum <= Number(table.rows[i].cells[2].childNodes[0].value) - 1; blkNum++) {
      var constcol = table.rows[i].cells[0].childNodes[0].innerHTML.toString();
      //alert(constcol);
      constcol = constituentNames.indexOf(constcol);
      //alert(constcol);
      //table.rows[i].cells[3].childNodes[0].value = number in the form of string and no need to convert to number since javascript takes care of it
      var cellvalue = table.rows[i].cells[3].childNodes[0].value;
      if (isNaN(cellvalue)) {
        cellvalue = cellvalue.toUpperCase();
      }
      (data[blkNum])[constcol] = cellvalue;
    }
  }
  //tieing all the tables to one button
  modifyDC(false);
  modifyDec(false);
  modifyRamp(false);
  //tieing all the tables to one button
  calulateFormulaColumns();
  //Formulas implemented
  tiedToGrid = true;
  tiedToReq = true;
  //Now to find the revision tag to be attached, find the smallest row index of this requested revision column which differs from the previous revision cell and from that cell all below cells are of the requested revision
  //stub
  createSections();
  createSectionSummaryTable();
}

function resetGrid(val) {
  //ToDo validate grid dynamically using on cellchange listener
  for (var i = 0; i < 96; i++) {
    //i is iterator for the row i ...
    var d = (data[i]);
    for (var j = 0; j < constituentNames.length; j++) {
      //j is iterator the column j ...
      //Resetting the data values of the cell i,j(row,column) to val
      d[j] = val;
    }
  }
}

function resetGridDCorRamp(val) {
  for (var i = 0; i < 96; i++) {
    //i is iterator for the row i ...
    if (val == "DC")
      (data[i])['onBar'] = genOnBar;
    else if(val == "Dec")
      (data[i])['DC'] = genDecCap;
    else if (val == "Ramp")
      (data[i])['rampNum'] = genRamp;
  }
}

function createSections() {
  //Find the sections of the columns
  sectionsArray = new Array();
  for (var constcol1 = 0; constcol1 < constituentNames.length+3; constcol1++) { //last two for onBarDC and MaxRamp and DC respectively
    switch (constcol1) {
      case constituentNames.length:
        constcol = "onBar";
        break;
      case constituentNames.length + 1:
        constcol = "rampNum";
        break;
      case constituentNames.length + 2:
        constcol = "DC";
        break;
      default:
        constcol = constcol1;
        break;
    }
    var sections = new Array();
    var sectionStart = 0;
    for (var blkNum = 1; blkNum < 96; blkNum++) {
      if ((data[blkNum])[constcol] != (data[blkNum - 1])[constcol]) {
        sections.push({
          'secStart': sectionStart,
          'secEnd': blkNum - 1,
          'val': (data[blkNum - 1])[constcol]
        });
        sectionStart = blkNum;
      }
    }
    sections.push({
      'secStart': sectionStart,
      'secEnd': 95,
      'val': (data[95])[constcol]
    });
    //sectionsArray.push(sections);
    sectionsArray[constcol] = sections;
  }
  //sections of the column found
}

function createSectionSummaryTable() {
  var summTab = document.getElementById('summTab');
  summTab.innerHTML = '';
  for (var j = 0; j < sectionsArray.length; j++) {
    createSectionSummaryTableRow(j);
  }
  createSectionSummaryTableRow("DC");
  createSectionSummaryTableRow("onBar");
  createSectionSummaryTableRow("rampNum");
  summTab.border = '1';
  summTab.width = '200px';
  //created the section summary table
  createSummTableTiedInfo();
}

function createSectionSummaryTableRow(j) {
  var sections = sectionsArray[j];
  var textStr;
  if(isNaN(j))
    textStr = j;
  else
    textStr = constituentNames[j];
  for (var i = 0; i < sections.length; i++) {
    var tr = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    td0.appendChild(document.createTextNode(textStr));
    td1.appendChild(document.createTextNode((sections[i])['secStart'] + 1));
    td2.appendChild(document.createTextNode((sections[i])['secEnd'] + 1));
    td3.appendChild(document.createTextNode((sections[i])['val']));
    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    summTab.appendChild(tr);
  }
}

function updateFromGrid() {
  if (!validateGrid())
    return false;
  calulateFormulaColumns();
  createSections();
  tiedToGrid = true;
  tiedToReq = false;
  createSectionSummaryTable();
}

function validateGrid() {
  //ToDo validate grid dynamically using on cellchange listener
  for (var i = 0; i < 96; i++) {
    //Validating the data values of the grid here...
    //i is iterator for the row i ...
    var d = (data[i]);
    var cellval;
    var alertstr;
    //validating constituent columns
    for (var j = 0; j < constituentNames.length; j++) {
      //j is iterator the column j ...
      //Validating the data value for the cell i,j(row,column)
      cellval = d[j];
      //check if it is a number
      if (typeof cellval == "number") {
        //No Validation required
      } else {
        var isValid = cellval.match(/^\d+(\.\d+)?\p$/i) || cellval.match(/^\FULL$/i) || cellval.match(/^[+]?\d+(\.\d+)?$/i);
        if (!isValid) {
          alert('Invalid values at Block ' + (i + 1) + 'of the Constituent ' + constituentNames[j] + '. Invalid values not allowed');
          return false;
        } else {
          //if valid then capitalize all letters.Design  decision
          d[j] = cellval.toUpperCase();
        }
      }
    }
    //validating MaxRamps and onBarDC
    for (var j = 0; j < 2; j++) {
      //j is iterator the column j ...
      //Validating the data value for the cell i,j(row,column)
      var colstr;
      switch (j) {
        case 0:
          colstr = 'onBar'
          alertstr = 'Invalid values at Block ' + (i + 1) + 'of OnBarDC grid column' + '. Invalid values not allowed';
          break;
        case 1:
          colstr = 'rampNum'
          alertstr = 'Invalid values at Block ' + (i + 1) + 'of MaxRamp grid column' + '. Invalid values not allowed';
          break;
      }
      cellval = d[colstr];
      //check if it is a number
      if (typeof cellval == "number") {
        //No Validation required
      } else {
        var isValid = cellval.match(/^[+]?\d+(\.\d+)?$/i);
        if (!isValid) {
          alert(alertstr);
          return false;
        } else {
          //if valid then capitalize all letters.Design  decision
          d[colstr] = cellval;
        }
      }
    }
  }
  return true;
}

function getSummSecsToManual() //sections version of summtomanual
{
  var table = document.getElementById("reqInputTable");
  var sections;
  table.innerHTML = "<tbody><tr><td>Constituent Name</td><td>From Block</td><td>To Block</td><td>Value</td><td><input type=\"checkbox\" name=\"chk\" onclick=\"SelectAll(this,'reqInputTable')\"></input></td></tr></tbody>";
  for (var j = 0; j < sectionsArray.length; j++) {
    sections = sectionsArray[j];
    for (var k = 0; k < sections.length; k++)
      addRowOfInput("reqInputTable", constituentNames[j], sections[k].secStart + 1, sections[k].secEnd + 1, sections[k].val);
  }
  getSummDCToManual();
  getSummDecToManual();
  getSummRampToManual();
}

function getSummDCToManual() {
  var table = document.getElementById("genDCInputTable");
  var sections;
  table.innerHTML = "<tbody><tr><td>Generator Name</td><td>From Block</td><td>To Block</td><td>OnBarDc Value</td><td><input type=\"checkbox\" name=\"chk\" onclick=\"SelectAll(this,'genDCInputTable')\"></input></td></tr></tbody>";
  if (sectionsArray.length) {
    sections = sectionsArray["onBar"];
    for (var k = 0; k < sections.length; k++) {
      addRowOfInput("genDCInputTable", constituentNames['generator'], sections[k].secStart + 1, sections[k].secEnd + 1, sections[k].val);
    }
  }
}

function getSummDecToManual() {
  var table = document.getElementById("genDecInputTable");
  var sections;
  table.innerHTML = "<tbody><tr><td>Generator Name</td><td>From Block</td><td>To Block</td><td>DC Value</td><td><input type=\"checkbox\" name=\"chk\" onclick=\"SelectAll(this,'genDecInputTable')\"></input></td></tr></tbody>";
  if (sectionsArray.length) {
    sections = sectionsArray["DC"];
    for (var k = 0; k < sections.length; k++) {
      addRowOfInput("genDecInputTable", constituentNames['generator'], sections[k].secStart + 1, sections[k].secEnd + 1, sections[k].val);
    }
  }
}

function getSummRampToManual() {
  var table = document.getElementById("genMaxRampInputTable");
  var sections;
  table.innerHTML = "<tbody><tr><td>Generator Name</td><td>From Block</td><td>To Block</td><td>MaxRamp Value</td><td><input type=\"checkbox\" name=\"chk\" onclick=\"SelectAll(this,'genMaxRampInputTable')\"></input></td></tr></tbody>";
  if (sectionsArray.length) {
    sections = sectionsArray["rampNum"];
    for (var k = 0; k < sections.length; k++) {
      addRowOfInput("genMaxRampInputTable", 'MaxRamp', sections[k].secStart + 1, sections[k].secEnd + 1, sections[k].val);
    }
  }
}

//Adds a row of edittext inputs with values specified already, used in getsummtomanual
function addRowOfInput(tableID, colName, fromb, tob, val, chosenval) {
  var table = document.getElementById(tableID);
  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);
  var colCount = table.rows[0].cells.length;
  var newcell = row.insertCell(0);
  var t = document.createTextNode(colName);
  var s = document.createElement("span");
  s.appendChild(t);
  newcell.appendChild(s);
  for (var i = 1; i < 4; i++) {
    newcell = row.insertCell(i);
    var t = document.createElement("input");
    if (i == 1) {
      t.min = '1';
      t.type = 'number';
      t.onkeypress = isNumberKey;
      t.value = fromb;
    } else if (i == 2) {
      t.min = '1';
      t.type = 'number';
      t.onkeypress = isNumberKey;
      t.value = tob;
    } else {
      t.min = '0';
      t.value = val;
    }
    newcell.appendChild(t);
  }
  newcell = row.insertCell(colCount - 1);
  var cb = document.createElement("input");
  cb.type = 'checkbox';
  newcell.appendChild(cb);
}


function saveToDatabase() //Update Operations of the database.
{
  //Get the current revision number.
  //Take the sections array and save it to the database
  if (!confirm("Save the changes to database in Revision " + curRev + "...?" + "\n" + "The data will be saved based on the Summary table"))
    return false;
  if (revDataArray.length == curRev)
    revDataArray.push(sectionsArray);
  else
    revDataArray[curRev] = sectionsArray;
}

function loadRevision() //Read Operation of the database.
{
  //Get the rev number from the revInput TextBox element.Validate it first
  var loadRev = +document.getElementById("revInput").value; //+ tries to converts string to a number
  if (isNaN(loadRev)) {
    alert('Invalid Input in the revision field. So cannot load...');
    return false;
  }
  //If semantics permit ask if sure to create a new revision.
  if (loadRev - getLastRevOfDb() == 1) {
    createNewRev();
    return false;
  }
  //First check if rev is present in the database.
  if (!checkForRevInDb(loadRev)) {
    alert("The revision " + loadRev + " is not present");
    return false;
  }
  //Then ask to save changes if not saved
  if (!confirm("Load the Revision " + loadRev + " ?" + "\n" + "If changes not saved, press cancel button and save, otherwise changes will be lost...")) {
    return false;
  }
  //Now the revision can be loaded...
  //So if wanted change the table data accordingly and update the curRev variable
  setCurrRevDisplay(loadRev);
  sectionsArray = revDataArray[curRev];
  createSectionSummaryTable();
  //press the button getfromsummarytable virtually and modify the grid
  getSummSecsToManual();
  getSummDCToManual();
  getSummDecToManual();
  getSummRampToManual();
  //now press the button reqFeedByTableButton virtually to recreate the summary table and modify the grid
  createSumm(false);
}

function checkForRevInDb(loadRev) {
  if (loadRev < revDataArray.length) //special case for zero
    return true;
  else
    return false;
}

function getLastRevOfDb() {
  return revDataArray.length - 1;
}

function createNewRev() //Create Operation of the database.
{
  if (!confirm("Revision not present." + "\n" + "Create a new Revision " + (getLastRevOfDb() + 1) + "?")) {
    return false;
  }
  setCurrRevDisplay(getLastRevOfDb() + 1);
  return true;
}

function setCurrRevDisplay(loadrev) {
  curRev = loadrev;
  //Change the display view
  document.getElementById("revDisplay").innerHTML = curRev;
}

/*
Calculate the formula columns values

*/
function calulateFormulaColumns() {
  for (var i = 0; i < 96; i++) {
    //i is iterator for the row i or block i+1...
    var d = (data[i]);
    d["offBar"] = d["DC"] - d["onBar"];
    var sumgen = 0;
    for (var j = 0; j < constituentNames.length; j++) {
      //j is iterator the column j ...
      sumgen += +ConvertCellValToNum(d[j], j, i);
    }
    d["avail"] = d["onBar"] - sumgen;
    if (i > 0) {
      d["rampedVal"] = d["avail"] - (data[i - 1])["avail"];
    } else
      d["rampedVal"] = "NA";
  }
  grid.invalidateAllRows();
  grid.render();
}

//Marking each cell with the latest affecting rev number till current revision
//Iterate through each revision from 1st till current revision and find the smallest block or row number affected 
//by the revision and mark the next remaining blocks of the column as the same rev number.
//Continue this till current revision.
function markCellsWithRevs() {
  //First mark all cells with 0 rev.
  for (var i = 0; i < 96; i++) {
    var m = (markRev[i]);
    for (var j = 0; j < constituentNames.length; j++) {
      m[j] = 0;
    }
  }
  //Iterate from 1st to current revision 
  //works only for saved revisions now, if rev not saved or a new revision, then doesnot work
  var sectionsArray = revDataArray[0];
  for (var rev = 1; rev <= curRev; rev++) {
    //Get the revision data of the present ad prev revisons
    var sectionsArrayPrev = sectionsArray;
    sectionsArray = revDataArray[rev];
    //iterate through each column of this revision to find the min blk num affected by this rev in this column
    for (var constcol = 0; constcol < constituentNames.length; constcol++) {
      //Column data of prev and present revisions
      var sectionsprev = sectionsArrayPrev[constcol];
      var sections = sectionsArray[constcol];
      var column = new Array(96);
      //var columnprev = new Array(96);
      //Build the columns of prev and present revisions of this constituent
      for (var i = 0; i < sections.length; i++) {
        for (var blkNum = Number(sections[i]["secStart"]); blkNum <= Number(sections[i]["secEnd"]); blkNum++) {
          column[blkNum] = sections[i]["val"];
        }
      }
      var changeRow = 96;
      for (var i = 0; i < sectionsprev.length; i++) {
        for (var blkNum = Number(sectionsprev[i]["secStart"]); blkNum <= Number(sectionsprev[i]["secEnd"]); blkNum++) {
          //Check if prev column mismatches with present and declare the min blk number or row
          if (sectionsprev[i]["val"] != column[blkNum]) //change row found
          {
            changeRow = blkNum;
            break;
          }
        }
      }
      //TODO
      //This computation for changeRow of each column in a rev can be avoided by calculating and saving the array of this variable in the database
      //Marking the row rev on the basis of changeRow variable
      for (var i = changeRow; i < 96; i++) {
        (markRev[i])[constcol] = rev;
      }
    }
  }
  //Now cells are marked with the latest rev change tags.
  //Lets output them to the revMarkTable
  var tab = document.getElementById("revMarkTable");
  tab.innerHTML = '';
  tab.border = '1';
  tab.width = '100px';
  for (var i = 0; i < 96; i++) {
    //Add a row
    var tr = document.createElement('tr');
    var td0 = document.createElement('td');
    td0.appendChild(document.createTextNode(i + 1));
    tr.appendChild(td0);
    for (var constcol = 0; constcol < constituentNames.length; constcol++) {
      //Add cells to the table
      var td0 = document.createElement('td');
      td0.appendChild(document.createTextNode((markRev[i])[constcol]));
      tr.appendChild(td0);
    }
    tab.appendChild(tr);
  }
  performAlgo();
}


function modifyDC(overridePermissionRequired) {
  var table = document.getElementById("genDCInputTable");
  var rowCount = table.rows.length;
  if (rowCount < 2)
    return false;
  //Fisrt validate the input semantics.Allowable values are 1 to 96 in case of block numbers and possitive integers along with null, full, nochange, percentage loads.
  for (var i = 1; i < rowCount; i++) {
    var cellval = table.rows[i].cells[3].childNodes[0].value;
    //For null cell value validation
    if (!cellval) {
      alert('Null values at row ' + i + '. Null values not allowed');
      return false;
    }
    //For cell value validation
    var isValid = cellval.match(/^[+]?\d+(\.\d+)?$/i);
    if (!isValid) {
      alert('Invalid values at row ' + i + '. Invalid values not allowed');
      return false;
    }
    //from block <  to block   
    if (Number(table.rows[i].cells[1].childNodes[0].value) > Number(table.rows[i].cells[2].childNodes[0].value)) {
      alert('From value > TO value at row ' + i);
      return false;
    }
    //from block &  to block belong to [1,96]
    if ((Number(table.rows[i].cells[1].childNodes[0].value) < 1) || (Number(table.rows[i].cells[1].childNodes[0].value) > 96) || (Number(table.rows[i].cells[2].childNodes[0].value) < 1) || (Number(table.rows[i].cells[2].childNodes[0].value) > 96)) {
      alert('From value or TO value not in limits at row ' + i + " of Generator onBar DC Input Table");
      return false;
    }
  }
  //onBar DC Input Table Validation over...
  if (overridePermissionRequired) {
    if (!confirm("Override the grid Data...?"))
      return false;
  }
  //Resetting the table DC values to be equal to default onBarDC value of the generator
  resetGridDCorRamp("DC");
  //Changing the table data depending on the requisition input table
  //formulas not implemented 
  for (var i = 1; i < rowCount; i++) { //iterator leaving the the table header
    for (var blkNum = Number(table.rows[i].cells[1].childNodes[0].value) - 1; blkNum <= Number(table.rows[i].cells[2].childNodes[0].value) - 1; blkNum++) {
      //table.rows[i].cells[3].childNodes[0].value = number in the form of string and no need to convert to number since javascript takes care of it
      var cellvalue = table.rows[i].cells[3].childNodes[0].value;
      (data[blkNum])["onBar"] = cellvalue;
    }
  }
}

function modifyDec(overridePermissionRequired) {
  var table = document.getElementById("genDecInputTable");
  var rowCount = table.rows.length;
  if (rowCount < 2)
    return false;
  //Fisrt validate the input semantics.Allowable values are 1 to 96 in case of block numbers and possitive integers along with null, full, nochange, percentage loads.
  for (var i = 1; i < rowCount; i++) {
    var cellval = table.rows[i].cells[3].childNodes[0].value;
    //For null cell value validation
    if (!cellval) {
      alert('Null values at row ' + i + '. Null values not allowed');
      return false;
    }
    //For cell value validation
    var isValid = cellval.match(/^[+]?\d+(\.\d+)?$/i);
    if (!isValid) {
      alert('Invalid values at row ' + i + '. Invalid values not allowed');
      return false;
    }
    //from block <  to block   
    if (Number(table.rows[i].cells[1].childNodes[0].value) > Number(table.rows[i].cells[2].childNodes[0].value)) {
      alert('From value > TO value at row ' + i);
      return false;
    }
    //from block &  to block belong to [1,96]
    if ((Number(table.rows[i].cells[1].childNodes[0].value) < 1) || (Number(table.rows[i].cells[1].childNodes[0].value) > 96) || (Number(table.rows[i].cells[2].childNodes[0].value) < 1) || (Number(table.rows[i].cells[2].childNodes[0].value) > 96)) {
      alert('From value or TO value not in limits at row ' + i + " of Generator DC Input Table");
      return false;
    }
  }
  //DC Input Table Validation over...
  if (overridePermissionRequired) {
    if (!confirm("Override the grid Data...?"))
      return false;
  }
  //Resetting the table DC values to be equal to default onBarDC value of the generator
  resetGridDCorRamp("Dec");
  //Changing the table data depending on the requisition input table
  //formulas not implemented 
  for (var i = 1; i < rowCount; i++) { //iterator leaving the the table header
    for (var blkNum = Number(table.rows[i].cells[1].childNodes[0].value) - 1; blkNum <= Number(table.rows[i].cells[2].childNodes[0].value) - 1; blkNum++) {
      //table.rows[i].cells[3].childNodes[0].value = number in the form of string and no need to convert to number since javascript takes care of it
      var cellvalue = table.rows[i].cells[3].childNodes[0].value;
      (data[blkNum])["DC"] = cellvalue;
    }
  }
}

function modifyRamp(overridePermissionRequired) {
  var table = document.getElementById("genMaxRampInputTable");
  var rowCount = table.rows.length;
  if (rowCount < 2)
    return false;
  //Fisrt validate the input semantics.Allowable values are 1 to 96 in case of block numbers and possitive integers along with null, full, nochange, percentage loads.
  for (var i = 1; i < rowCount; i++) {
    var cellval = table.rows[i].cells[3].childNodes[0].value;
    //For null cell value validation
    if (!cellval) {
      alert('Null values at row ' + i + '. Null values not allowed');
      return false;
    }
    //For cell value validation
    var isValid = cellval.match(/^[+]?\d+(\.\d+)?$/i);
    if (!isValid) {
      alert('Invalid values at row ' + i + '. Invalid values not allowed');
      return false;
    }
    //from block <  to block   
    if (Number(table.rows[i].cells[1].childNodes[0].value) > Number(table.rows[i].cells[2].childNodes[0].value)) {
      alert('From value > TO value at row ' + i);
      return false;
    }
    //from block &  to block belong to [1,96]
    if ((Number(table.rows[i].cells[1].childNodes[0].value) < 1) || (Number(table.rows[i].cells[1].childNodes[0].value) > 96) || (Number(table.rows[i].cells[2].childNodes[0].value) < 1) || (Number(table.rows[i].cells[2].childNodes[0].value) > 96)) {
      alert('From value or TO value not in limits at row ' + i + " of Generator DC Input Table");
      return false;
    }
  }
  //MaxRamp Input Table Validation over...
  if (overridePermissionRequired) {
    if (!confirm("Override the grid Data...?"))
      return false;
  }
  //Resetting the table DC values to be equal to default onBarDC value of the generator
  resetGridDCorRamp("Ramp"); //changed
  //Changing the table data depending on the requisition input table
  //formulas not implemented 
  for (var i = 1; i < rowCount; i++) { //iterator leaving the the table header
    for (var blkNum = Number(table.rows[i].cells[1].childNodes[0].value) - 1; blkNum <= Number(table.rows[i].cells[2].childNodes[0].value) - 1; blkNum++) {
      //table.rows[i].cells[3].childNodes[0].value = number in the form of string and no need to convert to number since javascript takes care of it
      var cellvalue = table.rows[i].cells[3].childNodes[0].value;
      (data[blkNum])["rampNum"] = cellvalue; //changed
    }
  }
}

function createSummTableTiedInfo(atrr, val) {
  var gridTied, reqTableTied, DCTableTied, RampTableTied;
  gridTied = tiedToGrid ? 'grid' : '';
  reqTableTied = tiedToReq ? ', Manual Entry' : '';
  DCTableTied = tiedToDC ? ', DC Manual Entry' : '';
  RampTableTied = tiedToRamp ? ', MaxRamp Manual Entry' : '';
  document.getElementById('tiedInfo').innerHTML = 'Revision Summary, tied to ' + gridTied + reqTableTied + DCTableTied + RampTableTied + '.';
}

function addAnRSDColumnToGrid(constName) {

}

function performAlgo() {
//The whole current revision tags are present in the markRev table
//So we consider the current revision Revision Summary table as a deisired table and solve the ramps and Maximum share constraints
//The maximum share can be found out by the consReqPercentages array 
//The maximum available ramp can be found out by the RevisionSummaryTable.
}
