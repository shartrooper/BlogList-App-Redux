const SET_MESSAGE='SET_MESSAGE';
const WITHDRAW_MESSAGE='WITHDRAW_MESSAGE';

export const showMessage=(message)=> {
    return ({type: SET_MESSAGE, data: message});
}

export const clearMessage=()=>{
    return ({type: WITHDRAW_MESSAGE});
}

const notificationReducer= (state= false, action) =>{
    
    switch (action.type) {
        case SET_MESSAGE:
            return action.data;
        case WITHDRAW_MESSAGE:
            return false;
        default:
            break;
    }
    return state;
}

export default notificationReducer;