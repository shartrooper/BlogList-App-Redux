import blogService from '../services/blogs'

const GET_BLOGS = 'GET_BLOGS';

export const getAllBlogs= ()=>{
    return async dispatch =>{
        try {
            const blogs= await blogService.getAll();
            dispatch({type:GET_BLOGS, data: blogs})
        } catch (error) {
            console.log('No server response',error);
            throw error;
        }
    }
}


const blogReducer = (state = [], action) => {

    switch (action.type) {
        case GET_BLOGS:
            return action.data;
        default:
            break;
    }
    return state;
}

export default blogReducer;