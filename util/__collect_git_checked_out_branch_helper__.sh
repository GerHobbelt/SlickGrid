#! /bin/bash
#
# helper; do not run directly from the commandline.
#

if test -z "$1" ; then
  echo "ERROR: this is a helper script. Do not run manually from the command line."
  exit 1
fi

wd="$( pwd )";

utildir="$(dirname $0)"

wd=$( $utildir/print-git-repo-base-directory.sh "$wd" )
#echo "git repository base directory: $wd"

gbn=$( "$utildir/git_print_repo_info.sh" -C )

gcn=$( "$utildir/git_print_repo_info.sh" -p )
#echo "git branch/commit: $gbn / $gcn"

# as this has to work on many installations, we need the path relative to a given reference directory:
rrd=$( "$utildir/compute_relative_path.sh" "$1" "$wd" )
if test -z "$rrd" ; then
  rrd="."
fi
#echo "git repo directory: $rrd"

# warning: $gbn MAY be empty! Thus we produce an OPTIONAL third argument here:
echo "git_repo_checkout_branch \"$rrd\" $gcn $gbn"

# http://stackoverflow.com/questions/2990414/echo-that-outputs-to-stderr
>&2 echo "REPOSITORY: $rrd  :: $gcn :: $gbn"
