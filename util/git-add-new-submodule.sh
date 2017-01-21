#! /bin/bash
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
    if test -z $repoOwner ; then
        repoOwner=$( git config --get github.user )
        if test -z $repoOwner ; then
            repoOwner=$( git config --global --get github.user )
            if test -z "$repoOwner"; then
                repoOwner=GerHobbelt
            fi
        fi
    fi
    echo "$repoOwner"
}


pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null
utildir="$( pwd )";

# go to root of project
cd ..

wd=$( $utildir/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"
cd "$wd"

# when the commandline starts with '-me' or '--me' then the repoOwner is NOT assumed to match 
# the one of the repo you're currently standing in:
if test "$1" == "-m" -o "$1" == "-me" -o "$1" == "--me" ; then
    shift
    repoOwner=$( getRepoOwner "whoami" );
else
    repoOwner=$( getRepoOwner );
fi  

if test -z "$2" ; then
    cat <<EOT
$0 [-m|-me|--me] <repo-name> <destination-directory> [<original-author> [<forks>]]

Add a NEW submodule to the set of submodules.

Also adds the <username>-original remote reference to this submodule.

When any fork names (github users) are listed, these are added as
additional repository remotes.

Instead of the <forks> you can specify a JSON file as obtained raw 
from github by specifying its relative or absolute path: it is recognized
as a path just as long as you make sure there's at least one slash '/'
in it.

<repo-name> can be any of these formats:

  repo-name
  repo-owner/repo-name
  git@github.or.else.com:repo-owner/repo-name
  git://github.com/repo-owner/repo-name

where 'repo-owner' is the remote owner (default: '$repoOwner') which owns
the remote repository from which you clone; the 'repo-owner' will also be the
target for any 'git push'.

Note:
  When the commandline starts with '-m', '-me' or '--me' then the repo-owner is
  NOT assumed to match the one of the repo you're currently standing in; instead
  we'll only look at the local git user.

  Right now, with your current commandline, the repo-name will be:

      $repoOwner


Example usage:

     util/git_add_submodule.sh jasmine-ui lib/jasmine-ui tigbro
     util/git_add_submodule.sh jasmine-ui lib/jasmine-ui tigbro @./network_meta

  which will register the git@github.com:$repoOwner/jasmine-ui.git remote repository as a git
  submodule in the local directory lib/jasmine-ui, while git@github.com:tigbro/jasmine-ui.git
  is registered as the original author git-remote (and any forks listed in the github
  metadata file found in ./network_meta are registered as git remotes as well): this allows
  us to easily sync/update our fork/clone from the original and other forks using a simple
  'git pull --all' command (or even easier: by running the git_pull_push.sh script).
  
EOT
    exit 0;
fi

repo=$( echo $1 | sed -e 's/.*\///' -e 's/\.git$//' )
githubowner=$( echo /$1 | sed -e 's/\/.*//' -e 's/.*://' -e 's/.*\///' )
giturl=$1
dstdir=$2
author=$3

# check if the specified repository is a git URL or simply a repo name: in the latter case the URL is constructed for you.
#
# http://askubuntu.com/questions/299710/how-to-determine-if-a-string-is-a-substring-of-another-in-bash
if test "${giturl/:}" = "$giturl" ; then
    if test -z $githubowner ; then
        githubowner=$repoOwner
    fi
    giturl=git@github.com:$githubowner/$repo.git
fi

    cat <<EOT
-------------------------------------------------------------------------------------------
Registering as a git submodule:
  $repo

We assume this (git/github) URL points at the remote repository which will (a) be cloned,
and (b) be referenced as the default 'git push' remote, so you'ld better have collaborator
or owner rights there, buddy! ('git push' directly or via the 'git_pull_push.sh' script...)
  
  url =         $giturl
  owner =       $githubowner
  destination = $dstdir 
-------------------------------------------------------------------------------------------
EOT

if test -d $dstdir ; then
    cat <<EOT

### WARNING ###

Destination directory [$dstdir] already exists. 
Cannot clone a submodule into an existing directory!

Instead, we'll register the listed 'original author' and further remotes ('forks')
with the existing repository.
-------------------------------------------------------------------------------------------
EOT
fi

echo "(Press ENTER to continue...)";
read;

pwd
echo git submodule add $giturl $dstdir
git submodule add $giturl $dstdir

# make sure the submodule is *initialized*
if test -d "$dstdir" && ! test -f "$dstdir/.git" ; then
  echo "(Initializing submodule first...)";
  git submodule update --init "$dstdir"
  if test -d "$dstdir" ; then
    pushd "$dstdir"                                                                                        2> /dev/null  > /dev/null
    git checkout master
    popd                                                                                                   2> /dev/null  > /dev/null
  fi
fi

# by now we should have fully installed submodule ready for us, one way or another:
if test -d "$dstdir" && test -f "$dstdir/.git" ; then
    cd "$dstdir"

    if test -n "$author" ; then
        git remote add "${author}-original" "git@github.com:$author/$repo.git"

        # add additional forks as remotes:
        shift 3

        if test $# -gt 0 ; then
            "$utildir/git-add-remotes.sh" -q "$@"
        fi
    fi

    git pull --all
    git fetch --tags
else
    cat <<EOT

** ERROR **

Failed to instantiate the local submodule clone!

EOT
fi

popd                                                                                                    2> /dev/null  > /dev/null
