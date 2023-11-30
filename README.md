# Polls site

## Resources:

- ### Setup:
  [Link](https://www.youtube.com/watch?v=I7EDAR2GRVo&list=PLTTRe0KtcwppaNQVMphNLptpKV7BK9hmQ&index=1)

- ### JWT AUTH
  [Link](https://cambass.medium.com/jwt-authentication-with-node-express-passport-and-mongodb-445a7fca5893)

- ### React hooks: (I used just useState and useContext in my implementation)
  [Link](https://www.youtube.com/watch?v=LlvBzyy-558&t=1s)

## Setup
I used React + NodeJS + MongoDB

## Client side
App has 3 components: Navbar, Body and Footer, in which I used useContext in order to access IDs of users/polls in each component.

### **Navbar**
There are 5 components in Navbar: logo and 4 buttons, which are displayed depending on the log status of the users.

- **Register**
  In register modal, I verified if the password typed has a minimum length of 8 chars and maximum of 32 chars and also matched the one typed in confirm password input text, then its hash is stored in database. User email has to be unique in database and contain '@gmail.com'.

- **Login**
  Generated a token and saved in cookies credentials for logging in.

- **Create poll**
  Each poll must have a title, 3 options and a type of answer.

### **Body**
Relation between a poll and a user is that the user whose ID is associated to the poll is the owner of it and is allowed to delete it from the page. Every time a poll is created/deleted, the page is updated to the modified database by fetching the route which returns all polls. If the user who is currently logged in tries to delete a poll without being the owner of it, an error message will be returned. 

### **Footer**
Icons hide links to social media pages.

## Server side
Created a model for user and one for poll. Used CORS in order to add/delete/retrieve data from database in requests. Define routes to return all users/polls currently stored in database, create a user/poll, login a user, delete a poll by ID, get a user by ID. Used mongoose to interact with the database and Thunder Client VSCode extension for debugging the response of requests / the functionality of the operations implemented.
