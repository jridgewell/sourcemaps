// This is an approximation of Chrome's source map decoding.
// https://source.chromium.org/chromium/chromium/src/+/main:v8/tools/sourcemap.mjs;drc=7a90c32032759a1596fb9a0549cced1b89f42c5f

exports.SourceMap = SourceMap;
function SourceMap(sourceMappingURL, payload) {
  if (!SourceMap.prototype._base64Map) {
    const base64Digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    SourceMap.prototype._base64Map = {};
    for (let i = 0; i < base64Digits.length; ++i)
      SourceMap.prototype._base64Map[base64Digits.charAt(i)] = i;
  }

  this._sourceMappingURL = sourceMappingURL;
  this._reverseMappingsBySourceURL = {};
  this._mappings = [];
  // this._sources = {};
  // this._sourceContentByURL = {};
  this._parseMappingPayload(payload);
}

SourceMap.prototype = {
  /**
   * @param {SourceMapV3} mappingPayload
   */
  _parseMappingPayload(mappingPayload) {
    if (mappingPayload.sections) this._parseSections(mappingPayload.sections);
    else this._parseMap(mappingPayload, 0, 0);
  },

  /**
   * @param {Array.<SourceMapV3.Section>} sections
   */
  _parseSections(sections) {
    for (let i = 0; i < sections.length; ++i) {
      const section = sections[i];
      this._parseMap(section.map, section.offset.line, section.offset.column);
    }
  },

  /**
   * @override
   */
  _parseMap(map, lineNumber, columnNumber) {
    let sourceIndex = 0;
    let sourceLineNumber = 0;
    let sourceColumnNumber = 0;
    let nameIndex = 0;

    const sources = map.sources;

    const stringCharIterator = new SourceMap.StringCharIterator(map.mappings);
    let sourceURL = sources[sourceIndex];

    while (true) {
      if (stringCharIterator.peek() === ',') stringCharIterator.next();
      else {
        while (stringCharIterator.peek() === ';') {
          lineNumber += 1;
          columnNumber = 0;
          stringCharIterator.next();
        }
        if (!stringCharIterator.hasNext()) break;
      }

      columnNumber += this._decodeVLQ(stringCharIterator);
      if (this._isSeparator(stringCharIterator.peek())) {
        this._mappings.push([lineNumber, columnNumber]);
        continue;
      }

      const sourceIndexDelta = this._decodeVLQ(stringCharIterator);
      if (sourceIndexDelta) {
        sourceIndex += sourceIndexDelta;
        sourceURL = sources[sourceIndex];
      }
      sourceLineNumber += this._decodeVLQ(stringCharIterator);
      sourceColumnNumber += this._decodeVLQ(stringCharIterator);
      if (!this._isSeparator(stringCharIterator.peek()))
        nameIndex += this._decodeVLQ(stringCharIterator);

      this._mappings.push([
        lineNumber,
        columnNumber,
        sourceURL,
        sourceLineNumber,
        sourceColumnNumber,
      ]);
    }

    for (let i = 0; i < this._mappings.length; ++i) {
      const mapping = this._mappings[i];
      const url = mapping[2];
      if (!url) continue;
      if (!this._reverseMappingsBySourceURL[url]) {
        this._reverseMappingsBySourceURL[url] = [];
      }
      const reverseMappings = this._reverseMappingsBySourceURL[url];
      const sourceLine = mapping[3];
      if (!reverseMappings[sourceLine]) {
        reverseMappings[sourceLine] = [mapping[0], mapping[1]];
      }
    }
  },

  /**
   * @param {string} char
   * @return {boolean}
   */
  _isSeparator(char) {
    return char === ',' || char === ';';
  },

  /**
   * @param {SourceMap.StringCharIterator} stringCharIterator
   * @return {number}
   */
  _decodeVLQ(stringCharIterator) {
    // Read unsigned value.
    let result = 0;
    let shift = 0;
    let digit;
    do {
      digit = this._base64Map[stringCharIterator.next()];
      result += (digit & this._VLQ_BASE_MASK) << shift;
      shift += this._VLQ_BASE_SHIFT;
    } while (digit & this._VLQ_CONTINUATION_MASK);

    // Fix the sign.
    const negate = result & 1;
    // Use unsigned right shift, so that the 32nd bit is properly shifted
    // to the 31st, and the 32nd becomes unset.
    result >>>= 1;
    if (negate) {
      // We need to OR 0x80000000 here to ensure the 32nd bit (the sign bit
      // in a 32bit int) is always set for negative numbers. If `result`
      // were 1, (meaning `negate` is true and all other bits were zeros),
      // `result` would now be 0. But -0 doesn't flip the 32nd bit as
      // intended. All other numbers will successfully set the 32nd bit
      // without issue, so doing this is a noop for them.
      return -result | 0x80000000;
    }
    return result;
  },

  _VLQ_BASE_SHIFT: 5,
  _VLQ_BASE_MASK: (1 << 5) - 1,
  _VLQ_CONTINUATION_MASK: 1 << 5,
};

SourceMap.StringCharIterator = function StringCharIterator(string) {
  this._string = string;
  this._position = 0;
};

SourceMap.StringCharIterator.prototype = {
  /**
   * @return {string}
   */
  next() {
    return this._string.charAt(this._position++);
  },

  /**
   * @return {string}
   */
  peek() {
    return this._string.charAt(this._position);
  },

  /**
   * @return {boolean}
   */
  hasNext() {
    return this._position < this._string.length;
  },
};
