document.addEventListener("DOMContentLoaded", () => {
  let budgetLimit = 0;
  let amountSpent = 0;
  let expenses = [];

  document.getElementById("set-budget-form").addEventListener("submit", function(event) {
    event.preventDefault();
    budgetLimit = parseFloat(document.getElementById("budget-input").value);
    updateBudget();
  });

  document.getElementById("add-expense-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let expenseAmount = parseFloat(document.getElementById("expense-amount").value);
    let expenseCategory = document.getElementById("expense-category").value;
    let expenseDate = document.getElementById("expense-date").value;
    let expenseDescription = document.getElementById("expense-description").value || "-";

    amountSpent += expenseAmount;
    expenses.push({ amount: expenseAmount, category: expenseCategory, date: expenseDate, description: expenseDescription });
    updateBudget();
    updateChart();

    let table = document.querySelector("#expense-list tbody");
    let row = table.insertRow();
    row.innerHTML = `
      <td>$${expenseAmount}</td>
      <td>${expenseCategory}</td>
      <td>${expenseDate}</td>
      <td>${expenseDescription}</td>
      <td><button onclick="removeExpense(this, ${expenseAmount})">❌</button></td>
    `;
  });

  window.removeExpense = function(btn, amount) {
    let row = btn.parentElement.parentElement;
    let index = Array.from(row.parentElement.children).indexOf(row);
    expenses.splice(index, 1);
    row.remove();
    amountSpent -= amount;
    updateBudget();
    updateChart();
  };

  function updateBudget() {
    document.getElementById("budget-limit").textContent = `$${budgetLimit}`;
    document.getElementById("amount-spent").textContent = `$${amountSpent}`;
    document.getElementById("amount-left").textContent = `$${budgetLimit - amountSpent}`;
  }

  function updateChart() {
    let ctx = document.getElementById("expense-chart").getContext("2d");
    let categories = expenses.map(expense => expense.category);
    let amounts = expenses.map(expense => expense.amount);

    if (window.expenseChart) {
      window.expenseChart.destroy();
    }

    window.expenseChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Expenses',
          data: amounts,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
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
  }
});