#!/bin/bash
################################################################################
# Script Name  : sanity.sh
# Description  : Perform sanity check for Agilery Portal deployment
################################################################################

set -euo pipefail

log_section() { echo -e "\n================== $* ==================\n"; }
log_info() { echo -e "[INFO] $*"; }
log_error() {
  echo -e "[ERROR] $*"
  exit 1
}

ENV=$1
APP_NAME="agilery-portal"
APP_VERSION=$(jq -r '.app_version' package.json)
ROOT_DIR=$(pwd)
CLOUDFRONT_DOMAIN="d1i1eokyxlrfiy.cloudfront.net"
SANITY_RESULT_FILE="${ROOT_DIR}/terraform/sanity/sanity-result.txt"

mkdir -p "$(dirname "$SANITY_RESULT_FILE")"

log_section "Running Sanity Check for $APP_NAME ($ENV)"
cd terraform/sanity

echo 'FAILED' > "$SANITY_RESULT_FILE"
if ./sanity.sh --app-name "$APP_NAME" --app-version "$APP_VERSION" --cloudfront "$CLOUDFRONT_DOMAIN"; then
  echo 'SUCCESS' > "$SANITY_RESULT_FILE"
  log_info "Sanity check passed"
else
  log_error "Sanity check failed"
fi

cd - >/dev/null
