import 'reflect-metadata';
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, type, amount, description,sender_id }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(sender_id){
      const senderUser=await this.usersRepository.findById(user_id)
      if(!senderUser){
        throw new CreateStatementError.UserNotFound();
      }
    }

    if(type === 'withdraw' || type === 'transfer') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      // Se o saldo total for menor do que a quantidade que quero
      // sacar, não irá deixar realizar a operação.
      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    //Irá salvar no statement do usuário que está recebendo a transferência
    if(type === 'transfer'){
      await this.statementsRepository.create({
        user_id:sender_id,
        type,
        amount,
        description,
        sender_id:user_id
      });
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
      sender_id:user_id
    });

    return statementOperation;
  }
}
