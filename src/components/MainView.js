import { useContext } from 'react';
import styles from '../styles/MainView.module.css';
import {Note, AddNote} from './Note';
import { AlertsContext } from './Alerts';
import { AuthContext } from './Auth';

export default function MainView() {
  const { user, logout } = useContext(AuthContext);

  const notes = user.useNotes()
  
  async function handleAddNote(){
    user.addNote();
  }
  function handleOnBlur(id, txt){
    if(txt === '')
      handleDeleteNote(id)
  }
  function handleDeleteNote(id){
    user.deleteNote(id)
  }
  function handleUpdateNote(id, text){
    user.updateNote(id, text)
  }
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.welcome}>
          {`Welcome, ${user.name}!`}
        </div>
        <div className={styles.headerLogout} onClick={logout}>
          logout
        </div>
      </div>
      <div className={styles.body}>
        {notes?.map(({id, ...noteParams},i)=>
          <div key={id}>
            <Note
            {...noteParams}
            setText={txt=>handleUpdateNote(id, txt)}
            onBlur={txt=>handleOnBlur(id, txt)}
            onClose={()=>handleDeleteNote(id)}
            />
          </div>
        )}
        <AddNote onClick={handleAddNote}/>
      </div>
    </div>
  );
}