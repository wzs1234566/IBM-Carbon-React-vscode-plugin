import * as fs from 'fs';
import { Position, SaxEventType, SAXParser, Tag, Detail } from 'sax-wasm';
import { Attribute } from 'sax-wasm/lib';
import { Range } from 'vscode';
import { getTagEntity } from './PaserUtil';

const saxPath = require.resolve('sax-wasm/lib/sax-wasm.wasm');
const saxWasmBuffer = fs.readFileSync(saxPath);
let parserReady: boolean = false;
const parser = new SAXParser(SaxEventType.OpenTag | SaxEventType.CloseTag);

export interface DocumentEntity {
  target: 'tag' | 'attributeValue' | 'attributeName';
  substr: string;
  start: Position,
  end: Position,
  attribute?: Attribute,
  tag?: Tag;
  parent?: Tag;
}

export async function findEntityAtPosition(position: Position, documentText: string): Promise<DocumentEntity> {
  let entity: DocumentEntity = {} as DocumentEntity;
  let tags: Tag[] = [];

  parser.eventHandler = (type: SaxEventType, tag: Detail) => {
    tag = tag as Tag;

    if (entity.target) {
      return;
    }

    if (type === SaxEventType.OpenTag) {
      tags.push(tag);
    }

    if (type === SaxEventType.CloseTag) {
      tags.pop();
      entity = getTagEntity(position, tag);
    }

    if (entity.target && tags.length) {
      entity.parent = tags[tags.length - 1];
    }
  };

  if (!parserReady) {
    parserReady = await parser.prepareWasm(saxWasmBuffer);
  }
  try {
    parser.write(Buffer.from(documentText));
  } catch (e) {
    // Skip over these
  } finally {
    parser.end();
  }

  return entity;
}
