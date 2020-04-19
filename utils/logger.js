const morgan = require('morgan');


morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : 'none'));

const info = () => {
  if (process.env.NODE_ENV !== 'test') {
    return morgan(':method :url :status :res[content-length] - :response-time ms :body');
  }
  return (req, res, next) => next();
};

const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info, error,
};
