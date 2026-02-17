const ItemStore = require("../store/ItemStore");
const { renderTable } = require("../ui/render");
const { renderModal } = require("../ui/modal");
const { renderConfirm } = require("../ui/confirm");
const { validateName, parseAndValidatePrice } = require("../ui/validators");

class App {
  constructor(root) {
    this.root = root;
    this.store = new ItemStore();
    this.tableHost = root.querySelector('[data-role="table"]');
    this.modalHost = root.querySelector('[data-role="modal"]');
    this.confirmHost = root.querySelector('[data-role="confirm"]');
    this.addBtn = root.querySelector('[data-role="add"]');
    this.state = this.initialModalState();
    this.confirmState = { open: false, id: null };
  }

  initialModalState() {
    return {
      open: false,
      mode: "add",
      editingId: null,
      form: { name: "", price: "" },
      errors: {},
      touched: { name: false, price: false },
    };
  }

  start() {
    this.renderAll();

    this.addBtn.addEventListener("click", () => {
      this.state = this.initialModalState();
      this.state.open = true;
      this.renderModal();
    });

    this.tableHost.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const tr = btn.closest("tr[data-id]");
      const id = tr?.dataset.id;
      if (!id) return;

      if (btn.dataset.action === "edit") this.openEdit(id);
      if (btn.dataset.action === "delete") this.openConfirm(id);
    });

    this.modalHost.addEventListener("click", (e) => {
      if (e.target?.dataset.role === "backdrop") this.closeModal();
      if (e.target?.dataset.role === "cancel") this.closeModal();
    });

    this.modalHost.addEventListener("input", (e) => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement)) return;
      if (!["name", "price"].includes(input.name)) return;

      this.state.form[input.name] = input.value;
      this.state.touched[input.name] = true;

      this.validateForm();
      this.updateModalErrors();
    });

    this.modalHost.addEventListener("submit", (e) => {
      const formEl = e.target;
      if (!(formEl instanceof HTMLFormElement)) return;
      if (formEl.dataset.role !== "form") return;

      e.preventDefault();
      this.state.touched = { name: true, price: true };
      const ok = this.validateForm();
      this.renderModal();
      if (!ok) return;

      const name = this.state.form.name.trim();
      const { price } = parseAndValidatePrice(this.state.form.price);

      if (this.state.mode === "add") {
        this.store.add({ name, price });
      } else {
        this.store.update(this.state.editingId, { name, price });
      }

      this.closeModal();
      this.renderTable();
    });

    this.confirmHost.addEventListener("click", (e) => {
      if (e.target?.dataset.role === "confirm-backdrop") this.closeConfirm();
      if (e.target?.dataset.role === "confirm-cancel") this.closeConfirm();
      if (e.target?.dataset.role === "confirm-ok") {
        if (this.confirmState.id) {
          this.store.remove(this.confirmState.id);
          this.renderTable();
        }
        this.closeConfirm();
      }
    });
  }

  validateForm() {
    const errors = {};
    const nameErr = validateName(this.state.form.name);
    if (nameErr) errors.name = nameErr;

    const { error: priceErr } = parseAndValidatePrice(this.state.form.price);
    if (priceErr) errors.price = priceErr;

    this.state.errors = errors;
    return Object.keys(errors).length === 0;
  }

  updateModalErrors() {
    const nameErrEl = this.modalHost.querySelector('[data-role="error-name"]');
    const priceErrEl = this.modalHost.querySelector(
      '[data-role="error-price"]',
    );

    if (nameErrEl) {
      nameErrEl.textContent =
        this.state.touched.name && this.state.errors.name
          ? this.state.errors.name
          : "";
    }
    if (priceErrEl) {
      priceErrEl.textContent =
        this.state.touched.price && this.state.errors.price
          ? this.state.errors.price
          : "";
    }
  }

  openEdit(id) {
    const item = this.store.getById(id);
    if (!item) return;
    this.state = this.initialModalState();
    this.state.open = true;
    this.state.mode = "edit";
    this.state.editingId = id;
    this.state.form = { name: item.name, price: String(item.price) };
    this.renderModal();
  }

  closeModal() {
    this.state.open = false;
    this.renderModal();
  }

  openConfirm(id) {
    const item = this.store.getById(id);
    if (!item) return;
    this.confirmState = { open: true, id };
    this.renderConfirm(item);
  }

  closeConfirm() {
    this.confirmState = { open: false, id: null };
    this.renderConfirm(null);
  }

  renderTable() {
    renderTable(this.tableHost, this.store.list());
  }

  renderModal() {
    renderModal(this.modalHost, {
      open: this.state.open,
      mode: this.state.mode,
      form: this.state.form,
      errors: this.state.errors,
      touched: this.state.touched,
    });
  }

  renderConfirm(item) {
    renderConfirm(this.confirmHost, {
      open: this.confirmState.open,
      title: "Удалить товар",
      text: item ? `Удалить "${item.name}"?` : "",
    });
  }

  renderAll() {
    this.renderTable();
    this.renderModal();
    this.renderConfirm(null);
  }
}

module.exports = App;
