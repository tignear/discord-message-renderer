import "reflect-metadata"
import { MessageComponentInteraction, Snowflake } from "discord.js";
import { $$render, View } from "./index";
import { AsyncQueue } from "@sapphire/async-queue";
const $$route = Symbol("$$route");
export const $$controller = Symbol("$$controller");
const $$view = Symbol("$$view");
type RouteMetadata = [string, string]
export abstract class RoutingController<T, U, I> {
  [$$route]: Map<string, string>;
  [$$view]: RoutingView<T,U,I>;
  set view(v: RoutingView<T,U,I>){
    if(this[$$view]){
      throw new TypeError();
    }
    this[$$view] = v;
    v[$$controller] = this;
  }
  get view(): RoutingView<T,U,I>{
    return this[$$view];
  }
  constructor() {
    const list: RouteMetadata[] = Reflect.getMetadata($$route, this);
    this[$$route] = new Map<string, string>(list);
  }
  abstract start(): Promise<void>;
  render(data: T): Promise<void> {
    return this.view[$$render](data);
  }
}
const $$renderer = Symbol("$$renderer");

export abstract class RoutingView<T, U, I> implements View<T, U> {
  constructor() {

  }
  protected queue = new AsyncQueue();
  async singleThread<T>(cb: () => T | Promise<T>) {
    await this.queue.wait();
    try {
      return await cb();
    } finally {
      this.queue.shift();
    }
  }
  [$$controller]!: RoutingController<T,U,I>;
  [$$renderer]?: (msg: U) => Promise<void>;
  [$$render](data: T): Promise<void> {
    return this[$$renderer]!(this.render(data));
  }
  abstract render(data: T): U;
  async on_start(send: (msg: U) => Promise<Snowflake>): Promise<Snowflake> {
    const f = async () => {
      let res: (id: Snowflake | PromiseLike<Snowflake>) => void;
      const p = new Promise<Snowflake>(resolve => {
        res = resolve;
      })
      this[$$renderer] = async (msg) => {
        res(send(msg));
      };
      await this[$$controller].start();
      this[$$renderer] = undefined;
      return await p;
    };
    return this.singleThread(f);
  }
  async on_interaction(interaction: MessageComponentInteraction): Promise<void> {
    const f = async () => {
      const [name, options] = await this.convertID(interaction.customID);
      const handler = this[$$controller][$$route].get(name);
      if (handler && (this[$$controller] as any)[handler]) {
        this[$$renderer] = async (msg) => {
          await interaction.update(msg);
        };
        await ((this[$$controller] as any)[handler] as any)(interaction, options);
        this[$$renderer] = undefined;
      } else {
        throw new Error("can't resolve route");
      }
    };
    return this.singleThread(f);
  }
  async convertID(id: string): Promise<[string, I]> {
    return [id, {} as I];
  }
}
export function route(name?: string) {
  return function (target: any, props: string, descriptor: PropertyDescriptor) {
    const meta = [name ?? props, props];
    addMetadata(meta, target, $$route)
  }
}


function addMetadata<T>(value: T, target: any, key: Symbol) {
  const list = Reflect.getMetadata(key, target);
  if (list) {
    list.push(value);
    return;
  }
  Reflect.defineMetadata(key, [value], target);
}