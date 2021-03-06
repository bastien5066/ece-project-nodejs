# ECE Paris - Final Project NodeJS 
<img src="https://talentsdunumerique.com/sites/default/files/public/logo-ece-2018.jpg" height="200px">

## Information
**ECE Paris S7 - NodeJS Project**  
**Courses** - Web Technology - NodeJS & DevOps-RSE  
**Teachers** - Sergei KUDINOV &  Grégor JOUET  
**Deadline** - 24/12/19  
**Promotion** - 2021  
**Class** - SI Inter Gr03  
**Contributors** - [Bastien LE GUERN](https://github.com/bastien5066) [Matthieu LELEU](https://github.com/Leleute)   

## Overview
The project in itself is a simple web API with a dashboard composed of :
* ##### API side  
    - Authenticate 
    - CRUD users 
    - CRUD metrics' user 
* ##### Front side 
    - Homepage
    - Sign In/Sign Up/Sign Out
    - Insert/Update/Delete metrics once logged in
    - Retrieve the user’s metrics and display it on a Graph 
    - Only access the user’s metrics, not the other ones
* ##### Utils 
    - Pre-populate the database with at least 2 users and their own metrics

## Specification
* Continuous testing Travis CI : [![Build Status](https://travis-ci.org/bastien5066/ece-project-nodejs.svg?branch=master)](https://travis-ci.org/bastien5066/ece-project-nodejs)
* Coverage : [![Coverage Status](https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_90.svg)](https://coveralls.io/r/boennemann/badges)
* Stable release version: ![version](https://img.shields.io/badge/version-4.4.5-blue)
* **Tested on Google Chrome**

## Installation - Without Docker 
This project uses node and npm. Go check them out if you don't have them locally installed.    
To check if you have Node.js installed, run this command in your terminal: 

```sh
$ node -v
```

To confirm that you have npm installed you can run this command in your terminal:

```sh
$ npm -v
```

To copy this project on your computer :

```sh
$ git clone "https://github.com/bastien5066/ece-project-nodejs.git"
```

Go to the project directory and install the depedencies required for this project by running the command : 

```sh
$ npm install
```
### Usage 

* ##### Pre-populate database
Go to the project directory, and run : 

```sh
$ npm run populate
```

The following users will be created with their own metrics :  
**address:** test1@email.com **username:** test1 **password:** password1   
**address:** test2@email.com **username:** test2 **password:** password2  
**address:** test3@email.com **username:** test3 **password:** password3  

* #####  Start project - Test environment
Go to the project directory, and run : 

```sh
$ npm test
```

* ##### Start project - Dev environment
Go to the project directory, and run either : 

```sh
$ npm start
```
or this command to run NodeJS with NoDemon :

```sh
$ npm run dev
```

Then, the application has been started and is listening and port 8080. Thus, open your Internet browser and enter the following URL :

 ```sh
http://localhost:8080/
```

## Installation - With Docker
**Does not include testing with npm test**   
**Tests must be launched without Docker : see above at 'Start project - Dev environment' section (npm install is required before launching testing at the project root)**  
To copy this project on Desktop :

```sh
$ git clone "https://github.com/bastien5066/ece-project-nodejs.git"
```
Go to the project directory and run the following command to build the container :

```sh
$ docker build -t [PROJECT-NAME] .   
```

Now run the container : 

```sh
$ docker run -it -d -p [PORT-CHOSEN]:8080 [PROJECT-NAME]
```

### Usage 

The LevelDB database was automatically pre-populated by Dockerfile.  
Now to use the application, open your Internet browser and if no errors were thrown during the installation :  
The application is accessible for Windows OS at the URL:

```sh
http://192.168.99.100:[PORT-CHOSEN]/

```

The application is accessible for other Docker's supported OS at the URL:

```sh
http://localhost:[PORT-CHOSEN]/

```


## Dependencies
<img src="https://david-dm.org/boennemann/badges.svg">  

## Grading 
NodeJS grading criterias : [here](https://github.com/adaltas/ece-nodejs/blob/2019-fall-5-modules/PROJECT.md)

DevOps grading criterias : 
- Use git, use branches, use tags 
- Project must have tests with a testing framework (depending on the language used)
- If project uses external dependencies such as a database, use docker-compose to start it before the test session.
- Configure your project to use a CI server
- Provide a "README" file explaining how to launch the project, how to launch the tests, what problems your had

## Problems encountered
* Configuration of Travis CI
* Docker containerisation
* Github's branches management
* Testing phase & compatibility with LevelDB 
* Setting up the README file correctly
* Asynchronous functions
* Testing in containerisation : problems occured between the container and leveldb. It seemed that leveldb couldn't create and access (limited right ?) the leveldb folders that should contain users and their metrics. Below is the problem encountered in Docker Quickstart Terminal :
    ```sh
    Uncaught OpenError: IO error: ./db_test/users/LOCK: No such file or directory 
    ```


## License
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)  
This project is licensed under the MIT License - see the [LICENSE](https://github.com/bastien5066/ece-project-nodejs/blob/master/LICENSE) file for details

## Acknowledgments/Sources
* Sergei KUDINOV
* Grégor JOUET
* [StackOverflow](https://stackoverflow.com/)
* [NPM](https://www.npmjs.com/)
* [Docker Documentation](https://docs.docker.com/)
* [Github](https://github.com/)

## Enjoy our program !

We hope you will enjoy our application ! It was a real pleasure to develop this application !  
If any issues are found, let us know [here](https://github.com/bastien5066/ece-project-nodejs/issues) !  

[![forthebadge](https://forthebadge.com/images/badges/built-by-developers.svg)](http://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/uses-badges.svg)](http://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/uses-css.svg)](http://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/uses-git.svg)](http://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/uses-html.svg)](http://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](http://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](http://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](http://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/validated-html5.svg)](http://forthebadge.com)


