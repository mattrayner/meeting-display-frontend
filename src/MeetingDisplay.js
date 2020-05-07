import React from 'react';
import './MeetingDisplay.css';
import MeetingStatus from './components/MeetingStatus.js';
import MeetingList from './components/MeetingList.js';
import ErrorDisplay from './components/ErrorDisplay.js';
import { ReactComponent as PlusIcon } from './plus.svg';
import { ReactComponent as MinusIcon } from './minus.svg';
import { ReactComponent as SunIcon } from './sun.svg';
import { ReactComponent as UpIcon } from './up.svg';
import { ReactComponent as AlertIcon } from './alert.svg';

class MeetingDisplay extends React.Component {
    backendUrl = "http://localhost:4567";
    brightnessUrl = `${this.backendUrl}/brightness`;
    brightnessUpUrl = `${this.brightnessUrl}/up`;
    brightnessDownUrl = `${this.brightnessUrl}/down`;
    brightnessOffUrl = `${this.brightnessUrl}/off`;
    brightnessPingUrl = `${this.brightnessUrl}/ping`;
    brightnessPingTimeout = 10000;
    tickRate = 60000;
    timerID = null;
    pingTimerID = null;

    constructor(props) {
        super(props);

        this.state = {
            status: "Updating",
            summary: "Please wait...",
            eventsList: {},
            error: false,
            brightness: 0,
            brightnessError: false,
            backlightOn: false,
            showDrawer: false
        }
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), this.tickRate)
        this.tick()
        this.updateBrightness()
    }

    componentWillUnmount() {
        this.timerID = null
    }

    async async_fetch(url) {
        let response = await fetch(url)
        if (response.ok) return await response.json()
        throw new Error(response.status)
    }


    async tick() {
        let data;
        try {
            data = await this.async_fetch(this.backendUrl)
        } catch (error) {
            console.log('Error thrown whilst calling `async_fetch`. Displaying error message')

            this.setState({ error: true })
            return
        }

        this.setState({ error: false })


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
        const nextGap = this.findTimeGapsFor(events).find((section) => {
            let start_date = section.start

            return start_date > now
        })
        const status = (currentEvent == null) ? 'Available' : 'Busy'
        const summary = this.generateSummary(status, nextEvent, nextGap);
        const eventsList = this.generateEventsList(events);

        this.setState({
            status: status,
            summary: summary,
            eventsList: eventsList,
            error: false
        })
    }

    findTimeGapsFor(events) {
        let gaps = []

        events.forEach((event, i) => {
            if(i === 0)
                return

            const eventStartTime = Date.parse(event.start)
            const eventStartimeWithTolerance = eventStartTime - 10

            const previousEvent = events[i-1]
            const previousEventEndTime = Date.parse(previousEvent.end)
            if(eventStartimeWithTolerance > previousEventEndTime) { // No overlap with previous event i.e. a gap we need to handle
                let start = previousEventEndTime + 1
                let end = eventStartTime - 1
                gaps.push({ start: start, end: end })
            }
        });

        return gaps
    }

    async refresh() {
        await this.tick();
    }

    generateSummary(status, nextEvent, nextGap) {
        if(nextGap == null)
            return ""

        const available = status === 'Available'
        let summaryString = available ? 'Next meeting ' : 'Next free '

        const now = new Date(Date.now())
        const tomorrowDate = new Date(now.getTime())
        tomorrowDate.setDate(now.getDate() + 1)

        const eventDate = new Date(Date.parse(nextEvent.start))
        const eventToday = this.datesAreOnSameDay(now, eventDate)
        const eventTomorrow = this.datesAreOnSameDay(tomorrowDate, eventDate)
        const eventTime = `${this.checkTime(eventDate.getHours())}:${this.checkTime(eventDate.getMinutes())}`

        const gapDate = new Date(nextGap.start)
        const gapToday = this.datesAreOnSameDay(now, gapDate)
        const gapTomorrow = this.datesAreOnSameDay(tomorrowDate, gapDate)
        const gapTime = `${this.checkTime(gapDate.getHours())}:${this.checkTime(gapDate.getMinutes())}`

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const eventDay = daysOfWeek[eventDate.getDay()]
        const gapDay = daysOfWeek[gapDate.getDay()]

        let target_tomorrow = eventTomorrow
        let target_today = eventToday
        let target_day = eventDay
        let target_time= eventTime

        if(!available) {
            target_tomorrow = gapTomorrow
            target_today = gapToday
            target_day = gapDay
            target_time = gapTime
        }

        if(target_tomorrow)
            summaryString += 'tomorrow '

        if(!target_today && !target_tomorrow)
            summaryString += `on ${target_day} `

        summaryString += `at ${target_time}`

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

    async updateBrightness() {
        let data;
        try {
            data = await this.async_fetch(this.brightnessUrl)
        } catch (error) {
            console.log('Error thrown whilst calling `async_fetch` to get brightness data.')

            this.setState({ brightnessError: true })
            return
        }

        if(data["error"]) {
            console.error('Brightness api returned error:')
            console.error(data)
            this.setState({ brightnessError: true })
            return
        }

        this.setState({ brightnessError: false, brightness: data["brightness"], backlightOn: data["backlight_on"] })
    }

    async lowerBrightness() {
        let data;
        try {
            data = await this.async_fetch(this.brightnessDownUrl)
        } catch (error) {
            console.log('Error thrown whilst calling `async_fetch` to lower brightness.')

            this.setState({brightnessError: true})
            return
        }

        if (data["error"]) {
            console.error('Brightness api returned error:')
            console.error(data)
            this.setState({brightnessError: true})
            return
        }

        this.setState({brightnessError: false, brightness: data["brightness"], backlightOn: data["backlight_on"]})

        if (!this.state.backlightOn)
            await this.closeDrawer(false)
    }

    async increaseBrightness() {
        let data;
        try {
            data = await this.async_fetch(this.brightnessUpUrl)
        } catch (error) {
            console.log('Error thrown whilst calling `async_fetch` to lower brightness.')

            this.setState({ brightnessError: true })
            return
        }

        if(data["error"]) {
            console.error('Brightness api returned error:')
            console.error(data)
            this.setState({ brightnessError: true })
            return
        }

        this.setState({ brightnessError: false, brightness: data["brightness"], backlightOn: data["backlight_on"] })
    }

    async openDrawer() {
        await this.pingBrightness()
        this.setState({showDrawer: true})
    }

    async closeDrawer(ping = true) {
        if(ping)
            await this.pingBrightness()

        this.setState({showDrawer: false})
    }

    async pingBrightness() {
        await this.updateBrightness()

        if(this.pingTimerID)
            clearTimeout(this.pingTimerID)

        let data;
        try {
            data = await this.async_fetch(this.brightnessPingUrl)
        } catch (error) {
            console.log('Error thrown whilst calling `async_fetch` to lower brightness.')

            this.setState({ brightnessError: true })
            return
        }

        if(data["error"]) {
            console.error('Brightness api returned error:')
            console.error(data)
            this.setState({ brightnessError: true })
            return
        }

        if(!this.state.backlightOn && data["backlight_on"]) {
            this.pingTimerID = setTimeout(async () => {
                this.brightnessOffUrl = null
                await this.screenOff()
                await this.closeDrawer()
            }, this.brightnessPingTimeout);
        }

        this.setState({ brightnessError: false, brightness: data["brightness"], backlightOn: data["backlight_on"] })
    }

    async screenOff () {
        let data;
        try {
            data = await this.async_fetch(this.brightnessOffUrl)
        } catch (error) {
            console.log('Error thrown whilst calling `async_fetch` to turn off screen.')

            this.setState({ brightnessError: true })
            return
        }

        if(data["error"]) {
            console.error('Brightness api returned error:')
            console.error(data)
            this.setState({ brightnessError: true })
            return
        }

        this.setState({ brightnessError: false, brightness: data["brightness"], backlightOn: data["backlight_on"] })
    }

    render() {
        const progressBarStyle = {width: `${this.state.brightness}%`}
        const drawerVisibility = this.state.showDrawer ? "show" : "hide"
        const pingOverlayVisibility = this.state.backlightOn ? "hide" : "show"
        const drawerClass = `drawer drawer-${drawerVisibility}`
        const overlayClass = `overlay overlay-${drawerVisibility}`
        const pingOverlayClass = `ping-overlay ping-overlay-${pingOverlayVisibility}`

        return (
            <div id="App">
                <MeetingStatus status={this.state.status} summary={this.state.summary} onClick={() => this.openDrawer()}></MeetingStatus>
                <MeetingList list={this.state.eventsList} onClick={() => this.pingBrightness()}>></MeetingList>
                <ErrorDisplay show={this.state.error} onClick={() => this.refresh()}></ErrorDisplay>
                <div className={drawerClass}>
                    <div className="header" onClick={() => this.closeDrawer()}>
                        <i><SunIcon /></i>
                        <span>Adjust brightness</span>
                    </div>
                    <div className="body">
                        <i className="minus" onClick={() => this.lowerBrightness()}>
                            <MinusIcon></MinusIcon>
                        </i>

                        <div className="progress-bar">
                            <div className="progress" style={progressBarStyle}></div>
                        </div>

                        <i className="plus" onClick={() => this.increaseBrightness()}>
                            <PlusIcon></PlusIcon>
                        </i>
                    </div>
                    <div className="footer" onClick={() => this.closeDrawer()}>
                        <i><UpIcon></UpIcon></i>
                    </div>
                </div>
                <div className={overlayClass} onClick={() => this.closeDrawer()}></div>
                <div className={pingOverlayClass} onClick={() => this.pingBrightness()}></div>
                <BrightnessError show={this.state.brightnessError} />
            </div>
        )
    }
}

class BrightnessError extends React.Component {
    state = { brightnessError: false };
    timeout = 5000;

    componentWillUnmount() {
        this.clearTimer()
    }

    showError = () => {
        this.clearTimer()
        this.setState({ brightnessError: true });
        this.createTimer()
    }

    componentDidUpdate(prevProps, prevState) {
        const previouslyHidden = (prevProps.show === false)
        const currentlyShown = this.props.show
        if (previouslyHidden && currentlyShown)
            this.showError();

        if(!previouslyHidden && currentlyShown) {
            this.clearTimer()
            this.createTimer()
        }
    }

    clearTimer() {
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
        }
    }

    createTimer() {
        this.hideTimer = setTimeout(() => {
            this.setState({ brightnessError: false });
            this.hideTimer = null;
        }, this.timeout);
    }

    render() {
        const brightnessErrorVisibility = this.state.brightnessError ? "show" : "hide"
        const brightnessErrorClass = `brightness-error brightness-error-${brightnessErrorVisibility}`

        return (
            <div className={brightnessErrorClass}><i><AlertIcon></AlertIcon></i>Error updating brightness</div>
        )
    }
}

export default MeetingDisplay;
