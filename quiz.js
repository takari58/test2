// ===== クイズデータ =====
const quizData = {
    "新発田城跡": [
        { q: "新発田城は江戸時代に作られた？", a: true },
        { q: "天守閣は5階建てである？", a: false },
        { q: "別名「あやめ城」と呼ばれる？", a: true }
    ],
    "清水園": [
        { q: "清水園は日本庭園である？", a: true },
        { q: "無料で入れる？", a: false },
        { q: "池がある？", a: true }
    ],
    "新潟職能短大":[
        { q: "開発者は電子情報技術科の学生である", a: true },
        { q: "JavaScriptは言語である", a: true },
        { q: "池がある？", a: false }
    ],
    "ファミマ":[
        { q: "開発者は電子情報技術科の学生である", a: true },
        { q: "JavaScriptは言語である", a: true },
        { q: "池がある？", a: false }
    ]
};

// ===== URL取得 =====
const params = new URLSearchParams(window.location.search);
const spotName = params.get("spot");

document.getElementById("title").textContent = spotName + " クイズ";

const quizzes = quizData[spotName];

let index = 0;
let score = 0;
const POINT = 20;

// ===== 問題表示 =====
function showQuiz() {
    document.getElementById("result").textContent = "";
    document.getElementById("quizBox").textContent = quizzes[index].q;
}

showQuiz();

// ===== 回答 =====
function answer(userAnswer) {
    const correct = quizzes[index].a;

    if (userAnswer === correct) {
        document.getElementById("result").textContent = "正解！";
        score++;
    } else {
        document.getElementById("result").textContent = "不正解…";
    }

    index++;

    if (index < quizzes.length) {
        setTimeout(showQuiz, 1000);
    } else {
        showScore();
    }
}

// ===== スコア表示 =====
function showScore() {
    //クイズ画面を消す
    document.querySelector(".quiz-container").style.display = "none";

    //スコア表示画面
    document.getElementById("scoreScreen").classList.remove("hidden");
    
    const totalScore = score * POINT; // ★ 点数計算

    document.getElementById("scoreText").textContent =
        `${quizzes.length}問中 ${score}問正解（${totalScore}点）`;

}
