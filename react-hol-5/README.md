# 5章 ReactとJSX
createElementを使って要素を作成していたが、
複数のコンポーネントを合成して複雑なアプリケーションを構築する場合、関数呼び出しがネストするとコードが読めなくなってしまう。
そこで代わりに使用されるのがJSX。
JavaScriptXMLの略で、JavaScriptのコードの中に直接、XMLのようなタグベースの構文を記述するための言語拡張です。


## 5.1 JSXを使ってReact要素を記述する
JSXではタグ名としてReact要素名(type値)を記述する。そして、タグの属性としてプロパティ値を記述する。
子要素childrenは、開始タグと終了タグの間に記述される。

▼ IngredientListコンポーネント(JSX)

```js
// React要素
React.createElement(IngredientsList, {list:[...]});

// JSX
<IngredientList list={[...]} />
```

JSXでコンポーネントのプロパティlistを記述している箇所で、配列を波括弧で囲んでいる点に注目。
これをJavaScript式と呼ぶ。JSX内にJavaScript式を記述する際は、波括弧で囲む必要があります。
javaScript式は文字列リテラル以外のすべての型の値および式を含みます。




### 5.1.1 JSXとHTMLの違い

#### コンポーネントタグ
コンポーネントの子要素にさらにコンポーネントを記述することも可能。

```js
<IngredientList>
  <Ingredient />
  <Ingredient />
  <Ingredient />
</Ingredient>
```

#### classNameプロパティ
要素のclass属性を記述するのにclassNameを使用する

```js
<h1 className="fancy">baked Salmon</h1>
```

#### JavaScript式
文字列リテラル以外の値もしくは式をJSXに記述したい場合は、波括弧で囲む。
それにより、波括弧内の式が実行時に評価される。
たとえば、h1要素のテキスト値にtitleプロパティの値を設定したい場合、以下のように記述する。

```js
<h1>{title}</h1>
```


真偽値を記述するにも以下のように波括弧で囲む必要がある。

```js
<input type="checkbox" defaultChecked="false" />
```


##### JavaScript式の評価
リテラル値や変数だけでなく、たとえば文字列連結式や関数呼び出しを記述することも可能です。

```js
<h1>{"Hello" + title}</h1>
<h1>{title.toLowerCase().replace}</h1>
```

##### javaScript式の中にJSXを記述する
JavaScript式の中にJSXを記述することも可能。
JSXは最終的にJavaScriptに変換されるので、たとえば関数の戻り値としてJSXを返すことも可能。
以下はArray.mapのコールバック関数でJSXを返す例。

```js
<ul>
  {props.ingredients.map((ingredient, i)=>{
    <li key="{i}">{ingredient}</li>
  })}
</ul>
```

このようにJSXによりコードを簡潔に書けるが、ブラウザで直接このコードを実行することはできない。
すべてのJSXタグはブラウザで実行される前にcreateElementの呼び出しに変換されなければいけない。
そのためのツールがBabel。

### 5.1.2 BabelによるJSXの変換
多くのプログラミング言語ではソースコードを実行前にいったんコンパイルする必要がある。
JavaScriptはインタプリタ言語なのでその必要はない。
ブラウザはコードのテキストを読んで解釈し、その場で実行します。
しかしながら、最新のJavaScriptの構文は、すべてのブラウザでサポートされていない場合があります。
JSXにいたっては、サポートしているブラウザはありません。

そこで、最新の構文やJSXで書かれたコードを、いったんブラウザが解釈できるコードに変換してから実行します。
BabelはJavaScriptをコンパイルするためのツールです。

Babelを使用する方法はいくつかやり方があります。
最も簡単な方法は、すでにCDNで配布されているBabelのライブラリをブラウザで読み込んで実行する方法です。
HTMLからBabelのライブラリをロードすれば、scriptタグに内に書かれたコードで```type=text/babel```が指定されたものは、
実行前に自動的にBabelによりコンパイルされます。
変換のオーバーヘッドを考慮すると、この方法はプロダクション環境には向いていませんが、JSXをブラウザで手取り早く実行したい場合にはお勧めです。

```html
<!-- React Library & React DOM-->
<script src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
<!-- Babel -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<script text="text/babel">
  // ここにJSXを記述する
</script>
</body>
</html>
```

