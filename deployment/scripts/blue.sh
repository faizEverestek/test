#!/bin/bash
################################################################################
# Script Name  : blue.sh
# Description  : Deploy blue environment for Agilery Portal
################################################################################

set -euo pipefail

log_section() { echo -e "\n================== $* ==================\n"; }

run_terraform() {
  local tf_dir=$1
  local env=$2

  log_section "Deploying Blue Environment for $env"

  cd "$tf_dir"
  terraform init -reconfigure -backend-config="backend_${env}.hcl"
  terraform fmt
  terraform validate
  terraform apply -auto-approve -var-file="env_${env}.tfvars"
  cd - >/dev/null
}

ENV=$1
run_terraform "terraform/blue" "$ENV"
