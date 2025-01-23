import React, { useState } from "react";
import "../styles.css";

const DateFilter = ({ onFilterChange, onCustomDateChange }) => {
    const [activeFilter, setActiveFilter] = useState("All"); // Default active filter

    const handleFilterClick = (filter) => {
        setActiveFilter(filter); // Update active filter
        if (filter !== "Custom") {
            onFilterChange(filter); // Trigger callback for predefined filters
        }
    };

    const handleCustomDateChange = (event) => {
        const selectedDate = event.target.value; // Get the selected date in YYYY-MM-DD format
        setActiveFilter("Custom"); // Highlight the custom button
        onCustomDateChange(selectedDate); // Trigger callback for custom date change
    };

    return (
        <div className="date-filter">
            <button
                key="Custom"
                className={`filter-btn ${activeFilter === "Custom" ? "selected" : ""}`}
            >
                <input
                    type="date"
                    className="custom-date-input"
                    onChange={handleCustomDateChange}
                />
            </button>
            {["All", "Today", "7D", "30D", "3M", "6M"].map((filter) => (
                <button
                    key={filter}
                    className={`filter-btn ${activeFilter === filter ? "selected" : ""}`}
                    onClick={() => handleFilterClick(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

export default DateFilter;
