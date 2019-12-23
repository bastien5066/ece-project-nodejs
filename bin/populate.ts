/*
  populate.ts : script to populate the database with 3 users and their metrics
*/

import { User, UserHandler } from '../src/user'
import { Metric } from '../src/metrics'

//Users to add
const usr = [
  new User('test1@email.com', 'test1', 'password1', [new Metric('01-01-2019~10:10:30', 175, 75), new Metric('01-11-2019~10:09:30', 190, 95)], false),
  new User('test2@email.com', 'test2', 'password2', [new Metric('01-01-2019~10:10:30', 168, 75)], false),
  new User('test3@email.com', 'test3', 'password3', [new Metric('01-01-2019~10:10:30', 198, 80)], false),
]

//Open database to add users and their metrics
const db = new UserHandler('./db/users', './db/metrics')

//Add users 
db.add(usr, (err: Error | null) => {
  if (err) throw err
  else console.log("Data populated !")
});
