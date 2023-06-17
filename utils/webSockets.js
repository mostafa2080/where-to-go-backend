const raisedEventListener = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("tryingsocket", (data) => {
      console.log(data);
    });

    socket.on("notifyAdminAndEmpForAddingVendor", (data) => {
      console.log(data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
module.exports = raisedEventListener;
