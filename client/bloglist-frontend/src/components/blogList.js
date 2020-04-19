import React from 'react';
import Blog from './blog';
import { connect } from 'react-redux';

const BlogList = (props) => {

    const mapList = () => props.blogs.map((blog, index) => <Blog key={`${blog.user.name}${index}`} blog={blog} />);

    return (
        <ul className="blog-list">
            {mapList()}
        </ul>
    );
}

const filteredList = (blogs, user) => blogs.filter((blog) => blog.user.name === user.name);

const mapStateToProps = (state) => {
    return {
        user: state.user,
        blogs: filteredList(state.blogs, state.user),
    }
}

export default connect(mapStateToProps, null)(BlogList)