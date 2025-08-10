// Singleton: Global command registry where plugins register their factories

class CommandRegistry {
  constructor() {
    if (CommandRegistry._instance) {
      return CommandRegistry._instance;
    }
    this._factories = new Map();
    CommandRegistry._instance = this;
  }

  static getInstance() { return new CommandRegistry(); }

  register(commandName, factoryFn) {
    if (this._factories.has(commandName)) {
      throw new Error(`Command already registered: ${commandName}`);
    }
    this._factories.set(commandName, factoryFn);
  }

  create(commandName, options = {}) {
    const factory = this._factories.get(commandName);
    if (!factory) throw new Error(`Unknown command: ${commandName}`);
    return factory(options);
  }

  list() {
    return Array.from(this._factories.keys());
  }
}

module.exports = { CommandRegistry };