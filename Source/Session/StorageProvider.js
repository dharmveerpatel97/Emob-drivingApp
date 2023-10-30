import AsyncStorage from "@react-native-async-storage/async-storage"

export default StorageProvider={
    
    saveItem:(key,item)=> new Promise(function(resolve,reject){  
            AsyncStorage.setItem(key,item)
            .then(()=>{
                resolve();
            }).catch((error)=>{
                reject(error)
            })
    }),
    removeItem:(key)=> new Promise(function(resolve,reject){  
        AsyncStorage.removeItem(key)
        .then(()=>{
            resolve();
        }).catch((error)=>{
            reject(error)
        })
    }),
    getItem:(key)=>new Promise(function(resolve, reject){
        AsyncStorage.getItem(key)
        .then((res)=>{
            resolve(res)
        })
        .catch((error)=>{
            reject(error)
        })
    }),

    setObject:(key,item)=> new Promise(function(resolve,reject){  
        AsyncStorage.setItem(key,JSON.stringify(item))
        .then(()=>{
            resolve();
        }).catch((error)=>{
            reject(error)
        })
    }),
    getObject:(key)=>new Promise(function(resolve, reject){
        AsyncStorage.getItem(key)
        .then((res)=>{
            console.log(key+'=',JSON.parse(res))
            resolve(JSON.parse(res))
        })
        .catch((error)=>{
            reject(error)
        })
    }),

    clear:()=>new Promise(function(resolve, reject){
        AsyncStorage.clear()
        .then((res)=>{
            resolve(res)
        })
        .catch((error)=>{
            reject(error)
        });
    })
}