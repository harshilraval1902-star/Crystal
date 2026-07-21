import { Request, Response } from 'express';
import prisma from '../config/db';

export class HeroSlideController {
  // Get all active slides (for public UI)
  static async getAllActive(req: Request, res: Response) {
    try {
      const slides = await prisma.heroSlide.findMany({
        where: { isActive: true, isDeleted: false },
        orderBy: { displayOrder: 'asc' }
      });
      res.json(slides);
    } catch (error) {
      console.error('Error fetching active hero slides:', error);
      res.status(500).json({ error: 'Failed to fetch hero slides' });
    }
  }

  // Get all slides including inactive (for admin UI)
  static async getAllAdmin(req: Request, res: Response) {
    try {
      const slides = await prisma.heroSlide.findMany({
        where: { isDeleted: false },
        orderBy: { displayOrder: 'asc' }
      });
      res.json(slides);
    } catch (error) {
      console.error('Error fetching all hero slides:', error);
      res.status(500).json({ error: 'Failed to fetch hero slides' });
    }
  }

  // Create a new slide
  static async create(req: Request, res: Response) {
    try {
      const { name, imgUrl, isActive, displayOrder } = req.body;
      const slide = await prisma.heroSlide.create({
        data: { name, imgUrl, isActive: isActive ?? true, displayOrder: displayOrder ?? 0 }
      });
      res.status(201).json(slide);
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
      
      const slide = await prisma.heroSlide.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(imgUrl !== undefined && { imgUrl }),
          ...(isActive !== undefined && { isActive }),
          ...(displayOrder !== undefined && { displayOrder })
        }
      });
      res.json(slide);
    } catch (error) {
      console.error('Error updating hero slide:', error);
      res.status(500).json({ error: 'Failed to update hero slide' });
    }
  }

  // Soft delete a slide
  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await prisma.heroSlide.update({
        where: { id },
        data: { isDeleted: true, isActive: false }
      });
      res.json({ message: 'Slide deleted successfully' });
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      res.status(500).json({ error: 'Failed to delete hero slide' });
    }
  }
}
