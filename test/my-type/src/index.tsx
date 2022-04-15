import React, { useState } from 'react';
import ReactDOM from 'react-dom';

type AppProps = {
    item: string;
};

/* function App(props: AppProps) {
    return (
        <div>
            <h1>{props.item}</h1>
        </div>
    );
} */

// デストラクチャリングでもOK
/* function App({ item }: AppProps) {
    return (
        <div>
            <h1>{item}</h1>
        </div>
    );
} */

// TypeScriptの型推論
function App({ item }: AppProps) {
    const [fabricColor, setFabricColor] = useState('purple');

    return (
        <div>
            <h1>
                {fabricColor} {item}
            </h1>
            {/* TypeScriptの型推論により型注釈がなくとも、fabricColorの型を初期値のpurpleから文字列と推論できる。よってsetFabricColor(1)とするとエラーとなる。 */}
            <button onClick={() => setFabricColor('green')}>BUTTON</button>
        </div>
    );
}

// propsに数値を渡すとエラーとなる。
ReactDOM.render(<App item="jacket" />, document.getElementById('root'));
