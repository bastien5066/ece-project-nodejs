const express = require('express')
const path = require('path');
const favicon = require('express-favicon');
const session = require('express-session');
const levelSession = require('level-session-store')
const LevelStore = levelSession(session)
const routes = require('../routes/routes');
const cookies = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()
app.use(session({
  secret: 'secretdb',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))
const port: string = process.env.PORT || '8080'


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../views')));

app.use(favicon(path.join(__dirname, '../public/favicon.png')));

app.route('/login')
  .get(routes.printHomepage)
app.route('/logout')
  .get(routes.logout)
app.route('/sign-up')
  .post(routes.checkCredentials)
app.route('/sign-in')
  .post(routes.checkCredentials)
app.route('/user/:username')
  .get(routes.printProfile)
app.route('/user/:username/profile/delete')
  .get(routes.deleteProfile)
app.route('/user/:username/profile/edit')
  .post(routes.editProfile)
app.route('/user/:username/metrics/create')
  .post(routes.createMetric)
app.route('/user/:username/metrics/read')
  .get(routes.printMetrics)
app.route('/user/:username/metrics/update/:id')
  .post(routes.updateMetric)
app.route('/user/:username/metrics/delete/:id')
  .post(routes.deleteMetric)
app.route('/user/:username/metrics/delete/:id')
  .get(routes.printMetrics)

app.route('*')
  .get(routes.defaultGateway)

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`Server is listening on port ${port}`)
})

module.exports = app;