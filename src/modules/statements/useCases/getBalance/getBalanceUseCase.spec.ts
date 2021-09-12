import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from './../createStatement/CreateStatementUseCase';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';

import { GetBalanceError } from "./GetBalanceError";

let memoryStatementsRepository:IStatementsRepository
let getBalanceInMemoryUseCase:GetBalanceUseCase
let usersRepositoryInMemory:InMemoryUsersRepository
let createStatementUseCase:CreateStatementUseCase
let createUserUseCase:CreateUserUseCase
enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe('Get balance', () => {
  beforeEach(() => {
    memoryStatementsRepository=new InMemoryStatementsRepository();
    usersRepositoryInMemory=new InMemoryUsersRepository()
    createUserUseCase= new CreateUserUseCase(usersRepositoryInMemory);
    getBalanceInMemoryUseCase=new GetBalanceUseCase(memoryStatementsRepository,usersRepositoryInMemory)
    createStatementUseCase=new CreateStatementUseCase(usersRepositoryInMemory,memoryStatementsRepository)
  })

  it('Should be able get balance', async() => {

    const user=await createUserUseCase.execute({
      name:"Davi",
      email:"davi@gmail.com",
      password:"123"
    })

    await createStatementUseCase.execute({
      user_id:user.id as string,
      type:"deposit" as OperationType,
      amount:1000,
      description:"Money for car"
    })
    await createStatementUseCase.execute({
      user_id:user.id as string,
      type:"deposit" as OperationType,
      amount:1000,
      description:"Money for car"
    })


    const {balance}=await getBalanceInMemoryUseCase.execute({
      user_id:user.id as string,
    })

    expect(balance).toEqual(2000)

  })
  it('Should not be able get balance with user id invalid', async() => {

    const user=await createUserUseCase.execute({
      name:"Davi",
      email:"davi@gmail.com",
      password:"123"
    })

    await createStatementUseCase.execute({
      user_id:user.id as string,
      type:"deposit" as OperationType,
      amount:1000,
      description:"Money for car"
    })
    await createStatementUseCase.execute({
      user_id:user.id as string,
      type:"deposit" as OperationType,
      amount:1000,
      description:"Money for car"
    })


    await expect(getBalanceInMemoryUseCase.execute({
      user_id:'12'
    })).rejects.toBeInstanceOf(GetBalanceError)

  })

})
