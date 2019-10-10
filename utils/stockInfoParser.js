module.exports = function stockInfoParser (data) {
    
    const currentPrice = (Number(data["2. high"]) + Number(data["3. low"]))/2;
    const parsedInfo = {
        price: currentPrice.toFixed(2),
        opening_price: Number(data["1. open"]).toFixed(2)
    }

    return parsedInfo;
}