import { LevelDB } from './leveldb'
import WriteStream from 'level-ws'


export class Metric {
  private timestamp: string
  private height: number
  private weight: number

  constructor(ts: string, hgt: number, wgt: number) {
    this.timestamp = ts
    this.height = hgt
    this.weight = wgt
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getHeight() {
    return this.height;
  } 

  public getWeight() {
    return this.weight;
  }
}

export class MetricsHandler {
  private db: any

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  public add(keyUser: string, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `${keyUser}_${m.getTimestamp()}`, value: `${m.getTimestamp()}_${m.getHeight()}_${m.getWeight()}` })
    })
    stream.end()
  }

  public getAllMetrics(keyUser: string, callback: (error: Error | null, result: Metric[] | null) => Metric[]) {
    // Read
    let metrics: Metric[] = []
    this.db.createReadStream()
      .on('data', function (data) {
        console.log("DATA")
        console.log(data)
        if (data.key.includes(keyUser)) {
          let oneMetric: Metric = new Metric(data.value.split('_')[0], data.value.split('_')[1], data.value.split('_')[2])
          metrics.push(oneMetric)
        }
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
        callback(null, metrics)
      })
      .on('end', function () {
        console.log('Stream ended')
      })
  }

  public del(keyUser: string, metrics: Metric[], callback: (error: Error | null) => void) {
    console.log("metrics.forEach")
    console.log(metrics)
    metrics.forEach((m: Metric) => {
      this.db.del(`${keyUser}_${m.getTimestamp()}`, function (err) {
        if (err) {
          callback(err)
        }
        else {         
          console.log("deleted")
          console.log(`${keyUser}_${m.getTimestamp()}`)
          callback(null)
  
        }
      });
    })
  
  }
  public removeOne(keyMetric: string, callback: (error: Error | null) => void) {
      this.db.del(keyMetric, function (err) {
        if (err) {
          callback(err)
        }
        else {         
          console.log("deleted")
          console.log(keyMetric)
          callback(null)
  
        }
      });  
  }
}