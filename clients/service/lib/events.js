const onServiceRegistered = () => console.log("Server registered for Service Discovery.");
const onServiceUnregistered = () => console.log("Server unregistered from Service Discovery.");
const onServerRunning = server => console.log(`Server running at: ${server.server.info.uri}`);

const doSafeExit = () => {
  console.log("Service was gracefully terminated.");
  process.exit(0);
};

const doErrorExit = err => {
  console.error(err);
  process.exit(1);
};

const onServiceRegisterError = err => {
  console.error("Can't register for Service Discovery.");
  doErrorExit(err);
};

const onServiceUnregisterError = err => {
  console.error("Can't unregister from Service Discovery.");
  doErrorExit(err);
};

module.exports = {
  doErrorExit,
  doSafeExit,
  onServerRunning,
  onServiceRegistered,
  onServiceUnregistered,
  onServiceRegisterError,
  onServiceUnregisterError
};
