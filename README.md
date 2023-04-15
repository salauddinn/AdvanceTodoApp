##TodoAppp SERVER
It is a NodeJS application using express.
In order to run it locally, you can follow the below steps.
Prerequisite:

1. Node version 18.x to be installed on the system
2. Docker

### To run in local

1. Install dependencies

```bash
npm install
```

2. Create a **.env** file under root(api-server) and set below properties

```bash
MONGO_USERNAME=<value>
MONGO_PASSWORD=<value>
MONGO_HOST=<value>
MONGO_PORT=<value>
MONGO_DB_NAME=<value>
PORT=<value> #FQDN of the git-api-server
```

3. Run in development mode( this will restart the server whenever some src file changes )

```bash
npm run start
```
### To run tests
Use below command to run only unit tests

```bash
npm run test
```
## Spin up local mongo db

1. Run mongodb

```bash
docker-compose up -d
```

2. To check whether the db is up and runnning

```bash
docker ps
```

3. To connect with mongodb from terminal
   1. Install mongosh
   ```bash
   brew install mongosh
   ```
   2. Url to connect with mongodb
   ```bash
   mongosh "mongodb://root:rootpassword@127.0.0.1:27017/test?authSource=admin"
   ```
