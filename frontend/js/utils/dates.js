export function parseDate(dateString) {
    let dateInfo = {
        date : dayjs(dateString).format('D MMM'),
        overdue : false
    }

    // if today, display (today)
    if (dayjs().isSame(dateInfo.date)) dateInfo.date = 'Today';

    // if tmrw, display (tomorrow)
    if (dayjs().add(1, 'day').isSame(dateInfo.date)) dateInfo.date = 'Tomorrow';

    // if year is not the same as todays year, display year
    if (!dayjs().isSame( dayjs(dateString) , 'year')) dateInfo.date += " " + dayjs(dateString).format('YYYY')

    // if date is before today, overdue is true
    if (dayjs().isAfter(dayjs(dateString))) {
        dateInfo.overdue = true;
        dateInfo.date += " OVERDUE";
    }

    return dateInfo;
}

export const formatDateString = (dateString) => dayjs(dateString).format('YYYY-MM-DD');

export const isToday = (dateString) => dayjs().isSame(dayjs(dateString));