#!/bin/bash
rm -rf carbon src/CarbonModel && \
mkdir -p src/CarbonModel && \
git clone https://github.com/carbon-design-system/carbon.git && \
cd carbon/packages/react && \
sed -i -e '/@carbon\/test-utils/d' package.json && \
npm i && \
yarn clean && node scripts/build.js && \
cp react-docgen.json ../../../src/CarbonModel/react-docgen.json