## 5.2 レシピのコンポーネントをJSXで記述する

ここではレシピを表示するコンポーネントを、JSXを使って実装する。
まずは、レシピのデータを確認。

```js
const data = [
  {
    name: "Baked Salmon",
    ingredients: [
      { name: "Salmon", amount: 1, measurement: "l lb" },
      { name: "Pine Nuts", amount: 1, measurement: "cup" },
      { name: "Butter Lettuce", amount: 2, measurement: "cups" },
      { name: "Yellow Squash", amount: 1, measurement: "med" },
      { name: "Olive Oil", amount: 0.5, measurement: "cup" },
      { name: "Garlic", amount: 3, measurement: "cloves" },
    ],
    steps: [
      "Preheat the oven to 350 degrees.",
      "Spread the olive oil around a glass baking dish.",
      "Add the salmon, garlic, and pine nuts to the dish.",
      "Bake for 15 minutes.",
      "Add the yellow squash and put back in the oven for 30 mins.",
      "Remove from oven and let cool for 15 minutes. Add the lettuce and serve.",
    ],
  },
  {
    name: "Fish Tacos",
    ingredients: [
      { name: "Whitefish", amount: 1, measurement: "l lb" },
      { name: "Cheese", amount: 1, measurement: "cup" },
      { name: "Iceberg Lettuce", amount: 2, measurement: "cups" },
      { name: "Tomatoes", amount: 2, measurement: "large" },
      { name: "Tortillas", amount: 3, measurement: "med" },
    ],
    steps: [
      "Cook the fish on the grill until hot.",
      "Place the fish on the 3 tortillas.",
      "Top them with lettuce, tomatoes, and cheese",
    ],
  },
];
```

このレシピを表示するために2つのReactコンポーネントを実装する。
ひとつはMenuコンポーネントで、レシピのリストを表示。
もうひとつはRecipeコンポーネントで、レシピ本体を表示。
ルートコンポーネントであるMenuをReactDOMで描画することで、内部的にRecipeコンポーネントの描画関数が呼び出されます。
また、Menuコンポーネントを描画する際に、レシピの配列をrecipeプロパティとして渡す。
コードのアウトラインは以下のようになる。

```js
// レシピのデータが格納された配列

// Recipeコンポーネント

// Menuコンポーネント 

// Menuコンポーネントを描画する
ReactDOM.render(
  <Menu recipes={data} title="Delicious Recipes" />,
  document.getElementById("root")
)
```

▼ Menuコンポーネント

```js
function Menu(props){
  return(
    <article>
      <header>
        <h1>{props.title}</h1>
      </header>
      <div className="recipes">
        {props.recipes.map((recipe, i)=>{
          <Recipe
            key={i}
            name={recipe.name}
            ingredients={recipe.ingredients}
            steps={recipe.steps}
          />
        })}
      </div> 
    </article>
  );
}
```

Array.mapを用いてRecipeコンポーネントの配列に変換している・
keyはユニークな値を与えている。

上記のコードはスプレッド構文を使ってより簡潔に書ける。
以下のコードは先ほどのコードとまったく同じ内容である。

```js
/* {props.recipes.map((recipe, i)=>{
  <Recipe
    key={i}
    name={recipe.name}
    ingredients={recipe.ingredients}
    steps={recipe.steps}
  />
})} 

↓↓↓ 同じ内容 ↑↑↑ */

{props.recipes.map((recipe, i)=>{
  <Recipe
    key={i}
    {...recipe}
  />
})}
```

この書き方は楽である反面、オブジェクト内のすべてのプロパティ値をコンポーネントに渡すことになるので、
意図せず不要な値を渡してしまうリスクがある。

さらにMenu関数の引数でデストラクチャリングを使用することで、
props.recipesのようにドット表記でアクセスする必要がなくなるため、より簡潔に記述できる。

```js
const Menu = ({ title, recipes }) => {
  return (
    <article>
      <header>
        <h1>{title}</h1>
      </header>
      <div className="recipes">
        {recipes.map((recipe, i) => {
          return <Recipe key={i} {...recipe} />;
        })}
      </div>
    </article>
  );
};
```

