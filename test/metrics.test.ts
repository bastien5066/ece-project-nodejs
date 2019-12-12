import { expect } from 'chai'
import { User, UserHandler } from '../src/user'
import { Metric, MetricsHandler } from '../src/metrics'
import { LevelDB } from "../src/leveldb"
import { callbackify } from 'util'

const dbPath: string = './db_test/'
const dbPathMetrics: string = './db_test/metrics'
const dbPathUsers: string = './db_test/users'
var dbMet: MetricsHandler
var dbUser: UserHandler

describe('----------------- METRICS TEST -----------------', function () {
    before(function () {
        LevelDB.clear(dbPath);
        LevelDB.clear(dbPathMetrics);
        dbMet = new MetricsHandler(dbPathMetrics);
    });

    after(function () {
        dbMet.close((err1: Error | null, result?: Metric[] | null) => {
            if (err1) throw err1
            else console.log("LeveDB metrics closed");
        });        
    });


    describe('#getAllMetrics', function () {
        it('should get empty array on non existing group', function (done) {
            dbMet.getAllMetrics('metrics', (err: Error | null, result?: Metric[] | null) => {
                expect(err).to.be.null;
                expect(result).to.not.be.undefined;
                expect(result).to.be.empty;
                done()
            });

        });
    });

    describe('#add and #get', function () {
        let metric: Metric = new Metric('TestMetric', 0, 0)
        it('should add a metric in the database', function (done) {
            dbMet.add('metrics', [metric], (err: Error | null) => {
                expect(err).to.be.null;
                done()
            });

        });
        it('should RETRIEVE the metric ADDED in the database', function (done) {
            dbMet.getAllMetrics('metrics', (err: Error | null, result: Metric[] | null) => {
                expect(err).to.be.null;
                expect(result).to.not.be.null;
                expect(result).to.not.be.undefined;
                expect(result).to.not.be.empty;
                if (result != null) {
                    result.forEach(function (element) {
                        expect(element).to.have.property('timestamp')
                        expect(element).to.have.property('height');
                        expect(element).to.have.property('weight');

                        expect(element.getTimestamp()).to.be.a('string');
                        expect(element.getTimestamp()).to.equal('TestMetric')
                        expect(element.getHeight()).to.be.a('number');
                        expect(element.getHeight()).to.equal(0)
                        expect(element.getWeight()).to.be.a('number');
                        expect(element.getWeight()).to.equal(0)
                    });
                }
                done()
            });

        });
    });


    describe('#update and #get', function () {
        it('should UPDATE THE EXISTING metric in the database with the SAME KEY', function (done) {
            dbMet.add('metrics', [new Metric('TestMetric', 1, 1)], (err: Error | null) => {
                expect(err).to.be.null;
                done()
            });

        });
        it('should retieve the metric UPDATED in the database', function (done) {
            dbMet.getAllMetrics('metrics', (err: Error | null, result: Metric[] | null) => {
                expect(err).to.be.null;
                expect(result).to.not.be.null;
                expect(result).to.not.be.undefined;
                expect(result).to.not.be.empty;
                if (result != null) {
                    result.forEach(function (element) {
                        expect(element).to.have.property('timestamp')
                        expect(element).to.have.property('height');
                        expect(element).to.have.property('weight');

                        expect(element.getTimestamp()).to.be.a('string');
                        expect(element.getTimestamp()).to.equal('TestMetric')
                        expect(element.getHeight()).to.be.a('number');
                        expect(element.getHeight()).to.equal(1)
                        expect(element.getWeight()).to.be.a('number');
                        expect(element.getWeight()).to.equal(1)
                    });
                }
                done()
            });

        });

    });
    describe('#removeOne and #get', function () {
        it('should REMOVE THE EXISTING metric in the database with the SAME KEY', function (done) {
            dbMet.removeOne('metrics_TestMetric', (err: Error | null) => {
                expect(err).to.be.null;
                done()
            });

        });
        it('should GET empty array after deletion', function (done) {
            dbMet.getAllMetrics('metrics', (err: Error | null, result?: Metric[] | null) => {
                expect(err).to.be.null;
                expect(result).to.not.be.undefined;
                expect(result).to.be.empty;
                done()
            });

        });

    });
    describe('#removeAll and #get', function () {
        let metrics: Metric[] = [new Metric('TestMetric1', 1, 1), new Metric('TestMetric2', 1, 1), new Metric('TestMetric3', 1, 1)]
        it('should ADD some metrics in the database to be deleted with different keys', function (done) {
            dbMet.add('metrics', metrics, (err: Error | null) => {
                expect(err).to.be.null;
                done()
            });

        });
        it('should REMOVE THE EXISTING metric in the database with the SAME KEY', function (done) {
            dbMet.del('metrics', metrics, (err: Error | null) => {
                expect(err).to.be.null;

            });
            done()
        });
        it('should GET empty array after deletion', function (done) {
            dbMet.getAllMetrics('metrics', (err: Error | null, result?: Metric[] | null) => {
                expect(err).to.be.null;
                expect(result).to.not.be.undefined;
                expect(result).to.be.empty;

            });
            done()
        });

    });

});

describe('----------------- USER TEST -----------------', function () {
    before(function () {
        LevelDB.clear(dbPath);
        LevelDB.clear(dbPathMetrics);
        LevelDB.clear(dbPathUsers)
        dbUser = new UserHandler(dbPathUsers);
    });

    after(function () {
        dbUser.close((err1: Error | null, result?: Metric[] | null) => {
            if (err1) throw err1
            else console.log("LeveDB metrics closed");
        });        
    });
    describe('#getAllUsers + #getAllMetrics', function () {
        it('should get empty array on non existing group', function (done) {
            dbUser.getAllUser((err: Error | null, result?: User[] | null) => {
                expect(err).to.be.null;
                expect(result).to.not.be.undefined;
                expect(result).to.be.empty;
                done()
            });

        });
    });

});