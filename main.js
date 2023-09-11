const questions = [
    "Who built the ark according to the Bible?",
    "How many plagues did God send on Egypt?",
    "What was the name of Abraham's wife?",
    "Which river did Jesus get baptized in?",
    "How many disciples did Jesus have?",
    "What is the first book of the Old Testament?",
    "Who betrayed Jesus?",
    "Which apostle was a tax collector before following Jesus?",
    "What is the shortest verse in the Bible?",
    "On which mountain did Moses receive the Ten Commandments?"
    // Add more questions here
];

const answers = [
    { options: ["Noah", "Moses", "Abraham", "David"], correctIndex: 0 },
    { options: ["Seven", "Five", "Ten", "Twelve"], correctIndex: 2 },
    { options: ["Leah", "Rebecca", "Rachel", "Sarah"], correctIndex: 3 },
    { options: ["Nile", "Jordan", "Euphrates", "Tigris"], correctIndex: 1 },
    { options: ["Ten", "Twelve", "Five", "Seven"], correctIndex: 1 },
    { options: ["Genesis", "Matthew", "Leviticus", "Numbers"], correctIndex: 0 },
    { options: ["Judas Iscariot", "Peter", "John", "James"], correctIndex: 0 },
    { options: ["John", "Luke", "Mark", "Matthew"], correctIndex: 3 },
    { options: ["Jesus wept.", "God is love.", "The Lord is my shepherd.", "Love your neighbor."], correctIndex: 0 },
    { options: ["Mount Zion", "Mount Nebo", "Mount Hermon", "Mount Sinai"], correctIndex: 3 }
    // Add more answer options here
];

// Shuffle function to randomize array elements
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Randomize the order of questions
const shuffledQuestions = shuffleArray([...questions]);

const questionElement = document.getElementById("question");
const answerOptionsElement = document.getElementById("answerOptions");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const resultElement = document.getElementById("result");
const timerElement = document.getElementById("timer");

let currentQuestionIndex = 0;
let userAnswers = [];
let isReviewMode = false;
let remainingTime = 60;
let timerInterval;

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timerElement.textContent = `Time: ${remainingTime} seconds`;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                displayQuestion();
                startTimer();
            } else {
                showResult();
                submitBtn.click();
            }
            // displayCorrectAnswers();
            updateButtonStates();
        }

        remainingTime--;
    }, 1000);
}

function displayQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    const answerOptions = answers[questions.indexOf(question)].options;

    questionElement.textContent = `Question ${currentQuestionIndex + 1}: ${question}`;
    answerOptionsElement.innerHTML = "";

    answerOptions.forEach((answer, index) => {
        const answerButton = document.createElement("button");
        answerButton.textContent = answer;
        answerButton.className = "btn answer-btn shadow m-2";
        answerButton.addEventListener("click", () => {
            if (!isReviewMode) {
                selectAnswer(index);
            }
        });
        if (userAnswers[currentQuestionIndex] === index && !isReviewMode) {
            answerButton.classList.add("selected");
        }
        if (isReviewMode) {
            const correctIndex = answers[questions.indexOf(question)].correctIndex;
            if (userAnswers[currentQuestionIndex] === index) {
                answerButton.classList.add("selected");
            }
            if (index === correctIndex) {
                answerButton.classList.add("correct");
            }
            if (
                userAnswers[currentQuestionIndex] !== correctIndex &&
                userAnswers[currentQuestionIndex] === index
            ) {
                answerButton.classList.add("incorrect");
            }
            
        }
        answerOptionsElement.appendChild(answerButton);
    });

    if (isReviewMode) {
        displayCorrectAnswers();
    }
}

function selectAnswer(index) {
    userAnswers[currentQuestionIndex] = index;
    displayQuestion();
}

prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
    updateButtonStates();
});

nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        showResult();
    }
    updateButtonStates();
});

submitBtn.addEventListener("click", () => {
    if (isReviewMode) {
        isReviewMode = false;
        submitBtn.textContent = "Submit";
        nextBtn.disabled = false;
    } else {
        isReviewMode = true;
        submitBtn.textContent = "Play Again";
        nextBtn.disabled = true;
    }
    displayQuestion();
    showResult();
    updateButtonStates();
    clearInterval(timerInterval);
    
});

function updateButtonStates() {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = isReviewMode || currentQuestionIndex === questions.length - 1;
}

