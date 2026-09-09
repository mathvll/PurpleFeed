#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DEPLOY_ROOT="$PROJECT_ROOT/deploy"
GENERATED_ROOT="$DEPLOY_ROOT/generated"
RUNTIME_DIR="$GENERATED_ROOT/runtime"
SYSTEMD_DIR="$GENERATED_ROOT/systemd"
NGINX_DIR="$GENERATED_ROOT/nginx"
REPORT_FILE="$GENERATED_ROOT/setup-report.txt"

DEFAULT_SERVICE_NAME="$(basename "$PROJECT_ROOT" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9-')"
DEFAULT_PORT="5000"
DEFAULT_HOST="127.0.0.1"
DEFAULT_SITE_NAME="curtidas.online"
DEFAULT_SITE_DESCRIPTION="Curtidas, seguidores e visualizacoes para fortalecer sua presenca no Instagram."
DEFAULT_APP_URL="https://curtidas.online"
DEFAULT_SITE_URL="https://curtidas.online"
DEFAULT_CTA_URL="${DEFAULT_APP_URL%/}/"
DEFAULT_ONBOARDING_URL="${DEFAULT_APP_URL%/}/"
DEFAULT_WHATSAPP_PHONE="5522992829808"
DEFAULT_WHATSAPP_DISPLAY="+55 22 99282-9808"
DEFAULT_WHATSAPP_MESSAGE="Olá, gostaria de saber mais sobre os pacotes da curtidas.online"
DEFAULT_HERO_PREFIX="Aumente suas"
DEFAULT_HERO_HIGHLIGHT="curtidas no Instagram"
DEFAULT_HERO_SUBTITLE="Pacotes rápidos de curtidas, seguidores e visualizações para deixar seu perfil mais forte."
DEFAULT_SECTION_TITLE="Escolha seu pacote"
DEFAULT_SECTION_SUBTITLE="Encontre a opção ideal e comece a aumentar sua presença agora."
DEFAULT_CTA_LABEL="Começar agora"
DEFAULT_SELECTION_HINT="Selecione uma rede para continuar."
DEFAULT_FOOTER_TEXT="Mais curtidas, mais presença, mais confiança."
DEFAULT_FOLLOW_UP_TITLE="Deu tudo certo com seu pedido?"
DEFAULT_FOLLOW_UP_BODY="Se precisar de ajuda com seu pacote ou pedido, fale com nosso atendimento."

DEPLOY_SCOPE="both"
EXPOSURE_SCOPE="external"
APPLY_SYSTEM_CONFIG="no"
RUN_LOCAL_SMOKE="yes"
RUN_TYPECHECK="yes"
ENABLE_TLS="no"

APP_NAME="$DEFAULT_SITE_NAME"
SITE_NAME="$DEFAULT_SITE_NAME"
SITE_DESCRIPTION="$DEFAULT_SITE_DESCRIPTION"
SITE_URL="$DEFAULT_SITE_URL"
APP_URL="$DEFAULT_APP_URL"
CTA_URL="$DEFAULT_CTA_URL"
ONBOARDING_URL="$DEFAULT_ONBOARDING_URL"
GA4_ID=""
GOOGLE_ADS_ID=""
WHATSAPP_PHONE="$DEFAULT_WHATSAPP_PHONE"
WHATSAPP_DISPLAY="$DEFAULT_WHATSAPP_DISPLAY"
WHATSAPP_MESSAGE="$DEFAULT_WHATSAPP_MESSAGE"
HERO_PREFIX="$DEFAULT_HERO_PREFIX"
HERO_HIGHLIGHT="$DEFAULT_HERO_HIGHLIGHT"
HERO_SUBTITLE="$DEFAULT_HERO_SUBTITLE"
SECTION_TITLE="$DEFAULT_SECTION_TITLE"
SECTION_SUBTITLE="$DEFAULT_SECTION_SUBTITLE"
CTA_LABEL="$DEFAULT_CTA_LABEL"
SELECTION_HINT="$DEFAULT_SELECTION_HINT"
FOOTER_TEXT="$DEFAULT_FOOTER_TEXT"
FOLLOW_UP_TITLE="$DEFAULT_FOLLOW_UP_TITLE"
FOLLOW_UP_BODY="$DEFAULT_FOLLOW_UP_BODY"

