import path from 'path';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Menu } from '../src/Menu.js';
import data from '../src/data.json';
import express from 'express';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.static('./build'));

app.get('/*', (req, res) => {
    const renderedHtml = ReactDOMServer.renderToString(
        <Menu recipes={data} title="Delicious Recipes" />
    );

    const indexFile = path.resolve('./build-server/index.html');

    fs.readFile(indexFile, 'utf8', (err, data) => {
        console.log(`loaded!`);
        return res.send(
            data.replace(
                '<div id="root"></div>',
                `<div id="root">${renderedHtml}</div>`
            )
        );
    });
});

app.listen(PORT, () => {
    return console.log(`Server is listening on port ${PORT}`);
});
