# signup-login-logout-api
API for basic signup, login and logout functionality using NodeJS and Cassandra

## Install

- NodeJS
- Cassandra
- Postman

## Build

```sh
npm install
node index.js
```

## Setup database

```sh
cqlsh -f db_scripts/user.cql 
```


## Testing in Postman

- **Signup**: `POST localhost:3000/api/register`


	Request body:
```sh
{
    "firstname": "FNAME",
    "lastname": "LNAME",
    "username": "UNAME",
    "password": "pwd",
    "password2": "pwd"
}
```
- **Login**: `POST localhost:3000/api/login`


	Request body: 
```sh
{
    "username": "UNAME",
    "password": "pwd"
}
```
- **Profile**: `GET localhost:3000/api/profile`

- **Logout**: `GET localhost:3000/api/logout`

## References

- [Signup/Login/Logout application using NodeJS and MongoDB](https://medium.com/@sarthakmittal1461/to-build-login-sign-up-and-logout-restful-apis-with-node-js-using-jwt-authentication-f3d7287acca2)

- [How To Use Cassandra for Beginners — Node.js](https://www.instaclustr.com/support/documentation/cassandra/using-cassandra/connect-to-cassandra-with-node-js/)

- [Connect to Apache Cassandra with Node.js](https://www.instaclustr.com/support/documentation/cassandra/using-cassandra/connect-to-cassandra-with-node-js/)

- [Building an Express.js application with Session Handling](https://radiostud.io/simple-express-application-session-handling)

- [Session Management in Node.js using ExpressJS and Express Session](https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/)
