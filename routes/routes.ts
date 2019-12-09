import { User, UserHandler } from '../src/user'

const db = new UserHandler('./db/users')

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
        let userConnected: User;
        let connected = false;
        console.log("sign-in");
        db.getAllUser((err: Error | null, result: User[] | null) => {
            console.log("YOOOOOOO")
            if (!err) {
                console.log(result)
                if (result !== null) {
                    console.log("NEXXXTTT")
                    result.forEach(function (element: any) {
                        console.log(element.email)
                        console.log(element.password)
                        console.log(req.body.user_mail)
                        console.log(req.body.user_password)
                        if (element.email == req.body.user_mail && element.password == req.body.user_password) {
                            connected = true;
                            userConnected = new User(element.email, element.username, element.password, element.metrics)
                        }
                    })
                } else {
                    console.log('callback result is null')
                }
                if (connected) {
                    req.session.loggedIn = true
                    req.session.user = userConnected
                    res.redirect('/user/' + userConnected.getUsername())
                } else {
                    res.render('../views/homepage.ejs', { err: true, msg: "Sorry, the e-mail address and password you entered did not match any account in our records. Please check your entries and try again." });
                }

            } else {
                console.log("err")
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
                if (!err) {
                    if (result !== null) {
                        result.forEach(function (element: any) {
                            if (element.email === req.body.user_mail) {
                                email.push(element.email)
                            }
                        })
                    } else {
                        console.log('callback result is null')
                    }
                    if (email.length == 0) {
                        let newUser: User = new User(req.body.user_mail, req.body.user_name, req.body.user_password, []);
                        db.addUser([newUser], (err: Error | null) => {
                            if (!err) {
                                console.log("Inserted rows !")
                            } else {
                                console.log(err);
                            }
                        });
                        res.render('../views/homepage.ejs', { err: false, msg: "Your account has successfully been created ! Use your e-mail and password to access your XtreMetrics account." })
                    } else {
                        res.render('../views/homepage.ejs', { err: true, msg: " Sorry, this e-mail address is already in use. Please try another e-mail." })
                    }

                } else {
                    console.log(err)
                }
            });
        }

    }

    console.log("snif")
}

function printProfile(req: any, res: any) {
    console.log("req.session.user")
    console.log(req.session.user)
    if (req.session.user == undefined) {
        res.redirect('/login')
    } else if (req.params.username != req.session.user.username) {
        res.redirect('/login')
    } else {
        res.render("profile.ejs", { userEmail: req.session.user.email, userName: req.session.user.username, userPassword: req.session.user.password, userMetrics: req.session.user.metrics, err: undefined, msg: undefined });
    }
}

function logout(req: any, res: any) {
    delete req.session.loggedIn
    delete req.session.user
    console.log(req.session)
    res.redirect('/login')
}

function deleteProfile(req: any, res: any) {
    db.remove(req.session.user.email, (err: Error | null) => {
        if (err) throw err
        else {
            res.redirect('/logout')
        }
    })
}

function editProfile(req: any, res: any) {
    let email: any = [];
    let previousEmail: any = req.session.user.email;
    console.log(req.session)
    let newUser: User = new User(req.body.user_mail, req.body.user_name, req.body.user_password, req.session.user.metrics)
    if (!req.body.user_mail.includes("@")) {
        res.render('profile.ejs', { userEmail: req.session.user.email, userName: req.session.user.username, userPassword: req.session.user.password, userMetrics: req.session.user.metrics, err: true, msg: "Sorry, you didn't enter a proper e-mail address." })
    } else {
        db.getAllUser((err: Error | null, result: User[] | null) => {
            if (!err) {
                if (result !== null) {
                    result.forEach(function (element: any) {
                        console.log("-- element.email")
                        console.log(element.email)
                        console.log("-- req.body.user_mail")
                        console.log(req.body.user_mail)
                         if (element.email == req.body.user_mail && previousEmail != req.body.user_mail) {
                            console.log("******ALREADY EXIST************")
                            email.push(element.email)
                        }
                    })
                } else {
                    console.log('callback result is null')
                }
                console.log("TABLE")
                console.log(email)
                if (email.length != 0) {
                    res.render('profile.ejs', { userEmail: req.session.user.email, userName: req.session.user.username, userPassword: req.session.user.password, userMetrics: req.session.user.metrics, err: true, msg: "Sorry, this e-mail address is already in use. Please try another e-mail." })   
                    res.end()
                } else {
                   
                    console.log("HERRRE WE GO ||||")
                    db.remove(req.session.user.email, (err: Error | null) => {
                        if (err) throw err
                        else {
                            console.log("**********************************")
                            db.add([newUser], (err: Error | null) => {
                                if (err) throw err
                                else {
                                    console.log("donnnnnne")                                   
                                }
                            })
                        }
                    });

                    req.session.user = newUser;
                    res.render('profile.ejs', { userEmail: newUser.getEmail(), userName: newUser.getUsername(), userPassword: newUser.getPassword(), userMetrics: newUser.getMetrics(), err: false, msg: "Your account has successfully been modified !" })
                
                }

            }
        });
    }
}

function defaultGateway(req: any, res: any) {
    res.redirect('/login');
}


module.exports = { printHomepage, printProfile, defaultGateway, checkCredentials, logout, deleteProfile, editProfile }