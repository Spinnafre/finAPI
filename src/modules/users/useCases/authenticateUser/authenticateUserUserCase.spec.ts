import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { IUsersRepository } from './../../repositories/IUsersRepository';

import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: IUsersRepository
let authUserUserCase:AuthenticateUserUseCase
let createUserUserCase:CreateUserUseCase

describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepositoryInMemory=new InMemoryUsersRepository()
    authUserUserCase=new AuthenticateUserUseCase(usersRepositoryInMemory)
    createUserUserCase=new CreateUserUseCase(usersRepositoryInMemory)
  })
  it('should be able to authenticate a user', async() => {
    await createUserUserCase.execute({
      name:'Davi',
      email: 'davi@gmail.com',
      password:'123'
    })

    const user=await authUserUserCase.execute({
      email: 'davi@gmail.com',
      password:'123'
    })

     expect(user).toHaveProperty('token')
  })
  it('should not be able to authenticate a user with invalid email', async() => {
    await createUserUserCase.execute({
      name:'Davi',
      email: 'davi@gmail.com',
      password:'123'
    })

    await expect(authUserUserCase.execute({
      email: 'davi2222@gmail.com',
      password:'123'
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
  it('should not be able to authenticate a user with invalid password', async() => {
    await createUserUserCase.execute({
      name:'Davi',
      email: 'davi@gmail.com',
      password:'123'
    })

    await expect(authUserUserCase.execute({
      email: 'davi@gmail.com',
      password:'666666'
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
