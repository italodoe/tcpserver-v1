const net = require("net"); //common JS modules : CJS

let clients = [];

const server = new net.createServer(); //emisor de eventos

const PORT = 5000;

server.on("connection", handleConnection);

server.listen(PORT, "127.0.0.1", () => {
  console.log("listening port:", PORT);
});

function handleConnection(socket) {
  console.log(`Conection from ${socket.remoteAddress} : ${socket.remotePort}`);
  socket.setEncoding("utf8");
  clients.push(socket);
  socket.name = `${socket.remoteAddress} : ${socket.remotePort}`;
  socket.write(`welcome to paradise ${socket.name}` + "\n");
  broadcast(`${socket.name} joined the chat`, socket);

  socket.on("data", (data) => {
    broadcast(`${socket.name}: ${data}`, socket);
  });
  socket.on("end", (data) => {
    clients.splice(clients.indexOf(socket), 1)
    broadcast(`${socket.name}  left the chat`, socket);
  });

  function onConnData(data) {
    // console.log(`Data from ${socket.remoteAddress} :: ${socket.remotePort} => ${data}`);1
    socket.write(data.UpperCase());
  }

  function broadcast(message, sender) {
    clients.forEach((client) => {
      if (client !== sender) client.write(message);
    });
  }
}
