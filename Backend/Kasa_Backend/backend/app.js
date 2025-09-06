const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const { errorHandler } = require('./src/middlewares/errorHandler');
const routes = require('./src/routes/index');

const app = express();

// Middleware
app.use(cors({
    origin: "*", // Change this in production
}));
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Server is running');
});
// ds
// אחרי יצירת app = express()
app.use((req, res, next) => {
  res.set('X-Api-Rev', process.env.GIT_SHA || 'local');
  next();
});

app.get('/api/_health', (req, res) => {
  res.json({
    ok: true,
    rev: process.env.GIT_SHA || null,
    nodeEnv: process.env.NODE_ENV || null,
    projectId: process.env.FIREBASE_PROJECT_ID || null,
    dbUrl: process.env.FIREBASE_DATABASE_URL || null,
    time: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
// change for commit