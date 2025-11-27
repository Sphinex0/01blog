systemctl --user stop docker

dockerd-rootless.sh --dns 8.8.8.8 --dns 1.1.1.1 &