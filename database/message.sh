#!/bin/zsh

set -e

echo "📦 Setting up Docker (rootless)..."

# Check if Docker is already installed
if command -v docker &> /dev/null; then
    echo "✅ Docker is already installed."
else
    # Download and install Docker rootless
    curl -fsSL https://get.docker.com/rootless | sh
    echo "✅ Docker rootless installed."
fi

# Set up environment variables
echo "⚙️ Setting up environment variables..."

# Remove existing Docker-related lines from .zshrc
sed -i.bak '/export PATH=\$HOME\/bin/d' ~/.zshrc
sed -i.bak '/export DOCKER_HOST/d' ~/.zshrc
sed -i.bak '/dockerd-rootless.sh/d' ~/.zshrc

# Add new environment variables
echo 'export PATH=$HOME/bin:$PATH' >> ~/.zshrc
echo 'export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock' >> ~/.zshrc
export PATH=$HOME/bin:$PATH
export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock

echo "✅ Environment configured."

# Function to check if Docker daemon is running
is_docker_running() {
    if [ -S "/run/user/$(id -u)/docker.sock" ] && docker version &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Start Docker daemon only if not already running
echo "🔍 Checking if Docker daemon is already running..."
if is_docker_running; then
    echo "✅ Docker daemon is already running."
else
    echo "🚀 Starting Docker daemon (rootless) in background..."
    
    # Kill any stale processes first
    pkill -f dockerd-rootless || true
    pkill -f rootlesskit || true
    sleep 2
    
    # Remove any stale lock files
    rm -f /run/user/$(id -u)/dockerd-rootless/lock 2>/dev/null || true
    
    # Start Docker daemon directly (not via systemd)
    nohup ~/bin/dockerd-rootless.sh > ~/docker-rootless.log 2>&1 &
    
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
        echo "❌ Docker failed to start. Check ~/docker-rootless.log for details."
        tail -20 ~/docker-rootless.log
        exit 1
    fi
fi

# Optional: install Docker Compose v2
echo "📦 Installing Docker Compose v2..."
mkdir -p ~/.docker/cli-plugins
if [ ! -f ~/.docker/cli-plugins/docker-compose ]; then
    curl -SL https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64 \
      -o ~/.docker/cli-plugins/docker-compose
    chmod +x ~/.docker/cli-plugins/docker-compose
    echo "✅ Docker Compose installed."
else
    echo "✅ Docker Compose already installed."
fi

echo 'export PATH=$HOME/.docker/cli-plugins:$PATH' >> ~/.zshrc
export PATH=$HOME/.docker/cli-plugins:$PATH

# Verify installation
echo "🔍 Verifying installation..."
docker --version
docker compose version

echo ""
echo "✅ All done! Run 'source ~/.zshrc' to apply environment changes."
