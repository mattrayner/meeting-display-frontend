import React from "react";

class EventItems extends React.Component {
    render() {
        let listItems = []

        this.props.events.forEach((eventObject) => {
            listItems.push(<li key={eventObject.time + Math.random()}><span>{eventObject.time}</span>{eventObject.summary}</li>)
        })

        return (
            <ul>
                {listItems}
            </ul>
        )
    }
}

export default EventItems
