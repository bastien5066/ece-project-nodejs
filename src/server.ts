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

//Main route on the hompepage which allow a user to sign-in or sing-up
app.route('/login')
  .get(routes.printHomepage)
//Route usedb by the user connected to disconnect from his profile 
app.route('/logout')
  .get(routes.logout)
//Route used to create a user if the information provided are correct
app.route('/sign-up')
  .post(routes.checkCredentials)
//Route used by a user to sign-in if the information provided are correct
app.route('/sign-in')
  .post(routes.checkCredentials)
//Route to print a user profile
app.route('/user/:username')
  .get(routes.printProfile)
//Route used by a user to delete his profile
app.route('/user/:username/profile/delete')
  .get(routes.deleteProfile)
//Route used by a user to edit his profile
app.route('/user/:username/profile/edit')
  .post(routes.editProfile)
//Route used by a user to create a new metric
app.route('/user/:username/metrics/create')
  .post(routes.createMetric)
//Route used by a user to display in his own metrics on a graph
app.route('/user/:username/metrics/read')
  .get(routes.printMetrics)
//Route used by a user to set a filter on the next search
app.route('/user/:username/metrics/read/filter')
  .post(routes.setFilter)
//Route used by a user to update one of his metric
app.route('/user/:username/metrics/update/:id')
  .post(routes.updateMetric)
//Route used by a user to display the metrics updated on the graph
app.route('/user/:username/metrics/update/:id')
  .get(routes.printMetrics)
//Route used by a user to update one of his metric
app.route('/user/:username/metrics/delete/:id')
  .post(routes.deleteMetric)
//Route used by a user to remove the metrics deleted on the graph
app.route('/user/:username/metrics/delete/:id')
  .get(routes.printMetrics)
//Default route to redirect the user
app.route('*')
  .get(routes.defaultGateway)

app.listen(port, (err: Error) => {
  if (err) throw err
  console.log(`Server is listening on port ${port}`)
})

module.exports = app;