#! /bin/bash
#
# Taken from:
#     http://stackoverflow.com/questions/2564634/bash-convert-absolute-path-into-relative-path-given-a-current-directory
# and augmented to support relative-to-current-directory input paths.
#     

if test "$#" != 2 ; then
  cat <<EOT
compute_relative_path  from  to

  Compute the relative path to arrive at the 'to' path from the 'from' path.

  The 'from' and 'to' paths can be arbitrary (relative to the current directory or absolute)
  path specifications themselves, e.g.

      compute_relative_path  ../a  ./c/d/e

EOT
  exit 1
fi

wd="$( pwd )";


# convert an arbitrary path spec to a cleaned up absolute path
mkCleanAbsPath() {
  # special case: the input path is simply "." i.e. the current directory:
  if test "$1" == "." ; then
    echo "$wd"
  else
    pushd $(dirname "$1" )                                                                                     2> /dev/null  > /dev/null
    f=$( basename "$1" )
    # special case: the input path ends with a "." or "..":
    if test "$f" == "." || test "$f" == ".." ; then
      cd "$1"
      pwd      
    else
      d="$( pwd )";
      echo "$d/$f"
    fi
  fi
}


# both $1 and $2 must be turned into absolute paths beginning with /
# 
# The rest of the code produces the relative path to $2/$target from $1/$source
source=$( mkCleanAbsPath "$1" );
target=$( mkCleanAbsPath "$2" );
#echo "source = $source"
#echo "target = $target"

common_part="$source" # for now
result="" # for now

while [[ "${target#$common_part}" == "${target}" ]]; do
    # no match, means that candidate common part is not correct
    # go up one level (reduce common part)
    common_part="$(dirname $common_part)"
    # and record that we went back, with correct / handling
    if [[ -z $result ]]; then
        result=".."
    else
        result="../$result"
    fi
done

if [[ $common_part == "/" ]]; then
    # special case for root (no common path)
    result="$result/"
fi

# since we now have identified the common part,
# compute the non-common part
forward_part="${target#$common_part}"

# and now stick all parts together
if [[ -n "$result" ]] && [[ -n "$forward_part" ]]; then
    result="$result$forward_part"
elif [[ -n "$forward_part" ]]; then
    # extra slash removal
    result="${forward_part:1}"
fi

echo "$result"
