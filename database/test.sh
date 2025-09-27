#!/bin/zsh

set -e

sed -i.bak '/export PATH=$HOME/bin/d' ~/.zshrc
