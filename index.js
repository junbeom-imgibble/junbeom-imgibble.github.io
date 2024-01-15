function uuidV4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getStoryIconSize(size) {
  switch (size) {
    case "small":
      return "68px";
    case "basic":
      return "90px";
    case "large":
      return "100px";
  }
}
function getShortsIconSize(size) {
  switch (size) {
    case "small":
      return "120px";
    case "basic":
      return "160px";
    case "large":
      return "200px";
  }
}
function hasArray(data) {
  if (data === undefined || data === null) return false;
  return data?.length !== 0;
}

// todo: packages 로 이동
const MOBILE_SIZE = 768;
function getDocument(element) {
  return element.getRootNode();
}
function getRootAttributes(element) {
  const properties = element.getRootNode().host.properties;
  return function (name, defaultValue = null) {
    return properties[name]?.value || defaultValue;
  };
}
function getCanvas(element) {
  return element.closest("sw-canvas");
}
function getSWIcon(element) {
  return element.closest("sw-icon");
}
function getStoryStore(element) {
  return element.getRootNode().host.storyStore;
}
function getReadStories(element) {
  return getDocument(element).querySelector("sw-ui").readStories;
}
function getFeedStore(element) {
  return (element.closest("sw-view") || element.closest("sw-shorts")).feedStore;
}
const checkPostingTime = function (time) {
  const percentage = time / this.duration * 100;
  if (percentage >= 100) {
    this.currentTime = 0;
    return getFeedStore(this).goNext();
  }
  this.currentTime = time;
  this.gauge.setGauge(percentage);
};

// timer 가 단일인 상황, 추후 여러 개로 늘릴 수 있음.
// 단일 시간이 공통 으로 묶인 문제 발생
class Progress {
  constructor() {
    this.currentTime = 0;
    this.framer = null;
    this.setProgress = () => {
      this.currentTime += 1;
      if (this.framer === null) return;
      this.framer(this.currentTime);
    };
    this.start = () => {
      clearInterval(this.timer);
      this.timer = setInterval(this.setProgress, 10);
    };
    this.play = () => this.timer = setInterval(this.setProgress, 10);
    this.pause = () => clearInterval(this.timer);
    this.clear = () => {
      this.currentTime = 0;
      clearInterval(this.timer);
    };
  }
  addFramer(framer) {
    this.framer = framer;
  }
}
var Progress$1 = new Progress();
// setVideo(this.element)("play")
// setVideo(this.element)("pause")

function capturePosition(event) {
  if (event instanceof MouseEvent) return {
    x: event.clientX,
    y: event.clientY
  };
  if (event instanceof TouchEvent) return {
    x: event.changedTouches[0].clientX,
    y: event.changedTouches[0].clientY
  };
}
class Gesture {
  sendGestureData() {
    return this.data;
  }
  constructor(element, handler) {
    this.data = {
      startPoint: null,
      endPoint: null,
      amount: null,
      reach: null,
      eventInstance: null
    };
    this.element = element;
    this.handler = handler;
    this.handler.data = this.data;
    this.handler.element = element;
    this.element.addEventListener("mousedown", event => {
      this.isPressed = true;
      this.data.startPoint = capturePosition(event);
      if (this.handler.whenDown === undefined) return;
      this.handler.whenDown(event);
    });
    this.element.addEventListener("touchstart", event => {
      this.isPressed = true;
      this.data.startPoint = capturePosition(event);
      if (this.handler.whenDown === undefined) return;
      this.handler.whenDown(event);
    });
    // todo: 이벤트가 끝날 경우 touches 목롤을 상실
    this.element.addEventListener("mousemove", event => {
      if (!this.isPressed) return;
      this.data.amount = {
        x: this.data.startPoint.x - event.clientX,
        y: this.data.startPoint.y - event.clientY
      };
      if (this.handler.whenMoving === undefined) return;
      this.handler.whenMoving(event);
    });
    this.element.addEventListener("touchmove", event => {
      if (!this.isPressed) return;
      this.data.amount = {
        x: this.data.startPoint.x - event.changedTouches[0].clientX,
        y: this.data.startPoint.y - event.changedTouches[0].clientY
      };
      if (this.handler.whenMoving === undefined) return;
      this.handler.whenMoving(event);
    });
    this.element.addEventListener("mouseup", event => {
      this.isPressed = false;
      this.data.endPoint = capturePosition(event);
      this.data.amount = {
        x: this.data.startPoint.x - event.clientX,
        y: this.data.startPoint.y - event.clientY
      };
      this.data.reach = {
        x: this.data.startPoint.x - this.data.endPoint.x,
        y: this.data.startPoint.y - this.data.endPoint.y
      };
      if (this.handler.whenUp === undefined) return;
      this.handler.whenUp(event);
    });
    this.element.addEventListener("touchend", event => {
      this.isPressed = false;
      this.data.endPoint = capturePosition(event);
      this.data.amount = {
        x: this.data.startPoint.x - event.changedTouches[0].clientX,
        y: this.data.startPoint.y - event.changedTouches[0].clientY
      };
      this.data.reach = {
        x: this.data.startPoint.x - this.data.endPoint.x,
        y: this.data.startPoint.y - this.data.endPoint.y
      };
      if (this.handler.whenUp === undefined) return;
      this.handler.whenUp(event);
    });
  }
}
const mobileSlideEvent = {
  whenMoving: function (event) {
    if (window.innerWidth > MOBILE_SIZE) return;
    this.element.style.transform = `translateX(${-this.data.amount.x}px)`;
  },
  whenUp: function (event) {
    // 내부 아이콘 충돌 현상
    if (event.target.closest("svg")) return;
    if (window.innerWidth > MOBILE_SIZE) return;
    this.element.style.transform = `translateX(0)`;
    const moveAmount = Math.abs(this.data.amount.x / window.innerWidth * 100);
    if (moveAmount >= 10) return this.data.amount.x > 0 ? getStoryStore(event.target).goNext() : getStoryStore(event.target).goPrev();
    if (this.data.amount.x !== 0) return;
    // 사파리 단순 클릭 시 touch 와 mouse 둘 다 인식하는 현상
    if (event instanceof TouchEvent) return;
    const touchPosition = this.data.endPoint.x / window.innerWidth * 100;
    touchPosition <= 20 && getFeedStore(event.target).goPrev();
    touchPosition >= 80 && getFeedStore(event.target).goNext();
  }
};
class ResizeDetector {
  constructor() {
    this.isMobile = window.innerWidth <= MOBILE_SIZE;
    this.callbacks = [];
    this.whenResize = callback => this.callbacks.push(callback);
    window.onresize = () => {
      if (window.innerWidth <= MOBILE_SIZE) this.isMobile = true;
      if (!(window.innerWidth <= MOBILE_SIZE) && this.isMobile) this.isMobile = false;
      this.callbacks.forEach(callback => callback());
    };
  }
}
const resizeDetector = new ResizeDetector();
function toggleLayerOpen(element) {
  const layer = getDocument(element).querySelector("sw-layer");
  // 비디오 음성 해제 관련 로직이 포괄 되는 현상 정리 필요
  if (!layer.hasAttribute("hidden")) {
    const videos = layer.querySelectorAll(".content");
    videos.forEach(video => video.muted = true);
    // 닫을 때 timer 해제
    Progress$1.clear();
  }
  return layer.toggleAttribute("hidden");
}
function getRootAttributesWithDefaultSetting(element, defaultSettings) {
  const getRootAttribute = getRootAttributes(element);
  const property = {};
  Object.entries(defaultSettings).map(([key, value]) => {
    property[key] = getRootAttribute(key, value);
  });
  return property;
}
// root component를 가져오면 this를 생략할 수 있으나, widget이 여러개이면 참조가 공통이되는 문제 발생
// window.addEventListener("resize", () => {
//     const view = this.querySelector(".view-inner")
//     this.currentViewSize = getComputedStyle(view).width.replace("px", "")
// })

