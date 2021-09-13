import supertest from "supertest";

import createConnection from '../../../../database'
import { app } from "../../../../app";
import { Connection } from "typeorm";
import { hash } from 'bcryptjs';
import {v4 as uuid4} from 'uuid'

let connection:Connection;
describe('Authenticate User Controller', () => {
  beforeAll(async()=>{
    connection = await createConnection();

    await connection.runMigrations()
  })
  afterAll(async()=>{
    await connection.dropDatabase()
    await connection.close()
  })
  it('should be able to authenticate a user',async()=>{
    await supertest(app)
      .post('/api/v1/users')
      .send({
        name:"Davi",
        email:"davi@gmail.com",
        password:"123"
    })

    const resp=await supertest(app)
    .post('/api/v1/sessions')
    .send({
      email:"davi@gmail.com",
      password:"123"
    })
    expect(resp.body).toHaveProperty('token')


  })
  it('should not be able to authenticate a user with password invalid',async()=>{

    const resp=await supertest(app)
    .post('/api/v1/sessions')
    .send({
      name:'davi@gmail.com',
      password:'12'
    })
    expect(resp.statusCode).toBe(401)


  })
  it('should not be able to authenticate a user with email invalid',async()=>{
    const resp=await supertest(app)
    .post('/api/v1/sessions')
    .send({
      name:'hahaha@gmail.com',
      password:'123'
    })
    expect(resp.statusCode).toBe(401)


  })
});
