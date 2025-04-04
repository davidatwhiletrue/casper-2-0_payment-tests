#!/bin/bash

# Global variables
NODE_URL="http://127.0.0.1:11101/rpc"
NETWORK_NAME="casper-net-1"

transfer() {
    local recipient amount payment id

    for arg in "$@"; do
        case $arg in
            sender=*) sender="${arg#*=}" ;;
            recipient=*) recipient="${arg#*=}" ;;
            amount=*) amount="${arg#*=}" ;;
            payment=*) payment="${arg#*=}" ;;
            id=*) id="${arg#*=}" ;;
            test_case=*) test_case="${arg#*=}" ;;
        esac
    done

    npm run scripts:transfer -- \
        --node_url "$NODE_URL" \
        --network_name "$NETWORK_NAME" \
        --sender "$sender" \
        --recipient "$recipient" \
        --amount "$amount" \
        --payment "$payment" \
        --id "$id" \
        --test_case "$test_case" \
        | grep -v "^>"  | grep -v "^$"
}

transfer_deploy() {
    local recipient amount payment id

    for arg in "$@"; do
        case $arg in
            sender=*) sender="${arg#*=}" ;;
            recipient=*) recipient="${arg#*=}" ;;
            amount=*) amount="${arg#*=}" ;;
            payment=*) payment="${arg#*=}" ;;
            id=*) id="${arg#*=}" ;;
            test_case=*) test_case="${arg#*=}" ;;
        esac
    done

    npm run scripts:transfer-deploy -- \
        --node_url "$NODE_URL" \
        --network_name "$NETWORK_NAME" \
        --sender "$sender" \
        --recipient "$recipient" \
        --amount "$amount" \
        --payment "$payment" \
        --id "$id" \
        --test_case "$test_case" \
        | grep -v "^>" | grep -v "^$"
}

delegate() {
    local validator amount payment

    for arg in "$@"; do
        case $arg in
            sender=*) sender="${arg#*=}" ;;
            validator=*) validator="${arg#*=}" ;;
            amount=*) amount="${arg#*=}" ;;
            payment=*) payment="${arg#*=}" ;;
            test_case=*) test_case="${arg#*=}" ;;
        esac
    done

    npm run scripts:delegate -- \
        --node_url "$NODE_URL" \
        --network_name "$NETWORK_NAME" \
        --sender "$sender" \
        --validator "$validator" \
        --amount "$amount" \
        --payment "$payment" \
        --test_case "$test_case" \
        | grep -v "^>"  | grep -v "^$"
}

undelegate() {
    local validator amount payment

    for arg in "$@"; do
        case $arg in
            sender=*) sender="${arg#*=}" ;;
            validator=*) validator="${arg#*=}" ;;
            amount=*) amount="${arg#*=}" ;;
            payment=*) payment="${arg#*=}" ;;
            test_case=*) test_case="${arg#*=}" ;;
        esac
    done

    npm run scripts:undelegate -- \
        --node_url "$NODE_URL" \
        --network_name "$NETWORK_NAME" \
        --sender "$sender" \
        --validator "$validator" \
        --amount "$amount" \
        --payment "$payment" \
        --test_case "$test_case" \
         | grep -v "^>"  | grep -v "^$"
}

redelegate() {
    local old_validator new_validator amount payment

    for arg in "$@"; do
        case $arg in
            sender=*) sender="${arg#*=}" ;;
            old_validator=*) old_validator="${arg#*=}" ;;
            new_validator=*) new_validator="${arg#*=}" ;;
            amount=*) amount="${arg#*=}" ;;
            payment=*) payment="${arg#*=}" ;;
            test_case=*) test_case="${arg#*=}" ;;
        esac
    done

    npm run scripts:redelegate -- \
        --node_url "$NODE_URL" \
        --network_name "$NETWORK_NAME" \
        --sender "$sender" \
        --old_validator "$old_validator" \
        --new_validator "$new_validator" \
        --amount "$amount" \
        --payment "$payment" \
        --test_case "$test_case" \
         | grep -v "^>"  | grep -v "^$"
}
