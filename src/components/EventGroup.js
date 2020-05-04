import React from "react";
import EventItems from './EventItems.js'

class EventGroup extends React.Component {
    getYMD(date) {
        return `${this.checkTime(date.getFullYear())}${this.checkTime(date.getMonth())}${this.checkTime(date.getDate())}`
    }

    checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

    yMDToDate(ymd) {
        let year = parseInt(ymd.substr(0, 4))
        let month = parseInt(ymd.substr(4, 2))
        let day = parseInt(ymd.substr(6))

        return new Date(year, month, day, 0, 0, 0, 0)
    }

    render() {
        let objects = []

        const todayDate = new Date(Date.now())
        const tomorrowDate = new Date(todayDate.getTime())
        tomorrowDate.setDate(todayDate.getDate() + 1)
        const thisWeek = new Date(todayDate.getTime())
        thisWeek.setDate(todayDate.getDate() + 7)
        thisWeek.setHours(0)
        thisWeek.setMinutes(0)
        thisWeek.setSeconds(0)
        thisWeek.setMilliseconds(0)

        const todayYMD = this.getYMD(todayDate)
        const tomorrowYMD = this.getYMD(tomorrowDate)

        let name = this.props.name

        if (name === tomorrowYMD) {
            objects.push(<h3 key="Tomorrow">Tomorrow</h3>)
        } else if(name !== todayYMD) {
            let date = this.yMDToDate(name)
            let groupName;

            if (date.getTime() < thisWeek.getTime()) {
                const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                groupName = daysOfWeek[date.getDay()]
            } else {
                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

                const nth = function(d) {
                    if (d > 3 && d < 21) return 'th';
                    switch (d % 10) {
                        case 1:  return "st";
                        case 2:  return "nd";
                        case 3:  return "rd";
                        default: return "th";
                    }
                }

                groupName = `${date.getDate()}${nth(date.getDate())} ${months[date.getMonth()]}`;
            }

            objects.push(<h3 key={groupName}>{groupName}</h3>)
        }

        const events = this.props.events
        objects.push(<EventItems key={name+'Events'} events={events}></EventItems>)

        return (
            <div>
                {objects}
            </div>
        )
    }
}

export default EventGroup
