
import { modelFormulaRegistry } from "../src/data/modelFormulaRegistry";

// Example expected categories; update as new ones are added!
const expectedCategories = [
  "Transportation",
  "Inventory",
  "Location",
  "Network",
  "Algorithms",
  "Simulation",
  "Fleet",
  "Resilience",
  "Finance",
];

function checkCoverage() {
  const models = modelFormulaRegistry;
  const foundCategories = models.map(m => m.category);

  // Category coverage
  const missing = expectedCategories.filter(cat => !foundCategories.includes(cat));
  if (missing.length) {
    console.error("Missing categories: " + missing.join(", "));
  } else {
    console.log("All expected categories present.");
  }
  // Formula check per model
  models.forEach(model => {
    if (!model.formulas || model.formulas.length === 0) {
      console.error(`No formulas found for ${model.name}`);
    } else {
      console.log(`${model.name}: ${model.formulas.length} formulas`);
    }
  });
  // Formula ID uniqueness
  const allIds = models.flatMap((m) => m.formulas.map(f => f.id));
  const duplicates = allIds.filter((id, idx, arr) => arr.indexOf(id) !== idx);
  if (duplicates.length) {
    console.error("Duplicate formula IDs: " + duplicates.join(", "));
  }
}

checkCoverage();
