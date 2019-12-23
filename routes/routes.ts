/*  
    routes.ts : TypeScript that handles all routes that are being asked by server.ts
    Used to display pages, display elements on pages, process requests, process data manipulation, etc
*/

import { User, UserHandler } from '../src/user'
import { Metric } from '../src/metrics';

const db = new UserHandler('./db/users', './db/metrics')
const bcrypt = require('bcryptjs');

/**
 * Function to print the homepage 
   Accessed on /login path
 * @param req 
 * @param res 
 */
function printHomepage(req: any, res: any) {
    if (!req.session.loggedIn) {
        res.render("homepage.ejs", { err: undefined, msg: undefined });
        res.end();
    } else {
        res.redirect('/user/' + req.session.user.username);
        res.end();
    }
}

/**
 * Function which is called when a user is trying to access or create his account
   Check if the account exists, retrieve his data if so, otherwise print a error message
   Or check if the all information provided by the user can be used to create a new account
   Accessed on /sign-up or /sign-in path
 * @param req 
 * @param res 
 */
function checkCredentials(req: any, res: any) {
    if (req.body.user_name === undefined) {
        let connected: any = [];
        db.getAllUser((err: Error | null, result: User[] | null) => {
            if (!err && result != null) {
                if (result.length != 0) {
                    new Promise((resolve, reject) => {
                        result.forEach(function (element: any) {
                            if (element.email == req.body.user_mail) {
                                if (bcrypt.compareSync(req.body.user_password, element.password)) {
                                    connected.push(new User(element.email, element.username, req.body.user_password, element.metrics, true));
                                }
                            }
                        });
                        resolve();
                    }).then(() => {
                        if (connected.length != 0) {
                            req.session.loggedIn = true
                            req.session.user = connected[0]
                            res.redirect('/user/' + connected[0].getUsername())
                        } else {
                            res.render('../views/homepage.ejs', { err: true, msg: "Sorry, the e-mail address and password you entered did not match any account in our records. Please check your entries and try again." });
                        }
                    });
                } else {
                    //res.render('../views/homepage.ejs', { err: true, msg: "Sorry, the e-mail address and password you entered did not match any account in our records. Please check your entries and try again." });
                }
            } 
        });

    } else {
        let email: any = [];
        if (!req.body.user_mail.includes("@")) {
            res.render('../views/homepage.ejs', { err: true, msg: "Sorry, you didn't enter a proper e-mail address." })
        } else if (req.body.user_password !== req.body.user_confirm_password) {
            res.render('../views/homepage.ejs', { err: true, msg: "Sorry, password doesn't match confirmation." })
        } else {
            db.getAllUser((err: Error | null, result: User[] | null) => {
                if (!err && result != null) {
                    if (result.length != 0) {
                        result.forEach(function (element: any) {
                            if (element.email === req.body.user_mail) {
                                email.push(element.email)
                            }
                        })
                        if (email.length == 0) {
                            let newUser: User = new User(req.body.user_mail, req.body.user_name, req.body.user_password, [], false);
                            db.addUser([newUser], (err: Error | null) => {
                                if (err) throw err
                            });
                            res.render('../views/homepage.ejs', { err: false, msg: "Your account has successfully been created ! Use your e-mail and password to access your XtreMetrics account." })
                        } else {
                            res.render('../views/homepage.ejs', { err: true, msg: " Sorry, this e-mail address is already in use. Please try another e-mail." })
                        }
                    } 
                } 
            });

        }
    }
}

/**
 * Function to print the profile of the connected user
   Accessed on /user/:username path 
 * @param req 
 * @param res 
 */
function printProfile(req: any, res: any) {   
    if (req.session.user == undefined) {
        res.redirect('/login')
    } else if (req.params.username != req.session.user.username) {
        res.redirect('/login')
    } else {
        res.render("profile.ejs", { userEmail: req.session.user.email, userName: req.session.user.username, userPassword: req.session.user.password, userMetrics: JSON.stringify(req.session.user.metrics), err: undefined, msg: undefined });
    }
}

/**
 * Function to logout the user in the session
   Redirect to /login path to print the homepage
   Accessed on /logout path
 * @param req 
 * @param res 
 */
function logout(req: any, res: any) {
    delete req.session.loggedIn
    delete req.session.user
    res.redirect('/login')
}

/**
 * Function to delete the profile of a user
   Redirect to /logout path to reinitialise data in session
   Accessed on /user/:username/profile/delete path
 * @param req 
 * @param res 
 */
function deleteProfile(req: any, res: any) {
    db.remove([req.session.user.email], (err: Error | null) => {
        if (err) throw err
        else {
            res.redirect('/logout')
        }
    })
}

/**
 * Function to edit the profile of a user
   Accessed on /user/:username/profile/edit path
 * @param req 
 * @param res 
 */
