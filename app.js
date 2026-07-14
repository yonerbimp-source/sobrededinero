const STORAGE_KEY = 'sobres_app_data_v1';
const LANG_KEY = 'sobres_app_lang_v1';
let data = { envelopes: [], deletedHistories: [] };
let selectedDeleteId = null;
let selectedEditEnvelopeId = null;
let selectedEditTransactionId = null;
let currentLang = localStorage.getItem(LANG_KEY) || 'es';

const t = {
  es: {
    subtitle: 'Administra tu dinero por sobres', save: 'Guardar', totalAvailable: 'Total disponible',
    addEnvelopeBtn: '+ Agregar sobre', addMoneyBtn: '+ Agregar dinero', removeMoneyBtn: '- Sacar dinero', deleteEnvelopeBtn: 'Eliminar sobre',
    exportBackup: 'Exportar respaldo', restoreBackup: 'Restaurar respaldo', addEnvelopeTitle: 'Agregar sobre', envelopeName: 'Nombre del sobre',
    envelopeNamePlaceholder: 'Ej: Comida, Gasolina, Ahorros', color: 'Color', createEnvelope: 'Crear sobre', addMoneyTitle: 'Agregar dinero',
    envelope: 'Sobre', amountRD: 'Cantidad RD$', description: 'Descripción', addDescPlaceholder: 'Ej: Sobró dinero, cobré un trabajo...',
    saveIncome: 'Guardar entrada', removeMoneyTitle: 'Sacar dinero', removeDescPlaceholder: 'Ej: Compré gasolina, pagué la luz...',
    saveExpense: 'Guardar salida', deleteEnvelopeTitle: 'Eliminar sobre', continue: 'Continuar', myEnvelopes: 'Mis sobres',
    dragHelp: 'Mantén presionado y arrastra para ordenar', deletedHistoryBtn: 'Historial de Sobres Eliminados', whatDo: '¿Qué deseas hacer?',
    deleteAll: 'Borrar sobre y todo su historial', deleteKeepHistory: 'Borrar sobre pero conservar historial', cancel: 'Cancelar',
    savedOk: 'Datos guardados correctamente.', backupOk: 'Respaldo exportado correctamente.', invalidBackup: 'Ese archivo no parece ser un respaldo válido de SOBRES.',
    restoreConfirm: 'Esto reemplazará los datos actuales de SOBRES por el respaldo seleccionado. ¿Quieres continuar?', restoreOk: 'Respaldo restaurado correctamente.',
    backupError: 'No se pudo leer el archivo de respaldo.', writeEnvelope: 'Escribe el nombre del sobre.', envelopeCreated: 'Sobre creado correctamente.',
    selectEnvelope: 'Selecciona un sobre.', validAmount: 'Escribe una cantidad válida.', descriptionRequired: 'La descripción es obligatoria.',
    moneyAdded: 'Dinero agregado correctamente.', insufficient: 'Fondos insuficientes. Ese sobre solo tiene {amount}.', expenseSaved: 'Salida guardada correctamente.',
    envelopeDeleted: 'Sobre eliminado correctamente.', currentBalance: 'Balance actual: {amount}', noMoves: 'Este sobre todavía no tiene movimientos.',
    noDeleted: 'No hay historial de sobres eliminados.', deletedAt: 'Eliminado: {date}', lastBalance: 'Último balance: {amount}', noHadMoves: 'No tenía movimientos.',
    noEnvelopes: 'Todavía no tienes sobres. Crea el primero.', clickHistory: 'Click para ver historial', noEnvelopesOption: 'No hay sobres',
    langButton: 'English', income: 'entrada', expense: 'salida', includedInTotal: 'Cuenta en el total', excludedFromTotal: 'No cuenta en el total', totalNote: 'Solo suma los sobres marcados para el total', toggleTotalOk: 'Preferencia del total actualizada.', editTransaction: 'Editar', editTransactionTitle: 'Editar transacción', updateTransaction: 'Guardar cambios', transactionUpdated: 'Transacción actualizada correctamente.'
  },
  en: {
    subtitle: 'Manage your money by envelopes', save: 'Save', totalAvailable: 'Total available',
    addEnvelopeBtn: '+ Add envelope', addMoneyBtn: '+ Add money', removeMoneyBtn: '- Take money out', deleteEnvelopeBtn: 'Delete envelope',
    exportBackup: 'Export backup', restoreBackup: 'Restore backup', addEnvelopeTitle: 'Add envelope', envelopeName: 'Envelope name',
    envelopeNamePlaceholder: 'Ex: Food, Gas, Savings', color: 'Color', createEnvelope: 'Create envelope', addMoneyTitle: 'Add money',
    envelope: 'Envelope', amountRD: 'Amount RD$', description: 'Description', addDescPlaceholder: 'Ex: Leftover money, got paid for a job...',
    saveIncome: 'Save income', removeMoneyTitle: 'Take money out', removeDescPlaceholder: 'Ex: Bought gas, paid the electric bill...',
    saveExpense: 'Save expense', deleteEnvelopeTitle: 'Delete envelope', continue: 'Continue', myEnvelopes: 'My envelopes',
    dragHelp: 'Press and drag to reorder', deletedHistoryBtn: 'Deleted Envelopes History', whatDo: 'What do you want to do?',
    deleteAll: 'Delete envelope and all history', deleteKeepHistory: 'Delete envelope but keep history', cancel: 'Cancel',
    savedOk: 'Data saved successfully.', backupOk: 'Backup exported successfully.', invalidBackup: 'That file does not look like a valid SOBRES backup.',
    restoreConfirm: 'This will replace your current SOBRES data with the selected backup. Do you want to continue?', restoreOk: 'Backup restored successfully.',
    backupError: 'The backup file could not be read.', writeEnvelope: 'Write the envelope name.', envelopeCreated: 'Envelope created successfully.',
    selectEnvelope: 'Select an envelope.', validAmount: 'Enter a valid amount.', descriptionRequired: 'The description is required.',
    moneyAdded: 'Money added successfully.', insufficient: 'Insufficient funds. This envelope only has {amount}.', expenseSaved: 'Expense saved successfully.',
    envelopeDeleted: 'Envelope deleted successfully.', currentBalance: 'Current balance: {amount}', noMoves: 'This envelope does not have any movements yet.',
    noDeleted: 'There is no deleted envelope history.', deletedAt: 'Deleted: {date}', lastBalance: 'Last balance: {amount}', noHadMoves: 'It had no movements.',
    noEnvelopes: 'You do not have envelopes yet. Create the first one.', clickHistory: 'Click to see history', noEnvelopesOption: 'No envelopes',
    langButton: 'Español', income: 'income', expense: 'expense', includedInTotal: 'Counts in total', excludedFromTotal: 'Does not count in total', totalNote: 'Only envelopes marked for the total are added', toggleTotalOk: 'Total preference updated.', editTransaction: 'Edit', editTransactionTitle: 'Edit transaction', updateTransaction: 'Save changes', transactionUpdated: 'Transaction updated successfully.'
  }
};

