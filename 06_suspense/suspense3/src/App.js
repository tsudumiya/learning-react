import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import GridLoader from 'react-spinners/GridLoader';

//
// 9.3.3 サスペンスデータソース
//

// サスペンスデータソースを戻り値として返す
function createResource(pending) {
    let error, response;
    pending.then((r) => (response = r)).catch((e) => (error = e));
    return {
        read() {
            if (error) throw error;
            if (response) return response;
            throw pending;
        },
    };
}

// 非同期処理で行いたいこと
const threeSecondsToGnar = new Promise((resolves) => setTimeout(() => resolves({ gnar: 'gnarly!' }), 3000));

// サスペンスデータソースを戻り値として返すcreateResource()を実行する
const resource = createResource(threeSecondsToGnar);

function Gnar() {
    const result = resource.read();
    return <h1>Gnar: {result.gnar}</h1>;
}

export default function App() {
    return (
        <Suspense fallback={<GridLoader />}>
            <ErrorBoundary>
                <Gnar />
            </ErrorBoundary>
        </Suspense>
    );
}
