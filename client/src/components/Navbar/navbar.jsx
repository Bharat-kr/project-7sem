import React from "react";
import "./navbar.css";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";

const Navbar = ({ displayLogin, displaySignUp }) => {
  return (
    <div>
      <header className="header flex-between-center">
        <div className="logo-wrap">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
        </div>
        <div className="buttons">
          {displayLogin && (
            <Link to="/login" className="primary-btn">
              LOGIN
            </Link>
          )}

          {displaySignUp && (
            <Link to="/signUp" className="primary-btn">
              Register
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