function tr(key, vars = {}) {
  let text = (t[currentLang] && t[currentLang][key]) || t.es[key] || key;
  Object.entries(vars).forEach(([k, v]) => text = text.replace(`{${k}}`, v));
  return text;
}

function applyLanguage() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = tr(el.dataset.i18n));
  document.querySelectorAll('[data-placeholder]').forEach(el => el.placeholder = tr(el.dataset.placeholder));
  document.getElementById('langBtn').textContent = tr('langButton');
  render();
}

function toggleLanguage() {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  localStorage.setItem(LANG_KEY, currentLang);
  applyLanguage();
  showMessage(currentLang === 'es' ? 'Idioma cambiado a Español.' : 'Language changed to English.', 'ok');
}

function money(value) {
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(value).replace('DOP', 'RD$');
}

function nowText() {
  return new Date().toLocaleString(currentLang === 'es' ? 'es-DO' : 'en-US', { dateStyle: 'short', timeStyle: 'short' });
}

function saveData(show = false) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (show) showMessage(tr('savedOk'), 'ok');
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) data = JSON.parse(saved);
  data.envelopes = (data.envelopes || []).map(e => ({ includeInTotal: true, ...e, includeInTotal: e.includeInTotal !== false }));
  data.deletedHistories = data.deletedHistories || [];
  applyLanguage();
}

