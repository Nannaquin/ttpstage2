import React, { Component } from "react";
import { Link } from "react-router-dom";


class Navbar extends Component {
    render() {
        return (
            <div className="navbar-fixed">
                <nav className="z-depth-0">
                    <div className="nav-wrapper white">
                        <Link 
                        to="/"
                        style={{
                            fontFamily: "monospace"
                        }}
                        className="col s5 brand-logo center black-text"
                        >
                            <i className="material-icons">code</i>
                            Stock Trading
                        </Link>
                        <Link
                        to="/Dashboard" 
                        style={{
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            padding: "16dp"
                        }}
                        className="col s3 black-text"
                        >
                            Portfolio
                        </Link>
                        <Link
                        to="/History" 
                        style={{
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            padding: "16dp"
                        }}
                        className="col s3 black-text"
                        >
                            Transactions
                        </Link>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;