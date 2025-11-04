#!/bin/bash
################################################################################
# Script Name  : main.sh
# Description  : Orchestrates build and deployment for Agilery Portal frontend
# Author       : Everestek Technosoft Solutions Pvt. Ltd
# Version      : 1.0.0
################################################################################

set -euo pipefail

#------------------------------------------------------------------------------#
# Global Variables
#------------------------------------------------------------------------------#
ROOT_DIR=$(pwd)
SCRIPT_DIR="${ROOT_DIR}/deployment/scripts"
LOG_DIR="${ROOT_DIR}/logs"
LOG_FILE="${LOG_DIR}/main_$(date '+%Y%m%d_%H%M%S').log"

#------------------------------------------------------------------------------#
# Logging Setup
#------------------------------------------------------------------------------#
mkdir -p "$LOG_DIR"
touch "$LOG_FILE"

log_info()    { echo -e "[INFO]  $*" 2>&1 | tee -a  "$LOG_FILE"; }
log_error()   { echo -e "[ERROR] $*" 2>&1 | tee -a  "$LOG_FILE" >&2; }
log_section() { echo -e "\n================== $* ==================\n" 2>&1 | tee -a  "$LOG_FILE"; }

#------------------------------------------------------------------------------#
# Help Menu
#------------------------------------------------------------------------------#
show_help() {
  cat <<EOF
Usage: $0 <environment>

Description:
  This script performs a complete build and deployment of the Agilery Portal.

Steps:
  1. Build the frontend app using build.sh
  2. Deploy infrastructure & services using deploy.sh

Arguments:
  <environment>     Target environment (dev | prd)

Example:
  $0 dev
  $0 prd
EOF
}

#------------------------------------------------------------------------------#
# Input Validation
#------------------------------------------------------------------------------#
validate_input() {
  if [[ $# -eq 0 || "$1" == "--help" ]]; then
    show_help
    exit 0
  fi

  ENV=$1
  if [[ "$ENV" != "dev" && "$ENV" != "prd" ]]; then
    log_error "Invalid environment '$ENV'. Allowed values: dev, prd."
    exit 1
  fi
}

#------------------------------------------------------------------------------#
# Main Execution
#------------------------------------------------------------------------------#
main() {
  validate_input "$@"
  ENV=$1
  export AWS_PROFILE

  log_section "Starting Full Build & Deployment for environment: $ENV"

  # Step 1: Build
  log_section "Running Build Phase"
  bash "${SCRIPT_DIR}/build.sh" "$ENV" 2>&1 | tee -a  "$LOG_FILE"

  # Step 2: Deployment
  log_section "Running Deployment Phase"
  bash "${SCRIPT_DIR}/deploy.sh" "$ENV" 2>&1 | tee -a  "$LOG_FILE"

  log_section "Build & Deployment Completed Successfully"
}

main "$@"