SERVICE_NAME="$DEFAULT_SERVICE_NAME"
APP_PORT="$DEFAULT_PORT"
APP_HOST="$DEFAULT_HOST"
SERVICE_USER="${SUDO_USER:-${USER:-$(id -un)}}"
SERVICE_GROUP="$SERVICE_USER"
NGINX_CERT_FILE=""
NGINX_KEY_FILE=""
INTERNAL_LANDING_URL=""
EXTERNAL_LANDING_URL=""

declare -a REQUIRED_PATHS=(
  "$PROJECT_ROOT/package.json"
  "$PROJECT_ROOT/server/index.ts"
  "$PROJECT_ROOT/server/vite.ts"
  "$PROJECT_ROOT/client/index.html"
  "$PROJECT_ROOT/client/src/main.tsx"
)

log() {
  printf '[INFO] %s\n' "$*"
}

ok() {
  printf '[OK] %s\n' "$*"
}

warn() {
  printf '[WARN] %s\n' "$*" >&2
}

fail() {
  printf '[FAIL] %s\n' "$*" >&2
  exit 1
}

require_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    fail "Missing required command: $command_name"
  fi
}

prompt_value() {
  local target_var="$1"
  local question="$2"
  local default_value="${3:-}"
  local answer=""

  if [[ -t 0 && -t 1 ]]; then
    if [[ -n "$default_value" ]]; then
      read -r -e -i "$default_value" -p "$question: " answer || true
    else
      read -r -e -p "$question: " answer || true
    fi
  else
    if [[ -n "$default_value" ]]; then
      read -r -p "$question [$default_value]: " answer || true
    else
      read -r -p "$question: " answer || true
    fi
  fi

  answer="$(trim_whitespace "$answer")"
  if [[ -z "$answer" ]]; then
    answer="$default_value"
  fi

  printf -v "$target_var" '%s' "$answer"
}

prompt_required() {
  local target_var="$1"
  local question="$2"
  local default_value="${3:-}"
  local answer=""

  while :; do
    prompt_value answer "$question" "$default_value"
    if [[ -n "$answer" ]]; then
      break
    fi
    warn "This value is required."
  done

  printf -v "$target_var" '%s' "$answer"
}

prompt_choice() {
  local target_var="$1"
  local question="$2"
  local default_value="$3"
  shift 3
  local options=("$@")
  local answer=""

  while :; do
    printf '\n%s\n' "$question"
    local index=1
    for option in "${options[@]}"; do
      printf '  %s) %s\n' "$index" "$option"
      index=$((index + 1))
    done
    read -r -p "Choose [$default_value]: " answer || true
    answer="${answer:-$default_value}"
    case "$answer" in
      1) answer="${options[0]}";;
      2) answer="${options[1]:-${options[0]}}";;
      3) answer="${options[2]:-${options[0]}}";;
      *) ;;
    esac
    if [[ -n "$answer" ]]; then
      break
    fi
  done

  printf -v "$target_var" '%s' "$answer"
}

prompt_yes_no() {
  local target_var="$1"
  local question="$2"
  local default_value="${3:-yes}"
  local answer=""
  local prompt_default="y/N"

  if [[ "$default_value" == "yes" ]]; then
    prompt_default="Y/n"
  fi

  while :; do
    read -r -p "$question [$prompt_default]: " answer || true
    answer="${answer:-$default_value}"
    case "${answer,,}" in
      y|yes) printf -v "$target_var" '%s' "yes"; return 0;;
      n|no) printf -v "$target_var" '%s' "no"; return 0;;
    esac
    warn "Please answer yes or no."
  done
}

