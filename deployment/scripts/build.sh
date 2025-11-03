#!/bin/bash
################################################################################
# Script Name  : build.sh
# Description  : Builds the Agilery Portal frontend (React app)
# Author       : Everestek Technosoft Solutions Pvt. Ltd
# Version      : 1.0.0
################################################################################

set -euo pipefail

#------------------------------------------------------------------------------
# Global Variables
#------------------------------------------------------------------------------
APP_NAME="agilery-portal"
BASE_VERSION=$(npm pkg get version | tr -d '"')
ROOT_DIR=$(pwd)
LOG_DIR="${ROOT_DIR}/logs"
LOG_FILE="${LOG_DIR}/build_$(date '+%Y%m%d_%H%M%S').log"

#------------------------------------------------------------------------------
# Setup Logging Directory
#------------------------------------------------------------------------------
mkdir -p "$LOG_DIR"
touch "$LOG_FILE"

#------------------------------------------------------------------------------
# Logging Functions
#------------------------------------------------------------------------------
log_info()    { echo -e "[INFO]  $*" | tee -a "$LOG_FILE"; }
log_error()   { echo -e "[ERROR] $*" | tee -a "$LOG_FILE" >&2; }
log_section() { echo -e "\n================== $* ==================\n" | tee -a "$LOG_FILE"; }

#------------------------------------------------------------------------------
# Help Menu
#------------------------------------------------------------------------------
show_help() {
  cat <<EOF
Usage: $0

Builds the Agilery Portal React app and prepares version metadata.

Options:
  --help    Show this help message and exit
EOF
}

#------------------------------------------------------------------------------
# Generate App Version
#------------------------------------------------------------------------------
generate_app_version() {
  log_section "Generating Application Version"
  log_info "Base version from package.json: $BASE_VERSION"

  APP_VERSION=$(./build-scripts/get_version.sh "$BASE_VERSION")
  log_info "Generated app version: $APP_VERSION"

  export APP_VERSION
}

#------------------------------------------------------------------------------
# Update Package Metadata
#------------------------------------------------------------------------------
update_package_json() {
  log_section "Updating package.json with app metadata"

  if ! command -v jq &>/dev/null; then
    log_error "'jq' is required but not installed."
    exit 1
  fi

  TMP_FILE=$(mktemp)
  jq --arg name "$APP_NAME" --arg version "$APP_VERSION" \
     '.app_name = $name | .app_version = $version' package.json > "$TMP_FILE" && mv "$TMP_FILE" package.json

  log_info "package.json updated with app_name=$APP_NAME and app_version=$APP_VERSION"
}

#------------------------------------------------------------------------------
# Build React App
#------------------------------------------------------------------------------
build_react_app() {
  log_section "Building React Application"

  rm -rf dist || true
  npm run build 2>&1 | tee -a "$LOG_FILE"

  echo "$APP_VERSION" > dist/version.txt
  cp package.json dist

  log_info "Build completed successfully. Version file created at dist/version.txt"
}

#------------------------------------------------------------------------------
# Main Execution
#------------------------------------------------------------------------------
main() {
  if [[ $# -gt 0 && "$1" == "--help" ]]; then
    show_help
    exit 0
  fi

  generate_app_version
  update_package_json
  build_react_app

  log_section "Build Process Completed"
  log_info "App Version: $APP_VERSION"
}

main "$@"
