import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from './../createStatement/CreateStatementUseCase';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';

import { GetStatementOperationError } from "./GetStatementOperationError";

let memoryStatementsRepository:IStatementsRepository
let getStatementOperationUseCase:GetStatementOperationUseCase
let usersRepositoryInMemory:InMemoryUsersRepository
let createStatementUseCase:CreateStatementUseCase
let createUserUseCase:CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe('Get StatementOperation', () => {
  beforeEach(() => {
    memoryStatementsRepository=new InMemoryStatementsRepository();
    usersRepositoryInMemory=new InMemoryUsersRepository()
    createUserUseCase= new CreateUserUseCase(usersRepositoryInMemory);
    getStatementOperationUseCase=new GetStatementOperationUseCase( usersRepositoryInMemory,memoryStatementsRepository)
    createStatementUseCase=new CreateStatementUseCase(usersRepositoryInMemory,memoryStatementsRepository)
  })

  it('Should be able get statement operation', async() => {

    const user=await createUserUseCase.execute({
      name:"Davi",
      email:"davi@gmail.com",
      password:"123"
    })

    const {id}=await createStatementUseCase.execute({
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


    const statement=await getStatementOperationUseCase.execute({
      statement_id:id as string,
      user_id:user.id as string
    })

    expect(statement).toEqual(expect.objectContaining({
      id:statement?.id
    }))

  })
  it('Should not be able get statement operation with id invalid', async() => {

    const user=await createUserUseCase.execute({
      name:"Davi",
      email:"davi@gmail.com",
      password:"123"
    })

    const {id}=await createStatementUseCase.execute({
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
    await expect(getStatementOperationUseCase.execute({
      statement_id:'12',
      user_id:user.id as string
    })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)

  })
  it('Should not be able get statement operation with user invalid', async() => {

    const user=await usersRepositoryInMemory.create({
      name:"Davi",
      email:"davi@gmail.com",
      password:"123"
    })

    const {id}=await createStatementUseCase.execute({
      user_id:user.id as string,
      type:"deposit" as OperationType,
      amount:1000,
      description:"Money for car"
    })

    await expect(getStatementOperationUseCase.execute({
      statement_id:id as string,
      user_id:'12'
    })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)

  })

})