function showResult() {
    let score = 0;

    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] === answers[questions.indexOf(shuffledQuestions[i])].correctIndex) {
            score++;
        }
    }

     // Display reward message based on score
     if (score === questions.length) {
        displayReward("perfect");
    } else if (score >= Math.floor(questions.length * 0.7)) {
        displayReward("good");
    } else if (score >= Math.floor(questions.length * 0.5)) {
        displayReward("average");
    } else if (score >= Math.floor(questions.length * 0.3)) {
        displayReward("poor");
    } else if (score >= Math.floor(questions.length * 0.0)) {
        displayReward("sorry");
        // showReward("sorry");
    }

    resultElement.textContent = `Your score: ${score} out of ${questions.length}`;
}

function displayReward(type) {
    const rewardContainer = document.getElementById("rewardContainer");
    const rewardMessage = document.getElementById("rewardMessage");

    if (type === "perfect") {
        rewardMessage.textContent = "Perfect Score! You're a Bible Quiz Master!";
    } else if (type === "good") {
        rewardMessage.textContent = "Great Job! You're doing fantastic!";
    } else if (type === "average") {
        rewardMessage.textContent = "Average! You're doing good!";
    } else if (type === "poor") {
        rewardMessage.textContent = "Poor! You need to try again!";
    } else if (type === "sorry") {
        rewardMessage.textContent = "Sorry! Bad result!";
    }

    rewardContainer.classList.add("show");

    // Hide the reward container after a few seconds
    setTimeout(() => {
        rewardContainer.classList.remove("show");
    }, 6000); // Adjust the duration as needed
}

function displayCorrectAnswers() {
    const answerButtons = document.querySelectorAll(".answer-btn");
    answerButtons.forEach((button, index) => {
        const correctIndex = answers[questions.indexOf(shuffledQuestions[currentQuestionIndex])].correctIndex;
        const userAnswerIndex = userAnswers[currentQuestionIndex];
        button.classList.remove("correct", "incorrect");
        if (index === correctIndex) {
            button.classList.add("correct");
        } else if (index === userAnswerIndex) {
            button.classList.add("incorrect");
        }
        button.disabled = true;
    });
}

displayQuestion();
updateButtonStates();
startTimer();

function getFacebookShareURL(score) {
    const url = encodeURIComponent(window.location.href);
    return `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=I scored ${score} on the Bible quiz!`;
}

function getTwitterShareURL(score) {
    const url = encodeURIComponent(window.location.href);
    return `https://twitter.com/intent/tweet?text=I scored ${score} on the Bible quiz! Check it out: ${url}`;
}

function getWhatsAppStatusShareURL(score) {
    const text = `I scored ${score} out of ${questions.length} on the Bible Quiz! Try it out!`;
    const encodedText = encodeURIComponent(text);
    return `whatsapp://send?text=${encodedText}`;
}

const facebookShareBtn = document.getElementById("facebookShareBtn");
const twitterShareBtn = document.getElementById("twitterShareBtn");
const whatsShareBtn = document.getElementById("whatsShareBtn");

facebookShareBtn.addEventListener("click", () => {
    const score = getScore();
    const facebookShareURL = getFacebookShareURL(score);
    window.open(facebookShareURL, "_blank");
});

twitterShareBtn.addEventListener("click", () => {
    const score = getScore();
    const twitterShareURL = getTwitterShareURL(score);
    window.open(twitterShareURL, "_blank");
});

whatsShareBtn.addEventListener("click", () => {
    const score = getScore();
    const whatsappStatusShareURL = getWhatsAppStatusShareURL(score);
    window.open(whatsappStatusShareURL);
});

function getScore() {
    let score = 0;

    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] === answers[i].correctIndex) {
            score++;
        }
    }

    return score;
}

// Display the reward container with the user's score and an input field for the username
function showReward(score) {
    const rewardContainer = document.getElementById('rewardContainer');
    const finalScoreElement = document.getElementById('finalScore');
    const submitScoreBtn = document.getElementById('submitScoreBtn');
    
    finalScoreElement.textContent = score;
    rewardContainer.classList.add('show');
  
    submitScoreBtn.addEventListener('click', () => {
      const usernameInput = document.getElementById('usernameInput');
      const username = usernameInput.value;
  
      if (username.trim() !== '') {
        // Submit the score with the username to the leaderboard
        submitScore(username, score);
        rewardContainer.classList.remove('show');
      } else {
        // Display a message to enter a valid username
        alert('Please enter a valid username.');
      }
    });
  }
  
  // Function to submit the score and username to the leaderboard
  function submitScore(username, score) {
    console.log('Submitting score:', username, score);
    const leaderboardRef = firebase.database().ref('leaderboard');
    const newScoreRef = leaderboardRef.push();
    newScoreRef.set({
      username: username,
      score: score
    }).then(() => {
        console.log('Score submitted successfully!');
        alert('Score submitted successfully!');
    }).catch((error) => {
        console.error('Error submitting score:', error);
        alert('Error submitting score!');
    });
  }
  