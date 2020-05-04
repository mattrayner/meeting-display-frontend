import React from "react";
import EventGroup from './EventGroup.js';

class MeetingList extends React.Component {
    render() {
        let objects = []

        let list = this.props.list
        if (list) {
            let groupNames = Object.keys(this.props.list)
            groupNames.forEach((groupName) => {
                objects.push(<EventGroup key={groupName} name={groupName} events={this.props.list[groupName]}></EventGroup>)
            })
        }

        return (
            <section id="timeline">
                {objects}
            </section>
        )
    }
}

export default MeetingList
