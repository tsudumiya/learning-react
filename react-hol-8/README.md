# 8.データ
## 概要
Reactコンポーネントにおけるデータの扱い方を理解する。

## 1. データの受信

### 1.1 チェーンの場合
```js
fetch(`https://api.github.com/users/moonhighway`)
  .then(response => response.json())
  .then(console.log)
  .catch(console.error)
```

### 1.2 async/awaitの場合

```js
async function requestGithubUser(githubLogin){
  tyr{
    const response = await fetch(
      `https://api.github.com/users/moonhighway`
    );
    const userData = await response.json();
    console.log(useData);
  } catch(error){
    console,.log(error);
  }
}
```

### 1.3 Reactコンポーネントでの使い方
▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-1-detanoshou-xin-reactkonponentodenoshi-ifang-h7nzb2?file=/src/App.js

## 2. データの送信

```js
fetch("create/user", {
  method:"POST",
  body: JSON.stringify({ username, password, bio })
});
```

### 2.1 fetchを使ったファイルアップロード
```js
const formData = new FormData();
formData.append("username", "moontahoe");
formData.append("fullname", "Alex Banks");
formData.append("avatar", "imgFile");

fetch("/create/user", {
  method:"POST",
  body: formData
})
```

### 2.2 リクエストの認証
```js
fetch(`https://api.github.com/users/${login}`,{
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

## 3. データの保存(local storage)
```js
// ローカルストレージからデータを読み込む
const loadJSON = key =>
  key && JSON.parse(localStorage.getItem(key));

// ローカルストレージにデータを書き込む
const saveJSON = (key, data) => 
  localStrage.setItem(key, JSON.stringify(data));
```

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-8-3-detanobao-cun-k5c76y?file=/src/App.js

## 4. 非同期リクエストの状態管理

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-8-4-fei-tong-qi-rikuesutonozhuang-tai-guan-li-kfqs5g?file=/src/App.js

### 4.1 レンダープロップ
▼ 典型的なリスト表示のパターン

```js
const tahoe_peaks = [
  { name: "Freel Peak", elevation: 10891 },
  { name: "Monument Peak", elevation: 10067 },
  { name: "Pyramid Peak", elevation: 9983 },
  { name: "Mt. Tallac", elevation: 9735 }
];

export default function App() {
  return (
    <ul>
      {tahoe_peaks.map((peak, i) => (
        return(
          <li key={i}>
            {peak.name} - {peak.elevation.toLocaleString()}ft
          </li>
        )
      ))}
    </ul>
  );
}
```

他のリストを描画するコンポーネントからも再利用できるように、
Listという独立したコンポーネントにこのパターンを抽象化していく。

```js
const tahoe_peaks = [
  { name: "A", elevation: 10891 },
  { name: "B", elevation: 7691 },
  { name: "C", elevation: 30891 },
  { name: "D", elevation: 400891 },
  { name: "E", elevation: 900891 }
];

function List({ data = [], renderEmpty }) {
  if (!data.length) return renderEmpty;
  return <p>{data.length} items</p>;
}

export default function App() {
  return <List data={tahoe_peaks} renderEmpty={<p>This list is empty</p>} />;
}
```
▼ codesandbox<br>
https://codesandbox.io/s/usual-list3-egsulz

renderEmptyは特定の条件に当てはまる場合に描画されるレンダープロップ。
この場合は、dataプロパティが空の配列か、指定されなかった場合に使用される。

Listコンポーネントを変更して、配列の各要素を描画していく。
renderItemを使って描画内容を指定できるようにする。

▼ codesandbox<br>
https://codesandbox.io/s/usual-list4-zremfr

### 4.2 仮想リスト
仮想リストを使わずに、5000個のdiv要素を作成した場合。

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-8-4-2-jia-xiang-hua-risuto-pu-tong-ni5000jian-biao-shi-50504k

次に、react-windowを使って描画する。

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-8-4-2-jia-xiang-hua-risutoreact-window-yuyln1



### 4.3 useFetchフック
HTTPリクエストは保留中(pending)、成功(fulfilled)、そして失敗(rejected)の3つの状態を持つ。
アプリケーションでfetch APIを使ってリクエストを送信するたびに、これらの状態を管理するコードを繰り返し書くことになるので、ここで再利用可能なカスタムフックを実装。

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-8-4-3-usefetchhutuku1-g22or8


### 4.4 fetchコンポーネント
データだけでなくUIも含めて共通化したい場合がある。
たとえばロード中に表示されるアイコンは、コンポーネントごとに異なっている必要はなく、アプリケーションで共通のアイコンを表示すればいい。
また、エラーが発生した場合の処理方法も、通常はアプリケーション内で共通。

useFetchフックを使用するすべてのコンポーネントで個別にそれらのUI記述するのではなく、
ロード中のアイコンおよびエラーのUIも含めて再利用可能なコンポーネントを作成することで、共通化の範囲を拡大できる。

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-8-4-4-fetchkonponento-rp6iky

▼ FetchコンポーネントにカスタムUIを指定する例

```js
function GitHubUser({ login }) {
  return (
    <Fetch
      uri={`https://api.github.com/users/${login}`}
      loadingFallback={<LoadingSpinner />} // カスタムUI(ロード中)
      renderError={(error) => {
        // カスタムUI(エラー時)
        return <p>Something went wrong... {error.message}</p>;
      }}
      renderSuccess={({ data }) => (
        <>
          <h1>Todo: Render UI for data</h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
    />
  );
}
// スピナーのダミー
function LoadingSpinner() {
  return <>スピナー</>;
}
```

## 5. 複数のリクエスト
ここまでの例では、Githubからユーザーの基本情報のみ取得したが、
ユーザーのリポジトリの情報も表示したい場合はどうすればいいか？
リポジトリのデータは異なるAPIで提供されているため、複数のHTTPリクエストを発行する必要がある。

リポジトリの情報は配列のデータとして提供される。
そこでまずは、配列のデータをイテレートするためのカスタムックuseIteratorを実装。

▼ hooks.js / useIterator

```js
export const useIterator = (items = [], initialIndex = 0) => {
  const [i, setIndex] = useState(initialIndex);

  const prev = () => {
    if (i === 0) return setIndex(items.length - 1);
    setIndex(i - 1);
  };

  const next = () => {
    if (i === items.length - 1) return setIndex(0);
    setIndex(i + 1);
  };


  return [item || items[0], prev, next];
};
```

### 5.1 関数のメモ化
useIteratorのリファクタリング。 以下はフックの戻り値をメモ化したもの。

▼ hooks.js

```js
export const useIterator = (items = [], initialIndex = 0) => {
  const [i, setIndex] = useState(initialIndex);

  const prev = useCallback(() => {
    if (i === 0) return setIndex(items.length - 1);
    setIndex(i - 1);
  }, [i]);

  const next = useCallback(() => {
    if (i === items.length - 1) return setIndex(0);
    setIndex(i + 1);
  }, [i]);

  const item = useMemo(() => items[i], [i]);

  return [item || items[0], prev, next];
};
```

リポジトリをメニュー形式で表示するコンポーネントを実装する。
このコンポーネントでは、先ほどのuseIteratorフックを使って、ユーザーがリポジトリのリストをイテレートできるようなUIを提供。

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-8-5-1-fu-shu-norikuesuto-iteretotoguan-shu-nomemohua-u5tl25

### 5.2 ウォーターフォールリクエスト
ここでさらにウォーターフォールを追加する。
ユーザー情報とリポジトリの取得が成功した場合、先頭のリポジトリのREADME.mdファイルを取得。
その後ユーザーの操作により別のリポジトリが選択されるたびに、該当するリポジトリのREADME.mdファイルを取得する。

リポジトリのREADME.mdファイルはMarkdown形式で格納されている。
Markdownはプレーンテキストを簡易な記法で装飾できるフォーマットで、HTML等の別のフォーマットに変換可能。
ここではReactMarkdonwというサードパーティーのコンポーネントでHTMLとして描画する。

```
$ npm i react-markdown
```

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-8-5-2-fu-shu-norikuesuto-uotahuorurikuesuto-r462d7?file=/src/GitHubUser.js

#### 5.2.1 ネットワーク遅延のシミュレーション
ブラウザの開発ツールを開くと、「Network」タブですべてのリクエストを見ることができる。
さらに下位のタブの中からリクエストの種類を選んで個々のHTTPリクエストのタイムラインを見ることが可能。
「XHR」(XMLHttpRequest)を指定してフィルタリングすると、fetchのリクエストのみが表示される。

タイムラインを見ることで4つのリクエストが逐次処理されているのが分かる。

### 5.3 並列リクエスト
アプリケーションによっては複数のリクエストをひとつずつ順番に送信するのではなく、
一度に送信した方がよい場合がある。
これをウォーターフォールに比して並列リクエストと呼ぶ。

▼ codesandbox<br>
https://codesandbox.io/s/hands-on-react-8-5-3-fu-shu-norikuesuto-bing-lie-rikuesuto-6c5erw