//ELEMENTS VARIABLES 
const time = document.getElementById('time'),
      greeting = document.getElementById('greeting'),
      type_section = document.getElementById("type-section"),
      format_section = document.getElementById("format-section")

class Storage {
    //LOADERS
    static loadName(name_input){
        console.log("loading name...")
        if(localStorage.getItem("name") === null || localStorage.getItem("name") === ""){
            name_input.textContent = "[your name]";
        }else{
            name_input.textContent = localStorage.getItem("name");
        }
    }
    static loadFocus(focus_input){
        console.log("loading focus...")
        if(localStorage.getItem("focus") === null || localStorage.getItem("focus") === ""){
            focus_input.textContent = "[your focus]";
        }else{
            focus_input.textContent = localStorage.getItem("focus");
        }
    }
    static loadClock(){
        if(localStorage.getItem("clockType") === null){
            localStorage.setItem("clockType", "currentTime")
        }
        return localStorage.getItem("clockType") 
    }
    static loadFormat24(){
        if(localStorage.getItem("format24") === null){
            localStorage.setItem("format24", "false")
        }
        return localStorage.getItem("format24")
    }
    static loadPomodoroInfo(){
        if(localStorage.getItem("pomodoroInfo") !== null){
            return JSON.parse(localStorage.getItem("pomodoroInfo"))
        }
    }
    static loadPomoSet(){
        if(localStorage.getItem("PomoSet") !== null){
            return localStorage.getItem("PomoSet")
        }else{
            return "false"
        }
    }
    static loadStopwatch(){
        if(localStorage.getItem("stopwatchTime") !== null){
            return JSON.parse(localStorage.getItem("stopwatchTime"))
        }else{
            return {mm: 0, ss: 0, ms: 0}
        }
    }
    static loadTimer(){
        if(localStorage.getItem("timer") !== null){
            return JSON.parse(localStorage.getItem("timer"))
        }else{  
            const timer = {
                mm: "00",
                ss: "00",
                ms: "00"
            }
            localStorage.setItem("timer", JSON.stringify(timer))
            return JSON.parse(localStorage.getItem("timer"))
        }
    }

    //SAVERS
    static saveName(name){
        localStorage.setItem("name", name)
    }
    static saveFocus(focus){
        localStorage.setItem("focus", focus)
    }
    static saveClock(type){
        localStorage.setItem("clockType", type)
    }
    static saveFormat24(value){
        localStorage.setItem("format24", value)
    }
    static savePomodoroInfo(info){
        localStorage.setItem("pomodoroInfo", JSON.stringify(info))
    }
    static savePomoSet(state){
        localStorage.setItem("PomoSet", state)
    }
    static saveStopwatchTime(mm, ss, ms){
        const stopwatchTime = {mm: mm, ss: ss, ms: ms}
        localStorage.setItem("stopwatchTime", JSON.stringify(stopwatchTime))
    }
    static saveTimer(timerArr){
        const timer = {
            mm: timerArr.slice(0,2).join(''),
            ss: timerArr.slice(2,4).join(''),
            ms: timerArr.slice(4,6).join('')
        }
        console.log("Timer saved: ", timer)
        localStorage.setItem("timer", JSON.stringify(timer))
    }
}


class UI {
    //SET UP EVENTS
    static stdSetUp(){
        const   clock_type = document.getElementById("clock-icon"),
                type_option = [...document.getElementsByClassName("type-option")],
                type_card = document.getElementById("type-card"),
                name_input = document.getElementById('name'),
                focus_input = document.getElementById('focus') 

        //clock
        clock_type.addEventListener("click",()=>{
            type_card.classList.toggle("visible")
        })

        //clock card
        type_option.forEach(element => {
            element.addEventListener("click", ()=>{
                console.log(element.id)
                switch(element.id){
                    case "currentTime": Clocks.currentTime(); clock_type.textContent = "access_time"; break;
                    case "pomodoro": Clocks.pomodoro(); clock_type.textContent = "room_service"; break;
                    case "stopwatch": Clocks.stopwatch(); clock_type.textContent = "timer"; break;
                    case "timer": Clocks.timer(); clock_type.textContent = "timelapse"; break;
                }
            })
        })

        //inputs
        name_input.addEventListener("keypress", () => Storage.saveName(name_input.textContent))
        name_input.addEventListener("blur", () => Storage.saveName(name_input.textContent))

        focus_input.addEventListener("keypress", () => Storage.saveFocus(focus_input.textContent))
        focus_input.addEventListener("blur", () => Storage.saveFocus(focus_input.textContent))

        //User information
        Storage.loadName(name_input);
        Storage.loadFocus(focus_input);

        UI.setBgGreet()
    }

