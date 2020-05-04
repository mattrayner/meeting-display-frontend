import React from "react";

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: this.currentTime()
        };
    }

    checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

    currentTime() {
        let today = new Date(),
            h = this.checkTime(today.getHours()),
            m = this.checkTime(today.getMinutes());

        return h + ":" + m;
    }

    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    tick() {
        this.setState({
            time: this.currentTime()
        });
    }
    render() {
        return (
            <span className="clock">
          {this.state.time}
        </span>
        );
    }
}

export default Clock;
