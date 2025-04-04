# Payment tests

## NCTL 

### Transfer

```bash
npm run scripts:transfer -- \
  --node_url http://127.0.0.1:11101/rpc \
  --network_name casper-net-1 \
  --sender /Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem \
  --recipient 0202e99759649fa63a72c685b72e696b30c90f1deabb02d0d9b1de45eb371a73e5bb \
  --amount 2500000000 \
  --payment 100000000 \
  --id 0
```

```bash
npm run scripts:transfer-deploy -- \
  --node_url http://127.0.0.1:11101/rpc \
  --network_name casper-net-1 \
  --sender /Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem \
  --recipient 0202e99759649fa63a72c685b72e696b30c90f1deabb02d0d9b1de45eb371a73e5bb \
  --amount 2500000000 \
  --payment 100000000 \
  --id 0
```

### Delegate

 ```bash
 npm run scripts:delegate -- \
  --node_url http://127.0.0.1:11101/rpc \
  --network_name casper-net-1 \
  --sender /Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem \
  --validator 01Fed662DC7F1f7Af43Ad785Ba07a8cc05b7a96F9EE69613CfdE43BC56bEC1140B \
  --amount 5000000000000 \
  --payment 2500000000
 ```

### Undelegate

 ```bash
 npm run scripts:undelegate -- \
  --node_url http://127.0.0.1:11101/rpc \
  --network_name casper-net-1 \
  --sender /Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem \
  --validator 01Fed662DC7F1f7Af43Ad785Ba07a8cc05b7a96F9EE69613CfdE43BC56bEC1140B \
  --amount 5000000000000 \
  --payment 2500000000
 ```

### Redelegate

 ```bash
 npm run scripts:redelegate -- \
  --node_url http://127.0.0.1:11101/rpc \
  --network_name casper-net-1 \
  --sender /Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem \
  --old_validator 01Fed662DC7F1f7Af43Ad785Ba07a8cc05b7a96F9EE69613CfdE43BC56bEC1140B \
  --new_validator 01c867fF3Cf1D4E4E68fC00922Fdcb740304dEF196E223091dEE62012F444b9EBa \
  --amount 5000000000000 \
  --payment 2500000000
 ```

### STORED Delegate

```bash
 npm run scripts:stored-delegate -- \
  --node_url http://127.0.0.1:11101/rpc \
  --network_name casper-net-1 \
  --sender /Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem \
  --validator 01Fed662DC7F1f7Af43Ad785Ba07a8cc05b7a96F9EE69613CfdE43BC56bEC1140B \
  --amount 5000000000000 \
  --payment 1000000000000
```

### CEP-18 install

```bash
 npm run scripts:install-wasm -- \
  --node_url http://127.0.0.1:11101/rpc \
  --network_name casper-net-1 \
  --sender /Users/davidhernando/MAKE/Casper/testnet/nctl-docker/users/user-1/secret_key.pem \
  --wasm ./cep18-v2x.wasm \
  --payment 1000000000000
```

## Integration network

### Transfer

```bash
npm run scripts:transfer -- \
  --node_url http://44.200.108.65:7777/rpc \
  --network_name integration-test \
  --sender /Users/davidhernando/MAKE/Casper/Casper2/IntTests/IntTests/account3_cw.pem \
  --keys_algo secp256k1 \
  --recipient 0202e99759649fa63a72c685b72e696b30c90f1deabb02d0d9b1de45eb371a73e5bb \
  --amount 2500000000 \
  --payment 100000000 \
  --id 0 \
  --test_case native_transfer_txv1
```

```bash
npm run scripts:transfer-deploy -- \
  --node_url http://44.200.108.65:7777/rpc \
  --network_name integration-test \
  --sender /Users/davidhernando/MAKE/Casper/Casper2/IntTests/IntTests/account3_cw.pem \
  --keys_algo secp256k1 \
  --recipient 0202e99759649fa63a72c685b72e696b30c90f1deabb02d0d9b1de45eb371a73e5bb \
  --amount 2500000000 \
  --payment 100000000 \
  --id 0 \
  --test_case native_transfer_deploy
```
