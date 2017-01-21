fs = require('fs');

function abortus_provocatus() {
    var ex = new Error();
    ex.special_exit = 666;
    throw ex;
}

try {
    var args = process.argv;
    //console.log(args);
    if (args.length < 4) {
        console.log('### Required arguments: <repo-name> <metafile-or-screengrab-file>');
        throw true;
    }

    var default_repo_name = args[2];
    var file = args[3];

    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        console.log('### Cannot read file: ', file);
        abortus_provocatus();
      }

      // Check if the data is JSON: if it is, pass it through untouched:
      try {
        JSON.parse(data);
        //console.log('ok');
        console.log(data);
      } catch (ex) {
        //console.log(ex);
        
        // Exception means the file format can be either github pullreq screengrab 
        // or github members list format or both (when those screengrabs are pasted together
        // into a single file).
        // 
        // See if we can find any lines of interest...
        // 
        //     #1234 opened on 12 Jan 2345 by username  bla-milestone-bla
        //     @username User Name / repository
        //     
        // or:
        // 
        //     shogun70        git@github.com:shogun70/MathJax.git (fetch) 
        // 
        // (The latter is a `git remote -v` output; handy when we wish to copy remotes from one
        // repo instance into another.)    
        var re_pullreqs = /^\s*#\d+ opened on \d+ [a-zA-Z]+(?: \d+)? by ([^\s]+)/;
        var re_pullreqs1 = /^\s*#\d+ opened on [a-zA-Z]+ \d+(?:, \d+)? by ([^\s]+)/;
        var re_pullreqs2 = /^\s*#\d+ opened \d+ [a-zA-Z]+ ago by ([^\s]+)/;
        var re_memberlist = /^\s*@([^\s]+) [^\/]+\/\s*([^\s]+)\s*$/;  
        var re_gitremote = /^\s*([^\s]+)\s+([^\s]+\.git)\s*\s+\(fetch\)\s*$/;

        var lines = data.replace('\r', '\n').split('\n');
        // Collect the lines matching either of our regexes:
        var m = lines.map(function (l) {
            var m1 = re_pullreqs.exec(l);
            var m1a = re_pullreqs2.exec(l);
            var m1b = re_pullreqs1.exec(l);
            var m2 = re_memberlist.exec(l);
            if (!!m1 + !!m2 + !!m1a + !!m1b >= 2) {
                console.error('### unexpected double/triple match for line: ', l);
                abortus_provocatus();
            }
            if (m1) {
                m1[2] = default_repo_name;
                return m1;
            }
            if (m1a) {
                m1a[2] = default_repo_name;
                return m1a;
            }
            if (m1b) {
                m1b[2] = default_repo_name;
                return m1b;
            }
            if (!m2) {
                m2 = re_gitremote.exec(l);
            }
            return m2;
        }).filter(function (m) {
            return !!m;
        });

        // Each entry in m[] is an array: [1] = username, [2] = reponame

        var dedup = {};
        var users = m.map(function (d) {
            return {
                name: d[1],
                repo: d[2].replace(/^git@github.com:/, "git://github.com/")
            };
        }).filter(function (u) {
            var hash = u.name + '#' + u.repo;
            if (!dedup[hash]) {
                dedup[hash] = true;
                return true;
            }
            return false;
        });

        // Now fake a github 'meta' JSON file:
        var metafile = {
            users: users
        };
        console.log(JSON.stringify(metafile, null, 2));
      }
    });
} catch (ex) {
    if (ex.special_exit !== 666) {
        console.error('### Exception: ', ex);
        console.error('###   Stack: ', ex.stack);
        process.exit(3);
    }
    process.exit(1);
}
