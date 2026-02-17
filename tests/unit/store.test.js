const ItemStore = require('../../src/store/ItemStore');

test('store CRUD', () => {
  const s = new ItemStore();
  const a = s.add({ name: 'A', price: 10 });
  expect(s.list()).toHaveLength(1);
  expect(s.getById(a.id).name).toBe('A');

  const u = s.update(a.id, { name: 'B', price: 20 });
  expect(u.name).toBe('B');
  expect(u.price).toBe(20);

  expect(s.remove(a.id)).toBe(true);
  expect(s.list()).toHaveLength(0);
});
