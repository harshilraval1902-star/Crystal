import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { mapBooleans, buildUpdateQuery } from '../utils/dbHelpers';

const BOOLEAN_FIELDS = ["isActive", "isDeleted"];

function formatROFeature(feature: any) {
  return mapBooleans(feature, BOOLEAN_FIELDS);
}

export class ROFeatureController {
  static async getAllActive(req: Request, res: Response) {
    try {
      const [features] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM rofeature WHERE isActive = ? AND isDeleted = ? ORDER BY displayOrder ASC",
        [true, false]
      );
      res.json(features.map(formatROFeature));
    } catch (error) {
      console.error('Error fetching active RO features:', error);
      res.status(500).json({ error: 'Failed to fetch RO features' });
    }
  }

  static async getAllAdmin(req: Request, res: Response) {
    try {
      const [features] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM rofeature WHERE isDeleted = ? ORDER BY displayOrder ASC",
        [false]
      );
      res.json(features.map(formatROFeature));
    } catch (error) {
      console.error('Error fetching all RO features:', error);
      res.status(500).json({ error: 'Failed to fetch RO features' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { title, description, iconName, isActive, displayOrder } = req.body;
      
      const insertData = {
        title,
        description,
        iconName: iconName ?? null,
        isActive: isActive ?? true,
        displayOrder: displayOrder ?? 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO rofeature (
          title, description, iconName, isActive, displayOrder, isDeleted, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          insertData.title, insertData.description, insertData.iconName, insertData.isActive,
          insertData.displayOrder, insertData.isDeleted, insertData.createdAt, insertData.updatedAt
        ]
      );

      const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM rofeature WHERE id = ?", [result.insertId]);
      res.status(201).json(formatROFeature(rows[0]));
    } catch (error) {
      console.error('Error creating RO feature:', error);
      res.status(500).json({ error: 'Failed to create RO feature' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { title, description, iconName, isActive, displayOrder } = req.body;
      
      const updateData: Record<string, any> = { updatedAt: new Date() };
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (iconName !== undefined) updateData.iconName = iconName;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

      const queryParts = buildUpdateQuery("rofeature", updateData);
      if (queryParts) {
        await pool.execute(
          `UPDATE rofeature SET ${queryParts.setClause} WHERE id = ?`,
          [...queryParts.values, id]
        );
      }
      
      const [updatedRows] = await pool.query<RowDataPacket[]>("SELECT * FROM rofeature WHERE id = ?", [id]);
      res.json(formatROFeature(updatedRows[0]));
    } catch (error) {
      console.error('Error updating RO feature:', error);
      res.status(500).json({ error: 'Failed to update RO feature' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await pool.execute("UPDATE rofeature SET isDeleted = ?, isActive = ?, updatedAt = NOW() WHERE id = ?", [true, false, id]);
      res.json({ message: 'RO Feature deleted successfully' });
    } catch (error) {
      console.error('Error deleting RO feature:', error);
      res.status(500).json({ error: 'Failed to delete RO feature' });
    }
  }
}
