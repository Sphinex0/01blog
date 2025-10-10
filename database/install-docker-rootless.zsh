#!/bin/zsh

set -e

echo "📦 Installing Docker (rootless)..."

# Clean up any existing installation first
if [ -f "$HOME/bin/dockerd" ]; then
    echo "🧹 Cleaning up existing Docker installation..."
    systemctl --user stop docker.service 2>/dev/null || true
    pkill -f dockerd-rootless.sh 2>/dev/null || true
    rm -f "$HOME/bin/dockerd"
    "$HOME/bin/dockerd-rootless-setuptool.sh" uninstall -f 2>/dev/null || true
fi.

# Download and install Docker rootless
curl -fsSL https://get.docker.com/rootless | sh

echo "✅ Docker rootless installed."

# Set up environment variables first
echo "⚙️ Setting up environment variables..."
echo 'export PATH=$HOME/bin:$PATH' >> ~/.zshrc
echo 'export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock' >> ~/.zshrc
export PATH=$HOME/bin:$PATH
export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock

echo "✅ Environment configured."

# Run rootless setup with skip-iptables
echo "⚙️ Running dockerd-rootless-setuptool.sh with --skip-iptables..."
if ! ~/bin/dockerd-rootless-setuptool.sh install --skip-iptables; then
    echo "⚠️ Setup tool encountered errors, but continuing..."
    
    # Manual fallback: start Docker manually
    echo "🚀 Starting Docker daemon manually..."
    nohup ~/bin/dockerd-rootless.sh > ~/docker-rootless.log 2>&1 &
    sleep 5 # Give it time to start
fi

echo "✅ Docker setup completed."

# Install Docker Compose v2
echo "📦 Installing Docker Compose v2..."
mkdir -p ~/.docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64 \
  -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose

echo 'export PATH=$HOME/.docker/cli-plugins:$PATH' >> ~/.zshrc
export PATH=$HOME/.docker/cli-plugins:$PATH

echo "✅ Docker Compose installed."

# Verify installation with retries
echo "🔍 Verifying installation..."
max_retries=5
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    if docker --version 2>/dev/null; then
        break
    fi
    echo "⏳ Waiting for Docker to start... (attempt $((retry_count+1))/$max_retries)"
    sleep 3
    retry_count=$((retry_count+1))
done

docker --version || echo "⚠️ Docker not responding, but installation completed."
docker compose version || echo "⚠️ Docker Compose not found in PATH yet."

echo ""
echo "✅ All done! Run 'source ~/.zshrc' or restart your terminal to apply environment changes."
echo "📋 If Docker isn't working, check the log: ~/docker-rootless.log"
echo "📋 Or start manually with: ~/bin/dockerd-rootless.sh"