function editProfile(req: any, res: any) {
    let email: any = [];
    let previousEmail: any = req.session.user.email;
    let saveUser: User = new User(req.body.user_mail, req.body.user_name, req.body.user_password, [], false)
    req.session.user.metrics.forEach(function (data) {
        saveUser.addMetric(new Metric(data.timestamp, data.height, data.weight));
    });
    let newUser: User = new User(req.body.user_mail, req.body.user_name, req.body.user_password, req.session.user.metrics, true)
    if (!req.body.user_mail.includes("@")) {
        res.render('profile.ejs', { userEmail: req.session.user.email, userName: req.session.user.username, userPassword: req.session.user.password, userMetrics: JSON.stringify(req.session.user.metrics), err: true, msg: "Sorry, you didn't enter a proper e-mail address." })
    } else {
        db.getAllUser((err: Error | null, result: User[] | null) => {
            if (err) throw err;
            if (result !== null) {
                new Promise((resolve, reject) => {
                    result.forEach(function (element: any) {
                        if (element.email == req.body.user_mail && req.session.user.email != req.body.user_mail) {
                            email.push(element.email)
                        }
                    })
                    resolve();
                }).then(() => {
                    if (email.length != 0) {
                        res.render('profile.ejs', { userEmail: req.session.user.email, userName: req.session.user.username, userPassword: req.session.user.password, userMetrics: JSON.stringify(req.session.user.metrics), err: true, msg: "Sorry, this e-mail address is already in use. Please try another e-mail." })
                    } else {
                        db.remove([req.session.user.email], (err: Error | null) => {
                            if (err) throw err
                            else {
                                db.add([saveUser], (err: Error | null) => {
                                    if (err) throw err
                                    else {
                                        req.session.user = newUser
                                        res.render('profile.ejs', { userEmail: newUser.getEmail(), userName: newUser.getUsername(), userPassword: newUser.getPassword(), userMetrics: JSON.stringify(newUser.getMetrics()), err: false, msg: "Your account has successfully been modified !" })
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}

/**
 * Function to get the metrics of a user to display them on the profile
   Used to reload a graph after updation/deletion of data
   Accessed on /user/:username/metrics/read, /user/:username/metrics/update/:id and /user/:username/metrics/delete/:id path
 * @param req 
 * @param res 
 */
function printMetrics(req: any, res: any) {
    db.getUser(req.session.user.email, (err: Error | null, result: User | null) => {
        if (err) throw err
        if (result != null) {
            req.session.user = result;
            res.status(200).send(result.getMetrics())
        }
    });
}

/**
 * Function to create a metric of a user
   Accessed on /user/:username/metrics/create path
 * @param req 
 * @param res 
 */
function createMetric(req: any, res: any) {
    var timestamp = new Date().toLocaleDateString().replace('/', '-').replace('/', '-') + "~" + new Date().toLocaleTimeString()
    db.addUserMetric('metrics_' + req.session.user.email, new Metric(timestamp, req.body.metric_height, req.body.metric_weight), (err: Error | null) => {
        if (err) throw err
    })
    res.status(204).send()
}

/**
 * Function to update a metric of a user
   Accessed on /user/:username/metrics/update/:id path
 * @param req 
 * @param res 
 */
function updateMetric(req: any, res: any) {
    var timestamp = req.params.id.split('_')[2]
    db.updateUserMetric(req.params.id, new Metric(timestamp, req.body.metric_height, req.body.metric_weight), (err: Error | null) => {
        if (err) throw err
    })
    res.status(204).send()
}

/**
 * Function to delete a metric of a user
   Accessed on /user/:username/metrics/delete/:id path
 * @param req 
 * @param res 
 */
function deleteMetric(req: any, res: any) {
    db.removeUserMetric(req.params.id, (err: Error | null) => {
        if (err) throw err
    })
    res.status(204).send()

}

/**
 * Function to set a filter for a research of a certain value in the database and to display it on graph
   Accessed on /user/:username/metrics/read/filter path
 * @param req 
 * @param res 
 */
function setFilter(req: any, res: any) {
    if (req.body.idfilter_timestamp_update == undefined) {
        db.setFilterDeleteMetric(req.body.idfilter_timestamp_delete, req.body.idfilter_height_delete, req.body.idfilter_weight_delete)
    } else {
        db.setFilterUpdateMetric(req.body.idfilter_timestamp_update, req.body.idfilter_height_update, req.body.idfilter_weight_update)
    }
    res.status(204).send()
}

/**
 * Function to redirect the user to root page if the path entered is incorrect
 * @param req
 * @param res 
 */
function defaultGateway(req: any, res: any) {
    res.redirect('/login');
}


module.exports = { printHomepage, printProfile, defaultGateway, checkCredentials, logout, deleteProfile, editProfile, createMetric, updateMetric, deleteMetric, printMetrics, setFilter }