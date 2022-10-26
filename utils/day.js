import day from 'dayjs'


const dayFormat = (date, string = 'YYYY-MM-DD HH:mm:ss') => {
    return day(date).format(string)
}

const datUnix = (date) => {
    return day(date).valueOf()
}



export {
    dayFormat,
    datUnix
}