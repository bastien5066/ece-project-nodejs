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

describe('----------------- METRICS TEST & USER TEST-----------------', function () {
    before(function () {
        LevelDB.clear(dbPath);
        LevelDB.clear(dbPathMetrics);
        LevelDB.clear(dbPathUsers);
        dbUser = new UserHandler(dbPathUsers, dbPathMetrics);
        dbMet = dbUser.getMetricsHandler()
    });

    after(function () {
        dbMet.close((err: Error | null, result?: Metric[] | null) => {
            if (err) throw err
        });
        dbUser.close((err: Error | null, result?: Metric[] | null) => {
            if (err) throw err
        });
    });
    describe('----------------- METRICS TEST -----------------', function () {
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
        describe('#getAllUsers & #getAllMetrics', function () {
            it('should get empty array on non existing group of users and thus metrics', function (done) {
                dbUser.getAllUser((err: Error | null, result?: User[] | null) => {
                    expect(err).to.be.null;
                    expect(result).to.not.be.undefined;
                    expect(result).to.be.empty;
                    done()
                });

            });
        });

        describe('#add and #get - One user', function () {
            let user: User = new User('test@email.fr', "test", "password", [new Metric("Test", 1, 1), new Metric("Test2", 25, 14)])
            it('should add a user and his metrics in the database', function (done) {
                dbUser.add([user], (err: Error | null) => {
                    expect(err).to.be.null;
                });
                done()
            });
            it('should RETRIEVE the users with his metrics ADDED in the database', function (done) {
                dbUser.getAllUser((err: Error | null, result: User[] | null) => {
                    expect(err).to.be.null;
                    expect(result).to.not.be.null;
                    expect(result).to.not.be.undefined;

                    if (result != null) {
                        result.forEach(function (element) {
                            expect(element).to.have.property('email')
                            expect(element).to.have.property('username');
                            expect(element).to.have.property('password');
                            expect(element).to.have.property('metrics');

                            expect(element.getEmail()).to.be.a('string');
                            expect(element.getEmail()).to.equal('test@email.fr');

                            expect(element.getUsername()).to.be.a('string');
                            expect(element.getUsername()).to.equal('test');

                            expect(element.getPassword()).to.be.a('string');
                            expect(element.getPassword()).to.equal('password');

                            expect(element.getMetrics()).to.not.be.empty;
                            expect(element.getMetrics()).to.be.a('array');
                            expect(element.getMetrics()).to.have.length(2);

                            element.getMetrics().forEach(function (data) {
                                expect(data).to.have.property('timestamp')
                                expect(data).to.have.property('height');
                                expect(data).to.have.property('weight');
                                expect(data.getTimestamp()).to.be.oneOf(['Test', 'Test2']);
                                expect(data.getHeight()).to.be.oneOf([1, 25]);
                                expect(data.getWeight()).to.be.oneOf([1, 14]);
                            });

                        });
                    }
                });
                done()
            });
        });
        describe('#add and #get - Several users', function () {
            let user: User[] = [
                new User('test1@email.fr', "test1", "password", [new Metric("Test1.0", 1, 1), new Metric("Test1.1", 25, 14)]),
                new User('test2@email.fr', "test2", "password", [new Metric("Test2.0", 1, 1), new Metric("Test2.1", 25, 14)]),
                new User('test3@email.fr', "test3", "password", [new Metric("Test3.0", 1, 1), new Metric("Test3.1", 25, 14)]),
            ]
            it('should add a user and his metrics in the database', function (done) {
                dbUser.add([user], (err: Error | null) => {
                    expect(err).to.be.null;
                });
                done()
            });
            it('should RETRIEVE the users with his metrics ADDED in the database', function (done) {
                dbUser.getAllUser((err: Error | null, result: User[] | null) => {
                    expect(err).to.be.null;
                    expect(result).to.not.be.null;
                    expect(result).to.not.be.undefined;

                    if (result != null) {
                        result.forEach(function (element) {
                            expect(element).to.have.property('email')
                            expect(element).to.have.property('username');
                            expect(element).to.have.property('password');
                            expect(element).to.have.property('metrics');

                            expect(element.getEmail()).to.be.a('string');
                            expect(element.getEmail()).to.equal('test@email.fr');

                            expect(element.getUsername()).to.be.a('string');
                            expect(element.getUsername()).to.equal('test');

                            expect(element.getPassword()).to.be.a('string');
                            expect(element.getPassword()).to.equal('password');

                            expect(element.getMetrics()).to.not.be.empty;
                            expect(element.getMetrics()).to.be.a('array');
                            expect(element.getMetrics()).to.have.length(2);

                            element.getMetrics().forEach(function (data) {
                                expect(data).to.have.property('timestamp')
                                expect(data).to.have.property('height');
                                expect(data).to.have.property('weight');
                                expect(data.getTimestamp()).to.be.oneOf(['Test', 'Test2']);
                                expect(data.getHeight()).to.be.oneOf([1, 25]);
                                expect(data.getWeight()).to.be.oneOf([1, 14]);
                            });

                        });
                    }
                });
                done()
            });
        });
    });
});