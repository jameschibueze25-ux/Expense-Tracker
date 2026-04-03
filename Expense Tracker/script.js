// ==================== STATE ====================
const state = {
  expenses: [],
  totalExpenses: 0
};

// ==================== GET ELEMENTS ====================
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseButton = document.getElementById('add-btn');
const expenseList = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');

// ==================== FUNCTIONS TO UPDATE STATE ====================

// Function 1: Add expense
function addExpense(name, amount) {
  // Create expense object
  const newExpense = {
    id: Date.now(),  // Unique ID
    name: name,
    amount: amount,
    paid: false
  };

  // Add to state
  state.expenses.push(newExpense);
  state.totalExpenses += amount;

  // Update display
  updateDisplay();
}

// Function 2: Mark expense as paid
function markAsPaid(expenseId) {
  // Find the expense
  const expense = state.expenses.find(e => e.id === expenseId);

  if (expense) {
    if (expense.paid) {
      // If already paid, unmark it
      expense.paid = false;
      state.totalExpenses += expense.amount;
    } else {
      // If not paid, mark it as paid
      expense.paid = true;
      state.totalExpenses -= expense.amount;
    }

    // Update display
    updateDisplay();
  }
}

// Function 3: Delete expense
function deleteExpense(expenseId) {
  // Find the expense
  const expense = state.expenses.find(e => e.id === expenseId);

  if (expense) {
    // If not paid, subtract from total
    if (!expense.paid) {
      state.totalExpenses -= expense.amount;
    }

    // Remove from state
    state.expenses = state.expenses.filter(e => e.id !== expenseId);

    // Update display
    updateDisplay();
  }
}

// ==================== UPDATE DISPLAY ====================
function updateDisplay() {
  // Clear the list
  expenseList.innerHTML = '';

  // Loop through all expenses and display them
  state.expenses.forEach(expense => {
    const li = document.createElement('li');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = expense.paid;
    checkbox.addEventListener('change', () => {
      markAsPaid(expense.id);
    });

    // Name span
    const nameSpan = document.createElement('span');
    nameSpan.textContent = expense.name;
    if (expense.paid) {
      nameSpan.style.textDecoration = 'line-through';
    }

    // Amount span
    const amountSpan = document.createElement('span');
    amountSpan.textContent = `$${expense.amount.toFixed(2)}`;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.addEventListener('click', () => {
      deleteExpense(expense.id);
    });

    // Add all to li
    li.appendChild(checkbox);
    li.appendChild(nameSpan);
    li.appendChild(amountSpan);
    li.appendChild(deleteBtn);

    // Add li to list
    expenseList.appendChild(li);
  });

  // Update total display
  totalDisplay.textContent = state.totalExpenses.toFixed(2);
}

// ==================== EVENT LISTENERS ====================
addExpenseButton.addEventListener('click', () => {
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);

  if (name === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid expense name and amount.');
    return;
  }

  // Call the function to add expense
  addExpense(name, amount);

  // Clear inputs
  expenseNameInput.value = '';
  expenseAmountInput.value = '';
});