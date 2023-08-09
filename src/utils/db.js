import CryptoJS from 'crypto-js';
import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

const buildEncrypt = (token) => (message) => CryptoJS.AES.encrypt(message, token).toString();
const buildDecrypt = (token) => (message) => CryptoJS.AES.decrypt(message, token).toString(CryptoJS.enc.Utf8);

const sha256 = msg => CryptoJS.SHA256(msg).toString();
const appEncrypt = buildEncrypt(process.env.API_KEY);
const appDecrypt = buildEncrypt(process.env.API_KEY);

const db = new Dexie('notes_app_db');

db.version(1).stores({
    notes: '++id, text, creation_date, last_update_date, user_id',
    users: '[name+password]',
});

function addUser(name, password){
    const hashedPassword = sha256(password);
    return db.users.add({name, password: hashedPassword});
}

async function validateLogin(name, password){
    const hashedPassword = sha256(password);
    const user = await db.users.where({name, password: hashedPassword}).first();
    if(user){
        function addNote(text=''){
            const now = +(new Date());
            return db.notes.add({
                text,
                user_id: user.id,
                creation_date: now,
                last_update_date: now,
            })
        }
        function updateNote(id, text){
            const now = +(new Date());
            return db.notes.update(id, {
                text,
                last_update_date: now,    
            })
        }
        function deleteNote(id){
            return db.notes.delete(id);
        }
        return {
            name,
            useNotes: c=>useLiveQuery(()=>c(db.notes)),
            addNote,
            updateNote,
            deleteNote
        }
    }
}


export {
    addUser,
    validateLogin,
}