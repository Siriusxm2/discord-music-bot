const { EmbedBuilder } = require("discord.js");

module.exports.registerPlayerEvents = (player) => {
  player.on("error", (queue, error) => {
    console.log(
      `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
    );
  });
  player.on("connectionError", (queue, error) => {
    console.log(
      `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
    );
  });

  player.on("trackStart", async (queue, track) => {
    console.log(`track started: ${queue.current.title}`);
    // console.log(queue.metadata);
    await queue.metadata.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("**Started Playing:**")
          .setDescription(
            `\`[${track.duration}]\` **[${track.title}](${track.url})**`
          )
          .setThumbnail(track.thumbnail),
      ],
    });
  });

  player.on("trackEnd", (queue) => {
    console.log(`track ended: ${queue.current.title}`);
  });

  player.on("botDisconnect", async (queue) => {
    await queue.metadata.channel.send(
      "I was manually disconnected from the voice channel, clearing queue!"
    );
  });

  player.on("queueEnd", async (queue) => {
    console.log("Queue has finished!");
    await queue.metadata.channel.send("Queue has finished!");
  });
};
