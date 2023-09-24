import { Request, Response } from 'express';
import { runSequential } from '../service/Sequential';

export const message = async (req: Request, res: Response): Promise<void> => {
    try {
      const message = req.body.message;
      const response = await runSequential (message);
  
      res.json({ response: response });
    } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).json({ error: "you send to wrong message" });
    }
  };
  