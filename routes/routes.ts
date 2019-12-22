import { User, UserHandler } from '../src/user'
import { Metric } from '../src/metrics';

const db = new UserHandler('./db/users', './db/metrics')

function printHomepage(req: any, res: any) {
    console.log("-----------------------")
    console.log(req.session)
    if (!req.session.loggedIn) {
        res.render("homepage.ejs", { err: undefined, msg: undefined });
        res.end();
    } else {
        res.redirect('/user/' + req.session.user.username);
        res.end();
    }
}

function checkCredentials(req: any, res: any) {
    console.log(req.body);

    if (req.body.user_name === undefined) {
        var userConnected: any;
        let connected = false;
        console.log("sign-in");
        db.getAllUser((err: Error | null, result: User[] | null) => {
            console.log("YOOOOOOO")
            if (!err && result != null) {
                console.log(result)
                if (result.length != 0) {
                    console.log("NEXXXTTT")
                    result.forEach(function (element: any) {
                        console.log(element.email)
                        console.log(element.password)
                        console.log(req.body.user_mail)
                        console.log(req.body.user_password)
                        if (element.email == req.body.user_mail && element.password == req.body.user_password) {
                            console.log("in")
                            connected = true;
                            userConnected = new User(element.email, element.username, element.password, element.metrics)
                        }
                    })
                    console.log(connected)
                    if (connected) {
                        req.session.loggedIn = true
                        req.session.user = userConnected
                        res.redirect('/user/' + userConnected.getUsername())
                    } else {
                        res.render('../views/homepage.ejs', { err: true, msg: "Sorry, the e-mail address and password you entered did not match any account in our records. Please check your entries and try again." });
                    }
                } else {
                    //res.render('../views/homepage.ejs', { err: true, msg: "Sorry, the e-mail address and password you entered did not match any account in our records. Please check your entries and try again." });
                }
            } else {
                console.log(err)
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
                            let newUser: User = new User(req.body.user_mail, req.body.user_name, req.body.user_password, []);
                            db.addUser([newUser], (err: Error | null) => {
                                if (err) console.log(err);
                            });
                            res.render('../views/homepage.ejs', { err: false, msg: "Your account has successfully been created ! Use your e-mail and password to access your XtreMetrics account." })
                        } else {
                            res.render('../views/homepage.ejs', { err: true, msg: " Sorry, this e-mail address is already in use. Please try another e-mail." })
                        }
                    } else {
                        /*let newUser: User = new User(req.body.user_mail, req.body.user_name, req.body.user_password, []);
                        db.addUser([newUser], (err: Error | null) => {
                            if (err) console.log(err);
                        });
                        res.render('../views/homepage.ejs', { err: false, msg: "Your account has successfully been created ! Use your e-mail and password to access your XtreMetrics account." })   
                        */
                    }
                } else {
                    console.log(err)
                }
            });

        }
    }
}

function printProfile(req: any, res: any) {
    console.log("req.session.user")
    console.log(req.session.user)
    if (req.session.user == undefined) {
        res.redirect('/login')
    } else if (req.params.username != req.session.user.username) {
        res.redirect('/login')
    } else {
        console.log(JSON.stringify(req.session.user.metrics))
        res.render("profile.ejs", { userEmail: req.session.user.email, userName: req.session.user.username, userPassword: req.session.user.password, userMetrics: JSON.stringify(req.session.user.metrics), err: undefined, msg: undefined });
    }
}

function logout(req: any, res: any) {
    delete req.session.loggedIn
    delete req.session.user
    console.log(req.session)
    res.redirect('/login')
}

function deleteProfile(req: any, res: any) {
    console.log("DELETE PROFILE")
    console.log(req.session.user.email);
    db.remove([req.session.user.email], (err: Error | null) => {
        if (err) throw err
        else {
            res.redirect('/logout')
        }
    })
}

