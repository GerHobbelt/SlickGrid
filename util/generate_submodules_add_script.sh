#! /bin/bash
#
# generate a shell script which will add all the git submodules to the current repository.
# Such a script is required (or rather commands contained therein) when the submodules
# registration is eff-ed up on your box and the usual way of `git submodule update --init`
# doesn't resolve your troubles.
#
# http://stackoverflow.com/questions/3336995/git-will-not-init-sync-update-new-submodules

wd="$( pwd )";

pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null

# go to root of project
cd ..

wd=$( util/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"

if test -d "$wd/util" ; then
    dstfile="$wd/util/git_add_submodule_references.sh"
else
    dstfile=util/git_add_submodule_references.sh
fi
echo "dstfile: $dstfile"

cat "$wd/.gitmodules" | gawk -f util/generate_submodules_add_script.awk > "$dstfile"

popd                                                                                                    2> /dev/null  > /dev/null
