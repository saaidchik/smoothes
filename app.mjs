import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.mjs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { requireAuth, checkUser } from './middleware/authMiddleware.mjs';
import { dbURI } from './config/config.mjs';
const serverless = require('serverless-http')
const express = require('express');
const port = 3000;
const app = express();

// middleware
app.use(express.static('public'));
app.use(cookieParser());
//bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// view engine
app.set('view engine', 'ejs');


mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => {
    app.listen(port, () => {
      console.log('App is running on port: ' + port);
    });
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => {
  res.render("home")
});

app.get('/smoothies', requireAuth, (req, res) => {
  res.render("smoothies")
});

app.get('/about', (req, res) => {
  res.render('about');
});

// News Page
app.get('/news', (req, res) => {
  // You can add news data here or fetch it from a database
  const news = [
    { title: 'Exciting Announcement', date: '2023-11-22', content: 'Lorem ipsum dolor sit amet...' },
    // Add more news items as needed
  ];

  res.render('news', { news });
});

// Order Page
app.get('/order', (req, res) => {
  // You can customize this page based on your ordering process
  res.render('order');
});

app.use(authRoutes);
app.use("/.netlify/functions/api, router");
module.exports.handler = serverless(app);
