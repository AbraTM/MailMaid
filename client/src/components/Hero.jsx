import React from "react";
import { Link } from "react-router-dom";
import "./hero.css";

export default function Hero() {
  return (
    <div className="hero">
        <div className="main-graphic">
            <div className="blue"></div>
            <div className="gray"></div>
            <div className="orange"></div>
            <div className="green"></div>
            <div className="yellow"></div>
            <div className="purple"></div>
        </div>
        <div className="btn-section">
            <Link to={"get-started"}>
              <button className="get-started"><span>Get Started</span></button>
            </Link>
            <em>We only delete what you choose. Your inbox, your rules.</em>
        </div>
    </div>
  )
};

