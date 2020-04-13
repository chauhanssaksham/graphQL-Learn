const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');

const PORT = 5000;

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'HelloWorld',
        fields: ()=>({
            message: {
                type: GraphQLString,
                resolve: () => 'Hello World'
            }
        })
    })
});

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});