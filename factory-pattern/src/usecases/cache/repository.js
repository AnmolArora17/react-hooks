// Template Method: BaseRepository defines invariant steps for findById

class BaseRepository {
  async findById(id) {
    const start = Date.now();
    try {
      await this.beforeLoad(id);
      const result = await this.loadById(id);
      await this.afterLoad(id, result);
      return result;
    } catch (error) {
      await this.onError(id, error);
      throw error;
    } finally {
      const ms = Date.now() - start;
      this.onFinally?.(id, ms);
    }
  }

  // Hooks - defaults do nothing
  async beforeLoad(id) {}
  async afterLoad(id, result) {}
  async onError(id, error) { console.error('[Repo] error', { id, error: error.message }); }

  // Abstract
  async loadById(id) { throw new Error('loadById must be implemented'); }
}

class UserRepository extends BaseRepository {
  constructor() {
    super();
    this.users = new Map([
      ['u1', { id: 'u1', name: 'Ada Lovelace' }],
      ['u2', { id: 'u2', name: 'Grace Hopper' }],
    ]);
  }

  async beforeLoad(id) { /* could include permission checks */ }

  async loadById(id) {
    // Simulate latency
    await new Promise((r) => setTimeout(r, 40));
    const user = this.users.get(id);
    if (!user) {
      const err = new Error('User not found');
      err.code = 'ENOENT';
      throw err;
    }
    return { ...user };
  }

  onFinally(id, ms) { console.log(`[Repo] findById(${id}) took ${ms}ms`); }
}

module.exports = { BaseRepository, UserRepository };