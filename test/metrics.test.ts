import { expect } from 'chai'
import { User, UserHandler } from '../src/user'
import { Metric, MetricsHandler } from '../src/metrics'
import { LevelDB } from "../src/leveldb"
import { callbackify } from 'util'

const dbPath: string = 'db_test'
var dbMet: MetricsHandler
var dbUser: UserHandler

describe('Metrics', function () {
    this.beforeEach(function () {
        LevelDB.clear(dbPath);
        dbMet = new MetricsHandler(dbPath);
        dbUser = new UserHandler(dbPath);
    })
    this.afterEach(function () {
        dbMet.close();
        dbUser.close();
    })

    describe('#getAllMetrics', function () {
        it('should get empty array on non existing group', function (done) {
            dbMet.getAllMetrics('metrics_', (err: Error | null, result?: Metric[] | null) => {
                expect(err).to.be.null;
                expect(result).to.not.be.undefined;
                expect(result).to.be.empty;
                done()
            });
        });
    });
});