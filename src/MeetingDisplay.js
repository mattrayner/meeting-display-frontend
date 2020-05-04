import React from 'react';
import './MeetingDisplay.css';
import MeetingStatus from './components/MeetingStatus.js';
import MeetingList from './components/MeetingList.js'

class MeetingDisplay extends React.Component {
    backendUrl = "http://localhost:4567";
    tickRate = 10000
    timerID = null

    constructor(props) {
        super(props);

        this.state = {
            status: "Updating",
            summary: "Please wait...",
            eventsList: {}
        }
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), this.tickRate)
        this.tick()
    }

    componentWillUnmount() {
        this.timerID = null
    }

    async tick() {
        const response = await fetch(this.backendUrl);
        const data = await response.json();

        const events = data["events"];

        let now = Date.now();
        const currentEvent = events.find((event) => {
            let start_date = Date.parse(event.start);
            let end_date = Date.parse(event.end);

            return (start_date < now && end_date > now)
        })
        const nextEvent = events.find((event) => {
            let start_date = Date.parse(event.start);

            return start_date > now
        })
        const status = (currentEvent == null) ? 'Available' : 'Busy'
        const summary = this.generateSummary(status, nextEvent);
        const eventsList = this.generateEventsList(events);

        this.setState({
            status: status,
            summary: summary,
            eventsList: eventsList
        })
    }

    generateSummary(status, nextEvent) {
        if(nextEvent == null)
            return ""

        let summaryString = (status === 'Available') ? 'Next meeting ' : 'Next free '

        const now = new Date(Date.now())
        const tomorrowDate = new Date(now.getTime())
        tomorrowDate.setDate(now.getDate() + 1)
        const eventDate = new Date(Date.parse(nextEvent.start))
        const eventToday = this.datesAreOnSameDay(now, eventDate)
        const eventTomorrow = this.datesAreOnSameDay(tomorrowDate, eventDate)
        const eventTime = `${this.checkTime(eventDate.getHours())}:${this.checkTime(eventDate.getMinutes())}`

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const eventDay = daysOfWeek[eventDate.getDay()]

        if(eventTomorrow)
            summaryString += 'tomorrow '

        if(!eventToday && !eventTomorrow)
            summaryString += `on ${eventDay} `

        summaryString += `at ${eventTime}`

        return summaryString
    }

    datesAreOnSameDay = (first, second) =>
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();

    generateEventsList(events) {
        const todayDate = new Date(Date.now())
        const tomorrowDate = new Date(todayDate.getTime())
        tomorrowDate.setDate(todayDate.getDate() + 1)

        let struct = {
        }

        events.forEach((event) => {
            const eventStartDate = new Date(Date.parse(event.start))
            const eventEndDate = new Date(Date.parse(event.end))
            const ymd = this.getYMD(eventStartDate)

            const timeString = `${this.checkTime(eventStartDate.getHours())}:${this.checkTime(eventStartDate.getMinutes())} - ${this.checkTime(eventEndDate.getHours())}:${this.checkTime(eventEndDate.getMinutes())}`
            const eventObject = { time: timeString, summary: event.summary }

            struct[ymd] = struct[ymd] || []

            struct[ymd].push(eventObject)
        })

        return struct
    }

    getYMD(date) {
        return `${this.checkTime(date.getFullYear())}${this.checkTime(date.getMonth())}${this.checkTime(date.getDate())}`
    }

    checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

    render() {
        return (
            <div id="App">
                <MeetingStatus status={this.state.status} summary={this.state.summary}></MeetingStatus>
                <MeetingList list={this.state.eventsList}></MeetingList>
            </div>
        )
    }
}

export default MeetingDisplay;
