# React Hooks

## useEffect
描画が完了した後に何かしたい時に使う。<br>
第一引数に副作用のコールバック関数。第二引数に依存配列。

```js
import React, { useState, useEffect } from "react";

function Checkbox() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    alert(`checked: ${checked.toString()}`);
  });

  return (
    <>
      <input
        type="checkbox"
        value={checked}
        onChange={() => setChecked(checked => !checked)}
      />
      {checked ? "checked" : "not checked"}
    </>
  );
}

export default function App() {
  return <Checkbox />;
}
```

[useEffect sample code1](https://codesandbox.io/s/learning-react-useeffect-3-flshw?file=/src/App.js:0-459)

```js
import React, { useState, useEffect } from "react";

export default function App() {
  const [val, set] = useState("");
  const [phrase, setPhrase] = useState("example phrase");

  const createPhrase = () => {
    setPhrase(val);
    set("");
  };

  useEffect(() => {
    console.log(`typing "${val}"`);
  }, [val]);

  useEffect(() => {
    console.log(`saved phrase: "${phrase}"`);
  }, [phrase]);

  useEffect(() => {
    console.log("either val or phrase has changed");
  }, [val, phrase]);

  useEffect(() => {
    console.log("only once after initial render");
  }, []);

  return (
    <>
      <label>Favorite phrase:</label>
      <input
        value={val}
        placeholder={phrase}
        onChange={(e) => set(e.target.value)}
      />
      <button onClick={createPhrase}>send</button>
    </>
  );
}
```

[useEffect sample code2](https://codesandbox.io/s/useeffect-yi-cun-pei-lie-o9u3pl?file=/src/App.js)

戻り値で関数を指定すると、コンポーネントがツリーからアンマウントされたときにその関数が呼び出される。


## useMemo
メモ化された値を取得するためのフック。メモ化することで、関数は以前の呼び出し結果をそのときの引数とともにキャッシュしておき、
あとで同じ引数で呼び出された時、計算せずにそのキャッシュを返す。
依存配列の同一性を保証するために使う。
useEffectなどの依存配列に参照値を使うと同一のインスタンスとはみなされないため、再描画が発生する。useMemoを使えばそれを防げる。

useMemoは関数と依存配列を引数に取る。<br>
注:useMemoの依存配列にchildrenを指定している点に注意。

```js
import React, { useState, useEffect, useMemo } from "react";

const useAnyKeyToRender = () => {
  const [, forceRender] = useState();
  useEffect(() => {
    window.addEventListener("keydown", forceRender);
    return () => window.removeEventListener("keydown", forceRender);
  }, []);
};

function WordCount({ children = "" }) {
  useAnyKeyToRender();

  // 再描画のたびに新しいインスタンスが生成されてuseEffectの依存配列であるwordsが同一とみなされない。
  //const words = ["sick","powder","day"];

  // useMemoを使用することで参照地の同一性が保証される。よってuseEffectの依存配列は更新されないため再描画されない。
  const words = useMemo(() => {
    return children.split(" ");
  }, [children]);

  useEffect(() => {
    console.log("fresh render");
  }, [words]);

  return <p>{children}</p>;
}

export default function App() {
  return <WordCount>You are not going to believe this but...</WordCount>;
}
```

[useMemo sample code1](https://codesandbox.io/s/hands-on-react-7-1-2-usememo-6jgqkd?file=/src/App.js)

## useCallback
useMemoはメモ化された値を返すのに対し、
useCallbackはメモ化された関数を返す。

依存配列に空の配列を指定することで初回描画時に初期化されてから以降は常に同一のインスタンスが代入される。

```js
import React, { useState, useEffect, useMemo, useCallback } from "react";

const useAnyKeyToRender = () => {
  const [, forceRender] = useState();
  useEffect(() => {
    window.addEventListener("keydown", forceRender);
    return () => window.removeEventListener("keydown", forceRender);
  }, []);
};

function WordCount({ children = "" }) {
  useAnyKeyToRender();

  // 再描画のたびに新しいインスタンスが生成されてuseEffectの依存配列であるfnが同一とみなされない。
  /*
  const fn = () => {
    console.log("hello");
  }*/

  // usecallback
  const fn = useCallback(() => {
    console.log("hello");
  }, []);

  useEffect(() => {
    console.log("fresh render");
    fn();
  }, [fn]);

  return <p>{children}</p>;
}

export default function App() {
  return <WordCount>You are not going to believe this but...</WordCount>;
}
```

[useCallback sample code](https://codesandbox.io/s/hands-on-react-7-1-2-usecallback-g8vh2b?file=/src/App.js)


## useLayoutEffect
ブラウザのPaint処理よりも前に何かしたい時に使うフック。<br>
たとえばブラウザのウィンドウサイズをもとにコンポーネントのサイズを計算したい時など。

```js
import React, { useState, useEffect, useLayoutEffect } from "react";

function useWindowSize() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const resize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", resize);
    //resize(); // 初回用?
    return () => window.removeEventListener("resize", resize);
  }, []);

  return [width, height];
}

function useMousePosition() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const setPosition = ({ x, y }) => {
    setX(x);
    setY(y);
  };

  useLayoutEffect(() => {
    window.addEventListener("mousemove", setPosition);
    return () => window.removeEventListener("mousemove", setPosition);
  }, []);

  return [x, y];
}

export default function App() {
  const [width, height] = useWindowSize();

  useEffect(() => {
    console.log(`window width: ${width}, window height: ${height}`);
  }, [width, height]);

  const [x, y] = useMousePosition();
  console.log(x, y);

  useEffect(() => {
    console.log("useEffect");
  }, []);

  useLayoutEffect(() => {
    console.log("useLayoutEffect");
  }, []);

  return (
    <>
      <p>open console</p>
    </>
  );
}
```

[useLayoutEffect](https://codesandbox.io/s/hands-on-react-7-2-useeffecttouselayouteffect-y1digt?file=/src/App.js)


## フックの使い方に関するルール
- フックはコンポーネントのスコープで実行すること
- ひとつのフックで多くのことをせずに複数のフックに分割すること
- フックは常に描画関数のトップレベルから呼び出さなければいけない
- フックを非同期呼び出しすることはできないが、条件文と同様、副作用関数の内部であれば呼び出すことが可能。


## useReducer
useReducerでステート更新のロジックを抽象化できる。
useReducerの戻り値の配列は、1番目の要素がステート値で、2番目の要素がリデューサーを実行するための関数(dispatch関数)

```js
import React, { useState, useReducer } from "react";

function Checkbox() {
  //
  // const [checked, setChecked] = useState(false);

  /*function toggle() {
    setChecked(checked => !checked);
  }*/

  // useReducerでステート更新のロジックを抽象化。useReducerの戻り値の配列は、1番目の要素がステート値で、2番目の要素がリデューサーを実行するための関数(dispatch関数)
  const [checked, toggle] = useReducer((checked) => {
    return !checked;
  }, false);

  return (
    <>
      <input type="checkbox" value={checked} onChange={toggle} />
      {checked ? "checked" : "not checked"}
    </>
  );
}

export default function App() {
  return <Checkbox />;
}
```

[useReducer1](https://codesandbox.io/s/hands-on-react-7-3-usereducer1-oit1ro?file=/src/App.js)

useReducerはArray.reduceのように現在のステート値と入力値の2つの引数を取ることができる。

```js
import React, { useState, useReducer } from "react";

// useReducerはArray.reduceのように現在のステート値と入力値の2つの引数を取ることができる。
function Numbers() {
  const [number, setNumber] = useReducer((number, newNumber) => {
    return number + newNumber;
  }, 0);

  return <h1 onClick={() => setNumber(1)}>{number}</h1>;
}

export default function App() {
  return <Numbers />;
}
```

[useReducer2](https://codesandbox.io/s/hands-on-react-7-3-usereducer2-v4bkxm?file=/src/App.js)

useReducerは、より複雑なステートを更新する際に効力を発揮します。
このパターンは複数の値を包含したステート値や、前のステート値に基づいて次のステート値が決まるような場合に有効です。 
すべてのイベントハンドラにスプレッド構文を記述するよりも、useReducerを使った方がコードが簡素になり、間違いも起こりにくいでしょう。

```js
import React, { useState, useReducer } from "react";

const firstUser = {
  id: "0391-3233-3201",
  firstName: "Bill",
  lastName: "wilson",
  city: "Missoula",
  state: "Montana",
  email: "bwilson@mmtnwilsons.com",
  admin: false
};

function User() {
  // const [user, setUser] = useState(firstUser);
  // useReducerでリファクタリング
  const [user, setUser] = useReducer((user, newDetails) => {
    return { ...user, ...newDetails };
  }, firstUser);

  return (
    <div>
      <h1>
        {user.firstName} {user.lastName} - {user.admin ? "Admin" : "User"}
      </h1>
      <p>Email: {user.email}</p>
      <p>
        Location: {user.city}, {user.state}
      </p>
      {/*
      <button
        onClick={() => {
          setUser({ ...user, admin: true });
        }}
      >
        Make Admin
      </button>
      */}
      <button
        onClick={() => {
          setUser({ admin: true });
        }}
      >
        Make Admin
      </button>
    </div>
  );
}

export default function App() {
  return (
    <>
      <User />
    </>
  );
}
```

[useReducer3](https://codesandbox.io/s/hands-on-react-7-3-usereducer3-6jqzxl?file=/src/App.js)


