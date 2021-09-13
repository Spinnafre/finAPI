import supertest from "supertest";

import createConnection from '../../../../database'
import { app } from "../../../../app";
import { Connection } from "typeorm";


let connection: Connection;

describe('Create statement Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()

    await connection.runMigrations()
  })
  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })
  it('Should be able to create a deposit statement with user', async () => {
    await supertest(app)
      .post('/api/v1/users')
      .send({
        name: "Davi",
        email: "davi@gmail.com",
        password: "123"
      })

    const session = await supertest(app)
      .post('/api/v1/sessions')
      .send({
        email: "davi@gmail.com",
        password: "123"
      })

    const statement = await supertest(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount:100.50,
        description:"Money for car"
      })
      .set({
        Authorization:`Bearer ${session.body.token}`
      })


    expect(statement.statusCode).toBe(201)
  })
  it('Should be able to create a withdraw statement with user', async () => {
    const session = await supertest(app)
      .post('/api/v1/sessions')
      .send({
        email: "davi@gmail.com",
        password: "123"
      })

    const statement = await supertest(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount:100.50,
        description:"Withdraw to car"
      })
      .set({
        Authorization:`Bearer ${session.body.token}`
      })


    expect(statement.statusCode).toBe(201)
  })
  it('Should not be able to generate a withdraw statement without balance', async () => {
    const session = await supertest(app)
      .post('/api/v1/sessions')
      .send({
        email: "davi@gmail.com",
        password: "123"
      })

    const statement = await supertest(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount:500.50,
        description:"Withdraw to car"
      })
      .set({
        Authorization:`Bearer ${session.body.token}`
      })
      expect(statement.statusCode).toBe(400)
  })

});