function backupFileName() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `sobres_respaldo_${y}-${m}-${day}_${h}-${min}.json`;
}

function exportBackup() {
  saveData();
  const backup = { app: 'SOBRES', version: 1, exportedAt: new Date().toISOString(), data };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = backupFileName();
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showMessage(tr('backupOk'), 'ok');
}

function importBackupFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const importedData = parsed.data || parsed;
      if (!importedData || !Array.isArray(importedData.envelopes) || !Array.isArray(importedData.deletedHistories)) return showMessage(tr('invalidBackup'), 'error');
      if (!confirm(tr('restoreConfirm'))) return;
      data = importedData;
      saveData();
      render();
      showMessage(tr('restoreOk'), 'ok');
    } catch (error) { showMessage(tr('backupError'), 'error'); }
  };
  reader.readAsText(file);
}

function showMessage(text, type = 'ok') {
  const box = document.getElementById('message');
  box.textContent = text;
  box.className = `message ${type}`;
  setTimeout(() => box.classList.add('hidden'), 3500);
}

function showPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function getEnvelope(id) { return data.envelopes.find(e => e.id === id); }

function addEnvelope() {
  const name = document.getElementById('envelopeName').value.trim();
  const color = document.getElementById('envelopeColor').value;
  if (!name) return showMessage(tr('writeEnvelope'), 'error');
  data.envelopes.push({ id: crypto.randomUUID(), name, color, balance: 0, includeInTotal: true, history: [] });
  document.getElementById('envelopeName').value = '';
  saveData();
  render();
  showMessage(tr('envelopeCreated'), 'ok');
}

function addMoney() {
  const id = document.getElementById('addEnvelopeSelect').value;
  const amount = Number(document.getElementById('addAmount').value);
  const description = document.getElementById('addDescription').value.trim();
  const envelope = getEnvelope(id);
  if (!envelope) return showMessage(tr('selectEnvelope'), 'error');
  if (!amount || amount <= 0) return showMessage(tr('validAmount'), 'error');
  if (!description) return showMessage(tr('descriptionRequired'), 'error');
  envelope.balance += amount;
  envelope.history.unshift({ id: crypto.randomUUID(), type: 'entrada', amount, description, date: nowText() });
  document.getElementById('addAmount').value = '';
  document.getElementById('addDescription').value = '';
  saveData();
  render();
  showMessage(tr('moneyAdded'), 'ok');
}

function removeMoney() {
  const id = document.getElementById('removeEnvelopeSelect').value;
  const amount = Number(document.getElementById('removeAmount').value);
  const description = document.getElementById('removeDescription').value.trim();
  const envelope = getEnvelope(id);
  if (!envelope) return showMessage(tr('selectEnvelope'), 'error');
  if (!amount || amount <= 0) return showMessage(tr('validAmount'), 'error');
  if (!description) return showMessage(tr('descriptionRequired'), 'error');
  envelope.balance -= amount;
  envelope.history.unshift({ id: crypto.randomUUID(), type: 'salida', amount, description, date: nowText() });
  document.getElementById('removeAmount').value = '';
  document.getElementById('removeDescription').value = '';
  saveData();
  render();
  showMessage(tr('expenseSaved'), 'ok');
}

