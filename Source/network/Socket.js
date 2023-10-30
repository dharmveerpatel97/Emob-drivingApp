import {TextDecoder, TextEncoder} from 'text-encoding';
let websocket = null;
class SocketProvider {
  register = (onOpen, onMessage, onClose, onError) => {
    this.createSocketListeners(onOpen, onMessage, onClose, onError);
  };

  getWSInstance = () => {
    return websocket;
  };

  createWSConnections = authToken => {
    console.log('authToken,rideId', authToken);
    if (!websocket) {
      let url = `https://emob.miraie.in/ws/v1/connect?auth=${authToken}`;
      console.log('websocket url', url);
      websocket = new WebSocket(url, null, {
        headers: {
          'user-agent': 'react-native',
        },
      });
      return websocket;
    }
  };

  closeWSConnection = () => {
    if (websocket) {
      websocket.close();
      websocket = null;
    }
  };

  sendMessage = msg => {
    console.log('websocket sendMessage SENT: ' + 'encodedMessage');
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(JSON.stringify(msg));
    if (websocket && websocket.send) {
      try {
        websocket.send(encodedMessage);
      } catch (error) {
        console.log('websocket sendMessage error: ', error);
      }
    }
    console.log('websocket sendMessage SENT: ' + encodedMessage);
  };

  createSocketListeners = (onOpen, onMessage, onClose, onError) => {
    if (websocket) {
      websocket.onopen = function (evt) {
        console.log('websocket opopen', evt);
        onOpen(evt);
      };
      websocket.onmessage = function (evt) {
        console.log('websocket onmessage evt', evt);
        onMessage(evt);
      };
      websocket.onerror = function (evt) {
        console.log('websocket onerror evt', evt);
        onError(evt);
      };
      websocket.onClose = function (evt) {
        onClose(evt);
        websocket = null;
      };
    }
  };
}

const socketPro = new SocketProvider();
Object.freeze(socketPro);
export default socketPro;
