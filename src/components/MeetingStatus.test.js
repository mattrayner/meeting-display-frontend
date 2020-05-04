import React from 'react';
import { render } from '@testing-library/react';
import MeetingStatus from './MeetingStatus';

test('renders meeting status as expected', () => {
    const { container, getByText } = render(<MeetingStatus status="TEST-STATUS" summary="Next event on Monday" />);
    // const statusClass = getByText(/class="status status-test-status"/i);
    const statusClass = container.firstChild.firstChild.className
    const statusText = getByText(RegExp('TEST-STATUS', "g"));
    const summaryText = getByText(RegExp('Next event on Monday', "g"));

    const clockSpanText = container.textContent
    const clockStrings = clockSpanText.match(/\d\d:\d\d/g);
    expect(statusClass).toEqual('status status-test-status');
    expect(statusText).toBeInTheDocument();
    expect(summaryText).toBeInTheDocument();
    expect(clockStrings.length).toEqual(1);
});
