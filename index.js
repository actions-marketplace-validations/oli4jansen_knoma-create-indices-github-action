
'use strict'

const core = require('@actions/core');
const { promises: fs } = require('fs');
const { join, extname } = require('path');


const main = async () => {
  const dataDirectory = join(process.env['GITHUB_WORKSPACE'], 'data');

  const fileNames = await fs.readdir(dataDirectory);

  const filenameToIdentifier = {};
  const identifierToTypes = {};

  for (const fileName of fileNames) {
    if (extname(fileName) === '.jsonld') {
      const filePath = join(dataDirectory, fileName);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const document = JSON.parse(fileContent);

      if (!('@id' in document)) {
        continue;
      }

      const identifier = document['@id'];

      filenameToIdentifier[fileName] = identifier;
      identifierToTypes[identifier] = Array.isArray(document['@type']) ? document['@type'] : [document['@type']];
    }
  }

  const filenameToIdentifierIndexPath = join(process.env['GITHUB_WORKSPACE'], '_knoma', 'indices', 'filename_identifier.json');
  const identifierToTypesIndexPath = join(process.env['GITHUB_WORKSPACE'], '_knoma', 'indices', 'identifier_types.json');
  await fs.writeFile(filenameToIdentifierIndexPath, JSON.stringify(filenameToIdentifier, undefined, 2), {encoding:'utf8',flag:'w'})
  await fs.writeFile(identifierToTypesIndexPath, JSON.stringify(identifierToTypes, undefined, 2), {encoding:'utf8',flag:'w'})
}

main().catch(err => {
  console.error(err);
  core.setFailed(err.message);
})