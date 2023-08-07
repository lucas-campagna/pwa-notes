import CryptoJS from 'crypto-js';

const buildEncrypt = (token) => (message) => CryptoJS.AES.encrypt(message, token).toString();
const buildDecrypt = (token) => (message) => CryptoJS.AES.decrypt(message, token).toString(CryptoJS.enc.Utf8);

const appEncrypt = buildEncrypt(process.env.API_KEY)
const appDecrypt = buildEncrypt(process.env.API_KEY)

const metadata = {
    dbName: 'notes_app_db',
    version: 1,
    db: undefined,
}

var tables = {
    notes: {
        options: {keyPath: 'id', autoIncrement: true},
        fields: ['text', 'creation_date', 'last_update_date', 'author_id'],
        encrypted: [0,1,2],
    },
    users: {
        options: {keyPath: 'name'},
        fields: ['password'],
        encrypted: [0]
    },
    getEncryptedFields: function(table){
        return this[table].encrypted.map(i=>this[table].fields[i])
    }
}

window.onload = () =>{
    console.log("Database criado!")
    const request = indexedDB.open(metadata.dbName, metadata.version);
    request.onupgradeneeded = event => {
        console.log('onupgradeneeded')
        metadata.db = event.target.result;
        Object.entries(tables).map(([table, {options, fields}])=>{
            const objectStore = metadata.db.createObjectStore(table, options);
            fields.forEach(field=>objectStore.createIndex(field, field));
        })
    }
    request.onsuccess = ()=>{
        metadata.db = request.result
        console.log('request.onsuccess ', metadata.db !== undefined)
    }
}

function addUser(name, password){
    return addData('users', {name, password}, process.env.API_KEY, tables.getEncryptedFields('users'));
}

async function validateLogin(name, password){
    return new Promise(async(res, rej)=>{
        const users = await getData('users', process.env.API_KEY);
        console.log(users)
        const validUsers = users.filter(data=>data.name === name && data.password === password)
        validUsers.length > 0 ? res(appEncrypt(password)) : rej()
    })
}

function getNotes(token){
    const users = getData('users').filter(user=>user.password === token)
    const author_id = users.length > 0 ? users[0].id : undefined;
    if(author_id)
        return getData('notes', token, tables.getEncryptedFields('notes')).filter(note => note.author_id === author_id);
    return []
}
const addNote = (data, token) => addData('notes', data, token, tables.getEncryptedFields('notes'))

function getData(table, token='', decryptFields=[]){
    const decrypt = (token && decryptFields)? buildDecrypt(appDecrypt(token)) : undefined;
    return new Promise((res, rej)=>{
        try{
            console.log(metadata.db)
            if(metadata.db){
                const objectStore = metadata.db.transaction([table]).objectStore(table);
                const data = [];
                const request = objectStore.openCursor();
                request.onsuccess = event =>{
                    const cursor = event.target.result;
                    if(cursor){
                        let newValue = cursor.value;
                        if(decrypt){
                            decryptFields.forEach(field => {
                                newValue[field] = decrypt(cursor.value[field]);
                            })
                        }
                        data.push(newValue);
                        cursor.continue();
                    }else{
                        res(data);
                    }
                }
                request.onerror = rej;
            }
        }catch(error){
            rej(error)
        }
    })
}

function addData(table, data, token='', encryptFields=[]){
    const encrypt = token && encryptFields ? buildEncrypt(appDecrypt(token)) : undefined;
    return new Promise((res, rej)=>{
        try{
            if(metadata.db){
                const transaction = metadata.db.transaction([table], 'readwrite')
                transaction.onerror = rej;
                const objectStore = transaction.objectStore(table);
                objectStore.onerror = rej;
                var dataToAdd = Object.assign({}, data);
                if(encrypt){
                    encryptFields.forEach(field => {
                        dataToAdd[field] = encrypt(data[field]);
                    })
                }
                const addRequest = objectStore.add(dataToAdd)
                addRequest.onerror = rej;
                addRequest.onsuccess = res;
            }
        }catch(error){
            rej(error)
        }
    })

}

export {
    addUser,
    validateLogin,
    getNotes,
    addNote,
}