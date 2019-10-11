import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";

import { logoutUser } from  "../../actions/authActions";
import { buyStock, sellStock, updateStocks } from "../../actions/stockActions";
import { ifError } from "assert";

function HeldStock( {symbol, shares, currentValue, openValue}) {

  let performanceColor = ""
  if(currentValue > openValue) performanceColor = "green";
  else if (currentValue < openValue) performanceColor = "red";
  else performanceColor = "grey";

  return (
  <li style = {{color: performanceColor}}>{symbol} - {shares} shares ({currentValue*shares})</li>
 );
}

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            symbol: "",
            quantity: "",
            balance: this.props.auth.user.balance,
            portfolio: this.props.auth.user.ownedStocks,
            errors: {}
        };
    }

    componentDidMount() {
      const { user } = this.props.auth;
      this.setState({
        balance: user.balance,
        portfolio: user.ownedStocks
      })
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onUpdateClick = e => {
      e.preventDefault();

      let user = ""
      if(!this.props.stock.user.data) { user = this.props.auth.user; }
      else { user = this.props.stock.user.data; }

      this.props.updateStocks(user)
      let result = this.props.stock.user.data
      if(result) {
        this.props.auth.user = result
        this.setState({
          portfolio: result.ownedStocks
        })
      }
    }


  processRequest = async (user, tradeRequest, stockRequest) => {
    return new Promise((resolve, reject) => {
      let result = stockRequest(user, tradeRequest)
      setTimeout(function() {
        resolve(result)
      }, 5000)
    }).then(result => {
      return result
    })
  };

   onBuyClick = async e => {
      e.preventDefault();

      let tradeRequest = {
          symbol: this.state.symbol,
          quantity: this.state.quantity 
      };
      let user = ""
      if(!this.props.stock.user.data) { user = this.props.auth.user; }
      else { user = this.props.stock.user.data; }

      await this.processRequest(user, tradeRequest, this.props.buyStock)
      let result = this.props.stock.user.data
      if(result) {
        this.props.auth.user = result
        this.setState({
          balance: result.balance,
          portfolio: result.ownedStocks,
        })
      }
  }

    onSellClick = async e => {
      e.preventDefault();

      let tradeRequest = {
        symbol: this.state.symbol,
        quantity: this.state.quantity 
      };

      let user = ""
      if(!this.props.stock.user.data) { user = this.props.auth.user }
      else { user = this.props.stock.user.data }

      await this.processRequest(user, tradeRequest, this.props.sellStock)
      let result = this.props.stock.user.data
      if(result) {
        this.props.auth.user = result
        this.setState({
          balance: result.balance,
          portfolio: result.ownedStocks,
        })
      }
    }

    onChange = e => {
      this.setState({ [e.target.id]: e.target.value });
  };



    render() {
        const { errors } = this.state;
        let portfolio = undefined
        let portfolioSum = 0
        if(this.state.portfolio != null) {
          portfolio = this.state.portfolio.map((stock, ii) => {
            portfolioSum += stock.quantity*stock.unit_price
            return(
              <HeldStock 
                symbol={stock.symbol}
                shares={stock.quantity}
                currentValue={stock.unit_price}
                openValue={stock.open_price}
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
                        Cash: (${this.state.balance})
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
                        onClick={this.onSellClick}
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
                        onClick={this.onUpdateClick}
                        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                      >
                        Update Prices
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
    sellStock: PropTypes.func.isRequired,
    updateStocks: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    stock: state.stock
});

export default connect(
    mapStateToProps,
    { logoutUser, buyStock, sellStock, updateStocks }
  )(Dashboard);
