const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const PORT = 5000;

const authors = [
    {id: 1, name:'J.K. Rowling'},
    {id: 2, name:'J.R.R. Tolkein'},
    {id: 3, name:'GRRM'}
];

const books = [
    {id: 1, name:"Half Blood Prince", authorId: 1},
    {id: 2, name:"ASOIAF", authorId: 3},
    {id: 3, name:"Lord of the rings", authorId: 2}
];

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description:"This represents author of a book",
    fields: ()=>({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {
            type: GraphQLList(BookType),
            resolve: (author)=>{
                return books.filter(book => book.authorId == author.id);
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name: "Book",
    description:"This represents a book written by an author",
    fields: ()=>({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve:(book) => {
                return authors.find(author => author.id == book.authorId);
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        book: {
            type: BookType,
            description: 'A single Book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id == args.id)
        },
        author: {
            type: AuthorType,
            description: 'Single Author',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(author=> author.id == args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of Authors',
            resolve: () => authors
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutations",
    description: "Root Mutation",
    fields: () => ({
        addBook: {
            type: BookType, //Returns a book type,
            description: 'Add a Book',
            args:{
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parents, args) => {
                const book = {id: books.length+1, name:args.name, authorId: args.authorId};
                books.push(book);
                return book;
            }
        },
        addAuthor: {
            type: AuthorType, //Returns a book type,
            description: 'Add an Author',
            args:{
                name: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parents, args) => {
                const author = {id: authors.length+1, name:args.name};
                books.push(author);
                return author;
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});