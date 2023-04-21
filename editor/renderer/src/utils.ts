import { Schema } from 'prosemirror-model';
import { defaultSchema } from '@atlaskit/adf-schema';
import { Transformer, ADNode, EventHandlers } from '@atlaskit/editor-common';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Node as PMNode } from 'prosemirror-model';
import { RendererAppearance } from './ui/Renderer/types';

function createEncoder<T>(parser: Transformer<T>, encoder: Transformer<any>) {
  return (value: T) => encoder.encode(parser.parse(value));
}
export type TransformerProvider<T> = (schema: Schema) => Transformer<T>;
export class ADFEncoder<T> {
  encode: (value: T) => any;

  constructor(createTransformerWithSchema: TransformerProvider<T>) {
    const transformer = createTransformerWithSchema(defaultSchema);
    this.encode = createEncoder(transformer, new JSONTransformer());
  }
}

export const getText = (node: PMNode | ADNode): string => {
  return (
    node.text ||
    (node.attrs && (node.attrs.text || node.attrs.shortName)) ||
    `[${typeof node.type === 'string' ? node.type : node.type.name}]`
  );
};

export const getEventHandler = (
  eventHandlers?: EventHandlers,
  type?: keyof EventHandlers,
  eventName: string = 'onClick',
): any => {
  return (
    eventHandlers &&
    type &&
    eventHandlers[type] &&
    (eventHandlers as any)[type][eventName]
  );
};

/**
 * Traverse DOM Tree upwards looking for table parents with "overflow: scroll".
 */
export function findHorizontalOverflowScrollParent(
  table: HTMLElement | null,
): HTMLElement | null {
  let parent: HTMLElement | null = table;
  if (!parent) {
    return null;
  }

  while ((parent = parent.parentElement)) {
    // IE11 on Window 8 doesn't show styles from CSS when accessing through element.style property.
    const style = window.getComputedStyle(parent);
    if (style.overflow === 'scroll' || style.overflowY === 'scroll') {
      return parent;
    }
  }

  return null;
}

export const getPlatform = (rendererAppearance: RendererAppearance) => {
  if (rendererAppearance === 'mobile') {
    return 'mobile' as const;
  }
  return 'web' as const;
};
