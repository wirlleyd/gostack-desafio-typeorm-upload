import path from 'path';
import fs from 'fs';
import csvToJson from 'csvtojson';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

const createTransactionService = new CreateTransactionService();

class ImportTransactionsService {
  async execute(file_name: string): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, file_name);
    const transactions = await csvToJson().fromFile(csvFilePath);

    const newTransactions: Transaction[] = [];

    await transactions.reduce(async (previousPromise, nextTransaction) => {
      return previousPromise.then(() => {
        return createTransactionService
          .execute(nextTransaction)
          .then(result => newTransactions.push(result));
      });
    }, Promise.resolve());

    await fs.promises.unlink(csvFilePath);

    return newTransactions;
  }
}

export default ImportTransactionsService;
