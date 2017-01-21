#!/bin/bash
#
# dump the current git revision commit hash, etc. in a file for use by the software
#

wd="$( pwd )";

pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null

# go to root of project
cd ..

wd=$( util/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"
cd "$wd"

rm -f HEAD.HASH
gitbranch=$( git rev-parse --abbrev-ref HEAD )
commithash=$( git rev-parse --short HEAD )

# write as JSON file:
cat > HEAD.HASH <<EOT
{
    "git_branch": "$gitbranch",
    "commit_hash": "$commithash"
}
EOT






popd                                                                                                    2> /dev/null  > /dev/null

