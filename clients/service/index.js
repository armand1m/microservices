import micro, { send, sendError, json } from 'micro';
import thinky from 'thinky';

const type = thinky.type;

const db = thinky({
  host: "database",
  port: process.env.DB_PORT,
  authKey: "",
  db: "clients"
});

const Client = db.createModel("Client", {
  id: type.string(),
  name: type.string().required(),
  email: type.string().email().required(),
  birthday: type.date(),
  active: type.boolean().default(true)
});

const save = async (request, response) => {
  var data = await json(request);

  new Client(data)
  .save()
  .then(client => {
    console.log(client);
    return client;
  });
}

const all = async (request, response) => {
  Client
  .run()
  .then(clients => {
    console.log(clients);
    return clients;
  });
}

const router = async (request, response) => {
  try {
    switch (request.method) {
      case 'POST':
        return save(request, response);

      case 'GET':
        return all(request, response);

      default:
        send(response, 405, 'Invalid method');
        break;
    }
  } catch (error) {
    throw error;
  }
}

export default async function (request, response) {
  try {
    send(response, 200, await router(request, response));
  } catch (error) {
    sendError(request, response, error);
  }
}
