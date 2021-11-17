const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const { Validator } = require('jsonschema');

const geoDir = path.resolve(__dirname, '..', 'test-resources', 'geo');
const exampleDir = path.resolve(geoDir, 'presence-data');
const examples = fs.readdirSync(exampleDir);
const schema = require(path.resolve(geoDir, 'presence-data-schema.json'));

const jsonschema = new Validator();
jsonschema.addSchema(
  JSON.parse(fs.readFileSync(path.resolve(geoDir, 'resolution-schema.json'))),
  'https://schemas.ably.com/json/asset-tracking-common/Resolution'
);

describe('Presence data schema', () => {
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