    static clockSetUp() {
        format_section.innerHTML = ''
        switch(Storage.loadClock()){
            case "currentTime": format_section.innerHTML = `<i class="btn material-icons" id="control-icon">more_horiz</i>
                                                            <div id="format24-card" class="hidden">
                                                                <span>24hr format</span>
                                                                <i id="toggle-switch" class="toggle-btn material-icons ${Storage.loadFormat24() === "true" ? "toggle-on" : ""}">${Storage.loadFormat24() === "true" ? "toggle_on" : "toggle_off"}</i>
                                                            </div>`
                                
                                const time_format = document.getElementById("control-icon") //currentTime icon
                                const toggle_btn = document.getElementById("toggle-switch") //card Button
                                const format_card = document.getElementById("format24-card") //cart
                                time_format.addEventListener("click",()=>{
                                    format_card.classList.toggle("visible")
                                })
        
                                toggle_btn.addEventListener("click", () => {
                                    toggle_btn.classList.toggle("toggle-on") //add color green
                                    toggle_btn.textContent = toggle_btn.textContent === "toggle_on" ? "toggle_off" : "toggle_on"; //change switch icon
                                    switch(toggle_btn.textContent){ //analize text content of the <i> element
                                        case "toggle_on":
                                                            Storage.saveFormat24("true");
                                                            break;
                                        case "toggle_off": 
                                                            Storage.saveFormat24("false");
                                                            break;
                                    }
                                })
                                break;
            case "pomodoro":    format_section.innerHTML = `<i class="btn material-icons" id="control-icon">play_circle</i>
                                                            <div id="pomodoro-info">
                                                                <ul>
                                                                    <li class="pomodoro-info-item">Duration: ${Storage.loadPomodoroInfo().duration.min}:${Storage.loadPomodoroInfo().duration.sec} </li>
                                                                    <li class="pomodoro-info-item">Short Break: ${Storage.loadPomodoroInfo().shortBreak.min}:${Storage.loadPomodoroInfo().shortBreak.sec} </li>
                                                                    <li class="pomodoro-info-item">Long Break: ${Storage.loadPomodoroInfo().longBreak.min}:${Storage.loadPomodoroInfo().longBreak.sec}</li>
                                                                    <li class="pomodoro-info-item">Cicles: ${Storage.loadPomodoroInfo().cycles}</li>
                                                                </ul>
                                                            </div>
                                                            <button id="new-pomodoro-btn">NEW</button>
                                                                `
                                document.getElementById("control-icon").addEventListener("click", (event)=>{
                                    event.target.textContent = event.target.textContent === "play_circle" ? "pause_circle" : "play_circle"
                                })
                                time.textContent = `${Storage.loadPomodoroInfo().duration.min}:${Storage.loadPomodoroInfo().duration.sec}`
                                console.log(Storage.loadPomodoroInfo().duration)
                                document.getElementById("new-pomodoro-btn").addEventListener("click", () =>{
                                    Storage.savePomoSet("false")
                                    Clocks.pomodoro()
                                    Storage.savePomoSet("true")
                                })
                                break;
            case "stopwatch":   format_section.innerHTML = `<i class="btn material-icons" id="control-icon">play_circle</i>`
                                document.getElementById("control-icon").style.fontSize = "3em"
                                break;
            case "timer":       format_section.innerHTML = `<i class="btn material-icons" id="control-icon">play_circle</i>`
                                let {mm,ms,ss} = Storage.loadTimer()
                                time.innerHTML = `<span class="unit" id="timer-mm">${mm}</span>:<span class="unit" id="timer-ss">${ss}</span>:<span class="unit" id="timer-ms" contenteditable>${ms}</span>`
                                break;
            default:  break;
        }
    }

    static setBgGreet(){
        let day = new Date()
        let curr_hour = day.getHours();
        if(curr_hour < 12){
            document.body.style.backgroundImage = 'url("img/morning.jpg")';
            greeting.textContent = "Good Morning";
        }else if(curr_hour < 23){           
            document.body.style.backgroundImage = 'url("img/afternoon.jpg")';
            greeting.textContent = "Good Afternoon";
        }else{
            document.body.style.backgroundImage = 'url("img/night.jpg")';
            greeting.textContent = "Good Night";
        }
        console.log("background set")
        const refresh_background = setInterval(this.setBgGreet, 100)
    }
}

class Clocks {

