const knex = require('../database/knex');
const DiskStorage = require('../providers/DiskStorage');

class DishesController {
  async create(request, response) {
    const { title, description, category, ingredients, price } = request.body;

    const imgFileName = request.file.filename;
    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(imgFileName);

    const dish_id = await knex('dishes').insert({
      img: filename,
      title,
      description,
      price,
      category
    });

    const hasOnlyOneIngredient = typeof ingredients === 'string';

    let ingredientsInsert;
    if (hasOnlyOneIngredient) {
      ingredientsInsert = {
        name: ingredients,
        dish_id
      };
    } else if (ingredients.length > 1) {
      ingredientsInsert = ingredients.map(ingredient => {
        return {
          name: ingredient,
          dish_id
        };
      });
    } else {
      return;
    }

    await knex('ingredients').insert(ingredientsInsert);

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await knex('dishes').where({ id }).first();
    const ingredients = await knex('ingredients')
      .where({ dish_id: id })
      .orderBy('name');

    return response.json({
      ...dish,
      ingredients
    });
  }

  async index(request, response) {
    const { title, ingredients } = request.query;

    let dishes;

    if (ingredients) {
      const filterIngredients = ingredients.split(',').map(tag => tag.trim());

      dishes = await knex('ingredients')
        .select([
          'dishes.id',
          'dishes.title',
          'dishes.description',
          'dishes.price',
          'dishes.img'
        ])
        .whereLike('dishes.title', `%${title}%`)
        .whereIn('name', filterIngredients)
        .innerJoin('dishes', 'dishes.id', 'ingredients.dishes_id')
        .groupBy('dishes.id')
        .orderBy('dishes.title');
    } else {
      dishes = await knex('dishes')
        .whereLike('title', `%${title}%`)
        .orderBy('title');
    }

    const listIngredients = await knex('ingredients');

    const dishesWithIngredients = dishes.map(dish => {
      const dishIngredients = listIngredients.filter(
        ingredient => ingredient.dish_id === dish.id
      );

      return {
        ...dish,
        ingredients: dishIngredients
      };
    });

    return response.json(dishesWithIngredients);
  }

  async update(request, response) {
    const { title, description, ingredients, price } = request.body;
    const { id } = request.params;

    const imgFileName = request.file.filename;
    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(imgFileName);

    const dish = await knex('dishes').where({ id }).first();

    dish.title = title ?? dish.title;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;
    dish.img = filename ?? dish.img;

    const ingredientsInsert = ingredients.map(name => ({
      name,
      dish_id: dish.id
    }));

    await knex('dishes').where({ id }).update(dish);
    await knex('ingredients').where({ dish_id: id }).delete();
    await knex('ingredients').insert(ingredientsInsert);

    return response.json();
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex('dishes').where({ id }).delete();

    return response.json();
  }
}

module.exports = DishesController;
