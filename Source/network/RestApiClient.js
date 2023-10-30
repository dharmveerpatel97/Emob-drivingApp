import {urls} from '../utils/config';

export default RestApiClient = (method, body, endPoint, type, bearerToken) =>
  new Promise((resolve, reject) => {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let BASEURL;
    if (type === 'IAM') {
      BASEURL = urls.BASE_URL;
    } else if (type === 'RMS') {
      BASEURL = urls.DMS_BASE_URL;
    } else {
      BASEURL = urls.DMS_BASE_URL;
    }
    if (bearerToken) {
      myHeaders.append('Authorization', 'Bearer ' + bearerToken);
    }
    if (method === 'POST') {
      fetch(BASEURL + endPoint, {
        method: method,
        headers: myHeaders,
        body: body,
      })
        .then(response => response.json())
        .then(obj => {
          console.log('D in line no 26',obj);
          resolve(obj);
        })
        .catch(error => {
          console.log('D post method in line no 30');
          reject(error);
        });
    } else if (method === 'PUT') {
      fetch(BASEURL + endPoint, {
        method: method,
        headers: myHeaders,
        body: body,
      })
        .then(response => response.json())
        .then(obj => {
          console.log('D in line no 40');
          resolve(obj);
        })
        .catch(error => {
          console.log('D in line no 43');
          reject(error);
        });
    } else {
      fetch(BASEURL + endPoint, {
        method: method,
        headers: myHeaders,
        body: body,
      })
        .then(response => {
          // console.log('response',response)
          return response.json()
        })
        .then(obj => {
          console.log('D in line no 54');
          resolve(obj);
        })
        .catch(error => {
          console.log('D in line no 58');
          reject(error);
        });
    }
  });
