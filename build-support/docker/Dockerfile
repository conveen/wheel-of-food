# Base, language-agnostic image with Bash shell and new user
FROM alpine:latest AS base

ARG UID
ARG USERNAME

# Update base packages
RUN apk update && \
    apk upgrade

# Add Bash
# Used as shell for new user.
RUN apk add --no-cache bash

# Copy common shell scripts
COPY build-support/shell/ /build-support/shell/

# Create new user
# This user is used to run all user-specified commands
# in the container, and the UID/USERNAME should match
# the local (host) user to ensure file permissions of generated
# or touched files are correct.
COPY build-support/docker/adduser.sh /build-support/docker/
RUN UID=$UID \
    USERNAME=$USERNAME \
    build-support/docker/adduser.sh

# Base image for using NPM and JS
# Uses the asdf-vm project to manage tool installations
FROM base AS js_base

# Must match USERNAME in base image
ARG USERNAME

# Install asdf
COPY build-support/docker/install-asdf.sh /build-support/docker/
RUN USERNAME=$USERNAME \
    build-support/docker/install-asdf.sh

# Install NodeJS
COPY build-support/docker/install-nodejs.sh /build-support/docker/
RUN USERNAME=$USERNAME \
    build-support/docker/install-nodejs.sh


FROM js_base as build

ENTRYPOINT ["./run.sh"]

CMD ["build"]
