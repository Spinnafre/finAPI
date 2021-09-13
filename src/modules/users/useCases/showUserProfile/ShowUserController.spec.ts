import supertest from "supertest";

import createConnection from '../../../../database'
import { app } from "../../../../app";
import { Connection } from "typeorm";


let connection:Connection;
describe('Show User Controller', () => {
  beforeAll(async()=>{
    connection = await createConnection();

    await connection.runMigrations()
  })
  afterAll(async()=>{
    await connection.dropDatabase()
    await connection.close()
  })
  it('should show a user',async()=>{
    await supertest(app)
      .post('/api/v1/users')
      .send({
        name:"Davi",
        email:"davi@gmail.com",
        password:"123"
    })

    const session=await supertest(app)
    .post('/api/v1/sessions')
    .send({
      email:"davi@gmail.com",
      password:"123"
    })

    const user=await supertest(app)
    .get('/api/v1/profile')
    .set({
      Authorization:`Bearer ${session.body.token}`
    })

    expect(user.body).toHaveProperty('id')
  })
});
