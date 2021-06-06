import { Element } from "discord-message-jsx";
import { MessageActionRow, MessageButton, MessageEmbed, MessageOptions, WebhookMessageOptions, Structures, MessageAdditions } from "discord.js";


export function render(element: Element): [string, Pick<MessageOptions & WebhookMessageOptions, "embed" | "embeds" | "components">?]&MessageEmbed | MessageEmbed[] {
  const render_result = element.render({
    render(element: Element, ctx: { context: "root" | "child" }) {
      switch (element.name) {
        case "embed":
          const djs_embed = new MessageEmbed(element.render({ ...(this as any), ...ctx, context: "root" }) as any);
          if (ctx.context === "root") {
            return djs_embed;
          } else {
            return [["embed", djs_embed]];
          }
        case "action_row":
          const djs_action_row = new MessageActionRow(element.render({ ...(this as any), ...ctx, context: "root" }) as any);
          return djs_action_row;
        case "button":
          const djs_button = new MessageButton(element.render({ ...(this as any), ...ctx, context: "root" }) as any);
          return djs_button;
        default:
          return element.render({ ...(this as any), ...ctx });
      }
    },
    context: "root"
  } as any) as any;
  switch (element.name) {
    case "message":
      return [render_result.content ?? "", render_result.options ?? {}];
    default:
      return render_result;
  }

}

