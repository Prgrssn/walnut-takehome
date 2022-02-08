const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");
PORT = 8080;

app.use(cors());
app.use(express.json());

API_URL = `http://localhost:${PORT}`;

let recipesData = [];

const getRecipesData = () => {
  fs.readFile("./data/data.json", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    recipesData = JSON.parse(data);
  });
};

getRecipesData();

app.get("/cookbook", (_req, res) => {
  res.json(recipesData);
});

app.get("/recipes", (_req, res) => {
  const recipes = recipesData.recipes.map((recipe) => {
    return {
      name: recipe.name,
    };
  });
  res.status(200).json(recipes);
});

app.listen(PORT, () => {
  console.log(`Express server running on port: ${PORT}`);
});
