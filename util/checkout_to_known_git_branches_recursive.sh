#! /bin/bash
#
# Generated by the utility: util/collect_git_checked_out_branch_recusively.sh 
#
# Checkout each git repository to the given branch/commit or list them
#

mode=h;
while getopts ":hlc" opt ; do
  #echo opt+arg = "$opt$OPTARG"
  case "$opt$OPTARG" in
  l )
    mode=h;
    ;;

  c )
    mode=c;
    ;;

  r )
    mode=r;
    ;;

  * )
    cat <<EOH
checkout_to_known_git_branches_recursive.sh options

Options:

-h      : print this help 
-l      : LIST the branch/commit for each git repository (directory) registered in this script.
-c      : CHECKOUT each git repository to the BRANCH registered in this script.
-r      : CHECKOUT/REVERT each git repository to the COMMIT registered in this script.

Note:

Use the '-r' option to set each repository to an exact commit position, which is useful if,
for instance, you wish to reproduce this registered previous software state (which may 
represent a software release) which you wish to analyze/debug.

EOH
    exit 1;
    ;;
  esac
done

if test "$mode" = "h" ; then
  cat <<EOH

Git repository directory                    :: commit hash                         / branch name
--------------------------------------------::--------------------------------------------------
EOH
fi



# args: DIR COMMIT [BRANCH]
git_repo_checkout_branch() {
  if test "$mode" = "c" || test "$mode" = "r" ; then
    if test -d "$1" ; then
      pushd "$1"                                                               2> /dev/null  > /dev/null
      if test "$mode" = "c" && test -n "$3" ; then
        # make sure the branch is created locally and is a tracking branch:
        git branch --track "$3" "remotes/origin/$3"                            2> /dev/null  > /dev/null
        git checkout "$3"
      else
        git checkout "$2"
      fi
      popd                                                                     2> /dev/null  > /dev/null
    fi
  else
    if test -d "$1" ; then
      printf "%-43s :: %s / %s\n" "$1" "$2" "$3"
    else
      printf "%-43s :: %s / %s\n" "[DIRECTORY DOES NOT EXIST!] $1" "$2" "$3"
    fi
  fi
}


#
# Make sure we switch to the utility directory as all the relative paths for the repositories
# are based off that path!
#
pushd $(dirname $0)                                                            2> /dev/null  > /dev/null



#
# The registered repositories:
#

git_repo_checkout_branch "../documentation/wiki" 80267c5ab2721b7e27a9f2512120ccebc4da3dff master
git_repo_checkout_branch "../lib/TinyColor" ea8db61655d8b09673ec5ed20d932f8e201d711d master
git_repo_checkout_branch "../lib/hammer" ef1ec7a248aee3c3544d5d9aad9685c25fe3fc11 master
git_repo_checkout_branch "../lib/jquery-fixclick" 762bb2c01a63101ed8c03845510e2be3e896eeb4 master
git_repo_checkout_branch "../lib/jquery-iCheck" a97450ab337fd66e77e98378e4971713bda4ff19 master
git_repo_checkout_branch "../lib/jquery-jsonp" c313be97a4c4a605023cebfe8944b8fc43945629 master
git_repo_checkout_branch "../lib/jquery-jsonp/test/qunit" 6733398db8811fb839e9c81fc8119ba357e1f6b2 
git_repo_checkout_branch "../lib/jquery-migrate" 0d5559da1c40b351f30272b9789829319bb43ed6 master
git_repo_checkout_branch "../lib/jquery-multiselect" 1b09c2e4b28d390b7691cbd7529b43b173ad4ea7 master
git_repo_checkout_branch "../lib/jquery-simulate" 8a9e765f3930d09b4594aca7e30a3634c6f48ef4 master
git_repo_checkout_branch "../lib/jquery-simulate/test/qunit" 99f10eabddb0b960525f1acfb71c7f80fbf22d57 
git_repo_checkout_branch "../lib/jquery-sparkline" 1c161fa62436e27d3ef07ced57bf4a01fa4dc8ca takacsv-work
git_repo_checkout_branch "../lib/jquery-sparkline/lib/rainbow-vis" 2f29dd66ff0f9f1ed848cc8558b29bf6a78852c8 master
git_repo_checkout_branch "../lib/keymaster" 1ea29b8498456b8afa07c5a76382addc3691c87f master
git_repo_checkout_branch "../lib/slickgrid-checkbox-select-all-column-plugin" cf3d43ad95953b078d06606fde594a44caee082b master
git_repo_checkout_branch "../lib/slickgrid-enhanced-pager-plugin" fbfee780bea8caf8b4312fa8c5f5120710b85ca4 master
git_repo_checkout_branch "../lib/slickgrid-guriddo-frozencolumns" 6d353e3919fd5c3e107192f2aa84570ef16ace03 master
git_repo_checkout_branch "../lib/slickgrid-spreadsheet-plugins" 36ac2b5b4fd1147afcce0a2a9f3d079491c10c67 master
git_repo_checkout_branch "../lib/slickgrid-surge-extensions" 9db1bd5b770d0c6ba5c1bf27f943780eb6089926 master
git_repo_checkout_branch "../lib/slickgrid-totals-plugin" ebed7e10d9c8608f863e8bb4c9e784434aac115c master
git_repo_checkout_branch "../lib/spectrum" 0f0562d778fc0ee54d6e8a408b5b359692529a78 master
git_repo_checkout_branch "../lib/spectrum/lib/TinyColor" b4be7d8946110c7f75014be40ba90d98aabffc5e master
git_repo_checkout_branch "../lib/threedubmedia" 328826bdd9490a7130985620db6aa96fc899df0a master
git_repo_checkout_branch "../lib/verge-screendimensions" c9b2acca6c24a9e5f972ab12dafad8ccd06b1f85 master

# --- all done ---

popd                                                                           2> /dev/null  > /dev/null

