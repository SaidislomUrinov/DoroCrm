import moment from 'moment-timezone';
const TZ = "Asia/Tashkent";

export const getNow = () => moment().tz(TZ).unix();

export const formatDate = (timestamp, format = 'YYYY-MM-DD HH:mm') => moment.unix(timestamp).tz(TZ).format(format);

export const calculateMonths = (months) => {
    return getNow() + (+months) * 30 * 24 * 60 * 60
}