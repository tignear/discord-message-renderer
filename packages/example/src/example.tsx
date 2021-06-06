import { Client, Intents, TextChannel } from "discord.js";
import { render } from "discord-message-jsx-discordjs";
const client = new Client({
  intents: Intents.ALL
});
const x = <message>
  にゃーん
  <embed color={0x22FFFF} timestamp={Date.now()}>
    <author icon_url="https://pbs.twimg.com/profile_images/1256452981282574336/n7cjUb3q_400x400.jpg" url="https://example.org">
      tig
    </author>
    <title url="https://example.com">にゃん</title>
    にゃーん
    <thumbnail url="https://pbs.twimg.com/profile_images/1256452981282574336/n7cjUb3q_400x400.jpg" />
    <image url="https://pbs.twimg.com/profile_images/1256452981282574336/n7cjUb3q_400x400.jpg" />
    <fields>
      <field name={"がおー"}>
        わん
        </field>
      <field name={"がおー"} inline={true}>
        わん
      </field>
    </fields>
    <footer icon_url="https://pbs.twimg.com/profile_images/1256452981282574336/n7cjUb3q_400x400.jpg">
      tig
    </footer>
  </embed>
  <components>
    <action_row>
      <button style={1} custom_id="nyan">
        <unicode_emoji>👍</unicode_emoji>
        にゃん
      </button>
      <button style="SECONDARY" custom_id="nyan">
        <custom_emoji id="729332017149378671"></custom_emoji>
        にゃん
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
console.log(render(x)[1].embed,render(x)[1].components)

client.on("ready", () => {
  const tc = (client.channels.resolve("848034399177015296") as TextChannel);
  tc.send(...render(x));
});
client.login(process.env.DISCORD_BOT_TOKEN)