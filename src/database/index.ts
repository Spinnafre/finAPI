import { Connection, createConnection, getConnectionOptions } from 'typeorm';

// (async () => await createConnection())();

export default async ():Promise<Connection> =>{
  return createConnection()
}
