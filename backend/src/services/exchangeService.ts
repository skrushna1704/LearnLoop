import Exchange, { IExchange } from '../models/Exchange';

export const getExchangesByUserId = async (userId: string): Promise<IExchange[]> => {
  try {
    const exchanges = await Exchange.find({
      $or: [
        { proposer: userId },
        { receiver: userId }
      ]
    })
    .populate({ path: 'proposer', select: 'profile' })
    .populate({ path: 'receiver', select: 'profile' })
    .populate({ path: 'users.user', select: 'profile' })
    .populate('users.skill', 'name');
    
    return exchanges;
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    throw new Error('Failed to fetch exchanges');
  }
};

export const createExchange = async (exchangeData: any): Promise<IExchange> => {
  try {
    const { receiverId, offeredSkillId, requestedSkillId, proposer } = exchangeData;
    
    // This is a temporary title generation. You might want a more descriptive title.
    const title = `Skill Exchange Proposal`;

    const newExchange = new Exchange({
      title,
      proposer,
      receiver: receiverId,
      offeredSkill: offeredSkillId,
      desiredSkill: requestedSkillId,
      users: [
        { user: proposer, role: 'teacher', skill: offeredSkillId },
        { user: receiverId, role: 'learner', skill: requestedSkillId }
      ],
      status: 'pending',
      // ...other fields from exchangeData if any, or set defaults
    });

    await newExchange.save();
    return newExchange;
  } catch (error) {
    console.error('Error creating exchange:', error);
    throw new Error('Failed to create exchange');
  }
};

export const getExchangeById = async (exchangeId: string): Promise<IExchange | null> => {
  try {
    const exchange = await Exchange.findById(exchangeId)
      .populate({ path: 'proposer', select: 'profile' })
      .populate({ path: 'receiver', select: 'profile' })
      .populate({ path: 'users.user', select: 'profile' })
      .populate('users.skill', 'name');
    
    return exchange;
  } catch (error) {
    console.error('Error fetching exchange by ID:', error);
    throw new Error('Failed to fetch exchange');
  }
};

export const updateExchangeStatus = async (exchangeId: string, status: string, userId: string): Promise<IExchange | null> => {
  try {
    const exchange = await Exchange.findById(exchangeId);

    if (!exchange) {
      return null;
    }

    // Only the receiver can accept/reject a pending proposal
    if (exchange.status === 'pending' && exchange.receiver.toString() !== userId) {
      throw new Error('User not authorized to update this exchange');
    }

    exchange.status = status as IExchange['status'];
    await exchange.save();
    return exchange;
  } catch (error) {
    console.error('Error updating exchange status:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update exchange status');
  }
}; 