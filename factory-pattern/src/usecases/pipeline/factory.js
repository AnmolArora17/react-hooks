// Factory: Return appropriate parser based on content type

class JsonParser {
  parse(input) {
    const data = JSON.parse(input);
    return Array.isArray(data) ? data : [data];
  }
}

class CsvParser {
  parse(input) {
    const [headerLine, ...rows] = input.trim().split(/\r?\n/);
    const headers = headerLine.split(',').map((h) => h.trim());
    return rows.map((row) => {
      const cols = row.split(',');
      return headers.reduce((acc, h, i) => { acc[h] = cols[i]?.trim(); return acc; }, {});
    });
  }
}

class XmlParser {
  // Minimal XML parser for demo purposes (not for production!)
  parse(input) {
    // Expect format: <items><item><k>v</k>...</item>...</items>
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(input))) {
      const itemXml = match[1];
      const kvRegex = /<([a-zA-Z0-9_]+)>([\s\S]*?)<\/\1>/g;
      const obj = {};
      let m;
      while ((m = kvRegex.exec(itemXml))) {
        obj[m[1]] = m[2].trim();
      }
      items.push(obj);
    }
    return items;
  }
}

function createParser({ contentType }) {
  switch (contentType) {
    case 'application/json': return new JsonParser();
    case 'text/csv': return new CsvParser();
    case 'application/xml': return new XmlParser();
    default: throw new Error(`Unsupported content type: ${contentType}`);
  }
}

module.exports = { createParser };