const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const { Validator } = require('jsonschema');

const geoDir = path.resolve(__dirname, '..', 'test-resources', 'geo');
const testDataDir = path.resolve(geoDir, 'test-data');
const schemasDir = path.resolve(geoDir, 'schemas');

const jsonschema = new Validator();
jsonschema.addSchema(
  JSON.parse(fs.readFileSync(path.resolve(schemasDir, 'location.json'))),
  'https://schemas.ably.com/json/asset-tracking-common/Location'
);

const locationHistoryDataSchemasDir = path.resolve(schemasDir, 'location-history-data');
const locationHistoryDataSchemaNames = fs
  .readdirSync(locationHistoryDataSchemasDir)
  .filter((fileName) => fileName.endsWith('.json'));

locationHistoryDataSchemaNames.forEach((schemaName) => {
  describe(`Location history data (schema ${schemaName})`, () => {
    const schema = require(path.resolve(locationHistoryDataSchemasDir, schemaName));

    const majorVersion = schemaName.replace('version-', '').split('.')[0];
    const exampleDir = path.resolve(testDataDir, 'location-history-data', `version-${majorVersion}`);
    const examples = fs.readdirSync(exampleDir).filter((fileName) => fileName.endsWith('.json'));

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
});
