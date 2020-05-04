import React from "react";
import Clock from './Clock';

class MeetingStatus extends React.Component {
    render() {
        let statusClass = "status status-"+this.props.status.toLowerCase()

        return (
            <header className="meeting-status">
                <div className={statusClass}></div>
                <h1>{this.props.status}</h1>
                <p>{this.props.summary}</p>
                <h2><Clock></Clock></h2>
            </header>
        )
    }
}

export default MeetingStatus;