const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const heldStockSchema = new Schema({
  symbol: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit_price: {
    type: Number,
    required: true
  },
  open_price: {
    type: Number,
    required: true
  }
});

const transactionSchema = new Schema({
  transaction_type: {
    type: String, // BUY or SELL
    required: true
  },
  symbol: {
    type: String,
    required: true
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




// Make Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  balance: {
      type: Number,
      default: 5000.00
  },
  transactions: [ transactionSchema ],
  ownedStocks: [ heldStockSchema ]
});
module.exports = User = mongoose.model("users", UserSchema);
//module.exports = HeldStock = mongoose.model("heldStocks", heldStockSchema);
//module.exports = Transaction = mongoose.model("transactions", transactionSchema);