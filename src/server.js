const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path"); // To handle file paths

const app = express();
app.use(cors());
app.use(express.json());

// Helper function to parse and transform API data
const transformPatientData = (data) => {
    return data.flatMap((entry) =>
        entry.clinicData.map((clinic) => ({
            date: entry.date,
            patientName: clinic.patientName,
            therapistEmail: clinic.therapistemail,
            clinicName: clinic.clinicName,
            condition: clinic.condition,
            sessionData: clinic.patientData, // Include session details (numberOfSessions and gamesList)
        }))
    );
};

// Route to fetch patient data with or without filters
app.get("/api/patients", async (req, res) => {
    const { filter, customDate } = req.query;

    let apiUrl = "https://qa.rewinhealth.com/api/discharge/Invoice";
    let startDate, endDate;

    try {
        if (filter === "All") {
            // Do not apply any date filter
            console.log("Fetching all data...");
        } else if (customDate) {
            startDate = endDate = customDate;
        } else if (filter) {
            const today = new Date();
            switch (filter) {
                case "Today":
                    startDate = endDate = today.toISOString().split("T")[0];
                    break;
                case "7D":
                    startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split("T")[0];
                    endDate = new Date().toISOString().split("T")[0];
                    break;
                case "30D":
                    startDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split("T")[0];
                    endDate = new Date().toISOString().split("T")[0];
                    break;
                case "3M":
                    startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split("T")[0];
                    endDate = new Date().toISOString().split("T")[0];
                    break;
                case "6M":
                    startDate = new Date(today.setMonth(today.getMonth() - 6)).toISOString().split("T")[0];
                    endDate = new Date().toISOString().split("T")[0];
                    break;
                default:
                    return res.status(400).json({ error: "Invalid filter value." });
            }
        }

        // If a date range is specified, append it to the API URL
        if (startDate && endDate) {
            const formatDate = (date) => {
                const [year, month, day] = date.split("-");
                return `${day}-${month}-${year}`;
            };
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);
            apiUrl += `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
        }

        console.log("API URL:", apiUrl); // Debugging log
        const response = await axios.get(apiUrl);

        if (!response.data || response.data.length === 0) {
            return res.status(404).json({ error: "No data found." });
        }

        const transformedData = transformPatientData(response.data);
        res.json({ patients: transformedData });
    } catch (error) {
        console.error("Error fetching patient data:", error.message);
        res.status(500).json({ error: "Failed to fetch data from the external API." });
    }
});

// Serve React build files in production
const buildPath = path.join(__dirname, "..", "build");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});

// Fallback route for unmatched endpoints
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found." });
});

// Start the server
require("dotenv").config();
const PORT = process.env.REACT_APP_SERVER_PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
