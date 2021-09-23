import { Connection, createConnection, getConnectionOptions } from 'typeorm';

// (async () => await createConnection())();

export default async ():Promise<Connection> =>{
  const connection=await getConnectionOptions()
  return createConnection(connection)
}
