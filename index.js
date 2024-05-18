const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_ADDRESS}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Define MongoDB schema
const favoriteSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  price: Number,
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

// Define GraphQL schema
const schema = buildSchema(`
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
  }

  type Query {
    favorites: [Product]!
  }

  type Mutation {
    addFavorite(id: ID!, name: String!, description: String!, price: Float!): Product!
    removeFavorite(id: ID!): ID
  }
`);

// Define resolvers for GraphQL
const root = {
  favorites: async () => {
    try {
      const favorites = await Favorite.find();
      return favorites;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  addFavorite: async ({ id, name, description, price }) => {
    try {
      const favorite = new Favorite({ id, name, description, price });
      const newFavorite = await favorite.save();
      return newFavorite;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  removeFavorite: async ({ id }) => {
    try {
      await Favorite.deleteOne({ id: id });
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

// Create Express app
const app = express();

// Add middleware to parse JSON bodies
app.use(express.json());

// REST API endpoints
app.get('/api/favorites', async (req, res) => {
  try {
    const favorites = await Favorite.find();
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/favorite', async (req, res) => {
  const { id, name, description, price } = req.body;
  const favorite = new Favorite({ id, name, description, price });
  try {
    const newFavorite = await favorite.save();
    res.status(201).json(newFavorite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/favorite/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Favorite.deleteOne({ id: id });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GraphQL API endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL for testing
}));

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
