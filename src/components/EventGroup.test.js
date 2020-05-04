import React from 'react';
import { render } from '@testing-library/react';
import EventGroup from './EventGroup';

test('renders today event group as expected', () => {
    const now = new Date(Date.now())

    let nowYear = now.getFullYear()
    let nowMonth = now.getMonth()
    let nowDay = now.getDate()

    if(nowMonth < 10 ) { nowMonth = `0${nowMonth}` }
    if(nowDay < 10 ) { nowDay = `0${nowDay}` }

    let ymd = `${nowYear}${nowMonth}${nowDay}`

    const { container, getByText } = render(<EventGroup name={ymd} events={[{time: 'TIME1', summary: 'SUMMARY1'},{time: 'TIME2', summary: 'SUMMARY2'}]} />);

    const ul = container.firstChild.firstChild
    const listItem = getByText(/SUMMARY1/g)
    const listItem2 = getByText(/SUMMARY2/g)
    expect(ul.tagName).toEqual('UL')
    expect(listItem).toBeInTheDocument();
    expect(listItem.tagName).toEqual('LI');
    expect(listItem.parentNode).toEqual(ul);
    expect(listItem2).toBeInTheDocument();
    expect(listItem2.tagName).toEqual('LI');
    expect(listItem2.parentNode).toEqual(ul);
});

test('renders tomorrow event group as expected', () => {
    const now = new Date(Date.now())
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)

    let tomorrowYear = tomorrow.getFullYear()
    let tomorrowMonth = tomorrow.getMonth()
    let tomorrowDay = tomorrow.getDate()

    if(tomorrowMonth < 10 ) { tomorrowMonth = `0${tomorrowMonth}` }
    if(tomorrowDay < 10 ) { tomorrowDay = `0${tomorrowDay}` }

    let ymd = `${tomorrowYear}${tomorrowMonth}${tomorrowDay}`

    const { getByText } = render(<EventGroup name={ymd} events={[{time: 'TIME1', summary: 'SUMMARY1'},{time: 'TIME2', summary: 'SUMMARY2'}]} />);

    const header = getByText(/Tomorrow/g)
    const listItem = getByText(/SUMMARY1/g)
    const listItem2 = getByText(/SUMMARY2/g)
    expect(header).toBeInTheDocument();
    expect(listItem).toBeInTheDocument();
    expect(listItem.tagName).toEqual('LI');
    expect(listItem2).toBeInTheDocument();
    expect(listItem2.tagName).toEqual('LI');
});

test('renders day and month event group as expected', () => {
    const now = new Date(Date.now())
    const monthday = new Date(now)
    monthday.setDate(now.getDate() + 10)

    let monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthday.getMonth()]

    const nth = function(d) {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    }
    let ordinality = nth(monthday.getDate())

    let year = monthday.getFullYear()
    let month = monthday.getMonth()
    let day = monthday.getDate()

    if(month < 10 ) { month = `0${month}` }
    if(day < 10 ) { day = `0${day}` }

    let ymd = `${year}${month}${day}`

    const { getByText } = render(<EventGroup name={ymd} events={[{time: 'TIME1', summary: 'SUMMARY1'},{time: 'TIME2', summary: 'SUMMARY2'}]} />);

    const header = getByText(RegExp(`${day}${ordinality} ${monthName}`, "g"))
    const listItem = getByText(/SUMMARY1/g)
    const listItem2 = getByText(/SUMMARY2/g)
    expect(header).toBeInTheDocument();
    expect(header.tagName).toEqual("H3");
    expect(listItem).toBeInTheDocument();
    expect(listItem.tagName).toEqual('LI');
    expect(listItem2).toBeInTheDocument();
    expect(listItem2.tagName).toEqual('LI');
});