// todo : when 에서 interaction 관련 분리
// element 추상화를 통해서 재사용성 높이기 -> 내부 canvas 도 slider
function slide(when) {
  if (this.closest("sw-layer").getAttribute("hidden") === "") return;
  const viewContainer = this.querySelector("sw-view-group");
  viewContainer.style.transitionProperty = "left";
  viewContainer.style.transitionDuration = when === "selected" ? "0.4s" : "0s";
  const views = this.querySelectorAll("sw-view");
  const currentIndex = getStoryStore(this).getIndex();
  // view focus
  if (views.length !== 1) {
    const gap = views[1].offsetLeft - views[0].offsetLeft;
    viewContainer.style.left = -(gap * currentIndex) + "px";
  }
  // view size changer
  if (this.offsetWidth > MOBILE_SIZE && this.offsetHeight > 700) {
    views.forEach(view => {
      const indexGap = Math.abs(currentIndex - getStoryStore(this).getIndexById(view.story.id)) + 1;
      // 현재 view를 기준으로 일정 수준 감소 하는 방식으로 변경
      // window.innerHeight
      // todo : set max height
      const scaleRate = 3 - indexGap / 8;
      view.style.transform = `scale(${scaleRate})`;
    });
  }
  // if else 에서 defence if 로 변경
  else views.forEach(view => view.style.transform = "scale(1)");
}
function getAttributes(element) {
  return function (name) {
    if (element.attributes[name] === undefined) return "";
    return element.attributes[name].value;
  };
}
function percentage(number) {
  return Number(number) * 100;
}
class StoryStore {
  constructor(element) {
    this.getById = selectedStoryId => this.stories.find(story => story.id === selectedStoryId);
    this.setById = selectedStoryId => {
      this.currentStory = this.getById(selectedStoryId);
      this.render();
    };
    this.getIndex = () => this.stories.map(story => story.id).indexOf(this.currentStory.id);
    this.getIndexById = storyId => this.stories.map(story => story.id).indexOf(storyId);
    this.goNext = () => this.getIndex() !== this.stories.length - 1 && this.setById(this.stories[this.getIndex() + 1].id);
    this.goPrev = () => this.getIndex() !== 0 && this.setById(this.stories[this.getIndex() - 1].id);
    // todo: querySelector 접근 위험성
    // prev next 로 접근이 가성적
    this.render = () => {
      // (this.DOM.querySelector("sw-slider") as SlideElement).
      slide.call(this.document.querySelector("sw-slider"), "selected");
      // 로직 분리 필요
      // mute 아닌 pause 로 변경 필요 ( 컨텐츠를 못찾는 경우 에러 발생
      this.document.querySelectorAll(".content").forEach(videoContent => videoContent.muted = true);
      this.document.querySelectorAll("sw-view").forEach(element => element.story.id === this.currentStory.id ? element.feedStore.active(true) : element.feedStore.active(false));
    };
    this.element = element;
    this.document = element.document;
    this.stories = element.stories;
  }
}
const observeFeedElements = ["sw-canvas", "sw-screen", "sw-timeline", "sw-progress", "sw-interface-header", "sw-interface-options"];
class FeedStore {
  constructor(element) {
    this.getFeedById = selectedFeedId => this.feeds.find(feed => feed.id === selectedFeedId);
    this.setFeed = selectedFeed => {
      this.currentFeed = selectedFeed;
      this.render();
    };
    this.getIndex = () => this.feeds.indexOf(this.currentFeed);
    this.goNext = () => {
      //  todo : 인덱스 비교 로직 확인
      this.getIndex() !== this.feeds.length - 1 ? this.setFeed(this.feeds[this.getIndex() + 1]) : getStoryStore(this.element).goNext();
    };
    this.goPrev = () => {
      // if(Progress.current() > 50)  this.setFeed(this.feeds[this.getIndex()])
      this.getIndex() !== 0 ? this.setFeed(this.feeds[this.getIndex() - 1]) : getStoryStore(this.element).goPrev();
    };
    this.active = show => {
      Array.from(Array(this.element.childElementCount).keys()).forEach(index => this.element.children.item(index).style.display = show ? "flex" : "none");
      const thumbnail = this.element.querySelector(".view-thumbnail");
      thumbnail.style.display = show ? "none" : "flex";
      show && this.render();
    };
    // attribute 없이 바로 메서드 호출로 변경
    this.render = () => {
      observeFeedElements.map(name => this.element.querySelectorAll(name).forEach(element => element.setAttribute("current-feed-id", this.currentFeed.id)));
    };
    this.element = element;
    this.feeds = this.element.story.feeds;
    this.currentFeed = this.feeds[0];
  }
}
class ReadStories {
  constructor(element) {
    this.addReadStory = selectedStoryId => {
      const readStoriesId = new Set(this.readStoriesId);
      readStoriesId.add(selectedStoryId);
      sessionStorage.setItem("readStories", JSON.stringify([...readStoriesId]));
      this.render(selectedStoryId);
    };
    this.checkReadStories = () => this.readStoriesId.map(readStoryId => this.render(readStoryId));
    this.element = element;
    this.readStoriesId = JSON.parse(sessionStorage.getItem("readStories")) || new Array();
  }
  render(selectedStoryId) {
    const currentStory = Array.from(this.element.querySelectorAll("sw-story")).find(storyElement => storyElement.story.id === selectedStoryId);
    if (currentStory?.firstElementChild !== undefined) currentStory.firstElementChild.style.backgroundImage = "none";
  }
}
const UIDefaultSettings = {
  "size": "basic",
  "border-start-color": "#BC3BE9",
  "border-end-color": "#EC702B"
};
const Label = (text, borderStartColor, borderEndColor) => `<div class="story-label" style="background-image: linear-gradient(white, white), linear-gradient(180deg, ${borderStartColor}, ${borderEndColor})">${text}</div>`;
const Title = text => `<div class="story-title">${text}</div>`;
const Icon = (size, thumbnail, borderStartColor, borderEndColor) => `
<div class="story-icon" style="width: ${getStoryIconSize(size)}; background-image: linear-gradient(white, white), linear-gradient(180deg, ${borderStartColor}, ${borderEndColor})">
    <img alt="" class="story-image" src="${thumbnail}"/>
</div>
`;
customElements.define("sw-story", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.story = getStoryStore(this).getById(this.getAttribute("story-id"));
  }
  connectedCallback() {
    const {
      thumbnail,
      label,
      name,
      id
    } = this.story;
    const property = getRootAttributesWithDefaultSetting(this, UIDefaultSettings);
    this.innerHTML = Icon(property["size"], thumbnail, property["border-start-color"], property["border-end-color"]);
    if (label !== undefined) this.querySelector(".story-icon").insertAdjacentHTML("beforeend", Label(label, property["border-start-color"], property["border-end-color"]));
    if (name !== undefined) this.insertAdjacentHTML("beforeend", Title(name));
    this.onclick = () => {
      toggleLayerOpen(this);
      getStoryStore(this).setById(id);
      getReadStories(this).addReadStory(id);
    };
  }
});
class Element {
  constructor(element) {
    this.element = element;
    this.style = this.element.style;
  }
}
class ContentElement extends Element {
  constructor() {
    super(...arguments);
    this.source = this.element.getAttribute("source");
    this.fileType = this.element.getAttribute("file-type");
  }
  setPosition() {
    const property = getAttributes(this.element);
    this.style.aspectRatio = "9/16";
    this.style.width = percentage(property("scale")) + "%";
  }
  render() {
    if (this.fileType === "IMAGE" || this.fileType === "image") return this.element.innerHTML = `<img alt="" class="content" src="${this.source}"/>`;
    // mute 관련 재생 autoplay 이슈
    if (this.fileType === "VIDEO" || this.fileType === "video") {
      this.element.innerHTML = `<video class="content video-content" src="${this.source}" autoplay loop playsinline muted/>`;
      const videoElement = this.element.querySelector("video");
      const canvasElement = this.element.closest("sw-canvas");
      canvasElement.videoElement = videoElement;
      if (videoElement !== null) videoElement.muted = false;
    }
  }
}
class StickerElement extends Element {
  constructor() {
    super(...arguments);
    this.source = this.element.getAttribute("source");
  }
  setPosition() {
    const property = getAttributes(this.element);
    this.style.transform = `scale(${property("scale")})`;
    this.style.width = percentage(property("width")) + "%";
    this.style.height = percentage(property("height")) + "%";
  }
  render() {
    this.element.innerHTML = `<img alt="" class="content" src="${this.source}"/>`;
  }
}
class TextElement extends Element {
  constructor(props) {
    super(props);
    this.font = this.element.getAttribute("font");
    this.text = this.element.getAttribute("source");
    this.canvas = this.element.closest("sw-canvas");
    this.element.classList.add("sw-text-element");
  }
  setPosition() {
    const property = getAttributes(this.element);
    this.style.color = property("color");
    this.style.backgroundColor = property("background-color");
    const currentWith = this.canvas.clientWidth;
    this.style.fontSize = Number(property("scale")) * currentWith + "px";
    window.addEventListener("resize", () => {
      const currentWith = this.canvas.clientWidth;
      this.style.fontSize = Number(property("scale")) * currentWith + "px";
    });
  }
  render() {
    // 폰트 정보가 className 과 일치 하지 않은 관련 처리 필요
    this.style.fontFamily = convertFont(this.font);
    this.element.textContent = this.text;
  }
}
function convertFont(name) {
  switch (name) {
    case "NanumPenScript":
      return "Nanum Pen Script";
    case "NanumMyeongjo":
      return "Nanum Myeongjo";
    default:
      return name;
  }
}
const SWElements = {
  "CONTENT": ContentElement,
  "STICKER": StickerElement,
  "TEXT": TextElement
};
customElements.define("sw-element", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.fileType = this.getAttribute("file-type");
    this.elementType = this.getAttribute("element-type");
  }
  connectedCallback() {
    const property = getAttributes(this);
    // position
    this.style.top = percentage(property("top")) + "%";
    this.style.left = percentage(property("left")) + "%";
    this.style.rotate = -Number(property("rotate")) + "rad";
    this.element = new SWElements[this.elementType](this);
    this.element.setPosition();
    this.element.render();
  }
});

