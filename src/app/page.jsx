"use client"
import style from './home.module.scss'
import { useState, useEffect, useRef } from 'react';
import GitHubButton from 'react-github-btn'

export default function Home() {

  const allCommands = ["ls","cd","pwd","mkdir", "clear", "touch","cp","mv","rm","cat","echo","grep","chmod","chown","ps","kill","df","du","tar","gzip","uname","ifconfig","ping","traceroute","ssh","scp","curl","wget","sudo","apt","yum","systemctl","journalctl","top","htop","whoami","date","cal","history","find","sed","awk","head","tail","sort","uniq","wc","cut","paste","diff","patch","zip","unzip","free","bg","fg","jobs","nice","renice","at","chroot","cron","crontab","ulimit","mount","umount","fdisk","mkfs","dd","ln","lsmod","modinfo","insmod","rmmod","lsblk","lsof","netstat","ss","iwconfig","route","nmcli","hostname","passwd","useradd","userdel","groupadd","groupdel","usermod","su","visudo","w","who","last","finger","id","uptime","killall","pkill","pgrep","mkfifo","mknod","readlink","stat","sync","ul","blockdev","hwclock","lshw","lsusb","lspci","lsdev","udevadm","dmesg","logrotate","syslog","rmdir","watch","sleep","atq","atrm","ip","host","dig","nslookup","whois","tcpdump","wireshark","iftop","telnet","nc","nmap","openssl","rsync","ftp","ncftp","lynx","links","w3m","atop","iotop","nohup","service","chkconfig","systemd-analyze","systemd-cgtop","systemd-cat","systemd-coredumpctl","systemd-delta","systemd-detect-virt","systemd-escape","systemd-hwdb","systemd-inhibit","systemd-machine-id-setup","systemd-notify","systemd-nspawn","systemd-path","systemd-resolve","systemd-run","systemd-stdio-bridge","systemd-sysusers","systemd-tmpfiles","systemd-tty-ask-password-agent","systemd-umount","systemd-update-utmp","systemd-verify","systemd-cgls"];
  const [usedCommands, setUsedCommands] = useState([]);
  const [commandList, setCommandList] = useState([]);
  const [queue, setQueue] = useState(0);
  const [correct, setCorrect] = useState(true);
  const [correctList, setCorrectList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState({speed: 0, accuracy: 0, wrongCommands: 0, show: false});
  const [timer, setTimer] = useState({time: 60, showcase: "1:00", start: false});
  const [lastDis, setLastDis] = useState({distance: 0, count: 0});
  const wordContainer = useRef(null);
  const input = useRef(null);

  const addCommand = (e) => {
    // Check if user Entered
    if(timer.time == 0) return
    if(!isPlaying && e.target.value != "") {
      setIsPlaying(true);
      setTimer({...timer, start: true});
    }
    
    if(e.keyCode == 13) {
      let elParentDistance = -(wordContainer.current.getBoundingClientRect().top - wordContainer.current.children[queue+1].getBoundingClientRect().top).toFixed(2);
      if(elParentDistance > lastDis.distance) {
        wordContainer.current.style.transform = `translateY(-${(lastDis.count+1)*45.5}px)`;
        setLastDis({distance: elParentDistance, count: lastDis.count+1});
      } else {
        setLastDis({distance: elParentDistance, count: lastDis.count});
      }
      
      if(isPlaying) {
        if(e.target.value != "") {
          setQueue(queue + 1);
          setCorrect(true);
        }
        if(e.target.value.trim() == commandList[queue]) {
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
      if(commandList[queue].startsWith(e.target.value.trim())) {
        setCorrect(true);
      } else {
        setCorrect(false);
      }
    }
  }

  const shuffleCommands = async () => {
    let shuffled = await allCommands.sort(() => Math.random() - 0.5);
    setCommandList(shuffled);
  }

  useEffect(() => {
    shuffleCommands()
  }, [])

  const restartGame = () => {
    setIsPlaying(false);
    setQueue(0);
    setCorrectList([]);
    setCorrect(true);
    input.current.value = "";
    setCommandList(allCommands.sort(() => Math.random() - 0.5));
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
    if(!isPlaying && queue == correctList.length && timer.time == 0) {
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
        wordContainer.current.style.transform = `translateY(0px)`;
        setLastDis({distance: 0, count: 0});
        calculateResults();
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
              <div key={index} className={style.pastCommand}><span className={style.label}><span className={style.userDefine}>root@linuxtyper</span>:~$</span> <span>{command}</span></div>
            ))
          }
        </div>
        <div className={style.inp}>
          <div className={style.label}><span className={style.userDefine}>root@linuxtyper</span>:~$</div>
          <input className={style.terminalInput} ref={input} spellCheck={false} onKeyUp={(e) => addCommand(e)} type="text" />
        </div>
      </div>
      <div className={style.timer}>{timer.showcase}</div>
      <div className={style.wordsSection}>
        <div className={style.words} ref={wordContainer}>
          {
            commandList && commandList.map((command, index) => (
              <div key={index} className={`${style.word} ${index == queue && correct ? style.true : index == queue && !correct && style.wrong}`}>{command}</div>
            ))
          }
        </div>
      </div>
      {
        results?.show && (
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
      <div className={style.promote}>
        <span className={style.madeBy}>made by <a target="_blank" href="https://github.com/Lshiroc" className={style.bylink}>Zeynal Mardanli (Lshiroc)</a></span>
        <div className={style.star}>
          <GitHubButton href="https://github.com/Lshiroc/linuxtyper.com" data-color-scheme="no-preference: light; light: dark; dark: light;" data-size="large" data-show-count="true" aria-label="Star Lshiroc/linuxtyper.com on GitHub">Star</GitHubButton>
        </div>
      </div>
    </main>
  )
}
