import { LevelDB } from './leveldb'
import WriteStream from 'level-ws'


export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
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
      stream.write({ key: `${keyUser}:${m.timestamp}`, value: `${m.timestamp}:${m.value}` })
    })
    stream.end()
  }

  public getAllMetrics(keyUser: string, callback: (error: Error | null, result: Metric[] | null) => Metric[]) {
    // Read

    let metrics: Metric[] = []
    this.db.createReadStream()
      .on('data', function (data) {
        if (data.key.includes(keyUser)) {
          let oneMetric: Metric = new Metric(data.value.split(':')[0], data.value.split(':')[1])
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
      this.db.del(`${keyUser}:${m.timestamp}`, function (err) {
        if (err) {
          callback(err)
        }
        else {         
          console.log("deleted")
          console.log(`${keyUser}:${m.timestamp}`)
          callback(null)
  
        }
      });
    })
  
  }
}