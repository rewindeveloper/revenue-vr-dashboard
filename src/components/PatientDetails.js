import React, { useEffect, useState } from "react";
import Sessions from "./Sessions";

const PatientDetails = ({ data }) => {
    const [patientData, setPatientData] = useState(null);

    useEffect(() => {
        if (data) {
            // Directly use the passed `data` as patient details
            setPatientData(data);
        }
    }, [data]);

    if (!patientData) return <p>Loading...</p>;

    const { date, patientName, therapistEmail, clinicName, condition, sessionData } = patientData;

    return (
        <div>
            <p>
                <strong>Date:</strong> {date}
            </p>
            <p>
                <strong>Patient Name:</strong> {patientName}
            </p>
            <p>
                <strong>Therapist Email:</strong> {therapistEmail}
            </p>
            <p>
                <strong>Clinic Name:</strong> {clinicName}
            </p>
            <p>
                <strong>Condition:</strong> {condition}
            </p>

            {/* Use the Sessions component and pass sessionData */}
            <Sessions sessionData={sessionData} />
        </div>
    );
};

export default PatientDetails;
