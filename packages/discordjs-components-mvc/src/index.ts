import { Client, Interaction, MessageComponentInteraction, Snowflake } from "discord.js";
export const $$render = Symbol("$$render");
export interface View<T, U> {
  on_interaction(interaction: MessageComponentInteraction): Promise<void>;
  on_start(send: (msg: U) => Promise<Snowflake>): Promise<Snowflake>;
  render(data: T): U;
  [$$render](data: T): Promise<void>;
}

export abstract class ViewManager {
  constructor(client: Client) {
    this.bindClient(client);
  }
  bindClient(client: Client) {
    client.on("interaction", this.dispatchInteraction.bind(this));
  }
  abstract dispatchInteraction(interaction: Interaction): Promise<void>;
}
export { OnMemoryViewManager } from "./view-manager/memory";
export { RoutingView, RoutingController, route } from "./routing";