normalize_url() {
  local raw_value="$1"
  raw_value="$(trim_whitespace "$raw_value")"
  raw_value="${raw_value%/}"
  if [[ "$raw_value" =~ ^https?:// ]]; then
    printf '%s' "$raw_value"
  else
    printf 'https://%s' "$raw_value"
  fi
}

trim_whitespace() {
  local value="$1"
  local extglob_state

  extglob_state="$(shopt -p extglob 2>/dev/null || true)"
  shopt -s extglob
  value="${value##+([[:space:]])}"
  value="${value%%+([[:space:]])}"

  if [[ -n "$extglob_state" ]]; then
    eval "$extglob_state"
  else
    shopt -u extglob
  fi

  printf '%s' "$value"
}

url_host() {
  local raw_value="$1"
  raw_value="${raw_value#http://}"
  raw_value="${raw_value#https://}"
  printf '%s' "${raw_value%%/*}"
}

escape_env_value() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  printf '%s' "$value"
}

join_by_space() {
  local IFS=" "
  echo "$*"
}

check_repo_layout() {
  log "Evaluating repo layout"
  local path
  for path in "${REQUIRED_PATHS[@]}"; do
    if [[ ! -e "$path" ]]; then
      fail "Required path missing: $path"
    fi
    ok "Found $path"
  done
  if [[ ! -d "$PROJECT_ROOT/.git" ]]; then
    warn "This directory does not look like a git repo root. Continuing with filesystem paths only."
  else
    ok "Git repo root confirmed"
  fi
}

check_commands() {
  log "Evaluating local tooling"
  require_command node
  require_command npm
  require_command curl
  ok "node: $(command -v node)"
  ok "npm: $(command -v npm)"
  ok "curl: $(command -v curl)"

  if command -v systemctl >/dev/null 2>&1; then
    ok "systemctl: $(command -v systemctl)"
  else
    warn "systemctl not available. Production install will generate files only."
  fi

  if command -v nginx >/dev/null 2>&1; then
    ok "nginx: $(command -v nginx)"
  else
    warn "nginx not available. Nginx validation/install will be skipped."
  fi
}

collect_configuration() {
  log "Collecting setup choices"

  prompt_choice DEPLOY_SCOPE "Deployment scope" "3" "local only" "production only" "local + production"
  prompt_choice EXPOSURE_SCOPE "Landing exposure" "2" "internal only" "external only" "internal + external"

  prompt_value SERVICE_NAME "Systemd/nginx service name" "$DEFAULT_SERVICE_NAME"
  prompt_value APP_PORT "App port" "$DEFAULT_PORT"
  prompt_value APP_HOST "App bind host" "$DEFAULT_HOST"
  prompt_value SERVICE_USER "Systemd service user" "$SERVICE_USER"
  prompt_value SERVICE_GROUP "Systemd service group" "$SERVICE_GROUP"

  case "$EXPOSURE_SCOPE" in
    "internal only")
      prompt_required INTERNAL_LANDING_URL "Internal landing URL" "$DEFAULT_SITE_URL"
      EXTERNAL_LANDING_URL=""
      ;;
    "external only")
      prompt_required EXTERNAL_LANDING_URL "External landing URL" "$DEFAULT_SITE_URL"
      INTERNAL_LANDING_URL=""
      ;;
    "internal + external")
      prompt_required INTERNAL_LANDING_URL "Internal landing URL" "$DEFAULT_SITE_URL"
      prompt_required EXTERNAL_LANDING_URL "External landing URL" "$DEFAULT_SITE_URL"
      ;;
  esac

  if [[ -n "$EXTERNAL_LANDING_URL" ]]; then
    SITE_URL="$(normalize_url "$EXTERNAL_LANDING_URL")"
  else
    SITE_URL="$(normalize_url "$INTERNAL_LANDING_URL")"
  fi
  INTERNAL_LANDING_URL="$(normalize_url "${INTERNAL_LANDING_URL:-$SITE_URL}")"
  EXTERNAL_LANDING_URL="${EXTERNAL_LANDING_URL:-}"
  if [[ -n "$EXTERNAL_LANDING_URL" ]]; then
    EXTERNAL_LANDING_URL="$(normalize_url "$EXTERNAL_LANDING_URL")"
  fi

  prompt_value APP_URL "App base URL used by CTA targets" "$DEFAULT_APP_URL"
  APP_URL="$(normalize_url "$APP_URL")"
  prompt_value CTA_URL "Homepage CTA URL" "${APP_URL%/}/"
  CTA_URL="$(normalize_url "$CTA_URL")"
  prompt_value ONBOARDING_URL "Onboarding CTA URL" "${APP_URL%/}/impulsionar"
  ONBOARDING_URL="$(normalize_url "$ONBOARDING_URL")"

  prompt_value APP_NAME "Brand/app name" "$DEFAULT_SITE_NAME"
  prompt_value SITE_NAME "Site name" "$APP_NAME"
  prompt_value SITE_DESCRIPTION "Site description" "$DEFAULT_SITE_DESCRIPTION"
  prompt_value GA4_ID "GA4 measurement id" ""
  prompt_value GOOGLE_ADS_ID "Google Ads measurement id" ""

  prompt_value WHATSAPP_PHONE "WhatsApp phone" "$DEFAULT_WHATSAPP_PHONE"
  prompt_value WHATSAPP_DISPLAY "WhatsApp display phone" "$DEFAULT_WHATSAPP_DISPLAY"
  prompt_value WHATSAPP_MESSAGE "WhatsApp message" "$DEFAULT_WHATSAPP_MESSAGE"

  prompt_value HERO_PREFIX "Hero title prefix" "$DEFAULT_HERO_PREFIX"
  prompt_value HERO_HIGHLIGHT "Hero title highlight" "$DEFAULT_HERO_HIGHLIGHT"
  prompt_value HERO_SUBTITLE "Hero subtitle" "$DEFAULT_HERO_SUBTITLE"
  prompt_value SECTION_TITLE "Section title" "$DEFAULT_SECTION_TITLE"
  prompt_value SECTION_SUBTITLE "Section subtitle" "$DEFAULT_SECTION_SUBTITLE"
  prompt_value CTA_LABEL "CTA label" "$DEFAULT_CTA_LABEL"
  prompt_value SELECTION_HINT "Selection hint" "$DEFAULT_SELECTION_HINT"
  prompt_value FOOTER_TEXT "Footer text" "$DEFAULT_FOOTER_TEXT"
  prompt_value FOLLOW_UP_TITLE "Follow-up title" "$DEFAULT_FOLLOW_UP_TITLE"
  prompt_value FOLLOW_UP_BODY "Follow-up body" "$DEFAULT_FOLLOW_UP_BODY"

  prompt_yes_no RUN_TYPECHECK "Run npm run check after install" "yes"
  prompt_yes_no RUN_LOCAL_SMOKE "Run local build/start smoke test" "yes"
  prompt_yes_no ENABLE_TLS "Generate nginx TLS directives" "no"
  if [[ "$ENABLE_TLS" == "yes" ]]; then
    prompt_required NGINX_CERT_FILE "TLS certificate path" "/etc/ssl/certs/${SERVICE_NAME}.crt"
    prompt_required NGINX_KEY_FILE "TLS private key path" "/etc/ssl/private/${SERVICE_NAME}.key"
  fi

  if [[ "$DEPLOY_SCOPE" != "local only" ]]; then
    prompt_yes_no APPLY_SYSTEM_CONFIG "Install systemd/nginx files into /etc now" "no"
  else
    APPLY_SYSTEM_CONFIG="no"
  fi
}

