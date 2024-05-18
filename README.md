# Favorite Products API

This is a Node.js, MongoDB, Express API with GraphQL and REST endpoints for managing favorite products.

## Installation

### Install Dependencies

```sh
npm install
```

### Setup environment variables

Create a .env file with the MongoDB credentials:

```env
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_CLUSTER_ADDRESS=your-db-cluster-address
DB_NAME=your-db-name
```

## Endpoints

### GraphQL Endpoint

You can interact with the GraphQL API using the GraphiQL interface:

URL: http://localhost:3001/graphql

### Sample Queries

Retrieve all favorite products:

```graphql
query {
  favorites {
    id
    name
    description
    price
  }
}

```

Add a favorite product:

```graphql
mutation {
  addFavorite(id: "1", name: "Product Name", description: "Product Description", price: 10.99) {
    id
    name
    description
    price
  }
}
```

Remove a favorite product:

```graphql
mutation {
  removeFavorite(id: "1")
}
```

## REST Endpoints

- GET /api/favorites: Retrieve all favorite products.
- POST /api/favorite: Add a new favorite product.
- DELETE /api/favorite/:id: Remove a favorite product by ID.

## Technologies Used

- Node.js
- Express.js
- GraphQL
- MongoDB (with Mongoose)
- REST API

## License

This project is licensed under the MIT License - see the LICENSE file for details. Feel free to customize this readme file further based on your specific project requirements and preferences.