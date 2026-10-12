#!/usr/bin/env bash

# Sourced after _nvm-load.sh; pnpm is the only supported package manager.
if [ "${SHOEBOX_PKG_MANAGER:-pnpm}" != "pnpm" ]; then
  echo "✗ Only pnpm is supported; remove SHOEBOX_PKG_MANAGER." >&2
  exit 1
fi

REQUIRED_PNPM="$(node --input-type=module -e '
  import { readFileSync } from "node:fs";
  const manifest = JSON.parse(readFileSync(process.argv[1], "utf8"));
  const match = /^pnpm@(\d+\.\d+\.\d+)$/.exec(manifest.packageManager);
  if (!match || match[1] !== manifest.engines.pnpm || `v${manifest.engines.node}` !== process.argv[2]) {
    throw new Error("packageManager, engines, and .nvmrc must agree on exact versions");
  }
  console.log(match[1]);
' "$PROJECT_ROOT/package.json" "$REQUIRED_NODE")"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "✗ pnpm $REQUIRED_PNPM is required. Run 'corepack enable pnpm'." >&2
  exit 1
fi

CURRENT_PNPM="$(pnpm --version)"
if [ "$CURRENT_PNPM" != "$REQUIRED_PNPM" ]; then
  echo "✗ pnpm $REQUIRED_PNPM required but $CURRENT_PNPM is active. Run 'corepack enable pnpm'." >&2
  exit 1
fi

export PKGM_PRETTY_NAME="pnpm $CURRENT_PNPM"

shoebox_pkgm_install() {
  pnpm install "$@"
}

shoebox_pkgm_install_ci() {
  pnpm install --frozen-lockfile "$@"
}

shoebox_pkgm_run() {
  pnpm run "$@"
}