    static currentTime(){
        //SHOW TIME IN SCREEN
        function showTime(format24 = Storage.loadFormat24()){
            let today = new Date(),
                hour = today.getHours(),
                min = today.getMinutes(),
                sec = today.getSeconds();
            
            let amPm = hour >= 12 ? 'PM' : 'AM';
            
            //add zeros
            hour = addZero(hour)
            min = addZero(min)
            sec = addZero(sec)

            //12hr format
            if(format24 === "false"){
                hour = hour % 12 || 12
            }else{
            }
            
            if(Storage.loadClock() === "currentTime"){
                time.innerHTML = `${hour}<span>:</span>${min}<span>:</span>${sec} ${format24 === "true" ? '' : amPm}`; 
            }
            
            const refresh = function (){
                showTime()
            } 

            setTimeout(refresh, 100)
        }

        //add zero
        function addZero(n){
            return (parseInt(n,10) < 10 ? '0': '') + n
        }

        Storage.saveClock("currentTime");
        UI.clockSetUp(); 
        
        showTime();
    }
    

    static pomodoro(){
        console.log("running pomodoro menu...")
        console.log("Pomodoro state: " + Storage.loadPomoSet())
        if(Storage.loadPomoSet() === "false"){
            const pomodoroOverlay = document.createElement("div")
            const pomodoroMenu = document.createElement("div")

            pomodoroOverlay.id = "pomodoro-overlay"
            pomodoroMenu.id = "pomodoro-menu"

            pomodoroMenu.innerHTML = `      <h1 class="pomodoro-title">Pomodoro</h1>
                                            <form id="pomodoro-form">
                                                <div class="pomodoro-input-container">
                                                    <h6>Pomodoro duration <span class="pomodoro-description">(mm:ss)</span></h6>
                                                    <input class="input-field" type="number" id="pomodoro-duration-min" min="0" max="59" placeholder="00" maxlength="2" required></input>
                                                    <span>:</span>
                                                    <input class="input-field" type="number" id="pomodoro-duration-sec" min="0" max="59" placeholder="00" required></input>
                                                </div>
                                                <div class="pomodoro-input-container">
                                                    <h6>Short Break duration <span class="pomodoro-description">(mm:ss)</span></h6>
                                                    <input class="input-field" type="number" id="short-break-duration-min" min="0" max="59" placeholder="00" required></input>
                                                    <span>:</span>
                                                    <input class="input-field" type="number" id="short-break-duration-sec" min="0" max="59" placeholder="00" required></input>
                                                </div>
                                                <div class="pomodoro-input-container">
                                                    <h6>Long Break duration <span class="pomodoro-description">(mm:ss)</span></h6>
                                                    <input class="input-field" type="number" id="long-break-duration-min" min="0" max="59" placeholder="00" required></input>
                                                    <span>:</span>
                                                    <input class="input-field" type="number" id="long-break-duration-sec" min="0" max="59" placeholder="00" required></input>
                                                </div>
                                                <div class="pomodoro-input-container">
                                                    <h6>Cycles</h6>
                                                    <input class="input-field" type="number" id="cycles" min="0" max="5" placeholder="0" required></input>
                                                </div>
                                                <button type="submit" id="start-btn">START</button>
                                            </form>`

            pomodoroOverlay.addEventListener("click", () => {
                document.body.removeChild(pomodoroOverlay)
                document.body.removeChild(pomodoroMenu)
            })

            pomodoroMenu.addEventListener("mouseover", () => {
                document.getElementById("pomodoro-overlay").classList.add("disabled")
            })

            pomodoroMenu.addEventListener("mouseout", () => { 
                document.getElementById("pomodoro-overlay").classList.remove("disabled")
            })


            document.body.appendChild(pomodoroOverlay)
            document.body.appendChild(pomodoroMenu)

            const inputs = [...document.getElementsByClassName("input-field")]

            console.log(inputs)

            inputs.forEach(element => {
                element.addEventListener("input", ()=>{
                    if(element.id !== "cycles"){
                        if(element.value.length > 2){
                            element.value = element.value.slice(2)
                        }
                    }
                })
                element.addEventListener("blur", ()=>{
                    if(element.id !== "cycles"){
                        if(element.value.length < 2){
                            element.value = element.value < 10 ? '0' + element.value : element.value
                        }
                    }
                })
            })

            

            document.getElementById("pomodoro-form").addEventListener("submit", ()=>{
                const info = {
                    duration: {
                        min: document.getElementById("pomodoro-duration-min").value,
                        sec: document.getElementById("pomodoro-duration-sec").value
                    },
                    shortBreak: {
                        min: document.getElementById("short-break-duration-min").value,
                        sec: document.getElementById("short-break-duration-sec").value
                    },
                    longBreak: {
                        min: document.getElementById("long-break-duration-min").value,
                        sec: document.getElementById("long-break-duration-sec").value
                    },
                    cycles:  document.getElementById("cycles").value
                }
                Storage.savePomoSet("true")
                Storage.savePomodoroInfo(info)
                Storage.saveClock("pomodoro");
                UI.clockSetUp();
                document.body.removeChild(document.getElementById("pomodoro-overlay"))
                document.body.removeChild(document.getElementById("pomodoro-menu"))
            })   
        }
        else{
            console.log("no imprime pomo overlay")
            Storage.saveClock("pomodoro")
            UI.clockSetUp();
        }
    }

