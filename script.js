const dictionary = {
    "씨발": "에휴",
    "좆": "하찮은 것",
    "병신": "어리석은 친구",
    "개새끼": "버르장머리 없는 사람",
    "닥쳐": "조용히 해줘",
    "죽여": "혼내줄거야",
    "염병": "허튼소리",
    "꺼져": "가줘",
    "지랄": "오버하지 마",
    "빡대가리": "머리가 굳은 친구",
    "호로새끼": "버릇없는 사람",
    "개같네": "정말 별로네",
    "등신": "바보",
    "썅": "아이구",
    "좆같네": "별로네",
    "개망": "망했네",
    "똥멍청이": "머리 나쁜 친구",
    "개뿔": "아무것도 아냐",
    "좆도": "하나도",
    "개노답": "답이 없는 상황",
    "씹": "아이고",
    "개판": "엉망진창",
    "씨이발": "아이고 세상에",
    "대가리": "머리",
    "씹덕": "덕후",
    "병맛": "엉뚱한 맛",
    "씹창": "망가짐",
    "존나": "엄청",
    "좆망": "크게 망함",
    "개지랄": "심한 오버",
    "죽빵": "한 대 퍽",
    "쌍놈": "버릇없는 자",
    "쌍년": "예의 없는 여자",
    "개후레": "무례한 자",
    "씹새끼": "못된 사람",
    "개쓰레기": "별로인 사람",
    "좆밥": "약한 자",
    "니미럴": "아이고",
    "씨바": "참나",
    "개씨발": "아이구야",
    "등골브레이커": "부담스러운 존재",
    "개호로": "버릇없는 친구",
    "대갈빡": "머리통",
    "씹탱": "어리석은 자",
    "개돼지": "몰지각한 사람",
    "존맛탱": "진짜 맛있다",
    "좆같이": "별로게",
    "씹창난": "완전히 망한",
    "병신같이": "엉뚱하게"
};

// 기록 저장
let history = JSON.parse(localStorage.getItem("translationHistory")) || [];

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const translateBtn = document.getElementById("translateBtn");
const historyList = document.getElementById("history");
const clearBtn = document.getElementById("clearBtn");

// 번역 함수
function translate(text) {
    let result = text;
    for (let badWord in dictionary) {
        const regex = new RegExp(badWord, "g");
        result = result.replace(regex, dictionary[badWord]);
    }
    return result;
}

// 기록 렌더링
function renderHistory() {
    historyList.innerHTML = "";
    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.input} → ${item.output}`;
        historyList.appendChild(li);
    });
}

// 번역 버튼 이벤트
translateBtn.addEventListener("click", () => {
    const text = inputText.value.trim();
    if (!text) return;

    const translated = translate(text);
    outputText.textContent = translated;

    history.unshift({ input: text, output: translated });
    if (history.length > 50) history.pop();

    localStorage.setItem("translationHistory", JSON.stringify(history));
    renderHistory();
});

// 기록 삭제 버튼
clearBtn.addEventListener("click", () => {
    if(confirm("정말로 모든 번역 기록을 삭제하시겠습니까? 🤔")) {
        localStorage.removeItem("translationHistory");
        history = [];
        renderHistory();
        alert("모든 기록이 삭제되었습니다!");
    }
});

// 초기 렌더링
renderHistory();