function editProfile(req: any, res: any) {
    let email: any = [];
    let previousEmail: any = req.session.user.email;
    let saveUser: User = new User(req.body.user_mail, req.body.user_name, req.body.user_password, [])
    req.session.user.metrics.forEach(function (data) {
        saveUser.addMetric(new Metric(data.timestamp, data.height, data.weight));
    });
    console.log("REQ SESSION")
    console.log(req.session)
    let newUser: User = new User(req.body.user_mail, req.body.user_name, req.body.user_password, req.session.user.metrics)
    if (!req.body.user_mail.includes("@")) {
        res.render('profile.ejs', { userEmail: req.session.user.email, userName: req.session.user.username, userPassword: req.session.user.password, userMetrics: JSON.stringify(req.session.user.metrics), err: true, msg: "Sorry, you didn't enter a proper e-mail address." })
    } else {
        db.getAllUser((err: Error | null, result: User[] | null) => {
            if (!err) {
                if (result !== null) {
                    result.forEach(function (element: any) {
                        console.log(req.body.user_mail)
                        if (element.email == req.body.user_mail && previousEmail != req.body.user_mail) {
                            email.push(element.email)
                        }
                    })
                } else {
                    console.log('callback result is null')
                }             
               
            }
        });
          if (email.length != 0) {
                    res.render('profile.ejs', { userEmail: req.session.user.email, userName: req.session.user.username, userPassword: req.session.user.password, userMetrics: JSON.stringify(req.session.user.metrics), err: true, msg: "Sorry, this e-mail address is already in use. Please try another e-mail." })
                } else {
                    db.remove([req.session.user.email], (err: Error | null) => {
                        if (err) throw err
                    });
                    db.add([saveUser], (err: Error | null) => {
                        if (err) throw err 
                        else {
                            console.log(newUser)
                            req.session.user = newUser
                            res.render('profile.ejs', { userEmail: newUser.getEmail(), userName: newUser.getUsername(), userPassword: newUser.getPassword(), userMetrics: JSON.stringify(newUser.getMetrics()), err: false, msg: "Your account has successfully been modified !" })
                        }                     
                    })
               }
    }
}

function printMetrics(req: any, res: any) {
    console.log("------------------------- print metrics ")
    console.log(req.session.user.email)
    db.getUser(req.session.user.email, (err: Error | null, result: User | null) => {
        if (err) throw err
        if (result != null) {
            console.log(result)
            req.session.user = result;
            res.status(200).send(result.getMetrics())
        }
    });
}

function createMetric(req: any, res: any) {
    var timestamp = new Date().toLocaleDateString().replace('/', '-').replace('/', '-') + "~" + new Date().toLocaleTimeString()
    db.addUserMetric('metrics_' + req.session.user.email, new Metric(timestamp, req.body.metric_height, req.body.metric_weight), (err: Error | null) => {
        if (err) throw err
        else {
            console.log("done")
        }
    })
    res.status(204).send()
}


function updateMetric(req: any, res: any) {
    console.log("UPDATE METRIC")
    console.log(req.body)
    var timestamp = req.params.id.split('_')[2]
    db.updateUserMetric(req.params.id, new Metric(timestamp, req.body.metric_height, req.body.metric_weight), (err: Error | null) => {
        if (err) throw err
        else {
            console.log("updated !")
        }
    })
    res.status(204).send()
}

function deleteMetric(req: any, res: any) {
    console.log("DELETE METRIC")
    console.log(req.params.id)
    db.removeUserMetric(req.params.id, (err: Error | null) => {
        if (err) throw err
        else {
            console.log("done")

        }
    })
    console.log(req.session.user)
    res.status(204).send()

}

function setFilter(req: any, res: any) {
    if (req.body.idfilter_timestamp_update == undefined) {
        db.setFilterDeleteMetric(req.body.idfilter_timestamp_delete, req.body.idfilter_height_delete, req.body.idfilter_weight_delete)
    } else {
        db.setFilterUpdateMetric(req.body.idfilter_timestamp_update, req.body.idfilter_height_update, req.body.idfilter_weight_update)
    }
    res.status(204).send()
}


function defaultGateway(req: any, res: any) {
    res.redirect('/login');
}


module.exports = { printHomepage, printProfile, defaultGateway, checkCredentials, logout, deleteProfile, editProfile, createMetric, updateMetric, deleteMetric, printMetrics, setFilter }