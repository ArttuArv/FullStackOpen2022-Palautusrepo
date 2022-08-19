import PropTypes from 'prop-types'

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return (
    <div style = {style}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  style: PropTypes.object.isRequired
}

export default Notification