import { useState, useRef } from 'react';
import styles from '../styles/MainView.module.css';
import {Note, AddNote} from './Note';
import { idGenerator } from '../utils';
// import { get } from './hooks/db';

const defaultNotes = [
  {text: "nota nota nota", date: '2020-01-01', id:"1"},
  {text: "nota2 bla bla bla", date: '2020-01-01', id:"2"},
];

export default function MainView() {
  const usuario = "Lucas";
  const [notes, setNotes] = useState(defaultNotes);

  function handleSetText(id, txt){
    setNotes(notes.map(note=>note.id === id? {...note, text:txt}: note))
  }

  function handleNewNote(){
    if(notes.length === 0){
      setNotes([
        {text: "", date: '2021-01-02', id: idGenerator()}
      ])
    }else{
      if(notes.at(-1).text !== ''){
        setNotes([
          ...notes,
          {text: "", date: '2021-01-02', id: idGenerator()}
        ])
      }
      else{
        setNotes([
          ...notes.slice(0,-1),
          {text: "", date: '2021-01-02', id: idGenerator()}
        ])
      }
    }
  }

  function handleOnBlur(id, txt){
    if(txt === '')
      setNotes([
        ...notes.filter(note=>note.id !== id)
      ])
  }

  function handleOnClose(id){
    setNotes([
      ...notes.filter(note=>note.id !== id)
    ])
  }
  
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        {`Olá, ${usuario}`}
      </div>
      <div className={styles.body}>
        {notes.map(({id, ...noteParams},i)=>
          <div key={id}>
            <Note
            {...noteParams}
            setText={txt=>handleSetText(id, txt)}
            onBlur={txt=>handleOnBlur(id, txt)}
            onClose={()=>handleOnClose(id)}
            />
          </div>
        )}
        <AddNote onClick={handleNewNote}/>
      </div>
    </div>
  );
}