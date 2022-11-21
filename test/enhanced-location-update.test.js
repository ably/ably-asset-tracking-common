const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const { Validator } = require('jsonschema');

const geoDir = path.resolve(__dirname, '..', 'test-resources', 'geo');
const testDataDir = path.resolve(geoDir, 'test-data');
const exampleDir = path.resolve(testDataDir, 'enhanced-location-updates');
const examples = fs.readdirSync(exampleDir);
const schemasDir = path.resolve(geoDir, 'schemas');
const schema = require(path.resolve(schemasDir, 'enhanced-location-update.json'));

const jsonschema = new Validator();
jsonschema.addSchema(
  JSON.parse(fs.readFileSync(path.resolve(schemasDir, 'location.json'))),
  'https://schemas.ably.com/json/asset-tracking-common/Location'
);

describe('Enhanced Location Update schema', () => {
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
