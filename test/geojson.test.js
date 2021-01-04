const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const jsonschema = require('jsonschema');

const geoDir = path.resolve(__dirname, '..', 'test-resources', 'geo');
const exampleDir = path.resolve(geoDir, 'examples');
const examples = fs.readdirSync(exampleDir);
const schema = require(path.resolve(geoDir, 'schema.json'));

describe('GeoJson schema', () => {
  examples.forEach(example => {
    const instance = JSON.parse(fs.readFileSync(path.resolve(exampleDir, example)));
    
    it(example, () => {
      const { errors } = jsonschema.validate(instance, schema);
      if (example.split('-')[0] === 'invalid') {
        expect(errors.length).to.be.greaterThan(0);
      } else {
        expect(errors.length).to.equal(0);
      }
    });
  });
});
