import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import GridLoader from 'react-spinners/GridLoader';

//
// 9.3.2 Promiseをthrowする 〜 9.3.3 サスペンスデータソース
//

// 成功
// const loadStatus = () => 'success - ready';
// 失敗
// const loadStatus = () => {
//     throw new Error('something went wrong');
// };
// 保留中
// const loadStatus = () => {
//     throw new Promise((resolves) => null);
// };

// const loadStatus = () => {
//     console.log('load status');
//     throw new Promise((resolves) => setTimeout(resolves, 3000));
// };
const loadStatus = (function () {
    let error, response;
    const promise = new Promise((resolves) => {
        return setTimeout(resolves, 3000);
    })
        .then(() => (response = 'success'))
        .catch((e) => (error = e));

    return function () {
        if (error) throw error;
        if (response) return response;
        throw promise;
    };
})();

function Status() {
    const status = loadStatus();
    return <h1>status: {status}</h1>;
}

export default function App() {
    return (
        <Suspense fallback={<GridLoader />}>
            <ErrorBoundary>
                <Status />
            </ErrorBoundary>
        </Suspense>
    );
}
