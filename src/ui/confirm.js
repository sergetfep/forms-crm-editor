function renderConfirm(rootEl, { open, title, text }) {
  if (!open) {
    rootEl.innerHTML = '';
    return;
  }

  rootEl.innerHTML = `
    <div class="confirm-backdrop" data-role="confirm-backdrop"></div>
    <div class="confirm" role="dialog" aria-modal="true">
      <h2>${title}</h2>
      <p>${text}</p>
      <div class="confirm-actions">
        <button type="button" class="btn-secondary" data-role="confirm-cancel">Отмена</button>
        <button type="button" class="btn-danger" data-role="confirm-ok">Удалить</button>
      </div>
    </div>
  `;
}

module.exports = { renderConfirm };
