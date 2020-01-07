import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";

function Record( {date, t_type, symbol, shares, price}) {
    let sign = ""
    if(t_type == "BUY") sign = '-'
    else sign = '+'
    return (
    <li>{date} - {t_type} {symbol} - {shares} shares ({sign}${price*shares})</li>
   );
  }

class History extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactions: this.props.auth.user.transactions,
            errors: {}
        };
      }

    componentDidMount() {
        const { user } = this.props.auth;
        console.log("CDM USER: " + user)
        this.setState({
            transactions: user.transactions
        })
    }

    render() {
        console.log("STATE: " + this.state)
        console.log("PROPS: " + this.props.auth)

        const { user } = this.props.auth
        let transactions = undefined
        if(this.state.transactions != null) {
            transactions = this.state.transactions.map((record, ii) => {
                console.log(record)
                let date = new Date(record.date).toDateString()
              return(
                <Record
                  date={date}
                  t_type={record.transaction_type}
                  symbol={record.symbol}
                  shares={record.stock_quantity}
                  price={record.stock_price}
                  key={ii}
                  />
              );
            })
          } else { transactions = "No transactions made yet."}
        return(
            <div style={{ height: "75vh" }} className="container valign-wrapper">
              <div className="row">
                <div className="col s12 center-align">
                <h3>Transaction Record</h3>
                    <ul>
                    {transactions}
                    </ul>
                </div>
              </div>
            </div>
        )
    }
}

History.propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    stock: state.stock
});

export default connect(
    mapStateToProps,
    {}
  )(History);