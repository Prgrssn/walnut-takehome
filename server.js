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

app.get("/recipes/:name", (req, res) => {
  let recipes = recipesData.recipes;
  let recipeName = req.params.name;

  const recipe = recipes.find((n) => {
    return recipeName === n.name;
  });

  if (recipe) {
    res.status(200).json(recipe);
  } else {
    res.status(404).send("This recipe does not exist");
  }
});

app.post("/recipes", (req, res) => {
  let cookbook = {
    recipes: recipesData.recipes,
  };

  let recipesAdd = recipesData.recipes;

  const { name, ingredients, instructions } = req.body;
  const newRecipe = { name, ingredients, instructions };

  const recipeName = recipesAdd.find((i) => i.name === newRecipe.name);

  if (recipeName) {
    return res.status(400).json({ error: "Recipe already exists" });
  } else {
    recipesAdd.push(newRecipe);

    fs.writeFile("./data/data.json", JSON.stringify(cookbook), (err) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log("Successfully created new recipe");
      }
    });

    if (newRecipe) {
      res.status(201).json(newRecipe);
    } else {
      res.status(500).send("recipe not published");
    }
  }
});

app.put("/recipes", (req, res) => {
  let cookbook = {
    recipes: recipesData.recipes,
  };
  const recipeName = req.body.name;
  const selectedRecipe = recipesData.recipes.find(
    (recipe) => recipeName === recipe.name
  );

  if (selectedRecipe) {
    selectedRecipe.name = recipeName;
    selectedRecipe.ingredients = req.body.ingredients;
    selectedRecipe.instructions = req.body.instructions;

    recipesData.recipes.map((recipeInBook) => {
      if (recipeInBook.name === selectedRecipe.name) {
        return (recipeInBook = selectedRecipe);
      }
    });

    fs.writeFile("./data/data.json", JSON.stringify(cookbook), (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json(cookbook);
      }
    });
  } else {
    res.status(404).json({ error: "Recipe does not exist" });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on port: ${PORT}`);
});
