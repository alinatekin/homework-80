import express from 'express';
import cors from 'cors';
import mysqlDb from './mysqlDb.js';
import categoriesRouter from "./routers/categories.js";
import locationsRouter from "./routers/locations.js";
import itemsRouter from "./routers/items.js";

const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);
app.use('/items', itemsRouter);

const run = async () => {
    await mysqlDb.init();
    console.log('Connected to MySQL database!');

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

run().catch(console.error);