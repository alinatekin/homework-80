import express from 'express';
import mysqlDb from '../mysqlDb.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { imagesUpload } from '../multer.js';
import {ItemMutation} from "../types.js";

const itemsRouter = express.Router();

itemsRouter.get('/', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const [results] = await connection.query(
        'SELECT id, name, category_id, location_id FROM items'
    );
    res.send(results);
});

itemsRouter.get('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const [results] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM items WHERE id = ?',
        [req.params.id]
    );

    if (results.length === 0) {
        res.status(404).send({ error: 'Item not found' });
        return;
    }
    res.send(results[0]);
});

itemsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
    if (!req.body.name || !req.body.category_id || !req.body.location_id) {
        res.status(400).send({ error: 'Name, category_id, and location_id are required' });
        return;
    }

    const itemData: ItemMutation = {
        name: req.body.name,
        category_id: parseInt(req.body.category_id),
        location_id: parseInt(req.body.location_id),
        description: req.body.description || null,
        image: req.file ? 'images/' + req.file.filename : null,
    };

    const registrationDate = new Date().toISOString().slice(0, 10);

    const connection = mysqlDb.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO items (category_id, location_id, name, description, image, registration_date) VALUES (?, ?, ?, ?, ?, ?)',
        [
            itemData.category_id,
            itemData.location_id,
            itemData.name,
            itemData.description,
            itemData.image,
            registrationDate,
        ]
    );

    res.send({
        id: result.insertId,
        registration_date: registrationDate,
        ...itemData,
    });
});

itemsRouter.delete('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM items WHERE id = ?',
        [req.params.id]
    );

    if (result.affectedRows === 0) {
        res.status(404).send({ error: 'Item not found' });
        return;
    }
    res.send({ message: 'Item deleted successfully' });
});

itemsRouter.put('/:id', imagesUpload.single('image'), async (req, res) => {
    if (!req.body.name || !req.body.category_id || !req.body.location_id) {
        res.status(400).send({ error: 'Name, category_id, and location_id are required' });
        return;
    }

    const connection = mysqlDb.getConnection();

    const image = req.file ? 'images/' + req.file.filename : null;

    await connection.query(
        'UPDATE items SET category_id = ?, location_id = ?, name = ?, description = ?, image = COALESCE(?, image) WHERE id = ?',
        [
            parseInt(req.body.category_id),
            parseInt(req.body.location_id),
            req.body.name,
            req.body.description || null,
            image,
            req.params.id
        ]
    );

    res.send({ message: 'Item updated successfully' });
});

export default itemsRouter;