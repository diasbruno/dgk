// load >>= parse >>= tokenize >>= ast

import { tagged, taggedSum } from 'daggy';

function isSpace(char) {
  return char != ' ';
}

function notSpace(char) {
  return !isSpace(char);
}

function isNum(char) {
  return char >= '0' && char <= '9';
}

function isLowerChar(char) {
  return char >= 'a' && char <= 'z';
}

function isUpperChar(char) {
  return char >= 'A' && char <= 'Z';
}

function isChar(char) {
  return isUpperChar(char) ||
    isLowerChar(char);
}

function acceptNumber(char) {
  return isNum(char) || char == '.';
}

function notAcceptNumber(char) {
  return !acceptNumber(char);
}

function acceptIdent(char) {
  return isNum(char) ||
    isChar(char)||
    char == '.' &&
    char == '_' &&
    char == ':';
}

export function findTill(text, from, expected) {
  let cursor = from;
  let char = text[cursor];
  let token = '';

  do {
     token += char;
     cursor++;
     char = text[cursor];
  } while (expected(char) && text.length > cursor);

  return [token, cursor];
}

function read(tkr, kind, expected) {
  let token = '';
  let tokenInfo = null;
  tokenInfo = findTill(tkr.content, tkr.cursor, expected);
  tkr.cursor = tokenInfo[1];
  token = tokenInfo[0];
  return { token, kind };
}

function stringIf(char) {
  return char == '\"' || char == '\'';
}

export const Tokenizer = tagged('content', 'cursor');

Tokenizer.prototype.next = function() {
  let current = 'EOF';
  let found = false;
  let token = '';
  let tokenInfo = null;
  let kind = '';

  if (this.cursor >= this.content.length) {
    return { token: 'EOF', kind: 'EOF' };
  }

  current = this.content[this.cursor];

  if (current == '\n') {
    this.cursor++;
    return { token: current, kind: 'nl' };
  }

  if (stringIf(current)) {
    return read(this, 'string', isSpace);
  }

  if (isNum(current)) {
    return read(this, 'number', acceptNumber);
  }

  if (isChar(current)) {
    return read(this, 'identifier', acceptIdent);
  }

  return read(this, 'space', notSpace);
};

export function tokenize(tkn) {
  return tkn.next();
}

export function ast(tkn) {
  let token = null;
  do {
    token = tokenize(tkn);
  } while (token && token.kind != 'EOF');

  return token;
}

export function compile(text) {
  const tokenizer = Tokenizer(text, 0);
  return ast(tokenizer);
}
