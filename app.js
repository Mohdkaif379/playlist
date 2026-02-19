require('dotenv').config();
const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'change_this_secret',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false }
	})
);
app.use('/', indexRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
