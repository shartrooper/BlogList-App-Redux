import React, { useState, useEffect } from 'react';
import { useField } from '../hooks/index'
import PropTypes from 'prop-types'
import { loginUser } from '../reducers/userReducer';
import { connect } from 'react-redux';

const LoginForm = (props) => {
  const username = useField('text');
  const password = useField('password');
  const [access, setAccess] = useState('');

  useEffect(() => {
    const handleLogin = () => {
      console.log('logging in with', access.username, access.password);
      props.loginUser(access);
      username.reset();
      password.reset();
    };
    if (access) { handleLogin() };
  }, [access]);

  const handleUser = (event) => {
    event.preventDefault();
    (username.input.value && password.input.value) ? setAccess({
      username: username.input.value, password: password.input.value,
    }) : alert('Please submit username or password');
  }


  return (
    <form onSubmit={handleUser} className="login-form">
      <div>
        Username
        {' '}
        <input
          {...username.input}
        />
      </div>
      <div>
        Password
        {' '}
        <input
          {...password.input}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};


LoginForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = { loginUser };


export default connect(null, mapDispatchToProps)(LoginForm);
