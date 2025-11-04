#!/bin/bash
################################################################################
# Script Name  : sanity.sh
# Description  : Runs post-deployment sanity checks on CloudFront distribution
# Author       : Everestek Technosoft Solutions Pvt. Ltd
# Version      : 1.0.0
################################################################################

set -euo pipefail

#------------------------------------------------------------------------------
# Global Variables
#------------------------------------------------------------------------------
ROOT_DIR=$(pwd)
LOG_DIR="${ROOT_DIR}/logs"
LOG_FILE="${LOG_DIR}/sanity_$(date '+%Y%m%d_%H%M%S').log"

mkdir -p "$LOG_DIR"
touch "$LOG_FILE"

#------------------------------------------------------------------------------
# Logging Functions
#------------------------------------------------------------------------------
log() {
  local level="$1"; shift
  local message="$*"
  local timestamp
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

log_info()    { log "INFO" "$*"; }
log_warn()    { log "WARN" "$*"; }
log_error()   { log "ERROR" "$*"; }
log_section() { echo -e "\n========== $* ==========\n" | tee -a "$LOG_FILE"; }

#------------------------------------------------------------------------------
# Help Menu
#------------------------------------------------------------------------------
show_help() {
  cat <<EOF
Usage: $0 --app-name <APP_NAME> --app-version <APP_VERSION> --cloudfront <CLOUDFRONT_NAME>

Performs sanity checks after deployment:
  1. Validates CloudFront distribution returns HTTP 200.
  2. Verifies version.txt matches the deployed version.

Arguments:
  --app-name        Application name (e.g., agilery-portal)
  --app-version     Deployed application version
  --cloudfront      CloudFront distribution domain name

Options:
  --help            Show this help message and exit

Example:
  $0 --app-name agilery-portal --app-version 1.0.0-20251027.abcdef12 --cloudfront d39u8bjnsdege0.cloudfront.net
EOF
}

#------------------------------------------------------------------------------
# Validate Input
#------------------------------------------------------------------------------
validate_input() {
  if [[ $# -eq 0 || "$1" == "--help" ]]; then
    show_help
    exit 0
  fi

  while [[ $# -gt 0 ]]; do
    case $1 in
      --app-name) APP_NAME="$2"; shift 2 ;;
      --app-version) APP_VERSION="$2"; shift 2 ;;
      --cloudfront) CLOUDFRONT_NAME="$2"; shift 2 ;;
      *) log_error "Unknown option: $1"; show_help; exit 1 ;;
    esac
  done

  if [[ -z "${APP_NAME:-}" || -z "${APP_VERSION:-}" || -z "${CLOUDFRONT_NAME:-}" ]]; then
    log_error "Missing required arguments. Use --help for usage."
    exit 1
  fi
}

#------------------------------------------------------------------------------
# Check CloudFront Status Code
#------------------------------------------------------------------------------
check_status_code() {
  log_section "Checking CloudFront HTTP Status for ${CLOUDFRONT_NAME}"

  ACTUAL_STATUS=$(curl -LI "https://${CLOUDFRONT_NAME}" -o /dev/null -w '%{http_code}\n' -s)
  if [[ "$ACTUAL_STATUS" != "200" ]]; then
    log_error "Status Code Check FAILED (Received: ${ACTUAL_STATUS}, Expected: 200)"
    exit 1
  fi
  log_info "Status Code Check PASSED (${ACTUAL_STATUS})"
}

#------------------------------------------------------------------------------
# Verify Version File
#------------------------------------------------------------------------------
verify_version_file() {
  log_section "Verifying Deployed Version File"

  TMP_FILE="${APP_NAME}.${APP_VERSION}.txt"
  touch ${TMP_FILE}
  curl -s "https://${CLOUDFRONT_NAME}/version.txt" > "$TMP_FILE" || {
    log_error "Failed to fetch version.txt from CloudFront."
    exit 1
  }

  ACTUAL_VERSION=$(cat "$TMP_FILE" 2>/dev/null || echo "unknown")
  rm -f $TMP_FILE

  if [[ "$ACTUAL_VERSION" != "$APP_VERSION" ]]; then
    log_error "Version Check FAILED (Expected: ${APP_VERSION}, Got: ${ACTUAL_VERSION})"
    exit 1
  fi

  log_info "Version Check PASSED (${ACTUAL_VERSION})"
}

#------------------------------------------------------------------------------
# Main Execution
#------------------------------------------------------------------------------
main() {
  validate_input "$@"

  log_section "Running Sanity Script for ${APP_NAME} (${APP_VERSION})"
  check_status_code
  verify_version_file

  log_section "Sanity Checks Completed Successfully"
  log_info "Logs available at: ${LOG_FILE}"
}

main "$@"
