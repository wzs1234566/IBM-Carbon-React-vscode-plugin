#!/bin/bash
rm -rf carbon Carbon-Meta && \
mkdir -p Carbon-Meta && \
git clone https://github.com/carbon-design-system/carbon.git && \
cd carbon/packages/react && \
sed -i -e '/@carbon\/test-utils/d' package.json && \
npm i && \
yarn clean && node scripts/build.js && \
cp react-docgen.json ../../../Carbon-Meta/react-docgen.json