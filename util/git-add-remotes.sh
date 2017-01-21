#! /bin/bash
#

wd="$( pwd )";

# http://stackoverflow.com/questions/3572030/bash-script-absolute-path-with-osx/3572105#3572105
realpath() {
    [[ $1 = /* ]] && echo "$1" || echo "$wd/${1#./}"
}


pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null
utildir="$( pwd )";

# go to root of project
cd ..

wd=$( $utildir/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"
cd "$wd"


if test "$1" == "-q" ; then
    shift
    quietMode=1
else
    quietMode=0
fi  


if test $# -eq 0 ; then
    cat <<EOT
$0 [-q] [<forks>]

Add any fork names (github users) as additional repository remotes to the current git 
repository, i.e. the git repository which manages the current working directory.

Instead of the <forks> you can specify a JSON file as obtained raw 
from github by specifying its relative or absolute path: it is recognized
as a path just as long as you make sure there's at least one slash '/'
in it.

We also accept other files containing forks info: screengrabs from the github 'Members'
area (useful when the project has more than 1000 forks, which results in github not 
rendering the graph view any more, hence no JSON 'meta' file can be obtained!) and screengrabs
from the github 'Pull Requests' area. In other words: when you specify a non-JSON file,
any line in it with one of the formats below is processed and turned into a remote reference.
(Of course, things won't work out when a 'pull request' comes from someone who changed the
name of their forked repository, as the default repository name will be assumed.):

    #1234 opened on 12 Jan 2345 by username  bla-milestone-bla
    @username User Name / repository


Options:

-q      : No Questions Mode: don't wait for a keypress and barge on immediately.


Example usage:

     util/git_add_remotes.sh tigbro
     util/git_add_remotes.sh tigbro @./network_meta

  which will register git@github.com:tigbro/<current-repo-name>.git and any forks listed in 
  the github metadata file found in ./network_meta

EOT
    rv=1;
else
    rv=0;

    repo=$( $utildir/git_print_repo_info.sh -n )

    if test "$quietMode" != "1" ; then
        cat <<EOT
-------------------------------------------------------------------------------------------
Adding remotes to a git repository:
  $repo

We assume this (git/github) URL points at the remote repository which has previously been 
cloned locally!

  url =         git@github.com:<githubowner>/$repo.git
  destination = $wd 
-------------------------------------------------------------------------------------------
EOT

        echo "(Press ENTER to continue...)";
        read;
    fi

    cd "$wd"

    # add additional forks as remotes:
    while test -n "$1" ; do
        author=$1
        # http://askubuntu.com/questions/299710/how-to-determine-if-a-string-is-a-substring-of-another-in-bash
        if test "${1/\/}" = "$1" ; then
            git remote add ${author} git://github.com/$author/$repo.git
        else
            # network_meta file from github
            networkmeta=$( realpath "$1" )
            if test -d "$networkmeta" && test -e "$networkmeta/.git" ; then
                echo ""
                echo "*** copying remotes from another git directory:   $networkmeta  ***"
                echo ""
                dst=/tmp/g-a-r-tmp-$RANDOM.txt
                pushd "$networkmeta"                                                                                     2> /dev/null  > /dev/null
                git remote -v > $dst
                popd                                                                                                     2> /dev/null  > /dev/null
                node $utildir/git-add-remotes-helper.js $repo $dst | json users | json -a name repo | while read author clonename ; do
                    git remote add ${author} ${clonename}
                done
                rm $dst
            elif test -f "$networkmeta" ; then
                echo ""
                echo "*** networkmeta JSON file:   $networkmeta  ***"
                echo ""
                # http://unix.stackexchange.com/questions/41232/loop-through-tab-delineated-file-in-bash-script
                # This code requires `npm install json -g` (jsontools: http://trentm.com/json/ )
                node $utildir/git-add-remotes-helper.js $repo $networkmeta | json users | json -a name repo | while read author clonename ; do
                    git remote add ${author} git://github.com/$author/$clonename.git
                done
            else
                echo ""
                echo "### ERROR: not a name, nor a JSON file, nor a github remotes dump file, nor another repository directory: ###"
                echo "###    $networkmeta    ###"
                echo ""
            fi
        fi
        shift
    done

    git pull --all
    git fetch --tags
    #git remote -v
fi

popd                                                                                                    2> /dev/null  > /dev/null
