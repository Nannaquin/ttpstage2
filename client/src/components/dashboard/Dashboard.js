import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";

import { logoutUser } from  "../../actions/authActions";
import { buyStock } from "../../actions/stockActions";

function HeldStock( {symbol, shares, currentValue}) {
  return (
  <li>{symbol} - {shares} shares ({currentValue*shares})</li>
 );
}

class Dashboard extends Component {

    constructor() {
      super();
      this.state = {
        symbol: "",
        quantity: "",
        errors: {}
      };
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onBuyClick = e => {
      e.preventDefault();

      let tradeRequest = {
          symbol: this.state.symbol,
          quantity: this.state.quantity 
      };
      console.log(this.props.auth.user)
      this.props.auth.user = this.props.buyStock(this.props.auth.user, tradeRequest);
      console.log(this.props.auth.user)
    };

    onSellClick = e => {

    }

    onChange = e => {
      this.setState({ [e.target.id]: e.target.value });
  };

    render() {
        const { user } = this.props.auth;
        console.log(user)
        const { errors } = this.state;
        let portfolio = undefined
        let portfolioSum = 0
        if(user.ownedStocks != null) {
          portfolio = user.ownedStocks.map((stock, ii) => {
            portfolioSum += stock.quantity*10
            return(
              <HeldStock 
                symbol={stock.symbol}
                shares={stock.quantity}
                currentValue={10}
                key={ii}
                />
            );
          })
        } else { portfolio = "No stocks owned yet."}

        return (
                <div style={{ height: "75vh" }} className="container valign-wrapper">
                  <div className="row">
                    <div className="col s6 center-align">
                      <h4>
                        <b>Portfolio(${portfolioSum})</b>
                      </h4>
                      <ul>
                        {portfolio}
                      </ul>
                    </div>
                    <div className="col s6 center-align">
                      <h4>
                        Cash: (${user.balance})
                      </h4>
                      <input
                        onChange={this.onChange}
                        value={this.state.symbol}
                        error={errors.symbol}
                        id="symbol"
                        type="text"
                        placeholder="Ticker Symbol"
                        className={classnames("", {
                          invalid: errors.symbol
                        })} />
                      <input
                        onChange={this.onChange}
                        value={this.state.quantity}
                        error={errors.quantity}
                        id="quantity"
                        type="text"
                        placeholder="Quantity"
                        className={classnames("", {
                          invalid: errors.quantity
                        })}
                        />                        
                      <button
                        style={{
                          width: "100px",
                          borderRadius: "3px",
                          letterSpacing: "1.5px",
                          marginTop: "1rem"
                        }}
                        onClick={this.onBuyClick}
                        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                      >
                        Buy
                      </button>
                      <button
                        style={{
                          width: "100px",
                          borderRadius: "3px",
                          letterSpacing: "1.5px",
                          marginTop: "1rem"
                        }}
                        //onClick={this.onLogoutClick}
                        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                      >
                        Sell
                      </button>
                      <button
                        style={{
                          width: "150px",
                          borderRadius: "3px",
                          letterSpacing: "1.5px",
                          marginTop: "1rem"
                        }}
                        onClick={this.onLogoutClick}
                        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    buyStock: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser, buyStock }
  )(Dashboard);
