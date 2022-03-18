# 概要
Reactコンポーネントにおけるデータの扱い方を理解する。

## 1.データの受信
Github APIからデータを取得する

```js
fetch(`https://api.github.com/users/tsudumiya`)
  .then((response) => response.json())
  .then(console.log)
  .catch(console.error);
```

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-1-detanoqu-de-chaining-t3jc9x?file=/src/App.js