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

  constructor(path: string, pathMetric: string) {
    this.db = LevelDB.open(path);
    this.metricsDB = new MetricsHandler(pathMetric);
  }
  public getMetricsHandler() {
    return this.metricsDB;
  }
  public add(users: User[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', function (err) {
      callback(err)
    })
    stream.on('close', function () {
      callback(null)
    })
    users.forEach((m: User) => {
      stream.write({ key: `user_${m.getEmail()}`, value: { email: m.getEmail(), username: m.getUsername(), password: m.getPassword() } })
      this.metricsDB.add(`metrics_${m.getEmail()}`, m.getMetrics(), (err: Error | null) => {
        if (err) throw err
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
        callback(err, null)
      })
      .on('close', function () {
        if (users.length == 0) {
          callback(null, users)
        }
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
  }

  public remove(emailTab: string[], callback: (error: Error | null) => void) {
    let self = this.metricsDB;
    let that = this;
    let counter = 0;
    emailTab.forEach(function (email) {
      that.getUser(email, (err: Error | null, result: User | null) => {        
        if (!err) {
          if (result != undefined && result != null) {
            let metrics: Metric[] = result.getMetrics()
            that.db.del(`user_${result.getEmail()}`, function (err) {
              if (err) {
                callback(err)
              }
              else {
                if (metrics.length > 0) {
                  self.del('metrics_' + email, metrics, (err: Error | null, result: Metric[] | null) => {
                    if (err) throw err
                  });
                } else {
                  self.del('metrics_' + email, [], (err: Error | null, result: Metric[] | null) => {
                    if (err) throw err
                  });
                }
              }
            });
            callback(null)
          }          
        } else {
          console.log(err)
          callback(err)
        };
      });
    })

  }

  public addUserMetric(keyUser: string, metric: Metric, callback: (error: Error | null) => void) {
    this.metricsDB.add(keyUser, [metric], (err: Error | null) => {
      if (err) throw err
      else {
        callback(null)
      }
    });
  }


  public removeUserMetric(keyMetric: string, callback: (error: Error | null) => void) {
    this.metricsDB.removeOne(keyMetric, (err: Error | null, result: Metric[] | null) => {
      if (err) throw err
    });
  }

  public updateUserMetric(keyMetric: string, newMetric: Metric, callback: (error: Error | null) => void) {
    console.log("KEY METRIC BITCH")
    console.log(keyMetric)
    console.log("||||||||||||||||||||||||||||||||||||")
    this.metricsDB.add(keyMetric.split('_')[0] + '_' + keyMetric.split('_')[1], [newMetric], (err: Error | null, result: Metric[] | null) => {
      if (err) throw err
      else console.log("DONE DELETING")
    });
  }

  public setFilterUpdateMetric(keyTimestamp: string, keyHeight: string, keyWeight: string) {
    this.metricsDB.setFilterUpdateMetric(keyTimestamp, keyHeight, keyWeight);
  }

  public setFilterDeleteMetric(keyTimestamp: string, keyHeight: string, keyWeight: string) {
    this.metricsDB.setFilterDeleteMetric(keyTimestamp, keyHeight, keyWeight);
  }

  public close(callback: (error: Error | null) => void) {
    this.db.close();
    callback(null);
  }
}
