#! /bin/bash
#
# pick version from the local package.json file and apply it to git tag command

wd="$( pwd )";

pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null

# go to root of project
cd ..

wd=$( util/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"
cd "$wd"

if [ -f package.json ]; then
  node -e 'var pkg = require("./package.json"); console.log(pkg.version);' | xargs git tag
else
  echo "This repo doesn't come with a package.json file"
fi

popd                                                                                                    2> /dev/null  > /dev/null



