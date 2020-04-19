import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loggedUser, logoutUser } from './reducers/userReducer'
import { showMessage } from './reducers/notificationReducer'
import { getAllBlogs } from './reducers/blogReducer'
import LoginForm from './components/loginForm'
import Notification from './components/notification'
import BlogList from './components/blogList'


function App(props) {

  useEffect(() => {
  const fetchData= ()=>props.getAllBlogs()
  fetchData();
  }, []);

  useEffect(() => {
    props.loggedUser();
  }, [])

  useEffect(() => {
    const errorMessage = () => props.showMessage({ message: 'Wrong credentials or user doesn\'t exist !', style: { color: 'red', border: 'red 3px solid', fontSize: 20 } });
    if (props.user === 'error') {
      errorMessage();
    };
  }, [props.user])

  const logoutFun = () => {
    props.logoutUser();
  };

  return (
    <div id='wrapper'>
      {props.user === null || props.user === 'error' ?
        (<div id="login-wrapper">
          <h3>Login to application</h3>
          <Notification />
          <LoginForm />
        </div>) :
        (<div id="blogs-wrapper" className='blogs-wrapper'>
          <h3>Blogs</h3>
          <p>{props.user.name} is currently logged in! <button type="button" onClick={logoutFun}>Logout user</button></p>
          <BlogList />
        </div>)}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = { loggedUser, logoutUser, showMessage, getAllBlogs };

export default connect(mapStateToProps, mapDispatchToProps)(App);
