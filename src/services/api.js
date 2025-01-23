import axios from "axios";

const API_URL = "http://localhost:5002/api/patients";

export const fetchPatients = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
