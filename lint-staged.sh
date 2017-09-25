#!/bin/bash

# Check for eslint
which ./node_modules/.bin/eslint &> /dev/null
if [[ "$?" == 1 ]]; then
  echo "Please install ESlint"
  exit 1
fi

echo "Linting staged files"
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep "\\.\(js\)$")

if [[ "$STAGED_FILES" = "" ]]; then
  echo "Nothing to lint"
  exit 0
fi

echo "$STAGED_FILES"

# --color to force color output
./node_modules/.bin/eslint --color $STAGED_FILES
exit $?
