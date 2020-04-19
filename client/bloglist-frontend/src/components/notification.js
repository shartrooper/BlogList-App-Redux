import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {clearMessage} from '../reducers/notificationReducer'
import {logoutUser } from '../reducers/userReducer'

const Notification = (props) => {

  useEffect(()=>{
    const timer = setTimeout(() =>{ props.clearMessage(); props.logoutUser();}, 2000);
    return () => clearTimeout(timer);
  },[props.notification])

  return (!props.notification?null:<div style={props.notification.style}>{props.notification.message}</div>)
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  }
}

Notification.propTypes = {
  notification: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
}

export default connect(mapStateToProps, {clearMessage,logoutUser })(Notification)