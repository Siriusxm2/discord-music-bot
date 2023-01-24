require("dotenv").config();

const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Player } = require("discord-player");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { registerPlayerEvents } = require("./events");

const fs = require("node:fs");
const path = require("node:path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [];
client.slashcommands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

client.player = new Player(client, {
  ytdlOptions: {
    filter: "audioonly",
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});
registerPlayerEvents(client.player);

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.slashcommands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

client.on("ready", () => {
  botReady();
});

client.on("interactionCreate", async (interaction) => {
  await handleCommand(interaction);
});

client.login(TOKEN);

function botReady() {
  console.log(`Logged in as ${client.user.tag}`);
  const rest = new REST({ version: "10" }).setToken(TOKEN);
  const guild_ids = client.guilds.cache.map((guild) => guild.id);

  for (const guildId of guild_ids) {
    rest
      .put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {
        body: commands,
      })
      .then(console.log("Added commands successfully!"))
      .catch((err) => {
        if (err) {
          console.log(err);
          process.exit(1);
        }
      });
  }
}

async function handleCommand(interaction) {
  await interaction.deferReply();

  if (!interaction.isCommand()) return;

  const command = client.slashcommands.get(interaction.commandName);
  if (!command) return await interaction.followUp("Not a valid slash command.");

  try {
    await command.execute({ client, interaction });
  } catch (err) {
    console.error(err);
    await interaction.followUp("An error occured while executing the command.");
  }
}

// client.guilds.cache.forEach((guild) => {
//   try {
//     const bot_channel =
//       guild.channels.cache.find(
//         (channel) =>
//           channel.name === "bot-channel" || channel.name === "🤖-bot"
//       ) || guild.channels.cache.first();
//     if (bot_channel) bot_channel.send({ embeds: [embed] });
//     else console.log("Server " + guild.name + " has no channels");
//   } catch (err) {
//     console.log("Could not send message to " + guild.name + ".");
//   }
// });
