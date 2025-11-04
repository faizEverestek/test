#!/bin/bash
################################################################################
# Script Name  : green.sh
# Description  : Deploy or destroy green infrastructure
################################################################################

set -euo pipefail

log_section() { echo -e "\n================== $* ==================\n"; }

run_terraform() {
  local tf_dir=$1
  local env=$2
  local action=${3:-apply}

  log_section "Green Environment: ${action^} for $env"

  cd "$tf_dir"
  terraform init -reconfigure -backend-config="backend_${env}.hcl"
  terraform fmt
  terraform validate

  if [[ "$action" == "destroy" ]]; then
    terraform apply -auto-approve -var-file="env_${env}.tfvars" -var "enable_service=false"
  else
    terraform apply -auto-approve -var-file="env_${env}.tfvars"
  fi

  cd - >/dev/null
}

ENV=$1
ACTION=${2:-apply}
run_terraform "terraform/green" "$ENV" "$ACTION"
