#!/bin/bash
#
# commandline:
#      (regex)
#
# (regex)   - find match for (regex) in submodules list
#
#

wd="$( pwd )";

pushd $(dirname $0)                                                                                     2> /dev/null  > /dev/null

# go to root of project
cd ..

wd=$( util/print-git-repo-base-directory.sh "$wd" )
echo "git repository base directory: $wd"
cd "$wd"
          
          
function help()
{
  cat <<EOT
$0 [options|<regex>]

check if project/library exists in our submodules collection.

<regex> : find match for (regex) in submodules list.
-l      : list the entire collection of submodules. (path :: url)

EOT
}

getopts ":lh" opt
#echo opt+arg = "$opt$OPTARG"
case "$opt$OPTARG" in
"?" )
  echo "--- find git repo in our submodules list ---"
  #echo full - args: $@
  if test -z "$1" ; then
    help
  elif ! test -f .gitmodules ; then
    echo "--- WARNING: This project does not have any submodules ---"
  else
    gawk -- '/submodule/ { next; }; /path = / { printf("%s :: ", $3);next;};  /url = / { printf("%s\n", $3);next;}; { next;};' .gitmodules | grep -i -e "$1"
  fi
  ;;

"l" )
  echo "--- list our submodules list ---"
  #echo full - args: $@
  if ! test -f .gitmodules ; then
    echo "--- WARNING: This project does not have any submodules ---"
  else
    gawk -- '/submodule/ { next; }; /path = / { printf("%s :: ", $3);next;};  /url = / { printf("%s\n", $3);next;}; { next;};' .gitmodules
  fi
  ;;

'h' )
  help
  ;;
esac


popd                                                                                                    2> /dev/null  > /dev/null

