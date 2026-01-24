const questions=[
    {
        question: "Why is soil important?",
        options:[
            "It helps plants grow",
            "It is just dirt",
            "It makes roads",
            "It is useless"
        ],
        correct: 0
    },
    {
        question: "What can damage soil the most?",
        options: [
        "Planting trees",
        "Throwing plastic and waste",
        "Watering plants",
        "Farming carefully"
        ],
        correct: 1
    },
    {
        question: "Which activity helps protect land?",
        options: [
        "Littering",
        "Planting trees",
        "Recycling and composting",
        "Cutting forests"
        ],
        correct: 0
    },
    {
        question: "Which is a good way to keep land clean?",
        options: [
        "Throw trash anywhere",
        "Use dustbins",
        "Burn plastic",
        "Cut grass daily"
        ],
        correct: 1
    }
];

let currentIdx=0;
let score=0;
const questionEl=document.getElementById("question");
const optionsButtons=document.querySelectorAll(".option-btn");
const feedbackEl=document.getElementById("feedback");
const scoreEl=document.getElementById("score");
const nextBtn=document.getElementById("nextBtn");
const startBtn=document.getElementById("startQuizBtn");
const readyScreen=document.getElementById("readyScreen");
const quizScreen=document.getElementById("quizScreen");


function loadQuestion(){
    feedbackEl.textContent="";
    nextBtn.disabled=true;

    const currentQuestion=questions[currentIdx];
    questionEl.textContent=currentQuestion.question

    optionsButtons.forEach((button,idx)=>{
        button.textContent=currentQuestion.options[idx];
        button.disabled=false;
        button.style.backgroundColor="#e8f5e9";
    });
}
optionsButtons.forEach((btn,idx)=>{
    btn.addEventListener("click",()=>{
        const correctIdx=questions[currentIdx].correct;
        optionsButtons.forEach(b => b.disabled = true);
        if (idx === correctIdx) {
            score++;
            btn.style.background = "#a5d6a7";
            feedbackEl.textContent = "✅ Correct!";
            feedbackEl.style.color = "green";
        } else {
            btn.style.background = "#ef9a9a";
            feedbackEl.textContent = "❌ Not quite right";
            feedbackEl.style.color = "red";
        }
        scoreEl.textContent=score;
        nextBtn.disabled=false;

    })

});
nextBtn.addEventListener("click",()=>{
        currentIdx++;
        if (currentIdx<questions.length){
            loadQuestion();
        }
        else{
            questionEl.textContent="🎉 Quiz Completed!";
            document.querySelector(".options").style.display="none";
            nextBtn.style.display="none";
            feedbackEl.textContent=`Final score ${score}/${questions.length}`;
            feedbackEl.style.color="#2e7d32";
        }
    })

    startBtn.addEventListener("click",()=>{
        readyScreen.classList.add("hidden");
        quizScreen.classList.remove("hidden"); 
        loadQuestion();
    })