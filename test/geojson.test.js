const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const jsonschema = require('jsonschema');

const geoDir = path.resolve(__dirname, '..', 'test-resources', 'geo');
const examples = fs.readdirSync(geoDir);
const schema = require(path.resolve(geoDir, 'schema.json'));

describe('GeoJson schema', () => {
  examples.filter(fileName => fileName !== 'schema.json').forEach(fileName => {
    const instance = JSON.parse(fs.readFileSync(path.resolve(geoDir, fileName)));
    
    it(fileName, () => {
      const { errors } = jsonschema.validate(instance, schema);
      if (fileName.split('-')[0] === 'invalid') {
        expect(errors.length).to.be.greaterThan(0);
      } else {
        expect(errors.length).to.equal(0);
      }
    });
  });
});
