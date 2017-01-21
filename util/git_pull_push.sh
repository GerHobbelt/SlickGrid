#! /bin/bash

wd="$( pwd )";

pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null

# go to root of project
cd ..

wd=$( util/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"
cd "$wd"


getopts ":RcCfFqQpPwWlsh" opt
#echo opt+arg = "$opt$OPTARG"
case "$opt$OPTARG" in
"?" )
  echo "--- pull/push every git repo in this directory tree ---"
  #echo full - args: $@
  for f in $( find . -name '.git' ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    f=$( dirname "$f" )
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    git fetch --all --tags                                                2>&1
    git pull --ff-only                                                    2>&1
    git push --all --follow-tags                                          2>&1
    git push --tags                                                       2>&1
    popd                                                                  2> /dev/null  > /dev/null
  done
  ;;

f )
  echo "--- pull/push the git repo and its submodules ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@
  for f in $( git submodule foreach --recursive --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    git fetch --all --tags                                                2>&1
    git pull --ff-only                                                    2>&1
    git push --all --follow-tags                                          2>&1
    git push --tags                                                       2>&1
    popd                                                                  2> /dev/null  > /dev/null
  done
  echo processing MAIN REPO: $wd
  $@
  git fetch --all --tags                                                  2>&1
  git pull --ff-only                                                      2>&1
  git push --all --follow-tags                                            2>&1
  git push --tags                                                         2>&1
  ;;

F )
  echo "--- pull/push the git repo and its immediate submodules ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@
  for f in $( git submodule foreach --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    git fetch --all --tags                                                2>&1
    git pull --ff-only                                                    2>&1
    git push --all --follow-tags                                          2>&1
    git push --tags                                                       2>&1
    popd                                                                  2> /dev/null  > /dev/null
  done
  echo processing MAIN REPO: $wd
  $@
  git fetch --all --tags                                                  2>&1
  git pull --ff-only                                                      2>&1
  git push --all --follow-tags                                            2>&1
  git push --tags                                                         2>&1
  ;;

q )
  echo "--- pull/push the git submodules only ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@
  for f in $( git submodule foreach --recursive --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    git fetch --all --tags                                                2>&1
    git pull --ff-only                                                    2>&1
    git push --all --follow-tags                                          2>&1
    git push --tags                                                       2>&1
    popd                                                                  2> /dev/null  > /dev/null
  done
  ;;

Q )
  echo "--- pull/push the git submodules only ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@
  for f in $( git submodule foreach --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    git fetch --all --tags                                                2>&1
    git pull --ff-only                                                    2>&1
    git push --all --follow-tags                                          2>&1
    git push --tags                                                       2>&1
    popd                                                                  2> /dev/null  > /dev/null
  done
  ;;

p )
  echo "--- pull the git repo and its submodules ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@
  for f in $( git submodule foreach --recursive --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    git fetch --all --tags                                                2>&1
    git pull --ff-only                                                    2>&1
    popd                                                                  2> /dev/null  > /dev/null
  done
  echo processing MAIN REPO: $wd
  $@
  git fetch --all --tags                                                  2>&1
  git pull --ff-only                                                      2>&1
  ;;

P )
  echo "--- pull the git repo and its immediate submodules ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@
  for f in $( git submodule foreach --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    git fetch --all --tags                                                2>&1
    git pull --ff-only                                                    2>&1
    popd                                                                  2> /dev/null  > /dev/null
  done
  echo processing MAIN REPO: $wd
  $@
  git fetch --all --tags                                                  2>&1
  git pull --ff-only                                                      2>&1
  ;;

w )
  echo "--- push the git repo and its submodules ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@
  for f in $( git submodule foreach --recursive --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    git push --all --follow-tags                                          2>&1
    git push --tags                                                       2>&1
    popd                                                                  2> /dev/null  > /dev/null
  done
  echo processing MAIN REPO: $wd
  $@
  git push --all --follow-tags                                            2>&1
  git push --tags                                                         2>&1
  ;;

W )
  echo "--- push the git repo and its immediate submodules ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@
  for f in $( git submodule foreach --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    git push --all --follow-tags                                          2>&1
    git push --tags                                                       2>&1
    popd                                                                  2> /dev/null  > /dev/null
  done
  echo processing MAIN REPO: $wd
  $@
  git push --all --follow-tags                                            2>&1
  git push --tags                                                         2>&1
  ;;

R )
  echo "--- RESET the git repo and its submodules ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@

  # reset main project first to (possibly) restore the submodules to their intended commit position before we reset them
  git reset --hard                                                        2>&1
  for f in $( git submodule foreach --recursive --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo RESET-ting PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    git reset --hard                                                      2>&1
    popd                                                                  2> /dev/null  > /dev/null
  done
  echo RESET-ing MAIN REPO: $wd
  $@
  git reset --hard                                                        2>&1
  ;;

l )
  echo "--- pull/push the git repo (and its submodules, where necessary) ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo $@
  $@
  git fetch --all --tags --recurse-submodules=on-demand                   2>&1
  git pull --ff-only --recurse-submodules=on-demand                       2>&1
  # report which submodules need attention (they will be done automatically, but it doesn't hurt to report them, in case things go pearshaped)
  git push --all --follow-tags --recurse-submodules=check                 2>&1
  git push --all --recurse-submodules=on-demand                           2>&1

  # even when the above commands b0rk, pull/push this repo anyway
  git fetch --all --tags                                                  2>&1
  git pull --ff-only                                                      2>&1
  git push --all --follow-tags                                            2>&1
  git push --tags                                                         2>&1
  ;;

