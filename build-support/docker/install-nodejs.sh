#!/usr/bin/env bash

set -e

. /build-support/shell/common/log.sh


if [ -z "${USERNAME}" ]
then
    error "Must set USERNAME environment variable"
    exit 1
fi


apk add --no-cache \
    libc-dev \
    musl-dev \
    g++ \
    gcc \
    linux-headers \
    make \
    openssl \
    python3 \
    py3-pip

sudo -Hiu $USERNAME bash -c '${HOME}/.asdf/bin/asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git'
# Must source ~/.asdf/asdf.sh because the NodeJS installation script relies on asdf being in $PATH
# ASDF_NODEJS_FORCE_COMPILE=1 required on Alpine Linux
sudo -Hiu $USERNAME bash -c 'source ${HOME}/.asdf/asdf.sh && ASDF_NODEJS_FORCE_COMPILE=1 ${HOME}/.asdf/bin/asdf install nodejs latest'
