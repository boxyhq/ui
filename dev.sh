#!/bin/sh
VERSION=3.3.34
npm run cleanup:mitosis-out && npm run build

cd react
npm unpublish --registry http://localhost:4873/ @boxyhq/react-ui@3.3.34
npm publish --registry http://localhost:4873/

cd ../..
cd saas-app
npm uninstall @boxyhq/react-ui && npm i --save-exact --registry http://localhost:4873/ @boxyhq/react-ui@$VERSION
rm -rf .next