// bucket URL 분리
function createScene(content, elements) {
  const scene = document.createElement("div");
  scene.classList.add("scene");
  const {
    path,
    height,
    width,
    positionX,
    positionY,
    rotationAngle,
    type,
    scale
  } = content;
  scene.innerHTML = `<sw-element element-type="CONTENT" file-type=${type} source=${path} left=${positionX} top=${positionY} rotate=${rotationAngle} scale=${scale}></sw-element>`;
  if (elements === undefined) return scene;
  scene.innerHTML += elements.map(element => {
    if (element.type === "sticker") {
      const {
        width,
        height,
        scale,
        positionX,
        positionY,
        rotationAngle,
        sticker: {
          url
        }
      } = element;
      const stickerURL = "https://media.shortsdev.com/stickers" + url.replace("assets/sticker", "");
      return `<sw-element element-type="STICKER" file-type="IMAGE" source=${stickerURL} width=${width} height=${height} scale=${scale} left=${positionX} top=${positionY} rotate=${rotationAngle}></sw-element>`;
    }
    if (element.type === "text") {
      const {
        positionX,
        positionY,
        rotationAngle,
        text: {
          content,
          color,
          backgroundColor,
          size,
          fontFamily
        }
      } = element;
      return `<sw-element element-type="TEXT" file-type="TEXT" source=${content} left=${positionX} top=${positionY} rotate=${rotationAngle} scale=${size} color=${color} background-color=${backgroundColor} font=${fontFamily}></sw-element>`;
    }
  }).join("");
  return scene;
}

// scene manager 로 변경
customElements.define("sw-canvas", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.videoElement = null;
    this.isPlaying = false;
    this.isMuted = false;
  }
  static get observedAttributes() {
    return ["current-feed-id", "refresh"];
  }
  // 추후 변화에 의해 공통 props 관리 미룸
  // 기존에 존재하는 경우 append 가 아닌 해당 위치로 이동 관련 로직 필요(slide 로직과 유사하므로 재사용)
  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== "current-feed-id") return;
    // field 로 보유할 경우 , 변화 없음 (객체 얕은 복사)
    const currentFeed = getFeedStore(this).currentFeed;
    const content = currentFeed.content;
    const elements = currentFeed.elements;
    const scene = createScene(content, elements);
    scene.setAttribute("feed-id", currentFeed.id);
    this.innerHTML = scene.innerHTML;
  }
});
customElements.define("sw-shorts", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.story = getStoryStore(this).getById(this.getAttribute("story-id"));
    this.feedStore = new FeedStore(this);
    this.feedIndex = 0;
    this.isHover = false;
    this.size = getRootAttributes(this)("size") || "basic";
    this.showPreview = () => {
      this.preview.innerHTML = `<sw-canvas class="shorts-preview"/>`;
      this.feedStore.setFeed(this.feedStore.feeds[this.feedIndex]);
      this.feedIndex = this.feedIndex !== this.feedStore.feeds.length - 1 ? this.feedIndex + 1 : 0;
    };
  }
  connectedCallback() {
    this.style.width = getShortsIconSize(this.size);
    this.innerHTML = `
            <img class="shorts-image" src="${this.story.thumbnail}" alt=""/>
            <div class="preview-container"/>
        `;
    // todo: preview component 분리
    this.preview = this.querySelector(".preview-container");
    this.onmouseenter = () => {
      if (this.isHover) return;
      this.isHover = !this.isHover;
      this.showPreview();
      this.conversion = setInterval(this.showPreview, 2000);
    };
    this.onmouseleave = () => {
      if (!this.isHover) return;
      this.isHover = !this.isHover;
      this.preview.innerHTML = "";
      clearInterval(this.conversion);
    };
    this.onclick = () => {
      toggleLayerOpen(this);
      getStoryStore(this).setById(this.story.id);
    };
  }
});

// 게이지 분리
function SWGauge() {
  const element = document.createElement("div");
  element.classList.add("gauge");
  element.setGauge = function (percent) {
    this.style.width = percent + "%";
  };
  element.setFullGauge = function () {
    this.style.width = "100%";
  };
  element.setEmptyGauge = function () {
    this.style.width = "0%";
  };
  return element;
}
// todo: gauge component 분리
customElements.define("sw-progress", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.gauge = SWGauge();
    this.currentTime = 0;
    // 영상 전체 길이가 제대로 들어 오지 않음
    // 100 -> 1초
    this.duration = Number(this.getAttribute("duration")) || 300;
    this.feedId = this.getAttribute("feed-id");
  }
  connectedCallback() {
    // this.innerHTML = "<div class='gauge'></div>"
    // this.gauge = this.querySelector(".gauge")
    this.append(this.gauge);
  }
  static get observedAttributes() {
    return ["current-feed-id"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "current-feed-id" && this.feedId === oldValue) {
      // reset
      this.currentTime = 0;
    }
    if (name === "current-feed-id" && this.feedId === newValue) {
      Progress$1.clear();
      Progress$1.addFramer(checkPostingTime.bind(this));
      Progress$1.start();
    }
  }
});
customElements.define("sw-timeline", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.feeds = getFeedStore(this).feeds;
  }
  connectedCallback() {
    this.classList.add("timeline");
    this.innerHTML = this.feeds.map(feed => `<sw-progress feed-id=${feed.id} duration=${feed.duration}></sw-progress>`).join("");
  }
  static get observedAttributes() {
    return ["current-feed-id"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "current-feed-id") {
      const progresses = this.querySelectorAll("sw-progress");
      progresses.forEach(element => element.gauge.setEmptyGauge());
      const currentIndex = this.feeds.map(feed => feed.id).indexOf(newValue);
      Array.from(Array(currentIndex).keys()).forEach(index => progresses.item(index).gauge.setFullGauge());
    }
  }
});

