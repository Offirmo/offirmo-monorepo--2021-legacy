#!/usr/bin/env bash

echo "* Special node-typescript-compiler unit tests, requiring node v8..."

export NVM_DIR="$HOME/.nvm"

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

nvm exec 8 node ./test/test.js

