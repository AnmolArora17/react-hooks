// Factory: Uses the singleton registry to instantiate commands by name
const { CommandRegistry } = require('./registry');

function createCommand(commandName, options) {
  const registry = CommandRegistry.getInstance();
  return registry.create(commandName, options);
}

module.exports = { createCommand };