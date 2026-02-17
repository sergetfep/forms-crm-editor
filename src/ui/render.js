function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderTable(containerEl, items) {
  containerEl.innerHTML = `
    <table class="crm-table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Стоимость</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((i) => `
          <tr data-id="${i.id}">
            <td class="cell-name">${escapeHtml(i.name)}</td>
            <td class="cell-price">${i.price}</td>
            <td class="cell-actions">
              <button class="btn-edit" data-action="edit" aria-label="edit">✎</button>
              <button class="btn-del" data-action="delete" aria-label="delete">✕</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

module.exports = { renderTable };
