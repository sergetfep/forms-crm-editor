function validateName(value) {
  const v = String(value ?? '').trim();
  if (!v) return 'Введите название';
  return null;
}

function parseAndValidatePrice(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return { error: 'Введите стоимость', price: null };
  const normalized = raw.replace(',', '.');
  const num = Number(normalized);
  if (!Number.isFinite(num)) return { error: 'Стоимость должна быть числом', price: null };
  if (num <= 0) return { error: 'Стоимость должна быть больше 0', price: null };
  return { error: null, price: num };
}

module.exports = { validateName, parseAndValidatePrice };
