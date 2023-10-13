import ls from 'localstorage-slim';

export const getStorage = (key) =>{
    return ls.get(key,{decrypt:true});
}

export const removeStorage = (key) => {
    ls.remove(key);
}

export default getStorage;