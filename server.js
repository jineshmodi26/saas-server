const express = require('express');
const cors = require('cors');

const moviesRouter = require("./routes/movies.router")
const reviewsRouter  = require("./routes/reviews.router")
const app = express();

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:80'] // Whitelist the domains you want to allow
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/movies", moviesRouter)
app.use("/reviews", reviewsRouter)

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