次に、レシピ本体のコンポーネントを実装していく。

▼ Recipeコンポーネント

```js
const Recipe = ({ name, ingredients, steps }) => {
  return (
    <section id={name.toLowerCase().replace(/ /g, "-")}>
      <h1>{name}</h1>
      <ul className="ingredients">
        {ingredients.map((ingredient, i) => {
          return <li key={i}>{ingredient.name}</li>;
        })}
      </ul>
      <section className="instructions">
        <h2>Cooking Instructions</h2>
        {steps.map((step, i) => {
          return <p key={i}>{step}</p>;
        })}
      </section>
    </section>
  );
};
```

Recipeコンポーネントはsection要素を返す関数だが、要素のid属性を設定している。
idにはユニークな文字列を設定する必要があるので、ここでは料理名を小文字にしたうえで、すべての空白文字をハイフンに変換している。
たとえばBaked Salmonはbaked-salmonとなる。

以下、これまで書いたレシピアプリケーションの完全なコード。

```js
import ReactDOM from "react-dom";

const data = [
  {
    name: "Baked Salmon",
    ingredients: [
      { name: "Salmon", amount: 1, measurement: "l lb" },
      { name: "Pine Nuts", amount: 1, measurement: "cup" },
      { name: "Butter Lettuce", amount: 2, measurement: "cups" },
      { name: "Yellow Squash", amount: 1, measurement: "med" },
      { name: "Olive Oil", amount: 0.5, measurement: "cup" },
      { name: "Garlic", amount: 3, measurement: "cloves" }
    ],
    steps: [
      "Preheat the oven to 350 degrees.",
      "Spread the olive oil around a glass baking dish.",
      "Add the salmon, garlic, and pine nuts to the dish.",
      "Bake for 15 minutes.",
      "Add the yellow squash and put back in the oven for 30 mins.",
      "Remove from oven and let cool for 15 minutes. Add the lettuce and serve."
    ]
  },
  {
    name: "Fish Tacos",
    ingredients: [
      { name: "Whitefish", amount: 1, measurement: "l lb" },
      { name: "Cheese", amount: 1, measurement: "cup" },
      { name: "Iceberg Lettuce", amount: 2, measurement: "cups" },
      { name: "Tomatoes", amount: 2, measurement: "large" },
      { name: "Tortillas", amount: 3, measurement: "med" }
    ],
    steps: [
      "Cook the fish on the grill until hot.",
      "Place the fish on the 3 tortillas.",
      "Top them with lettuce, tomatoes, and cheese"
    ]
  }
];

const Recipe = ({ name, ingredients, steps }) => {
  return (
    <section id={name.toLowerCase().replace(/ /g, "-")}>
      <h1>{name}</h1>
      <ul className="ingredients">
        {ingredients.map((ingredient, i) => {
          return <li key={i}>{ingredient.name}</li>;
        })}
      </ul>
      <section className="instructions">
        <h2>Cooking Instructions</h2>
        {steps.map((step, i) => {
          return <p key={i}>{step}</p>;
        })}
      </section>
    </section>
  );
};

const Menu = ({ title, recipes }) => {
  return (
    <article>
      <header>
        <h1>{title}</h1>
      </header>
      <div className="recipes">
        {recipes.map((recipe, i) => {
          return <Recipe key={i} {...recipe} />;
        })}
      </div>
    </article>
  );
};

ReactDOM.render(
  <Menu recipes={data} title="Delicious Recipes" />,
  document.getElementById("root")
);
```

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-5-2-resipinokonponentowojsxdeji-shu-suru-7cu732?file=/src/index.js


##### React Developer Tools
Google Chromeを使っていて、react Developer Toolsをインストールしているならば、
表示中のコンポーネントの中身を見ることができる。
デベロッパーツールを開いて、、Componentsタブを選択すると、ツリーの中身が表示される。

### 5.2.1 Reactフラグメント

前節ではMenuとRecipeは親子の関係で、前者が後者を包含していました。
そうではなく、2つのコンポーネントを並列に描画したい場合はどうすればよいのか？

```js
function Cat({ name }){
  return(
    <h1>The cat's name is  {name}</h1>
    <p>He's good.</p>
  )
}
```

