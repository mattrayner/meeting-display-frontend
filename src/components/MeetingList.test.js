import React from 'react';
import { render } from '@testing-library/react';
import MeetingList from './MeetingList';

test('renders meeting list as expected', () => {
    const now = new Date(Date.now())
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)

    const tomorrowYear = tomorrow.getFullYear()
    let tomorrowMonth = tomorrow.getMonth()
    let tomorrowDay = tomorrow.getDate()

    if(tomorrowMonth < 10 ) { tomorrowMonth = `0${tomorrowMonth}` }
    if(tomorrowDay < 10 ) { tomorrowDay = `0${tomorrowDay}` }

    const ymd = `${tomorrowYear}${tomorrowMonth}${tomorrowDay}`

    let list = {}
    list[ymd] = [{time: 'TIME', summary: 'SUMMARY'}]

    const { getByText } = render(<MeetingList list={list} />);
    const header = getByText(/Tomorrow/g);
    const timeSpan = getByText(/TIME/g);
    const listItem = getByText(/SUMMARY/g)
    expect(header).toBeInTheDocument();
    expect(timeSpan).toBeInTheDocument();
    expect(timeSpan.tagName).toEqual('SPAN')
    expect(listItem).toBeInTheDocument();
    expect(listItem.tagName).toEqual('LI');
});
