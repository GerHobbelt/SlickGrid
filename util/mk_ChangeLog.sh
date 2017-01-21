#! /bin/bash
#
# Original: https://raw.githubusercontent.com/indexzero/dotfiles/master/scripts/git-changelog-all
# 

function tag_header () {
  TAG=$1
  DATE=`git --no-pager log --pretty="format: %cD" --max-count=1 $TAG`
  HEAD="\n$TAG /${DATE:0:${#DATE}-15}\n"
  for i in $(seq 5 ${#HEAD}); do HEAD="$HEAD="; done
  HEAD="$HEAD\n\n"
  echo -e "$HEAD";
}

LAST_TAG=
for TAG in `git for-each-ref --format="%(tag)" --sort='*authordate' refs/tags | sed '1!G;h;$!d'`; do
  if [ -z "$LAST_TAG" ]; then
    LAST_TAG=$TAG
    continue
  fi

  echo -e "$(tag_header $LAST_TAG)"
  git --no-pager log --pretty="format:  * [%h] %s (\`%an\`)" "$TAG".."$LAST_TAG"
  echo ""

  LAST_TAG=$TAG
done
