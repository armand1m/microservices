import micro, { send, sendError, json } from 'micro';
import thinky, { type } from 'thinky';

const db = thinky({
  db: "clients",
  host: "database",
  port: process.env.DB_PORT,
});

const Client = db.createModel("Client", {
  id: type.string(),
  name: type.string().required(),
  email: type.string().email().required(),
  birthday: type.date(),
  active: type.boolean().default(true)
});

const save = async (request, response) => {
  return await new Client(await json(request)).save();
};

const all = async (request, response) => {
  return await Client.run();
};

const update = async (request, response) => {
  var data = await json(request);

  return
    await Client
    .get(data.id)
    .update(data)
    .run();
};

const remove = async (request, response) => {
  var data = await json(request);

  return
    await Client
   .get(data.id)
   .run()
   .delete();
};

const router = async (request, response) => {
  try {
    switch (request.method) {
      case 'DELETE': return remove(request, response);
      case 'POST': return save(request, response);
      case 'PUT': return update(request, response);
      case 'GET': return all(request, response);

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
