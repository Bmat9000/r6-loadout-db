'use strict';

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const outputDir = path.join(__dirname, '..', 'output');

console.log('Reading data files...');

const operators = JSON.parse(fs.readFileSync(path.join(dataDir, 'operators.json'), 'utf8'));
const weapons = JSON.parse(fs.readFileSync(path.join(dataDir, 'weapons.json'), 'utf8'));
const gadgets = JSON.parse(fs.readFileSync(path.join(dataDir, 'gadgets.json'), 'utf8'));

const weaponsById = {};
weapons.forEach((w) => { weaponsById[w.id] = w; });

const gadgetsById = {};
gadgets.forEach((g) => { gadgetsById[g.id] = g; });

console.log(`Resolving ${operators.length} operator(s)...`);

const fullOperators = operators.map((op) => {
  const resolved = Object.assign({}, op);

  resolved.primaryWeapons = (op.primaryWeapons || []).map((id) => {
    const weapon = weaponsById[id];
    if (!weapon) console.warn(`  WARNING: weapon "${id}" not found for operator "${op.id}"`);
    return weapon || { id };
  });

  resolved.secondaryWeapons = (op.secondaryWeapons || []).map((id) => {
    const weapon = weaponsById[id];
    if (!weapon) console.warn(`  WARNING: weapon "${id}" not found for operator "${op.id}"`);
    return weapon || { id };
  });

  resolved.gadgets = (op.gadgets || []).map((id) => {
    const gadget = gadgetsById[id];
    if (!gadget) console.warn(`  WARNING: gadget "${id}" not found for operator "${op.id}"`);
    return gadget || { id };
  });

  if (op.uniqueGadget) {
    const unique = gadgetsById[op.uniqueGadget];
    if (!unique) console.warn(`  WARNING: unique gadget "${op.uniqueGadget}" not found for operator "${op.id}"`);
    resolved.uniqueGadget = unique || { id: op.uniqueGadget };
  }

  console.log(`  ✔ Resolved operator: ${op.name}`);
  return resolved;
});

const outputPath = path.join(outputDir, 'operators.full.json');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(fullOperators, null, 2), 'utf8');

console.log(`\nDone! Output written to: ${outputPath}`);
console.log(`Total operators: ${fullOperators.length}`);
