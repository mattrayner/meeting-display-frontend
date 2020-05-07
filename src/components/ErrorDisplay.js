import React from "react";
import { ReactComponent as ErrorIcon } from '../error-cross.svg';

class ErrorDisplay extends React.Component {
    render() {
        let className="error " + (this.props.show ? "error-show" : "error-hide")

        return (
            <div className={className} onClick={this.props.onClick}>
                <i><ErrorIcon /></i> There was a problem updating the calendar. <strong>Tap to retry</strong>
            </div>
        );
    }
}

export default ErrorDisplay;