write_env_file() {
  local file_path="$1"
  local node_env_value="$2"
  local primary_landing_url="$3"

  mkdir -p "$(dirname "$file_path")"
  cat >"$file_path" <<EOF
# Generated by setup.sh on $(date -u +"%Y-%m-%dT%H:%M:%SZ")
APP_ROOT="$(escape_env_value "$PROJECT_ROOT")"
NODE_ENV="$node_env_value"
HOST="$(escape_env_value "$APP_HOST")"
PORT="$(escape_env_value "$APP_PORT")"

VITE_BRAND_NAME="$(escape_env_value "$APP_NAME")"
VITE_SITE_NAME="$(escape_env_value "$SITE_NAME")"
VITE_SITE_URL="$(escape_env_value "$primary_landing_url")"
VITE_SITE_DESCRIPTION="$(escape_env_value "$SITE_DESCRIPTION")"
VITE_APP_URL="$(escape_env_value "$APP_URL")"
VITE_CTA_URL="$(escape_env_value "$CTA_URL")"
VITE_ONBOARDING_URL="$(escape_env_value "$ONBOARDING_URL")"
VITE_GA4_ID="$(escape_env_value "$GA4_ID")"
VITE_GOOGLE_ADS_ID="$(escape_env_value "$GOOGLE_ADS_ID")"
VITE_HOME_PAGE_TITLE="$(escape_env_value "$SITE_NAME") | Página inicial"
VITE_ONBOARDING_PAGE_TITLE="$(escape_env_value "$SITE_NAME") | Onboarding"

VITE_HERO_TITLE_PREFIX="$(escape_env_value "$HERO_PREFIX")"
VITE_HERO_TITLE_HIGHLIGHT="$(escape_env_value "$HERO_HIGHLIGHT")"
VITE_HERO_SUBTITLE="$(escape_env_value "$HERO_SUBTITLE")"
VITE_SECTION_TITLE="$(escape_env_value "$SECTION_TITLE")"
VITE_SECTION_SUBTITLE="$(escape_env_value "$SECTION_SUBTITLE")"
VITE_CTA_LABEL="$(escape_env_value "$CTA_LABEL")"
VITE_ONBOARDING_SELECTION_HINT="$(escape_env_value "$SELECTION_HINT")"
VITE_FOOTER_TEXT="$(escape_env_value "$FOOTER_TEXT")"
VITE_FOLLOW_UP_TITLE="$(escape_env_value "$FOLLOW_UP_TITLE")"
VITE_FOLLOW_UP_BODY="$(escape_env_value "$FOLLOW_UP_BODY")"

VITE_WHATSAPP_PHONE="$(escape_env_value "$WHATSAPP_PHONE")"
VITE_WHATSAPP_DISPLAY_PHONE="$(escape_env_value "$WHATSAPP_DISPLAY")"
VITE_WHATSAPP_MESSAGE="$(escape_env_value "$WHATSAPP_MESSAGE")"

# Compatibility aliases for the existing client config helpers.
VITE_GA4_MEASUREMENT_ID="$(escape_env_value "$GA4_ID")"
VITE_GOOGLE_ADS_MEASUREMENT_ID="$(escape_env_value "$GOOGLE_ADS_ID")"
VITE_HOME_CTA_URL="$(escape_env_value "$CTA_URL")"
VITE_ONBOARDING_CTA_URL="$(escape_env_value "$ONBOARDING_URL")"
VITE_WHATSAPP_PHONE_NUMBER="$(escape_env_value "$WHATSAPP_PHONE")"
EOF
}