// todo: shortsworks-public 으로 이동
const iconLibrary = {
  close: `<path d="M19.625 17.9315C20.075 18.4299 20.075 19.1776 19.625 19.6262C19.125 20.1246 18.375 20.1246 17.925 19.6262L12.025 13.6947L6.075 19.6262C5.575 20.1246 4.825 20.1246 4.375 19.6262C3.875 19.1776 3.875 18.4299 4.375 17.9315L10.325 12L4.375 6.06854C3.875 5.57009 3.875 4.82243 4.375 4.37383C4.825 3.87539 5.575 3.87539 6.025 4.37383L12.025 10.3551L17.975 4.42368C18.425 3.92523 19.175 3.92523 19.625 4.42368C20.125 4.87227 20.125 5.61994 19.625 6.11838L13.675 12L19.625 17.9315Z"/>`,
  left: `<path d="M13.8594 18.4621L8.27344 12.5246C8.11719 12.3293 8 12.0949 8 11.8605C8 11.6652 8.11719 11.4309 8.27344 11.2355L13.8594 5.29804C14.2109 4.90742 14.7969 4.90742 15.1875 5.25898C15.5781 5.61054 15.5781 6.19648 15.2266 6.58711L10.1875 11.8996L15.2266 17.173C15.5781 17.5637 15.5781 18.1496 15.1875 18.5012C14.7969 18.8527 14.2109 18.8527 13.8594 18.4621Z"/>`,
  right: `<path d="M9.62617 5.29804L15.2121 11.2355C15.3684 11.4309 15.4855 11.6652 15.4855 11.8605C15.4855 12.0949 15.3684 12.3293 15.2121 12.5246L9.62617 18.4621C9.27461 18.8527 8.68867 18.8527 8.29804 18.5012C7.90742 18.1496 7.90742 17.5637 8.25898 17.173L13.259 11.8605L8.25898 6.58711C7.90742 6.19648 7.90742 5.61054 8.29804 5.25898C8.68867 4.90742 9.27461 4.90742 9.62617 5.29804Z"/>`,
  heart: `<path d="M11.5312 5.60624L11.9609 6.07499L12.4297 5.6453C13.7188 4.35624 15.5547 3.7703 17.3125 4.0828C20.0078 4.51249 22 6.85624 22 9.59061V9.78592C22 11.4265 21.2969 12.989 20.125 14.0828L13.0547 20.6844C12.7812 20.9578 12.3906 21.075 12 21.075C11.5703 21.075 11.1797 20.9578 10.9062 20.6844L3.83594 14.0828C2.66406 12.989 2 11.4265 2 9.78592V9.59061C2 6.85624 3.95312 4.51249 6.64844 4.0828C8.40625 3.7703 10.2422 4.35624 11.5312 5.60624C11.5312 5.6453 11.4922 5.60624 11.5312 5.60624ZM11.9609 8.73124L10.2031 6.93436C9.34375 6.11405 8.13281 5.72342 6.96094 5.91874C5.16406 6.23124 3.875 7.75467 3.875 9.59061V9.78592C3.875 10.9187 4.30469 11.9734 5.125 12.7156L12 19.1219L18.8359 12.7156C19.6562 11.9734 20.125 10.9187 20.125 9.78592V9.59061C20.125 7.75467 18.7969 6.23124 17 5.91874C15.8281 5.72342 14.6172 6.11405 13.7578 6.93436L11.9609 8.73124Z"/>`,
  share: `<path d="M21 6.28571C21 8.65179 19.0804 10.5714 16.7143 10.5714C15.4196 10.5714 14.2589 10.0357 13.4554 9.09821L9.4375 11.1071C9.52679 11.4196 9.52679 11.7321 9.52679 12C9.52679 12.3125 9.52679 12.625 9.4375 12.9375L13.4554 14.9018C14.2589 14.0089 15.4196 13.4286 16.7143 13.4286C19.0804 13.4286 21 15.3482 21 17.7143C21 20.0804 19.0804 22 16.7143 22C14.3036 22 12.4286 20.0804 12.4286 17.7143C12.4286 17.4464 12.4286 17.1339 12.5179 16.8214L8.5 14.8125C7.69643 15.75 6.53571 16.2857 5.28571 16.2857C2.875 16.2857 1 14.3661 1 12C1 9.63393 2.875 7.71429 5.28571 7.71429C6.53571 7.71429 7.69643 8.29464 8.5 9.1875L12.5179 7.22321C12.4286 6.91071 12.4286 6.59821 12.4286 6.28571C12.4286 3.91964 14.3036 2 16.7143 2C19.0804 2 21 3.91964 21 6.28571ZM5.24107 14.1429C6.44643 14.1429 7.38393 13.2054 7.38393 12C7.38393 10.8393 6.44643 9.85714 5.24107 9.85714C4.08036 9.85714 3.09821 10.8393 3.09821 12C3.09821 13.2054 4.08036 14.1429 5.24107 14.1429ZM16.7143 4.14286C15.5089 4.14286 14.5714 5.125 14.5714 6.28571C14.5714 7.49107 15.5089 8.42857 16.7143 8.42857C17.875 8.42857 18.8571 7.49107 18.8571 6.28571C18.8571 5.125 17.875 4.14286 16.7143 4.14286ZM16.7143 19.8571C17.875 19.8571 18.8571 18.9196 18.8571 17.7143C18.8571 16.5536 17.875 15.5714 16.7143 15.5714C15.5089 15.5714 14.5714 16.5536 14.5714 17.7143C14.5714 18.9196 15.5089 19.8571 16.7143 19.8571Z"/>`,
  ellipsis: `<path d="M12.458 18.2814C13.5583 18.2814 14.4893 19.2124 14.4893 20.3127C14.4893 21.4552 13.5583 22.3439 12.458 22.3439C11.3154 22.3439 10.4268 21.4552 10.4268 20.3127C10.4268 19.2124 11.3154 18.2814 12.458 18.2814ZM12.458 11.5106C13.5583 11.5106 14.4893 12.4416 14.4893 13.5418C14.4893 14.6844 13.5583 15.5731 12.458 15.5731C11.3154 15.5731 10.4268 14.6844 10.4268 13.5418C10.4268 12.4416 11.3154 11.5106 12.458 11.5106ZM12.458 8.80225C11.3154 8.80225 10.4268 7.91357 10.4268 6.771C10.4268 5.67074 11.3154 4.73975 12.458 4.73975C13.5583 4.73975 14.4893 5.67074 14.4893 6.771C14.4893 7.91357 13.5583 8.80225 12.458 8.80225Z"/>`,
  back: `<path d="M23.8337 12.9776C23.8337 13.6091 23.3627 14.1053 22.8061 14.1053H5.72076L11.4154 19.789C11.8435 20.1949 11.8435 20.9167 11.4582 21.3227C11.0728 21.7737 10.4306 21.7737 10.0024 21.3678L2.46671 13.7896C2.25263 13.564 2.16699 13.2934 2.16699 12.9776C2.16699 12.707 2.25263 12.4363 2.46671 12.2108L10.0024 4.63256C10.4306 4.22659 11.0728 4.22659 11.4582 4.67767C11.8435 5.08365 11.8435 5.80538 11.4154 6.21135L5.72076 11.895H22.8061C23.4055 11.895 23.8337 12.3912 23.8337 12.9776Z"/>`,
  play: "",
  pause: "",
  unMute: "<path d=\"M13.1728 3.12054C13.6176 3.32143 13.9412 3.80357 13.9412 4.28571V19.7143C13.9412 20.2366 13.6176 20.6786 13.1728 20.9196C12.9706 21 12.8088 21 12.6471 21C12.3235 21 12 20.9196 11.7574 20.5982L6.29779 15.7768H2.94118C1.84926 15.7768 1 14.933 1 13.8884V10.0714C1 9.02679 1.84926 8.14286 2.94118 8.14286H6.29779L11.7574 3.36161C12 3.12054 12.3235 3 12.6471 3C12.8088 3 12.9706 3.04018 13.1728 3.12054ZM12 18.308V5.73214L7.06618 10.1116H2.94118V13.9286H7.06618L12 18.308ZM17.6618 9.02679C18.5919 9.79018 19.1176 10.875 19.1176 12C19.1176 13.1652 18.5919 14.25 17.6618 15.0134C17.5 15.1339 17.2574 15.2143 17.0551 15.2143C16.7721 15.2143 16.489 15.0938 16.2868 14.8527C15.9632 14.4509 16.0037 13.8482 16.4485 13.4866C16.8934 13.125 17.1765 12.6027 17.1765 12C17.1765 11.4375 16.8934 10.9152 16.4485 10.5536C16.0037 10.192 15.9632 9.58929 16.2868 9.1875C16.489 8.94643 16.7721 8.82589 17.0551 8.82589C17.2574 8.82589 17.5 8.90625 17.6618 9.02679ZM20.1287 6.05357C21.9485 7.54018 23 9.70982 23 12C23 14.3304 21.9485 16.5 20.1287 17.9866C19.9265 18.1071 19.7243 18.1875 19.4816 18.1875C19.1985 18.1875 18.9559 18.067 18.7537 17.8259C18.3897 17.4241 18.4706 16.8214 18.875 16.4598C20.25 15.375 21.0588 13.7277 21.0588 12C21.0588 10.3125 20.25 8.66518 18.875 7.58036C18.4706 7.21875 18.3897 6.61607 18.7537 6.21429C18.9559 5.97321 19.1985 5.85268 19.4816 5.85268C19.7243 5.85268 19.9265 5.93304 20.1287 6.05357Z\"/>",
  mute: "<path d=\"M22.6527 16.5225C23.0478 16.8039 23.1197 17.3316 22.7964 17.6834C22.6168 17.8945 22.3654 18 22.114 18C21.9344 18 21.7548 17.9648 21.5752 17.7889L0.347259 1.50102C-0.0478467 1.21958 -0.119684 0.691899 0.203584 0.340108C0.490933 -0.0468615 1.02971 -0.11722 1.3889 0.199392L7.71058 5.0541L11.8771 1.43066C12.0927 1.21958 12.38 1.11405 12.6674 1.11405C12.811 1.11405 12.9547 1.14923 13.1343 1.21958C13.5294 1.39548 13.8168 1.81763 13.8168 2.23978V9.69774L15.7564 11.2104C15.6486 10.8938 15.7564 10.542 16.0437 10.2958C16.4388 9.97917 16.6902 9.52184 16.6902 8.99416C16.6902 8.50165 16.4388 8.04432 16.0437 7.72771C15.6486 7.4111 15.6127 6.88342 15.9 6.53162C16.0796 6.32055 16.3311 6.21501 16.5825 6.21501C16.7621 6.21501 16.9776 6.28537 17.1213 6.39091C17.9474 7.05931 18.4143 8.00914 18.4143 8.99416C18.4143 10.0144 17.9474 10.9642 17.1213 11.6326C16.9776 11.7381 16.7621 11.8085 16.5825 11.8085C16.5466 11.8085 16.5466 11.8085 16.5107 11.8085L18.127 13.0046C18.1629 12.9694 18.1629 12.9342 18.1988 12.899C19.4201 11.9492 20.1384 10.5069 20.1384 8.99416C20.1384 7.51664 19.4201 6.0743 18.1988 5.15964C17.8396 4.84303 17.7678 4.31534 18.0911 3.96355C18.2707 3.75248 18.4862 3.64694 18.7376 3.64694C18.9531 3.64694 19.1327 3.7173 19.3123 3.82284C20.9286 5.08928 21.8625 6.98895 21.8625 8.99416C21.8625 10.929 20.9646 12.7583 19.4919 14.0599L22.6527 16.5225ZM12.0927 8.36094V3.50622L9.11141 6.10948L12.0927 8.36094ZM12.0927 14.5173V12.688L13.8168 13.9896V15.7485C13.8168 16.2059 13.5294 16.5928 13.1343 16.8039C12.9547 16.8743 12.811 16.8743 12.6674 16.8743C12.38 16.8743 12.0927 16.8039 11.8771 16.5577L7.02813 12.3713H4.04688C3.07708 12.3713 2.32278 11.6326 2.32278 10.6828V7.30556C2.32278 6.67234 2.68197 6.14465 3.18483 5.86322L5.12444 7.34074H4.04688V10.6828H7.71058L12.0927 14.5173Z\"/>"
};
function renderIcon(path) {
  return `
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
            ${path}
        </svg>
    `;
}
const videoIcons = {
  play: {
    onClick: () => {
      const currentVideoElement = getCanvas(undefined).videoElement;
      currentVideoElement.play();
      getSWIcon(undefined).replaceCurrentIcon("video.pause");
    }
  },
  pause: {
    onClick: () => {
      const currentVideoElement = getCanvas(undefined).videoElement;
      currentVideoElement.pause();
      getSWIcon(undefined).replaceCurrentIcon("video.pause");
    }
  },
  mute: {
    onClick: () => {
      const currentVideoElement = getCanvas(undefined).videoElement;
      currentVideoElement.muted = true;
      getSWIcon(undefined).replaceCurrentIcon("video.unmute");
    }
  },
  unmute: {
    onClick: () => {
      const currentVideoElement = getCanvas(undefined).videoElement;
      currentVideoElement.muted = false;
      getSWIcon(undefined).replaceCurrentIcon("video.mute");
    }
  }
};
const optionIcons = {
  like: {
    isActive: false,
    icon: iconLibrary["heart"],
    onClick: function () {
      const likedPostingId = getFeedStore(this).currentFeed.id;
      let likedPostings = JSON.parse(localStorage.getItem("sw-likes"));
      if (likedPostings === null) {
        this.style.color = "red";
        return localStorage.setItem("sw-likes", JSON.stringify([likedPostingId]));
      }
      if (this.style.color === "red") {
        this.style.color = "white";
        likedPostings = likedPostings.filter(id => id !== likedPostingId);
        return localStorage.setItem("sw-likes", JSON.stringify(likedPostings));
      }
      this.style.color = "red";
      likedPostings = new Set([...likedPostings, likedPostingId]);
      likedPostings = [...likedPostings];
      localStorage.setItem("sw-likes", JSON.stringify(likedPostings));
    }
  },
  share: {
    icon: iconLibrary["share"]
  },
  ellipsis: {}
};
const routerIcons = {
  back: {
    icon: iconLibrary["close"],
    onClick: function () {
      toggleLayerOpen(this);
    }
  },
  close: {
    icon: iconLibrary["close"],
    onClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleLayerOpen(this);
    }
  },
  arrow: {
    left: {
      icon: iconLibrary["left"],
      onClick: function () {
        getFeedStore(this).goPrev();
      }
    },
    right: {
      icon: iconLibrary["right"],
      onClick: function () {
        getFeedStore(this).goNext();
      }
    }
  }
};
const iconElements = {
  option: optionIcons,
  video: videoIcons,
  router: routerIcons
};
// switch 에서 function 으로 변경, innerHTML 은 object["element"] 방법 이용.
// onclick 은?
// switch(icon) {
//     case "outer-close":
//         this.classList.add("outer-close")
//         // container.innerHTML = close
//         this.onclick = () => toggleLayerOpen(this)
//         break
//     case "back":
//         this.classList.add("back")
//         // container.innerHTML = back
//         this.onclick = () => toggleLayerOpen(this)
//         break
//     case "left":
//         this.classList.add("arrow")
//         // container.innerHTML = left
//         this.onclick = () => getFeedStore(this).goPrev()
//         break
//     case "right":
//         this.classList.add("arrow")
//         // container.innerHTML = right
//         this.onclick = () => getFeedStore(this).goNext()
//         break
//     case "heart":
//         this.classList.add("heart")
//         // container.innerHTML = heart
//         break
//     case "share":
//         this.classList.add("share")
//         // container.innerHTML = share
//         break
//     case "elipsis":
//         this.classList.add("elipsis")
//         // container.innerHTML = ellipsis
//         break
//     case "play":
//         this.classList.add("play")
//         break
//     case "pause":
//         this.classList.add("pause")
//         break
//     case "mute":
//         break
//     case "unmute":
//         break
// }

