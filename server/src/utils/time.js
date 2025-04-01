import moment from 'moment-timezone';
const TZ = "Asia/Tashkent";

export const getNow = () => moment().tz(TZ).unix();

export const formatDate = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => moment.unix(timestamp).tz(TZ).format(format);