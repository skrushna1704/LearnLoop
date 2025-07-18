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
    .populate('users.skill', 'name')
    .populate('offeredSkill', 'name')
    .populate('desiredSkill', 'name');
    
    // Filter out exchanges with null references and add user role information
    const validExchanges = exchanges.filter(exchange => {
      if (!exchange.proposer || !exchange.receiver) {
        console.warn('Filtering out exchange with null proposer or receiver:', exchange._id);
        return false;
      }
      return true;
    });
    
    const exchangesWithRole = validExchanges.map(exchange => {
      const exchangeObj = exchange.toObject() as any;
      
      try {
        if (exchange.proposer && exchange.proposer.toString() === userId) {
          exchangeObj.myRole = 'teacher'; // Proposer is teaching their offered skill
        } else {
          exchangeObj.myRole = 'learner'; // Receiver is learning the offered skill
        }
      } catch (error) {
        console.error('Error determining role for exchange:', exchange._id, error);
        exchangeObj.myRole = 'unknown';
      }
      
      return exchangeObj;
    });
    
    return exchangesWithRole;
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
      .populate('users.skill', 'name')
      .populate('offeredSkill', 'name')
      .populate('desiredSkill', 'name');
    
    return exchange;
  } catch (error) {
    console.error('Error fetching exchange by ID:', error);
    throw new Error('Failed to fetch exchange');
  }
};

export const updateExchangeStatus = async (exchangeId: string, status: string, userId: string): Promise<IExchange | null> => {
  try {
    const exchange = await Exchange.findById(exchangeId)
      .populate('proposer', 'profile.name')
      .populate('receiver', 'profile.name')
      .populate('offeredSkill', 'name')
      .populate('desiredSkill', 'name');

    if (!exchange) {
      throw new Error('Exchange not found');
    }

    // Check if user is the receiver (only receiver can accept/reject pending proposals)
    if (!exchange.receiver) {
      throw new Error('Exchange receiver is missing');
    }
    
    if (exchange.receiver.toString() !== userId) {
      throw new Error('Only the receiver can accept or reject exchange proposals');
    }

    // Check if exchange is in pending status (only pending exchanges can be accepted/rejected)
    if (exchange.status !== 'pending') {
      throw new Error(`Cannot update exchange status. Current status is '${exchange.status}', but only 'pending' exchanges can be accepted or rejected.`);
    }

    // Validate the new status
    const validStatuses = ['active', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status '${status}'. Allowed values are: ${validStatuses.join(', ')}`);
    }

    // Update the exchange status
    exchange.status = status as IExchange['status'];
    
    // If accepting, set initial progress
    if (status === 'active') {
      exchange.progress = 0;
    }

    await exchange.save();
    return exchange;
  } catch (error) {
    console.error('Error updating exchange status:', error);
    if (error instanceof Error) {
      throw error; // Re-throw the error with the specific message
    }
    throw new Error('Failed to update exchange status');
  }
}; 