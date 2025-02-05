import React, { useState } from "react";
import "../styles.css";

const DateFilter = ({ onFilterChange, onCustomDateChange }) => {
    const [activeFilter, setActiveFilter] = useState("All"); // Default active filter
    const [startDate, setStartDate] = useState(""); // Stores the selected start date
    const [endDate, setEndDate] = useState(""); // Stores the selected end date

    const handleFilterClick = (filter) => {
        setActiveFilter(filter); // Update active filter
        setStartDate(""); // Reset custom date inputs
        setEndDate(""); 
        if (filter !== "Custom") {
            onFilterChange(filter); // Trigger callback for predefined filters
        }
    };

    const handleStartDateChange = (event) => {
        const selectedStartDate = event.target.value;
        setStartDate(selectedStartDate);

        // Automatically set the active filter to Custom
        setActiveFilter("Custom");

        // Only trigger the update when both start and end dates are selected
        if (endDate && selectedStartDate <= endDate) {
            onCustomDateChange(selectedStartDate, endDate);
        }
    };

    const handleEndDateChange = (event) => {
        const selectedEndDate = event.target.value;
        setEndDate(selectedEndDate);

        // Automatically set the active filter to Custom
        setActiveFilter("Custom");

        // Only trigger the update when both start and end dates are selected
        if (startDate && selectedEndDate >= startDate) {
            onCustomDateChange(startDate, selectedEndDate);
        }
    };

    return (
        <div className="date-filter">
            <div className="custom-date-container">
                <button
                    key="Custom"
                    className={`filter-btn ${activeFilter === "Custom" ? "selected" : ""}`}
                >
                    <label>Start Date:</label>
                    <input
                        type="date"
                        className="custom-date-input"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </button>
            </div>
            <div className="custom-date-container">
                <button
                    key="CustomEnd"
                    className={`filter-btn ${activeFilter === "Custom" ? "selected" : ""}`}
                >
                    <label>End Date:</label>
                    <input
                        type="date"
                        className="custom-date-input"
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </button>
            </div>
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
