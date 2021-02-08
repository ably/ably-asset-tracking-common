const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const jsonschema = require('jsonschema');

const geoDir = path.resolve(__dirname, '..', 'test-resources', 'geo');
const exampleDir = path.resolve(geoDir, 'locations');
const examples = fs.readdirSync(exampleDir);
const schema = require(path.resolve(geoDir, 'location-schema.json'));

describe('Location schema', () => {
  examples.forEach((fileName) => {
    const instance = JSON.parse(fs.readFileSync(path.resolve(exampleDir, fileName)));

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
