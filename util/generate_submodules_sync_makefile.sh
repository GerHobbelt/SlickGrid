#! /bin/bash
#
# generate a GNU make makefile which will sync/update all the git submodules to the current repository.
# Such a makefile can speed up the sync process as multiple git pull instances can be executed
# in parallel in an easily managed fashion by running `make -j N` where N is the number of 
# threads.

wd="$( pwd )";

pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null

# go to root of project
cd ..

wd=$( util/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"

if test -d "$wd/util" ; then
    dstfile="$wd/util/Makefile"
else
    dstfile=util/Makefile
fi
echo "dstfile: $dstfile"

cat "$wd/.gitmodules" | gawk -f util/generate_submodules_sync_makefile.awk > "$dstfile"
pwd > /tmp/sync_submods.list
git submodule foreach --recursive pwd >> /tmp/sync_submods.list


popd                                                                                                    2> /dev/null  > /dev/null
