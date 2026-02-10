require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { connectDb } = require('./config/db');
const { currentUser } = require('./middleware/currentUser');
const { requireAuth } = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const postbackRoutes = require('./routes/postbackRoutes');
const indexRoutes = require('./routes/indexRoutes');

async function start() {
  const app = express();

  await connectDb(process.env.MONGO_URI);

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(methodOverride('_method'));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 },
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
    })
  );

  app.use(currentUser);

  app.use(authRoutes);
  app.use('/webhooks', postbackRoutes);
  app.use(requireAuth);
  app.use(indexRoutes);
  app.use('/users', userRoutes);
  app.use('/projects', projectRoutes);
  app.use('/tasks', taskRoutes);
  app.use('/', postbackRoutes);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', { message: err.message || 'Internal Server Error' });
  });

  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Startup failed', error);
  process.exit(1);
});