上記のコードはエラーとなります。
Reactでは2つ以上の要素をコンポーネントの戻り値として返すことできない。
よくある解決法は、親要素としてdivのようなラッパー要素を追加することによるエラー回避です。
ただ、コンポーネントごとにそのようなラッパー要素を追加すると、不要な要素が際限なく作成されてツリーが肥大化してしまう。
そこで、Reactフラグメントの登場。フラグメントを使うことで、実際に要素を追加することなく、ラッパーを記述できる。

```js
function Cat({ name }){
  return(
    <React.Fragment>
      <h1>The cat's name is  {name}</h1>
      <p>He's good.</p>
    </React.Fragment>
  )
}
```

これによりエラーは解消される。
Reactフラグメントはまた、以下のように簡略記法でも書ける。

```js
function Cat({ name }){
  return(
    <>
      <h1>The cat's name is  {name}</h1>
      <p>He's good.</p>
    </>
  )
}
```

実際の描画結果のDOMを確認すると、フラグメントは取り除かれているのが分かる。


## 5.3 webpackを使ってビルド環境を構築する
Reactを実プロジェクトで採用するには、さまざまな問題に対処する必要がある。
JSXおよびES.nextの変換、コンポーネント間の依存関係の管理、画像やCSSの最適化など。
これらの問題を解決するために、数多くのツールが存在する。Browserify、Gulp、Grunt、Prepackなど。
中でも、包括的な機能を提供し、多くの企業で採用されたことから、webpackがひときわ目立った成功を収めている。

webpackはモジュールバンドラ。モジュールバンドラとは、異なる種類のファイル(JavaScript、LESS、CSS、JSX、ES.next等)を単一のファイルに統合するためのツール。何のために統合するかというと、モジュール化とネットワークパフォーマンス。


## 5.4 Create React App
プロジェクトの環境構築を自動化してくれるCreate React Appというツールがある。
コマンドラインのツールで、実行することでWebpack、Babel、ESLintなどの設定ファイルを自動生成できる。

Create React Appを利用するには、以下のようにプロジェクト名を指定して実行。
それにより、指定した名前のフォルダが生成され、その中に設定ファイルが自動生成される。

```js
$ npx create-react-app  my-project
$ cd my-project
```

```js
$ npm start
$ yarn start

$ npm test
$ yarn test

$ npm run build
$ yarn build
```

自動生成されたプロジェクトフォルダのpackage.jsonを確認すると、3つの依存パッケージがインストールされているのが分かる。
react、react-dom、そしてreact-scripts。3番目のreact-scriptsは馴染みがないかもしれないが、ここで使用するほとんどのツールがこのパッケージに含まれている。react-scriptsはFacebookにより提供されており、Babel、ESLint、webpackなど、あらかじめ設定済みのツールが含まれている。

また、プロジェクトフォルダには、srcフォルダがあり、その中にApp.jsファイルが自動生成されている。
このファイルではルートのコンポーネントAppが定義されている。
このAppコンポーネントを編集することで、すぐにアプリケーションの開発を始められます。

プロジェクトフォルダの中で```npm start```もしくは```yarn start```を実行することで、ブラウザが起動してアプリケーションが表示される。アプリケーションはlocalhostの3000番ポートで実行される。

また、```npm test```もしくは```yarn test```でユニットテストを実行することも可能。
これは、プロジェクトフォルダ内のすべてのテストをインタラクティブモードで実行する。

そして、ビルドを実行するには```npm run build```もしくは```yarn build```を実行する。
これにより、buildフォルダ配下にミニファイされたバンドルファイルが出力される。

Create React AppはReactの進化に合わせてツールも常に進化しているので、
Githubのリポジトリ(https://github.com/facebook/create-react-app)をウォッチすることで、最新のツールセットの動向にキャッチアップできる。そのほかにもCodeSandboxというオンラインのIDE(https://codesandbox.io)がある。



##### npx
npmのバージョン5.2.0で追加されたnpxコマンドを使えば、ツールをグローバルインストールせずに実行できる。
たとえばnpx create-react-app my-project のように実行することで、create-react-appがその場でダウンロードされて実行される。


