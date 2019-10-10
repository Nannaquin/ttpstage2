const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Make Schema
const StockSchema = new Schema({
  ticker_symbol: {
      type: String,
      required: true
  },
  price: {
      type: Number,
      required: true
  },
  opening_price: {
      type: Number,
      required: true
  }
});

module.exports = Stock = mongoose.model("stocks", StockSchema);