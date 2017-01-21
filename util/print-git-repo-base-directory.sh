#!/bin/bash
#
# Print the path of the nearest parent directory which is a git repository root directory
# and return exit code 0.
# 
# If there is no git repository in the current directory or any of its parents, print
# the current directory and return exit code 1.
#    

find_git_base() {
    d="$1"
    #echo "testing : $d"
    if test "$d" = "." ; then
        d="$wd";
    fi
    #echo "testing B : $d"
    if test -f "$d" ; then
        d=$( dirname "$d" )
    fi
    #echo "testing C : $d"
    if test -a "$d/.git" ; then
        echo "$d";
        exit 0;
    fi
    if test "$d" != "/" ; then
        # in order to keep spaces in directory names intact we first assign to a variable, then use that variable:
        d=$( dirname "$d" )
        #echo "testing D : $d"
        find_git_base "$d"
    else
        # $d == "/": special case on Windows machines with msysgit full package installed
        if test -a "/.git" ; then
            #echo "testing E : $d"
            echo "$d";
            exit 0;
        else
            #echo "testing F : $wd"
            echo "$wd";
            exit 1;
        fi
    fi
}

wd="$( pwd )";

if test -n "$1" ; then
    find_git_base "$1"
else
    find_git_base "$( pwd )"
fi

