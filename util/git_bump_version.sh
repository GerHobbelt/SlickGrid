#! /bin/bash
#
# bump version in the local package.json file: increment the *prerelease* number (4th element of version number)

wd="$( pwd )";

pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null

# go to root of project
cd ..

wd=$( util/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"
cd "$wd"

if [ -f package.json ]; then
  npm version --no-git-tag-version prerelease
else
  echo "This repo doesn't come with a package.json file"
fi

popd                                                                                                    2> /dev/null  > /dev/null



