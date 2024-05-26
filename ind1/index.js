/**
 * @module TransactionAnalyzer
 */

import {json} from './transactions.js'

/**
 * Class representing a transaction.
 */
class Transaction {
    /**
     * Create a transaction.
     * @param {Object} transactionJson - The JSON object representing a transaction.
     * @param {number} transactionJson.transaction_id - The ID of the transaction.
     * @param {string} transactionJson.transaction_date - The date of the transaction in YYYY-MM-DD format.
     * @param {number} transactionJson.transaction_amount - The amount of the transaction.
     * @param {string} transactionJson.transaction_type - The type of the transaction (e.g., debit, credit).
     * @param {string} transactionJson.transaction_description - The description of the transaction.
     * @param {string} transactionJson.merchant_name - The name of the merchant.
     * @param {string} transactionJson.card_type - The type of card used in the transaction.
     */
    constructor(transactionJson) {
        this.transaction_id = transactionJson.transaction_id;
        this.transaction_date = transactionJson.transaction_date;
        this.transaction_amount = transactionJson.transaction_amount;
        this.transaction_type = transactionJson.transaction_type;
        this.transaction_description = transactionJson.transaction_description;
        this.merchant_name = transactionJson.merchant_name;
        this.card_type = transactionJson.card_type;
    }

    /**
     * Convert the transaction object to a JSON string.
     * @returns {string} The JSON string representation of the transaction.
     */
    string() {
        return JSON.stringify(this);
    }
}

/**
 * Class representing a transaction analyzer.
 */
class TransactionAnalyzer {
    /**
     * Create a transaction analyzer.
     */
    constructor() {
        this.transactions = [];
    }

    /**
     * Add a transaction to the analyzer.
     * @param {Transaction} tr - The transaction to add.
     */
    addTransaction(tr) {
        this.transactions.push(tr);
    }

    /**
     * Get all transactions.
     * @returns {Transaction[]} An array of all transactions.
     */
    getAllTransactions() {
        return this.transactions;
    }

    /**
     * Get unique transaction types.
     * @returns {Set<string>} A set of unique transaction types.
     */
    getUniqueTransactionType() {
        let uniqueTypes = new Set();
        this.transactions.map(tr => tr.transaction_type)
            .forEach(type => uniqueTypes.add(type));
        return uniqueTypes;
    }

    /**
     * Calculate the total amount of all transactions.
     * @returns {number} The total amount of all transactions.
     */
    calculateTotalAmount() {
        let sum = 0;
        this.transactions.map(tr => tr.transaction_amount)
            .forEach(amount => sum += amount);
        return sum;
    }

    /**
     * Calculate the total amount of transactions by date.
     * @param {number} [year] - The year to filter by.
     * @param {number} [month] - The month to filter by.
     * @param {number} [day] - The day to filter by.
     * @returns {number} The total amount of transactions for the specified date.
     */
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

    /**
     * Get transactions by type.
     * @param {string} type - The type of transactions to filter by.
     * @returns {Transaction[]} An array of transactions of the specified type.
     */
    getTransactionByType(type) {
        return this.transactions.filter(tr => tr.transaction_type === type);
    }

    /**
     * Get transactions in a date range.
     * @param {string} startDate - The start date of the range in YYYY-MM-DD format.
     * @param {string} endDate - The end date of the range in YYYY-MM-DD format.
     * @returns {Transaction[]} An array of transactions within the specified date range.
     */
    getTransactionsInDateRange(startDate, endDate) {
        let dateStart = new Date(startDate);
        let dateEnd = new Date(endDate);
        return this.transactions.filter(tr => {
            let trDate = new Date(tr.transaction_date);
            return dateStart <= trDate && trDate <= dateEnd;
        });
    }

    /**
     * Get transactions by merchant name.
     * @param {string} merchantName - The name of the merchant to filter by.
     * @returns {Transaction[]} An array of transactions with the specified merchant name.
     */
    getTransactionsByMerchant(merchantName) {
        return this.transactions.filter(tr => tr.merchant_name === merchantName);
    }

    /**
     * Calculate the average transaction amount.
     * @returns {number} The average amount of all transactions.
     */
    calculateAverageTransactionAmount() {
        let quant = this.transactions.length;
        return this.calculateTotalAmount() / quant;
    }

    /**
     * Get transactions in an amount range.
     * @param {number} minAmount - The minimum amount of the range.
     * @param {number} maxAmount - The maximum amount of the range.
     * @returns {Transaction[]} An array of transactions within the specified amount range.
     */
    getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.transactions.filter(tr => Number(minAmount) <= tr.transaction_amount && tr.transaction_amount <= Number(maxAmount));
    }

    /**
     * Calculate the total debit amount.
     * @returns {number} The total amount of debit transactions.
     */
    calculateTotalDebitAmount() {
        let sum = 0;
        this.getTransactionByType("debit")
            .forEach(tr => sum += tr.transaction_amount);
        return sum;
    }

    /**
     * Find the month with the most transactions.
     * @param {Transaction[]} [transactions=this.transactions] - The transactions to analyze.
     * @returns {string} The month (in MM format) with the most transactions.
     */
    findMostTransactionsMonth(transactions = this.transactions) {
        const monthCounts = transactions.reduce((monthsAndTheirQuantity, tr) => {
            const month = tr.transaction_date.split('-')[1];
            monthsAndTheirQuantity[month] = (monthsAndTheirQuantity[month] || 0) + 1;
            return monthsAndTheirQuantity;
        }, {});
        return Object.keys(monthCounts).reduce((a, b) => monthCounts[a] > monthCounts[b] ? a : b);
    }

    /**
     * Find the month with the most debit transactions.
     * @returns {string} The month (in MM format) with the most debit transactions.
     */
    findMostDebitTransactionMonth() {
        return this.findMostTransactionsMonth(this.getTransactionByType("debit"));
    }

    /**
     * Determine the type of transactions that occur most frequently.
     * @returns {string} The type of transactions that occur most frequently ('debit', 'credit', or 'equal').
     */
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

    /**
     * Get transactions before a specified date.
     * @param {string} date - The end date in YYYY-MM-DD format.
     * @returns {Transaction[]} An array of transactions before the specified date.
     */
    getTransactionsBeforeDate(date) {
        return this.getTransactionsInDateRange(new Date("0000-01-01"), date);
    }

    /**
     * Find a transaction by its ID.
     * @param {number} id - The ID of the transaction.
     * @returns {Transaction} The transaction with the specified ID.
     */
    findTransactionById(id) {
        return this.transactions.find(tr => Number(tr.transaction_id) === id);
    }

    /**
     * Get an array of all transaction descriptions.
     * @returns {string[]} An array of all transaction descriptions.
     */
    mapTransactionDescriptions() {
        return this.transactions.map(tr => tr.transaction_description);
    }
}

const analyzer = new TransactionAnalyzer();

// Add transactions from the JSON file
for (let obj in json) {
    analyzer.addTransaction(new Transaction(json[obj]));
}

// Example usage and console logs
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