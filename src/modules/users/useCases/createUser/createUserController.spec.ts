import supertest from "supertest";

import createConnection from '../../../../database'
import { app } from "../../../../app";
import { Connection } from "typeorm";


let connection:Connection;

describe('Create User Controller', () => {
    beforeAll(async()=>{
      connection=await createConnection()

      await connection.runMigrations()
    })
    afterAll(async()=>{
      await connection.dropDatabase()
      await connection.close()
    })
    it('should be able to create a user',async()=>{
      const resp=await supertest(app)
      .post('/api/v1/users')
      .send({
        name:"Davi",
        email:"davi@gmail.com",
        password:"123"
      })

      expect(resp.statusCode).toBe(201)
    })
    it('should not be able to create a user already exists',async()=>{
      const resp=await supertest(app)
      .post('/api/v1/users')
      .send({
        name:"Davi",
        email:"davi@gmail.com",
        password:"123"
      })
      expect(resp.statusCode).toBe(400)
    })

});
