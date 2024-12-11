// Mock data for referral transactions
let transactions = [];

// Handle Login / Sign Up Button
document.getElementById('login-button').addEventListener('click', () => {
  const email = document.getElementById('friend-email').value.trim();
  const referralCode = document.getElementById('referral-code').value.trim();
  const statusElement = document.getElementById('login-status');

  // Validation for empty fields
  if (!email || !referralCode) {
    statusElement.textContent = 'Please enter both your email and the referral code.';
    statusElement.style.color = 'red';
    return;
  }

  // Add transaction to the log
  const transaction = {
    date: new Date().toLocaleDateString(),
    email: email,
    status: '₹50 Credited',
    amount: 50
  };

  transactions.push(transaction);
  renderTransactions();

  // Clear fields and show success message
  document.getElementById('friend-email').value = '';
  document.getElementById('referral-code').value = '';
  statusElement.textContent = 'Successfully logged referral! ₹50 credited to the referrer.';
  statusElement.style.color = 'green';
});

// Render Transactions
function renderTransactions() {
  const tableBody = document.getElementById('transaction-table');
  tableBody.innerHTML = '';

  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${transaction.date}</td>
      <td>${transaction.email}</td>
      <td>${transaction.status}</td>
      <td>₹${transaction.amount}</td>
    `;
    tableBody.appendChild(row);
  });
}
