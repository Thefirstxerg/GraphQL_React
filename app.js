const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');


const Event = require('./models/event'); 

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
    // ! Means that the schema field cannot be null
    schema : buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // Resolvers
    rootValue: {
        events: () => {
            Event.find()
                .then(events => {
                    return events.map(event => {
                        return {...event._doc, _id: event.id}; // Return each event with its ID
                    }); // event.id is provided through Mongoose and replaces event._doc._id.toString()
                })
                .catch(err => {
                    console.error('Error fetching events:', err);
                    throw err; // Throw the error to be handled by GraphQL
                });
        },
        createEvent: (args) => {
            // Create a new event instance using the Event model
            // Note: args.eventInput is used to access the input from the GraphQL mutation
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event.save()
                .then(result => {
                    console.log('Event created:', result);
                    return {...result._doc, _id: result.id}; // Return the created event with its ID
                })
                .catch(err => {
                    console.error('Error creating event:', err);
                    throw err; // Throw the error to be handled by GraphQL
                });
            
        }
    },
    graphiql: true
}));

app.get('/', (req, res, next) => {
    res.send('Hello, World!');
});




mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.1wswiyv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {  
        console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
});

