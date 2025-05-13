function generateBillNumber() {
    const storageKey = `billCount`;
    let count = parseInt(localStorage.getItem(storageKey) || '0', 10) + 1;
    localStorage.setItem(storageKey, count);
    return String(count).padStart(2, '0');
}

function fillAutoFields() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById("billNo").value = generateBillNumber();
    document.getElementById("billDate").value = formattedDate;
}

function togglePaymentDetails() {
    const payment = document.getElementById("paymentMode").value;
    document.getElementById("cardDetails").style.display = payment === 'Card' ? 'block' : 'none';
    document.getElementById("upiDetails").style.display = payment === 'UPI' ? 'block' : 'none';
}

function addItem() {
    const tbody = document.querySelector("#itemTable tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" placeholder="Item name" /></td>
      <td><input type="number" value="1" min="1" onchange="calculateTotals()" /></td>
      <td><input type="number" value="0" min="0" onchange="calculateTotals()" /></td>
      <td><input type="number" value="0" min="0" onchange="calculateTotals()" /></td>
      <td class="gstAmt">0.00</td>
      <td class="itemTotal">0.00</td>
      <td><button onclick="this.closest('tr').remove(); calculateTotals();">Remove</button></td>
    `;
    tbody.appendChild(row);
    calculateTotals();
}

function calculateTotals() {
    let totalGST = 0;
    let grandTotal = 0;

    document.querySelectorAll("#itemTable tbody tr").forEach(row => {
        const qty = parseFloat(row.children[1].children[0].value) || 0;
        const price = parseFloat(row.children[2].children[0].value) || 0;
        const gstRate = parseFloat(row.children[3].children[0].value) || 0;

        const base = qty * price;
        const gstAmt = base * (gstRate / 100);
        const total = base + gstAmt;

        row.querySelector(".gstAmt").innerText = gstAmt.toFixed(2);
        row.querySelector(".itemTotal").innerText = total.toFixed(2);

        totalGST += gstAmt;
        grandTotal += total;
    });

    document.getElementById("totalGST").innerText = totalGST.toFixed(2);
    document.getElementById("grandTotal").innerText = grandTotal.toFixed(2);
}
function generateReceipt() {

        const name = document.getElementById("customerName").value;
        const mobile = document.getElementById("mobileNumber").value;
        const billNo = document.getElementById("billNo").value;
        const date = document.getElementById("billDate").value;
        const payment = document.getElementById("paymentMode").value;
        const totalGST = document.getElementById("totalGST").innerText;
        const grandTotal = document.getElementById("grandTotal").innerText;
    
        const items = Array.from(document.querySelectorAll("#itemTable tbody tr")).map(row => {
            return {
                name: row.children[0].children[0].value,
                qty: row.children[1].children[0].value,
                price: row.children[2].children[0].value,
                gst: row.children[3].children[0].value,
                gstAmt: row.querySelector(".gstAmt").innerText,
                total: row.querySelector(".itemTotal").innerText
            };
        });
    
        const win = window.open();
        win.document.write(`<html><head><title>Receipt</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              h2 { text-align: center; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #000; padding: 8px; text-align: center; }
              .totals { text-align: right; margin-top: 20px; font-size: 18px; }
            </style></head><body>
            <h2>Shopping Mall Receipt</h2>
            <p><strong>Customer:</strong> ${name}</p>
            <p><strong>Mobile:</strong> ${mobile}</p>
            <p><strong>Bill No:</strong> ${billNo}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Payment Mode:</strong> ${payment}</p>
            <table>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>GST%</th><th>GST Amt</th><th>Total</th></tr>
              ${items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>₹${i.price}</td><td>${i.gst}%</td><td>₹${i.gstAmt}</td><td>₹${i.total}</td></tr>`).join('')}
            </table>
            <p class="totals"><strong>Total GST:</strong> ₹${totalGST}</p>
            <p class="totals"><strong>Grand Total:</strong> ₹${grandTotal}</p>
            <p style="text-align:center">Thank you for shopping with us!</p>
            </body></html>
          `);
    }   

window.onload = fillAutoFields;

async function sendReceiptToBackend() {
    const data = {
        customerName: document.getElementById("customerName").value,
        mobileNumber: document.getElementById("mobileNumber").value,
        billNo: document.getElementById("billNo").value,
        billDate: document.getElementById("billDate").value,
        items: Array.from(document.querySelectorAll("#itemTable tbody tr")).map(row => ({
            name: row.children[0].children[0].value,
            qty: row.children[1].children[0].value,
            price: row.children[2].children[0].value,
            gst: row.children[3].children[0].value
        }))
    };

    const response = await fetch("http://localhost:8080/api/send-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("Receipt sent to customer!");
    } else {
        alert("Failed to send receipt.");
    }
}
