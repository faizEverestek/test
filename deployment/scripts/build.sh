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
log_warn()    { echo -e "[WARN]  $*" | tee -a "$LOG_FILE"; }
log_error()   { echo -e "[ERROR] $*" | tee -a "$LOG_FILE" >&2; }
log_section() { echo -e "\n================== $* ==================\n" | tee -a "$LOG_FILE"; }

#------------------------------------------------------------------------------
# Error Handling
#------------------------------------------------------------------------------
handle_error() {
  local exit_code=$?
  local last_command="${BASH_COMMAND:-unknown}"
  log_error "Error occurred during execution."
  log_error "Command: '$last_command'"
  log_error "Exit Code: $exit_code"
  log_error "Check detailed logs at: $LOG_FILE"
  log_error "Build process aborted."
  exit $exit_code
}
trap handle_error ERR

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

  if [[ ! -x "./build-scripts/get_version.sh" ]]; then
    log_error "Missing script: ./build-scripts/get_version.sh"
    exit 1
  fi

  APP_VERSION=$(./build-scripts/get_version.sh "$BASE_VERSION" 2>>"$LOG_FILE") || {
    log_error "Failed to generate app version."
    exit 1
  }

  if [[ -z "$APP_VERSION" ]]; then
    log_error "App version generation returned empty value."
    exit 1
  fi

  export APP_VERSION
  log_info "Generated app version: $APP_VERSION"
}

#------------------------------------------------------------------------------
# Update Package Metadata
#------------------------------------------------------------------------------
update_package_json() {
  log_section "Updating package.json with app metadata"

  if ! command -v jq &>/dev/null; then
    log_error "'jq' is required but not installed. Please install jq before running this script."
    exit 1
  fi

  if [[ ! -f "package.json" ]]; then
    log_error "package.json not found in current directory: $(pwd)"
    exit 1
  fi

  TMP_FILE=$(mktemp)
  jq --arg name "$APP_NAME" --arg version "$APP_VERSION" \
     '.app_name = $name | .app_version = $version' package.json > "$TMP_FILE" \
     || { log_error "Failed to update package.json with metadata."; exit 1; }

  mv "$TMP_FILE" package.json
  log_info "package.json updated with app_name=$APP_NAME and app_version=$APP_VERSION"
}

#------------------------------------------------------------------------------
# Build React App
#------------------------------------------------------------------------------
build_react_app() {
  log_section "Building React Application"

  if ! command -v npm &>/dev/null; then
    log_error "'npm' command not found. Please ensure Node.js and npm are installed."
    exit 1
  fi

  log_info "Cleaning old build directory..."
  rm -rf dist || true

  log_info "Running npm build..."
  npm run build 2>&1 | tee -a "$LOG_FILE" || {
    log_error "npm build failed. Check log file for details."
    exit 1
  }

  log_info "Finalizing build output..."
  echo "$APP_VERSION" > dist/version.txt
  cp package.json dist

  if [[ ! -f "dist/version.txt" ]]; then
    log_error "Failed to generate version.txt in dist folder."
    exit 1
  fi

  log_info "Build completed successfully. Version file created at dist/version.txt"
}

#------------------------------------------------------------------------------
# Main Execution
#------------------------------------------------------------------------------
main() {
  log_section "Starting Agilery Portal Build Process"

  if [[ $# -gt 0 && "$1" == "--help" ]]; then
    show_help
    exit 0
  fi

  generate_app_version
  update_package_json
  build_react_app

  log_section "Build Process Completed Successfully"
  log_info "App Version: $APP_VERSION"
  log_info "Logs saved at: $LOG_FILE"
}

main "$@"
