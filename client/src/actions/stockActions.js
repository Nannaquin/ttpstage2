import axios from "axios";

import {
    GET_ERRORS,
    BUY_STOCK,
    SELL_STOCK
} from "./types";


// Make system that adjusts to missing info
function dateAssembler() {
    const date = new Date();
    let dateString = "";
    dateString += String(date.getFullYear()) + "-";
    const month = date.getMonth() + 1;
    dateString += month + "-";
    let day = String(date.getDate());
    if(day.length == 1) { day = "0" + day; }
    dateString += day;

    return dateString;
}

const url = "https://www.alphavantage.co/query?";
const func = "function=TIME_SERIES_DAILY&symbol=";
let symbol = "";
const apiKey = "&apikey=0K96SVX24Y4P72MR"
// API ACCESS KEY:  
export const buyStock = (userData, tradeInfo) => dispatch => {
    axios
        .post("/api/users/stockRequest", tradeInfo)
        .then(res => {
            console.log("POST REQUEST")
            symbol = tradeInfo.symbol;
            return axios.get(url + func + symbol + apiKey);
        })
        .then(res => {
            const obj = res.data["Time Series (Daily)"];
            const dateStr = Object.keys(obj)[0];
            let info = res.data["Time Series (Daily)"][dateStr];
            if(!info) { throw("STOCK INFO ERROR"); }

            const tradeData = {
                userId: userData.id,
                symbol: symbol,
                quantity: tradeInfo.quantity,
                stockInfo: info
            }
            console.log("BEFORE buyStock")
            axios.post("/api/users/buyStock", tradeData)
            .then(res => {
                console.log("Returning Purchase")
                dispatch(returnPurchase(res));
            })

            
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err
            })
        )
}

export const sellStock = (userData, tradeInfo) => dispatch => {
    axios
        .post("/api/users/stockRequest", tradeInfo)
        .then(res => {
            symbol = tradeInfo.symbol;
            return axios.get(url + func + symbol + apiKey);
        })
        .then(res => {
            const obj = res.data["Time Series (Daily)"];
            const dateStr = Object.keys(obj)[0];
            let info = res.data["Time Series (Daily)"][dateStr];
            if(!info) { throw("STOCK INFO ERROR"); }

            const tradeData = {
                userId: userData.id,
                symbol: symbol,
                quantity: tradeInfo.quantity,
                stockInfo: info
            }
            axios.post("/api/users/sellStock", tradeData)
            .then(res => {
                dispatch(returnSale(res));
            })
        })
}

export const returnPurchase = userData => {
    return {
        type: BUY_STOCK,
        payload: userData 
    }
}

export const returnSale = userData => {
    return {
        type: SELL_STOCK,
        payload: userData
    }
}