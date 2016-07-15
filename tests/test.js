/*global describe, xit, it */

import should from 'should';
import { Tokenizer, tokenize } from '../lib/parser';

function readTokens(toker) {
  let token = null;
  const tokens = [];
  do {
    token = tokenize(toker);
    if (token && token.kind != 'EOF') {
      tokens.push(token);
    }
  } while (token && token.kind != 'EOF');
  return tokens;
}

describe("Tokenizer", () => {
  describe("space", () => {
    it("should parse 1 space.", () => {
      const toker = Tokenizer(' ', 0);
      tokenize(toker).should.be.eql({
        token: ' ', kind: 'space'
      });
    });

    it("should parse 2 space.", () => {
      const toker = Tokenizer('  ', 0);
      tokenize(toker).should.be.eql({
        token: '  ', kind: 'space'
      });
    });
  });

  describe("newline", () => {
    it("should parse a \\n.", () => {
      const toker = Tokenizer('  ', 0);
      tokenize(toker).should.be.eql({
        token: '  ', kind: 'space'
      });
    });

    it("should parse consecutive \\n.", () => {
      const text = '\n\n';
      const toker = Tokenizer(text, 0);
      const tokens = readTokens(toker);

      tokens.should.be.eql([
        { token: '\n', kind: 'nl' },
        { token: '\n', kind: 'nl' },
      ]);
    });
  });

  describe("number", () => {
    it("should parse number 1.", () => {
      const toker = Tokenizer('1', 0);
      tokenize(toker).should.be.eql({
        token: '1', kind: 'number'
      });
    });

    it("should parse number 11.", () => {
      const toker = Tokenizer('11', 0);
      tokenize(toker).should.be.eql({
        token: '11', kind: 'number'
      });
    });

    it("should parse number 1.1.", () => {
      const toker = Tokenizer('1.1', 0);
      tokenize(toker).should.be.eql({
        token: '1.1', kind: 'number'
      });
    });
  });

  describe("identifiers", () => {
    it("should parse a.", () => {
      const toker = Tokenizer('a', 0);
      tokenize(toker).should.be.eql({
        token: 'a', kind: 'identifier'
      });
    });

    it("should parse number asdf.", () => {
      const toker = Tokenizer('asdf', 0);
      tokenize(toker).should.be.eql({
        token: 'asdf', kind: 'identifier'
      });
    });
  });

  describe("string", () => {
    it("should parse string wrapped in \".", () => {
      const toker = Tokenizer('\'asdf\'', 0);
      tokenize(toker).should.be.eql({
        token: '\'asdf\'', kind: 'string'
      });
    });

    it("should parse string wrapped in \'.", () => {
      const toker = Tokenizer('\"asdf\"', 0);
      tokenize(toker).should.be.eql({
        token: '\"asdf\"', kind: 'string'
      });
    });
  });

  describe("statement", () => {
    it("should parse a A 1", () => {
      const text = 'a A 1';
      const toker = Tokenizer(text, 0);
      const tokens = readTokens(toker);
      tokens.should.be.eql([
        { token: 'a', kind: 'identifier' },
        { token: ' ', kind: 'space' },
        { token: 'A', kind: 'identifier' },
        { token: ' ', kind: 'space' },
        { token: '1', kind: 'number' },
      ]);
    });

    it("should parse a A 1.0\\n  b B 2", () => {
      const text = 'a A 1.0\n  b B 2';
      const toker = Tokenizer(text, 0);
      const tokens = readTokens(toker);
      tokens.should.be.eql([
        { token: 'a',   kind: 'identifier' },
        { token: ' ',   kind: 'space' },
        { token: 'A',   kind: 'identifier' },
        { token: ' ',   kind: 'space' },
        { token: '1.0', kind: 'number' },
        { token: '\n',  kind: 'nl' },
        { token: '  ',  kind: 'space' },
        { token: 'b',   kind: 'identifier' },
        { token: ' ',   kind: 'space' },
        { token: 'B',   kind: 'identifier' },
        { token: ' ',   kind: 'space' },
        { token: '2',   kind: 'number' },
      ]);
    });
  });
});
