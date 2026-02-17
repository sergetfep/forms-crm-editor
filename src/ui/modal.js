function escapeAttr(s) {
  return String(s ?? "").replaceAll('"', "&quot;");
}

function renderModal(rootEl, { open, mode, form, errors, touched }) {
  if (!open) {
    rootEl.innerHTML = "";
    return;
  }

  rootEl.innerHTML = `
    <div class="modal-backdrop" data-role="backdrop"></div>
    <div class="modal" role="dialog" aria-modal="true">
      <h2>${mode === "edit" ? "Редактировать товар" : "Добавить товар"}</h2>
      <form data-role="form">
        <label>
          Название
          <input name="name" value="${escapeAttr(form.name)}" />
          <div class="error" data-role="error-name">${touched.name && errors.name ? errors.name : ""}</div>
        </label>

        <label>
          Стоимость
          <input name="price" value="${escapeAttr(form.price)}" />
          <div class="error" data-role="error-price">${touched.price && errors.price ? errors.price : ""}</div>
        </label>

        <div class="modal-actions">
          <button type="submit" class="btn-primary" data-role="save">Сохранить</button>
          <button type="button" class="btn-secondary" data-role="cancel">Отмена</button>
        </div>
      </form>
    </div>
  `;
}

module.exports = { renderModal };
