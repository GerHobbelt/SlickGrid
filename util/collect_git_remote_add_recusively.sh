#! /bin/bash
#
# recursively collect registered git remotes and
# write them to a shell script for later use on other
# machines (and keeping the info in the repository)
#

wd="$( pwd )";

pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null
utildir="$( pwd )";

# go to root of project
cd ..

wd=$( $utildir/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"
cd "$wd"

if ! test -d "$wd/util" ; then
    mkdir "$wd/util"
fi
dstfile="$wd/util/register_git_remotes_recursive.sh"

echo "dstfile: $dstfile"

cat <<EOT

  Executing a RECURSIVE submodule remotes collection.

EOT

tmpfile=/tmp/util-cgrar-$RANDOM-$RANDOM.list

echo "Entering '.'"                                      > $tmpfile
git remote -v                                           >> $tmpfile
git submodule foreach --recursive $@ git remote -v      >> $tmpfile
cat $tmpfile | gawk -f "$utildir/collect_git_remote_add_recusively.awk" > "$dstfile"
rm $tmpfile

popd                                                                                                    2> /dev/null  > /dev/null
