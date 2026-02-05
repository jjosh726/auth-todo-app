export function parseDate(dateString) {
    let dateInfo = {
        date : dayjs(dateString).format('D MMM'),
        overdue : false
    }

    let dayObject = dayjs(dateString);
    
    // if today, display (today)
    if (dayjs().isSame(dayObject, 'day')) dateInfo.date = 'Today';

    // if tmrw, display (tomorrow)
    if (dayjs().add(1, 'day').isSame(dayObject, 'day')) dateInfo.date = 'Tomorrow';

    // if year is not the same as todays year, display year
    if (!dayjs().isSame( dayObject , 'year')) dateInfo.date += " " + dayjs(dateString).format('YYYY')

    // if date is before today, overdue is true
    if (dayjs().isAfter(dayObject, 'day')) {
        dateInfo.overdue = true;
        dateInfo.date += " OVERDUE";
    }

    return dateInfo;
}


export const formatDateString = (dateString) => dayjs(dateString).format('YYYY-MM-DD');

export const isDateInvalid = (dateString) => dayjs().isAfter(dayjs(dateString), 'day');

export const isToday = (dateString) => dayjs().isSame(dayjs(dateString), 'day');

export const isDateEqual = (dateString1, dateString2) => dayjs(dateString1).isSame(dayjs(dateString2), 'day');
