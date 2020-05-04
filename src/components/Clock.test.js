import React from 'react';
import { render } from '@testing-library/react';
import Clock from './Clock';

test('renders clock as expected', () => {
    const { getByText } = render(<Clock />);

    const currentDate = new Date(Date.now())
    let currentHour = currentDate.getHours()
    let currentMinute = currentDate.getMinutes()

    if(currentHour < 10) { currentHour = `0${currentHour}` }
    if(currentMinute < 10) { currentMinute = `0${currentMinute}` }

    const expectedClockValue = `${currentHour}:${currentMinute}`
    const span = getByText(RegExp(expectedClockValue, "i"));
    expect(span).toBeInTheDocument();
});
