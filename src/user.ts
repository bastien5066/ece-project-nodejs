import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
import { Metric, MetricsHandler } from '../src/metrics'

export class User {
  private email: string
  private username: string
  private password: string
  private metrics: Metric[] = []

  constructor(mail: string, usr: string, psw: string, met: Metric[]) {
    this.email = mail
    this.username = usr
    this.password = psw
    this.metrics = met
  }

  public getEmail() {
    return this.email
  }
  public getUsername() {
    return this.username
  }
  public getPassword() {
    return this.password
  }
  public getMetrics() {
    return this.metrics
  }
}

export class UserHandler {
  private db: any
  private metricsDB: any

  constructor(path: string) {
    this.db = LevelDB.open(path)
    this.metricsDB = new MetricsHandler('./db/metrics')
  }

  public add(users: User[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    users.forEach((m: User) => {
      stream.write({ key: `user_${m.getEmail()}`, value: { email: m.getEmail(), username: m.getUsername(), password: m.getPassword() } })
      this.metricsDB.add(`metrics_${m.getEmail()}`, m.getMetrics(), (err: Error | null) => {
        if (err) throw err
        else {
          console.log('Data populated')
          callback(null)
        }
      })

    })
    stream.end()
  }

  public addUser(users: User[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    users.forEach((m: User) => {
      stream.write({ key: `user_${m.getEmail()}`, value: { email: m.getEmail(), username: m.getUsername(), password: m.getPassword() } })
    })
    stream.end()
  }

  public getAllUser(callback: (error: Error | null, result: User[] | null) => void) {
    let users: User[] = [];
    let counter: number = 0;
    let self = this.metricsDB;
    this.db.createReadStream()
      .on('data', function (data) {
        counter += 1;
        self.getAllMetrics('metrics_' + data.value.email, (err: Error | null, result: Metric[] | null) => {
          if (!err) {
            if (result != null) {
              users.push(new User(data.value.email, data.value.username, data.value.password, result))
            } else {
              users.push(new User(data.value.email, data.value.username, data.value.password, []))
            }
          } else {
            console.log(err)
          }
          if (counter == users.length) {
            callback(null, users)
          }
        });
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        console.log('Stream ended')
      })
  }
  public getUser(email: string, callback: (error: Error | null, result: User | null) => void) {
    let foundUser: User;
    let self = this.metricsDB;
    this.db.createReadStream()
      .on('data', function (data) {
        let key = data.key.split('_')[1]
        if (key == email) {
          self.getAllMetrics('metrics_' + data.value.email, (err: Error | null, result: Metric[] | null) => {
            if (!err) {
              if (result != null) {
                foundUser = new User(data.value.email, data.value.username, data.value.password, result)
              } else {
                foundUser = new User(data.value.email, data.value.username, data.value.password, [])
              }
            } else {
              console.log(err)
            }
            if (foundUser != undefined) {
              callback(null, foundUser)
            }
          });
        }
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        console.log('Stream ended')
      })
  }

  public remove(email: string, callback: (error: Error | null) => void) {
    let self = this.metricsDB;
    this.getUser(email, (err: Error | null, result: User | null) => {
      if (!err) {
        if (result != undefined && result != null) {
          let metrics: Metric[] = result.getMetrics()
          this.db.del(`user_${result.getEmail()}`, function (err) {
            if (err) {
              callback(err)
            }
            else {
              if (metrics.length > 0) {
                self.del('metrics_' + email, (err: Error | null, result: Metric[] | null) => {
                  if (err) throw err
                  else console.log("DONE DELETING")
                });
              }
              callback(null)
            }
          });
        }
      } else {
        callback(err)
      };
    });
  }

  public addUserMetric(keyUser: string, metric: Metric, callback: (error: Error | null) => void) {
    this.metricsDB.add(keyUser, [metric], (err: Error | null) => {
      if (err) throw err
      else {
        console.log('Data added')
        callback(null)
      }
    });
  }


  public removeUserMetric(keyMetric: string, callback: (error: Error | null) => void) {
    this.metricsDB.removeOne(keyMetric, (err: Error | null, result: Metric[] | null) => {
      if (err) throw err
      else console.log("DONE DELETING")
    });
  }

  public updateUserMetric(keyMetric: string, newMetric: Metric, callback: (error: Error | null) => void) {
    this.metricsDB.updateOne(keyMetric, newMetric, (err: Error | null, result: Metric[] | null) => {
      if (err) throw err
      else console.log("DONE DELETING")
    });
  }
}