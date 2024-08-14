import moment from 'moment';

export const getToken = () => {
    return localStorage.getItem('accessToken');
};

export const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

export const removeToken = () => {
    localStorage.removeItem('accessToken');
};

export const setToken = (val) => {
    localStorage.setItem('accessToken', val);
};

export const setUserData = (val) => {
    localStorage.setItem('userData', val);
};

export const removeUserData = () => {
    localStorage.removeItem('userData');
};

export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

export const isUserLoggedIn = () => !!localStorage.getItem('userData');

export const removeCookie = (cookieName) => {
    document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const getHomeRouteForLoggedInUser = (userRole) => {
    if (userRole === 'admin') return '/admin/users';
    if (userRole === 'company') return '/company/services';
    if (userRole === 'client') return '/client/companies';
    return '/login';
};

export const getDateFormat = (formattedDate) => {
    const formattedDateMoment = moment(`${formattedDate}`, 'YYYY-MM-DD HH:mm A');
    const formattedDateTime = moment(formattedDateMoment).format('llll');
    return formattedDateTime;
};

export const formatDateRange = (availability) => {
    if (!availability || !availability.startDate || !availability.endDate) return '';

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const start = formatDate(availability.startDate);
    const end = formatDate(availability.endDate);

    return `${start} - ${end}`;
};


