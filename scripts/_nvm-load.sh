#!/usr/bin/env bash

# Ensures the Node.js version defined in .nvmrc is active.
# Designed to be sourced from other scripts that already enabled 'set -euo pipefail'.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
NVMRC_FILE="$PROJECT_ROOT/.nvmrc"

if [ ! -f "$NVMRC_FILE" ]; then
  echo "✗ .nvmrc not found in $PROJECT_ROOT" >&2
  exit 1
fi

REQUIRED_NODE_VERSION="$(tr -d '\r\n[:space:]' < "$NVMRC_FILE")"
if [ -z "$REQUIRED_NODE_VERSION" ]; then
  echo "✗ .nvmrc is empty; specify a Node.js version." >&2
  exit 1
fi

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"
elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
  # Homebrew macOS fallback
  # shellcheck disable=SC1091
  . "/usr/local/opt/nvm/nvm.sh"
fi

if command -v nvm >/dev/null 2>&1; then
  export NVM_QUIET=1
  nvm install "$REQUIRED_NODE_VERSION" >/dev/null
  nvm use "$REQUIRED_NODE_VERSION" >/dev/null
else
  echo "✗ nvm not found. Install it: https://github.com/nvm-sh/nvm#installing-and-updating" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "✗ Node.js not available even after loading nvm." >&2
  exit 1
fi

REQUIRED_NODE="v$REQUIRED_NODE_VERSION"
CURRENT_NODE="$(node --version)"
if [ "$CURRENT_NODE" != "$REQUIRED_NODE" ]; then
  echo "✗ Node.js $REQUIRED_NODE required but $CURRENT_NODE is active." >&2
  exit 1
fi

export PATH
