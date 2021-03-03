const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colorBtns = document.getElementsByClassName("jsColor");
const colorRange = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const eraser = document.getElementById("jsErase");
const saveBtn = document.getElementById("jsSave");
const currnetBtn = document.getElementById("jsCur");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// for init ... 배경 없이 저장시 투명하게 저장되는 오류 수정
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function startTouch(event) {
    painting = true;
    const rect = event.target.getBoundingClientRect();
    const x = event.targetTouches[0].pageX - rect.left;
    const y = event.targetTouches[0].pageY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function onMouseMove(event) {
    // offset : 캔버스의 위치를 기준으로
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if (painting && !filling) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function onTouchMove(event) {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const x = event.targetTouches[0].pageX - rect.left;
    const y = event.targetTouches[0].pageY - rect.top;
    if (x < 0 || x > 700 || y < 0 || y > 700) {
        stopPainting();
    }
    if (painting && !filling) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function onMouseDown(event) {
    painting = true;
}

function changeColor(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    currnetBtn.style.backgroundColor = color;
    console.log(color);
    if (
        color === "rgb(19, 23, 70)" ||
        color === "rgb(126, 149, 190)" ||
        color === "rgb(44, 44, 44)"
    ) {
        currnetBtn.style.color = "white";
    } else {
        currnetBtn.style.color = "#2c2c2c";
    }
    if (filling) {
        handleCanvasClick();
    }
}

function handleDrag(event) {
    const lineSize = event.target.value;
    ctx.lineWidth = lineSize;
}

function handleModeClick() {
    if (filling === true) {
        filling = false;
        mode.innerText = "Fill";
    } else {
        filling = true;
        mode.innerText = "Paint";
    }
}

function handleCanvasClick() {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function handleEraser() {
    const current_color = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = current_color;
}

function handleCM(event) {
    event.preventDefault();
}

function handleSaveClick() {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "PaintJS[EXPORT]🎨";
    link.click();
}

if (canvas) {
    // 위에 있을 때
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove);
    // 마우스를 누를 때
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("touchstart", startTouch);
    // 마우스를 놓을 때
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("touchend", stopPainting);
    // 캔버스를 벗어날 때
    canvas.addEventListener("mouseleave", stopPainting);

    canvas.addEventListener("contextmenu", handleCM);
}

if (colorRange) {
    colorRange.addEventListener("input", handleDrag);
}

if (colorBtns) {
    // 배열 각각의 아이템에 대한 세련된 접근
    // Array.from() -> 파라미터 오브젝트가 원소가 되는 배열을 만듬
    // arr.forEach() -> forEach 내의 원소를 하나씩 갖는 ... 하나씩 탐색?
    // for (let i = 0; i < colorBtns.length; i++) { colorBtns[i].addEventListener("click", changeColor); }  => 기존 사용하던 방법
    Array.from(colorBtns).forEach((color) =>
        color.addEventListener("click", changeColor)
    );
}

if (mode) {
    mode.addEventListener("click", handleModeClick);
}

if (eraser) {
    eraser.addEventListener("click", handleEraser);
}

if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
}
