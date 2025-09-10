// Count all formulas/models in the registry
import { modelFormulaRegistry } from '../src/data/modelFormulaRegistry.js';

let totalFormulas = 0;
console.log('=== SUPPLY CHAIN OPTIMIZATION MODELS COUNT ===\n');

modelFormulaRegistry.forEach(model => {
  console.log(`${model.name}: ${model.formulas.length} formulas`);
  totalFormulas += model.formulas.length;
});

console.log(`\n🎯 TOTAL FORMULAS/MODELS: ${totalFormulas}`);
console.log(`📊 Total Model Categories: ${modelFormulaRegistry.length}`);