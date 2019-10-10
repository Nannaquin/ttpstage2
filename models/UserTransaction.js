const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Make Schema
// Will account for buying and selling 
// If stock quantity positive, was a purchase
// If negative, was a sale
const UserTransactionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    stock_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    transaction_type: {
        type: String, // BUY or SELL
        require: true
    },
    stock_price: { 
        type: Number,
        required: true
    },
    stock_quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = UserTransaction = mongoose.model("userTransactions", UserTransactionSchema);