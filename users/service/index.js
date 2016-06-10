import micro, { send, sendError, json } from 'micro';
import thinky, { type } from 'thinky';

const db = thinky({
  db: "users",
  host: "database",
  port: process.env.DB_PORT,
});

const User = db.createModel("User", {
  id: type.string(),
  email: type.string().required(),
  password: type.string().required(),
  active: type.boolean().default(true)
});

const save = async (request, response) => {
  return await new User(await json(request)).save();
};

const all = async (request, response) => {
  return await User.run();
};

const update = async (request, response) => {
  var data = await json(request);

  return
    await User
    .get(data.id)
    .update(data)
    .run();
};

const remove = async (request, response) => {
  var data = await json(request);

  return
    await User
   .get(data.id)
   .run()
   .delete();
};

const handler = async (request, response) => {
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

export default async (request, response) => {
  try {
    send(response, 200, await handler(request, response));
  } catch (error) {
    sendError(request, response, error);
  }
}
