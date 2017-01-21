#! /bin/bash

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
  if test -z "$repoOwner" -a -z "$2" ; then
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




wd="$( pwd )";

pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null

# go to root of project
cd ..

wd=$( util/print-git-repo-base-directory.sh "$wd" )
#echo "git repository base directory: $wd"

cd "$wd"



rv=0;

if test $# = 0 ; then
  cat <<EOT

ERROR: no commandline command option has been specified. Run 
  $0 -h
to see the online help for this utility script.

EOT
  rv=2;
else
  while getopts ":hdnuombBcCp" opt ; do
    #echo opt+arg = "$opt$OPTARG"
    case "$opt$OPTARG" in
    d )
      pwd
      ;;

    o )
      echo $( getRepoOwner );
      ;;

    m )
      echo $( getRepoOwner "whoami" );
      ;;

    u )
      git config --get remote.origin.url
      ;;

    n )
      git config --get remote.origin.url | sed -e 's/.*\///' -e 's/\.git//'
      ;;

    B )
      bn=$( git rev-parse --verify --symbolic-full-name @ );
      if test -z "$bn" || test "$bn" = "HEAD" ; then
        rv=4;
      else
        echo "$bn";
      fi
      ;;

    b )
      bn=$( git rev-parse --verify --symbolic-full-name @ );
      if test -z "$bn" || test "$bn" = "HEAD" ; then
        bn=$( git rev-parse --verify @ );
      fi
      if test -z "$bn" ; then
        rv=4;
      else
        echo "$bn";
      fi;
      ;;

    C )
      bn=$( git rev-parse --verify --abbrev-ref HEAD );
      if test "$bn" = "HEAD" ; then
        rv=4;
      else
        echo "$bn";
      fi
      ;;

    c )
      bn=$( git rev-parse --verify --abbrev-ref @ );
      if test -z "$bn" || test "$bn" = "HEAD" ; then
        bn=$( git rev-parse --short --verify @ );
      fi
      if test -z "$bn" ; then
        rv=4;
      elif test "$bn" = "HEAD" ; then
        rv=4;
      else
        echo "$bn";
      fi;
      ;;

    P )
      bn=$( git rev-parse --short --verify @ );
      if test -z "$bn" ; then
        rv=4;
      else
        echo "$bn";
      fi;
      ;;

    p )
      bn=$( git rev-parse --verify @ );
      if test -z "$bn" ; then
        rv=4;
      else
        echo "$bn";
      fi;
      ;;

    h )
      cat <<EOT

$0 <command-option>

Print info about the GIT repository you're currently standing in.

Command Options:

-d      : Print the repository's base directory as an absolute path

-n      : Print the git repository NAME

-u      : Print the git repository URL  

-o      : Print the git repository OWNER's name

-m      : Print YOUR github username.
          This is what you'll get when using this '-m' parameter with the 
          'util/git-add-new-submodule.sh' utility script.

-b      : Print the currently checked out BRANCH name (symbolic) or commit hash.
          A 'commit hash' is printed if you are checked out to a specific commit 
          which does NOT have branch label name, i.e. you're running in 'detached HEAD' mode!

-B      : Like '-b', but returns error (error code: 4) when running in 'detached HEAD' mode 
          as described above.

-c / -C : same as '-b' and '-B' respectively, but print the 'short' branch name / commit ID 
          instead.

          **NOTE**: though '-c' and '-C' might output more 'human-friendly' branch names,
                    it is STRONGLY ADVISED to use '-b' and '-B' when invoking this script from
                    other utility scripts as '-b'/'-B' are guaranteed to produce UNAMBIGUOUS
                    branch/commit references.

-p      : Print the currently checked out COMMIT HASH.

-P      : Print the currently checked out COMMIT HASH in short form (8 characters).

EOT
      rv=1
      ;;

    "?" )
      cat <<EOT

ERROR: no commandline option specified. Run 
  $0 -h
to see the online help for this utility script.

EOT
      rv=2
      ;;

    * )
      cat <<EOT

ERROR: unknown commandline option 
  -$OPTARG
specified. Run 
  $0 -h
to see the online help for this utility script.

EOT
      rv=2
      ;;
    esac
  done

  for (( i=$OPTIND; i > 1; i-- )) do
    shift
  done

  if test $# -gt 0 ; then
    cat <<EOT

ERROR: surplus unknown, unsupported commandline parameters
  $@

Run 
  $0 -h
to see the online help for this utility script.

EOT
    rv=2;
  fi
fi


popd                                                                                                    2> /dev/null  > /dev/null

exit $rv;
