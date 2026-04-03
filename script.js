const state = {
  expenses: [],
  totalExpenses: 0
};

const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseButton = document.getElementById('add-btn');
const expenseList = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');
const exportPdfBtn = document.getElementById('export-pdf-btn');

function saveToStorage() {
  localStorage.setItem('expenses', JSON.stringify(state.expenses));
  localStorage.setItem('totalExpenses', state.totalExpenses);
}

function loadFromStorage() {
  const saved = localStorage.getItem('expenses');
  if (saved) {
    state.expenses = JSON.parse(saved);
    state.totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;
  }
}

function addExpense(name, amount) {
  const newExpense = {
    id: Date.now(),
    name: name,
    amount: amount,
    paid: false
  };

  state.expenses.push(newExpense);
  state.totalExpenses += amount;

  saveToStorage();
  updateDisplay();
}

function markAsPaid(expenseId) {
  const expense = state.expenses.find(e => e.id === expenseId);

  if (expense) {
    if (expense.paid) {
      expense.paid = false;
      state.totalExpenses += expense.amount;
    } else {
      expense.paid = true;
      state.totalExpenses -= expense.amount;
    }

    saveToStorage();
    updateDisplay();
  }
}

function deleteExpense(expenseId) {
  const expense = state.expenses.find(e => e.id === expenseId);

  if (expense) {
    if (!expense.paid) {
      state.totalExpenses -= expense.amount;
    }

    state.expenses = state.expenses.filter(e => e.id !== expenseId);

    saveToStorage();
    updateDisplay();
  }
}

function updateDisplay() {
  expenseList.innerHTML = '';

  state.expenses.forEach(expense => {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = expense.paid;
    checkbox.addEventListener('change', () => markAsPaid(expense.id));

    const nameSpan = document.createElement('span');
    nameSpan.textContent = expense.name;
    if (expense.paid) nameSpan.style.textDecoration = 'line-through';

    const amountSpan = document.createElement('span');
    amountSpan.textContent = `$${expense.amount.toFixed(2)}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.addEventListener('click', () => deleteExpense(expense.id));

    li.appendChild(checkbox);
    li.appendChild(nameSpan);
    li.appendChild(amountSpan);
    li.appendChild(deleteBtn);

    expenseList.appendChild(li);
  });

  totalDisplay.textContent = state.totalExpenses.toFixed(2);
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Expense Report', 14, 20);

  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

  doc.setFontSize(12);
  doc.text('Expense', 14, 45);
  doc.text('Amount', 120, 45);
  doc.text('Status', 160, 45);
  doc.line(14, 48, 196, 48);

  let y = 56;
  state.expenses.forEach(expense => {
    doc.text(expense.name, 14, y);
    doc.text(`$${expense.amount.toFixed(2)}`, 120, y);
    doc.text(expense.paid ? 'Paid' : 'Unpaid', 160, y);
    y += 10;
  });

  doc.line(14, y, 196, y);
  y += 10;

  doc.setFont(undefined, 'bold');
  doc.text(`Total Remaining: $${state.totalExpenses.toFixed(2)}`, 14, y);

  doc.save('expenses.pdf');
}

addExpenseButton.addEventListener('click', () => {
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);

  if (name === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid expense name and amount.');
    return;
  }

  addExpense(name, amount);

  expenseNameInput.value = '';
  expenseAmountInput.value = '';
});

exportPdfBtn.addEventListener('click', exportPDF);

loadFromStorage();
updateDisplay();
