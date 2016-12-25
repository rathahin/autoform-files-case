import React from 'react';

// Router.configure({
//   autoStart: false
// });

Router.route('/', function () {
  this.render('home');
});

Router.route('/login', function () {
  this.render('login');
});

Router.route('/admin/media', function () {
  this.render('media');
});
