module.exports = {
  category: "Teste",
  description: "Replies with Pong",

  callback: ({ message }) => {
    message.reply("Pong");
  },
};
