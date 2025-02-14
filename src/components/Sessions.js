import React from "react";

const Sessions = ({ sessionData }) => {
    if (!sessionData || sessionData.numberOfSessions === 0) {
        return <p>No session data available.</p>;
    }

    return (
        <div>
            <h3 className="mt-4" style={{ color: "white" }}>SESSION DETAILS</h3>
            <p>
                <strong>Total Sessions:</strong> {sessionData.numberOfSessions}
            </p>
            <table className="table table-bordered mt-3 session-details-table">
                <thead>
                    <tr>
                        <th>Session Number</th>
                        <th>Time</th>
                        <th>Games Assigned</th>
                        <th>Completed Games</th>
                        <th>Incomplete Games</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {sessionData.gamesList.map((session, sessionIndex) => (
                        session.map((subSession, subIndex) => (
                            <tr key={`${sessionIndex}-${subIndex}`}>
                                {/* Display session number only for the first sub-session of each session */}
                                {subIndex === 0 ? (
                                    <td rowSpan={session.length}>{sessionIndex + 1}</td>
                                ) : null}
                                <td>{subSession.sessionTime}</td>
                                <td>
                                    {subSession.allGames.length > 0 ? (
                                        <ol>
                                            {subSession.allGames.map((game, index) => (
                                                <li key={index}>{game}</li>
                                            ))}
                                        </ol>
                                    ) : "-"}
                                </td>
                                <td>
                                    {subSession.completedGames.length > 0 ? (
                                        <ol>
                                            {subSession.completedGames.map((game, index) => (
                                                <li key={index}>{game}</li>
                                            ))}
                                        </ol>
                                    ) : "-"}
                                </td>
                                <td>
                                    {subSession.incompleteGames.length > 0 ? (
                                        <ol>
                                            {subSession.incompleteGames.map((game, index) => (
                                                <li key={index}>{game}</li>
                                            ))}
                                        </ol>
                                    ) : "-"}
                                </td>
                                <td>{subSession.gamesDuration} {subSession.gamesDuration > 1 ? "Mins" : "Min"}</td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Sessions;
