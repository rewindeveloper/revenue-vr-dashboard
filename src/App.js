import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import DateFilter from "./components/datefilter";
import PatientList from "./components/PatientList";
import PatientDetails from "./components/PatientDetails";
import Login from "./components/Login";
import "./styles.css";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [filter, setFilter] = useState("All");
    const [totalUniquePatients, setTotalUniquePatients] = useState(0);
    const [totalUniqueClinics, setTotalUniqueClinics] = useState(0);
    const [customDate, setCustomDate] = useState(null);
    const [clinicFilter, setClinicFilter] = useState("All");
    const [therapistFilter, setTherapistFilter] = useState("All");
    const [patientFilter, setPatientFilter] = useState("All");
    const [clinics, setClinics] = useState([]);
    const [therapists, setTherapists] = useState([]);
    const [patientNames, setPatientNames] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setPatients([]);
        setSelectedPatient(null);
        setTotalUniquePatients(0);
        setTotalUniqueClinics(0);
        setClinicFilter("All");
        setTherapistFilter("All");
        setPatientFilter("All");
        setClinics([]);
        setTherapists([]);
        setPatientNames([]);
        localStorage.removeItem("isLoggedIn");
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCustomDate(null);
        setSelectedPatient(null);
    };

    const handleCustomDateChange = (selectedDate) => {
        setFilter("Custom");
        setCustomDate(selectedDate);
        setSelectedPatient(null);
    };

    const handleClinicChange = (selectedClinic) => {
        setClinicFilter(selectedClinic);
        setTherapistFilter("All"); // Reset therapist filter
        setPatientFilter("All"); // Reset patient filter
    };
    
    const handleTherapistChange = (selectedTherapist) => {
        setTherapistFilter(selectedTherapist);
        setPatientFilter("All"); // Reset patient filter
    };
    
    const handlePatientChange = (selectedPatientName) => {
        setPatientFilter(selectedPatientName);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                let apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/patients`;

                if (customDate) {
                    apiUrl += `?customDate=${customDate}`;
                } else if (filter && filter !== "All") {
                    apiUrl += `?filter=${filter}`;
                }

                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.patients && data.patients.length > 0) {
                    const patientList = data.patients.map((patient) => ({
                        ...patient,
                        sessions: patient.sessionData.gamesList.map((games, index) => ({
                            sessionNumber: index + 1,
                            games: games.join(", "),
                        })),
                    }));

                    const uniqueClinics = [
                        "All",
                        ...new Set(patientList.map((patient) => patient.clinicName)),
                    ];
                    const uniqueTherapists = [
                        "All",
                        ...new Set(patientList.map((patient) => patient.therapistEmail)),
                    ];
                    const uniquePatientNames = [
                        "All",
                        ...new Set(patientList.map((patient) => patient.patientName)),
                    ];

                    setPatients(patientList);
                    setClinics(uniqueClinics);
                    setTherapists(uniqueTherapists);
                    setPatientNames(uniquePatientNames);
                    setTotalUniquePatients(patientList.length || 0);
                    setTotalUniqueClinics(uniqueClinics.length - 1 || 0);
                } else {
                    setPatients([]);
                    setClinics([]);
                    setTherapists([]);
                    setPatientNames([]);
                    setTotalUniquePatients(0);
                    setTotalUniqueClinics(0);
                }
            } catch (error) {
                console.error("Error fetching patient data:", error);
                setPatients([]);
                setClinics([]);
                setTherapists([]);
                setPatientNames([]);
                setTotalUniquePatients(0);
                setTotalUniqueClinics(0);
            }
        };

        if (isLoggedIn) {
            fetchData();
        }
    }, [filter, customDate, isLoggedIn]);

    const filteredPatients = patients
    .filter((patient) => {
        const clinicMatch = clinicFilter === "All" || patient.clinicName === clinicFilter;
        const therapistMatch =
            therapistFilter === "All" || patient.therapistEmail === therapistFilter;
        const patientMatch =
            patientFilter === "All" || patient.patientName === patientFilter;
        return clinicMatch && therapistMatch && patientMatch;
    })
    .map((patient) => ({
        ...patient,
        condition: patient.condition === "Stroke" ? "Neuro" : patient.condition,
    }));

    const filteredTherapists = patients
    .filter((patient) => {
        // Filter based on selected clinic
        return clinicFilter === "All" || patient.clinicName === clinicFilter;
    })
    .map((patient) => patient.therapistEmail);

    const filteredPatientNames = patients
    .filter((patient) => {
        // Filter based on selected clinic and therapist
        const clinicMatch = clinicFilter === "All" || patient.clinicName === clinicFilter;
        const therapistMatch =
            therapistFilter === "All" || patient.therapistEmail === therapistFilter;
        return clinicMatch && therapistMatch;
    })
    .map((patient) => patient.patientName);


    const filteredClinics = [
        ...new Set(filteredPatients.map((patient) => patient.clinicName)),
    ];

    const totalSessions = filteredPatients.reduce(
        (total, patient) => total + patient.sessionData.numberOfSessions,
        0
    );
    const totalNeuroPatients = filteredPatients.filter(
        (patient) => patient.condition === "Neuro"
    ).length;
    const totalCardioPatients = filteredPatients.filter(
        (patient) => patient.condition === "Cardio"
    ).length;
    const totalOrthoPatients = filteredPatients.filter(
        (patient) => patient.condition === "Ortho"
    ).length;

    const totalEntries = filteredPatients.length;
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredPatients.slice(
        indexOfFirstEntry,
        indexOfLastEntry
    );

    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const downloadCSV = () => {
        const timestamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15);
        const csvContent = [
            [
                "Date",
                "Patient Name",
                "Therapist Email",
                "Clinic Name",
                "Condition",
                "Total Sessions",
                "Session Number",
                "Games Played",
            ],
            ...filteredPatients.flatMap((patient) =>
                patient.sessions.map((session) => [
                    patient.date,
                    patient.patientName,
                    patient.therapistEmail,
                    patient.clinicName,
                    patient.condition === "Stroke" ? "Neuro" : patient.condition, // Replace Stroke with Neuro
                    patient.sessionData.numberOfSessions,
                    session.sessionNumber,
                    session.games,
                ])
            ),
        ]
            .map((row) => row.join(","))
            .join("\n");
    
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Filtered_Data_${timestamp}.csv`;
        link.click();
    };
    const uniqueTherapists = ["All", ...new Set(filteredTherapists)];
    const uniquePatientNames = ["All", ...new Set(filteredPatientNames)];
    

    return (
        <div>
            {isLoggedIn ? (
                <>
                    <Header onLogout={handleLogout} onDownloadCSV={downloadCSV} />
                    <div className="main-content">
                        <div className="date-filter-container">
                            <DateFilter
                                onFilterChange={handleFilterChange}
                                onCustomDateChange={handleCustomDateChange}
                            />
                            <div className="filter-container">
                                <label className="filter-label">Clinic</label>
                                <select
                                    className="filter-dropdown"
                                    value={clinicFilter}
                                    onChange={(e) => handleClinicChange(e.target.value)}
                                >
                                    {clinics.length > 0 ? (
                                        clinics.map((clinic, index) => (
                                            <option key={index} value={clinic}>
                                                {clinic}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="None">None</option>
                                    )}
                                </select>
                            </div>
                            <div className="filter-container">
                                <label className="filter-label">Therapist</label>
                                <select
                                    className="filter-dropdown"
                                    value={therapistFilter}
                                    onChange={(e) => handleTherapistChange(e.target.value)}
                                >
                                    {uniqueTherapists.map((therapist, index) => (
                <option key={index} value={therapist}>
                    {therapist}
                </option>
            ))}
                                </select>
                            </div>
                            <div className="filter-container">
                                <label className="filter-label">Patient</label>
                                <select
                                    className="filter-dropdown"
                                    value={patientFilter}
                                    onChange={(e) => handlePatientChange(e.target.value)}
                                >
                                    {uniquePatientNames.map((patientName, index) => (
                <option key={index} value={patientName}>
                    {patientName}
                </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="patient-tile-container">
                            <div className="clinic-tile">
                                <h3>{filteredClinics.length}</h3>
                                <p>Total Clinics Utilised</p>
                            </div>
                            <div className="patient-tile">
                                <h3>{filteredPatients.length}</h3>
                                <p>Total Patients Utilised</p>
                            </div>
                            <div className="sessions-tile">
                                <h3>{totalSessions}</h3>
                                <p>Total Sessions Utilised</p>
                            </div>
                        </div>
                        <div className="condition-tile-container">
                            <div className="neuro-tile">
                                <h3>{totalNeuroPatients}</h3>
                                <p>Total Neuro Patients</p>
                            </div>
                            <div className="neuro-tile">
                                <h3>{totalCardioPatients}</h3>
                                <p>Total Cardio Patients</p>
                            </div>
                            <div className="neuro-tile">
                                <h3>{totalOrthoPatients}</h3>
                                <p>Total Ortho Patients</p>
                            </div>
                        </div>
                        <div className="container">
                            {!selectedPatient ? (
                                <>
                                    <PatientList
                                        patientData={currentEntries}
                                        onPatientSelect={(patient) =>
                                            setSelectedPatient(patient)
                                        }
                                    />
                                    <div className="pagination">
                                        <p>
                                            Showing {indexOfFirstEntry + 1}-
                                            {Math.min(indexOfLastEntry, totalEntries)} of{" "}
                                            {totalEntries} entries
                                        </p>
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => handlePageChange(index + 1)}
                                                className={
                                                    currentPage === index + 1
                                                        ? "pagination-button active"
                                                        : "pagination-button"
                                                }
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <section id="patients">
                                        <h3 style={{ color: "white" }}>PATIENT DETAILS</h3>
                                        <PatientDetails data={selectedPatient} />
                                    </section>
                                    <div className="back-button-container">
                                        <button
                                            className="back-button"
                                            onClick={() => setSelectedPatient(null)}
                                        >
                                            Back to Patient List
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default App;
