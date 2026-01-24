const soilArea=document.getElementById('soilArea');
const scoreEl=document.getElementById('score');
const timeEl=document.getElementById('time');
const startBtn=document.getElementById('startBtn');
const message=document.getElementById('message');

let score=0;
let timeLeft=30;
let gameInterval;
let spawnInterval;

const trashItems=["🗑️", "🥤", "🍾", "🧴"];

function spwanTrash(){
    const trash=document.createElement('div');
    trash.classList.add('trash');
    trash.textContent=trashItems[Math.floor(Math.random()*trashItems.length)];
    trash.style.left=Math.random()*90+'%';
    trash.style.top=Math.random()*80+'%';  

    trash.addEventListener('click',()=>{
        score++;
        scoreEl.textContent=score;
        trash.remove();
    });
    soilArea.appendChild(trash);
    // Remove trash after 2 seconds
    setTimeout(()=>{
        trash.remove();
    },2000);
}
function startGame(){
    score=0;
    timeLeft=30;
    scoreEl.textContent=score;
    timeEl.textContent=timeLeft;
    message.textContent='';
    soilArea.innerHTML='';
    // disable start button
    startBtn.disabled=true;

    // Spawn trash every 700ms
    spawnInterval=setInterval(spwanTrash,700);

    // Countdown timer
    getIntervals=setInterval(()=>{
        timeLeft--;
        timeEl.textContent=timeLeft;

        if(timeLeft<=0){
            endGame();
        }
    },1000);

}
function endGame(){
    clearInterval(spawnInterval);
    clearInterval(getIntervals);
    startBtn.disabled=false;
    soilArea.innerHTML='';

    message.textContent=`🎉 Great job! You cleaned ${score} waste items!`;
    message.style.color='#2e7d32';


}

startBtn.addEventListener('click',startGame);