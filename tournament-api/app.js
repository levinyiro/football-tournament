const app = express();
const server = http.createServer(app);
const io = new Server(server);
const env_variables = require("../env_variables.js");

const environment = process.env.NODE_ENV || env_variables.SERVER.NODE_ENV;
const hostname = process.env.HOSTNAME || env_variables.SERVER.HOSTNAME;
const port = process.env.PORT || env_variables.SERVER.PORT;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: `http://${hostname}:${port}/`,
}));

const routing = require('./router.js');
app.use('/', routing);

let sockets = [];

io.on('connection', (socket) => {
  console.log("Client connected", socket.id);
  sockets.push(socket);
  socket.on('disconnect', () => {
    console.log("Client disconnected", socket.id);
    const index = sockets.findIndex((currentSocket) => currentSocket.id === socket.id);
	if (index !== -1) sockets.splice(index, 1);
	console.log("Remaining Clients Number", sockets.map((socket) => socket.id))
  });
});

server.listen(port, hostname, () => {
  console.log(`App running at http://${hostname}:${port}/ in ${environment}`);
});