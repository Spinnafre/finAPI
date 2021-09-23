import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { id: sender_id } = request.params;

    //Pega a url que foi passada na requisição
    // /statements/deposit ou /statement/withdraw
    const splittedPath = request.originalUrl.split('/')
    //Pega o último caminho que foi passado na url ('withdraw' ou 'deposit')
    //Caso seja realizando alguma transferência irá ser -2 para pegar o type 'transfer'
    const type = splittedPath[sender_id ? splittedPath.length - 2 :splittedPath.length - 1] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id
    });

    return response.status(201).json(statement);
  }
}
