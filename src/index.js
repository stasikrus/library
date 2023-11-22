const express = require('express');
const getBooksRouter = require('./routes/books');
const userRoutes = require('./routes/users');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');
const session = require('express-session');
const socketIo = require('socket.io');
const http = require('http');
const setupSocketHandlers = require('./socket/setupSocketHandlers ');

const PORT = process.env.PORT || 3000 ;
const UrlDB = process.env.UrlDB || 'mongodb://root:example@mongo:27017/library';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await User.findOne({username});

    try {
      if (!user) {
        return done(null, false, {message: 'Пользователь не найден'});
      }
  
      if (!user.validatePassword(password)) {
        return done(null, false, {message: 'Неверный пароль'});
      }
  
      return done(null, user);
    
    } catch (error) {
      done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api', getBooksRouter);
app.use('/api/user', userRoutes);

setupSocketHandlers(io);

async function start(PORT, UrlDB) {
  try {
    await mongoose.connect(UrlDB, {
      dbName: "books"
    });
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start(PORT, UrlDB);