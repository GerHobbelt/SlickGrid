var fs = require('fs');
var process = require('process');


// Expected file format: 
//
//  name (multiple words?)  userid / repository
//
// e.g.:
// usabli.ca usablica / intro.js
// 2089764 2089764 / intro.js
// Christian Chandler 247webdev / Tools-Intro.js
// José Magaña 3pepe3 / intro.js


function readLines(input, func) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
  });
}

function print_em(data) {
  console.log('Line: ' + data);
}

var specfile = process.argv[2];
console.log('input file: ', specfile);

var input = fs.createReadStream(specfile);
readLines(input, print_em);

