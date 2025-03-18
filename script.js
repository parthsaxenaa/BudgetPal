// Auth Logic
const users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Redirect to Home Page if Not Logged In
if (!currentUser && window.location.pathname.endsWith('dashboard.html')) {
  window.location.href = 'index.html';
}

// Show Auth Modal
document.getElementById('signin-btn').addEventListener('click', () => {
  document.getElementById('auth-modal').style.display = 'flex';
  document.getElementById('signin-form').style.display = 'block';
  document.getElementById('signup-form').style.display = 'none';
});

document.getElementById('signup-btn').addEventListener('click', () => {
  document.getElementById('auth-modal').style.display = 'flex';
  document.getElementById('signin-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
});

// Toggle Auth Forms
document.getElementById('toggle-signup').addEventListener('click', () => {
  document.getElementById('signin-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
});

document.getElementById('toggle-signin').addEventListener('click', () => {
  document.getElementById('signin-form').style.display = 'block';
  document.getElementById('signup-form').style.display = 'none';
});

// Sign In Form Submission
document.getElementById('signin-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid credentials');
  }
});

// Sign Up Form Submission
document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const user = { name, email, password, expenses: [], budgetLimit: 0 };
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  alert('Sign up successful! Please sign in.');
  document.getElementById('signin-form').style.display = 'block';
  document.getElementById('signup-form').style.display = 'none';
});

// Close Modal on Click Outside
document.getElementById('auth-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('auth-modal')) {
    document.getElementById('auth-modal').style.display = 'none';
  }
});

// Expense Management
const addExpenseForm = document.getElementById('add-expense-form');
const expenseList = document.getElementById('expense-list').querySelector('tbody');
const budgetLimitDisplay = document.getElementById('budget-limit');
const amountSpentDisplay = document.getElementById('amount-spent');
const amountLeftDisplay = document.getElementById('amount-left');

addExpenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const category = document.getElementById('expense-category').value;
  const date = document.getElementById('expense-date').value;
  const description = document.getElementById('expense-description').value;
  const expense = { amount, category, date, description };
  currentUser.expenses.push(expense);
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  renderExpenses();
  updateBudget();
  updateChart();
  addExpenseForm.reset();
});

function renderExpenses() {
  expenseList.innerHTML = '';
  currentUser.expenses.forEach((expense, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>$${expense.amount}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td>${expense.description}</td>
      <td><button onclick="deleteExpense(${index})">Delete</button></td>
    `;
    expenseList.appendChild(row);
  });
}

function deleteExpense(index) {
  currentUser.expenses.splice(index, 1);
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  renderExpenses();
  updateBudget();
  updateChart();
}

// Budget Management
const setBudgetForm = document.getElementById('set-budget-form');
setBudgetForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const budgetLimit = parseFloat(document.getElementById('budget-input').value);
  currentUser.budgetLimit = budgetLimit;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateBudget();
  setBudgetForm.reset();
});

function updateBudget() {
  const totalSpent = currentUser.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  budgetLimitDisplay.textContent = `$${currentUser.budgetLimit}`;
  amountSpentDisplay.textContent = `$${totalSpent}`;
  amountLeftDisplay.textContent = `$${currentUser.budgetLimit - totalSpent}`;
}

// Chart.js Integration
const ctx = document.getElementById('expense-chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Expenses',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function updateChart() {
  const categories = [...new Set(currentUser.expenses.map(e => e.category))];
  const data = categories.map(cat => currentUser.expenses.filter(e => e.category === cat).reduce((sum, e) => sum + parseFloat(e.amount), 0));
  chart.data.labels = categories;
  chart.data.datasets[0].data = data;
  chart.update();
}

// Initial Render
if (currentUser) {
  renderExpenses();
  updateBudget();
  updateChart();
} else {
  window.location.href = 'index.html';
}