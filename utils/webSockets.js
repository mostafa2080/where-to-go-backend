const raisedEventListener = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected , socket id : ", socket.id);

    socket.on("tryingsocket", (data) => {
      console.log(data);
    });
    socket.on("notifyAdminAndEmpForAddingVendor", (data) => {
      console.log(data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("message", (data) => {
      io.emit("message", data);
    });
  });
};
module.exports = raisedEventListener;
