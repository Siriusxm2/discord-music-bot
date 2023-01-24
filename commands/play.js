const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType, PlayerError } = require("discord-player");

// Creating the command 'play' and it's subcommands
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Add a track to the end of the queue")
    .addStringOption((option) =>
      option.setName("query").setDescription("Song name/URL").setRequired(true)
    ),

  execute: async ({ client, interaction }) => {
    if (!interaction.member.voice.channel) {
      return await interaction.followUp(
        "You must be in a voice channel to use this command."
      );
    }

    const queue = await client.player.createQueue(interaction.guild, {
      leaveOnEmptyCooldown: 5000,
      spotifyBridge: true,
      metadata: {
        channel: interaction.channel,
      },
    });

    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      await client.player.deleteQueue(interaction.guild);
      return await interaction.followUp("Couldn not join your voice channel.");
    }

    const embed = new EmbedBuilder();

    const query = interaction.options.getString("query");

    const result = await client.player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!result) {
      await queue.destroy();
      return await interaction.followUp("No results found.");
    }

    try {
      if (result.playlist) {
        await queue.addTracks(result.tracks);
        if (!queue.playing) await queue.play();
      } else {
        await queue.addTrack(result.tracks[0]);
        if (!queue.playing) await queue.play();
      }
    } catch (err) {
      if (err instanceof PlayerError) {
        if (err.statusCode == "InvalidTrack") {
          await queue.destroy();
          return await interaction.followUp("No results found.");
        }
      }
      await queue.destroy();
      return await interaction.followUp(
        "There seems to be some issues with the media. Try again later."
      );
    }

    if (result.playlist) {
      const playlist = result.playlist;
      embed
        .setDescription(
          `Added **${result.tracks.length} songs from [${playlist.title}](${playlist.url})** to the queue.`
        )
        .setThumbnail(playlist.thumbnail.url);
    } else {
      const song = result.tracks[0];
      embed
        .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }

    return await interaction.followUp({ embeds: [embed] });
  },
};
