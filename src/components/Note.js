import styles from '../styles/Note.module.css';

export function Note({text, setText, date, editable, id, onBlur, onClose}) {
    return (
      <div className={styles.noteRoot} autoFocus={true}>
        <div className={styles.noteHeader} onClick={onClose}>
        x
        </div>
          <textarea
            className={styles.note}
            value={text}
            onChange={ev=>setText?setText(ev.target.value):null}
            autoFocus={true}
            onBlur={ev=>onBlur?onBlur(ev.target.value):null}
          />
      </div>
    )
}
  
export function AddNote({onClick}) {
    return (
        <div className={styles.addNote} autoFocus={true} onClick={onClick}>
        <div className={styles.addNotePlus}>
            +
        </div>
        </div>
    )
}

