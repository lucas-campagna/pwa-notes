import React from 'react'
import CryptoJS from 'crypto-js';
import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

const buildEncrypt = (token) => (message) => CryptoJS.AES.encrypt(message, token).toString();
const buildDecrypt = (token) => (message) => CryptoJS.AES.decrypt(message, token).toString(CryptoJS.enc.Utf8);

const sha256 = msg => CryptoJS.SHA256(msg).toString();
const appEncrypt = buildEncrypt(process.env.REACT_APP_API_KEY);
const appDecrypt = buildDecrypt(process.env.REACT_APP_API_KEY);

const decryptNote = note => ({
    ...note,
    text: appDecrypt(note.text),
    creation_date: appDecrypt(+note.creation_date),
    last_update_date: appDecrypt(+note.last_update_date),
})
const encryptNode = note => ({
    ...note,
    text: appEncrypt(note.text),
    last_update_date: appEncrypt(note.last_update_date.toString()),
    ...('creation_date' in note ? {creation_date: appEncrypt(note.creation_date.toString())} : {}),
})

const db = new Dexie('notes_app_db');

db.version(1).stores({
    notes: '++id, text, creation_date, last_update_date',
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
            const newNote = {
                text,
                creation_date: now,
                last_update_date: now,
            }
            db.notes.add(encryptNode(newNote))
        }
        function updateNote(id, text){
            const now = +(new Date());
            return db.notes.update(id, encryptNode({
                text,
                last_update_date: now, 
            }))
        }
        function deleteNote(id){
            return db.notes.delete(id);
        }
        function useNotes(){
            return useLiveQuery(()=>db.notes.toArray(p=>p.map(decryptNote)))
        }
        return {
            name,
            useNotes,
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