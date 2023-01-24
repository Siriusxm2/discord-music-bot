const { EmbedBuilder } = require("discord.js");

const embed = new EmbedBuilder().setTitle("General commands:").addFields(
  {
    name: "Help",
    value: "/help - Shows an overview of the commands\n",
  },
  {
    name: "Playing",
    value:
      "/play song, search, playlist <keyword> - Plays the selected song/playlist from youtube\n",
  },
  {
    name: "Play Next",
    value: "/playnext <song url> - Puts the song at the top of the queue\n",
  },
  {
    name: "Song Info",
    value: "/info - Displays the song information\n",
  },
  {
    name: "Pausing",
    value: "/pause - Pauses the song being played\n",
  },
  {
    name: "Resuming",
    value: "/resume - Resumes the current song\n",
  },
  {
    name: "Skipping",
    value: "/skip - Skips the current song\n",
  },
  {
    name: "Playing Previous",
    value: "/previous - Plays the previous song\n",
  },
  {
    name: "Queue",
    value: "/queue - Displays the first 5 songs in the queue\n",
  },
  {
    name: "Jump",
    value: "/jump <songs> - Jumps to a specific song in the queue\n",
  },
  {
    name: "Seek",
    value: "/seek <time> - Fast-forward <time> seconds\n",
  },
  {
    name: "Shuffling Queue",
    value: "/shuffle - Shuffle all songs in the queue\n",
  },
  {
    name: "Clearing Queue",
    value: "/clear - Clear all songs in the queue\n",
  },
  {
    name: "Exiting",
    value: "/exit - Kick the bot from the voice channel\n",
  },
  {
    name: "To be added",
    value: "*None for now*",
  }
);

module.exports = { embed };
