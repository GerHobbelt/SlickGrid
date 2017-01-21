#! /bin/bash
#
# check the remotes and see if github can help us discover who of them did actually any work on SlickGrid (graph view in github is 
# NIL as there are too many forks; the key here is to discover which forks actually contain any new work at all).
# 
# To protect myself from leaking my credentials into the repo (that would a security goof of the first order!) parameter 1
# of this script should be the user:pass as required by github basic auth / curl.
#



wd="$( pwd )";


# How to obtain the default repository owner?
# -------------------------------------------
# 
# 1. extract the name of the owner of the repository your currently standing in
# 2. if that doesn't work, get the locally configured github user as set up in the git repository you're standing in
# 3. if that doesn't work, get the local system globally configured github user
# 4. okay, nothing works. So you must be GerHobbelt on a fresh machine, right?
# 
# Note: the RE is engineered to eat ANYTHING and only extract username from legal git r/w repository URLs (git@github.com:user/repo.git)
# Note: this RE should work with BSD/OSX sed too:  http://stackoverflow.com/questions/12178924/os-x-sed-e-doesnt-accept-extended-regular-expressions
getRepoOwner() {
    repoOwner=""
    if test -z "$1" ; then
        repoOwner=$( git config --get remote.origin.url | sed -E -e 's/^[^:]+(:([^\/]+)\/)?.*$/\2/' )
    fi
    if test -z "$repoOwner" ; then
        repoOwner=$( git config --get github.user )
        if test -z "$repoOwner" ; then
            repoOwner=$( git config --global --get github.user )
            if test -z "$repoOwner"; then
                repoOwner=GerHobbelt
            fi
        fi
    fi
    echo "$repoOwner"
}



pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null

# go to root of project
cd ..

wd=$( util/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"

cd "$wd"


repoOwner=$( getRepoOwner );

fastMode=0

while getopts ":mu:fh" opt ; do
    echo "opt+arg = $opt / $OPTARG"
    case "$opt" in
    "h" )
      cat <<EOT
$0 [-f] [-m] [-u UserName]

analyze the registered git remotes and only keep those which are actually still alive AND do
have 'own work' in them, i.e. only keep the remotes (forks) where someone did some work, rather
than simply forking as a means to clone the parent repository.

-u       : github username to use (default is taken from the repository you're currently standing in

-p       : github password to use

-f       : fast scan, i.e. do not git pull from the server before we run the analysis

EOT
      popd                                                                                                    2> /dev/null  > /dev/null
      exit
      ;;

    m )
      echo $( getRepoOwner "whoami" );
      repoOwner=$( getRepoOwner "whoami" );
      echo $repoOwner;
      ;;

    u )
      repoOwner="$OPTARG"
      ;;

    f )                     
      echo 'fast mode enabled!'
      fastMode=1
      ;;
  
    * )
      echo "--- checkout git submodules to master / branch ---"
      ;;
    esac
done


if test -z "$repoOwner" ; then
  echo "ERROR: no github user specified; run script with '-h' parameter to get help"
  exit
fi

cat <<EOT
-------------------------------------------------------------------------------------------
Going to run this script with these github credentials:
  
  user =      $repoOwner
-------------------------------------------------------------------------------------------
EOT

echo "(Press ENTER to continue...)";
read;


echo "Updating the local repo for all remotes..."
if test $fastMode -eq 0 ; then
  git fetch --all --tags
  #git fetch --all
fi



echo "Find out which clones have no personal work, i.e. are fruitless, and remove them..."
# *some* commands cannot execute safely on Windows as even in BASH there we may run out
# of commandline space, so we take a slightly round-about way sometimes in here in order
# to prevent (very) large sets of commandline arguments to break this script!
# 
# Hence we use a few temporary files, which collect remotes, etc.

# collect the set of registered remotes:
#
# Note: use `sed /expr/d` instead of multiple `grep -v` invocations: less piping = faster
# 
# do not concern ourselves with the 'origin' remote, nor with any remotes titled XYZ-original
# nor the remote owned by Yours Truly, who-ever you are!  ;-)
# 
# Do NOT SORT the remotes: "first come first serve" applies to the historic order 
# in which these remotes were added!
git remote -v | grep -e " (fetch)" | sed -e 's/[ \t].*//' | sed -e '/origin/d' -e "/$repoOwner/d" > ___42_all_remotes___

# create empty file:
echo x > ___42_check_remotes_1__
rm -f ___42_check_remotes_1__
touch ___42_check_remotes_1__

# create empty file:
echo x > ___42_delete_remotes__
rm -f ___42_delete_remotes__
touch ___42_delete_remotes__

# start a file to track the remotes to keep:
echo "$repoOwner"  > ___42_keep_remotes__
echo original     >> ___42_keep_remotes__
echo origin       >> ___42_keep_remotes__

