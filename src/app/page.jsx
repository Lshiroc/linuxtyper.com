"use client"
import style from './home.module.scss'
import { useState } from 'react';

export default function Home() {

  const [usedCommands, setUsedCommands] = useState([]);

  const addCommand = (e) => {
    if(e.keyCode == 13) {
      if(e.target.value == "clear") {
        setUsedCommands([]);
        e.target.value = "";
      } else {
        const command = e.target.value;
        setUsedCommands([...usedCommands, command]);
        e.target.value = "";
      }
    }
  }

  return (
    <main className={`sectionx ${style.wrapper}`}>
      <div className={style.terminal}>
        <div className={style.pastCommands}>
          {
            usedCommands.map((command, index) => (
              <div key={index} className={style.pastCommand}><span className={style.label}><span className={style.userDefine}>root@mycomputer</span>:~$</span> <span>{command}</span></div>
            ))
          }
        </div>
        <div className={style.inp}>
          <div className={style.label}><span className={style.userDefine}>root@mycomputer</span>:~$</div>
          <input className={style.terminalInput} autoCorrect={false} spellCheck={false} onKeyDown={(e) => addCommand(e)} type="text" />
        </div>
      </div>
    </main>
  )
}
