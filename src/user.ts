import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
import { Metric, MetricsHandler } from '../src/metrics'

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

/**
 * user class : define a user
 * @param email email of the user
 * @param username username of the user
 * @param password password of the user
 * @param metrics metrics of the user
 */
export class User {
  private email: string
  private username: string
  private password: string
  private metrics: Metric[] = []
  /**
   * Constructor of User
   * @param mail email 
   * @param usr username
   * @param psw password
   * @param met metrics
   * @param passwordHashed boolean to hash the password or not
   */
  constructor(mail: string, usr: string, psw: string, met: Metric[], passwordHashed: boolean) {
    this.email = mail
    this.username = usr
    if (!passwordHashed) this.password = bcrypt.hashSync(psw, salt);
    else this.password = psw;
    this.metrics = met
  }
  /**
   * Getter of email
   */
  public getEmail() {
    return this.email;
  }
  /**
   * Getter of username
   */
  public getUsername() {
    return this.username;
  }
  /**
   * Getter of password
   */
  public getPassword() {
    return this.password;
  }
  /**
   * Getter of metrics
   */
  public getMetrics() {
    return this.metrics;
  }
  /**
   * Method to add a metric in metrics array
   * @param _met metric to be added
   */
  public addMetric(_met) {
    this.metrics.push(_met);
  }
}

/**
 * @param db database reference to handle the users
 * @param metricsDB database reference to handle the metrics of the users' metrics
 */
export class UserHandler {
  private db: any
  private metricsDB: any

  /**
   * Constructor of UserHandler
   * @param path path used to connect to the database (folder users)
   * @param pathMetric path used to connect to the database (folder metrics)
   */
  constructor(path: string, pathMetric: string) {
    this.db = LevelDB.open(path);
    this.metricsDB = new MetricsHandler(pathMetric);
  }
  /**
   * Getter of the user MetricsHandler
   */
  public getMetricsHandler() {
    return this.metricsDB;
  }
  /**
   * Function to add a user and his metrics in the database
   * @param users users that need to be added
   * @param callback 
   */
  public add(users: User[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', function (err) {
      callback(err)
    }).on('close', function (err) {
      if (err) {
      }
      callback(null)
    })
    users.forEach((m: User) => {
      stream.write({ key: `user_${m.getEmail()}`, value: { email: m.getEmail(), username: m.getUsername(), password: m.getPassword() } })
      this.metricsDB.add(`metrics_${m.getEmail()}`, m.getMetrics(), (err: Error | null) => {
        if (err) {
          throw err
        }

      });
    });
    stream.end()
  }

  /**
   * Function that add a user without his metrics in database
   * @param users users that need to be added
   * @param callback 
   */
  public addUser(users: User[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', function (err) {
      callback(err)
    })
    stream.on('close', function () {
      callback(null)
    })
    users.forEach((m: User) => {
      stream.write({ key: `user_${m.getEmail()}`, value: { email: m.getEmail(), username: m.getUsername(), password: m.getPassword() } })
    })
    stream.end()
  }

  /**
   * Function to get all the users and the metrics stored in the database
   * @param callback 
   */
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
              users.push(new User(data.value.email, data.value.username, data.value.password, result, true))
            } else {
              users.push(new User(data.value.email, data.value.username, data.value.password, [], true))
            }
          }
          if (counter == users.length && users.length != 0) {
            callback(null, users)
          }
        });
      })
      .on('error', function (err) {
        callback(err, null)
      })
      .on('close', function (err) {
        if (counter == 0) {
          callback(null, users);
        }
      })
  }

  /**
   * Function to get a specific user in the database
   * @param email email used to retrieve a user
   * @param callback 
   */
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
                foundUser = new User(data.value.email, data.value.username, data.value.password, result, true)
              } else {
                foundUser = new User(data.value.email, data.value.username, data.value.password, [], true)
              }
            }
            if (foundUser != undefined) {
              callback(null, foundUser)
            }
          });
        }
      })
      .on('error', function (err) {
        callback(err, null)
      })
  }

  /**
   * Function to remove users with their metrics in the database
   * @param emailTab email of the users that need to be deleted
   * @param callback 
   */
  public remove(emailTab: string[], callback: (error: Error | null) => void) {
    let self = this.metricsDB;
    let that = this;
    let counter: number = 0;
    new Promise((resolve, reject) => {
      emailTab.forEach(function (email) {
        that.getUser(email, (err: Error | null, result: User | null) => {
          if (err) throw err
          if (result != undefined && result != null) {
            let metrics: Metric[] = result.getMetrics()
            that.db.del(`user_${result.getEmail()}`, function (err) {
              if (err) throw err
              if (metrics.length > 0) {
                self.del('metrics_' + email, metrics, (err: Error | null, result: Metric[] | null) => {
                  if (err) throw err
                });
              } else {
                self.del('metrics_' + email, [], (err: Error | null, result: Metric[] | null) => {
                  if (err) throw err
                });
              }
              counter += 1;
              if (counter == emailTab.length) {
                resolve();
              }
            });
          }
        });
      })

    }).then(() => {
      callback(null);
    })

  }

  /**
   * Function used to add metrics to a user
   * @param keyUser key referencing the user in the database
   * @param metric metrics that need to be added
   * @param callback 
   */
  public addUserMetric(keyUser: string, metric: Metric, callback: (error: Error | null) => void) {
    this.metricsDB.add(keyUser, [metric], (err: Error | null) => {
      if (err) throw err
      else {
        callback(null)
      }
    });
  }

  /**
   * Function to remove a metric to a user
   * @param keyMetric key referecing the metric to be deleted
   * @param callback 
   */
  public removeUserMetric(keyMetric: string, callback: (error: Error | null) => void) {
    this.metricsDB.removeOne(keyMetric, (err: Error | null, result: Metric[] | null) => {
      if (err) throw err
    });
  }

  /**
   * Function to update a metric to a user
   * @param keyMetric key referecing the metric to be updated
   * @param newMetric new metric to replace the current one
   * @param callback 
   */
  public updateUserMetric(keyMetric: string, newMetric: Metric, callback: (error: Error | null) => void) {
    this.metricsDB.add(keyMetric.split('_')[0] + '_' + keyMetric.split('_')[1], [newMetric], (err: Error | null, result: Metric[] | null) => {
      if (err) throw err
    });
  }

  /**
   * Function that sets the filter of the metrics and print the fitting metrics on deletion
   * @param keyTimestamp filter value of the timestamp
   * @param keyHeight filter value of the height
   * @param keyWeight filter value of the 
   */
  public setFilterUpdateMetric(keyTimestamp: string, keyHeight: string, keyWeight: string) {
    this.metricsDB.setFilterUpdateMetric(keyTimestamp, keyHeight, keyWeight);
  }
  /**
   * Function that sets the filter of the metrics and print the fitting metrics on updation
   * @param keyTimestamp filter value of the timestamp
   * @param keyHeight filter value of the height
   * @param keyWeight filter value of the weight
   */
  public setFilterDeleteMetric(keyTimestamp: string, keyHeight: string, keyWeight: string) {
    this.metricsDB.setFilterDeleteMetric(keyTimestamp, keyHeight, keyWeight);
  }
  /**
   * Function that closes the database connection 
   * @param callback 
   */
  public close(callback: (error: Error | null) => void) {
    this.db.close();
    this.metricsDB.close((err: Error | null)=> {
      if(err) throw err
    });
    callback(null)
  }
}
