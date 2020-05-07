import React from "react";
import Clock from './Clock';

class MeetingStatus extends React.Component {
    render() {
        let statusClass = "status status-"+this.props.status.toLowerCase()

        return (
            <div onClick={this.props.onClick}>
                <header className="meeting-status" onClick={this.props.onClick}>
                    <div className={statusClass}></div>
                    <h1>{this.props.status}</h1>
                    <p>{this.props.summary}</p>
                    <h2><Clock></Clock></h2>
                </header>
            </div>
        )
    }
}

export default MeetingStatus;