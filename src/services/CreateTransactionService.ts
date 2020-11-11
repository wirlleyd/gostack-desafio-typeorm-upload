import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('The type must be income or outcome.');
    }

    const currentBalance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > currentBalance.total) {
      throw new AppError('Insufient balance.');
    }

    const { id: category_id } = await categoriesRepository.createIfNotExist(
      'title',
      category,
      {
        title: category,
      },
    );

    const newTransaction = transactionRepository.create({
      title,
      type,
      category_id,
      value,
    });

    await transactionRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
