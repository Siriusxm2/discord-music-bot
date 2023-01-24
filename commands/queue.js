const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the first 10 songs in the queue.")
    .addNumberOption((option) =>
      option
        .setName("page")
        .setDescription("Page number of the queue")
        .setMinValue(1)
    ),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue || !queue.playing)
      return await interaction.followUp("There are no songs in the queue.");

    const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
    const page = (interaction.options.getNumber("page") || 1) - 1;

    if (page > totalPages)
      return await interaction.followUp(
        `Invalid page. There are a total of ${totalPages} pages.`
      );

    const queueString = queue.tracks
      .slice(page * 10, page * 10 + 10)
      .map((song, i) => {
        return `**${page * 10 + i + 1})** \`[${song.duration}]\` **[${
          song.title
        }](${song.url})** - <@${song.requestedBy.id}>`;
      })
      .join("\n");

    const currentSong = queue.current;
    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(`**Currently playing:**`)
          .setDescription(
            (currentSong
              ? `\`[${currentSong.duration}]\` **[${currentSong.title}](${currentSong.url})** - <@${currentSong.requestedBy.id}>`
              : "None") + `\n\n**Queue:**\n${queueString}`
          )
          .setThumbnail(currentSong.thumbnail)
          .setFooter({ text: `Page ${page + 1} of ${totalPages}` }),
      ],
    });
  },
};
