#!/bin/bash

source "$(dirname "$0")/transaction_functions.sh"

transfer \
    sender="/Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem" \
    recipient="0202e99759649fa63a72c685b72e696b30c90f1deabb02d0d9b1de45eb371a73e5bb" \
    amount="2500000000" \
    payment="100000000" \
    id="0" \
    test_case="transfer 1"

transfer_deploy \
    sender="/Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem" \
    recipient="0202e99759649fa63a72c685b72e696b30c90f1deabb02d0d9b1de45eb371a73e5bb" \
    amount="2500000000" \
    payment="100000000" \
    id="0" \
    test_case="transfer_deploy 1"

delegate \
    sender="/Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem" \
    validator="01Fed662DC7F1f7Af43Ad785Ba07a8cc05b7a96F9EE69613CfdE43BC56bEC1140B" \
    amount="5000000000000" \
    payment="2500000000" \
    test_case="delegate 1"

undelegate \
    sender="/Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem" \
    validator="01Fed662DC7F1f7Af43Ad785Ba07a8cc05b7a96F9EE69613CfdE43BC56bEC1140B" \
    amount="5000000000000" \
    payment="2500000000" \
    test_case="undelegate 1"

redelegate \
    sender="/Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem" \
    old_validator="01Fed662DC7F1f7Af43Ad785Ba07a8cc05b7a96F9EE69613CfdE43BC56bEC1140B" \
    new_validator="01c867fF3Cf1D4E4E68fC00922Fdcb740304dEF196E223091dEE62012F444b9EBa" \
    amount="5000000000000" \
    payment="2500000000" \
    test_case="redelegate 1"
