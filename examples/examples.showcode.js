/*!
 * @license
 * slickGrid v2.3.18-alpha.1011 (https://github.com/GerHobbelt/SlickGrid)
 * Copyright 2009-2017 Michael Leibman <michael{dot}leibman{at}gmail{dot}com>
 *
 * Distributed under MIT license.
 * All rights reserved.
 */




// Show Code Javascript file.

// Autoload
$('document').ready(function () {
  $('#viewsource').on('click', function () {
    var pretag = $('#displaycode');

    if (pretag.html().length > 0) {
      pretag.toggle();
    } else {
      var scripthtml = $('#script_tag_example').html();
      var escapedScript = pretag.text(scripthtml).html();
      pretag.html('<pre class="prettyprint language-js"><code class="prettyprint">' + escapedScript + '</code></pre>');

      // call google prettify:
      // 
      //     PR.prettyPrint();
      
      pretag.toggle();
    }
   });
});
