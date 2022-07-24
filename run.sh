#!/usr/bin/env bash

set -eu

###################
##### Imports #####
###################

# Check if running in build container or locally
# to import from correct path
if [ -d /build-support ]
then
    . ~/.bashrc
    BUILD_SUPPORT_ROOT="/build-support"
else
    BUILD_SUPPORT_ROOT="./build-support"
fi
. "${BUILD_SUPPORT_ROOT}/shell/run/config.sh"
. "${BUILD_SUPPORT_ROOT}/shell/common/log.sh"


###############################
##### Container Utilities #####
###############################

run-build-base() {
    ${CONTAINER_RUNTIME} build \
        --target "${BUILD_TARGET_STAGE}" \
        -t "${BUILD_IMAGE_URL}:${BUILD_IMAGE_TAG}" \
        -f build-support/docker/Dockerfile \
        --build-arg UID="${USERID}" \
        --build-arg USERNAME="${USERNAME}" \
        "${@}" \
        .
}

run-push-base() {
    ${CONTAINER_RUNTIME} push \
        "${@}" \
        "${BUILD_IMAGE_URL}:${BUILD_IMAGE_TAG}"
}

run-in-container() {
    # If input device is not a TTY don't run with `-it` flags
    local INTERACTIVE_FLAGS="$(test -t 0 && echo '-it' || echo '')"
    ${CONTAINER_RUNTIME} run \
		--rm \
         ${INTERACTIVE_FLAGS} \
		-u ${USERNAME} \
        -v /var/run/docker.sock:/var/run/docker.sock \
		-v $(pwd):/project \
		-w /project \
		${BUILD_IMAGE_URL}:${BUILD_IMAGE_TAG} \
        --local "${@}"
}


#############################
##### Command Utilities #####
#############################

run-command() {
    local COMMAND="${1}"
    shift

    if [ ${RUNTIME_CONTEXT} = "container" ]
    then
        run-in-container "${COMMAND}" "${@}"
    elif [ ${RUNTIME_CONTEXT} = "local" ]
    then
        run-${COMMAND} "${@}"
    else
        error "Invalid value for RUNTIME_CONTEXT: ${RUNTIME_CONTEXT}"
        exit 1
    fi
}


####################
##### Commands #####
####################

run-build() {
    run-check

    run-fmt-check

    run-lint

    run-test

    info "Building package with Vite"
    npm run build
}

run-check() {
    info "Checking types with tsc"
    npm run type-check
}

run-clean() {
    info "Removing build artifacts"
    rm -rf \
        coverage/ \
        dist/    
}

run-exec() {
    info "Running command: ${*}"
    ${@}
}

run-fmt() {
    info "Formatting code with Prettier"
    npm run fmt
}

run-fmt-check() {
    info "Checking code format with Prettier"
    npm run fmt:check
}

run-init() {
    read -e -p "Do you want to include .gitconfig in this project's Git config [y/n]? " INCLUDE_GITCONFIG
    if [ "${INCLUDE_GITCONFIG,,}" = "y" ]
    then
        git config --local include.path ../.gitconfig
    fi

    npm init vue@latest
}

run-lint() {
    info "Linting code with ESLint"
    npm run lint
}

run-make-docs() {
    error "make-docs command not yet implemented"
}

run-publish() {
    error "publish command not yet implemented"
}

run-shell() {
    info "Entering shell"
    bash
}

run-test() {
    info "Running unit tests with vitest"
    npm run test:unit
}

run-update-deps() {
    info "Updating dependencies with npm"
    npm update "${@}"
}


################
##### Main #####
################

print-usage() {
    echo "usage: $(basename ${0}) [-h] [SUBCOMMAND]"
    echo
    echo "subcommands:"
    echo "build             build distribution package (default subcommand)"
    echo "build-base        build the build container image"
    echo "check             type check code with tsc"
    echo "clean             remove build artifacts"
    echo "exec              execute arbitrary shell commands"
    echo "fmt               format code with Prettier"
    echo "init              initialize repository (should only be run once)"
    echo "lint              lint code with ESLint"
    echo "make-docs         not yet implemented"
    echo "publish           not yet implemented"
    echo "push-base         push build container image to registry"
    echo "shell             start Bash shell"
    echo "test              run unit tests with Vitest"
    echo "update-deps       update dependencies with npm"
    echo
    echo "optional arguments:"
    echo "-h, --help        show this help message and exit"
    echo "-l, --local       run command on host system instead of build container"
    echo "-c, --container   run command in build container"
    echo
}


while :
do
    case "${1:-}" in
        -c|--container)
            shift
            RUNTIME_CONTEXT="container"
        ;;
        -h|--help)
            print-usage
            exit 0
        ;;
        -l|--local)
            shift
            RUNTIME_CONTEXT="local"
        ;;
        *)
            break
        ;;
    esac
done

if [ -z "${1:-}" ]
then
    COMMAND="${DEFAULT_COMMAND}"
else
    COMMAND="${1}"
    shift
fi

# These commands should explicitly run locally
if ( \
    [ "${COMMAND}" = "build-base" ] \
    || [ "${COMMAND}" = "push-base" ] \
)
then
    RUNTIME_CONTEXT="local"
fi

run-command "${COMMAND}" "${@}"
