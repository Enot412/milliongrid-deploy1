const grid = document.getElementById('grid');
const totalDisplay = document.getElementById('totalAmount');
const uploadForm = document.getElementById('uploadForm');
const finalTotal = document.getElementById('finalTotal');
const pricePerCell = 2.5;
const rows = 500;
const cols = 1000;

for (let i = 0; i < rows * cols; i++) {
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
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: { value: amount }
        }]
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(() => {
        const link = document.getElementById('adLink').value;
        const imageFile = document.getElementById('adImage').files[0];
        const description = document.getElementById('adDescription').value;
        if (imageFile.size > 2 * 1024 * 1024) {
          alert('Image too large. Max 2MB.');
          return;
        }
        const selectedIndices = Array.from(selectedCells).map(cell => cell.dataset.index);
        const formData = new FormData();
        formData.append('link', link);
        formData.append('description', description);
        formData.append('image', imageFile);
        formData.append('cells', JSON.stringify(selectedIndices));
        formData.append('amount', amount);

        fetch('/submit-ad', {
          method: 'POST',
          body: formData
        })
        .then(res => res.ok ? alert('Ad submitted!') : alert('Submission failed.'))
        .catch(() => alert('Submission error.'));
      });
    }
  }).render('#paypal-button-container');
}