build_server_name_list() {
  local names=()
  if [[ -n "$INTERNAL_LANDING_URL" ]]; then
    names+=("$(url_host "$INTERNAL_LANDING_URL")")
  fi
  if [[ -n "$EXTERNAL_LANDING_URL" ]]; then
    names+=("$(url_host "$EXTERNAL_LANDING_URL")")
  fi
  join_by_space "${names[@]}"
}

write_systemd_unit() {
  local unit_path="$1"
  local npm_bin="$2"
  mkdir -p "$(dirname "$unit_path")"
  cat >"$unit_path" <<EOF
[Unit]
Description=$SITE_NAME
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_GROUP
WorkingDirectory=$PROJECT_ROOT
Environment=NODE_ENV=production
Environment=APP_ROOT=$PROJECT_ROOT
Environment=HOST=$APP_HOST
Environment=PORT=$APP_PORT
EnvironmentFile=$PROJECT_ROOT/.env.production
ExecStart=$npm_bin run start
Restart=always
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF
}

write_nginx_conf() {
  local conf_path="$1"
  local server_names="$2"
  mkdir -p "$(dirname "$conf_path")"
  if [[ "$ENABLE_TLS" == "yes" ]]; then
    cat >"$conf_path" <<EOF
server {
  listen 80;
  server_name $server_names;
  return 301 https://\$host\$request_uri;
}

server {
  listen 443 ssl http2;
  server_name $server_names;

  ssl_certificate $NGINX_CERT_FILE;
  ssl_certificate_key $NGINX_KEY_FILE;

  location / {
    proxy_pass http://$APP_HOST:$APP_PORT;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
EOF
  else
    cat >"$conf_path" <<EOF
server {
  listen 80;
  server_name $server_names;

  location / {
    proxy_pass http://$APP_HOST:$APP_PORT;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
EOF
  fi
}

stage_summary() {
  mkdir -p "$GENERATED_ROOT"
  cat >"$REPORT_FILE" <<EOF
Setup report generated on $(date -u +"%Y-%m-%dT%H:%M:%SZ")

Project root: $PROJECT_ROOT
Deployment scope: $DEPLOY_SCOPE
Exposure scope: $EXPOSURE_SCOPE
Service name: $SERVICE_NAME
Service user: $SERVICE_USER
App host: $APP_HOST
App port: $APP_PORT
Landing URL(s): ${INTERNAL_LANDING_URL}${EXTERNAL_LANDING_URL:+ | $EXTERNAL_LANDING_URL}
Site URL: $SITE_URL
App URL: $APP_URL
CTA URL: $CTA_URL
Onboarding URL: $ONBOARDING_URL
GA4 id: ${GA4_ID:-<empty>}
Google Ads id: ${GOOGLE_ADS_ID:-<empty>}
TLS enabled: $ENABLE_TLS
EOF
}

local_smoke_test() {
  log "Running local smoke test"
  local log_file
  log_file="$(mktemp)"
  local pid=""
  local smoke_url="http://$APP_HOST:$APP_PORT"

  (
    cd "$PROJECT_ROOT"
    APP_ROOT="$PROJECT_ROOT" HOST="$APP_HOST" PORT="$APP_PORT" NODE_ENV=production npm run start
  ) >"$log_file" 2>&1 &
  pid="$!"

  cleanup() {
    if [[ -n "${pid:-}" ]]; then
      kill "$pid" >/dev/null 2>&1 || true
      wait "$pid" >/dev/null 2>&1 || true
    fi
    rm -f "$log_file"
  }
  trap cleanup RETURN

  local attempts=0
  until curl -fsS "$smoke_url" >/dev/null 2>&1; do
    attempts=$((attempts + 1))
    if [[ $attempts -ge 30 ]]; then
      warn "Smoke test did not answer on $smoke_url"
      warn "Server log:"
      sed -n '1,80p' "$log_file" || true
      return 1
    fi
    sleep 1
  done

  ok "Smoke test passed on $smoke_url"
  curl -fsS "$smoke_url/onboarding" >/dev/null 2>&1 && ok "Onboarding route answered" || warn "Onboarding route returned an error"
}

run_install() {
  log "Installing dependencies"
  local install_cmd="npm ci"
  if [[ ! -f "$PROJECT_ROOT/package-lock.json" ]]; then
    install_cmd="npm install"
  fi
  (
    cd "$PROJECT_ROOT"
    eval "$install_cmd"
  )
  ok "Dependencies installed"
}

run_typecheck() {
  log "Running type check"
  if (cd "$PROJECT_ROOT" && npm run check); then
    ok "Type check passed"
    return 0
  fi
  warn "Type check failed"
  return 1
}

run_build() {
  log "Running build"
  (cd "$PROJECT_ROOT" && npm run build)
  ok "Build completed"
}

validate_generated_files() {
  local service_names
  service_names="$(build_server_name_list)"
  if [[ -z "$service_names" ]]; then
    fail "No landing server_name could be derived from the configured URLs"
  fi

  if [[ ! -f "$PROJECT_ROOT/.env.production" ]]; then
    fail ".env.production was not generated"
  fi

  if [[ ! -f "$PROJECT_ROOT/.env.local" ]]; then
    fail ".env.local was not generated"
  fi

  if [[ ! -f "$PROJECT_ROOT/.env" ]]; then
    fail ".env was not generated"
  fi

  if [[ ! -f "$SYSTEMD_DIR/$SERVICE_NAME.service" ]]; then
    fail "Systemd unit was not generated"
  fi

  if [[ ! -f "$NGINX_DIR/$SERVICE_NAME.conf" ]]; then
    fail "Nginx config was not generated"
  fi

  grep -q "WorkingDirectory=$PROJECT_ROOT" "$SYSTEMD_DIR/$SERVICE_NAME.service" || fail "Systemd WorkingDirectory mismatch"
  grep -q "Environment=PORT=$APP_PORT" "$SYSTEMD_DIR/$SERVICE_NAME.service" || fail "Systemd PORT mismatch"
  grep -q "proxy_pass http://$APP_HOST:$APP_PORT;" "$NGINX_DIR/$SERVICE_NAME.conf" || fail "Nginx upstream mismatch"
  grep -q "server_name $service_names;" "$NGINX_DIR/$SERVICE_NAME.conf" || fail "Nginx server_name mismatch"
  ok "Generated paths line up with the repo root and app port"
}

install_system_configs() {
  if [[ "$APPLY_SYSTEM_CONFIG" != "yes" ]]; then
    warn "System install skipped by choice"
    return 0
  fi

  if [[ "$(uname -s)" != "Linux" ]]; then
    warn "systemd/nginx install is only supported on Linux. Files were generated under deploy/generated."
    return 0
  fi

  if ! command -v systemctl >/dev/null 2>&1; then
    warn "systemctl is not available. Skipping system install."
    return 0
  fi

  if ! command -v nginx >/dev/null 2>&1; then
    warn "nginx is not available. Skipping nginx install."
    return 0
  fi

  local sudo_cmd=()
  if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
    if command -v sudo >/dev/null 2>&1; then
      sudo_cmd=(sudo)
    else
      fail "Root access is required to install systemd/nginx files and sudo is missing"
    fi
  fi

  local available_site_name
  available_site_name="/etc/nginx/sites-available/$SERVICE_NAME.conf"
  local enabled_site_name
  enabled_site_name="/etc/nginx/sites-enabled/$SERVICE_NAME.conf"
  local systemd_target="/etc/systemd/system/$SERVICE_NAME.service"

  log "Installing systemd unit to $systemd_target"
  "${sudo_cmd[@]}" install -Dm644 "$SYSTEMD_DIR/$SERVICE_NAME.service" "$systemd_target"

  log "Installing nginx config to $available_site_name"
  "${sudo_cmd[@]}" install -Dm644 "$NGINX_DIR/$SERVICE_NAME.conf" "$available_site_name"
  "${sudo_cmd[@]}" ln -sfn "$available_site_name" "$enabled_site_name"

  log "Validating nginx config"
  "${sudo_cmd[@]}" nginx -t

  log "Reloading systemd and nginx"
  "${sudo_cmd[@]}" systemctl daemon-reload
  "${sudo_cmd[@]}" systemctl enable "$SERVICE_NAME"
  "${sudo_cmd[@]}" systemctl restart "$SERVICE_NAME"
  "${sudo_cmd[@]}" systemctl reload nginx

  ok "System files installed and services reloaded"
}

print_plan() {
  printf '\n=== Setup plan ===\n'
  printf 'Repo root: %s\n' "$PROJECT_ROOT"
  printf 'Service name: %s\n' "$SERVICE_NAME"
  printf 'Exposure scope: %s\n' "$EXPOSURE_SCOPE"
  printf 'Landing URL(s): %s%s\n' "$INTERNAL_LANDING_URL" "${EXTERNAL_LANDING_URL:+ | $EXTERNAL_LANDING_URL}"
  printf 'App URL: %s\n' "$APP_URL"
  printf 'CTA URL: %s\n' "$CTA_URL"
  printf 'Onboarding URL: %s\n' "$ONBOARDING_URL"
  printf 'Port: %s\n' "$APP_PORT"
  printf 'Host: %s\n' "$APP_HOST"
  printf 'Systemd user/group: %s / %s\n' "$SERVICE_USER" "$SERVICE_GROUP"
  printf 'TLS: %s\n' "$ENABLE_TLS"
  if [[ "$ENABLE_TLS" == "yes" ]]; then
    printf 'TLS cert: %s\n' "$NGINX_CERT_FILE"
    printf 'TLS key: %s\n' "$NGINX_KEY_FILE"
  fi
  printf 'Local smoke: %s\n' "$RUN_LOCAL_SMOKE"
  printf 'Type check: %s\n' "$RUN_TYPECHECK"
  printf 'Apply system configs: %s\n' "$APPLY_SYSTEM_CONFIG"
  printf '==================\n\n'
}

main() {
  cd "$PROJECT_ROOT"
  mkdir -p "$RUNTIME_DIR" "$SYSTEMD_DIR" "$NGINX_DIR"

  check_repo_layout
  check_commands
  collect_configuration
  print_plan
  prompt_yes_no CONTINUE_SETUP "Proceed with these settings" "yes"
  if [[ "$CONTINUE_SETUP" != "yes" ]]; then
    warn "Setup cancelled"
    exit 0
  fi

  local primary_landing_url
  primary_landing_url="$SITE_URL"

  write_env_file "$PROJECT_ROOT/.env" "production" "$primary_landing_url"
  write_env_file "$PROJECT_ROOT/.env.local" "development" "$primary_landing_url"
  write_env_file "$PROJECT_ROOT/.env.production" "production" "$primary_landing_url"
  ok "Environment files generated"

  stage_summary

  local npm_bin
  npm_bin="$(command -v npm)"
  write_systemd_unit "$SYSTEMD_DIR/$SERVICE_NAME.service" "$npm_bin"
  write_nginx_conf "$NGINX_DIR/$SERVICE_NAME.conf" "$(build_server_name_list)"
  ok "Systemd and nginx configs generated"

  validate_generated_files

  if [[ "$DEPLOY_SCOPE" != "production only" ]]; then
    run_install
    if [[ "$RUN_TYPECHECK" == "yes" ]]; then
      run_typecheck || true
    fi
    run_build
    if [[ "$RUN_LOCAL_SMOKE" == "yes" ]]; then
      local_smoke_test || true
    fi
  fi

  if [[ "$DEPLOY_SCOPE" != "local only" ]]; then
    install_system_configs
  fi

  printf '\nGenerated artifacts:\n'
  printf '  - %s\n' "$PROJECT_ROOT/.env"
  printf '  - %s\n' "$PROJECT_ROOT/.env.local"
  printf '  - %s\n' "$PROJECT_ROOT/.env.production"
  printf '  - %s\n' "$SYSTEMD_DIR/$SERVICE_NAME.service"
  printf '  - %s\n' "$NGINX_DIR/$SERVICE_NAME.conf"
  printf '  - %s\n' "$REPORT_FILE"
  printf '\nNext checks:\n'
  printf '  1) Review the generated env files and confirm the CTA/app domains.\n'
  printf '  2) If production was selected, ensure DNS points to the nginx host.\n'
  printf '  3) If TLS is enabled, verify cert paths and run `nginx -t` again after deployment.\n'
}

main "$@"
