import React from "react";
import "../styles.css";

const PatientList = ({ patientData, onPatientSelect }) => {
    if (!patientData || patientData.length === 0) {
        return <p>No patient data available.</p>;
    }

    return (
        <div>
            <h3 className="mt-4" style={{ color: "white" }}>Patient List</h3>
            <table className="table table-bordered mt-3 patient-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Patient Name</th>
                        <th>Clinic Name</th>
                        <th>Condition</th>
                    </tr>
                </thead>
                <tbody>
                    {patientData.map((patient, index) => (
                        <tr
                            key={index}
                            onClick={() => onPatientSelect(patient)}
                            style={{ cursor: "pointer" }}
                        >
                            <td>{patient.date}</td>
                            <td>{patient.patientName}</td>
                            <td>{patient.clinicName}</td>
                            <td>{patient.condition === "Stroke" ? "Neuro" : patient.condition}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientList;
