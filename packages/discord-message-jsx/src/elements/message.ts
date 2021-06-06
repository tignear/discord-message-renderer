import { components_elements } from "./components";
import { EmbedElement, EmbedsElement, embed_elements } from "./embed";
import { ChildElement, inject, Phantomic, RootElement, Element } from "./util";



export function asArray<T>(e: T | T[] | undefined) {
  if (e == undefined) {
    return [];
  }
  if (Array.isArray(e)) {
    return e;
  }
  return [e];

}
//message
export interface MessageElement extends Phantomic<RootElement, "message"> {

}
export type MessageChild = EmbedsElement | EmbedElement | string | Element;
export interface MessageProps {
  children: MessageChild | MessageChild[];
}

const elements = {
  message(props: MessageProps, key?: string): MessageElement {
    return inject("message", {
      render(ctx): unknown {
        const arr = asArray(props.children);
        return Object.fromEntries(arr.flatMap(e => {
          if (typeof e === "string") {
            return [["content", e]];
          }
          return ctx.render(e, { context: "child" });
        }));
      }
    });
  },
  ...embed_elements,
  ...components_elements
};
export default elements;