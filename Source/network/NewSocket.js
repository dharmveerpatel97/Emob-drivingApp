import { TextDecoder, TextEncoder } from 'text-encoding';
import NetInfo from "@react-native-community/netinfo";

class SocketProvider {
    websocket = null;
    listeners = {};
    messageQueue = []; // Queue for messages when disconnected

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
        if (!netInfo.isConnected) {
            console.log("No internet connection. Cannot connect.");
            return;
        }

        const url = `https://emob.miraie.in/ws/v1/connect?auth=${authToken}`;
        console.log('Connecting to WebSocket:', url);

        this.websocket = new WebSocket(url, null, {
            headers: {
                'user-agent': 'react-native',
            },
        });
        this.websocket.binaryType = 'arraybuffer';

        const connectionTimeout = setTimeout(() => {
            if (this.websocket && this.websocket.readyState !== WebSocket.OPEN) {
                console.log("WebSocket connection timeout.");
                this.websocket.close();
                this.reconnect();
            }
        }, 10000); // 10-second timeout

        this.websocket.onopen = () => {
            clearTimeout(connectionTimeout);
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000;
            this.sendQueuedMessages(); // Send queued messages after reconnection
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
            this.messageQueue = []; // Clear the queue on explicit disconnect
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
                this.triggerListeners('error', error);
            }
        } else {
            console.warn('WebSocket is not open. Queueing message:', msg);
            this.messageQueue.push(msg); // Queue the message
        }
    };

    sendQueuedMessages = () => {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN && this.messageQueue.length > 0) {
            console.log("Sending queued messages")
            this.messageQueue.forEach(msg => this.sendMessage(msg));
            this.messageQueue = []; // Clear the queue after sending
        }
    }

    reconnect = async () => {
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
            console.log("No internet connection. Cancelling reconnection attempts.");
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000;
            return;
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const jitter = Math.random() * 500;
            const delayWithJitter = Math.min(this.reconnectDelay + jitter, 30000);
            console.log(`Reconnecting WebSocket in ${delayWithJitter / 1000} seconds (Attempt ${this.reconnectAttempts})...`);
            setTimeout(async () => {
                const currentNetInfo = await NetInfo.fetch();
                if(!currentNetInfo.isConnected){
                    console.log("Network disconnected during reconnection attempt")
                    return
                }
                this.connect();
                this.reconnectDelay *= 2;
            }, delayWithJitter);
        } else {
            console.log('Max reconnection attempts reached. Please check your network connection.');
            this.triggerListeners('error', new Error("Max reconnection attempts reached"));
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
