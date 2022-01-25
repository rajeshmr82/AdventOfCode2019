import run from "aocrunner";
import { stringify } from "querystring";
import { Queue } from "../common/Queue.js";

const parseInput = (rawInput: string) => rawInput;

class Recipe {
  name: string;
  quantity: number = 0;
  ingredients: { ingredient: string; quantity: number }[] = [];
  constructor(name: string) {
    //const tokens = input.trim().split(" ");
    this.name = name;
    //this.quantity = parseInt(tokens[0]);
  }

  public addIngredient(ingredient: string, quantity: number) {
    this.ingredients.push({ ingredient: ingredient, quantity: quantity });
  }
}

const readRecipes = (input: string[]) => {
  const recipies: Map<string, Recipe> = new Map();
  for (const item of input) {
    const tokens = item.split("=>");
    const details = tokens[1].trim().split(" ");
    let element: Recipe = new Recipe(details[1]);
    recipies.has(element.name)
      ? (element = recipies.get(element.name))
      : recipies.set(element.name, element);
    if (details.length > 1) element.quantity = parseInt(details[0]);
    addIngredients(tokens[0], element, recipies);
  }

  return recipies;
};

const addIngredients = (
  input: string,
  chemical: Recipe,
  recipies: Map<string, Recipe>,
) => {
  const tokens = input.match(/([^,]+)/g);

  tokens?.forEach((t) => {
    const tokens = t.trim().split(" ");
    if (tokens[1] !== "") {
      let component = recipies.get(tokens[1]);
      if (component == undefined) {
        component = new Recipe(tokens[1]);
        recipies.set(component.name, component);
      }
      chemical.addIngredient(component.name, parseInt(tokens[0]));
    }
  });
};

const findOreRequired = (recipies: Map<string, Recipe>, amount: number) => {
  let supply: { [key: string]: any } = {};
  let queue = new Queue();
  queue.enqueue({ ingredient: "FUEL", amount: amount });
  let oreRequired = 0;
  while (!queue.isEmpty()) {
    const order: any = queue.dequeue();

    if (order.ingredient == "ORE") {
      oreRequired += order.amount;
    } else if (order.amount <= supply[order.ingredient]) {
      supply[order.ingredient] -= order.amount;
    } else {
      const amountRequired = order.amount - (supply[order.ingredient] || 0);
      const recipe: Recipe = recipies.get(order.ingredient);

      let batches = Math.ceil(amountRequired / recipe.quantity);
      for (const ingredient of recipe.ingredients) {
        queue.enqueue({
          ingredient: ingredient["ingredient"],
          amount: ingredient.quantity * batches,
        });
      }
      supply[order.ingredient] = batches * recipe.quantity - amountRequired;
    }
  }
  return oreRequired;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");

  let recipies = readRecipes(input);

  let oreRequired = findOreRequired(recipies, 1);

  return oreRequired;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");

  let recipies = readRecipes(input);

  let upper = null,
    lower = 1,
    capacity = 1000000000000;

  while (lower + 1 != upper) {
    let guess: any =
      upper == null ? lower * 2 : Math.floor((upper + lower) / 2);
    let oreRequirement = findOreRequired(recipies, guess);
    if (oreRequirement > capacity) upper = guess;
    else lower = guess;
  }

  return lower;
};

run({
  part1: {
    tests: [
      {
        input: `
171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX     
        `,
        expected: 2210736,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX
        `,
        expected: 460664,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
