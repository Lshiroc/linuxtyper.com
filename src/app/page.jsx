"use client"
import style from './home.module.scss'
import { useState, useEffect, useRef } from 'react';

export default function Home() {

  const [usedCommands, setUsedCommands] = useState([]);
  const [commandList, setCommandList] = useState(['ls', 'cd', 'pwd', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'touch', 'cat', 'nano', 'vim', 'grep', 'find', 'chmod', 'chown', 'ps', 'kill', 'top', 'df', 'du', 'tar', 'gzip', 'ping', 'ifconfig', 'scp', 'ssh', 'wget', 'curl', 'uname', 'date', 'history', 'man', 'alias', 'echo', 'export', 'sudo', 'passwd', 'whoami', 'hostname', 'ln', 'uptime', 'journalctl', 'lsblk', 'fdisk', 'mount', 'umount', 'iwconfig', 'netstat', 'dd']);
  const [queue, setQueue] = useState(0);
  const [correct, setCorrect] = useState(true);
  const [correctList, setCorrectList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState({speed: 0, accuracy: 0, wrongCommands: 0, show: false});
  const [timer, setTimer] = useState({time: 60, showcase: "1:00", start: false});
  const [lastDis, setLastDis] = useState({distance: 0, count: 0});
  const wordContainer = useRef(null);

  const addCommand = (e) => {
    // Check if user Entered
    if(!isPlaying && e.target.value != "") {
      setIsPlaying(true);
      setTimer({...timer, start: true});
    }
    
    if(e.keyCode == 13) {
      let elParentDistance = wordContainer.current.getBoundingClientRect().right - wordContainer.current.children[queue+1].getBoundingClientRect().right;
      if(lastDis.distance != 0) {
        console.log(elParentDistance, lastDis.distance)
        if(elParentDistance > lastDis.distance) {
          console.log(lastDis.count)
          wordContainer.current.style.transform = `translateY(-${(lastDis.count+1)*44}px)`;
          setLastDis({distance: elParentDistance, count: lastDis.count+1});
        }
      } else {
        setLastDis({distance: elParentDistance, count: lastDis.count});
      }
      setQueue(queue + 1);

      if(isPlaying) {
        if(e.target.value == commandList[queue]) {
          setCorrectList([...correctList, true]);
        } else {
          setCorrectList([...correctList, false]);
        }
  
        if(e.target.value == "clear") {
          setUsedCommands([]);
          e.target.value = "";
        } else {
          const command = e.target.value;
          setUsedCommands([...usedCommands, command]);
          e.target.value = "";
        }
  
        if(queue == commandList.length-1) {
          setIsPlaying(false);
        }
      }
    } else if(isPlaying) {
      // Check if word is correct
      if(commandList[queue].startsWith(e.target.value)) {
        setCorrect(true);
      } else {
        setCorrect(false);
      }
    }
  }

  useEffect(() => {
    console.log(lastDis)
  }, [lastDis])

  const restartGame = () => {
    setIsPlaying(false);
    setQueue(0);
    setCorrectList([]);
    setCorrect(true);
    setTimer({time: 60, showcase: "1:00", start: false});
    setResults({speed: 0, accuracy: 0, wrongCommands: 0, show: false});
  }

  const calculateResults = () => {
    let corrects = 0;
    let wrongs = 0;
    let speed = 0;

    correctList.map((correct) => {
      if(correct) {
        corrects++;
      }
    })

    wrongs = correctList.length - corrects;
    speed = corrects;
    
    setResults({
      speed,
      wrongCommands: wrongs,
      accuracy: 0,
      show: true
    });
  }

  useEffect(() => {
    if(!isPlaying && queue == correctList.length) {
      calculateResults();
    }
  }, [isPlaying])
  
  useEffect(() => {
    if(isPlaying) {
      if(timer <= 0) return 0;
      const timeout = setTimeout(() => {
        let showcase = "";
        if(timer.time-1 == "60") {
          showcase = "1:00";
        } else if(timer.time-1 >= 10) {
          showcase = "0:" + (timer.time - 1);
        } else {
          showcase = "0:0" + (timer.time - 1);
        }
        setTimer({...timer, time: timer.time-1, showcase});
      }, 1000);

      if(timer.time == 0 || !isPlaying) {
        clearTimeout(timeout);
      }

      return () => clearTimeout(timeout);
    }
  }, [timer, isPlaying])

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
      <div className={style.timer}>{timer.showcase}</div>
      <div className={style.wordsSection}>
        <div className={style.words} ref={wordContainer}>
          {
            commandList.map((command, index) => (
              <div key={index} className={`${style.word} ${index == queue && correct ? style.true : index == queue && !correct && style.wrong}`}>{command}</div>
            ))
          }
        </div>
      </div>
      {
        results.show && (
          <div className={style.results}>
            <div className={style.line}>
              <div className={style.label}>Type Speed: </div>
              <div className={style.res}>{results.speed} CPM <small>(commands per minute)</small></div>
            </div>
            {/* <div className={style.line}>
              <div className={style.label}>Accuracy: </div>
              <div className={style.res}>{results.accuracy}</div>
            </div> */}
            <div className={style.line}>
              <div className={style.label}>Wrong Commands: </div>
              <div className={style.res}>{results.wrongCommands}</div>
            </div>
            <div className={style.line}>
              <span onClick={restartGame}>Restart</span>&nbsp;the game
            </div>
          </div>
        ) 
      }
    </main>
  )
}
