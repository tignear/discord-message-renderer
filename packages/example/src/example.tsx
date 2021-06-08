import { Client, Intents, Message, MessageOptions, TextChannel } from "discord.js";
import * as DJSX from "discord-message-jsx";
import { render as renderJSX } from "discord-message-jsx-discordjs";
import { route, RoutingView, OnMemoryViewManager, RoutingController, ViewManager } from "discordjs-components-mvc";
const client = new Client({
  intents: Intents.ALL
});
function Embed(props: { children: (DJSX.Element), multi: boolean }) {
  if (props.multi) {
    return <embeds>
      {props.children}
    </embeds>
  }else{
    return props.children;
  }
}
class View extends RoutingView<{counter: number, multi: boolean}, MessageOptions, {}>{

  render(data: {counter: number, multi: boolean}): MessageOptions {
    const x = <message>
      にゃーん
      <Embed multi = {data.multi}>
        <embed color={0x22FFFF} timestamp={Date.now()}>
          <author icon_url="https://pbs.twimg.com/profile_images/1256452981282574336/n7cjUb3q_400x400.jpg" url="https://example.org">
            tig
          </author>
        にゃーん{String(data.counter)}
        </embed>
      </Embed>

      <components>
        <action_row>
          <button style={1} custom_id="increment">
            <unicode_emoji>👍</unicode_emoji>
          +1
        </button>
          <button style="SECONDARY" custom_id="decrement">
            <unicode_emoji>👎</unicode_emoji>
          -1
        </button>
        </action_row>
        <action_row>
          <button style="LINK" url="https://example.com">
            <custom_emoji id="729332017149378671"></custom_emoji>
          にゃん
        </button>
        </action_row>
      </components>
    </message>
    return { ...renderJSX(x) };
  }
}
class Controller extends RoutingController<{counter: number, multi: boolean}, MessageOptions, {}>{
  count = 0;
  constructor() {
    super();
    this.view = new View();
  }
  start(): Promise<void> {
    return this.render({counter: this.count, multi: false});
  }
  @route()
  increment() {
    return this.render({counter: ++this.count, multi: true});
  }
  @route()
  decrement() {
    return this.render({counter: --this.count, multi: true});
  }
}
const controller = new Controller();
const manager = new OnMemoryViewManager(client);
client.on("ready", () => {
  const tc = (client.channels.resolve("848034399177015296") as TextChannel);
  manager.start(controller.view, (msg) => tc.send(msg).then(msg => (msg as Message).id));
});

client.login(process.env.DISCORD_BOT_TOKEN);