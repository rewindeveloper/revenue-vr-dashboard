import React from "react";
import "../styles.css";
import rewinlogo from "../images/rewinlogo.png"; // Ensure this image exists in the specified path

const Header = ({ onLogout, onDownloadCSV }) => {
    return (
        <header className="header">
            <img src={rewinlogo} alt="ReWin logo" width="250" />
            <div className="header-buttons">
                <button className="download-button" onClick={onDownloadCSV}>
                    Download CSV
                </button>
                <button className="logout-button" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
