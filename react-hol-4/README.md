# 4章 Reactの基本
Reactの最小単位である要素とコンポーネントについて。

## 4.1 使用するライブラリ
ブラウザでReactを動作させるには、ReactとReactDOMという2つのライブラリが最低限必要。<br>
Reactはビューを構築するためのライブラリ。<br>
ReactDOMは、Reactで構築されたビューをブラウザで描画するためのライブラリ。

▼ CDNからのダウンロードとベースのHTML

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Pure React Samples</title>
  </head>
  <body>
    <!-- Target Container -->
    <div id="react-container"></div>

    <!-- React Library & React DOM-->
    <script
      crossorigin
      src="https://unpkg.com/react@16/umd/react.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
    ></script>

    <script>
      // ここにReactのコードを記述する
    </script>
  </body>
</html>
```

## 4.2 React要素

ReactはDOM APIの呼び出しを一手に引き受けてくれるライブラリ。<br>
開発者は直接DOM APIを呼び出す必要はなく、その代わり、Reactに対して「何をしたいのか」が記述された指示書のようなものを渡します。<br>
その指示書をReact要素と呼びます。

▼ React要素を作成するコード

```js
React.createElement("h1", { id: "recipe-0" }, "Baked Salmon");
```

最初の引数は作成したい要素のタイプ。二番目の引数は要素のプロパティ。三番目の引数は子要素です。
上記の要素をReactは以下のようなDOM要素に変換する。

```html
<h1 id="recipe-0">Baked Salmon</h1>
```

### 4.2.1 ReactDOMで要素をブラウザに描画する
ReactDOMはReact要素をブラウザに描画するためのライブラリ。
ここではReactDOMのrenderメソッドを使用して要素を描画してみましょう。

```js
const dish = React.createElement("h1", null, "Baked Salmon");
ReactDOM.render(dish, document.getElementById("root"));
```

最初の引数にReact要素を、二番目の引数に要素を追加するルートノードを指定します。
この結果、以下のようなDOM要素が描画されます。

```html
<body>
  <div id="root">
    <h1>baked Salmon</h1>
  </div>
</body>
```

このように、ReactDOMはReact要素をDOM要素に変換します。<br>
複数のReact要素を描画することも可能。

```js
const dish = React.createElement("h1", null, "Baked Salmon");
const dessert = React.createElement("h2", null, "Coconut Cream Pie");
ReactDOM.render([dish, dessert], document.getElementById("root"));
```



### 4.2.2 子要素
Reactでは子要素はprops.childrenに格納される。
React要素を子要素として指定することも可能になっており、そのようにReact要素を他のReact要素の子要素として追加することで、
ネストした要素のツリーを構築できる。

以下はレシピのHTMLで、材料のリストをul要素としてマークアップしたものです。

```html
<ul>
  <li>2 lb salmon</li>
  <li>5 sprigs fresh rosemary</li>
  <li>2 tablespoons olive oil</li>
  <li>2 small lemons</li>
  <li>1 teaspoon kosher salt</li>
  <li>4 cloves of chopped garlic</li>
</ul>
```

これをReactで描画するには、以下のようにReact.createElementで呼び出して、ネストしたReact要素のツリーを作成します。

```js
// JavaScript Code with Pure React
const list = React.createElement(
    "ul",
    null,
    React.createElement("li", null, "2 lb salmon"),
    React.createElement("li", null, "5 sprigs fresh rosemary"),
    React.createElement("li", null, "2 tablespoons olive oil"),
    React.createElement("li", null, "2 small lemons"),
    React.createElement("li", null, "1 teaspoon kosher salt"),
    React.createElement("li", null, "4 cloves of chopped garlic")
);
console.log(list);
ReactDOM.render(list, document.getElementById("root"));
```

▼ codesandbox<br>
https://codesandbox.io/s/cranky-hugle-8gv2mj?file=/src/index.js



### 4.2.3 配列から子要素を生成する
Reactの利点のひとつとして、UIからデータを分離できることが挙げられる。

```js
React.createElement(
    "ul",
    null,
    React.createElement("li", null, "2 lb salmon"),
    React.createElement("li", null, "5 sprigs fresh rosemary"),
    React.createElement("li", null, "2 tablespoons olive oil"),
    React.createElement("li", null, "2 small lemons"),
    React.createElement("li", null, "1 teaspoon kosher salt"),
    React.createElement("li", null, "4 cloves of chopped garlic")
);
```

上記のコードで重複している部分を取り除くと、以下の材料のリストが抽出できる。

```js
const items = [
  "2 lb salmon",
  "5 sprigs fresh rosemary",
  "2 tablespoons olive oil",
  "2 small lemons",
  "1 teaspoon kosher salt",
  "4 cloves of chopped garlic"
];
```

これをArray.mapでReact要素の配列に変換する。

```js
React.createElement(
  "ul",
  { className: "ingredients" },
  items.map((ingredient, i) =>
    React.createElement("li", { key: i }, ingredient)
  )
);
```

要素の配列を別の要素の子要素に設定する場合、配列の各要素はkeyプロパティを持つ必要がある。

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-4-2-3-pei-lie-karazi-yao-su-wochou-chu-suru-77erfh?file=/src/index.js


## 4.3 Reactコンポーネント
ユーザーインターフェースは、ボタンやリスト、見出しといった部品により構成されている。
たとえばレシピのページで、異なる3つの料理のレシピが表示されているとする。個々のレシピの内容は異なるが、使われているUI部品は同じです。

この部品のことをReactではコンポーネントと呼びます。
コンポーネントの設計では、そのコンポーネントがスケールするかどうかを必ず考慮しなければいけない。

Reactではコンポーネントの実体は関数。各コンポーネントはReact要素を返す関数として実装される。

```js
function IngredientsList(){
  return (
    React.createElement(
      "ul",
      { className: "ingredients" },
      items.map((ingredient, i) =>
        React.createElement("li", { key: i }, ingredient)
      )
    )
  )
}

ReactDOM.render(
  React.createElement(IngredientsList, null, null), 
  document.getElementById("root")
);
```
https://codesandbox.io/s/hands-on-react-4-3-reactkonponento-bzxr3y?file=/index.html

ここでは、分離したデータをitemsプロパティに設定しています。
そして上記コードでまだ改善すべき点があります。
コンポーネント内でitemsをグローバル変数として参照していますが、これはReactのpropsオブジェクト経由で参照すべきです。
propsオブジェクトはコンポーネントの関数に引数として渡されます。

```js
function IngredientsList(props){
  return (
    React.createElement(
      "ul",
      { className: "ingredients" },
      props.items.map((ingredient, i) =>
        React.createElement("li", { key: i }, ingredient)
      )
    )
  )
}
ReactDOM.render(
  React.createElement(IngredientsList, { items }, null), 
  document.getElementById("root")
);
```

さらに、デストラクチャリングを使えばコードがより簡素になります。

```js
function IngredientsList({items}){
  return (
    React.createElement(
      "ul",
      { className: "ingredients" },
      items.map((ingredient, i) =>
        React.createElement("li", { key: i }, ingredient)
      )
    )
  )
}
ReactDOM.render(
  React.createElement(IngredientsList, { items }, null), 
  document.getElementById("root")
);
```
https://codesandbox.io/s/hands-on-react-4-3-reactkonponento2-knj9qd?file=/index.html

これで、材料のリストを表示するために必要なコードはすべてIngredientsListコンポーネントに集約されました。
コンポーネントは描画の単位であると同時に、開発の単位でもあります。



