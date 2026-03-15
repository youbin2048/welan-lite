const brightnessSlider = document.getElementById("brightnessSlider");
const brightnessValue = document.getElementById("brightnessValue");
const quickBtns = document.querySelectorAll(".quick-btn");
const mainSwitch = document.getElementById("mainSwitch");
const mindfulnessToggleBtn = document.getElementById("mindfulnessToggleBtn");
const mindfulnessStatus = document.getElementById("mindfulnessStatus");

// 场景开关
const scene1Switch = document.getElementById("scene1Switch");
const scene2Switch = document.getElementById("scene2Switch");
const scene3Switch = document.getElementById("scene3Switch");

// 场景亮度显示
const scene1BrightnessValue = document.getElementById("scene1BrightnessValue");
const scene2BrightnessValue = document.getElementById("scene2BrightnessValue");
const scene3BrightnessValue = document.getElementById("scene3BrightnessValue");

// 场景亮度按钮
const scene1BrightnessBtn = document.getElementById("scene1BrightnessBtn");
const scene2BrightnessBtn = document.getElementById("scene2BrightnessBtn");
const scene3BrightnessBtn = document.getElementById("scene3BrightnessBtn");

// 时间按钮
const scene1StartBtn = document.getElementById("scene1StartBtn");
const scene1EndBtn = document.getElementById("scene1EndBtn");
const scene2StartBtn = document.getElementById("scene2StartBtn");
const scene2EndBtn = document.getElementById("scene2EndBtn");
const scene3StartBtn = document.getElementById("scene3StartBtn");
const scene3EndBtn = document.getElementById("scene3EndBtn");

// 时间文字
const scene1StartText = document.getElementById("scene1StartText");
const scene1EndText = document.getElementById("scene1EndText");
const scene2StartText = document.getElementById("scene2StartText");
const scene2EndText = document.getElementById("scene2EndText");
const scene3StartText = document.getElementById("scene3StartText");
const scene3EndText = document.getElementById("scene3EndText");

//时间滚轮
const timeModal = document.getElementById("timeModal");
const timeModalTitle = document.getElementById("timeModalTitle");
const timeModalClose = document.getElementById("timeModalClose");
const timeModalCancel = document.getElementById("timeModalCancel");
const timeModalConfirm = document.getElementById("timeModalConfirm");
const timeInput = document.getElementById("timeInput");

// 系统任务
const restartBtn = document.getElementById("restartBtn");
const factoryResetBtn = document.getElementById("factoryResetBtn");
const otaFileInput = document.getElementById("otaFileInput");
const otaUploadBtn = document.getElementById("otaUploadBtn");
const otaProgressBar = document.getElementById("otaProgressBar");
const otaStatusText = document.getElementById("otaStatusText");

let isOn = true;
let pendingTimeEdit = null;
let mindfulnessOn = false;

