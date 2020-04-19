import loginService from '../services/login'
import blogService from '../services/blogs'
import axios from 'axios';

const LOGOUT = 'LOGOUT';
const LOGGED_USER = 'LOGGED_USER';
const ERROR = 'ERROR';

export const loggedUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
        const currentUser = JSON.parse(loggedUserJSON);
        blogService.setToken(currentUser.token);
        return ({ type: LOGGED_USER, data: currentUser })
    }
    return ({ type: '', data: null });
}

export const logoutUser = () => {
    window.localStorage.clear();
    return ({ type: LOGOUT, data: '' });
}

export const loginUser = (access) => {
    return async dispatch => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        try {
            const newAccess = await loginService.login(access, { cancelToken: source.token });
            window.localStorage.setItem(
                'loggedBlogAppUser', JSON.stringify(newAccess),
            );
            blogService.setToken(newAccess.token);
            dispatch({ type: LOGGED_USER, data: newAccess });
        } catch (exception) {
            if (axios.isCancel(exception)) {
                console.log("Request Cancelled", exception);
            }
            else {
                console.log('server error!');
                dispatch({ type: ERROR });
                throw exception;
            }
        }
    }
}

const userReducer = (state = null, action) => {

    switch (action.type) {
        case LOGGED_USER:
            return action.data;
        case LOGOUT:
            return null;
        case ERROR:
            return 'error';
        default:
            break;
    }

    return state;
}

export default userReducer;