import { Request, Response } from 'express';
import * as exchangeService from '../services/exchangeService';

export const getExchanges = async (req: Request, res: Response) => {
  try {
    // The user ID should be added to the request object by the auth middleware
    const userId = (req as any).user.id; 
    const exchanges = await exchangeService.getExchangesByUserId(userId);
    res.json(exchanges);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const createExchange = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const exchangeData = { ...req.body, proposer: userId };
    const newExchange = await exchangeService.createExchange(exchangeData);
    res.status(201).json(newExchange);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).json({ message: 'Failed to create exchange', error: error.message });
    } else {
      res.status(400).json({ message: 'Failed to create exchange' });
    }
  }
};

export const getExchangeById = async (req: Request, res: Response) => {
  try {
    const exchange = await exchangeService.getExchangeById(req.params.id);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }
    res.json(exchange);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

export const updateExchangeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user.id;

    const updatedExchange = await exchangeService.updateExchangeStatus(id, status, userId);

    if (!updatedExchange) {
      return res.status(404).json({ message: 'Exchange not found or user not authorized' });
    }

    res.json(updatedExchange);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
}; 