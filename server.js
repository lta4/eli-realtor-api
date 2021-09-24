const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const expressPlayground = require('graphql-playground-middleware-express').default;

const schema = buildSchema(`
    type Query {
        movieInfo(id: Int!): Movie
        movieList(rate: String): [Movie]
    },
    type Movie {
        id: Int
        title: String
        rate: String
        year: Int
    }
`);

const moviesList = [
    {
        "title": "Avengers: Endgame",
        "rate": "8.7",
        "year": 2019
    },
    {
        "title": "John Wick: Chapter 3 - Parabellum",
        "rate": "7.9",
        "year": 2019
    },
    {
        "title": "Once Upon a Time ... in Hollywood",
        "rate": "8.5",
        "year": 2019
    },
    {
        "title": "Jurassic World: Fallen Kingdom",
        "rate": "6.5",
        "year": 2018
    },
    {
        "title": "Blade Runner 2049",
        "rate": "8",
        "year": 2017
    }
]

const getMovie = function(args) {
    const id = args.id;
    return moviesList.filter(movie => {
        return movie.id == id;
    })[0];
}

const getMovies = function(args) {
    if (args.rate) {
        const rate = args.rate;
        return moviesList.filter(movie => movie.rate === rate);
    } else {
        return moviesList;
    }
}

const root = {
    movieInfo: getMovie,
    movieList: getMovies,
};

const app = express();
app.use('/graphql' , graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

// app.get('/', (req, res) => {
//     res.send('Hello world');
// });

const port = process.env.PORT || "4000";
app.listen(port, () => console.log(`Listening On: http://localhost:${port}/graphql`));