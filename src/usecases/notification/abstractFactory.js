// Abstract Factory: Create families of related objects (builder + sender) without specifying concrete classes.

// Builders
class EmailMessageBuilder {
  constructor() {
    this.subject = '';
    this.body = '';
    this.attachments = [];
  }
  withSubject(subject) { this.subject = subject; return this; }
  withBody(body) { this.body = body; return this; }
  addAttachment(name, bytes) { this.attachments.push({ name, bytes }); return this; }
  build() { return { type: 'email', subject: this.subject, body: this.body, attachments: this.attachments }; }
}

class SmsMessageBuilder {
  constructor() { this.text = ''; }
  withText(text) { this.text = text; return this; }
  build() {
    if (this.text.length > 160) {
      throw new Error('SMS text exceeds 160 characters');
    }
    return { type: 'sms', text: this.text };
  }
}

class PushMessageBuilder {
  constructor() { this.title = ''; this.body = ''; this.data = {}; }
  withTitle(title) { this.title = title; return this; }
  withBody(body) { this.body = body; return this; }
  withData(data) { this.data = { ...this.data, ...data }; return this; }
  build() { return { type: 'push', title: this.title, body: this.body, data: this.data }; }
}

// Senders (dev vs prod)
class ConsoleSender { async send(message, recipient) { console.log('[DEV SEND]', { recipient, message }); return { status: 'ok', dev: true }; } }
class HttpSender {
  constructor({ endpoint }) { this.endpoint = endpoint; }
  async send(message, recipient) {
    // Simulated network call
    await new Promise((r) => setTimeout(r, 30));
    return { status: 'ok', endpoint: this.endpoint, recipient, type: message.type };
  }
}

// Abstract Factory and concrete factories per channel
class NotificationAbstractFactory {
  createBuilder() { throw new Error('createBuilder() must be implemented'); }
  createSender() { throw new Error('createSender() must be implemented'); }
}

class EmailFactory extends NotificationAbstractFactory {
  constructor({ environment = 'dev' } = {}) { super(); this.environment = environment; }
  createBuilder() { return new EmailMessageBuilder(); }
  createSender() { return this.environment === 'prod' ? new HttpSender({ endpoint: 'https://api.example.com/email' }) : new ConsoleSender(); }
}

class SmsFactory extends NotificationAbstractFactory {
  constructor({ environment = 'dev' } = {}) { super(); this.environment = environment; }
  createBuilder() { return new SmsMessageBuilder(); }
  createSender() { return this.environment === 'prod' ? new HttpSender({ endpoint: 'https://api.example.com/sms' }) : new ConsoleSender(); }
}

class PushFactory extends NotificationAbstractFactory {
  constructor({ environment = 'dev' } = {}) { super(); this.environment = environment; }
  createBuilder() { return new PushMessageBuilder(); }
  createSender() { return this.environment === 'prod' ? new HttpSender({ endpoint: 'https://api.example.com/push' }) : new ConsoleSender(); }
}

module.exports = { NotificationAbstractFactory, EmailFactory, SmsFactory, PushFactory };