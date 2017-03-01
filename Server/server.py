from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

clients = []
class Server(WebSocket):
    def handleMessage(self):
       for client in clients:
          if client != self:
             client.sendMessage(self.data)

    def handleConnected(self):
       print(self.address, 'connected')
       clients.append(self)

    def handleClose(self):
       clients.remove(self)
       print(self.address, 'closed')

server = SimpleWebSocketServer('', 8000, Server)
server.serveforever()
