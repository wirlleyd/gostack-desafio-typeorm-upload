import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    const income = transactions.reduce(
      (total, transaction) =>
        transaction.type === 'income' ? total + +transaction.value : total,
      0,
    );

    const outcome = transactions.reduce(
      (total, transaction) =>
        transaction.type === 'outcome' ? total + +transaction.value : total,
      0,
    );

    return {
      income,
      outcome,
      total: +(income - outcome).toFixed(2),
    };
  }
}

export default TransactionsRepository;
