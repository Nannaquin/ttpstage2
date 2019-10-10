const Validator = require("validator");
const isEmpty = require("is-empty");

function isTickerSymbol(data) {
    if(data.length >= 1 && data.length <= 5) {
        return true;
    }
    else return false;
}

module.exports = function validatePurchaseInput (data) {
    let errors = {};

    // Convert empty fields to an empty string to use validator functiosn
    data.symbol = !isEmpty(data.symbol) ? data.symbol : "";
    data.quantity = !isEmpty(data.quantity) ? data.quantity : "";

    // Symbol checks
    if (Validator.isEmpty(data.symbol)) {
        errors.symbol = "A ticker symbol is required";
    } else if (!isTickerSymbol(data.symbol)) {
        errors.symbol = "Invalid ticker symbol length";
    }

    // Quantity Check
    if (Validator.isEmpty(data.quantity)) {
        errors.quantity = "Quantity is required";
    } else if (data.symbol == 0) {
        errors.quantity = "Quantity must be above zero";
    }
    console.log(errors)
    return {
        errors,
        isValid: isEmpty(errors)
    };
};