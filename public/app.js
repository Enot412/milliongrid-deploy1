
const grid = document.getElementById('grid');
const totalDisplay = document.getElementById('totalAmount');
const uploadForm = document.getElementById('uploadForm');
const finalTotal = document.getElementById('finalTotal');
const pricePerCell = 2.5;

for (let i = 0; i < 500 * 1000; i++) {
  const cell = document.createElement('div');
  cell.className = 'grid-cell';
  cell.dataset.index = i;
  cell.addEventListener('click', () => {
    cell.classList.toggle('selected');
    updateTotal();
  });
  grid.appendChild(cell);
}

function updateTotal() {
  const selected = document.querySelectorAll('.grid-cell.selected');
  const count = selected.length;
  const total = (count * pricePerCell).toFixed(2);
  totalDisplay.textContent = `Selected: ${count} cells — Total: $${total}`;
}

function proceedToCheckout() {
  const selected = document.querySelectorAll('.grid-cell.selected');
  if (selected.length === 0) {
    alert('Please select at least one cell.');
    return;
  }
  const total = (selected.length * pricePerCell).toFixed(2);
  finalTotal.textContent = `$${total}`;
  uploadForm.style.display = 'block';
  window.scrollTo({ top: uploadForm.offsetTop, behavior: 'smooth' });

  renderPayPalButton(total, selected);
}

function renderPayPalButton(amount, selectedCells) {
  document.getElementById('paypal-button-container').innerHTML = '';
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: amount
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Payment completed!');
      });
    }
  }).render('#paypal-button-container');
}
