import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { IUsersRepository } from './../../repositories/IUsersRepository';

import { CreateUserError } from "./CreateUserError";

let usersRepositoryInMemory: IUsersRepository
let createUserUserCase:CreateUserUseCase

describe('Create user', () => {
  beforeEach(() => {
    usersRepositoryInMemory=new InMemoryUsersRepository()
    createUserUserCase=new CreateUserUseCase(usersRepositoryInMemory)
  })
  it('should be able to create a user', async() => {
    const user=await createUserUserCase.execute({
      name:'Davi',
      email: 'davi@gmail.com',
      password:'123'
    })
     expect(user).toMatchObject({
      name:'Davi',
      email: 'davi@gmail.com'
     })
  })
  it('should not be able to create a user already exists', async() => {
    await createUserUserCase.execute({
      name:'Davi',
      email: 'davi@gmail.com',
      password:'123'
    })
    await expect(createUserUserCase.execute({
      name:'Davi',
      email: 'davi@gmail.com',
      password:'123'
    })).rejects.toBeInstanceOf(CreateUserError)
  })
})
