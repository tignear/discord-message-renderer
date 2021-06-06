import elements from "./elements/message";
import {Element as E} from "./elements/util"
export declare namespace JSX {
  type IntrinsicElements = {
    [k in keyof typeof elements]: Parameters<typeof elements[k]>[0]
  }
  interface ElementChildrenAttribute {
    children: {}; // specify children name to use
  }
  type Element = E;
}
interface Elements {
  [k: string]: (props: any, key?: string) => unknown
};
const fuzzy_elements: Elements = elements;
export function jsx<K extends keyof typeof elements>(name: K, props: Parameters<typeof elements[K]>[0], key: string): ReturnType<typeof elements[K]> {
  return fuzzy_elements[name](props, key) as ReturnType<typeof elements[K]>;
}
export function jsxs<K extends keyof typeof elements>(name: K, props: Parameters<typeof elements[K]>[0], key: string): ReturnType<typeof elements[K]> {
  return fuzzy_elements[name](props, key) as ReturnType<typeof elements[K]>;
}