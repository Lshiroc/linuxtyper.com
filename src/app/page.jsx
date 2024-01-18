"use client"
import style from './home.module.scss'
import { useState } from 'react';

export default function Home() {

  const [usedCommands, setUsedCommands] = useState([]);
  const [commandList, setCommandList] = useState(["sudo su", "mkdir", "ls -la", "nmap -p- 10.20.3.4", "clear", "rm -f file.txt", "rf myFolder"]);
  const [queue, setQueue] = useState(0);
  const [correct, setCorrect] = useState(true);

  const addCommand = (e) => {
    // Check if user Entered
    if(e.keyCode == 13) {
      if(e.target.value == commandList[queue]) {
        setQueue(queue + 1);
      }

      if(e.target.value == "clear") {
        setUsedCommands([]);
        e.target.value = "";
      } else {
        const command = e.target.value;
        setUsedCommands([...usedCommands, command]);
        e.target.value = "";
      }
    } else {
      // Check if word is correct
      if(commandList[queue].startsWith(e.target.value)) {
        setCorrect(true);
      } else {
        setCorrect(false);
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
          <input className={style.terminalInput} spellCheck={false} onKeyUp={(e) => addCommand(e)} type="text" />
        </div>
      </div>
      <div className={style.words}>
          {
            commandList.map((command, index) => (
              <div key={index} className={`${style.word} ${index == queue && correct ? style.true : index == queue && !correct && style.wrong}`}>{command}</div>
            ))
          }
      </div>
    </main>
  )
}