# for f in $( cat ___42_all_remotes___ ) ; do
#   cnt1=$( git rev-list --all -g  --author=$f --count )
#   cnt2=$( git rev-list --all -g  --committer=$f --count )
#   num=$(($cnt1 + $cnt2)) 
#   echo "User: $f   :: counts: $cnt1 + $cnt2    = $num  (>= 1 means KEEP)"
#
#   # Keep any remote which has committed/authored any work:
#   if test $num -gt 0 ; then
#     echo "$f"     >> ___42_keep_remotes__
#   else
#     # check if remote has any brnaches at all: early detection of empty repositories!
#     cnt3=$( git branch -a | grep -e "\/$f\/" | wc -l )
#     if test $cnt3 -gt 0 ; then
#       echo "$f"     >> ___42_check_remotes_1__
#     else
#       echo "Empty repository for remote  $f  ==> TO-BE-DELETED"
#       echo "$f"     >> ___42_delete_remotes__
#     fi
#   fi
# done
cat ___42_all_remotes___ >  ___42_check_remotes_1__


# create empty file:
echo x > ___42_check_remotes_2__
rm -f ___42_check_remotes_2__
touch ___42_check_remotes_2__

# When the counts say we got to discard the user, it MAY be that he/she is a *team*
# or their email doesn't match their github username at all:
for f in $( cat ___42_check_remotes_1__ ) ; do
  # check for each of the user's branches if the head commit exists in any other branches
  # which are not his/hers: if the commit does not, we know there's custom work
  # done in that branch.
  # 
  # This tackles the hairy problem of github 'usernames' which represent *groups*
  # and hence do never show up as committer or author of any commit!
  
  keep=0
  inspect_more=0
  # make sure the user regex doesn't start with a dash '-', which would confuse grep:
  for b in $( git branch -a | grep -e "\/$f\/" ) ; do
    echo "Is branch $b contained in any other branch from anyone else? ..."
    dups=$( git branch -a --contains $( git rev-list $b | head -1 ) | grep -v -e "\/$f\/" | wc -l )
    echo "Count: $dups  (=0 means KEEP)"
    #git branch -a --contains $( git rev-list $b | head -1 ) | sed -e '/original/d' -e "/\/$repoOwner\//d" -e "/\/$f\//d"    | sed -e 's/remotes\///' -e 's/\/.*//' | sort | uniq
    if test $dups -eq 0 ; then
      keep=1
      break
    else
      inspect_more=1
    fi
  done
  
  # when *either* there were no branches in the remote (this happens for
  # *empty* repositories -- we've encountered such *forks*, yes!) *or*
  # _all_ branch heads were found to exist in others' repositories as well,
  # *then* do we consider to discard the given remote: we MAY be throwing 
  # away a parent repo which itself was a fork of the original, but alas:
  # when it doesn't contain any original work by itself any more, then 
  # a fork of this fork is good enough to keep; we can always re-add the 
  # repo remote at some later point in time and rerun this analysis: maybe
  # they have something new and unique then!
  # 
  # However, if the remote does have some branches that didn't check out
  # as 'unique' yet, we need to do a little more work before we finally can
  # decide to discard the remote entirely!            (inspect_more > 0)
  if test $keep -gt 0 ; then
    echo "$f"     >> ___42_keep_remotes__
  elif test $inspect_more -gt 0 ; then
    echo "$f"     >> ___42_check_remotes_2__
  else
    echo "No unique work found in repository for remote  $f  ==> TO-BE-DELETED"
    echo "$f"     >> ___42_delete_remotes__
  fi
done



# First come, first serve: the first remote we find to have a branch head
# which is UNIQUE to the entire collection of currently known 
# 'to-be-discarded' remotes is the one who is considered 'owner' of that 
# work and thus will stay around after all!
for f in $( cat ___42_check_remotes_2__ ) ; do
  # check for each of the user's branches if the head commit exists in any branches
  # which belong to currently known-to-be-kept remotes: if the commit does not, we know there's custom work
  # done in this branch: "first come, first serve" means the user $f is now 
  # considered the owner of this work!
  # 
  # This tackles the hairy problem of github 'usernames' which represent *groups*
  # and hence do never show up as committer or author of any commit!
  
  keep=0
  # make sure the user regex doesn't start with a dash '-', which would confuse grep:
  for b in $( git branch -a | grep -e "\/$f\/" ) ; do
    echo "Is branch $b contained in any branch from known-to-keep users? ..."
    dups=$( git branch -a --contains $( git rev-list $b | head -1 ) | grep -f ___42_keep_remotes__ | wc -l )
    echo "Count: $dups"
    if test $dups -eq 0 ; then
      keep=1
      # immediately add this remote to the known-to-keep list so that we will only
      # keep one remote of many when all of that set are currently in the 
      # 'to-be-removed' collection: by adding the current remote to the
      # 'known-to-keep' collection as soon as possible, the next remote(s)
      # won't get added as well for the same reasons: they will be added when
      # *they* also prove to carry yet-unknown work!
      break
    fi
  done
  
  if test $keep -gt 0 ; then
    echo "$f"     >> ___42_keep_remotes__
  else
    echo "No unique work found in repository for remote  $f  ==> TO-BE-DELETED"
    echo "$f"     >> ___42_delete_remotes__
  fi
done


# The list which remains is the list of remotes which SHOULD be removed:
for f in $( cat ___42_delete_remotes__ ) ; do
  echo "Repo does not contain any new work:    $f"
  git remote rm $f
done


# cleanup?
rm -f ___42_*__



popd                                                                                                    2> /dev/null  > /dev/null


