import blogService from '../services/blogs'

const GET_BLOGS = 'GET_BLOGS';
const UPDATE_BLOG = 'UPDATE_BLOGS';
const DELETE_BLOG = 'DELETE_BLOG';
const CREATE_BLOG = 'CREATE_BLOG';

export const getAllBlogs = () => {
    return async dispatch => {
        try {
            const blogs = await blogService.getAll();
            dispatch({ type: GET_BLOGS, data: blogs })
        } catch (error) {
            console.log('No server response', error);
            throw error;
        }
    }
}

export const upVoted = (id, blog) => {
    return async dispatch => {
        try {
            const updated = await blogService.update(id, blog);
            dispatch({
                type: UPDATE_BLOG,
                data: updated
            })
        } catch (error) {
            console.log('No server response', error);
            throw error;
        }
    }
}

export const deletedBlog = (blogID) => {
    return async dispatch => {
        try {
            await blogService.remove(blogID);
            dispatch({
                type: DELETE_BLOG,
                data: blogID
            })
        } catch (error) {
            console.log('No server response', error);
            throw error;
        }
    }
}

export const createdBlog = (newBlog) => {
    return async dispatch => {
        try {
            const created = await blogService.create(newBlog);
            dispatch({
                type: CREATE_BLOG,
                data: created
            })
        } catch (error) {
            console.log('No server response', error);
            throw error;
        }
    }
}



const blogReducer = (state = [], action) => {

    switch (action.type) {
        case GET_BLOGS:
            return action.data;
        case CREATE_BLOG:
            return [...state, action.data];
        case UPDATE_BLOG:
            return [...state.filter(blog => blog.id !== action.data.id), action.data];
        case DELETE_BLOG:
            return state.filter(blog => blog.id !== action.data);
        default:
            break;
    }
    return state;
}

export default blogReducer;