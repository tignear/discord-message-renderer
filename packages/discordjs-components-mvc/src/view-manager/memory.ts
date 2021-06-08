import { Interaction, Snowflake } from "discord.js";
import { View, ViewManager } from "../index";
export class OnMemoryViewManager extends ViewManager {
  protected views = new Map<Snowflake, View<any, any>>();
  dispatchInteraction(interaction: Interaction): Promise<void> {
    if (!interaction.isMessageComponent()) {
      return Promise.resolve();
    }
    const view = this.views.get(interaction.message.id);
    if (view) {
      return view.on_interaction(interaction);
    }
    return Promise.resolve();
  }
  async link(messageID: Snowflake, view: View<any, any>) {
    this.views.set(messageID, view);
  }
  async start<U>(view: View<any, U>,send: (msg: U) => Promise<Snowflake>) {
    this.views.set(await view.on_start(send), view);
  }
}