import {urls} from '../utils/config'; 
export default RestApiRedux = (method, body, endPoint, type, bearerToken,directUrl="") =>
  new Promise((resolve, reject) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let BASEURL;
    if(directUrl){
      BASEURL=directUrl
    }else{
      if (type === 'IAM') {
        BASEURL = urls.BASE_URL+ endPoint;
      } else if (type === 'RMS') {
        BASEURL = urls.DMS_BASE_URL+ endPoint;
      }else {
        BASEURL = urls.DMS_BASE_URL+ endPoint;
      }
    }

    if (bearerToken) {
      myHeaders.append('Authorization', 'Bearer ' + bearerToken);
    }
    console.log('myHeaders',myHeaders)
    console.log('method',method)
    if (method === 'POST') {
      fetch(BASEURL, {
        method: method,
        headers: myHeaders,
        body: body,
      })
        .then(async response => {
         
          if (response.status !== 200) {
            if(response.status==404){
              throw {message: 'Page not found',status:404};
            }
            if(response.status==401){
              throw {message: 'Unauthorized',status:401};
            }
            if(response.status==405 ){
              throw {message: 'Method not allowed',status:405 };
            }
            if(response.status==502 ){
                throw {message: 'Bad Gatway',status:502 };
            }
            const error = await response.json();
            throw {message: error?.message,status:error?.cod};
          }
          return await response.json();
        })
        .then(obj => {
          console.log('D in line no 50');
          resolve(obj);
        })
        .catch(error => {
          console.log('D post method in line no 54');
          reject(error);
        });
    } else if (method === 'PUT') {
      fetch(BASEURL, {
        method: method,
        headers: myHeaders,
        body: body,
      }).then(async response => {
        console.log('response',response)
          if (response.status !== 200) {
            if(response.status==404){
              throw {message: 'Page not found',status:404};
            }
            if(response.status==401){
              throw {message: 'Unauthorized',status:401};
            }
            // if(response.status==400){
            //   throw {message: 'Bad Request',status:400};
            // }
            if(response.status==405 ){
              throw {message: 'Method not allowed',status:405 };
            }
            if(response.status==502 ){
                throw {message: 'Bad Gatway',status:502 };
            }
            const error = await response.json();
            throw {message: error?.message,status:error?.cod};
          }
          return await response.json();
        })
        .then(obj => {
          console.log('D in line no 83');
          resolve(obj);
        })
        .catch(error => {
            console.log('D in line no 87',error);
            reject(error);
        });
    } else {
      fetch(BASEURL, {
        method: method,
        headers: myHeaders,
      })
        .then(async response => {
          console.log("909090",response.status,BASEURL)
          if (response.status !== 200) {
            if(response.status==404){
              throw {message: 'Page not found',status:404};
            }
            if(response.status==401){
              throw {message: 'Unauthorized',status:401};
            }
            // if(response.status==400){
            //   throw {message: 'Bad Request',status:400};
            // }
            if(response.status==405 ){
              throw {message: 'Method not allowed',status:405 };
            }
            if(response.status==502 ){
                throw {message: 'Bad Gatway',status:502 };
            }
            const error = await response.json();
            throw {message: error?.message,status:error?.cod};
          }
          return await response.json();
        })
        .then(obj => {
          console.log('D in line no 117');
          resolve(obj);
        })
        .catch(error => {
          console.log('D in line no 121');
          reject(error);
        });
    }
  });
