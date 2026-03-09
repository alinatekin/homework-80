import express from 'express';
import mysqlDb from '../mysqlDb.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import {LocationMutation} from "../types.js";

const locationsRouter = express.Router();

locationsRouter.get('/', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const [results] = await connection.query('SELECT id, name FROM locations');
    res.send(results);
});

locationsRouter.get('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const [results] = await connection.query<RowDataPacket[]>('SELECT * FROM locations WHERE id = ?', [req.params.id]);

    if (results.length === 0) {
        res.status(404).send({ error: 'Location not found' });
        return;
    }

    res.send(results[0]);
});

locationsRouter.post('/', async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ error: 'Name is required' });
        return;
    }

    const locationData: LocationMutation = {
        name: req.body.name,
        description: req.body.description || null,
    };

    const connection = mysqlDb.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO locations (name, description) VALUES (?, ?)',
        [locationData.name, locationData.description]
    );

    res.send({
        id: result.insertId,
        ...locationData
    });
});

locationsRouter.put('/:id', async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ error: 'Name is required' });
        return;
    }

    const locationData: LocationMutation = {
        name: req.body.name,
        description: req.body.description || null,
    };

    const connection = mysqlDb.getConnection();
    await connection.query(
        'UPDATE locations SET name = ?, description = ? WHERE id = ?',
        [locationData.name, locationData.description, req.params.id]
    );

    res.send({
        id: parseInt(req.params.id),
        ...locationData
    });
});

locationsRouter.delete('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    try {
        const [result] = await connection.query<ResultSetHeader>('DELETE FROM locations WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            res.status(404).send({ error: 'Location not found' });
            return;
        }

        res.send({ message: 'Location deleted successfully' });
    } catch (e: any) {
        if (e.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).send({ error: 'Cannot delete location because it has items linked to it.' });
            return;
        }
        res.status(500).send({ error: 'Internal server error' });
    }
});

export default locationsRouter;