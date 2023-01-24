const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Fast-forward to the given time.")
    .addNumberOption((option) =>
      option
        .setName("minutes")
        .setDescription("Amount of minutes to seek")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("seconds")
        .setDescription("Amount of seconds to seek")
        .setRequired(true)
    ),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) return await interaction.followUp("There is no song playing.");

    const minutes = interaction.options.getNumber("minutes");
    const seconds = interaction.options.getNumber("seconds");

    const time = minutes * 60 * 1000 + seconds * 1000;

    await queue.seek(time);

    await interaction.followUp({
      embeds: [
        new EmbedBuilder().setDescription(
          `Fast-forwarded to **${
            minutes !== 0
              ? `${minutes} ${minutes == 1 ? "minute" : "minutes"} and `
              : ""
          } ${seconds} ${seconds == 1 ? "second" : "seconds"}**.`
        ),
      ],
    });
  },
};
