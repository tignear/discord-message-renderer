import { $$discord_message_jsx, Element } from "discord-message-jsx";
import { Structures, Webhook, WebhookClient } from "discord.js";
const { InteractionWebhook } = require("discord.js");
import { render as baseRender } from "./index";

interface ClsSend {
  send(x: any, y?: any): any
}
interface ClsReply {
  reply(x?: any, y?: any): any
}
interface ClsInteraction {
  reply(x: any, y?: any): any;
  followUp(x: any, y?: any): any;
  editReply(x: any, y?: any): any;
}
interface CCls<Cls> {
  new(...x: any[]): Cls;
}
function render(x: Element): [any, any?] {
  const r = baseRender(x);
  if (x.name === "message") {
    return r as [any, any];
  } else {
    return [r];
  }
}
function extendSendFunction<T extends ClsSend>(Cls: CCls<T>): CCls<T> {
  return class DiscordMessageJSXExtended extends (Cls as any) {
    send = (arg0: any, ...args: [any?]): any => {
      if (arg0 && arg0[$$discord_message_jsx] === "element") {
        return super.send(...render(arg0));
      }
      return super.send(arg0, ...args);
    }
  } as any;
}
function extendReplyFunction<T extends ClsReply>(Cls: CCls<T>): CCls<T> {
  return class DiscordMessageJSXExtended extends (Cls as any) {
    reply = (arg0: any, ...args: [any?]): any => {
      if (arg0 && arg0[$$discord_message_jsx] === "element") {
        return super.reply(...render(arg0));
      }
      return super.reply(arg0, ...args);
    }
  } as any;
}
function extendInteractionFunction<T extends ClsInteraction>(Cls: CCls<T>): CCls<T> {
  return class DiscordMessageJSXExtended extends (Cls as any) {
    reply = (arg0: any, ...args: [any?]): any => {
      if (arg0 && arg0[$$discord_message_jsx] === "element") {
        return super.reply(...render(arg0));
      }
      return super.reply(arg0, ...args);
    }
    followUp = (arg0: any, ...args: [any?]): any => {
      if (arg0 && arg0[$$discord_message_jsx] === "element") {
        return super.followUp(...render(arg0));
      }
      return super.followUp(arg0, ...args);
    }
    editReply = (arg0: any, ...args: [any?]): any => {
      if (arg0 && arg0[$$discord_message_jsx] === "element") {
        return super.editReply(...render(arg0));
      }
      return super.editReply(arg0, ...args);
    }
  } as any;
}
Structures.extend("TextChannel", extendSendFunction);
Structures.extend("NewsChannel", extendSendFunction);
Structures.extend("DMChannel", extendSendFunction);
Structures.extend("GuildMember", extendSendFunction);
Structures.extend("User", extendSendFunction);
Structures.extend("Message", extendReplyFunction);
Structures.extend("CommandInteraction", extendInteractionFunction);
//FIXME: invalid discord.js typing
Structures.extend("MessageComponentInteraction" as any, extendInteractionFunction);
function overwriteWebhook(cls: any) {
  const originalWebhookSend = cls.prototype.send;
  cls.prototype.send = function (arg0: any, ...args: [any?]): any {
    if (arg0 && arg0[$$discord_message_jsx] === "element") {
      return originalWebhookSend.call(this, ...render(arg0));
    }
    return originalWebhookSend.call(this, arg0, ...args);
  };
}
overwriteWebhook(Webhook);
overwriteWebhook(WebhookClient);
overwriteWebhook(InteractionWebhook);