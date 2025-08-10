const { createParser } = require('./factory');
const { SchemaValidator, Deduplicator, Enricher } = require('./chain');

async function runPipelineDemo() {
  // Choose one input and its content type
  const csv = 'id,name\n1,Alice\n2,Bob\n2,Bob';
  const json = JSON.stringify([{ id: '3', name: 'Carla' }, { id: '4', name: 'Dan' }]);
  const xml = '<items><item><id>5</id><name>Eve</name></item><item><id>6</id><name>Frank</name></item></items>';

  const inputs = [
    { contentType: 'text/csv', data: csv },
    { contentType: 'application/json', data: json },
    { contentType: 'application/xml', data: xml },
  ];

  for (const input of inputs) {
    const parser = createParser({ contentType: input.contentType });
    const records = parser.parse(input.data);

    // Build processing chain: validate -> deduplicate -> enrich
    const validator = new SchemaValidator({ requiredFields: ['id', 'name'] });
    const dedup = new Deduplicator({ key: 'id' });
    const enrich = new Enricher({ enrichFn: (r) => ({ nameUpper: String(r.name).toUpperCase() }) });
    validator.setNext(dedup).setNext(enrich);

    const result = await validator.handle(records);
    console.log(`[Pipeline] ${input.contentType} ->`, result);
  }
}

module.exports = { runPipelineDemo };

if (require.main === module) {
  runPipelineDemo();
}