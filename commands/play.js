const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports = {
  category: "Music",
  description: "Play a song",

  callback: async ({ message, args, cmd, client }) => {
    if (!args[0])
      return `Por favor, digite uma musica válida ${message.author} ❌`;

    const { voice } = message.member;

    if (!voice) {
      return `E necessário estar em um canal de voz para executar este comando ${message.author} ❌`;
    }

    //Connecte the BOT to the voice channel
    try {
      const connection = joinVoiceChannel({
        channelId: voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();
      connection.subscribe(player);

      if (!ytdl.validateURL(args[0])) return console.log("Merda");

      const songInfo = await ytdl.getInfo(args[0]);

      let song = {};
      song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
      };

      const stream = ytdl(song.url, { filter: "audioonly" });

      const resource = createAudioResource(stream, {
        inlineVolume: true,
        metadata: {
          title: song.title,
        },
      });
      resource.volume.setVolume(0.5);

      console.log("Tste");
      player.play(resource);

      player.on(AudioPlayerStatus.Playing, () => {
        console.log("currently playing");
        console.log("resource started:", resource.started);
      });

      player.on("error", (error) => {
        console.error(
          `Error: ${error.message} with resource ${error.resource.metadata.title}`
        );
      });

      // player.on(AudioPlayerStatus.AutoPaused, () => {
      //   console.log("done?");
      // });

      console.log("Fim");
    } catch (err) {
      //Erro
    }
  },
};
