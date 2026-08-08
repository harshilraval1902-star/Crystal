import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { deleteUploadedFile } from '../utils/file';
import { mapBooleans, buildUpdateQuery } from '../utils/dbHelpers';

const BOOLEAN_FIELDS = ["isActive", "isDeleted"];

function formatHeroSlide(slide: any) {
  return mapBooleans(slide, BOOLEAN_FIELDS);
}

export class HeroSlideController {
  // Get all active slides (for public UI)
  static async getAllActive(req: Request, res: Response) {
    try {
      const [slides] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM heroslide WHERE isActive = ? AND isDeleted = ? ORDER BY displayOrder ASC",
        [true, false]
      );
      res.json(slides.map(formatHeroSlide));
    } catch (error) {
      console.error('Error fetching active hero slides:', error);
      res.status(500).json({ error: 'Failed to fetch hero slides' });
    }
  }

  // Get all slides including inactive (for admin UI)
  static async getAllAdmin(req: Request, res: Response) {
    try {
      const [slides] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM heroslide WHERE isDeleted = ? ORDER BY displayOrder ASC",
        [false]
      );
      res.json(slides.map(formatHeroSlide));
    } catch (error) {
      console.error('Error fetching all hero slides:', error);
      res.status(500).json({ error: 'Failed to fetch hero slides' });
    }
  }

  // Create a new slide
  static async create(req: Request, res: Response) {
    try {
      const { name, imgUrl, isActive, displayOrder } = req.body;
      
      const insertData = {
        name,
        imgUrl,
        isActive: isActive ?? true,
        displayOrder: displayOrder ?? 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO heroslide (
          name, imgUrl, isActive, displayOrder, isDeleted, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          insertData.name, insertData.imgUrl, insertData.isActive,
          insertData.displayOrder, insertData.isDeleted, insertData.createdAt, insertData.updatedAt
        ]
      );

      const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM heroslide WHERE id = ?", [result.insertId]);
      res.status(201).json(formatHeroSlide(rows[0]));
    } catch (error) {
      console.error('Error creating hero slide:', error);
      res.status(500).json({ error: 'Failed to create hero slide' });
    }
  }

  // Update a slide
  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, imgUrl, isActive, displayOrder } = req.body;
      
      const updateData: Record<string, any> = { updatedAt: new Date() };
      if (name !== undefined) updateData.name = name;
      if (imgUrl !== undefined) updateData.imgUrl = imgUrl;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

      const queryParts = buildUpdateQuery("heroslide", updateData);
      if (queryParts) {
        await pool.execute(
          `UPDATE heroslide SET ${queryParts.setClause} WHERE id = ?`,
          [...queryParts.values, id]
        );
      }
      
      const [updatedRows] = await pool.query<RowDataPacket[]>("SELECT * FROM heroslide WHERE id = ?", [id]);
      res.json(formatHeroSlide(updatedRows[0]));
    } catch (error) {
      console.error('Error updating hero slide:', error);
      res.status(500).json({ error: 'Failed to update hero slide' });
    }
  }

  // Soft delete a slide
  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM heroslide WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
      const existing = existingRows[0];

      if (existing) {
        await deleteUploadedFile(existing.imgUrl);
      }
      
      await pool.execute("UPDATE heroslide SET isDeleted = ?, isActive = ?, updatedAt = NOW() WHERE id = ?", [true, false, id]);
      res.json({ message: 'Slide deleted successfully' });
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      res.status(500).json({ error: 'Failed to delete hero slide' });
    }
  }
}
