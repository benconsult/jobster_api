require('dotenv').config();
require('express-async-errors');
//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express');
const app = express();


//connect to db
const connectDb = require('./db/connect')
const authenticatedUser = require('./middleware/authentication')

//routes
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1) //deploying behind reverse-proxy
app.use(rateLimiter({
  windowMS: 15 *60 *1000, //15 minutes
  max: 100,
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

// routes - initial setup for Heroku 
 app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs', authenticatedUser, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
