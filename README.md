## server code for task management

## Login

# signup method [creates new user,stores data to db]

# login method [login the user,send them access token,refresh token,stores refresh token to refertokens collection in db]

# access-token [if access token expires user can get new one with refresh token,

# but when refresh token expires logout the user from device,user need to sign in again]

# tasks routes are allowed only with valid access token , which is checked with middleware

## task

# Get All,update one, add one, delete one

## Mongo DB used