function indexingToObject(object, index) {
  return index.split(".").reduce((origin, index) => origin[index], object);
}

// import {specificIcons} from "components/icon/specific"
// 교체 패턴 으로 요소
customElements.define("sw-icon", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.iconName = this.getAttribute("icon");
    this.isStateless = Boolean(this.getAttribute("static"));
    this.visible = this.getAttribute("visible");
  }
  connectedCallback() {
    this.style.visibility = this.visible;
    // 정적 사이즈 설정
    const size = this.getAttribute("size");
    this.style.width = size + "px";
    this.style.height = size + "px";
    this.mounted();
    // this.icon = iconElements[this.name]
    // this.classList.add(this.icon.class)
    // this.icon.onMount()
    // this.addEventListener("click", this.icon.onClick)
  }
  mounted() {
    // 라이프 사이클
    if (this.currentIcon.onMount !== undefined) this.currentIcon.onMount.bind(this)();
    // 이벤트 핸들러 등록
    if (this.currentIcon.onClick !== undefined) this.onclick = this.currentIcon.onClick;
  }
  replaceCurrentIcon(iconName) {
    this.currentIcon = indexingToObject(iconElements, this.iconName);
    this.innerHTML = renderIcon(this.currentIcon.icon);
    this.mounted();
  }
});
customElements.define("sw-interface-options", class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <sw-icon icon="option.like" class="heart"></sw-icon>
            <sw-icon icon="option.share" class="heart"></sw-icon>
        `;
  }
  static get observedAttributes() {
    return ["current-feed-id"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== "current-feed-id") return;
    const likeIcon = this.querySelector(".heart");
    const likePostings = JSON.parse(localStorage.getItem("sw-likes"));
    if (likePostings === null) return;
    if (likePostings.includes(newValue)) likeIcon.style.color = "red";else likeIcon.style.color = "white";
  }
});

// todo: title element 분할
// video player 관련 icon 추가
customElements.define("sw-interface-header", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.currentVideoElement = getCanvas(this).videoElement;
  }
  connectedCallback() {
    this.innerHTML = `
            <div class="interface-title">Title1</div>
<!--            <sw-icon icon="elipsis"></sw-icon>-->
            <sw-icon icon="video.mute"></sw-icon>
            <sw-icon icon="video.play"></sw-icon>
            <sw-icon icon=router.close style="position: absolute; right: 0;"></sw-icon>
        `;
    window.addEventListener("resize", () => {
      const titleBar = this.querySelector(".interface-title");
      const currentWidth = this.closest(".view-inner").clientWidth;
      if (currentWidth === 0) return;
      titleBar.style.fontSize = currentWidth / 260 * 12 + "px";
    });
  }
  static get observedAttributes() {
    return ["current-feed-id"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    // 캔버스 내 폰트는 모두 일괄 적용 되도록 추후 수정
    // connected 일 경우 다시 열었을 때 인식 되지 않음
    const titleBar = this.querySelector(".interface-title");
    const currentWidth = this.closest(".view-inner").clientWidth;
    if (currentWidth !== 0) titleBar.style.fontSize = currentWidth / 260 * 12 + "px";
    // const titleBar = this.querySelector(".interface-title")
    // const title = getFeedStore(this).currentFeed.name
    // if(title === undefined) return
    // titleBar.textContent = title
  }
});
customElements.define("sw-interface", class extends HTMLElement {
  connectedCallback() {
    this.classList.add("interface");
    this.innerHTML = `
            <sw-timeline></sw-timeline>
            <sw-interface-header></sw-interface-header>
            <sw-interface-options></sw-interface-options>
        `;
  }
});
function checkPostingsIndex(element) {
  const storyId = this.getAttribute("story-id");
  const storyIdIndex = this.storyStore.getIndexById(storyId);
  const isFirstIndex = storyIdIndex === 0;
  const isLastIndex = storyIdIndex === this.storyStore.stories.length - 1;
  return [isFirstIndex, isLastIndex];
}
customElements.define("sw-controller", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.storyStore = getStoryStore(this);
  }
  render({
    isFirstIndex,
    isLastIndex
  }) {
    this.innerHTML = `
            <sw-icon icon="router.arrow.left" size="32" visible=${isFirstIndex}></sw-icon>
            <sw-icon icon="router.arrow.right" size="32" visible=${isLastIndex}></sw-icon>
        `;
  }
  postingChangedCallback() {
    const [isFirstIndex, isLastIndex] = checkPostingsIndex();
    this.render({
      isFirstIndex,
      isLastIndex
    });
  }
});
customElements.define("sw-view", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.story = getStoryStore(this).getById(this.getAttribute("story-id"));
    this.feedStore = new FeedStore(this);
  }
  connectedCallback() {
    this.classList.add("view");
    this.innerHTML = `
            <div class="view-inner">
                <sw-canvas></sw-canvas>
                <sw-interface></sw-interface>
            </div>
            <sw-controller story-id=${this.getAttribute("story-id")}></sw-controller>
        `;
    this.insertAdjacentHTML("afterbegin", `
            <div class="view-thumbnail">
                <img alt="view-thumbnail" src="${this.story.thumbnail}" style="opacity: 0.1"/>
            </div>            
        `);
    const thumbnail = this.querySelector(".view-thumbnail");
    thumbnail.onclick = () => getStoryStore(this).setById(this.story.id);
    // reSizeIcons.bind(this)
    // resize 이벤트 object 로 통일
    // window.addEventListener("resize", reSizeIcons.bind(this))
  }
});

// todo: 싱글톤 progress 생성
customElements.define("sw-view-group", class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = getStoryStore(this).stories.map(story => `<sw-view story-id=${story.id}></sw-view>`).join("");
    window.addEventListener("resize", () => {
      const view = this.querySelector(".view-inner");
      this.currentViewSize = getComputedStyle(view).width.replace("px", "");
    });
  }
});
customElements.define("sw-slider", class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<sw-view-group></sw-view-group>`;
    resizeDetector.whenResize(() => slide.call(this, "resize"));
    new Gesture(this, mobileSlideEvent);
  }
});
customElements.define("sw-embed", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.story = getStoryStore(this).getById(this.getAttribute("story-id"));
  }
  connectedCallback() {
    this.innerHTML = `
            <img alt="thumbnail" src="${this.story.thumbnail}" class="embed-thumbnail"></img>
            <sw-slider></sw-slider>
        `;
    let isHover = false;
    const {
      currentStory,
      setStoryById
    } = getStoryStore(this);
    this.onmouseenter = () => {
      if (isHover) return;
      isHover = !isHover;
      if (currentStory === undefined) {
        setStoryById(this.story.id);
        return;
      }
      setStoryById(currentStory.id);
    };
    this.onmouseleave = () => isHover && (isHover = !isHover);
  }
});

