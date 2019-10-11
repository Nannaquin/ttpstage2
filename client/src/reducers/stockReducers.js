import {
    BUY_STOCK,
    SELL_STOCK,
    UPDATE_STOCKS
} from "../actions/types";


const initialState = {
    user: {},
    loading: false
};

export default function(state = initialState, action) {
    switch(action.type) {
        case BUY_STOCK:
            return {
                ...state,
                user: action.payload
            };
        case SELL_STOCK:
            return {
                ...state,
                user: action.payload
            };
        case UPDATE_STOCKS:
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
}