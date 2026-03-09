import express from 'express';
import mysqlDb from '../mysqlDb.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import {CategoryMutation} from "../types.js";

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const [results] = await connection.query('SELECT id, name FROM categories');
    res.send(results);
});

categoriesRouter.get('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const [results] = await connection.query<RowDataPacket[]>('SELECT * FROM categories WHERE id = ?', [req.params.id]);

    if (results.length === 0) {
        res.status(404).send({ error: 'Category not found' });
        return;
    }

    res.send(results[0]);
});

categoriesRouter.post('/', async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ error: 'Name is required' });
        return;
    }

    const categoryData: CategoryMutation = {
        name: req.body.name,
        description: req.body.description || null,
    };

    const connection = mysqlDb.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [categoryData.name, categoryData.description]
    );

    res.send({
        id: result.insertId,
        ...categoryData
    });
});

categoriesRouter.put('/:id', async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ error: 'Name is required' });
        return;
    }

    const categoryData: CategoryMutation = {
        name: req.body.name,
        description: req.body.description || null,
    };

    const connection = mysqlDb.getConnection();
    await connection.query(
        'UPDATE categories SET name = ?, description = ? WHERE id = ?',
        [categoryData.name, categoryData.description, req.params.id]
    );

    res.send({
        id: parseInt(req.params.id),
        ...categoryData
    });
});

categoriesRouter.delete('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    try {
        const [result] = await connection.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            res.status(404).send({ error: 'Category not found' });
            return;
        }

        res.send({ message: 'Category deleted successfully' });
    } catch (e: any) {
        if (e.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).send({ error: 'Cannot delete category because it has items linked to it.' });
            return;
        }
        res.status(500).send({ error: 'Internal server error' });
    }
});

export default categoriesRouter;