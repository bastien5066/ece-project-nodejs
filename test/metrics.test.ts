/**
 * metrics.test.ts : TypeScript test file
 * Handle all the tests with mocha and chai
 */

import { expect } from 'chai'
import { User, UserHandler } from '../src/user'
import { Metric, MetricsHandler } from '../src/metrics'
import { LevelDB } from "../src/leveldb"

const dbPath: string = './db_test/'
const dbPathMetrics: string = './db_test/metrics'
const dbPathUsers: string = './db_test/users'
const bcrypt = require('bcryptjs');
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
        dbMet.close((err: Error | null) => {
            if (err) throw err
        });
        dbUser.close((err: Error | null) => {
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
        let oneMetric: Metric = new Metric('TestMetric', 0, 0)
        describe('#add and #get', function () {
            it('should ADD a metric in the database and GET the metric added', function (done) {
                new Promise((resolve, reject) => {
                    dbMet.add('metrics', [oneMetric], (err: Error | null) => {
                        expect(err).to.be.null;
                        resolve();
                    });
                }).then(() => {
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

        });

        let updatedMetric: Metric = new Metric('TestMetric', 1, 1)
        describe('#update and #get', function () {
            it('should UPDATE THE EXISTING metric in the database with the SAME KEY as sent & RETRIEVE the metric UPDATED', function (done) {
                new Promise((resolve, reject) => {
                    dbMet.add('metrics', [updatedMetric], (err: Error | null) => {
                        expect(err).to.be.null;
                        resolve()
                    });
                }).then(() => {
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
                    });
                    done();
                });

            });
        });
        describe('#removeOne and #get', function () {
            it('should REMOVE THE EXISTING metric in the database with the SAME KEY as sent', function (done) {
                new Promise((resolve, reject) => {
                    dbMet.removeOne('metrics_' + updatedMetric.getTimestamp(), (err: Error | null) => {
                        expect(err).to.be.null;
                        resolve()
                    });
                }).then(() => {
                    dbMet.getAllMetrics('metrics', (err: Error | null, result?: Metric[] | null) => {
                        expect(err).to.be.null;
                        expect(result).to.not.be.undefined;
                        expect(result).to.be.empty;
                        done()
                    });
                });
            });
        });
        describe('#removeAll and #get', function () {
            let metrics: Metric[] = [new Metric('TestMetric1', 1, 1), new Metric('TestMetric2', 1, 1), new Metric('TestMetric3', 1, 1)]
            it('should ADD some metrics in the database to be deleted with different keys', function (done) {
                new Promise((resolve, reject) => {
                    dbMet.add('metrics', metrics, (err: Error | null) => {
                        expect(err).to.be.null;
                        resolve()
                    });
                }).then(() => {
                    new Promise((resolve, reject) => {
                        dbMet.del('metrics', metrics, (err: Error | null) => {
                            setTimeout(function(){
                                expect(err).to.be.null;
                                resolve();
                            },200)                           
                        });
                    }).then(() => {
                        dbMet.getAllMetrics('metrics', (err: Error | null, result?: Metric[] | null) => {
                            expect(err).to.be.null;
                            expect(result).to.not.be.undefined;
                            expect(result).to.be.empty;
                            done()
                        });
                    });
                });
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
        let oneUser: User = new User('test@email.fr', "test", "password", [new Metric("Test", 1, 1), new Metric("Test2", 25, 14)], false)
        describe('#add and #get - One user', function () {
            it('should add a user and his metrics in the database', function (done) {
                new Promise((resolve, reject) => {
                    dbUser.add([oneUser], (err: Error | null) => {
                        expect(err).to.be.null;
                        resolve()
                    });
                }).then(() => {
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
                                expect(bcrypt.compareSync("password", element.getPassword())).to.equal(true);
                                expect(bcrypt.compareSync("anythingElse", element.getPassword())).to.equal(false);

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
        describe('#remove and #get - One user', function () {
            it('should REMOVE THE EXISTING user in the database we just inserted', function (done) {
                new Promise((resolve, reject) => {
                    dbUser.remove([oneUser.getEmail()], (err: Error | null) => {
                        expect(err).to.be.null;
                        resolve();
                    });

                }).then(() => {
                    dbUser.getAllUser((err: Error | null, result?: User[] | null) => {
                        expect(err).to.be.null;
                        expect(result).to.not.be.undefined;
                        expect(result).to.be.empty;
                        done();
                    });
                })
            });

        });
        let user: User[] = [
            new User('test1@email.fr', "test1", "password1", [new Metric("Test1.0", 1, 1), new Metric("Test1.1", 25, 14)], false),
            new User('test2@email.fr', "test2", "password2", [new Metric("Test2.0", 45, 4), new Metric("Test2.1", 65, 55)], false),
            new User('test3@email.fr', "test3", "password3", [new Metric("Test3.0", 56, 44), new Metric("Test3.1", 99, 74)], false),
        ]
        describe('#add and #get - Several users', function () {
            it('should ADD some users and their metrics in the database', function (done) {
                new Promise((resolve, reject) => {
                    dbUser.add(user, (err: Error | null) => {
                        expect(err).to.be.null;
                        resolve()
                    });
                }).then(() => {
                    dbUser.getAllUser((err: Error | null, result: User[] | null) => {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                        expect(result).to.not.be.undefined;

                        if (result != null) {
                            result.forEach(function (user) {
                                expect(user).to.have.property('email')
                                expect(user).to.have.property('username');
                                expect(user).to.have.property('password');
                                expect(user).to.have.property('metrics');

                                expect(user.getEmail()).to.be.a('string');
                                expect(user.getEmail()).to.be.oneOf(['test1@email.fr', 'test2@email.fr', 'test3@email.fr']);

                                expect(user.getUsername()).to.be.a('string');
                                expect(user.getUsername()).to.be.oneOf(['test1', 'test2', 'test3']);

                                expect(user.getPassword()).to.be.a('string');
                                if (user.getUsername() == 'test1') expect(bcrypt.compareSync("password1", user.getPassword())).to.equal(true);
                                else if (user.getUsername() == 'test2') expect(bcrypt.compareSync("password2", user.getPassword())).to.equal(true);
                                else if (user.getUsername() == 'test3') expect(bcrypt.compareSync("password3", user.getPassword())).to.equal(true);
                                expect(bcrypt.compareSync("anythingElse", user.getPassword())).to.equal(false);

                                expect(user.getMetrics()).to.not.be.empty;
                                expect(user.getMetrics()).to.be.a('array');
                                expect(user.getMetrics()).to.have.length(2);

                                user.getMetrics().forEach(function (data) {
                                    expect(data).to.have.property('timestamp')
                                    expect(data).to.have.property('height');
                                    expect(data).to.have.property('weight');
                                    expect(data.getTimestamp()).to.be.oneOf(['Test1.0', 'Test1.1', 'Test2.0', 'Test2.1', 'Test2.2', 'Test3.0', 'Test3.1']);
                                    expect(data.getHeight()).to.be.oneOf([1, 45, 56, 25, 65, 99]);
                                    expect(data.getWeight()).to.be.oneOf([1, 44, 4, 14, 55, 74]);
                                });
                            });
                        }
                    });
                    done();
                });

            });
        });
        let updatedUsers: User[] = [
            new User('test1@email.fr', "updatedUser1", "updatedPassword1", [new Metric("Test1.0", 10, 11), new Metric("Test1.1", 52, 9)], false),
            new User('test2@email.fr', "updatedUser2", "updatedPassword2", [new Metric("Test2.0", 99, 41), new Metric("Test2.1", 65, 22)], false),
            new User('test3@email.fr', "updatedUser3", "updatedPassword3", [new Metric("Test3.0", 52, 5), new Metric("Test3.1", 69, 33)], false),
        ]
        describe('#update and #get', function () {
            it('should UPDATE some users data and their metrics in the database', function (done) {
                new Promise((resolve, reject) => {
                    dbUser.add(updatedUsers, (err: Error | null) => {
                        expect(err).to.be.null;
                        resolve()
                    });
                }).then(() => {
                    dbUser.getAllUser((err: Error | null, result: User[] | null) => {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                        expect(result).to.not.be.undefined;

                        if (result != null) {
                            result.forEach(function (user) {
                                expect(user).to.have.property('email')
                                expect(user).to.have.property('username');
                                expect(user).to.have.property('password');
                                expect(user).to.have.property('metrics');

                                expect(user.getEmail()).to.be.a('string');
                                expect(user.getEmail()).to.be.oneOf(['test1@email.fr', 'test2@email.fr', 'test3@email.fr']);

                                expect(user.getUsername()).to.be.a('string');
                                expect(user.getUsername()).to.be.oneOf(['updatedUser1', 'updatedUser2', 'updatedUser3']);

                                expect(user.getPassword()).to.be.a('string');
                                if (user.getUsername() == 'updatedUser1') expect(bcrypt.compareSync("updatedPassword1", user.getPassword())).to.equal(true);
                                else if (user.getUsername() == 'updatedUser2') expect(bcrypt.compareSync("updatedPassword2", user.getPassword())).to.equal(true);
                                else if (user.getUsername() == 'updatedUser3') expect(bcrypt.compareSync("updatedPassword3", user.getPassword())).to.equal(true);
                                expect(bcrypt.compareSync("anythingElse", user.getPassword())).to.equal(false);

                                expect(user.getMetrics()).to.not.be.empty;
                                expect(user.getMetrics()).to.be.a('array');
                                expect(user.getMetrics()).to.have.length(2);

                                user.getMetrics().forEach(function (data) {
                                    expect(data).to.have.property('timestamp')
                                    expect(data).to.have.property('height');
                                    expect(data).to.have.property('weight');
                                    expect(data.getTimestamp()).to.be.oneOf(['Test1.0', 'Test1.1', 'Test2.0', 'Test2.1', 'Test2.2', 'Test3.0', 'Test3.1']);
                                    expect(data.getHeight()).to.be.oneOf([10, 99, 52, 52, 65, 69]);
                                    expect(data.getWeight()).to.be.oneOf([11, 41, 5, 9, 22, 33]);
                                });

                            });
                        }
                    });
                    done();
                });
            });
        });
        describe('#remove and #get - Several users', function () {
            it('should REMOVE ALL THE EXISTING users & THEIR METRICS in the database', function (done) {
                new Promise((resolve, reject) => {
                    dbUser.remove([updatedUsers[0].getEmail(), updatedUsers[1].getEmail(), updatedUsers[2].getEmail()], (err: Error | null) => {
                        expect(err).to.be.null;
                        resolve();
                    });
                }).then(() => {
                    dbUser.getAllUser((err: Error | null, result?: User[] | null) => {
                        expect(err).to.be.null;
                        expect(result).to.not.be.undefined;
                        expect(result).to.be.empty;
                        done()
                    });
                });
            });
        });
    });
});