#!/bin/zsh

set -e

echo "📦 Setting up Docker (rootless)..."

# Check if Docker is already installed and working
if command -v docker &> /dev/null && docker version &> /dev/null; then
    echo "✅ Docker is already installed and running."
else
    echo "🔄 Installing Docker rootless..."
    
    # Remove old installation
    rm -rf ~/bin/docker* ~/.local/bin/docker* || true
    pkill -f dockerd || true
    pkill -f rootlesskit || true
    
    # Install with force flag
    curl -fsSL https://get.docker.com/rootless | FORCE=1 sh
    echo "✅ Docker rootless installed."
fi

# Set up environment variables
echo "⚙️ Setting up environment variables..."

# Remove existing Docker-related lines from .zshrc
sed -i.bak '/export PATH.*bin/d' ~/.zshrc
sed -i.bak '/export DOCKER_HOST/d' ~/.zshrc
sed -i.bak '/dockerd-rootless.sh/d' ~/.zshrc

# Add new environment variables
cat >> ~/.zshrc << 'EOF'
# Docker rootless
export PATH=$HOME/bin:$PATH
export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock
EOF

source ~/.zshrc

echo "✅ Environment configured."

# Function to check if Docker daemon is running
is_docker_running() {
    if [ -S "$XDG_RUNTIME_DIR/docker.sock" ] && docker version &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Start Docker daemon
echo "🔍 Checking if Docker daemon is running..."
if is_docker_running; then
    echo "✅ Docker daemon is already running."
else
    echo "🚀 Starting Docker daemon..."
    
    # Kill any stale processes
    pkill -f dockerd || true
    pkill -f rootlesskit || true
    sleep 2
    
    # Start via systemd user service if available
    if systemctl --user start docker 2>/dev/null; then
        echo "✅ Started via systemd"
    else
        # Fallback to manual start
        nohup ~/bin/dockerd-rootless.sh > ~/docker-rootless.log 2>&1 &
    fi
    
    # Wait for Docker to start
    echo "⏳ Waiting for Docker to start..."
    for i in {1..30}; do
        if is_docker_running; then
            echo "✅ Docker daemon started successfully."
            break
        fi
        sleep 1
    done
    
    if ! is_docker_running; then
        echo "❌ Docker failed to start. Check ~/docker-rootless.log"
        echo "📋 Last 10 lines of log:"
        tail -10 ~/docker-rootless.log
        exit 1
    fi
fi

# Install Docker Compose
echo "📦 Installing Docker Compose v2..."
mkdir -p ~/.docker/cli-plugins
COMPOSE_URL="https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-$(uname -m)"
curl -SL $COMPOSE_URL -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose

echo 'export PATH=$HOME/.docker/cli-plugins:$PATH' >> ~/.zshrc
export PATH=$HOME/.docker/cli-plugins:$PATH

# Verify installation
echo "🔍 Verifying installation..."
docker --version
docker compose version

echo ""
echo "🎉 Docker rootless setup complete!"
echo "💡 Run 'source ~/.zshrc' or restart your terminal to apply changes."