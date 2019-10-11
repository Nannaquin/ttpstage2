import axios from "axios";

import {
    GET_ERRORS,
    BUY_STOCK,
    SELL_STOCK,
    UPDATE_STOCKS
} from "./types";

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
            if(!res.data) throw("Improper symbol")
            console.log("POST API CALL")
            const obj = res.data["Time Series (Daily)"];
            console.log("POST OBJ")
            const dateStr = Object.keys(obj)[0];
            console.log("POST DATESTR")
            let info = res.data["Time Series (Daily)"][dateStr];
            if(!info) { 
                console.log("WHOOPS")
                throw("STOCK INFO ERROR"); }

                console.log("UD: " + userData)
            const tradeData = {
                userId: userData.id,
                symbol: symbol,
                quantity: tradeInfo.quantity,
                stockInfo: info
            }
            console.log("tD userID: " + tradeData.userId    )
            console.log("BEFORE buyStock")
            axios.post("/api/users/buyStock", tradeData)
            .then(res => {
                console.log("Returning Purchase")
                console.log("response: " + res)
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
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err
            })
        )
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

export const updateStocks = userData => dispatch => {

    const data = {
        id: userData.id
    }
    axios
    .post("/api/users/updateStocks", data)
    .then(res => {
        dispatch(returnUpdate(res));
    })

}

export const returnUpdate = userData => {
    return {
        type: UPDATE_STOCKS,
        payload: userData
    }
}