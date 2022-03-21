import React from 'react';
import data from './data/recipes.json';
import Menu from './components/Menu';

export default function App() {
    return <Menu recipes={data} />;
}
