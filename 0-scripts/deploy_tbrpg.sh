#!/usr/bin/env bash

PARENT_DIR="."
DATE=`date +%Y%m%d`
#echo $DATE

pushd $PARENT_DIR > /dev/null

#pwd

FE_SRC_DIR="./A-apps/the-boring-rpg/client-browser/dist"
FN_SRC_DIR="./A-apps/online-adventur.es/functions/functions"

FE_TARGET_DIR="../../oa/online-adventures.github.io/apps/the-boring-rpg-preprod"
FN_TARGET_DIR="../../oa/online-adventures.github.io/functions"

FE_BKP_DIR="../../oa/online-adventures.github.io/apps/legacy/tbrpg-$DATE"
FN_BKP_DIR="../../oa/online-adventures.github.io/apps/legacy/tbrpg-fn-$DATE"

rm -rf $FE_BKP_DIR
mkdir -p $FE_BKP_DIR
cp -r $FE_SRC_DIR/* $FE_BKP_DIR

rm -rf $FE_TARGET_DIR
mkdir -p $FE_TARGET_DIR
cp -r $FE_SRC_DIR/* $FE_TARGET_DIR

rm -rf $FN_BKP_DIR
mkdir -p $FN_BKP_DIR
cp -r $FN_SRC_DIR/* $FN_BKP_DIR

rm -rf $FN_TARGET_DIR
mkdir -p $FN_TARGET_DIR
cp -r $FN_SRC_DIR/* $FN_TARGET_DIR

popd > /dev/null
