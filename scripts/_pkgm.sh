#!/usr/bin/env bash

# Determines the preferred package manager (pnpm preferred, npm fallback)
# Exports helper functions for scripts to run install/build commands consistently.

REQUESTED_PM="${SHOEBOX_PKG_MANAGER:-}"
if [ -n "$REQUESTED_PM" ]; then
  CANDIDATES=($REQUESTED_PM)
else
  CANDIDATES=(pnpm npm)
fi

for candidate in "${CANDIDATES[@]}"; do
  if command -v "$candidate" >/dev/null 2>&1; then
    PKGM_BIN="$candidate"
    break
  fi
done

if [ -z "${PKGM_BIN:-}" ]; then
  echo "✗ No supported package manager found (expected pnpm or npm)." >&2
  echo "  Install pnpm: https://pnpm.io/installation" >&2
  exit 1
fi

export PKGM_BIN
export PKGM_PRETTY_NAME="$PKGM_BIN $("$PKGM_BIN" --version 2>/dev/null || true)"

shoebox_pkgm_install() {
  if [ "$PKGM_BIN" = "pnpm" ]; then
    pnpm install "$@"
  else
    npm install "$@"
  fi
}

shoebox_pkgm_install_ci() {
  if [ "$PKGM_BIN" = "pnpm" ]; then
    pnpm install --frozen-lockfile "$@"
  else
    npm ci --quiet "$@"
  fi
}

shoebox_pkgm_run() {
  if [ "$PKGM_BIN" = "pnpm" ]; then
    pnpm run "$@"
  else
    npm run "$@"
  fi
}
