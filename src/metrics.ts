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
  private filterChoice: string
  private filterTimestampDelete: string
  private filterTimestampUpdate: string
  private filterHeightDelete: string
  private filterHeightUpdate: string
  private filterWeightDelete: string
  private filterWeightUpdate: string


  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath);
    this.filterTimestampDelete = '';
    this.filterTimestampUpdate = '';
    this.filterHeightDelete = '';
    this.filterHeightUpdate = '';
    this.filterWeightDelete = '';
    this.filterWeightUpdate = '';
    this.filterChoice = ''
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
    let self = this;
    this.db.createReadStream()
      .on('data', function (data) {
        if (data.key.includes(keyUser)) {
          let oneMetric: Metric = new Metric(data.value.split('_')[0], data.value.split('_')[1], data.value.split('_')[2]);
          console.log(self.filterTimestampDelete)
          console.log(oneMetric.getTimestamp())
          if (self.filterChoice == '' ||
            (self.filterChoice == 'delete' && self.filterTimestampDelete == '' && self.filterHeightDelete == '' && self.filterWeightDelete == '') ||
            (self.filterChoice == 'update' && self.filterTimestampUpdate == '' && self.filterHeightUpdate == '' && self.filterWeightUpdate == '')) {
            metrics.push(oneMetric);
          } else if (self.filterChoice == 'delete' && self.filterTimestampDelete != '' && self.filterHeightDelete != '' && self.filterWeightDelete != '') {
            console.log("COUCOU")
            if (oneMetric.getTimestamp().toString().includes(self.filterTimestampDelete) &&
              oneMetric.getHeight().toString().includes(self.filterHeightDelete) &&
              oneMetric.getWeight().toString().includes(self.filterWeightDelete)) {
              metrics.push(oneMetric);
            }
          } else if (self.filterChoice == 'update' && self.filterTimestampUpdate != '' && self.filterHeightUpdate != '' && self.filterWeightUpdate != '') {
            if (oneMetric.getTimestamp().toString().includes(self.filterTimestampUpdate) &&
              oneMetric.getHeight().toString().includes(self.filterHeightUpdate) &&
              oneMetric.getWeight().toString().includes(self.filterWeightUpdate)) {
              metrics.push(oneMetric);
            }
          }
          else {
            if (self.filterChoice == 'delete') {
              //delete
              if (self.filterTimestampDelete == '' && self.filterHeightDelete == '' && self.filterWeightDelete != '') {
                if (oneMetric.getWeight().toString().includes(self.filterWeightDelete)) {
                  metrics.push(oneMetric);
                }
              } else if (self.filterTimestampDelete == '' && self.filterHeightDelete != '' && self.filterWeightDelete == '') {
                if (oneMetric.getHeight().toString().includes(self.filterHeightDelete)) {
                  metrics.push(oneMetric);
                }
              } else if (self.filterTimestampDelete != '' && self.filterWeightDelete == '' && self.filterHeightDelete == '') {
                if (oneMetric.getTimestamp().toString().includes(self.filterTimestampDelete)) {
                  metrics.push(oneMetric);
                }
              } else if (self.filterTimestampDelete == '' && self.filterHeightDelete != '' && self.filterWeightDelete != '') {
                if (oneMetric.getWeight().toString().includes(self.filterWeightDelete) && oneMetric.getHeight().toString().includes(self.filterHeightDelete)) {
                  metrics.push(oneMetric);
                }
              } else if (self.filterTimestampDelete != '' && self.filterHeightDelete != '' && self.filterWeightDelete == '') {
                if (oneMetric.getTimestamp().toString().includes(self.filterTimestampDelete) && oneMetric.getHeight().toString().includes(self.filterHeightDelete)) {
                  metrics.push(oneMetric);
                }
              } else if (self.filterTimestampDelete != '' && self.filterHeightDelete == '' && self.filterWeightDelete != '') {
                if (oneMetric.getTimestamp().toString().includes(self.filterTimestampDelete) && oneMetric.getWeight().toString().includes(self.filterWeightDelete)) {
                  metrics.push(oneMetric);
                }
              }
            } else {
              if (self.filterTimestampUpdate == '' && self.filterHeightUpdate == '' && self.filterWeightUpdate != '') {
                if (oneMetric.getWeight().toString().includes(self.filterWeightUpdate)) {
                  metrics.push(oneMetric);
                }
              } else if (self.filterTimestampUpdate == '' && self.filterHeightUpdate != '' && self.filterWeightUpdate == '') {
                if (oneMetric.getHeight().toString().includes(self.filterHeightUpdate)) {
                  metrics.push(oneMetric);
                }
              } else if (self.filterTimestampUpdate != '' && self.filterWeightUpdate == '' && self.filterHeightUpdate == '') {
                if (oneMetric.getTimestamp().toString().includes(self.filterTimestampUpdate)) {
                  metrics.push(oneMetric);
                }
              } else if (self.filterTimestampUpdate == '' && self.filterHeightUpdate != '' && self.filterWeightUpdate != '') {
                if (oneMetric.getWeight().toString().includes(self.filterWeightUpdate) && oneMetric.getHeight().toString().includes(self.filterHeightUpdate)) {
                  metrics.push(oneMetric);
                }
              } else if (self.filterTimestampUpdate != '' && self.filterHeightUpdate != '' && self.filterWeightUpdate == '') {
                if (oneMetric.getTimestamp().toString().includes(self.filterTimestampUpdate) && oneMetric.getHeight().toString().includes(self.filterHeightUpdate)) {
                  metrics.push(oneMetric);
                }
              } else if (self.filterTimestampUpdate != '' && self.filterHeightUpdate == '' && self.filterWeightUpdate != '') {
                if (oneMetric.getTimestamp().toString().includes(self.filterTimestampUpdate) && oneMetric.getWeight().toString().includes(self.filterWeightUpdate)) {
                  metrics.push(oneMetric);
                }
              }
            }
          }
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

  public updateOne(keyMetric: string, newMetric: Metric, callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    console.log("KEY")
    console.log(keyMetric)
    stream.write({ key: keyMetric, value: `${newMetric.getTimestamp()}_${newMetric.getHeight()}_${newMetric.getWeight()}` })
    stream.end()
  }

  public setFilterDeleteMetric(keyTimestamp: string, keyHeight: string, keyWeight: string) {
    this.filterTimestampDelete = keyTimestamp.toString();
    this.filterHeightDelete = keyHeight.toString();
    this.filterWeightDelete = keyWeight.toString();
    this.filterChoice = "delete";
  }

  public setFilterUpdateMetric(keyTimestamp: string, keyHeight: string, keyWeight: string) {
    this.filterTimestampUpdate = keyTimestamp.toString();
    this.filterHeightUpdate = keyHeight.toString();
    this.filterWeightUpdate = keyWeight.toString();
    this.filterChoice = "update";
  }
}