// 추후 UI가 고도화 될 수 있음.
customElements.define("sw-ui", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.stories = getStoryStore(this).stories;
    this.readStories = new ReadStories(this);
  }
  connectedCallback() {
    const getRootAttribute = getRootAttributes(this);
    const type = getRootAttribute("type", "group");
    const shape = getRootAttribute("shape", "story");
    const shownStories = type === "group" ? this.stories : [this.stories[0]];
    if (shape === "story" || shape === "shorts") {
      this.innerHTML = shownStories.map(shownStory => `<sw-${shape} story-id=${shownStory.id}></sw-${shape}>`).join("");
    }
    if (shape === "embed") {
      this.innerHTML = `<sw-embed story-id="${this.stories[0].id}"/>`;
      // remove 처리를 root 에서 하도록 변경 후 shape 에 따른 렌더링 로직 통일
      getDocument(this).querySelector("sw-layer").remove();
    }
    this.readStories.checkReadStories();
  }
});

// todo: layer 영역까지 view 소속으로 변경
customElements.define("sw-layer", class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <sw-icon icon="router.back" class="router-back"></sw-icon>
            <sw-slider></sw-slider>
        `;
    // todo: 레이어 클릭 시 닫힘 처리
    this.addEventListener("click", event => {
      const isLayerClicked = event.target === event.currentTarget;
      if (isLayerClicked) return toggleLayerOpen(this);
    });
  }
});
const story = (size, borderStartColor, borderEndColor) => `
    <div class="skeleton-story" style="width: ${getStoryIconSize(size)}; background: linear-gradient(180deg, ${borderStartColor}, ${borderEndColor});">
        <div class="skeleton-border">
            <div class="skeleton-image"></div>
        </div>
    </div>
`;
const shorts = size => `<div style="width: ${getShortsIconSize(size)}" class="skeleton-shorts"></div>`;
const skeletons = {
  story,
  shorts
};
customElements.define("sw-skeleton", class extends HTMLElement {
  constructor() {
    super(...arguments);
    this.properties = {
      shape: "story",
      type: "group",
      size: "basic",
      "border-start-color": "#BC3BE9",
      "border-end-color": "#EC702B"
    };
  }
  connectedCallback() {
    const getRootAttribute = getRootAttributes(this);
    Object.entries(this.properties).map(([name, defaultValue]) => {
      this.properties[name] = getRootAttribute(name, defaultValue);
    });
    const {
      shape,
      size,
      type
    } = this.properties;
    const repeatCount = type === "group" ? 7 : 1;
    this.innerHTML = skeletons[shape](size, this.properties["border-start-color"], this.properties["border-end-color"]).repeat(repeatCount);
  }
});
var styles = "* {\n    user-select: none;\n    -moz-user-select: none;\n    scrollbar-width: none;\n    -webkit-user-drag: none;\n    font-size: 14px;\n}\n\n*::-webkit-scrollbar {\n    display: none;\n}\n\nsw-canvas {\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 100%;\n    width: 100%;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n\n\n    box-sizing: border-box;\n    /*border: 1px solid red;*/\n}\n\nsw-element {\n    position: absolute;\n    overflow: hidden;\n}\n\n.content {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    object-fit: fill;\n}\n\n.video-content {\n    object-fit: contain;\n}\n\n.scene {\n    position: relative;\n    width: 100%;\n    height: 100%;\n}\n\n/* default 스타일 적용된 점 확인 필요 */\n\n.sw-text-element {\n    opacity: 80%;\n    /*padding-block: 12px;*/\n    padding-inline: 4px;\n    border-radius: 4px;\n}\n\nsw-controller {\n    position: absolute;\n    width: 144%;\n    height: 0;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    align-items: center;\n\n    @container slider (max-width: 768px) {\n        visibility: hidden\n    }\n}\n\n.interface {\n    position: absolute;\n\n    display: flex;\n    flex-direction: column;\n\n    padding-inline: 4%;\n    padding-block: 8%;\n    box-sizing: border-box;\n\n    width: 100%;\n    height: 100%;\n\n}\n\nsw-interface-header {\n    top: 2%;\n    position: relative;\n    display: flex;\n}\n\nsw-interface-options {\n    margin-top: auto;\n    position: relative;\n    bottom: 4%;\n    display: flex;\n    align-self: flex-end;\n    justify-content: flex-end;\n    flex-direction: column;\n    gap: 4%;\n    height: 100%;\n}\n\n.interface-title {\n    position: relative;\n    color: white;\n    font-weight: 700;\n    font-size: 12px;\n    left: 1%;\n\n    @media (max-width: 500px) {\n            font-size: 24px;\n    }\n}\n\n.timeline {\n    width: 100%;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    gap: 2px;\n    box-sizing: border-box;\n    padding-inline: 2px;\n    position: relative;\n}\n\nsw-progress {\n    border-radius: 1px;\n    height: 2px;\n    width: 100%;\n    background-color: rgba(255, 255, 255, 0.48);\n    overflow: hidden;\n}\n\n.gauge {\n    border-radius: 1px;\n    height: 100%;\n    width: 0;\n    background-color: #FFFFFF;\n}\n\n.view {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n\n    position: relative;\n    width: 100%;\n\n    /*border-radius: 6px;*/\n\n    cursor: pointer;\n    transition: transform 0.4s;\n}\n\n.view-inner {\n\n    position: relative;\n\n    aspect-ratio: 9/16;\n    border-radius: 6px;\n\n    height: 100%;\n    width: auto;\n\n    display: flex;\n    align-items: center;\n    justify-content: center;\n\n    overflow: hidden;\n\n    background-color: #000000;\n\n    box-sizing: border-box;\n    border: 1px solid #828282;\n\n\n    @media (max-width: 768px), (max-height: 500px) {\n        border-radius: 0;\n        border: none;\n    }\n}\n\n.view-thumbnail {\n    position: absolute;\n    height: 100%;\n    width: 100%;\n\n    z-index: 99;\n    border-radius: 6px;\n    box-sizing: border-box;\n    object-fit: cover;\n\n    background-color: black;\n}\n\nsw-view-group {\n    /* position */\n    position: relative;\n    left: 0;\n\n    /* layout */\n    display: flex;\n    flex-direction: row;\n    gap: 220px;\n\n    /* size */\n    width: auto;\n    height: 100vh;\n\n    aspect-ratio: 9/16;\n\n    @media (max-width: 768px), (max-height: 500px) {\n            width: 100%;\n            height: 100%;\n            gap: 0;\n    }\n}\n\nsw-layer {\n    position: fixed;\n    height: -webkit-fill-available;\n    width: 100vw;\n    z-index: 999;\n    top: 0;\n    left: 0;\n    background-color: rgb(0,0,0,0.5);\n    box-sizing: border-box;\n\n}\n\n@media (max-width: 768px), (max-height: 500px) {\n    sw-layer {\n        background-color: #000000;\n    }\n}\n\n/*@supports (-webkit-touch-callout: none) {*/\n\n/*    height: -webkit-fill-available;*/\n\n/*}*/\n\nsw-slider {\n    position: absolute;\n    top: 0;\n    left: 0;\n\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n\n    box-sizing: border-box;\n\n    display: flex;\n    align-items: center;\n    justify-content: center;\n\n    container-name: slider;\n    container-type: inline-size;\n}\n\nsw-story {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    cursor: pointer;\n    gap: 8px;\n    flex-shrink: 0;\n\n}\n\n.story-icon {    \n    position: relative;\n\n    display: flex;\n    justify-content: center;\n\n    padding: 0.25rem;\n\n    border-radius: 50%;\n    border: 0.25rem solid transparent;\n    background-image: linear-gradient(white, white), linear-gradient(0deg,  #EC702B, #BC3BE9);\n    background-origin: border-box;\n    background-clip: padding-box, border-box;\n}\n\n.story-image {\n    width: 100%;\n    aspect-ratio: 1/1;\n    border-radius: 50%;\n    object-fit: cover;\n\n    background-color: #3232393D;\n}\n\n.story-label {\n    /*position*/\n    position: absolute;\n    bottom: -8px;\n    /*color*/\n    background: linear-gradient(0deg, #EC702B, #BC3BE9);\n    color: #FFFF;\n    /*size*/\n    border: 0.2rem solid #FFFF;\n    border-radius: 0.25rem;\n    padding: 0.2rem;\n}\n\n.story-title {\n    color: black;\n}\n\nsw-shorts {\n    aspect-ratio: 9/16;\n    overflow: hidden;\n    cursor: pointer;\n    border-radius: 12px;\n    position: relative;\n    box-sizing: border-box;\n    flex-shrink: 0;\n}\n\nsw-shorts:hover {\n    background-color: #000000;\n}\n\n.shorts-image, .shorts-preview {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    left: 0;\n    top: 0;\n    object-fit: cover;\n\n    background-color: #3232393D;\n}\n\nsw-shorts:hover .shorts-image {\n    display: none;\n}\n\n@keyframes fade { from {opacity: 0} to {opacity: 1} }\n\n.shorts-preview {\n    animation: fade 0.5s;\n    animation-fill-mode: forwards;\n}\n\nsw-embed {\n    position: relative;\n    width: 400px;\n    aspect-ratio: 9/16;\n}\n\nsw-embed:hover .embed-thumbnail {\n    display: none;\n}\n\n.embed-thumbnail {\n    width: 100%;\n    height: 100%;\n    z-index: 1;\n    position: absolute;\n    object-fit: cover;\n    border-radius: 4px;\n}\n\nsw-ui, sw-skeleton {\n    display: flex;\n    flex-direction: row;\n    gap: 12px;\n    overflow: scroll;\n    width: 100%;\n}\n\n.skeleton-story {\n    flex-shrink: 0;\n    position: relative;\n    border-radius: 50%;\n\n    aspect-ratio: 1/1;\n\n    display: flex;\n    align-items: center;\n    justify-content: center;\n\n    overflow: hidden;\n}\n\n.skeleton-border {\n    width: 93%;\n    height:  93%;\n    background-color: #FFFFFF;\n    border-radius: 50%;\n\n    overflow: hidden;\n\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.skeleton-image {\n    width: 94%;\n    height: 94%;\n    border-radius: 50%;\n\n    background-color: #3232393D;\n    overflow: hidden;\n\n}\n\n.skeleton-shorts {\n    background-color: rgba(50, 50, 57, 0.24);\n    aspect-ratio: 9/16;\n    border-radius: 8px;\n    flex-shrink: 0;\n}\n\nsw-icon {\n    display: flex;\n    cursor: pointer;\n    z-index: 999;\n    color: rgba(255, 255, 255, 0.48);\n    position: relative;\n    height: 16px;\n    width: 16px;\n}\n\n@media (max-width: 768px) {\n    sw-icon {\n        height: 32px;\n        width: 32px;\n    }\n}\n\nsw-icon:hover {\n    color: white\n}\n\n.icon-container {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: end;\n    gap: 4px;\n}\n\n.outer-close {\n    position: absolute;\n    top: 0;\n    right: 0;\n    height: 32px;\n    width: 32px;\n}\n\n@media (max-width: 768px), (max-height: 500px) {\n    .outer-close {\n        display: none;\n    }\n}\n\n.arrow {\n    position: relative;\n    height: 32px;\n    width: 32px;\n}\n\n.heart {\n    background-color: rgba(0, 0, 0, 0.5);\n    border-radius: 50%;\n    padding: 4px;\n}\n\n.share {\n    background-color: rgba(0, 0, 0, 0.5);\n    border-radius: 50%;\n    padding: 4px;\n}\n\n.router-back {\n    position: absolute;\n    right: 1%;\n    top: 1%;\n    height: 32px;\n    width: 32px;\n\n    @media (max-width: 768px), (max-height: 500px) {\n        display: none;\n    }\n}\n";
class Shortsworks extends HTMLElement {
  constructor() {
    super(...arguments);
    this.document = this.attachShadow({
      mode: "closed"
    });
    this.widgetId = uuidV4();
    this.components = [];
    this.hasContents = false;
    this.properties = this.attributes;
    // service Helper
    this.key = this.getAttribute("key");
  }
  // apiHelper = new APIHelper()
  setData(contents) {
    if (!hasArray(contents)) return console.warn("contents data is empty");
    console.warn(contents);
    this.stories = contents;
    this.storyStore = new StoryStore(this);
    this.hasContents = true;
  }
  async connectedCallback() {
    const widget = document.createElement("div");
    this.document.appendChild(widget);
    this.widget = widget;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    this.document.appendChild(styleSheet);
    this.render();
    if (this.getAttribute("settings") === null) return;
    const settings = JSON.parse(this.getAttribute("settings"));
    // 묶어서 적용
    this.setAttribute("shape", settings.widgetShape);
    this.setAttribute("border-start-color", settings.widgetStartColor);
    this.setAttribute("border-end-color", settings.widgetEndColor);
    this.setAttribute("size", settings.widgetSize);
    this.render();
    // fetch data
    // if(this.getAttribute("key") === null) return
    // let data = await getContentsWithAccessToken(this.getAttribute("key"))
    // this.setData(data)
    // this.render()
  }
  render() {
    const visible = this.getAttribute("visible");
    const skeleton = this.getAttribute("skeleton");
    // if(this.widget === undefined || this.widget === null) this.widget = this.DOM.querySelector("#widget")
    if (!this.hasContents && skeleton) this.widget.innerHTML = `<sw-skeleton></sw-skeleton>`;
    if (!this.hasContents) return;
    switch (visible) {
      case "widget":
        this.style.pointerEvents = "none";
        return this.widget.innerHTML = `<sw-ui></sw-ui>`;
      case "viewer":
        return this.widget.innerHTML = `<sw-layer hidden></sw-layer>`;
      case null:
        return this.widget.innerHTML = `
                    <sw-ui></sw-ui>
                    <sw-layer hidden></sw-layer>
                `;
    }
  }
  show() {
    this.widget.querySelector("sw-layer").removeAttribute("hidden");
    this.storyStore.setById(this.stories[0].id);
  }
}

var fontsList = "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@700&family=Nanum+Myeongjo&family=Do+Hyeon&family=Nanum+Pen+Script&display=swap');\n\n@font-face {\n    font-family: 'BMEULJIROTTF';\n    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/BMEULJIRO.woff') format('woff');\n    font-weight: normal;\n    font-style: normal;\n}\n\n@font-face {\n    font-family: 'BMJUA';\n    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff');\n    font-weight: normal;\n    font-style: normal;\n}\n\n@font-face {\n    font-family: 'BMKIRANGHAERANG';\n    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMKIRANGHAERANG.woff') format('woff');\n    font-weight: normal;\n    font-style: normal;\n}\n\n@font-face {\n    font-family: \"BMYEONSUNG\";\n    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMYEONSUNG.woff') format('woff');\n    font-weight: normal;\n    font-style: normal;\n}\n\n@font-face {\n    font-family: 'BMHANNAPro';\n    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_seven@1.0/BMHANNAPro.woff') format('woff');\n    font-weight: normal;\n    font-style: normal;\n}";

function initFonts() {
    const fontsStyle = document.createElement("style");
    fontsStyle.textContent = fontsList;
    document.head.appendChild(fontsStyle);
}

function userInit() {
    const user = localStorage.getItem("sw-user");
    const temporaryUserID = uuidV4();
    if (user === null) {
        localStorage.setItem("sw-user", temporaryUserID);
    }
}

initFonts();
userInit();
customElements.define("shorts-works", Shortsworks);
