import { User, UserHandler } from '../src/user'
import { Metric } from '../src/metrics'

const usr = [
  new User('test1@email.com', 'test1', 'password1', [new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`, 175, 75), new Metric(`${new Date('2013-11-04 14:30 UTC').getTime()}`, 190, 95)]),
  new User('test2@email.com', 'test2', 'password2', [new Metric(`${new Date('2013-11-04 14:15 UTC').getTime()}`, 168, 75)]),
  new User('test3@email.com', 'test3', 'password3', [new Metric(`${new Date('2013-11-04 14:30 UTC').getTime()}`, 198, 80)]),
]

const db = new UserHandler('./db/users')

db.add(usr, (err: Error | null) => {
  if (err) throw err
  console.log('Data populated')
})
