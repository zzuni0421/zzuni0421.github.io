const positiveMap = {
    "시발": "행복한 하루", "ㅅㅂ": "lovely day", "개새끼": "귀여운 친구",
    "병신": "천재 지망생", "꺼져": "잠시 쉬어줘", "미친놈": "열정적인 사람",
    "개같다": "특이한 매력", "좆같다": "에너지 넘치는 상황", "씨발": "오늘도 화이팅",
    "빡치다": "긴장감 넘침", "좆": "아주 특별함", "ㅄ": "참 신기한 친구",
    "썅": "엄청 놀람", "후빨": "열심히 응원", "개소리": "웃긴 이야기",
    "병맛": "기상천외한 상황", "개뿔": "생각지도 못한 반전", "씹덕": "열정 덩어리",
    "개멍청": "순수함", "좆망": "아쉬운 상황", "좆같네": "기발한 상황",
    "ㅈ같다": "엉뚱한 상황", "썅년": "핵인싸 기운", "개불": "자유로운 선택",
    "씨발놈": "용기 있는 행동", "미친": "놀라운 상황", "ㅆ발": "활기찬 하루",
    "개자식": "독특한 친구", "ㅂㅅ": "천재적인 발상", "좆밥": "작지만 강함",
    "좆문": "유쾌한 혼란", "썅놈": "에너지 폭발", "씨빨": "당황스러운 순간",
    "개같은": "유머러스한 상황", "병신새끼": "귀여운 괴짜", "미친놈아": "재밌는 친구",
    "좆같이": "특이하게 멋진", "ㅄ같은": "엉뚱한 매력", "썅할": "흥미로운 일",
    "개호구": "순진한 귀여움", "ㅆ발놈": "웃긴 친구", "좆됐다": "반전 상황",
    "개판": "흥미진진한 상황", "좆밥새끼": "작지만 의미 있는", "씨발새끼": "핵인싸 친구",
    "개쓰레기": "독특한 개성", "미친새끼": "유쾌한 괴짜", "썅새끼": "에너지 넘치는 친구",
    "ㅂㅅ새끼": "순수한 친구", "좆같은새끼": "엉뚱한 매력", "개변태": "특이한 매력"
};

const memeMap = {
    "시발": "ㅋㅋㅋㅋ 와 이건 못참지", "ㅅㅂ": "개웃기네 진짜", "개새끼": "아니 ㅋㅋ 그 친구요",
    "병신": "아 몰라 인생 즐겨~", "꺼져": "Alt+F4 ㄱㄱ", "미친놈": "헐 미쳤다ㅋㅋ",
    "개같다": "ㅋㅋ 개웃김", "좆같다": "와 이건 ㅋㅋ", "씨발": "와 ㅋㅋㅋㅋ", "빡치다": "ㅋㅋㅋㅋ 존나 빡침",
    "좆": "ㅋㅋ 존나 특이함", "ㅄ": "ㅋㅋ 뭐야 이거", "썅": "와 ㅋㅋ 폭발", "후빨": "ㅋㅋ 열심히 빨자",
    "개소리": "ㅋㅋ 존나 개소리", "병맛": "ㅋㅋㅋㅋ 병맛 폭발", "개뿔": "ㅋㅋ 이건 또 뭐야",
    "씹덕": "ㅋㅋ 덕후 폭발", "개멍청": "ㅋㅋ 순수 폭발", "좆망": "ㅋㅋ 완전 망했네",
    "좆같네": "ㅋㅋ 기발한데", "ㅈ같다": "ㅋㅋ 엉뚱함", "썅년": "ㅋㅋ 폭발 에너지",
    "개불": "ㅋㅋ 자유 폭발", "씨발놈": "ㅋㅋ 핵인싸 폭발", "미친": "ㅋㅋ 놀라워", "ㅆ발": "ㅋㅋ 활기 폭발",
    "개자식": "ㅋㅋ 독특함", "ㅂㅅ": "ㅋㅋ 천재 폭발", "좆밥": "ㅋㅋ 작지만 강함", "좆문": "ㅋㅋ 유쾌 폭발",
    "썅놈": "ㅋㅋ 에너지 폭발", "씨빨": "ㅋㅋ 당황 폭발", "개같은": "ㅋㅋ 유머 폭발",
    "병신새끼": "ㅋㅋ 귀여운 괴짜", "미친놈아": "ㅋㅋ 재밌는 친구", "좆같이": "ㅋㅋ 멋짐",
    "ㅄ같은": "ㅋㅋ 엉뚱 폭발", "썅할": "ㅋㅋ 흥미진진", "개호구": "ㅋㅋ 순진 귀여움",
    "ㅆ발놈": "ㅋㅋ 웃긴 친구", "좆됐다": "ㅋㅋ 반전", "개판": "ㅋㅋ 흥미진진",
    "좆밥새끼": "ㅋㅋ 의미 있음", "씨발새끼": "ㅋㅋ 핵인싸 친구", "개쓰레기": "ㅋㅋ 독특 개성",
    "미친새끼": "ㅋㅋ 유쾌 괴짜", "썅새끼": "ㅋㅋ 에너지 친구", "ㅂㅅ새끼": "ㅋㅋ 순수 친구",
    "좆같은새끼": "ㅋㅋ 엉뚱 매력", "개변태": "ㅋㅋ 특이 매력"
};

const inputText = document.getElementById("inputText");
const positiveBtn = document.getElementById("positiveBtn");
const memeBtn = document.getElementById("memeBtn");
const output = document.getElementById("output");
const historyList = document.getElementById("history");

// 로컬스토리지에서 히스토리 가져오기
let history = JSON.parse(localStorage.getItem("translationHistory")) || [];

function saveHistory(text) {
    history.unshift(text);
    if(history.length > 10) history.pop();
    localStorage.setItem("translationHistory", JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

// 번역 함수
function translate(type) {
    let text = inputText.value;
    if(!text) return alert("입력값이 비어있어요 🤔");
    
    const map = type === "positive" ? positiveMap : memeMap;
    let translated = text.split(" ").map(word => map[word] || word).join(" ");
    
    output.textContent = translated;
    saveHistory(translated);
}

positiveBtn.addEventListener("click", () => translate("positive"));
memeBtn.addEventListener("click", () => translate("meme"));

// 페이지 로드 시 히스토리 렌더
renderHistory();
