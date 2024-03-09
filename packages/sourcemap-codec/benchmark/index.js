/* eslint-env node */

const { readdirSync, readFileSync } = require('fs');
const { join, relative } = require('path');
const Benchmark = require('benchmark');
const localCode = require('../');
const latestSourcemapCodec = require('jridgewell-sourcemap-codec');
const originalSourcemapCodec = require('sourcemap-codec');
const sourceMap061 = require('source-map');
const sourceMapWasm = require('source-map-wasm');
const sourcemapCodecVersion = require('jridgewell-sourcemap-codec/package.json').version;
const ChromeMap = require('./chrome').SourceMap;

const dir = relative(process.cwd(), __dirname);
const diff = !!process.env.DIFF;

console.log(`node ${process.version}\n`);

function track(label, results, cb) {
  if (global.gc) global.gc();
  const before = process.memoryUsage();
  const ret = cb();
  const after = process.memoryUsage();
  const d = delta(before, after);
  console.log(
    `${label.padEnd(35, ' ')} ${String(d.heapUsed + d.external).padStart(10, ' ')} bytes`,
  );
  results.push({ label, delta: d.heapUsed + d.external });
  return ret;
}

function delta(before, after) {
  return {
    rss: after.rss - before.rss,
    heapTotal: after.heapTotal - before.heapTotal,
    heapUsed: after.heapUsed - before.heapUsed,
    external: after.external - before.external,
    arrayBuffers: after.arrayBuffers - before.arrayBuffers,
  };
}

async function bench(file) {
  const map = JSON.parse(readFileSync(join(dir, file)));
  const encoded = map.mappings;
  const decoded = localCode.decode(encoded);
  const consumer061 = new sourceMap061.SourceMapConsumer(map);
  const consumerWasm = await new sourceMapWasm.SourceMapConsumer(map);
  let bench;

  const segments = decoded.reduce((cur, line) => {
    return cur + line.length;
  }, 0);
  console.log(file, `- ${segments} segments`);
  console.log('');

  {
    console.log('Decode Memory Usage:');
    const results = [];
    track('@jridgewell/sourcemap-codec', results, () => {
      return localCode.decode(encoded);
    });
    if (diff) {
      track(`@jridgewell/sourcemap-codec @latest`, results, () => {
        return latestSourcemapCodec.decode(encoded);
      });
    } else {
      track('sourcemap-codec', results, () => {
        return originalSourcemapCodec.decode(encoded);
      });
      track('source-map-0.6.1', results, () => {
        consumer061._parseMappings(encoded, '');
        return consumer061;
      });
      track('source-map-0.8.0', results, () => {
        consumerWasm.destroy();
        consumerWasm._parseMappings(encoded, '');
        return consumerWasm;
      });
      track('chrome dev tools', results, () => {
        new ChromeMap('url', map);
      });
    }
    const winner = results.reduce((min, cur) => {
      if (cur.delta < min.delta) return cur;
      return min;
    });
    console.log(`Smallest memory usage is ${winner.label}`);
  }

  console.log('');

  console.log('Decode speed:');
  bench = new Benchmark.Suite().add('decode: @jridgewell/sourcemap-codec', () => {
    localCode.decode(encoded);
  });
  if (diff) {
    bench = bench.add(`decode: @jridgewell/sourcemap-codec @latest`, () => {
      latestSourcemapCodec.decode(encoded);
    });
  } else {
    bench = bench
      .add('decode: sourcemap-codec', () => {
        originalSourcemapCodec.decode(encoded);
      })
      .add('decode: source-map-0.6.1', () => {
        consumer061._parseMappings(encoded, '');
      })
      .add('decode: source-map-0.8.0', () => {
        consumerWasm.destroy();
        consumerWasm._parseMappings(encoded, '');
      })
      .add('chrome dev tools', () => {
        new ChromeMap('url', map);
      });
  }
  // add listeners
  bench
    .on('error', ({ error }) => console.error(error))
    .on('cycle', (event) => {
      console.log(String(event.target));
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({});

  console.log('');

  const generator061 = sourceMap061.SourceMapGenerator.fromSourceMap(consumer061);
  const generatorWasm = sourceMapWasm.SourceMapGenerator.fromSourceMap(
    await new sourceMapWasm.SourceMapConsumer(map),
  );

  {
    console.log('Encode Memory Usage:');
    const results = [];
    track('@jridgewell/sourcemap-codec', results, () => {
      return localCode.encode(decoded);
    });
    if (diff) {
      track(`@jridgewell/sourcemap-codec @latest`, results, () => {
        return latestSourcemapCodec.encode(decoded);
      });
    } else {
      track('sourcemap-codec', results, () => {
        return originalSourcemapCodec.encode(decoded);
      });
      track('source-map-0.6.1', results, () => {
        return generator061._serializeMappings();
      });
      track('source-map-0.8.0', results, () => {
        return generatorWasm._serializeMappings();
      });
    }
    const winner = results.reduce((min, cur) => {
      if (cur.delta < min.delta) return cur;
      return min;
    });
    console.log(`Smallest memory usage is ${winner.label}`);
  }

  console.log('');

  console.log('Encode speed:');
  bench = new Benchmark.Suite().add('encode: local code', () => {
    localCode.encode(decoded);
  });
  if (diff) {
    bench = bench.add(`encode: @jridgewell/sourcemap-codec ${sourcemapCodecVersion}`, () => {
      latestSourcemapCodec.encode(decoded);
    });
  } else {
    bench = bench
      .add('encode: sourcemap-codec', () => {
        originalSourcemapCodec.encode(decoded);
      })
      .add('encode: source-map-0.6.1', () => {
        generator061._serializeMappings();
      })
      .add('encode: source-map-0.8.0', () => {
        generatorWasm._serializeMappings();
      });
  }
  // add listeners
  bench
    .on('error', ({ error }) => console.error(error))
    .on('cycle', (event) => {
      console.log(String(event.target));
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({});
}

(async () => {
  const files = readdirSync(dir);
  let first = true;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.endsWith('.map')) continue;

    if (!first) console.log('\n\n***\n\n');
    first = false;

    await bench(file);
  }
})();
