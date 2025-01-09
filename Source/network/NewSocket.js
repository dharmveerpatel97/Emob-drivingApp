import { TextDecoder, TextEncoder } from 'text-encoding';
import NetInfo from "@react-native-community/netinfo";

class SocketProvider {
    websocket = null;
    listeners = {}; // Store listeners for dynamic registration

    constructor() {
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
    }

    register = (eventName, callback) => {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);

        if (this.websocket) {
            this.addWebSocketListener(eventName, callback);
        }
    };

    unregister = (eventName, callback) => {
        if (this.listeners[eventName]) {
            this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);

            if (this.websocket) {
                this.removeWebSocketListener(eventName, callback);
            }
        }
    };

    addWebSocketListener = (eventName, callback) => {
        if (this.websocket) {
            this.websocket[`on${eventName}`] = (evt) => {
                console.log(`WebSocket event: ${eventName}`, evt);
                callback(evt);
            };
        }
    }

    removeWebSocketListener = (eventName, callback) => {
        if (this.websocket && this.websocket[`on${eventName}`]) {
            // Find the correct event listener to remove.
            const originalListener = this.websocket[`on${eventName}`];
            if (originalListener) {
              this.websocket[`on${eventName}`] = null;
            }
        }
    }

    connect = async (authToken) => {
        if (this.websocket) {
            console.log("WebSocket is already connected.");
            return;
        }

        const netInfo = await NetInfo.fetch();
        if(!netInfo.isConnected){
            console.log("No internet connection")
            return
        }

        const url = `https://emob.miraie.in/ws/v1/connect?auth=${authToken}`;
        console.log('Connecting to WebSocket:', url);

        this.websocket = new WebSocket(url, null, {
            headers: {
                'user-agent': 'react-native',
            },
        });

        this.websocket.binaryType = 'arraybuffer'; // Important for binary data

        this.websocket.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000;
            this.triggerListeners('open');
        };

        this.websocket.onmessage = (evt) => {
            console.log('WebSocket message received:', evt);
            this.triggerListeners('message', evt);
        };

        this.websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.triggerListeners('error', error);
            this.reconnect();
        };

        this.websocket.onclose = (evt) => {
            console.log('WebSocket closed:', evt);
            this.websocket = null;
            this.triggerListeners('close', evt);
            this.reconnect();
        };

        // Add pre-existing listeners
        for (const eventName in this.listeners) {
            this.listeners[eventName].forEach(callback => {
                this.addWebSocketListener(eventName, callback);
            });
        }
    };

    disconnect = () => {
        if (this.websocket) {
            console.log('Disconnecting WebSocket');
            this.websocket.close();
            this.websocket = null;
        }
    };

    sendMessage = (msg) => {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            try {
                const encoder = new TextEncoder();
                const encodedMessage = encoder.encode(JSON.stringify(msg));
                this.websocket.send(encodedMessage);
                console.log('WebSocket message sent:', msg);
            } catch (error) {
                console.error('Error sending WebSocket message:', error);
                this.triggerListeners('error', error); // Trigger error listeners
            }
        } else {
            console.warn('WebSocket is not open. Message not sent:', msg);
        }
    };

    reconnect = async () => {
        const netInfo = await NetInfo.fetch();
        if(!netInfo.isConnected){
            console.log("No internet connection")
            return
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconnecting WebSocket in ${this.reconnectDelay / 1000} seconds (Attempt ${this.reconnectAttempts})...`);
            setTimeout(() => {
                this.connect(); // Reconnect without authToken, assuming it's stored
                this.reconnectDelay *= 2; // Exponential backoff
            }, this.reconnectDelay);
        } else {
            console.log('Max reconnection attempts reached. Please check your network connection.');
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000;
        }
    };

    triggerListeners = (eventName, ...args) => {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(callback => callback(...args));
        }
    };
}

const socketPro = new SocketProvider();
Object.freeze(socketPro);
export default socketPro;







// usages========
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import socketPro from './SocketProvider'; // Import your SocketProvider
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from './websocketSlice'; // Import your Redux actions

const MyComponent = () => {
    const [messageToSend, setMessageToSend] = useState('');
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.websocket.messages);
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const handleOpen = () => {
            console.log("Socket Opened in component")
            setIsConnected(true)
        };
        const handleMessage = (event) => {
            try {
                const decoder = new TextDecoder();
                const decodedMessage = decoder.decode(event.data);
                const parsedMessage = JSON.parse(decodedMessage);
                dispatch(addMessage(parsedMessage));
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        const handleError = (error) => {
            console.error("Socket Error in component", error)
            setIsConnected(false)
        }

        const handleClose = () => {
            console.log("Socket Closed in component")
            setIsConnected(false)
        }

        socketPro.register('open', handleOpen);
        socketPro.register('message', handleMessage);
        socketPro.register('error', handleError)
        socketPro.register('close', handleClose)

        return () => {
            socketPro.unregister('open', handleOpen);
            socketPro.unregister('message', handleMessage);
            socketPro.unregister('error', handleError)
            socketPro.unregister('close', handleClose)
        };
    }, [dispatch]);

    const connectWebSocket = async () => {
        const authToken = 'YOUR_AUTH_TOKEN'; // Replace with your actual auth token
        await socketPro.connect(authToken);
    };

    const disconnectWebSocket = () => {
        socketPro.disconnect();
    };

    const sendMessage = () => {
        if (messageToSend) {
            socketPro.sendMessage({ type: 'chat_message', message: messageToSend });
            setMessageToSend('')
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Connect WebSocket" onPress={connectWebSocket} disabled={isConnected} />
            <Button title="Disconnect WebSocket" onPress={disconnectWebSocket} disabled={!isConnected} />
            <TextInput
                style={styles.input}
                placeholder="Enter message"
                value={messageToSend}
                onChangeText={setMessageToSend}
            />
            <Button title="Send Message" onPress={sendMessage} disabled={!isConnected} />
            {messages.map((msg, index) => (
                <Text key={index}>{JSON.stringify(msg)}</Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default MyComponent;
