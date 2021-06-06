export interface Context<Context extends "root" | "child"> {
  context: Context;
  render(element: RootElement, context: { context: "root" }): unknown;
  render(element: ChildElement, context: { context: "child" }): [string, unknown][] | [];
  render(element: Element, context: { context: "root" }): unknown;
  render(element: Element, context: { context: "child" }): [string, unknown][] | [];
}

export interface ChildElement {
  render(context: Context<"child">): [string, unknown][] | [];
  name: string;
}
export interface RootElement {
  render(context: Context<"root">): unknown;
  name: string;
}
export interface Element {
  render(context: Context<"root">): unknown;
  render(context: Context<"child">): [string, unknown][] | [];
  name: string;
}
export type Phantomic<T, U extends string> = T & { [key in U]: never }
export function inject<T extends Element | ChildElement | RootElement, U extends string>(name: U, t: Omit<T, U | "name">): Phantomic<T, U> {
  (t as any)[$$discord_message_jsx] = "element";
  (t as T).name = name;
  return t as Phantomic<T, U>;
}
export type CC<K extends string> = Phantomic<ChildElement, K>;
export const $$discord_message_jsx = Symbol("discord-message-jsx");