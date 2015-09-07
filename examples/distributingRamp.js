function handle(e)
{
	Catagorise();
	return false;
}

function Catagorise() {
	//Revisions of all the cells in a particular row
	//var rowRevs = [1, 1, 1, 3, 4, 5, 4, 3];
	var rowRevs = document.getElementById('RevsIn').value.split(",");
	rowRevs = convertToNums(rowRevs);
	//An object created to catagorise the row cells according to the revision number in descending order
	var rowRevsCatagorised = segregateColumns(rowRevs);
	//An array initialised which has to contain the rev number present in the row in descending order
	var rowRevsDupExcluded = getRevNumsinDescOrder(rowRevsCatagorised);
	document.getElementById('console').innerHTML = '';
	document.getElementById('console').appendChild(document.createTextNode('Revision_Numbers_Data=' + JSON.stringify(rowRevsCatagorised, null, '\t') + '------' + rowRevsDupExcluded));
	//Now we have the  revision numbers ordered and categorised

	maxRampOfRow = +document.getElementById('maxRamp').value;
	var rowPrevRevVals = document.getElementById('prevRevRow').value.split(",");
	rowPrevRevVals = convertToNums(rowPrevRevVals);
	var rowRevVals = document.getElementById('revRow').value.split(",");
	rowRevVals = convertToNums(rowRevVals);
	var modifiedRowRevVals = rowRevVals;
	var cellRamp = 0;
	var rampOfRow = 0;
	//Now modify the present rev values to stisfy *hard constraints* and then calculate the ramp of the row
	for (var i = 0; i < rowRevVals.length; i++) {
		if (rowRevVals[i] < 0) {
			rowRevVals[i] = 0;
		} else if (rowRevVals[i] > 10) //here 10 is the maximum share value of the constituent 
		{
			rowRevVals[i] = 10;
		}
		cellRamp = rowRevVals[i] - rowPrevRevVals[i];
		rampOfRow += cellRamp;
	}
	//modify the present rev values to stisfy *hard constraints* and ramp of row calculation over
	var rampDiffOfRow = Math.abs(rampOfRow) - maxRampOfRow; //rampDiffOfRow is possitive if rampedUp more than maxRampOfRow
	if (rampDiffOfRow < 0) //then no problem!!!
	{

	} else {
		//sacrificing from bigger revision till smallest revision
		var rampUpByRevCells;
		for (var i = 0; i < rowRevsDupExcluded.length && rampDiffOfRow > 0.1; i++) {
			//Now we can access the columns with a specific revision number			
			var colNums = rowRevsCatagorised[rowRevsDupExcluded[i]].cols;
			//Get the amount of ramp up they have been through
			rampUpByRevCells = 0;
			for (var j = 0; j < colNums.length; j++) {
				//TODO do negative ramped cell segregation and updating the rampUp benifit of rampedUpCells here.
				rampUpByRevCells += rowRevVals[colNums[j]] - rowPrevRevVals[colNums[j]];
			} //amount of rampUp the cells of a particular revision have been through is found out
			//Now make the rev to sacrifice rampUp and update the rampOfRow value.
			//Maximum rampUp sacrifice will be equal to rampUpByRevCells.
			var rampUpToSacrifice = 0;
			if (rampDiffOfRow <= rampUpByRevCells) //Then the row can sacrifice the complete excess ramp up
			{
				rampUpToSacrifice = rampDiffOfRow;
				rampDiffOfRow = 0;
			} else {
				//The row will sacrifice its full rampUp but still the sacrifice to be done is left
				rampUpToSacrifice = rampUpByRevCells;
				rampDiffOfRow = rampDiffOfRow - rampUpByRevCells;
			}
			//Now rampDiffOfRow updated and the rampUpToBeSacrificed by the particular rev cells found out.

			//Now we take the rowPrevRevVals of the particular revision and ramp them all up by the value rampUpByRevCells - rampUpToSacrifice
			var toRampUpPrev = rampUpByRevCells - rampUpToSacrifice;
			do {
				var iterationRampUp = 0;
				//Goto to each colNumber and rampit up till with its rampUpShare but dont ramp up if the value exceeds the desired value.***Note we didnot consider the negative ramp conditions

				//find the columns Ramping up actually
				var colsToRampUp = [];
				for (var k = 0; k < colNums.length; k++) {
					//if the column cell wants to ramp up
					if (rowRevVals[colNums[k]] - rowPrevRevVals[colNums[k]] > 0)
						colsToRampUp.push(colNums[k]);
				}
				//Now we know the columns to ramp up in a particular revision.
				//Now try to distribute the ramp up according to rampUpShare of each cell and update iteration ramp up and toRampUpPrev
				for (var k = 0; k < colsToRampUp.length; k++) {
					var ramptocell = toRampUpPrev * shareincolstorampup(colsToRampUp[k], colsToRampUp); //todo function
					if (ramptocell > rowRevVals[colsToRampUp[k]] - rowPrevRevVals[colsToRampUp[k]]) {
						ramptocell = rowRevVals[colsToRampUp[k]] - rowPrevRevVals[colsToRampUp[k]];
					}
					modifiedRowRevVals[colsToRampUp[k]] = rowPrevRevVals[colsToRampUp[k]] + ramptocell;
					iterationRampUp += ramptocell;
				}
				toRampUpPrev -= iterationRampUp;
			}
			while (toRampUpPrev > 0.1);
		}
	}
	var resString = '';
	for (var k = 0; k < modifiedRowRevVals.length; k++) {
		resString += (modifiedRowRevVals[k] + ',');
	}
	document.getElementById('console').innerHTML = resString;
}

function segregateColumns(rowRevs) {
	var rowRevsCatagorised = {};
	for (var i = 0; i < rowRevs.length; i++) {
		if (!rowRevsCatagorised.hasOwnProperty(rowRevs[i]))
			rowRevsCatagorised[rowRevs[i]] = {
				'cols': new Array()
			};
		rowRevsCatagorised[rowRevs[i]].cols.push(i);
	}
	return rowRevsCatagorised;
}

function getRevNumsinDescOrder(rowRevsCatagorised) {
	var rowRevsDupExcluded = [];
	for (var property in rowRevsCatagorised) {
		if (rowRevsCatagorised.hasOwnProperty(property)) {
			rowRevsDupExcluded.push(property.toString());
		}
	}
	return rowRevsDupExcluded.sort(function(a, b) {
		return b - a
	});
}

function shareincolstorampup(colsToRampUpIndex, colsToRampUp) {
	return 1 / colsToRampUp.length;
}

function convertToNums(arr) {
	var temp = [];
	for (var i = 0; i < arr.length; i++) {
		temp.push(+arr[i]);
	}
	return temp;
}