function askDeleteEnvelope() {
  selectedDeleteId = document.getElementById('deleteEnvelopeSelect').value;
  if (!selectedDeleteId) return showMessage(tr('selectEnvelope'), 'error');
  document.getElementById('deleteModal').classList.remove('hidden');
}
function closeDeleteModal() { document.getElementById('deleteModal').classList.add('hidden'); selectedDeleteId = null; }
function deleteEnvelope(deleteHistory) {
  const envelope = getEnvelope(selectedDeleteId);
  if (!envelope) return closeDeleteModal();
  if (!deleteHistory) data.deletedHistories.unshift({ ...envelope, deletedAt: nowText() });
  data.envelopes = data.envelopes.filter(e => e.id !== selectedDeleteId);
  closeDeleteModal(); saveData(); render(); showMessage(tr('envelopeDeleted'), 'ok');
}

function openHistory(id) {
  const envelope = getEnvelope(id);
  if (!envelope) return;
  selectedEditEnvelopeId = envelope.id;
  document.getElementById('historyTitle').textContent = envelope.name;
  document.getElementById('historyBalance').textContent = tr('currentBalance', { amount: money(envelope.balance) });
  renderHistoryList(envelope.history);
  document.getElementById('historyModal').classList.remove('hidden');
}
function closeHistory() { document.getElementById('historyModal').classList.add('hidden'); }

function renderHistoryList(history) {
  const list = document.getElementById('historyList');
  if (!history.length) { list.innerHTML = `<p class="empty">${tr('noMoves')}</p>`; return; }
  list.innerHTML = history.map(m => `
    <div class="move">
      <div class="${m.type === 'entrada' ? 'plus' : 'minus'}">${m.type === 'entrada' ? '+' : '-'} ${money(m.amount)}</div>
      <div>${m.date}</div>
      <p>${escapeHtml(m.description)}</p>
      <button class="edit-move-btn" onclick="editTransaction('${m.id}')">${tr('editTransaction')}</button>
    </div>`).join('');
}



function editTransaction(transactionId) {
  const envelope = getEnvelope(selectedEditEnvelopeId || data.envelopes.find(e => e.history.some(m => m.id === transactionId))?.id);
  if (!envelope) return;
  const transaction = envelope.history.find(m => m.id === transactionId);
  if (!transaction) return;
  selectedEditEnvelopeId = envelope.id;
  selectedEditTransactionId = transaction.id;
  document.getElementById('editAmount').value = transaction.amount;
  document.getElementById('editDescription').value = transaction.description;
  document.getElementById('editTransactionModal').classList.remove('hidden');
}

function closeEditTransaction() {
  document.getElementById('editTransactionModal').classList.add('hidden');
  selectedEditEnvelopeId = null;
  selectedEditTransactionId = null;
}

function updateTransaction() {
  const envelope = getEnvelope(selectedEditEnvelopeId);
  if (!envelope) return closeEditTransaction();
  const transaction = envelope.history.find(m => m.id === selectedEditTransactionId);
  if (!transaction) return closeEditTransaction();

  const amount = Number(document.getElementById('editAmount').value);
  const description = document.getElementById('editDescription').value.trim();
  if (!amount || amount <= 0) return showMessage(tr('validAmount'), 'error');
  if (!description) return showMessage(tr('descriptionRequired'), 'error');

  const difference = amount - transaction.amount;
  envelope.balance += transaction.type === 'entrada' ? difference : -difference;
  transaction.amount = amount;
  transaction.description = description;

  saveData();
  closeEditTransaction();
  render();
  openHistory(envelope.id);
  showMessage(tr('transactionUpdated'), 'ok');
}

function toggleDeletedHistory() {
  const box = document.getElementById('deletedHistory');
  box.classList.toggle('hidden');
  renderDeletedHistory();
}

