const Stock = require("../models/Stock");

module.exports = function stockUpdater (parsedInfo, stock, symbol) {
    if(!stock) {
        const newEntry = new Stock({
            ticker_symbol: symbol,
            price: parsedInfo.price,
            opening_price: parsedInfo.opening_price
        })
        newEntry.save()
        stock = newEntry;
    }
    // Else Update info
    else {
        stock.overwrite({
            ticker_symbol: symbol,
            price: parsedInfo.price,
            opening_price: parsedInfo.opening_price
        });
        stock.save()
    }
    return stock;
}