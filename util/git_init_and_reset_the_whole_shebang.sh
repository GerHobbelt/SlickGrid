#! /bin/bash
#
# Run this script to init and RESET everything in the project.
# THIS MEANS THAT YOU WILL LOOSE ALL CHANGES WHICH HAVEN'T BEEN COMMITTED INTO THE PROJECT REPOSITORY OR ANY OF THE SUBMODULES!
#

wd="$( pwd )";

pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null

# go to root of project
cd ..
wd=$( util/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"
cd "$wd"

getopts ":ifxlsh" opt
#echo opt+arg = "$opt$OPTARG"
case "$opt$OPTARG" in
i )
    echo "*** First, we RESET the project..."
    git reset --hard

    echo "*** Then, we make sure that all submodules are RESET as well..."
    git submodule foreach --recursive git reset --hard

    echo "*** ... and each one of 'em is synced with the correct URL."
    git submodule sync
    git submodule foreach --recursive git submodule sync

    echo "*** All done. This should have you close enough to the last GIT state."
    ;;

f )
    echo "*** First, we RESET the project..."
    git reset --hard

    echo "*** Then, we make sure that all submodules have been properly registered..."
    util/git_add_submodule_references.sh

    echo "*** ... and that they have all been updated to the latest, complete, state of affairs..."
    git submodule update --init --recursive

    echo "*** ... and each one of 'em is synced with the correct URL."
    git submodule foreach --recursive git submodule sync
    git submodule sync
    git submodule update --init --recursive

    echo "*** ... Next, we 'upgrade' each submodule by checking out the main branch and PULLing the latest..."
    util/git_checkout_submodules_head.sh
    # we also make sure there's no fuss with the pull by first RESETting each repo:
    $(dirname $0)/util/git_pull_push.sh -p git reset --hard

    echo "*** ... and finally we make sure each submodule is moved to the commit which is linked with the current commit in the main project."
    git submodule update --recursive

    echo "*** All done. Now you are EXACTLY at the state of the last GIT commit!"
    ;;

x )
    echo "*** Before we start, we run a little backup..."
    f=backup-before-re-init-$( date '+%Y%m%d-%H%M%S' | sed -e 's/\\s*//g' ).tar.gz
    if test -f "../$f" ; then
        rm -f "../$f"
    fi
    echo "*** ... which we store here: ../$f"
    tar cvzf "../$f" $( find . -maxdepth 1 ! -name '.git' )

    echo "*** Now we blow away EVERYTHING that isn't a GIT repository file..."
    find . -type f ! -path '*/.git*' -a ! -path '.' -a ! -path './.*' -exec rm -f "{}" \;


    echo "*** Now we run the GIT GARBAGE COLLECTOR in its most aggressive mode. This will destroy all major cruftiness in the git repositories."
    git submodule foreach --recursive git gc --prune=2018-08-08 --aggressive

    echo "*** We run the GIT FSCK 'repository check' on all of 'em. Some tree warnings are to be expected, unfortunately..."
    git submodule foreach --recursive git fsck --full --unreachable --strict


    echo "*** Then, we RESET the project..."
    git reset --hard

    echo "*** Then, we make sure that all submodules have been properly registered..."
    util/git_add_submodule_references.sh

    echo "*** ... and they have all been updated to the latest, complete, state of affairs..."
    git submodule update --init --recursive

    echo "*** ... and each one of 'em is synced with the correct URL."
    git submodule foreach --recursive git submodule sync
    git submodule sync
    git submodule update --init --recursive

    echo "*** ... Next, we 'upgrade' each submodule by checking out the main branch and PULLing the latest..."
    util/git_checkout_submodules_head.sh
    # spring cleaning, round #2
    $(dirname $0)/util/git_pull_push.sh -c
    # we also make sure there's no fuss with the pull by first RESETting each repo:
    $(dirname $0)/util/git_pull_push.sh -p git reset --hard

    echo "*** ... and finally we make sure each submodule is moved to the commit which is linked with the current commit in the main project."
    git submodule update --recursive


    echo "*** All done. You should now have a squeaky clean repository environment! Virginal territory all."
    ;;

l )
    echo "*** VM Client: point 'origin' for each repo to local VM Host directory where a mirror close set of all the repo's exists."
    for (( i=OPTIND; i > 1; i-- )) do
      shift
    done
    echo full - args: $@


    ;;

s )
    echo "*** VM Server/Host: set all git repo's up with config 'receive.denyCurrentBranch = warn'"
    util/VM_Win7_host_allows_git_push_from_VM_client.sh
    ;;

* )
    cat <<EOT
$0 [-i | -f | -x | -l | -s]

GIT INIT and GIT RESET everything in the project.

THIS MEANS THAT YOU WILL LOOSE ALL CHANGES WHICH HAVEN'T BEEN COMMITTED
      INTO THE PROJECT REPOSITORY OR ANY OF THE SUBMODULES!

-i       : 'the basics, size S': run a complete 'git reset' on everything.
           Run this one when the panic hits: "Am I really where I'm
           supposed to be?!"
           --Fast--

-f       : 'size L': a full 'git reset' and the insurance that all
           submodules have been initialized and loaded completely.
           Run this one when paranoia takes over and [-i] above doesn't
           feel like it will deliver. You can take this one to the bank.
           The Sure Thing.
           --Slow--

-x       : 'size XXL': everything above ...
           PLUS a complete GIT GARBAGE COLLECT run, including a full
                pruning and systems check...
           PLUS a 1-8-7 on anything that moves and all that are still,
           i.e. 'Hiroshima mode': before refetching everything from the
           GIT repositories, this bugger will NUKE every file in here with
           extreme prejudice: we do not care whether you had it checked in
           or not; after this one, it's GONE if it's not already in the
           GIT repository!
           This one should be executed once in a while anyway, just to
           ensure everything is truly shipshape...

               Unless you're a real hero, the key phrase here is "backup".
               When this one has finished, you'll know what I meant... ;-)

           --Lethargically Slow--
           My Pet Snail Will Have Arrived In Timbuktu Before This One Is Done!

-l <rootdir>
         : set up the git repo (and submodules) for a Virtual Machine Client, i.e.
           point the 'origin' remote to the local directory
           (default root: /media/sf_D_DRIVE/h/prj/1original/SlickGrid/SlickGrid/)

-s       : set up the git repo (and submodules) for a Virtual Machine Host, i.e.
          make sure the git repo config has 'receive.denyCurrentBranch = warn' set
          to allow any VM client (who ran the '-l' option of this script) to
          'git push' their edits into us ~our local repository. This (together with
          '-l') helps us work with big dev machines in a Internet-challenged
          situation, i.e. where you don't have remote access to github.

-h       : This 'help' description.



                       !!! BIG FAT WARNING !!!

    The [-x] run mode will NUKE EVERYTHING AND ANYTHING THAT HAS NOT
         BEEN 'CHECKED IN' I.E. HAS NOT BEEN COMMITTED TO GIT.

            ALL YOUR 'EXTRA' FILES WILL BE GONE. FOREVER.

  IFF you have a properly set up 'UNIX'-like environment with a working 'tar',
  'date' and 'sed' command, then you MAY be able to recover all that cruft
  you just lost from the specially created 'backup-before-re-init***.tar.gz'
  archive, but don't get your hopes up yet...

EOT
    ;;

esac


popd                                                                                                    2> /dev/null  > /dev/null