    static stopwatch(){
        let mm = Storage.loadStopwatch().mm
        let ss = Storage.loadStopwatch().ss
        let ms = Storage.loadStopwatch().ms
        
        time.textContent = `${mm < 10 ? '0' + mm : mm}:${ss < 10 ? '0' + ss : ss}:${ms < 10 ? '0' + ms : ms}`
        let refreshStopwatch = null;

        function start(){
            refreshStopwatch = setInterval(run, 100)
        }

        function pause(){
            clearTimeout(refreshStopwatch)
        }

        function stop(){
            Storage.saveStopwatchTime(0,0,0)
        }

        function run() {
            let mm = Storage.loadStopwatch().mm
            let ss = Storage.loadStopwatch().ss
            let ms = Storage.loadStopwatch().ms

            ms += 10
            if(ms === 100){
                ms = 0
                ss +=1
                if(ss === 60){
                    ss = 0
                    mm += 1
                    if(mm === 60){
                        mm = 60
                        ss = 60
                        ms = 100
                    }
                }
            }

            time.textContent = `${mm < 10 ? '0' + mm : mm}:${ss < 10 ? '0' + ss : ss}:${ms < 10 ? '0' + ms : ms}`
            Storage.saveStopwatchTime(mm, ss, ms)
        }

        Storage.saveClock("stopwatch")
        UI.clockSetUp();

        document.getElementById("control-icon").addEventListener("click", (event)=>{
            console.log("clicked in stopwatch")
            event.target.textContent = event.target.textContent === "play_circle" ? "pause_circle" : "play_circle"
            if(event.target.textContent === "pause_circle"){
                start()
                if(document.getElementById("stop-icon") !== null){
                    format_section.removeChild(document.getElementById("stop-icon"))
                }
            }else{
                pause()
                insertStopbtn()
            }
        })

        const insertStopbtn = () =>{
            if(document.getElementById("control-icon").textContent === "play_circle"){
                const stop_btn = document.createElement("div")
                stop_btn.classList.add("btn", "material-icons")
                stop_btn.id = "stop-icon"
                stop_btn.textContent = "stop"
                stop_btn.addEventListener("click", ()=>{
                    stop()
                    format_section.removeChild(stop_btn)
                    time.textContent = "00:00:00"
                })
                format_section.appendChild(stop_btn) 
            }
        }
        
        if(time.textContent !== "00:00:00"){
            insertStopbtn()
        }

        console.log("stopwatch loaded")
    }

    static timer(){
        Storage.saveClock("timer");
        UI.clockSetUp();

        const timer_ms = document.getElementById("timer-ms")
        timer_ms.focus()

        function allowInput(evt) {
            console.log(evt.which)
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            var isNumber = charCode < 58 && charCode > 47;
            var isBackspace = charCode == 8 || charCode == 46;
            return isNumber || isBackspace;
        }

        timer_ms.addEventListener('keydown', function (e) {
            if (!allowInput(e)) {
                e.preventDefault();
                return false;
            }
            return true;
        });

        timer_ms.addEventListener('keyup', function (e) {
            let {mm,ss,ms} = Storage.loadTimer()
            const values = `${mm}${ss}${ms}`.split('')
            console.log(values)
            
            console.log("Ascii converted input: " + this.value)
            // + String.fromCharCode(event.keyCode)
            values.push(String.fromCharCode(event.keyCode))
            const final = values.splice(-6)
            
            console.log("El timer arr es: " + final)
            Storage.saveTimer(final)
            UI.clockSetUp()
        });             
    } 
}

window.onload = () => {
    UI.stdSetUp()
    Clocks[Storage.loadClock()]()
}

