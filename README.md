# signup-login-logout-api
API for basic signup, login and logout functionality

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
cqlsh -f signup-logout-login-api/db_scripts/user.cql 
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

