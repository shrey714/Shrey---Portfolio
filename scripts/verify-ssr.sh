#!/usr/bin/env sh
set -eu

base_url="${1:-http://localhost:3000}"
html="$(curl --fail --silent --show-error "${base_url%/}/")"
body="$(printf '%s' "$html" | sed 's/.*<body[^>]*>//')"

assert_count() {
  expected="$1"
  needle="$2"
  actual="$(printf '%s' "$html" | grep -o "$needle" | wc -l | tr -d ' ')"
  if [ "$actual" -ne "$expected" ]; then
    printf 'Expected %s occurrence(s) of %s, found %s.\n' "$expected" "$needle" "$actual" >&2
    exit 1
  fi
}

assert_count 1 '<title>'
assert_count 1 'property="og:title"'
assert_count 1 'rel="canonical"'
printf '%s' "$html" | grep -q 'application/ld+json'
printf '%s' "$body" | grep -q 'id="work"'
printf '%s' "$html" | grep -q '__RQ_STATE__'
printf 'SSR verification passed for %s\n' "$base_url"