c )
  echo "--- clean up the git submodules remote references etc. ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@
  for f in $( git submodule foreach --recursive --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    # http://kparal.wordpress.com/2011/04/15/git-tip-of-the-day-pruning-stale-remote-tracking-branches/
    # http://stackoverflow.com/questions/13881609/git-refs-remotes-origin-master-does-not-point-to-a-valid-object
    git gc
    git fsck --full --unreachable --strict
    git reflog expire --expire=0 --all
    git repack -d
    git repack -A
    #git update-ref
    git gc --aggressive --prune=all
    git remote update --prune
    git remote prune origin
    popd                                                                  2> /dev/null  > /dev/null
  done
  echo processing MAIN REPO: $wd
  $@
  git gc
  git fsck --full --unreachable --strict
  git reflog expire --expire=0 --all
  git repack -d
  git repack -A
  #git update-ref
  git gc --aggressive --prune=all
  git remote update --prune
  git remote prune origin
  ;;

C )
  echo "--- clean up the immediate git submodules remote references etc. ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@
  for f in $( git submodule foreach --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    # http://kparal.wordpress.com/2011/04/15/git-tip-of-the-day-pruning-stale-remote-tracking-branches/
    # http://stackoverflow.com/questions/13881609/git-refs-remotes-origin-master-does-not-point-to-a-valid-object
    git gc
    git fsck --full --unreachable --strict
    git reflog expire --expire=0 --all
    git repack -d
    git repack -A
    #git update-ref
    git gc --aggressive --prune=all
    git remote update --prune
    git remote prune origin
    popd                                                                  2> /dev/null  > /dev/null
  done
  echo processing MAIN REPO: $wd
  $@
  git gc
  git fsck --full --unreachable --strict
  git reflog expire --expire=0 --all
  git repack -d
  git repack -A
  #git update-ref
  git gc --aggressive --prune=all
  git remote update --prune
  git remote prune origin
  ;;

s )
  echo "--- for all submodules + base repo: set upstream ref for each local branch and push the repo ---"
  for (( i=OPTIND; i > 1; i-- )) do
    shift
  done
  #echo args: $@
  for f in $( git submodule foreach --recursive --quiet pwd ) ; do
    pushd .                                                               2> /dev/null  > /dev/null
    echo processing PATH/SUBMODULE: $f
    cd $f
    #echo $@
    $@
    # https://github.com/Visyond/visyond/wiki/Using-GIT-~-handy-commands-and-general-policies
    git push -u origin --all
    popd                                                                  2> /dev/null  > /dev/null
  done
  echo processing MAIN REPO: $wd
  $@
  git push -u origin --all
  ;;

* )
  cat <<EOT
$0 [-c] [-f] [-l] [-p] [-q] [-R] [-s] [args]

pull & push all git repositories in the current path.

-l       : 'lazy': let git (1.8+) take care of pushing all submodules' changes
           which are relevant: this is your One Stop Push Shop.
           (Also performs a 'pull --all' before pushing.)
-f       : only pull/push this git repository and the git submodules.
-F       : only pull/push this git repository and the top level git submodules.
-q       : pull/push all the git submodules ONLY (not the main project).
-Q       : pull/push all the top level git submodules ONLY (not the main project).
-p       : only PULL this git repository and the git submodules.
-P       : only PULL this git repository and the top level git submodules.
-w       : only PUSH this git repository and the git submodules.
-W       : only PUSH this git repository and the top level git submodules.
-c       : cleanup git repositories: run this when you get
           error 'does not point to valid object'
-C       : cleanup top level git repositories: run this when you get
           error 'does not point to valid object'
-s       : setup/reset all upstream (remote:origin) references for each
           submodule and push the local repo. This one ensures a 'git push --all'
           will succeed for each local branch the next time you run that
           command directly or indirectly via, e.g. 'util/git_pull_push.sh -f'
-R       : HARD RESET this git repository and the git submodules. This is useful
           to sync the working directories after you ran the VM_push/pull script
           in your VM.

<no opt> : pull/push ANY git repository find in the current directory tree.

When further commandline [args] are specified, those are treated as a command
and executed for each directory containing a git repository. E.g.:

  $0 git commit -a

will execute a 'git commit -a' for every git repository.

EOT
  ;;
esac


popd                                                                                                    2> /dev/null  > /dev/null



