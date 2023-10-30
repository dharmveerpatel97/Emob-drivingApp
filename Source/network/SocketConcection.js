import {io} from 'socket.io-client';
import { urls } from '../utils/config';
let authToken = '2bb07d10-e0ae-402f-915f-c9f774b535c8'
let rideID = '644b6245676fde8389e22b65'
// let URL = `${urls.DMS_BASE_URL}ws/v1/connect/con?auth=${authToken}&rideRequestId=${rideID}`
let URL = `wss://k8s-neuro-ingressd-68355dad55-1868134886.ap-south-1.elb.amazonaws.com/ws/v1/connect?auth=2bb07d10-e0ae-402f-915f-c9f774b535c8`

console.log('URL',URL)
//  const socket = io('ws://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV');
socket.on('message', ()=>{
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
});
socket.on('connect', () => {
    console.log('Connected to server');
  });
  
  socket.on('connecting', (data) => {
    console.log('Connecting to server',data);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  console.log('Connected to',socket)
export default socket
