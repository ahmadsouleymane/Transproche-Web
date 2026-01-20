#!/bin/bash

# ===========================================
# TRANSPROCHE Deployment Script
# ===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR=$(dirname "$(dirname "$(readlink -f "$0")")")
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi

    log_info "All requirements met"
}

check_env_files() {
    log_info "Checking environment files..."

    if [ ! -f "$PROJECT_DIR/backend/.env.production" ]; then
        log_error "backend/.env.production not found"
        log_info "Copy backend/.env.production.example to backend/.env.production and configure it"
        exit 1
    fi

    log_info "Environment files OK"
}

build_images() {
    log_info "Building Docker images..."

    cd "$PROJECT_DIR"

    # Build with build args for frontend
    docker compose build --no-cache

    log_info "Images built successfully"
}

deploy() {
    log_info "Starting deployment..."

    cd "$PROJECT_DIR"

    # Stop existing containers
    docker compose down --remove-orphans || true

    # Start new containers
    docker compose up -d

    # Wait for health checks
    log_info "Waiting for services to be healthy..."
    sleep 10

    # Check status
    docker compose ps

    log_info "Deployment complete!"
}

setup_ssl() {
    log_info "Setting up SSL certificates with Let's Encrypt..."

    cd "$PROJECT_DIR"

    # Create directories
    mkdir -p certbot/conf certbot/www

    # Initial certificate request
    docker compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email admin@transproche.com \
        --agree-tos \
        --no-eff-email \
        -d transproche.com \
        -d www.transproche.com \
        -d api.transproche.com

    log_info "SSL certificates obtained. Restart nginx to apply."
}

show_logs() {
    cd "$PROJECT_DIR"
    docker compose logs -f "$1"
}

show_status() {
    cd "$PROJECT_DIR"
    docker compose ps
}

stop() {
    log_info "Stopping services..."
    cd "$PROJECT_DIR"
    docker compose down
    log_info "Services stopped"
}

restart() {
    log_info "Restarting services..."
    cd "$PROJECT_DIR"
    docker compose restart
    log_info "Services restarted"
}

# Main
case "$1" in
    deploy)
        check_requirements
        check_env_files
        build_images
        deploy
        ;;
    build)
        check_requirements
        build_images
        ;;
    start)
        check_requirements
        check_env_files
        deploy
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    ssl)
        setup_ssl
        ;;
    *)
        echo "Usage: $0 {deploy|build|start|stop|restart|status|logs [service]|ssl}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Build and deploy all services"
        echo "  build    - Build Docker images only"
        echo "  start    - Start services (without rebuilding)"
        echo "  stop     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  status   - Show service status"
        echo "  logs     - Show logs (optionally for specific service)"
        echo "  ssl      - Setup Let's Encrypt SSL certificates"
        exit 1
        ;;
esac
