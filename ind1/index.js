const json = require('./transactions.json');

class Transaction {
    constructor(transactionJson) {
        this.transaction_id = transactionJson.transaction_id;
        this.transaction_date = transactionJson.transaction_date;
        this.transaction_amount = transactionJson.transaction_amount;
        this.transaction_type = transactionJson.transaction_type;
        this.transaction_description = transactionJson.transaction_description;
        this.merchant_name = transactionJson.merchant_name;
        this.card_type = transactionJson.card_type;
    }

    string() {
        return JSON.stringify(this);
    }
}

class TransactionAnalyzer {
    transactions = [];

    addTransaction(tr) {
        this.transactions.push(tr);
    }

    getAllTransactions() {
        return this.transactions;
    }

    getUniqueTransactionType() {
        let uniqueTypes = new Set();
        this.transactions.map(tr => tr.transaction_type)
            .forEach(type => uniqueTypes.add(type));
        return uniqueTypes;
    }

    calculateTotalAmount() {
        let sum = 0;
        this.transactions.map(tr => tr.transaction_amount)
            .forEach(amount => sum += amount);

        return sum;
    }

    calculateTotalAmountByDate(year, month, day) {
        let sum = 0;
        let predicate = (tr) => typeof year !== 'undefined' ? Number(tr.transaction_date.split('-')[0]) === year : true;
        let predicate1 = (tr) => typeof month !== 'undefined' ? Number(tr.transaction_date.split('-')[1]) === month : true;
        let predicate2 = (tr) => typeof day !== 'undefined' ? Number(tr.transaction_date.split('-')[2]) === day : true;

        this.transactions
            .filter(tr => predicate(tr))
            .filter(tr => predicate1(tr))
            .filter(tr => predicate2(tr))
            .map(tr => tr.transaction_amount)
            .forEach(amount => sum += amount);

        return sum;
    }

    getTransactionByType(type) {
        return this.transactions.filter(tr => tr.transaction_type === type);
    }

    getTransactionsInDateRange(startDate, endDate) {
        let dateStart = new Date(startDate);
        let dateEnd = new Date(endDate);
        return this.transactions.filter(tr => {
            let trDate = new Date(tr.transaction_date);
            return dateStart <= trDate && trDate <= dateEnd;
        })
    }

    getTransactionsByMerchant(merchantName) {
        return this.transactions
            .filter(tr => tr.merchant_name === merchantName);
    }

    calculateAverageTransactionAmount() {
        let quant = 0;
        this.transactions.forEach(tr => quant++);
        return this.calculateTotalAmount() / quant;
    }

    getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.transactions.filter(tr => Number(minAmount) <= tr.transaction_amount && tr.transaction_amount <= Number(maxAmount))
    }

    calculateTotalDebitAmount() {
        let sum = 0;
        this.getTransactionByType("debit")
            .forEach(tr => sum += tr.transaction_amount);
        return sum;
    }

    findMostTransactionsMonth(transactions = this.transactions) {
        const monthCounts = transactions.reduce((monthsAndTheirQuantity, tr) => {
            const month = tr.transaction_date.split('-')[1];
            monthsAndTheirQuantity[month] = (monthsAndTheirQuantity[month] || 0) + 1;
            return monthsAndTheirQuantity;
        }, {});
        return Object.keys(monthCounts).reduce((a, b) => monthCounts[a] > monthCounts[b] ? a : b);
    }

    findMostDebitTransactionMonth() {
        return this.findMostTransactionsMonth(this.getTransactionByType("debit"));
    }

    mostTransactionTypes() {
        const transactionTypesObj = this.transactions.reduce((transactionTypes, tr) => {
            const transactionType = tr.transaction_type;
            transactionTypes[transactionType] = (transactionTypes[transactionType] || 0) + 1;
            return transactionTypes;
        }, {debit: 0, credit: 0});
        if (transactionTypesObj.debit > transactionTypesObj.credit) return 'debit';
        if (transactionTypesObj.credit > transactionTypesObj.debit) return 'credit';
        return 'equal';
    }

    getTransactionsBeforeDate(date) {
        return this.getTransactionsInDateRange(new Date("0000-01-01"), date);
    }

    findTransactionById(id) {
        return this.transactions.find(tr => Number(tr.transaction_id) === id);
    }

    mapTransactionDescriptions() {
        return this.transactions.map(tr => tr.transaction_description);
    }
}

const analyzer = new TransactionAnalyzer();

for (let obj in json) {
    analyzer.addTransaction(new Transaction(json[obj]));
}


console.log('Task: Уникальные типы транзакций:', analyzer.getUniqueTransactionType());
console.log('Task: Общая сумма всех транзакций:', analyzer.calculateTotalAmount());
let year, month, day;

console.log('Task: Общая сумма транзакций за 1 мая 2023 года:', analyzer.calculateTotalAmountByDate(2023, 5, 1));
console.log('Task: Транзакции типа "debit":', analyzer.getTransactionByType('debit'));
console.log('Task: Транзакции в диапазоне дат с 1 мая 2023 по 4 мая 2023:', analyzer.getTransactionsInDateRange('2023-05-01', '2023-05-04'));
console.log('Task: Транзакции с торговцем SuperMart:', analyzer.getTransactionsByMerchant('SuperMart'));
console.log('Task: Средняя сумма транзакций:', analyzer.calculateAverageTransactionAmount());
console.log('Task: Транзакции в диапазоне сумм от 50 до 150:', analyzer.getTransactionsByAmountRange(50, 150));
console.log('Task: Общая сумма дебетовых транзакций:', analyzer.calculateTotalDebitAmount());
console.log('Task: Месяц с наибольшим количеством транзакций:', analyzer.findMostTransactionsMonth());
console.log('Task: Месяц с наибольшим количеством дебетовых транзакций:', analyzer.findMostDebitTransactionMonth());
console.log('Task: Тип транзакций, которых больше всего:', analyzer.mostTransactionTypes());
console.log('Task: Транзакции, совершенные до 2 мая 2023 года:', analyzer.getTransactionsBeforeDate('2023-05-02'));
console.log('Task: Транзакция с ID 1:', analyzer.findTransactionById(1));
console.log('Task: Массив описаний транзакций:', analyzer.mapTransactionDescriptions());