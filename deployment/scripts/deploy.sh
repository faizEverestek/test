#!/bin/bash
################################################################################
# Script Name  : deploy.sh
# Description  : Master deployment script for Agilery Portal frontend
# Author       : Everestek Technosoft Solutions Pvt. Ltd
# Version      : 2.0.0
################################################################################

set -euo pipefail

#------------------------------------------------------------------------------#
# Global Variables
#------------------------------------------------------------------------------#
APP_NAME="agilery-portal"
ROOT_DIR=$(pwd)
LOG_DIR="${ROOT_DIR}/logs"
LOG_FILE="${LOG_DIR}/deployment_$(date '+%Y%m%d_%H%M%S').log"
SANITY_RESULT_FILE="../../terraform/sanity/sanity-result.txt"

#------------------------------------------------------------------------------#
# Logging
#------------------------------------------------------------------------------#
mkdir -p "$LOG_DIR"
touch "$LOG_FILE"

log_info()    { echo -e "[INFO]  $*" | tee -a "$LOG_FILE"; }
log_error()   { echo -e "[ERROR] $*" | tee -a "$LOG_FILE" >&2; }
log_section() { echo -e "\n================== $* ==================\n" | tee -a "$LOG_FILE"; }

#------------------------------------------------------------------------------#
# Input Validation
#------------------------------------------------------------------------------#
validate_input() {
  if [[ $# -eq 0 ]]; then
    echo "Usage: $0 <environment>"
    echo "Example: $0 dev"
    exit 1
  fi

  ENV=$1
  if [[ "$ENV" != "dev" && "$ENV" != "prd" ]]; then
    log_error "Invalid environment '$ENV'. Allowed: dev | prd"
    exit 1
  fi
}

#------------------------------------------------------------------------------#
# Main
#------------------------------------------------------------------------------#
main() {
  validate_input "$@"
  export AWS_PROFILE
  ENV=$1

  log_section "Starting Deployment for environment: $ENV"

  # Step 1: Deploy Infra
  bash deployment/scripts/infra.sh "$ENV" | tee -a "$LOG_FILE"

  # Step 2: Deploy Green Environment
  bash deployment/scripts/green.sh "$ENV" | tee -a "$LOG_FILE"

  # Step 3: Run Sanity Check
  bash deployment/scripts/sanity.sh "$ENV" | tee -a "$LOG_FILE"

  # Step 4: Evaluate Sanity Check
  if [[ ! -f "$SANITY_RESULT_FILE" ]]; then
    log_error "Sanity result file missing — skipping Blue Deployment!"
  else
    STATUS=$(cat "$SANITY_RESULT_FILE" | tr -d '[:space:]')
    rm -f "$SANITY_RESULT_FILE"
    if [[ "$STATUS" == "SUCCESS" ]]; then
      log_info "Sanity check passed — running Blue Deployment..."
      bash deployment/scripts/blue.sh "$ENV" | tee -a "$LOG_FILE"
    else
      log_error "Sanity check failed — skipping Blue Deployment!"
    fi
  fi

  exit
  # Step 5: Destroy Green in all cases
  log_section "Destroying Green Infrastructure"
  bash deployment/scripts/green.sh "$ENV" destroy | tee -a "$LOG_FILE"

  log_section "Deployment Completed Successfully"
}

main "$@"
