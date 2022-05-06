#!/bin/env bash

DIR="$(pwd)"

# If the script is ran from the context of being a node_modules dependency
if [ "$(pwd | grep -c 'node_modules')" -gt 0 ]; then
    PACKAGES_DIR="../../../packages"
    PACKAGE_DIR="../../../packages/vue-common"
    NODE_MODULES_PACKAGE_DIR="$DIR"
else
    PACKAGES_DIR="packages"
    PACKAGE_DIR="packages/vue-common"
    NODE_MODULES_PACKAGE_DIR="node_modules/@cronqvist/vue-common"
fi

# Symlink it does not work on Windows as it can't understand symlinks across Windows
#mkdir -p "packages/" && ln -rTs "node_modules/@cronqvist/vue-common" "packages/vue-common"

# If there is no mount, copy the files
if [ "$(mount | grep -c "/$PACKAGE_DIR")" -eq 0 ]; then
    mkdir -p "$PACKAGES_DIR/"
    rm -rf "$PACKAGE_DIR" && cp -r "$NODE_MODULES_PACKAGE_DIR" "$PACKAGES_DIR/"
    echo '*' > "$PACKAGE_DIR/.gitignore"
fi
