const express     = require('express');
const graphqlHTTP = require('express-graphql');
const app         = express();

const PORT = process.env.PORT || 4000;

const schema = require('./schema')

app.use('/', graphqlHTTP({
	schema,
	graphiql: true
}))

app.listen(PORT)
console.log('Listening ...')
