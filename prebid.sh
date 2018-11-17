#!/usr/bin/env bash
cd ./node_modules/prebid.js
npm install
# Check if prebid-modules.json files exist.
if [ -f "../../prebid-modules.json" ];
    then
    gulp build --modules=../../prebid-modules.json
    echo "prebid-modules.json file found";
else
    gulp build
    echo "prebid-modules.json file does not exist. Create one to bundle certain modules only.";
fi
# Check if output directory exists.
if [ -d "../../prebid/" ];
    then
    echo "Prebid directory exists";
else
    mkdir "../../prebid";
    echo "Directory does not exist, creating directory";
fi
# copy the build into the root directory
cp ./build/dist/prebid.js ../../prebid/index.js
