const transactions = [];

// id
// date
// amount
// category
// description

function deleteTransaction(rowId) {
    for (let transaction in transactions) {
        if (transactions[transaction].id === Number(rowId)) {
            transactions.splice(transactions.indexOf(transaction), 1);
        }
    }
    const trTable = document.getElementById('transactionList');
    const removeTr = document.getElementById(rowId);
    trTable.removeChild(removeTr);
    let total = "Total: " + calculateTotalAmount()
    let pTotal = document.getElementById('total');
    pTotal.textContent = total;
    let pDescription = document.getElementById('fullDescription');
    pDescription.textContent = ` `;

}

function displayDescriptionAndAmount(transactionId) {
    for (let transaction in transactions) {
        if (transactions[transaction].id === Number(transactionId)) {
            let pDescription = document.getElementById('fullDescription');
            pDescription.textContent = `Transaction ID: ${transactions[transaction].id}; Amount: ${transactions[transaction].amount}; Full description: ${transactions[transaction].description}`;
        }
    }
}

function addTransaction() {
    try {
        let prevId = transactions.length === 0 ? 0 : Math.max(...transactions.map(tr => Number(tr.id)));
        let id = prevId + 1;
        let date = document.getElementById('date').value;
        let amount = document.getElementById('amount').value;
        let category = document.getElementById('category').value;
        let description = document.getElementById('description').value;
        let transaction = {
            id: id,
            date: date,
            amount: amount,
            category: category,
            description: description,
        };
        transactions.push(transaction);
        const tableBody = document.getElementById('transactionList');
        const newRow = document.createElement('tr');
        newRow.setAttribute('id', id);
        let td = document.createElement('td');
        td.textContent = id;
        newRow.appendChild(td);
        td = document.createElement('td');
        td.textContent = date;
        newRow.appendChild(td);
        td = document.createElement('td');
        td.textContent = category;
        newRow.appendChild(td);
        td = document.createElement('td');
        td.textContent = description.split(" ").slice(0, 4).join(' ');
        newRow.appendChild(td);
        const button = document.createElement('button');
        button.textContent = "Delete tr with this ID";
        button.id = "button-id";
        button.onclick = () => deleteTransaction(id);
        button.className = "deleteButton";
        td = document.createElement('td');
        td.appendChild(button)
        newRow.appendChild(td);
        newRow.onclick = () => displayDescriptionAndAmount(id);
        if (amount >= 0) {
            newRow.style.backgroundColor = "#6fc276"
        } else {
            newRow.style.backgroundColor = "#fa6d6d"
        }
        tableBody.appendChild(newRow);
        document.getElementById('total').innerText = "Total: " + calculateTotalAmount();
        let pDescription = document.getElementById('fullDescription');
        pDescription.textContent = ` `;
    } catch (e) {
        console.error(e);
    }
}

function calculateTotalAmount() {
    let sum = 0;
    transactions.forEach(transaction => {
        sum += Number(transaction.amount);
    });
    return sum;
}

document.addEventListener('DOMContentLoaded', (event) => {
    const formContainer = document.getElementById('formContainer');
    const formHeader = document.getElementById('formHeader');

    let isDragging = false;
    let offsetX, offsetY;

    formHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - formContainer.getBoundingClientRect().left;
        offsetY = e.clientY - formContainer.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            formContainer.style.left = `${e.clientX - offsetX}px`;
            formContainer.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});
