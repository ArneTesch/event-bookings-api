const express = require("express");
const bodyParser = require("body-parser");
// exports 1 function > name at own choice
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQLSchema = require("./grahpql/schemas/index");
const graphqlResolvers = require("./grahpql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(bodyParser.json());

// run on every incoming request, we will have the req.isAuth field in every request of every resolver
app.use(isAuth);
app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQLSchema,
    // Bundle of all resolvers > match names of Schemas
    rootValue: graphqlResolvers,
    graphiql: true
  })
);

app.get("/", (req, res, next) => {
  res.send("hello world");
});

const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-aj600.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3000, () => {
      console.log(`listen on port 3000`);
    });
  })
  .catch(err => {
    console.log("*****", process.env.MONGO_PASSWORD);

    console.log(err);
  });
