import { Request, Response } from 'express';
import prisma from '../config/db';

export class ROFeatureController {
  static async getAllActive(req: Request, res: Response) {
    try {
      const features = await prisma.rOFeature.findMany({
        where: { isActive: true, isDeleted: false },
        orderBy: { displayOrder: 'asc' }
      });
      res.json(features);
    } catch (error) {
      console.error('Error fetching active RO features:', error);
      res.status(500).json({ error: 'Failed to fetch RO features' });
    }
  }

  static async getAllAdmin(req: Request, res: Response) {
    try {
      const features = await prisma.rOFeature.findMany({
        where: { isDeleted: false },
        orderBy: { displayOrder: 'asc' }
      });
      res.json(features);
    } catch (error) {
      console.error('Error fetching all RO features:', error);
      res.status(500).json({ error: 'Failed to fetch RO features' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { title, description, iconName, isActive, displayOrder } = req.body;
      const feature = await prisma.rOFeature.create({
        data: { title, description, iconName, isActive: isActive ?? true, displayOrder: displayOrder ?? 0 }
      });
      res.status(201).json(feature);
    } catch (error) {
      console.error('Error creating RO feature:', error);
      res.status(500).json({ error: 'Failed to create RO feature' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { title, description, iconName, isActive, displayOrder } = req.body;
      
      const feature = await prisma.rOFeature.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(iconName !== undefined && { iconName }),
          ...(isActive !== undefined && { isActive }),
          ...(displayOrder !== undefined && { displayOrder })
        }
      });
      res.json(feature);
    } catch (error) {
      console.error('Error updating RO feature:', error);
      res.status(500).json({ error: 'Failed to update RO feature' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await prisma.rOFeature.update({
        where: { id },
        data: { isDeleted: true, isActive: false }
      });
      res.json({ message: 'RO Feature deleted successfully' });
    } catch (error) {
      console.error('Error deleting RO feature:', error);
      res.status(500).json({ error: 'Failed to delete RO feature' });
    }
  }
}
