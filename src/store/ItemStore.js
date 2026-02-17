const { nanoid } = require('nanoid');

class ItemStore {
  constructor(initial = []) {
    this.items = [...initial];
  }

  list() {
    return [...this.items];
  }

  add({ name, price }) {
    const item = { id: nanoid(), name, price };
    this.items.push(item);
    return item;
  }

  update(id, patch) {
    const idx = this.items.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error('NOT_FOUND');
    this.items[idx] = { ...this.items[idx], ...patch };
    return this.items[idx];
  }

  remove(id) {
    const idx = this.items.findIndex((x) => x.id === id);
    if (idx === -1) return false;
    this.items.splice(idx, 1);
    return true;
  }

  getById(id) {
    return this.items.find((x) => x.id === id) || null;
  }
}

module.exports = ItemStore;
