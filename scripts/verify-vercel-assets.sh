#!/usr/bin/env sh
set -eu

test ! -f public/index.html
test -f public/robots.txt
test -f public/sitemap.xml
test -f public/admin/index.html
test -d public/assets
test -f dist/public/index.html
test -f dist/server-ssr/entry-server.js
printf 'Vercel static-asset layout verification passed.\n'
