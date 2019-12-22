# ECE Paris - Final Project NodeJS 
![alt text](https://talentsdunumerique.com/sites/default/files/public/logo-ece-2018.jpg)

## Information
**ECE Paris S7** - NodeJS Project  
**Courses** - Web Technology - NodeJS & DevOps-RSE  
**Teachers** - Sergei KUDINOV &  Grégor JOUET  
**Deadline** - 24/12/19  
**Promotion** - 2021  
**Contributors** - Bastien LE GUERN Matthieu LELEU

## Project introduction 
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

## Install 
This project uses node and npm. Go check them out if you don't have them locally installed.    
To check if you have Node.js installed, run this command in your terminal: 

```sh
$ node -v
```

To confirm that you have npm installed you can run this command in your terminal:

```sh
$ npm -v
```

To copy this project on Desktop :

```sh
$ git clone "https://github.com/bastien5066/ece-project-nodejs.git"
```
Go to the project directory and install the depedencies required for this project by running the command : 

```sh
$ npm install
```

## Usage 

* ##### Pre-populate database
Go to the project directory, and run : 

```sh
$ npm run populate
```

* #####  Start project - Test environment
Go to the project directory, and run : 

```sh
$ npm run test
```

* ##### Start project - Dev environment
Go to the project directory, and run either : 

```sh
$ npm start
```
or this to run NodeJS with NoDemon :

```sh
$ npm run dev
```

Then, open your Internet browser and enter the following URL :

 ```sh
$ http://localhost:8080/
```


## Grading 
NodeJS grading criterias : [here](https://github.com/adaltas/ece-nodejs/blob/2019-fall-5-modules/PROJECT.md)

DevOps grading criterias : 
- Use git, use branches, use tags 
- Project must have tests with a testing framework (depending on the language used)
- Project uses external dependencies such as a database, use docker-compose to start it before the test session.
- Configure your project to use a CI server
- Provide a "README" file explaining how to launch the project, how to launch the tests, what problems your had

## Problems encountered
* Configuration of Travis CI
* Containerisation

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/bastien5066/ece-project-nodejs/blob/master/LICENSE) file for details


## Acknowledgments
* StackOverflow
* Sergei KUDINOV
* Grégor JOUET

## Enjoy our program

You are done ! You are free to use this application !  
I hope you will enjoy it !

![alt text](https://badge.fury.io/%7B%7Bprogramming_language:js%7D%7D/%7B%7Bproject_name%7D%7D.svg)

