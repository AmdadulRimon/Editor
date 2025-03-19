#!/bin/bash
set -e # Exit immediately if a command exits with non-zero status

# Define colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Define variables
PROJECT_DIR=~/Editor
SSH_KEY=~/.ssh/editor_pipeline
PM2_APP_NAME=editor
DEPLOY_URL="https://editor.monsterstudio.co"
LOG_FILE="$PROJECT_DIR/deploy_$(date +%Y%m%d_%H%M%S).log"

# Function for logging
log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo -e "${GREEN}$msg${NC}"
  echo "$msg" >>"$LOG_FILE"
}

error() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1"
  echo -e "${RED}$msg${NC}"
  echo "$msg" >>"$LOG_FILE"
  exit 1
}

warning() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1"
  echo -e "${YELLOW}$msg${NC}"
  echo "$msg" >>"$LOG_FILE"
}

# Start deployment
log "Starting deployment"
log "Deployment log will be saved to: $LOG_FILE"

# Navigate to project directory
log "Changing to project directory"
cd "$PROJECT_DIR" || error "Failed to change to project directory $PROJECT_DIR"

# Set up SSH agent
log "Setting up SSH agent"
eval "$(ssh-agent -s)" || warning "SSH agent initialization had issues"
ssh-add "$SSH_KEY" || error "Failed to add SSH key $SSH_KEY"

# Pull latest code
log "Checking out development branch"
git checkout development || error "Failed to checkout development branch"

log "Pulling latest changes"
git pull || error "Failed to pull latest changes"

# Install dependencies
log "Installing dependencies"
pnpm install || error "Failed to install dependencies"

# Build application
log "Building application"
pnpm build || error "Failed to build application"

# Reload services
log "Reloading PM2"
pm2 reload "$PM2_APP_NAME" || error "Failed to reload PM2 application $PM2_APP_NAME"

log "Reloading Nginx"
sudo systemctl reload nginx || error "Failed to reload Nginx"

# Verify deployment
log "Checking if application is accessible"
sleep 5
if curl -s --head "localhost:3000" | grep "200 OK" >/dev/null; then
  log "Application is accessible at: $DEPLOY_URL"
else
  warning "Application might not be accessible. Please verify manually at: $DEPLOY_URL"
fi

log "Deployment completed successfully"
echo -e "\n${GREEN}Deployment completed! Access the application at: $DEPLOY_URL${NC}"
