#!/bin/bash
################################################################################
# Script Name  : build.sh
# Description  : Builds the Agilery Portal frontend (React app)
# Author       : Everestek Technosoft Solutions Pvt. Ltd
# Version      : 1.1.0
################################################################################

set -eEuo pipefail

#------------------------------------------------------------------------------
# Global Variables
#------------------------------------------------------------------------------
APP_NAME="agilery-portal"
ROOT_DIR=$(pwd)
LOG_DIR="${ROOT_DIR}/logs"
LOG_FILE="${LOG_DIR}/build_$(date '+%Y%m%d_%H%M%S').log"
START_TIME=$(date '+%Y-%m-%d %H:%M:%S')

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
# Error & Exit Handling
#------------------------------------------------------------------------------
handle_error() {
  local exit_code=$?
  local last_command="${BASH_COMMAND:-unknown}"

  log_error "❌ Error occurred during build."
  log_error "Last Command: '$last_command'"
  log_error "Exit Code: $exit_code"
  log_error "Working Directory: $(pwd)"
  log_error "Full log: $LOG_FILE"

  log_error "\n--- Showing last 40 lines of log for quick debugging ---"
  tail -n 40 "$LOG_FILE" || true
  log_error "--- End of log excerpt ---"

  exit "$exit_code"
}

on_exit() {
  local code=$?
  local end_time=$(date '+%Y-%m-%d %H:%M:%S')
  if [[ $code -eq 0 ]]; then
    log_info "✅ Build completed successfully at $end_time"
  else
    log_error "❌ Build failed at $end_time (Exit code: $code)"
  fi
}

trap handle_error ERR
trap on_exit EXIT

#------------------------------------------------------------------------------
# Helper: Help Menu
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

  if ! command -v npm &>/dev/null; then
    log_error "npm is not installed or not found in PATH."
    exit 1
  fi

  log_info "Using npm version: $(npm -v)"
  log_info "Checking for package.json in: $(pwd)"

  if [[ ! -f "package.json" ]]; then
    log_error "package.json not found in $(pwd). Please ensure you run this script from the project root."
    exit 1
  fi

  # Try fetching version safely
  local raw_version
  raw_version=$(npm pkg get version 2>>"$LOG_FILE" || echo "")

  if [[ -z "$raw_version" || "$raw_version" == "{}" ]]; then
    log_warn "npm pkg get version failed or returned empty. Falling back to jq."

    if ! command -v jq &>/dev/null; then
      log_error "'jq' is required for fallback but not installed."
      exit 1
    fi

    raw_version=$(jq -r '.version // empty' package.json 2>>"$LOG_FILE")
  fi

  if [[ -z "$raw_version" ]]; then
    log_error "Failed to extract version from package.json."
    exit 1
  fi

  BASE_VERSION=$(echo "$raw_version" | tr -d '"')
  log_info "Base version from package.json: $BASE_VERSION"

  # Check versioning script
  if [[ ! -x "./build-scripts/get_version.sh" ]]; then
    log_error "Missing versioning script: ./build-scripts/get_version.sh"
    exit 1
  fi

  APP_VERSION=$(./build-scripts/get_version.sh "$BASE_VERSION" 2>>"$LOG_FILE") || {
    log_error "Failed to execute versioning script."
    exit 1
  }

  if [[ -z "$APP_VERSION" ]]; then
    log_error "Generated app version is empty."
    exit 1
  fi

  export APP_VERSION
  log_info "Generated app version: $APP_VERSION"
}

#------------------------------------------------------------------------------
# Update Package Metadata
#------------------------------------------------------------------------------
update_package_json() {
  log_section "Updating package.json metadata"

  if ! command -v jq &>/dev/null; then
    log_error "'jq' is required but not installed."
    exit 1
  fi

  if [[ ! -f "package.json" ]]; then
    log_error "package.json not found in $(pwd)"
    exit 1
  fi

  TMP_FILE=$(mktemp)
  jq --arg name "$APP_NAME" --arg version "$APP_VERSION" \
     '.app_name = $name | .app_version = $version' package.json > "$TMP_FILE" \
     || { log_error "jq command failed while updating package.json."; exit 1; }

  mv "$TMP_FILE" package.json
  log_info "package.json updated with app_name=$APP_NAME and app_version=$APP_VERSION"
}

#------------------------------------------------------------------------------
# Build React App
#------------------------------------------------------------------------------
build_react_app() {
  log_section "Building React Application"

  log_info "Node: $(node -v)"
  log_info "NPM:  $(npm -v)"

  log_info "Cleaning previous dist folder..."
  rm -rf dist || true

  log_info "Running npm build..."
  npm run build 2>&1 | tee -a "$LOG_FILE"

  if [[ ! -d "dist" ]]; then
    log_error "Build failed: 'dist' directory not created."
    exit 1
  fi

  echo "$APP_VERSION" > dist/version.txt
  cp package.json dist/
  log_info "✅ Build successful — version.txt generated inside dist/"
}

#------------------------------------------------------------------------------
# Main
#------------------------------------------------------------------------------
main() {
  log_section "Starting Agilery Portal Build"
  log_info "Start Time: $START_TIME"
  log_info "Working Directory: $(pwd)"

  if [[ $# -gt 0 && "$1" == "--help" ]]; then
    show_help
    exit 0
  fi

  generate_app_version
  update_package_json
  build_react_app

  log_section "Build Process Completed"
  log_info "App Version: $APP_VERSION"
  log_info "Logs saved at: $LOG_FILE"
}

main "$@"
