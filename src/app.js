const express = require('express');
const caseRouter = require('./controllers/caseController');
const categoryRouter = require('./controllers/categoryController');
const informationRouter = require('./controllers/informationController');
const tagRouter = require('./controllers/tagController');

const app = express();

app.use(express.json());

app.use('/case', caseRouter);
app.use('/categories', categoryRouter);
app.use('/information', informationRouter);
app.use('/tags', tagRouter);

module.exports = app;