const API = {
  // 主控制
  mainSwitchOn: "/switch/MANUAL%201%20%E6%89%8B%E5%8A%A8%E6%80%BB%E5%BC%80%E5%85%B3/turn_on",
  mainSwitchOff: "/switch/MANUAL%201%20%E6%89%8B%E5%8A%A8%E6%80%BB%E5%BC%80%E5%85%B3/turn_off",
  mainSwitchGet: "/switch/MANUAL%201%20%E6%89%8B%E5%8A%A8%E6%80%BB%E5%BC%80%E5%85%B3",
  mindfulnessGet: "/switch/ZEN%20%E6%AD%A3%E5%BF%B5%E6%A8%A1%E5%BC%8F",
  mindfulnessOn: "/switch/ZEN%20%E6%AD%A3%E5%BF%B5%E6%A8%A1%E5%BC%8F/turn_on",
  mindfulnessOff: "/switch/ZEN%20%E6%AD%A3%E5%BF%B5%E6%A8%A1%E5%BC%8F/turn_off",

  mainBrightnessGet: "/number/BRT%20%E5%BD%93%E5%89%8D%E4%BA%AE%E5%BA%A6",
  mainBrightnessSet: (value) =>
    `/number/BRT%20%E5%BD%93%E5%89%8D%E4%BA%AE%E5%BA%A6/set?value=${encodeURIComponent(value)}`,

  // 场景一
  scene1EnableGet: "/switch/T1%20%E6%97%B6%E6%AE%B51%E5%90%AF%E7%94%A8",
  scene1EnableOn: "/switch/T1%20%E6%97%B6%E6%AE%B51%E5%90%AF%E7%94%A8/turn_on",
  scene1EnableOff: "/switch/T1%20%E6%97%B6%E6%AE%B51%E5%90%AF%E7%94%A8/turn_off",
  scene1BrightnessGet: "/number/T1%20BRT",
  scene1BrightnessSet: (value) =>
    `/number/T1%20BRT/set?value=${encodeURIComponent(value)}`,
  scene1StartHGet: "/number/T1%20ON%20H",
  scene1StartMGet: "/number/T1%20ON%20M",
  scene1EndHGet: "/number/T1%20OFF%20H",
  scene1EndMGet: "/number/T1%20OFF%20M",
  scene1StartHSet: (value) =>
    `/number/T1%20ON%20H/set?value=${encodeURIComponent(value)}`,
  scene1StartMSet: (value) =>
    `/number/T1%20ON%20M/set?value=${encodeURIComponent(value)}`,
  scene1EndHSet: (value) =>
    `/number/T1%20OFF%20H/set?value=${encodeURIComponent(value)}`,
  scene1EndMSet: (value) =>
    `/number/T1%20OFF%20M/set?value=${encodeURIComponent(value)}`,

  // 场景二
  scene2EnableGet: "/switch/T2%20%E6%97%B6%E6%AE%B52%E5%90%AF%E7%94%A8",
  scene2EnableOn: "/switch/T2%20%E6%97%B6%E6%AE%B52%E5%90%AF%E7%94%A8/turn_on",
  scene2EnableOff: "/switch/T2%20%E6%97%B6%E6%AE%B52%E5%90%AF%E7%94%A8/turn_off",
  scene2BrightnessGet: "/number/T2%20BRT",
  scene2BrightnessSet: (value) =>
    `/number/T2%20BRT/set?value=${encodeURIComponent(value)}`,
  scene2StartHGet: "/number/T2%20ON%20H",
  scene2StartMGet: "/number/T2%20ON%20M",
  scene2EndHGet: "/number/T2%20OFF%20H",
  scene2EndMGet: "/number/T2%20OFF%20M",
  scene2StartHSet: (value) =>
    `/number/T2%20ON%20H/set?value=${encodeURIComponent(value)}`,
  scene2StartMSet: (value) =>
    `/number/T2%20ON%20M/set?value=${encodeURIComponent(value)}`,
  scene2EndHSet: (value) =>
    `/number/T2%20OFF%20H/set?value=${encodeURIComponent(value)}`,
  scene2EndMSet: (value) =>
    `/number/T2%20OFF%20M/set?value=${encodeURIComponent(value)}`,

  // 场景三
  scene3EnableGet: "/switch/T3%20%E6%97%B6%E6%AE%B53%E5%90%AF%E7%94%A8",
  scene3EnableOn: "/switch/T3%20%E6%97%B6%E6%AE%B53%E5%90%AF%E7%94%A8/turn_on",
  scene3EnableOff: "/switch/T3%20%E6%97%B6%E6%AE%B53%E5%90%AF%E7%94%A8/turn_off",
  scene3BrightnessGet: "/number/T3%20BRT",
  scene3BrightnessSet: (value) =>
    `/number/T3%20BRT/set?value=${encodeURIComponent(value)}`,
  scene3StartHGet: "/number/T3%20ON%20H",
  scene3StartMGet: "/number/T3%20ON%20M",
  scene3EndHGet: "/number/T3%20OFF%20H",
  scene3EndMGet: "/number/T3%20OFF%20M",
  scene3StartHSet: (value) =>
    `/number/T3%20ON%20H/set?value=${encodeURIComponent(value)}`,
  scene3StartMSet: (value) =>
    `/number/T3%20ON%20M/set?value=${encodeURIComponent(value)}`,
  scene3EndHSet: (value) =>
    `/number/T3%20OFF%20H/set?value=${encodeURIComponent(value)}`,
  scene3EndMSet: (value) =>
    `/number/T3%20OFF%20M/set?value=${encodeURIComponent(value)}`,
  
  //系统任务
  restart: "/button/SYS%20%E9%87%8D%E5%90%AF%E8%AE%BE%E5%A4%87/press",
  factoryReset: "/button/SYS%20%E6%81%A2%E5%A4%8D%E5%87%BA%E5%8E%82%E8%AE%BE%E7%BD%AE/press",
  
  events: "/events",
  otaUpdate: "/update",
};

