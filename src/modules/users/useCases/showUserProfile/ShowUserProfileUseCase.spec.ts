import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from './../../repositories/IUsersRepository';

import { ShowUserProfileError } from "./ShowUserProfileError";
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';

let usersRepositoryInMemory: IUsersRepository
let showUserUserCase:ShowUserProfileUseCase
let createUserUserCase:CreateUserUseCase

describe('Show user profile', () => {
  beforeEach(() => {
    usersRepositoryInMemory=new InMemoryUsersRepository()
    showUserUserCase=new ShowUserProfileUseCase(usersRepositoryInMemory)
    createUserUserCase=new CreateUserUseCase(usersRepositoryInMemory)
  })
  it('should be able to list a user profile', async() => {
    const {id:user_id}=await createUserUserCase.execute({
      name:'Davi',
      email: 'davi@gmail.com',
      password:'123'
    })

    const user=await showUserUserCase.execute(user_id as string)

     expect(user).toMatchObject({
      name:'Davi',
      email: 'davi@gmail.com'
     })
  })
  it('should not be able to list a user profile', async() => {

    await expect(showUserUserCase.execute('12'))
    .rejects
    .toBeInstanceOf(ShowUserProfileError)
  })
})
