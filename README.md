# sophon-node-sale
 
## Как запустить
Для работы требуется установленный Node.js v18 или выше (https://nodejs.org/en/download)

Установка зависимостей
```bash
npm install
```

Запуск
```bash
npm start
```

## Формат кошельков в wallets.txt
```txt
privateKey;tier;quantity

// Пример

0x0000001;1;2
0x0000002;12;1
```

## Как изменить/добавить другие RPC
В файле main.js сверху есть переменная RPC_URLS с 2 предустановленными RPC.
Там можно добавлять другие RPC, или убрать ненужные.

Для каждого кошелька выбирается рандомный.
```js
const RPC_URLS = [
  'https://rpc.ankr.com/zksync_era',
  'https://mainnet.era.zksync.io',
];
```
