import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import 'reflect-metadata';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';

import { CreateStatementError } from "./CreateStatementError";

let memoryStatementsRepository:IStatementsRepository
let createStatementInMemoryUseCase:CreateStatementUseCase
let usersRepositoryInMemory:InMemoryUsersRepository
let createUserUseCase:CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe('Create Statement', () => {
  beforeEach(() => {
    memoryStatementsRepository=new InMemoryStatementsRepository();
    usersRepositoryInMemory=new InMemoryUsersRepository()
    createUserUseCase= new CreateUserUseCase(usersRepositoryInMemory);
    createStatementInMemoryUseCase=new CreateStatementUseCase(usersRepositoryInMemory,memoryStatementsRepository)
  })

  it('Should be able to create a deposit statement with user', async() => {

    const user=await createUserUseCase.execute({
      name:"Davi",
      email:"davi@gmail.com",
      password:"123"
    })

    const statement=await createStatementInMemoryUseCase.execute({
      user_id:user.id as string,
      type:"deposit" as OperationType,
      amount:1000,
      description:"Money for car"
    })

    expect(statement).toEqual(expect.objectContaining({
      user_id:user.id,
      type:"deposit" as OperationType,
      amount:1000,
      description:"Money for car"
    }))

  })
  it('Should be able to create a withdraw statement with user', async() => {

    const user=await createUserUseCase.execute({
      name:"Davi",
      email:"davi@gmail.com",
      password:"123"
    })

    await createStatementInMemoryUseCase.execute({
      user_id:user.id as string,
      type:"deposit" as OperationType,
      amount:1000,
      description:"Money for car"
    })

    const statement=await createStatementInMemoryUseCase.execute({
      user_id:user.id as string,
      type:"withdraw" as OperationType,
      amount:1000,
      description:"Withdraw to car"
    })

    expect(statement).toEqual(expect.objectContaining({
      user_id:user.id,
      type:"withdraw" as OperationType,
      amount:1000,
      description:"Withdraw to car"
    }))

  })
  it('Should not be able to generate a withdraw statement without balance', async() => {

    const user=await createUserUseCase.execute({
      name:"Davi",
      email:"davi@gmail.com",
      password:"123"
    })


    await expect(createStatementInMemoryUseCase.execute({
      user_id:user.id as string,
      type:"withdraw" as OperationType,
      amount:1000,
      description:"Withdraw to car"
    })).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)

  })
  it('Should not be able to generate a withdraw statement with balance insufficient', async() => {

    const user=await createUserUseCase.execute({
      name:"Davi",
      email:"davi@gmail.com",
      password:"123"
    })

    await createStatementInMemoryUseCase.execute({
      user_id:user.id as string,
      type:"deposit" as OperationType,
      amount:500,
      description:"Money for car"
    })

    await expect(createStatementInMemoryUseCase.execute({
      user_id:user.id as string,
      type:"withdraw" as OperationType,
      amount:1000,
      description:"Withdraw to car"
    })).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)

  })
})
