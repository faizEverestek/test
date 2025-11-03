#!/bin/bash
################################################################################
# Script Name  : deploy.sh
# Description  : Builds and deploys Agilery Portal frontend with Terraform infra
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
LOG_FILE="${LOG_DIR}/deployment_$(date '+%Y%m%d_%H%M%S').log"

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
# Help Menu
#------------------------------------------------------------------------------
show_help() {
  cat <<EOF
Usage: $0 <environment>

Builds and deploys the Agilery Portal for the specified environment.

Arguments:
  <environment>     Target environment (dev | prd)

Options:
  --help            Show this help message and exit

Examples:
  $0 dev
  $0 prd
EOF
}

#------------------------------------------------------------------------------
# Input Validation
#------------------------------------------------------------------------------
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
  log_section "Updating package.json"
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
# Run Terraform Deployment
#------------------------------------------------------------------------------
run_terraform() {
  local stage=$1       # e.g., "Infrastructure Setup"
  local tf_dir=$2      # e.g., "terraform/infra"
  local env=$3         # e.g., "dev" or "prd"
  shift 3              # Shift past the first 3 arguments
  local extra_vars=("$@") # Capture all remaining args as an array

  log_section "Terraform Deployment: $stage"

  cd "$tf_dir"
  VAR_FILE="env_${env}.tfvars"
  BACKEND_CONFIG="backend_${env}.hcl"

  terraform init -reconfigure -backend-config="$BACKEND_CONFIG" | tee -a "$LOG_FILE"
  terraform fmt | tee -a "$LOG_FILE"
  terraform validate | tee -a "$LOG_FILE"

  # Build the dynamic variable arguments string
  local var_args=()
  for var in "${extra_vars[@]}"; do
    var_args+=(-var ${var})
  done

  log_info "Running Terraform Plan with vars: ${extra_vars[*]:-(none)}"

  terraform plan -var-file="$VAR_FILE" "${var_args[@]}" | tee -a "$LOG_FILE"

  log_info "Running Terraform Apply with vars: ${extra_vars[*]:-(none)}"
  terraform apply -auto-approve -var-file="$VAR_FILE" "${var_args[@]}" | tee -a "$LOG_FILE"

  cd - >/dev/null
}

#------------------------------------------------------------------------------
# Run sanity check
#------------------------------------------------------------------------------
run_sanity_check() {
  local tf_dir=$1      # e.g., "terraform/sanity"
  local env=$2         # e.g., "dev" or "prd"

  log_section "Sanity check"

  cd "$tf_dir"

  CLOUDFRONT_DOMAIN_NAME="d1i1eokyxlrfiy.cloudfront.net"

  echo 'FAILED' > sanity-result.txt | tee -a "$LOG_FILE" && \
  ./sanity.sh --app-name ${APP_NAME} --app-version ${APP_VERSION} --cloudfront ${CLOUDFRONT_DOMAIN_NAME} | tee -a "$LOG_FILE" && \
  echo 'SUCCESS' > sanity-result.txt | tee -a "$LOG_FILE"

  cd - >/dev/null
}

#------------------------------------------------------------------------------
# Main Execution
#------------------------------------------------------------------------------
main() {
  validate_input "$@"

  export AWS_PROFILE
  ENV=$1

  generate_app_version
  update_package_json
  build_react_app

  # Step 1: Infra + Green Deployment
  run_terraform "Infrastructure Setup" "terraform/infra" "$ENV"
  run_terraform "Green Deployment" "terraform/green" "$ENV"

  # Step 2: Sanity Check
#  run_terraform "Sanity Check" "terraform/sanity" "$ENV" "app_version=${APP_VERSION}" "app_version=${APP_NAME}"
  run_sanity_check "terraform/sanity" "$ENV"

  # Step 3: Evaluate sanity check result
  SANITY_RESULT_FILE="terraform/sanity/sanity-result.txt"
  if [[ ! -f "$SANITY_RESULT_FILE" ]]; then
    log_error "Sanity result file not found at $SANITY_RESULT_FILE"
  else
    SANITY_STATUS=$(cat "$SANITY_RESULT_FILE" | tr -d '[:space:]')
    rm -f $SANITY_RESULT_FILE
    if [[ "$SANITY_STATUS" == "SUCCESS" ]]; then
      log_info "Sanity check passed — proceeding with Blue Deployment..."
      run_terraform "Blue Deployment" "terraform/blue" "$ENV"
    else
      log_error "Sanity check FAILED — skipping Blue Deployment!"
    fi
  fi

  # Step 4: Destroy Green Infra in all cases
  log_section "Destroying Green Infrastructure..."
  (cd terraform/green && terraform destroy -auto-approve -var-file="env_${ENV}.tfvars" -var "enable_service=false") | tee -a "$LOG_FILE"

  log_section "Deployment Process Completed"
}

main "$@"
