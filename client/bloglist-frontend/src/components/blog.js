import React, { useState } from 'react'
import { connect } from 'react-redux'
import { upVoted, deletedBlog } from '../reducers/blogReducer'


const Blog = ({ blog, user, upVoted, deletedBlog }) => {
    const [visible, setVisible] = useState(false);
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    }
    const showWhenVisible = { display: visible ? '' : 'none' };

    const toggleVisibility = () => {
        setVisible(!visible);
    }


    const handleLike = () => {
        let { title, author, likes, url, user } = blog;
        upVoted(blog.id, { title, author, likes, url, user })
    }

    const handleRemove = () => {
        deletedBlog(blog.id);
    }
    return (<li style={blogStyle} className='blog'>
        <p onClick={toggleVisibility} style={{ cursor: "pointer" }}>{blog.title}{' - '}{blog.author}</p>
        <div style={showWhenVisible} className="hidden-wrapper">
            <p>Url:<a href={blog.url}>{blog.url}</a></p>
            <p>Likes:{blog.likes} <button type="button" onClick={handleLike} > + Like</button></p>
            <p>Added by:{blog.user.name}</p>
            {blog.user.name === user.name ? <button type="button" onClick={handleRemove}>remove</button> : null}
        </div>
    </li>);
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = { upVoted, deletedBlog }

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
