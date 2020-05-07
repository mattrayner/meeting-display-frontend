import React from 'react';
import { render } from '@testing-library/react';
import ErrorDisplay from './ErrorDisplay';

test('renders error display as expected when show is true', () => {
    const { getByText } = render(<ErrorDisplay show={true}/>);

    const div = getByText(/there was a problem updating the calendar/i);
    expect(div).toBeInTheDocument();
    expect(div.className).toEqual('error error-show');
});

test('renders error display as expected when show is false', () => {
    const { getByText } = render(<ErrorDisplay show={false}/>);

    const div = getByText(/there was a problem updating the calendar/i);
    expect(div).toBeInTheDocument();
    expect(div.className).toEqual('error error-hide');
});
