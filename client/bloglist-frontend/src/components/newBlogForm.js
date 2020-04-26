import React from 'react';
import { useField } from '../hooks/index'
import { connect } from 'react-redux';
import { createdBlog } from '../reducers/blogReducer'
import { showMessage } from '../reducers/notificationReducer'


const BlogForm = ({ showMessage, createdBlog }) => {
    const title = useField();
    const author = useField();
    const url = useField();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const newBlog = { title: title.input.value, author: author.input.value, url: url.input.value };
            createdBlog(newBlog);
            title.reset();
            author.reset();
            url.reset();
            showMessage({ message: `A new blog "${newBlog.title}" by ${newBlog.author} added`, style: { color: 'green', border: 'green 3px solid', fontSize: 20 } });
        }
        catch (exception) {
            console.log(exception);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                Title:
        {' '}
                <input
                    {...title.input}
                />
            </div>
            <div>
                Author:
        {' '}
                <input
                    {...author.input}
                />
            </div>
            <div>
                Url:
        {' '}
                <input
                    {...url.input}
                />
            </div>
            <button type="submit">Create</button>
        </form>);
}

export default connect(null,{createdBlog, showMessage})(BlogForm);