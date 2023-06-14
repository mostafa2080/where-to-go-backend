const websocketEvents = (io) => {
  io.on("connection", (socket) => {
    socket.on("tryingsocket", (data) => {
      console.log(data);
    });

    socket.on("notifyAdminAndEmpForAddingVendor", (message) => {
      console.log(message);
      // socket.
    });
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = websocketEvents;
