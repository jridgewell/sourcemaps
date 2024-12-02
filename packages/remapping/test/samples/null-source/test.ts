import { SourceMapConsumer, type RawSourceMap } from 'source-map';
import remapping from '../../../src/remapping';
import { assertMatchObject } from '../../unit/util';

describe('null-source segement', () => {
  const original: any = {
    version: '3',
    sources: ['source.ts'],
    names: [],
    mappings: 'AAAA,qC,aACA',
    sourcesContent: ["function say(msg) {console.log(msg)};say('hello');\nprocess.exit(1);"],
  };
  const minified: any = {
    version: '3',
    sources: ['source.js'],
    names: ['say', 'msg', 'console', 'log', 'process', 'exit'],
    mappings: 'AAAA,SAASA,IAAIC,GAAMC,QAAQC,IAAIF,GAAMD,IAAI,SAASI,QAAQC,KAAK',
  };

  it('minified code keeps null-source segment', () => {
    const remapped = remapping([minified, original], () => null);
    const consumer = new SourceMapConsumer(remapped as unknown as RawSourceMap);

    const console = consumer.originalPositionFor({
      column: 20,
      line: 1,
    });
    assertMatchObject(console, {
      column: 0,
      line: 1,
      source: 'source.ts',
    });

    const say = consumer.originalPositionFor({
      column: 38,
      line: 1,
    });
    assertMatchObject(say, {
      column: null,
      line: null,
      source: null,
    });

    const exit = consumer.originalPositionFor({
      column: 53,
      line: 1,
    });
    assertMatchObject(exit, {
      column: 0,
      line: 2,
      source: 'source.ts',
    });
  });

  it('null-source', () => {
    const remapped = remapping(original, () => null);
    const consumer = new SourceMapConsumer(remapped as unknown as RawSourceMap);

    const console = consumer.originalPositionFor({
      column: 20,
      line: 1,
    });
    assertMatchObject(console, {
      column: 0,
      line: 1,
      source: 'source.ts',
    });

    const say = consumer.originalPositionFor({
      column: 38,
      line: 1,
    });
    assertMatchObject(say, {
      column: null,
      line: null,
      source: null,
    });

    const exit = consumer.originalPositionFor({
      column: 53,
      line: 1,
    });
    assertMatchObject(exit, {
      column: 0,
      line: 2,
      source: 'source.ts',
    });
  });
});
