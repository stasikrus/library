const express = require('express');
const getBooksRouter = require('./routes/books');
const userRoutes = require('./routes/users');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');

const PORT = process.env.PORT || 3000 ;
const UrlDB = process.env.UrlDB || 'mongodb://root:example@mongo:27017/library';

const app = express();

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

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use('/static', express.static(path.join(__dirname, 'views', 'includes'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api', getBooksRouter);
app.use('/api/user', userRoutes);

async function start(PORT, UrlDB) {
  try {
    await mongoose.connect(UrlDB, {
      dbName: "books"
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start(PORT, UrlDB);