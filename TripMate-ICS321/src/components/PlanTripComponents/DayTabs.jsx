function DayTabs({ numDays, activeDay, setActiveDay, onAddDay, onRemoveDay }) {

    const days = Array.from({ length: numDays }, (_, i) => i + 1);

    return (
        <div className="day-tabs-wrapper">

            <div className="day-tabs">
                {days.map((day) => (
                    <div key={day} className="day-tabs__item">


                        {/* ✕ button on each tab — only show if more than 1 day */}
                        {numDays > 1 && (
                            <button
                                className="day-tabs__remove"
                                onClick={() => onRemoveDay(day)}  // pass WHICH day to remove
                                title={`Remove Day ${day}`}
                            >
                                ✕
                            </button>
                        )}

                        {/* Day button */}
                        <button
                            className={`day-tabs__btn ${activeDay === day ? "day-tabs__btn--active" : ""}`}
                            onClick={() => setActiveDay(day)}
                        >
                            Day {day}
                        </button>

                    </div>
                ))}
            </div>

            {/* + Day button */}
            <button
                className="day-tabs__control-btn day-tabs__control-btn--add"
                onClick={onAddDay}
                disabled={numDays === 12}  // max 12 days
                title="Add a day"
            >
                + Day
            </button>

        </div>
    );
}

export default DayTabs;