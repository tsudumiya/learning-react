import React from 'react';
import ReactDOM from 'react-dom';

function IngredientsList({ items }) {
    return React.createElement(
        'ul',
        { className: 'ingredients' },
        items.map((ingredient, i) =>
            React.createElement('li', { key: i }, ingredient)
        )
    );
}

const items = [
    '1 cup unsalted butter',
    '1 cup crunchy peanut butter',
    '1 cup brown sugar',
    '1 cup white sugar',
    '2 eggs',
    '2.5 cups all purpose flour',
    '1 teaspoon baking powder',
    '0.5 teaspoon salt',
];

ReactDOM.render(
    React.createElement(IngredientsList, { items }, null),
    document.getElementById('root')
);
