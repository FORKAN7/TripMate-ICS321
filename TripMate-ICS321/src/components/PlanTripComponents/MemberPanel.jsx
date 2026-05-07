import { useState } from "react";

function MemberPanel({ members, onAdd, onRemove, tripName }) {

    const [emailInput, setEmailInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleAdd = async () => {
        if (!emailInput || !nameInput) {
            setError("Please enter both name and email.");
            setSuccessMsg("");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
            setError("Please enter a valid email address.");
            setSuccessMsg("");
            return;
        }

        const alreadyAdded = members.some((m) => m.email === emailInput);
        if (alreadyAdded) {
            setError("This member is already in the trip.");
            setSuccessMsg("");
            return;
        }

        const result = await onAdd({ name: nameInput, email: emailInput });

        if (result === false) {
            setError("No account found with this email.");
            setSuccessMsg("");
            return;
        }
        if (result === "self") {
            setError("You can't add yourself to the trip.");
            setSuccessMsg("");
            return;
        }

        setSuccessMsg(`${nameInput} has been notified: "You have been added to ${tripName || "the"} trip!"`);
        setError("");
        setEmailInput("");
        setNameInput("");
    };

    const handleRemoveClick = (member) => {
        onRemove(member.id);
        setSuccessMsg(`${member.name} has been deleted from ${tripName || "the"} trip.`);
        setError("");
    };

    return (
        <div className="member-panel">

            <h2 className="member-panel__title">
                👥 Trip Members ({members.length})
            </h2>

            <ul className="member-panel__list">
                {members.map((member) => (
                    <li key={member.id} className="member-panel__item">

                        <div className="member-panel__avatar">
                            {member.name.charAt(0)}
                        </div>

                        <div className="member-panel__info">
                            <span className="member-panel__name">{member.name}</span>
                            <span className="member-panel__role">{member.role}</span>
                        </div>

                        {member.role === "Organizer" ? (
                            <span className="member-panel__crown">👑</span>
                        ) : (
                            <button
                                className="member-panel__remove"
                                onClick={() => handleRemoveClick(member)}
                            >
                                ✕
                            </button>
                        )}

                    </li>
                ))}
            </ul>

            <hr className="member-panel__divider" />

            <div className="member-panel__add">
                <p className="member-panel__add-title">Add Member</p>

                <input
                    className="member-panel__input"
                    type="text"
                    placeholder="Full name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                />

                <input
                    className="member-panel__input"
                    type="email"
                    placeholder="Email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                />

                {error && <p className="member-panel__error">{error}</p>}
                {successMsg && <p className="member-panel__success">{successMsg}</p>}

                <button className="member-panel__add-btn" onClick={handleAdd}>
                    + Add Member
                </button>
            </div>

        </div>
    );
}

export default MemberPanel;