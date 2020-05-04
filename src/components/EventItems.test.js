import React from 'react';
import { render } from '@testing-library/react';
import EventItems from './EventItems';

test('renders event items as expected', () => {
    const { getByText } = render(<EventItems events={[{time: 'TIME1', summary: 'SUMMARY1'},{time: 'TIME2', summary: 'SUMMARY2'}]} />);

    const timeSpan = getByText(/TIME1/g);
    const timeSpan2 = getByText(/TIME2/g);
    const listItem = getByText(/SUMMARY1/g)
    const listItem2 = getByText(/SUMMARY2/g)
    const ul1 = listItem.parentNode
    const ul2 = listItem2.parentNode
    expect(timeSpan).toBeInTheDocument();
    expect(timeSpan.tagName).toEqual('SPAN')
    expect(timeSpan2).toBeInTheDocument();
    expect(timeSpan2.tagName).toEqual('SPAN')
    expect(listItem).toBeInTheDocument();
    expect(listItem.tagName).toEqual('LI');
    expect(listItem2).toBeInTheDocument();
    expect(listItem2.tagName).toEqual('LI');
    expect(ul1).toEqual(ul2)
});
