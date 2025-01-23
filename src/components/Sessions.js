import React from "react";

const Sessions = ({ sessionData }) => {
    if (!sessionData || sessionData.numberOfSessions === 0) {
        return <p>No session data available.</p>;
    }

    // Safely extract session and game details
    const sessions = Array.from({ length: sessionData.numberOfSessions }).map(
        (_, index) => ({
            sessionId: index + 1, // Session ID (incremental)
            games: sessionData.gamesList[index] || [], // Games played in the session (as an array)
        })
    );

    if (!sessions || sessions.length === 0) {
        return <p>No session data available.</p>;
    }

    return (
        <div>
            <h3 className="mt-4" style={{ color: "white" }}>SESSION DETAILS</h3>
            <p>
                <strong>Total Sessions:</strong> {sessions.length}
            </p>
            <table className="table table-bordered mt-3 session-details-table">
                <thead>
                    <tr>
                        <th>Session No.</th>
                        <th>Total Games Played</th>
                        <th>Games Played</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session, index) => (
                        <tr key={index}>
                            <td>{session.sessionId}</td>
                            <td>{session.games.length}</td> {/* Correctly counts total games */}
                            <td>{session.games.join(", ")}</td> {/* Displays game names */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Sessions;
