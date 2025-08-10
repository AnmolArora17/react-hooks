# Node.js Factory Pattern — Advanced Use Cases

This repository showcases several complex, practical applications of the Factory design pattern in Node.js. Each use case intentionally mixes in other patterns (Strategy, Decorator, Adapter, Abstract Factory, Chain of Responsibility, Proxy, Template Method, Command, Singleton, Observer) to demonstrate how factories compose clean architectures.

- Node version: >= 18
- Commands: see "Run the demos" below

## Why Factory?

Factories centralize object construction and wiring, keeping calling code simple and stable while letting you change concrete implementations, configuration, and cross-cutting concerns in one place. Combined with other patterns, factories enable:
- Swapping third-party clients without changing business code (Adapter)
- Adding cross-cutting concerns like retries and logging without modifying core logic (Decorator + Strategy)
- Producing families of related objects together (Abstract Factory)
- Decoupling selection/instantiation of processing components from the data flow (Factory + Chain of Responsibility)
- Transparent behavioral additions, e.g., caching around repositories (Proxy + Template Method)
- Extensible plugin ecosystems (Factory + Command + Singleton + Observer)

## Project Structure

```
src/
  index.js                               # Runs all demos
  usecases/
    payment/                             # Factory + Adapter + Strategy + Decorator
      demo.js
      factory.js
      adapters/stripeAdapter.js
      adapters/paypalAdapter.js
      gateways/stripeSdk.js
      gateways/paypalSdk.js
      strategies/retryPolicy.js
      decorators/loggingDecorator.js
    notification/                        # Abstract Factory + Builder
      demo.js
      abstractFactory.js
    pipeline/                            # Factory + Chain of Responsibility
      demo.js
      factory.js
      chain.js
    cache/                               # Factory + Proxy + Template Method
      demo.js
      cacheFactory.js
      repository.js
      proxy.js
    plugins/                             # Factory + Command + Singleton + Observer
      demo.js
      factory.js
      registry.js
      commands.js
      observer.js
```

## Run the demos

- Run everything:

```bash
npm run demo:all
```

- Run a specific demo:

```bash
npm run demo:payment
npm run demo:notification
npm run demo:pipeline
npm run demo:cache
npm run demo:plugins
```

---

## Use Case 1: Payment Gateway Factory (Factory + Adapter + Strategy + Decorator)

Goal: Provide a single `charge(amount, currency, metadata)` interface backed by different providers (Stripe/PayPal), with retries and logging.

- Factory (`src/usecases/payment/factory.js`): chooses provider, creates SDK client, wraps in Adapter, applies Retry Strategy and Logging Decorator.
- Adapter: `StripePaymentAdapter`, `PayPalPaymentAdapter` unify third-party SDK shapes.
- Strategy: `ExponentialBackoffRetryPolicy` encapsulates retry behavior.
- Decorator: `LoggingAndRetryPaymentGateway` adds logging/timing and uses the retry policy.

Key call site: `src/usecases/payment/demo.js`

```startLine:endLine:src/usecases/payment/factory.js
// Factory Method: Construct a fully-wired PaymentGateway instance
function createPaymentGateway({ provider, credentials = {}, logging = true, retry = {} }) {
  // ... wires SDK -> adapter -> retry policy -> decorator
}
```

What you learn:
- How to isolate third-party differences via Adapters
- How to add cross-cutting concerns via Decorators without touching core logic
- How to make retry behavior configurable via a Strategy

---

## Use Case 2: Notification Abstract Factory (Abstract Factory + Builder)

Goal: Build and send notifications across channels (email, SMS, push) with a consistent flow, supporting dev vs prod sends.

- Abstract Factory (`EmailFactory`, `SmsFactory`, `PushFactory`): each returns a pair of related products: a builder and a sender for its channel.
- Builder pattern: channel-specific message builders.
- Environment toggle: dev uses `ConsoleSender`, prod uses `HttpSender`.

Key call site: `src/usecases/notification/demo.js`

```startLine:endLine:src/usecases/notification/abstractFactory.js
class EmailFactory extends NotificationAbstractFactory {
  createBuilder() { return new EmailMessageBuilder(); }
  createSender() { /* dev -> console, prod -> http */ }
}
```

What you learn:
- How Abstract Factory groups compatible components
- How builders guide safe message construction

---

## Use Case 3: Data Ingestion Pipeline (Factory + Chain of Responsibility)

Goal: Parse inputs of different formats and run a processing pipeline.

- Factory (`createParser`): returns the correct parser by `contentType` (JSON/CSV/XML).
- Chain of Responsibility: `SchemaValidator -> Deduplicator -> Enricher`.

Key call site: `src/usecases/pipeline/demo.js`

```startLine:endLine:src/usecases/pipeline/factory.js
function createParser({ contentType }) {
  switch (contentType) {
    case 'application/json': /* ... */
    case 'text/csv': /* ... */
    case 'application/xml': /* ... */
  }
}
```

What you learn:
- How a factory decouples parser selection from the pipeline
- How to compose a processing chain that is easy to extend

---

## Use Case 4: Repository with Cache (Factory + Proxy + Template Method)

Goal: Add caching to a repository without modifying its interface.

- Factory (`createCacheClient`): choose memory or Redis-like clients.
- Template Method (`BaseRepository`): standardize `findById` flow, enabling instrumentation.
- Proxy (`createCachedRepository`): adds cache reads/writes transparently.

Key call site: `src/usecases/cache/demo.js`

```startLine:endLine:src/usecases/cache/proxy.js
function createCachedRepository(repository, cacheClient, { ttlSeconds = 5 } = {}) {
  return {
    async findById(id) {
      // check cache -> delegate -> cache result
    },
  };
}
```

What you learn:
- How to add caching transparently via the Proxy pattern
- How Template Method consolidates operational concerns

---

## Use Case 5: Plugin Commands (Factory + Command + Singleton + Observer)

Goal: A pluggable command system where plugins register commands; the app creates and executes them by name.

- Singleton (`CommandRegistry`): global registry of command factories.
- Factory (`createCommand`): resolves and constructs commands by name.
- Command objects: `ResizeImageCommand`, `TranscodeVideoCommand` with `execute()`.
- Observer (`EventBus`): broadcasts command-execution events.

Key call site: `src/usecases/plugins/demo.js`

```startLine:endLine:src/usecases/plugins/demo.js
registry.register('resize-image', (options) => new ResizeImageCommand(options));
const resize = createCommand('resize-image', { width: 1280, height: 720 });
const r = await resize.execute({ path: '/tmp/photo.jpg' });
```

What you learn:
- How to design an extensible plugin/command system
- How factories and a registry enable late binding
- How events decouple execution from observability

---

## Tips for extending

- Add a new payment provider: implement an SDK wrapper + adapter, then extend the payment factory switch.
- Add a new notification channel: implement a new factory with a builder and sender.
- Add new pipeline steps: implement a `Handler` and insert it into the chain.
- Swap cache backends: implement a client with `get/set` and return it from `createCacheClient`.
- Add new commands: register a factory in the `CommandRegistry` and call via `createCommand`.

## Running in production-like mode

For the notification demo, set `NODE_ENV=prod` to switch to the HTTP sender.

```bash
NODE_ENV=prod npm run demo:notification
```

## License

MIT
---

## Changelog
- Re-added after reset; added this note to create a non-empty commit.