function renderDeletedHistory() {
  const box = document.getElementById('deletedHistory');
  if (!data.deletedHistories.length) { box.innerHTML = `<p class="empty">${tr('noDeleted')}</p>`; return; }
  box.innerHTML = data.deletedHistories.map(e => `
    <div class="deleted-item">
      <h3>${escapeHtml(e.name)}</h3>
      <p>${tr('deletedAt', { date: e.deletedAt })}</p>
      <p>${tr('lastBalance', { amount: money(e.balance) })}</p>
      ${e.history.length ? e.history.map(m => `
        <div class="move">
          <div class="${m.type === 'entrada' ? 'plus' : 'minus'}">${m.type === 'entrada' ? '+' : '-'} ${money(m.amount)}</div>
          <div>${m.date}</div>
          <p>${escapeHtml(m.description)}</p>
        </div>`).join('') : `<p class="empty">${tr('noHadMoves')}</p>`}
    </div>`).join('');
}


function toggleIncludeInTotal(id, event) {
  if (event) event.stopPropagation();
  const envelope = getEnvelope(id);
  if (!envelope) return;
  envelope.includeInTotal = envelope.includeInTotal === false ? true : false;
  saveData();
  render();
  showMessage(tr('toggleTotalOk'), 'ok');
}

function render() {
  const total = data.envelopes.filter(e => e.includeInTotal !== false).reduce((sum, e) => sum + e.balance, 0);
  document.getElementById('totalAmount').textContent = money(total);
  const list = document.getElementById('envelopesList');
  if (!data.envelopes.length) {
    list.innerHTML = `<p class="empty">${tr('noEnvelopes')}</p>`;
  } else {
    list.innerHTML = data.envelopes.map(e => `
      <div class="envelope ${e.includeInTotal === false ? 'excluded-total' : ''}" draggable="true" data-id="${e.id}" style="--env-color:${e.color}" onclick="openHistory('${e.id}')">
        <div class="left"><span class="dot" style="background:${e.color}"></span><div><strong>${escapeHtml(e.name)}</strong><span>${tr('clickHistory')}</span></div></div>
        <div class="right"><div class="amount">${money(e.balance)}</div><button class="total-toggle ${e.includeInTotal === false ? 'off' : 'on'}" onclick="toggleIncludeInTotal('${e.id}', event)">${e.includeInTotal === false ? tr('excludedFromTotal') : tr('includedInTotal')}</button></div>
      </div>`).join('');
  }
  fillSelect('addEnvelopeSelect'); fillSelect('removeEnvelopeSelect'); fillSelect('deleteEnvelopeSelect'); setupDrag();
}

function fillSelect(id) {
  const select = document.getElementById(id);
  select.innerHTML = data.envelopes.length
    ? data.envelopes.map(e => `<option value="${e.id}">${escapeHtml(e.name)} - ${money(e.balance)}</option>`).join('')
    : `<option value="">${tr('noEnvelopesOption')}</option>`;
}

function setupDrag() {
  const items = document.querySelectorAll('.envelope');
  let draggedId = null;
  items.forEach(item => {
    item.addEventListener('dragstart', () => { draggedId = item.dataset.id; item.classList.add('dragging'); });
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
    item.addEventListener('dragover', e => e.preventDefault());
    item.addEventListener('drop', e => {
      e.preventDefault();
      const targetId = item.dataset.id;
      if (!draggedId || draggedId === targetId) return;
      const from = data.envelopes.findIndex(x => x.id === draggedId);
      const to = data.envelopes.findIndex(x => x.id === targetId);
      const [moved] = data.envelopes.splice(from, 1);
      data.envelopes.splice(to, 0, moved);
      saveData(); render();
    });
  });
}

function escapeHtml(text) {
  return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

document.getElementById('saveBtn').addEventListener('click', () => saveData(true));
document.getElementById('langBtn').addEventListener('click', toggleLanguage);
document.getElementById('importFile').addEventListener('change', e => { importBackupFile(e.target.files[0]); e.target.value = ''; });
loadData();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
