# e-commerce-api
E-Commerce Api for handling basic actions from business and customers perspective

Tech stack

- Postgres with typeorm and manual migrations
- Dockarized
- Local LLM - Ollama with mistral


## How to run the app
- Install docker desktop
- Install node (project build with v22.8.0)
- Run following commands

```
npm install

make build

make up
```

### For creating DB tables using migration
```
make migration-create name=any-name-of-table
```

### For downloading LLM model
The LLM container doesn't pull any model by default, running below command you can pull model of your choice
```
curl -X POST \
-H "Content-Type: application/json" \
-d '{"name":"mistral"}' \
 http://localhost:11434/api/pull
```

## Endpoints
1. Users
   1. **GET** `/users/all` - Returns all app users
   2. **GET** `/users?username=alice` - Returns specific users
   3. **POST** `/users` body `{"username":"bob", "name":"Bob La","email":"bob@gmail.com", "password": "test-password"}` - Adds new user
   4. **POST** `/users/update` body `{"username":"alice1", "name":"alice","email":"alice@gmail.com","password":"this-is-password"}` - Updates user with provided username
   5. **DELETE** `/users/1` - Deletes user with id 1
2. Jokes
   1. **GET** `/jokes` - Returns joke using the local LLM (uses LLM mistral default)
   

## Testing
### Get User
Run below curl to get user
```
curl -i -X GET -H 'Content-Type: application/json' http://localhost:3000/users\?username=alice
```
### Insert User
Run below curl to insert user
```
curl -i -X POST -H 'Content-Type: application/json' -d '{"username":"bob", "name":"Bob La","email":"bob@gmail.com", "password": "test-password"}' http://localhost:3000/users
```
### Delete User
Run below curl to delete user by id
```
curl -i -X DELETE -H 'Content-Type: application/json' http://localhost:3000/users/4
```

### Get Joke
Run below curl to get a joke from LLM
```
curl -i -X GET -H 'Content-Type: application/json' http://localhost:3000/jokes
```