let otaUploading = false;

async function post(url) {
  const res = await fetch(url, {
    method: "POST",
    body: "",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text}`);
  }

  return res;
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  return res.json();
}

function setOtaStatus(message) {
  if (otaStatusText) otaStatusText.textContent = message;
}

function setOtaProgress(percent) {
  if (!otaProgressBar) return;
  const value = Math.max(0, Math.min(100, Number(percent) || 0));
  otaProgressBar.style.width = `${value}%`;
}

function setOtaUploadingState(uploading) {
  otaUploading = uploading;
  if (otaUploadBtn) otaUploadBtn.disabled = uploading;
  if (otaFileInput) otaFileInput.disabled = uploading;
}

async function uploadOtaFile(file) {
  if (!file) {
    setOtaStatus("请先选择固件文件");
    return;
  }

  if (!/\.bin$/i.test(file.name)) {
    setOtaStatus("请选择 .bin 固件文件");
    return;
  }

  setOtaUploadingState(true);
  setOtaProgress(0);
  setOtaStatus("开始上传固件...");

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", API.otaUpdate);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = (event.loaded / event.total) * 100;
      setOtaProgress(percent);
      setOtaStatus(`正在上传固件... ${Math.round(percent)}%`);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setOtaProgress(100);
        setOtaStatus("固件上传完成，设备即将自动重启");
        resolve();
        return;
      }
      reject(new Error(`HTTP ${xhr.status} ${xhr.responseText || ""}`));
    };

    xhr.onerror = () => {
      reject(new Error("网络错误，固件上传失败"));
    };

    const formData = new FormData();
    formData.append("update", file, file.name);
    xhr.send(formData);
  });

  setTimeout(() => {
    setOtaStatus("设备重启中，请稍后重新打开页面");
  }, 1500);
}

function parseBool(data) {
  if (!data) return false;
  if (typeof data.value === "boolean") return data.value;
  if (typeof data.state === "string") return data.state.toUpperCase() === "ON";
  return false;
}

function parseNumber(data, fallback = 0) {
  if (!data) return fallback;
  if (typeof data.value !== "undefined") return Number(data.value) || fallback;
  if (typeof data.state !== "undefined") return Number(data.state) || fallback;
  return fallback;
}

function formatTime(h, m) {
  const hh = String(Number(h) || 0).padStart(2, "0");
  const mm = String(Number(m) || 0).padStart(2, "0");
  return `${hh}:${mm}`;
}

function parseTimeInput(value) {
  const match = /^(\d{1,2}):(\d{1,2})$/.exec((value || "").trim());
  if (!match) return null;

  const h = Number(match[1]);
  const m = Number(match[2]);

  if (h < 0 || h > 23 || m < 0 || m > 59) return null;

  return { h, m };
}

function openTimeModal(title, defaultValue, onConfirm) {
  pendingTimeEdit = onConfirm;

  if (timeModalTitle) timeModalTitle.textContent = title;
  if (timeInput) timeInput.value = defaultValue || "00:00";

  if (timeModal) {
    timeModal.classList.remove("hidden");
    timeModal.setAttribute("aria-hidden", "false");
  }
}

function closeTimeModal() {
  pendingTimeEdit = null;

  if (timeModal) {
    timeModal.classList.add("hidden");
    timeModal.setAttribute("aria-hidden", "true");
  }
}

async function confirmTimeModal() {
  if (!pendingTimeEdit || !timeInput) {
    closeTimeModal();
    return;
  }

  const value = timeInput.value;
  const parsed = parseTimeInput(value);

  if (!parsed) {
    alert("时间格式不正确");
    return;
  }

  try {
    await pendingTimeEdit(parsed.h, parsed.m);
    closeTimeModal();
  } catch (err) {
    console.error("设置时间失败:", err);
  }
}

function renderSwitchState(on) {
  isOn = !!on;
  if (!mainSwitch) return;
  mainSwitch.classList.toggle("on", isOn);
  mainSwitch.classList.toggle("off", !isOn);
  const span = mainSwitch.querySelector("span");
  if (span) span.textContent = isOn ? "开" : "关";
}

function renderMindfulnessState(on) {
  mindfulnessOn = !!on;

  if (mindfulnessStatus) {
    mindfulnessStatus.textContent = mindfulnessOn ? "进行中" : "未开启";
  }

  if (mindfulnessToggleBtn) {
    mindfulnessToggleBtn.classList.toggle("active", mindfulnessOn);
    mindfulnessToggleBtn.textContent = mindfulnessOn ? "退出正念" : "进入正念";
  }
}

function renderBrightness(value) {
  const num = Math.max(0, Math.min(100, Number(value) || 0));

  if (brightnessValue) brightnessValue.textContent = num;
  if (brightnessSlider) brightnessSlider.value = num;

  quickBtns.forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.level) === num);
  });

  renderSwitchState(num > 0);
}

function renderMiniSwitch(el, on) {
  if (!el) return;
  el.classList.toggle("on", !!on);
  el.classList.toggle("off", !on);
  const span = el.querySelector("span");
  if (span) span.textContent = on ? "开" : "关";
}

function renderSceneBrightness(el, value) {
  if (!el) return;
  const num = Math.max(1, Math.min(100, Number(value) || 0));
  el.textContent = `${num}%`;
}

function setTimeText(el, h, m) {
  if (!el) return;
  el.textContent = formatTime(h, m);
}

// 本地缓存时间，便于事件流还没覆盖时也能显示
const sceneTimeState = {
  1: { startH: 6, startM: 0, endH: 8, endM: 0 },
  2: { startH: 18, startM: 0, endH: 22, endM: 0 },
  3: { startH: 12, startM: 0, endH: 14, endM: 0 },
};

function renderSceneTime(sceneNo) {
  const t = sceneTimeState[sceneNo];
  if (!t) return;

  if (sceneNo === 1) {
    setTimeText(scene1StartText, t.startH, t.startM);
    setTimeText(scene1EndText, t.endH, t.endM);
  }
  if (sceneNo === 2) {
    setTimeText(scene2StartText, t.startH, t.startM);
    setTimeText(scene2EndText, t.endH, t.endM);
  }
  if (sceneNo === 3) {
    setTimeText(scene3StartText, t.startH, t.startM);
    setTimeText(scene3EndText, t.endH, t.endM);
  }
}

async function refreshMainBrightnessFromDevice() {
  try {
    const brightnessState = await getJson(API.mainBrightnessGet);
    handleEventData(brightnessState);
  } catch (err) {
    console.warn("刷新主亮度失败:", err);
  }
}

async function setMainBrightnessRemote(value) {
  await post(API.mainBrightnessSet(value));
  renderBrightness(value);
}

async function turnLightRemote(on) {
  await post(on ? API.mainSwitchOn : API.mainSwitchOff);

  if (on) {
    renderSwitchState(true);
    setTimeout(() => {
      refreshMainBrightnessFromDevice();
    }, 250);
  } else {
    renderBrightness(0);
  }
}

async function setMindfulnessRemote(on) {
  await post(on ? API.mindfulnessOn : API.mindfulnessOff);
  renderMindfulnessState(on);
}

async function setSceneEnable(sceneNo, on) {
  const map = {
    1: on ? API.scene1EnableOn : API.scene1EnableOff,
    2: on ? API.scene2EnableOn : API.scene2EnableOff,
    3: on ? API.scene3EnableOn : API.scene3EnableOff,
  };

  await post(map[sceneNo]);

  if (sceneNo === 1) renderMiniSwitch(scene1Switch, on);
  if (sceneNo === 2) renderMiniSwitch(scene2Switch, on);
  if (sceneNo === 3) renderMiniSwitch(scene3Switch, on);
}

async function setSceneBrightness(sceneNo, value) {
  const map = {
    1: API.scene1BrightnessSet(value),
    2: API.scene2BrightnessSet(value),
    3: API.scene3BrightnessSet(value),
  };

  await post(map[sceneNo]);

  if (sceneNo === 1) renderSceneBrightness(scene1BrightnessValue, value);
  if (sceneNo === 2) renderSceneBrightness(scene2BrightnessValue, value);
  if (sceneNo === 3) renderSceneBrightness(scene3BrightnessValue, value);
}

async function setSceneTime(sceneNo, type, h, m) {
  const map = {
    1: {
      startH: API.scene1StartHSet(h),
      startM: API.scene1StartMSet(m),
      endH: API.scene1EndHSet(h),
      endM: API.scene1EndMSet(m),
    },
    2: {
      startH: API.scene2StartHSet(h),
      startM: API.scene2StartMSet(m),
      endH: API.scene2EndHSet(h),
      endM: API.scene2EndMSet(m),
    },
    3: {
      startH: API.scene3StartHSet(h),
      startM: API.scene3StartMSet(m),
      endH: API.scene3EndHSet(h),
      endM: API.scene3EndMSet(m),
    },
  };

  const keyH = type === "start" ? "startH" : "endH";
  const keyM = type === "start" ? "startM" : "endM";

  await post(map[sceneNo][keyH]);
  await post(map[sceneNo][keyM]);

  if (type === "start") {
    sceneTimeState[sceneNo].startH = h;
    sceneTimeState[sceneNo].startM = m;
  } else {
    sceneTimeState[sceneNo].endH = h;
    sceneTimeState[sceneNo].endM = m;
  }

  renderSceneTime(sceneNo);
}

function handleEventData(data) {
  if (!data || !data.name_id) return;

  // 主开关
  if (data.name_id === "switch/MANUAL 1 手动总开关") {
    renderSwitchState(parseBool(data));
    return;
  }

  if (data.name_id === "switch/ZEN 正念模式") {
    renderMindfulnessState(parseBool(data));
    return;
  }

  // 主亮度
  if (data.name_id === "number/BRT 当前亮度") {
    renderBrightness(parseNumber(data, 0));
    return;
  }

  // 场景启用
  if (data.name_id === "switch/T1 时段1启用") {
    renderMiniSwitch(scene1Switch, parseBool(data));
    return;
  }
  if (data.name_id === "switch/T2 时段2启用") {
    renderMiniSwitch(scene2Switch, parseBool(data));
    return;
  }
  if (data.name_id === "switch/T3 时段3启用") {
    renderMiniSwitch(scene3Switch, parseBool(data));
    return;
  }

  // 场景亮度
  if (data.name_id === "number/T1 BRT") {
    renderSceneBrightness(scene1BrightnessValue, parseNumber(data, 30));
    return;
  }
  if (data.name_id === "number/T2 BRT") {
    renderSceneBrightness(scene2BrightnessValue, parseNumber(data, 30));
    return;
  }
  if (data.name_id === "number/T3 BRT") {
    renderSceneBrightness(scene3BrightnessValue, parseNumber(data, 50));
    return;
  }

  // 时间：场景一
  if (data.name_id === "number/T1 ON H") {
    sceneTimeState[1].startH = parseNumber(data, sceneTimeState[1].startH);
    renderSceneTime(1);
    return;
  }
  if (data.name_id === "number/T1 ON M") {
    sceneTimeState[1].startM = parseNumber(data, sceneTimeState[1].startM);
    renderSceneTime(1);
    return;
  }
  if (data.name_id === "number/T1 OFF H") {
    sceneTimeState[1].endH = parseNumber(data, sceneTimeState[1].endH);
    renderSceneTime(1);
    return;
  }
  if (data.name_id === "number/T1 OFF M") {
    sceneTimeState[1].endM = parseNumber(data, sceneTimeState[1].endM);
    renderSceneTime(1);
    return;
  }

  // 时间：场景二
  if (data.name_id === "number/T2 ON H") {
    sceneTimeState[2].startH = parseNumber(data, sceneTimeState[2].startH);
    renderSceneTime(2);
    return;
  }
  if (data.name_id === "number/T2 ON M") {
    sceneTimeState[2].startM = parseNumber(data, sceneTimeState[2].startM);
    renderSceneTime(2);
    return;
  }
  if (data.name_id === "number/T2 OFF H") {
    sceneTimeState[2].endH = parseNumber(data, sceneTimeState[2].endH);
    renderSceneTime(2);
    return;
  }
  if (data.name_id === "number/T2 OFF M") {
    sceneTimeState[2].endM = parseNumber(data, sceneTimeState[2].endM);
    renderSceneTime(2);
    return;
  }

  // 时间：场景三
  if (data.name_id === "number/T3 ON H") {
    sceneTimeState[3].startH = parseNumber(data, sceneTimeState[3].startH);
    renderSceneTime(3);
    return;
  }
  if (data.name_id === "number/T3 ON M") {
    sceneTimeState[3].startM = parseNumber(data, sceneTimeState[3].startM);
    renderSceneTime(3);
    return;
  }
  if (data.name_id === "number/T3 OFF H") {
    sceneTimeState[3].endH = parseNumber(data, sceneTimeState[3].endH);
    renderSceneTime(3);
    return;
  }
  if (data.name_id === "number/T3 OFF M") {
    sceneTimeState[3].endM = parseNumber(data, sceneTimeState[3].endM);
    renderSceneTime(3);
    return;
  }
}

if (timeModalClose) {
  timeModalClose.addEventListener("click", closeTimeModal);
}

if (timeModalCancel) {
  timeModalCancel.addEventListener("click", closeTimeModal);
}

if (timeModalConfirm) {
  timeModalConfirm.addEventListener("click", confirmTimeModal);
}

if (timeModal) {
  const mask = timeModal.querySelector(".modal-mask");
  if (mask) {
    mask.addEventListener("click", closeTimeModal);
  }
}

async function loadInitialState() {
  const requests = [
    API.mainSwitchGet,
    API.mindfulnessGet,
    API.mainBrightnessGet,

    API.scene1EnableGet,
    API.scene2EnableGet,
    API.scene3EnableGet,

    API.scene1BrightnessGet,
    API.scene2BrightnessGet,
    API.scene3BrightnessGet,

    API.scene1StartHGet,
    API.scene1StartMGet,
    API.scene1EndHGet,
    API.scene1EndMGet,

    API.scene2StartHGet,
    API.scene2StartMGet,
    API.scene2EndHGet,
    API.scene2EndMGet,

    API.scene3StartHGet,
    API.scene3StartMGet,
    API.scene3EndHGet,
    API.scene3EndMGet,
  ];

  for (const url of requests) {
    try {
      const json = await getJson(url);
      handleEventData(json);
    } catch (err) {
      console.warn("初始化读取失败:", url, err);
    }
  }
}

function connectEvents() {
  const es = new EventSource(API.events);

  es.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handleEventData(data);
    } catch (err) {
      console.warn("事件解析失败:", err, event.data);
    }
  };

  es.onerror = () => {
    console.warn("事件流断开，5秒后重连");
    es.close();
    setTimeout(connectEvents, 5000);
  };
}

// ===== 事件绑定 =====

// 主亮度滑条
if (brightnessSlider) {
  brightnessSlider.addEventListener("input", (e) => {
    renderBrightness(e.target.value);
  });

  brightnessSlider.addEventListener("change", async (e) => {
    try {
      await setMainBrightnessRemote(e.target.value);
    } catch (err) {
      console.error("设置主亮度失败:", err);
    }
  });
}

// 主亮度快捷按钮
quickBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = Number(btn.dataset.level);
    try {
      await setMainBrightnessRemote(value);
    } catch (err) {
      console.error("快捷亮度设置失败:", err);
    }
  });
});

// 主开关
if (mainSwitch) {
  mainSwitch.addEventListener("click", async () => {
    try {
      await turnLightRemote(!isOn);
    } catch (err) {
      console.error("切换主开关失败:", err);
    }
  });
}

// 场景开关
if (scene1Switch) {
  scene1Switch.addEventListener("click", async () => {
    const willOn = !scene1Switch.classList.contains("on");
    try {
      await setSceneEnable(1, willOn);
    } catch (err) {
      console.error("场景一开关失败:", err);
    }
  });
}

if (scene2Switch) {
  scene2Switch.addEventListener("click", async () => {
    const willOn = !scene2Switch.classList.contains("on");
    try {
      await setSceneEnable(2, willOn);
    } catch (err) {
      console.error("场景二开关失败:", err);
    }
  });
}

if (scene3Switch) {
  scene3Switch.addEventListener("click", async () => {
    const willOn = !scene3Switch.classList.contains("on");
    try {
      await setSceneEnable(3, willOn);
    } catch (err) {
      console.error("场景三开关失败:", err);
    }
  });
}

// 场景亮度按钮
if (scene1BrightnessBtn) {
  scene1BrightnessBtn.addEventListener("click", async () => {
    const current = (scene1BrightnessValue?.textContent || "30").replace("%", "");
    const input = prompt("设置场景一亮度（1-100）", current);
    if (input === null) return;
    const value = Math.max(1, Math.min(100, Number(input) || 0));
    if (!value) return;

    try {
      await setSceneBrightness(1, value);
    } catch (err) {
      console.error("设置场景一亮度失败:", err);
    }
  });
}

if (scene2BrightnessBtn) {
  scene2BrightnessBtn.addEventListener("click", async () => {
    const current = (scene2BrightnessValue?.textContent || "30").replace("%", "");
    const input = prompt("设置场景二亮度（1-100）", current);
    if (input === null) return;
    const value = Math.max(1, Math.min(100, Number(input) || 0));
    if (!value) return;

    try {
      await setSceneBrightness(2, value);
    } catch (err) {
      console.error("设置场景二亮度失败:", err);
    }
  });
}

if (scene3BrightnessBtn) {
  scene3BrightnessBtn.addEventListener("click", async () => {
    const current = (scene3BrightnessValue?.textContent || "50").replace("%", "");
    const input = prompt("设置场景三亮度（1-100）", current);
    if (input === null) return;
    const value = Math.max(1, Math.min(100, Number(input) || 0));
    if (!value) return;

    try {
      await setSceneBrightness(3, value);
    } catch (err) {
      console.error("设置场景三亮度失败:", err);
    }
  });
}

// 时间按钮
if (scene1StartBtn) {
  scene1StartBtn.addEventListener("click", () => {
    const current = scene1StartText?.textContent || "06:00";
    openTimeModal("设置场景一开始时间", current, async (h, m) => {
      await setSceneTime(1, "start", h, m);
    });
  });
}

if (scene1EndBtn) {
  scene1EndBtn.addEventListener("click", () => {
    const current = scene1EndText?.textContent || "08:00";
    openTimeModal("设置场景一结束时间", current, async (h, m) => {
      await setSceneTime(1, "end", h, m);
    });
  });
}

if (scene2StartBtn) {
  scene2StartBtn.addEventListener("click", () => {
    const current = scene2StartText?.textContent || "18:00";
    openTimeModal("设置场景二开始时间", current, async (h, m) => {
      await setSceneTime(2, "start", h, m);
    });
  });
}

if (scene2EndBtn) {
  scene2EndBtn.addEventListener("click", () => {
    const current = scene2EndText?.textContent || "22:00";
    openTimeModal("设置场景二结束时间", current, async (h, m) => {
      await setSceneTime(2, "end", h, m);
    });
  });
}

if (scene3StartBtn) {
  scene3StartBtn.addEventListener("click", () => {
    const current = scene3StartText?.textContent || "12:00";
    openTimeModal("设置场景三开始时间", current, async (h, m) => {
      await setSceneTime(3, "start", h, m);
    });
  });
}

if (scene3EndBtn) {
  scene3EndBtn.addEventListener("click", () => {
    const current = scene3EndText?.textContent || "14:00";
    openTimeModal("设置场景三结束时间", current, async (h, m) => {
      await setSceneTime(3, "end", h, m);
    });
  });
}

//系统层级按钮
if (restartBtn) {
  restartBtn.addEventListener("click", async () => {
    const ok = confirm("确定要重启设备吗？");
    if (!ok) return;

    try {
      await post(API.restart);
      alert("已发送重启指令，设备可能会短暂离线。");
    } catch (err) {
      console.error("重启设备失败:", err);
      alert("重启失败，请查看控制台日志。");
    }
  });
}

if (factoryResetBtn) {
  factoryResetBtn.addEventListener("click", async () => {
    const ok = confirm("恢复出厂设置会清除本地配置和配网信息，确定继续吗？");
    if (!ok) return;

    const ok2 = confirm("请再次确认：设备将恢复出厂设置。");
    if (!ok2) return;

    try {
      await post(API.factoryReset);
      alert("已发送恢复出厂设置指令，设备将重置。");
    } catch (err) {
      console.error("恢复出厂设置失败:", err);
      alert("恢复出厂设置失败，请查看控制台日志。");
    }
  });
}

if (mindfulnessToggleBtn) {
  mindfulnessToggleBtn.addEventListener("click", async () => {
    try {
      await setMindfulnessRemote(!mindfulnessOn);
    } catch (err) {
      console.error("切换正念模式失败:", err);
    }
  });
}

if (otaFileInput) {
  otaFileInput.addEventListener("change", () => {
    const file = otaFileInput.files && otaFileInput.files[0];
    if (!file) {
      setOtaStatus("未选择文件");
      setOtaProgress(0);
      return;
    }
    setOtaStatus(`已选择：${file.name}`);
    setOtaProgress(0);
  });
}

if (otaUploadBtn) {
  otaUploadBtn.addEventListener("click", async () => {
    if (otaUploading) return;

    const file = otaFileInput && otaFileInput.files ? otaFileInput.files[0] : null;
    if (!file) {
      setOtaStatus("请先选择固件文件");
      return;
    }

    const ok = confirm(`确认上传固件并升级设备？\n文件：${file.name}`);
    if (!ok) return;

    try {
      await uploadOtaFile(file);
      alert("固件已上传，设备将自动重启。");
    } catch (err) {
      console.error("OTA 上传失败:", err);
      setOtaStatus("固件上传失败，请重试");
      alert("固件上传失败，请查看控制台日志。");
    } finally {
      setOtaUploadingState(false);
    }
  });
}

loadInitialState();
connectEvents();
