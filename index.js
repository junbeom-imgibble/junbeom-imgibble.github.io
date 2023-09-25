class StoryStore {
    constructor(element) {
        this.getStoryById = (selectedStoryId) => this.stories.find(story => story.id === selectedStoryId);
        this.setStoryById = (selectedStoryId) => {
            this.currentStory = this.getStoryById(selectedStoryId);
            this.render();
        };
        this.getIndex = () => this.stories.map(story => story.id).indexOf(this.currentStory.id);
        this.getIndexById = (storyId) => this.stories.map(story => story.id).indexOf(storyId);
        this.goNext = () => (this.getIndex() !== this.stories.length - 1) && this.setStoryById(this.stories[this.getIndex() + 1].id);
        this.goPrev = () => (this.getIndex() !== 0) && this.setStoryById(this.stories[this.getIndex() - 1].id);
        this.render = () => {
            this.DOM.querySelector("sw-slider").slide("selected");
            this.DOM.querySelectorAll("sw-view")
                .forEach((element) => element.story.id === this.currentStory.id
                ? element.feedStore.active(true)
                : element.feedStore.active(false));
        };
        this.element = element;
        this.DOM = element.DOM;
        this.stories = element.stories;
    }
}

var init = "* {\n    user-select: none;\n    -moz-user-select: none;\n    scrollbar-width: none;\n    -webkit-user-drag: none;\n    font-size: 14px;\n}   \n\n*::-webkit-scrollbar {\n    display: none;\n}";

var icon = ".icon {\n    display: flex;\n    cursor: pointer;\n    z-index: 1;\n    color: rgba(255, 255, 255, 0.48);\n    position: relative;\n    height: 16px;\n    width: 16px;\n\n}\n\n@media (max-width: 768px) {\n    .icon {\n        height: 32px;\n        width: 32px;\n    }\n}\n\n.icon:hover {\n    color: white\n}\n\n.icon-container {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: end;\n    gap: 4px;\n}\n\n.outer-close {\n    position: absolute;\n    top: 0;\n    right: 0;\n    height: 32px;\n    width: 32px;\n}\n\n@media (max-width: 768px) {\n    .outer-close {\n        display: none;\n    }\n}\n\n.arrow {\n    position: relative;\n    height: 32px;\n    width: 32px;\n}\n\n.heart {\n    background-color: rgba(0, 0, 0, 0.5);\n    border-radius: 50%;\n    padding: 4px;\n}\n\n.share {\n    background-color: rgba(0, 0, 0, 0.5);\n    border-radius: 50%;\n    padding: 4px;\n}";

var layer = ".layer {\n    position: fixed;\n    height: 100vh;\n    width: 100vw;\n    z-index: 999;\n    top: 0;\n    left: 0;\n    background-color: rgb(0,0,0,0.5);\n    box-sizing: border-box;\n}\n\n.slider {\n    position: absolute;\n    top: 0;\n    left: 0;\n\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n\n    display: flex;\n    align-items: center;\n    justify-content: center;\n\n    container-name: slider;\n    container-type: inline-size;\n}";

var storyContainer = ".story-container {\n    display: flex;\n    flex-direction: row;\n    justify-content: start;\n    gap: 20px;\n\n    max-width: 100vw;\n    overflow: scroll;\n\n    padding: 24px;\n}";

var story = ".story {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    cursor: pointer;\n    gap: 8px;\n}\n\n.story-icon {    \n    position: relative;\n    width: 100px;\n\n    display: flex;\n    justify-content: center;\n\n    padding: 0.25rem;\n\n    border-radius: 50%;\n    border: 0.25rem solid transparent;\n    background-image: linear-gradient(white, white), linear-gradient(0deg,  #EC702B, #BC3BE9);\n    background-origin: border-box;\n    background-clip: padding-box, border-box;\n}\n\n.story-image {\n    width: 100%;\n    aspect-ratio: 1/1;\n    border-radius: 50%;\n    object-fit: cover;\n}\n\n.story-label {\n    /*position*/\n\n    position: absolute;\n    bottom: -8px;\n    /*color*/\n    background: linear-gradient(0deg, #EC702B, #BC3BE9);\n    color: #FFFF;\n    /*size*/\n    border: 0.2rem solid #FFFF;\n    border-radius: 0.25rem;\n    padding: 0.2rem;\n}\n\n.story-title {\n    color: black;\n}";

var shorts = ".shorts {\n    width: 140px;\n    aspect-ratio: 9/16;\n    overflow: hidden;\n    cursor: pointer;\n    border-radius: 12px;\n    position: relative;\n    box-sizing: border-box;\n}\n\n.shorts:hover {\n    background-color: #000000;\n}\n\n.shorts-image, .shorts-preview {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    left: 0;\n    top: 0;\n    object-fit: cover;\n}\n\n.shorts:hover .shorts-image {\n    display: none;\n}\n\n@keyframes fade { from {opacity: 0} to {opacity: 1} }\n.shorts-preview {\n    animation: fade 0.5s;\n    animation-fill-mode: forwards;\n}";

var embed = ".embed {\n    position: relative;\n    width: 400px;\n    aspect-ratio: 9/16;\n}\n\n.embed:hover .embed-thumbnail {\n    display: none;\n}\n\n.embed-thumbnail {\n    width: 100%;\n    height: 100%;\n    z-index: 1;\n    position: absolute;\n    object-fit: cover;\n    border-radius: 4px;\n}";

var viewContainer = ".view-container {\n    /* position */\n    position: relative;\n    left: 0;\n\n    /* layout */\n    display: flex;\n    flex-direction: row;\n    gap: 160px;\n\n    /* size */\n    width: 200px;\n    aspect-ratio: 9/16;\n}\n\n@container slider (max-width: 768px) {\n    .view-container {\n        aspect-ratio: 1/1;\n        width: 100%;\n        height: 100%;\n        gap: 0;\n    }\n}";

var view = ".view {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n\n    position: relative;\n    width: 100%;\n    height: 100%;\n\n\n    background-color: black;\n    border-radius: 6px;\n\n    cursor: pointer;\n    transition: transform 0.4s;\n}\n\n.view-inner {\n    position: relative;\n    height: 100%;\n    width: 100%;\n    border-radius: 6px;\n    overflow: hidden;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.view-thumbnail {\n    position: absolute;\n    height: 100%;\n    width: 100%;\n\n    z-index: 99;\n    border-radius: 6px;\n    box-sizing: border-box;\n    object-fit: cover;\n    opacity: 0.1;\n}";

var canvas = ".canvas {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n}\n\n.feed-element {\n    position: absolute;\n    overflow: hidden;\n}\n\n.content {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    object-fit: fill;\n}";

var Interface = ".interface {\n    position: absolute;\n    width: inherit;\n    height: inherit;\n\n    display: flex;\n    flex-direction: column;\n\n    padding-inline: 4%;\n    padding-block: 8%;\n    box-sizing: border-box;\n}\n\n.interface-top {\n    top: 4%;\n    justify-content: space-between;\n    align-items: center;\n    display: flex;\n    position: relative;\n    flex-direction: row;\n}\n\n.interface-bottom {\n    margin-top: auto;\n    position: relative;\n    bottom: 4%;\n    display: flex;\n    align-self: flex-end;\n    justify-self: center;\n    flex-direction: column;\n    gap: 20%;\n}\n\n.interface-title {\n    position: absolute;\n    color: white;\n    font-weight: 700;\n    font-size: 12px;\n    left: 16%;\n}\n\n@media (max-width: 500px) {\n    .interface-title {\n        font-size: 24px;\n    }\n}";

var timeline = ".timeline {\n    width: 100%;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    gap: 2px;\n    box-sizing: border-box;\n    padding-inline: 2px;\n    position: relative;\n}\n\n.progress {\n    border-radius: 1px;\n    height: 2px;\n    width: 100%;\n    background-color: rgba(255, 255, 255, 0.48);\n    overflow: hidden;\n}\n\n.gauge {\n    border-radius: 1px;\n    height: 100%;\n    width: 0;\n    background-color: #FFFFFF;\n}";

var controller = ".controller {\n    position: absolute;\n    width: 144%;\n    height: 0;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    align-items: center;\n}\n\n@container slider (max-width: 768px) {\n    .controller {\n        visibility: hidden\n    }\n}";

const css = init
    + icon
    + layer
    + storyContainer
    + story
    + shorts
    + embed
    + viewContainer
    + view
    + canvas
    + Interface
    + timeline
    + controller;

// WIDGET
function getDOM(element) {
    return element.getRootNode();
}
function getProperties(element) {
    const properties = element.getRootNode().host.properties;
    return function (name) {
        return properties[name]?.value;
    };
}
// STORE
function getStoryStore(element) {
    return element.getRootNode().host.storyStore;
}
function getReadStories(element) {
    return getDOM(element).querySelector("sw-story-container").readStories;
}
function getFeedStore(element) {
    return (element.closest("sw-view") || element.closest("sw-shorts")).feedStore;
}
// ELSE
function toggleLayerOpen(element) {
    return getDOM(element).querySelector("sw-layer").toggleAttribute("hidden");
}
const setVideo = (element) => (state) => {
    const player = element.closest("sw-view").querySelector("sw-canvas").firstElementChild;
    player.tagName === "VIDEO" && player[state]();
};

function setStoryIcon(element) {
    const icon = element.querySelector(".story-icon");
    const label = element.querySelector(".story-label");
    const image = element.querySelector(".story-image");
    const getAttribute = getProperties(element);
    const size = getAttribute("size") || "100";
    const radius = getAttribute("radius") || "50%";
    const topColor = getAttribute("topColor") || "#BC3BE9";
    const bottomColor = getAttribute("bottomColor") || "#EC702B";
    if (size === "small")
        icon.style.width = 68 + "px";
    if (size === "basic")
        icon.style.width = 90 + "px";
    if (size === "large")
        icon.style.width = 110 + "px";
    if (radius !== null) {
        icon.style.borderRadius = radius + "%";
        image.style.borderRadius = radius + "%";
    }
    icon.style.backgroundImage = `linear-gradient(white, white), linear-gradient(0deg, ${bottomColor}, ${topColor})`;
    if (label !== null)
        label.style.background = `linear-gradient(0deg, ${bottomColor}, ${topColor})`;
}

function setStoryContainer(element) {
    // set min-width
    // const frame = getProperties(element)("frame") || 0
    // if(frame <= 400) {
    //     element.style.width = "300px"
    // } else {
    //     element.style.width = frame + "px"
    // }
    element.style.width = (getProperties(element)("frame") || 800) + "px";
    element.style.gap = (getProperties(element)("gap") || 20) + "px";
    element.style.padding = (getProperties(element)("padding") || 20) + "px";
}

customElements.define("sw-story", class extends HTMLElement {
    constructor() {
        super(...arguments);
        this.story = getStoryStore(this).getStoryById(this.getAttribute("story-id"));
    }
    connectedCallback() {
        this.classList.add("story");
        this.innerHTML = `<div class="story-icon"><img class="story-image" src="${this.story.thumbnail}" alt=""/></div>`;
        if (this.story.label !== undefined)
            this.querySelector(".story-icon").insertAdjacentHTML("beforeend", `<div class="story-label">${this.story.label}</div>`);
        if (this.story.name !== undefined)
            this.insertAdjacentHTML("beforeend", `<div class="story-title">${this.story.name}</div>`);
        this.onclick = () => {
            toggleLayerOpen(this);
            getStoryStore(this).setStoryById(this.story.id);
            getReadStories(this).addReadStory(this.story.id);
        };
    }
});

customElements.define("sw-feed-element", class extends HTMLElement {
    constructor() {
        super(...arguments);
        this.properties = ["left", "top", "width", "height"];
        this.rotate = this.getAttribute("rotate");
        this.src = this.getAttribute("src");
        this.type = this.getAttribute("type");
    }
    connectedCallback() {
        this.classList.add("feed-element");
        this.properties.map(property => this.style[property] = this.getAttribute(property) + "%");
        this.style.rotate = this.rotate + "deg";
        if (this.type === "IMAGE")
            this.innerHTML = `<img alt="" class="content" src="${this.src}"/>`;
        if (this.type === "VIDEO")
            this.innerHTML = `<video class="content" src="${this.src}" autoplay loop muted/>`;
    }
});

customElements.define("sw-canvas", class extends HTMLElement {
    connectedCallback() {
        this.classList.add("canvas");
    }
    static get observedAttributes() {
        return ["current-feed-id"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "current-feed-id") {
            const { type, content, position: { width, height, position_x, position_y, rotate } } = getFeedStore(this).currentFeed;
            this.innerHTML = `<sw-feed-element type=${type} src=${content} width=${width} height=${height} left=${position_x} top=${position_y} rotate=${rotate}></sw-feed-element>`;
            const feedElements = getFeedStore(this).currentFeed.elements;
            if (feedElements !== undefined)
                this.innerHTML += feedElements.map(element => {
                    const { width, height, position_x, position_y, rotation_angle, sticker } = element;
                    return `<sw-feed-element type="IMAGE" src=${sticker} width=${width} height=${height} left=${position_x} top=${position_y} rotate=${rotation_angle}></sw-feed-element>`;
                }).join("");
        }
    }
});

const observeFeedElements = ["sw-canvas", "sw-screen", "sw-timeline", "sw-progress", "sw-interface-top"];
class FeedStore {
    constructor(element) {
        this.getFeedById = (selctedFeedId) => this.feeds.find(feed => feed.id === selctedFeedId);
        this.setFeed = (selectedFeed) => {
            this.currentFeed = selectedFeed;
            this.render();
        };
        this.getIndex = () => this.feeds.indexOf(this.currentFeed);
        this.goNext = () => {
            if (this.getIndex() !== this.feeds.length - 1) {
                this.setFeed(this.feeds[this.getIndex() + 1]);
            }
            else
                getStoryStore(this.element).goNext();
        };
        this.goPrev = () => {
            // if(Progress.current() > 50)  this.setFeed(this.feeds[this.getIndex()])
            if (this.getIndex() !== 0)
                this.setFeed(this.feeds[this.getIndex() - 1]);
            else
                getStoryStore(this.element).goPrev();
        };
        this.active = (show) => {
            Array.from(Array(this.element.childElementCount).keys())
                .forEach(index => (this.element.children.item(index).style.display = show ? "flex" : "none"));
            const thumbnail = this.element.querySelector(".view-thumbnail");
            thumbnail.style.display = show ? "none" : "flex";
            show && this.render();
        };
        this.render = () => {
            observeFeedElements.map(name => this.element.querySelectorAll(name).forEach(element => element.setAttribute("current-feed-id", this.currentFeed.id)));
        };
        this.element = element;
        this.feeds = this.element.story.feeds;
        this.currentFeed = this.feeds[0];
    }
}

customElements.define("sw-shorts", class extends HTMLElement {
    constructor() {
        super(...arguments);
        this.story = getStoryStore(this).getStoryById(this.getAttribute("story-id"));
        this.feedStore = new FeedStore(this);
        this.feedIndex = 0;
        this.isHover = false;
        this.showPreview = () => {
            this.preview.innerHTML = `
            <sw-canvas class="shorts-preview"></sw-canvas>
        `;
            this.feedStore.setFeed(this.feedStore.feeds[this.feedIndex]);
            this.feedIndex = this.feedIndex !== this.feedStore.feeds.length - 1 ? this.feedIndex + 1 : 0;
        };
    }
    connectedCallback() {
        this.classList.add("shorts");
        this.innerHTML = `
            <img class="shorts-image" src="${this.story.thumbnail}" alt=""/>
            <div class="preview-container"/>
        `;
        this.preview = this.querySelector(".preview-container");
        this.onmouseenter = () => {
            if (!this.isHover) {
                this.isHover = !this.isHover;
                this.showPreview();
                this.conversion = setInterval(this.showPreview, 2000);
            }
        };
        this.onmouseleave = () => {
            if (this.isHover) {
                this.isHover = !this.isHover;
                this.preview.innerHTML = "";
                clearInterval(this.conversion);
            }
        };
        this.onclick = () => {
            toggleLayerOpen(this);
            getStoryStore(this).setStoryById(this.story.id);
        };
    }
});

// 타이머와 progress 분리 필요
class Progresser {
    constructor() {
        this.setProgress = () => {
            this.element.currentTime += 1;
            const rate = this.current();
            this.gauge.style.width = rate + "%";
            if (rate >= 100) {
                this.clear();
                getFeedStore(this.element).goNext();
            }
        };
        this.start = (element) => {
            clearInterval(this.timer);
            this.element = element;
            this.gauge = element.querySelector(".gauge");
            this.timer = setInterval(this.setProgress, 10);
        };
        this.play = () => {
            this.timer = setInterval(this.setProgress, 10);
            setVideo(this.element)("play");
        };
        this.pause = () => {
            clearInterval(this.timer);
            setVideo(this.element)("pause");
        };
        this.clear = () => this.element.currentTime = 0;
        this.current = () => this.element.currentTime / this.element.duration;
    }
}
var progress = new Progresser();

customElements.define("sw-progress", class extends HTMLElement {
    constructor() {
        super(...arguments);
        this.currentTime = 0;
        this.duration = Number(this.getAttribute("duration"));
        this.feedId = this.getAttribute("feed-id");
    }
    connectedCallback() {
        this.classList.add("progress");
        this.innerHTML = "<div class='gauge'/>";
        this.gauge = this.querySelector(".gauge");
    }
    setFullGauge() {
        this.gauge.style.width = "100%";
    }
    setEmptyGauge() {
        this.gauge.style.width = "0%";
    }
    resetCurrentTime() {
        this.currentTime = 0;
    }
    static get observedAttributes() {
        return ["current-feed-id"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "current-feed-id" && this.feedId === oldValue)
            this.resetCurrentTime();
        if (name === "current-feed-id" && this.feedId === newValue)
            progress.start(this);
    }
});

customElements.define("sw-timeline", class extends HTMLElement {
    constructor() {
        super(...arguments);
        this.feeds = getFeedStore(this).feeds;
    }
    connectedCallback() {
        this.classList.add("timeline");
        // const totalTime = this.feeds.map(feed => feed.duration).reduce((acc, curr) => acc + curr, 0)
        this.innerHTML = this.feeds.map(feed => `<sw-progress feed-id=${feed.id} duration=${feed.duration}></sw-progress>`).join("");
    }
    static get observedAttributes() {
        return ["current-feed-id"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "current-feed-id") {
            const progresses = this.querySelectorAll("sw-progress");
            progresses.forEach(element => element.setEmptyGauge());
            const currentIndex = this.feeds.map(feed => feed.id).indexOf(newValue);
            Array.from(Array(currentIndex).keys()).forEach(index => progresses.item(index).setFullGauge());
        }
    }
});

const close = `<path d="M19.625 17.9315C20.075 18.4299 20.075 19.1776 19.625 19.6262C19.125 20.1246 18.375 20.1246 17.925 19.6262L12.025 13.6947L6.075 19.6262C5.575 20.1246 4.825 20.1246 4.375 19.6262C3.875 19.1776 3.875 18.4299 4.375 17.9315L10.325 12L4.375 6.06854C3.875 5.57009 3.875 4.82243 4.375 4.37383C4.825 3.87539 5.575 3.87539 6.025 4.37383L12.025 10.3551L17.975 4.42368C18.425 3.92523 19.175 3.92523 19.625 4.42368C20.125 4.87227 20.125 5.61994 19.625 6.11838L13.675 12L19.625 17.9315Z"/>`;
const left = `<path d="M13.8594 18.4621L8.27344 12.5246C8.11719 12.3293 8 12.0949 8 11.8605C8 11.6652 8.11719 11.4309 8.27344 11.2355L13.8594 5.29804C14.2109 4.90742 14.7969 4.90742 15.1875 5.25898C15.5781 5.61054 15.5781 6.19648 15.2266 6.58711L10.1875 11.8996L15.2266 17.173C15.5781 17.5637 15.5781 18.1496 15.1875 18.5012C14.7969 18.8527 14.2109 18.8527 13.8594 18.4621Z"/>`;
const right = `<path d="M9.62617 5.29804L15.2121 11.2355C15.3684 11.4309 15.4855 11.6652 15.4855 11.8605C15.4855 12.0949 15.3684 12.3293 15.2121 12.5246L9.62617 18.4621C9.27461 18.8527 8.68867 18.8527 8.29804 18.5012C7.90742 18.1496 7.90742 17.5637 8.25898 17.173L13.259 11.8605L8.25898 6.58711C7.90742 6.19648 7.90742 5.61054 8.29804 5.25898C8.68867 4.90742 9.27461 4.90742 9.62617 5.29804Z"/>`;
const heart = `<path d="M11.5312 5.60624L11.9609 6.07499L12.4297 5.6453C13.7188 4.35624 15.5547 3.7703 17.3125 4.0828C20.0078 4.51249 22 6.85624 22 9.59061V9.78592C22 11.4265 21.2969 12.989 20.125 14.0828L13.0547 20.6844C12.7812 20.9578 12.3906 21.075 12 21.075C11.5703 21.075 11.1797 20.9578 10.9062 20.6844L3.83594 14.0828C2.66406 12.989 2 11.4265 2 9.78592V9.59061C2 6.85624 3.95312 4.51249 6.64844 4.0828C8.40625 3.7703 10.2422 4.35624 11.5312 5.60624C11.5312 5.6453 11.4922 5.60624 11.5312 5.60624ZM11.9609 8.73124L10.2031 6.93436C9.34375 6.11405 8.13281 5.72342 6.96094 5.91874C5.16406 6.23124 3.875 7.75467 3.875 9.59061V9.78592C3.875 10.9187 4.30469 11.9734 5.125 12.7156L12 19.1219L18.8359 12.7156C19.6562 11.9734 20.125 10.9187 20.125 9.78592V9.59061C20.125 7.75467 18.7969 6.23124 17 5.91874C15.8281 5.72342 14.6172 6.11405 13.7578 6.93436L11.9609 8.73124Z"/>`;
const share = `<path d="M21 6.28571C21 8.65179 19.0804 10.5714 16.7143 10.5714C15.4196 10.5714 14.2589 10.0357 13.4554 9.09821L9.4375 11.1071C9.52679 11.4196 9.52679 11.7321 9.52679 12C9.52679 12.3125 9.52679 12.625 9.4375 12.9375L13.4554 14.9018C14.2589 14.0089 15.4196 13.4286 16.7143 13.4286C19.0804 13.4286 21 15.3482 21 17.7143C21 20.0804 19.0804 22 16.7143 22C14.3036 22 12.4286 20.0804 12.4286 17.7143C12.4286 17.4464 12.4286 17.1339 12.5179 16.8214L8.5 14.8125C7.69643 15.75 6.53571 16.2857 5.28571 16.2857C2.875 16.2857 1 14.3661 1 12C1 9.63393 2.875 7.71429 5.28571 7.71429C6.53571 7.71429 7.69643 8.29464 8.5 9.1875L12.5179 7.22321C12.4286 6.91071 12.4286 6.59821 12.4286 6.28571C12.4286 3.91964 14.3036 2 16.7143 2C19.0804 2 21 3.91964 21 6.28571ZM5.24107 14.1429C6.44643 14.1429 7.38393 13.2054 7.38393 12C7.38393 10.8393 6.44643 9.85714 5.24107 9.85714C4.08036 9.85714 3.09821 10.8393 3.09821 12C3.09821 13.2054 4.08036 14.1429 5.24107 14.1429ZM16.7143 4.14286C15.5089 4.14286 14.5714 5.125 14.5714 6.28571C14.5714 7.49107 15.5089 8.42857 16.7143 8.42857C17.875 8.42857 18.8571 7.49107 18.8571 6.28571C18.8571 5.125 17.875 4.14286 16.7143 4.14286ZM16.7143 19.8571C17.875 19.8571 18.8571 18.9196 18.8571 17.7143C18.8571 16.5536 17.875 15.5714 16.7143 15.5714C15.5089 15.5714 14.5714 16.5536 14.5714 17.7143C14.5714 18.9196 15.5089 19.8571 16.7143 19.8571Z"/>`;
const elipsis = `<path d="M12.458 18.2814C13.5583 18.2814 14.4893 19.2124 14.4893 20.3127C14.4893 21.4552 13.5583 22.3439 12.458 22.3439C11.3154 22.3439 10.4268 21.4552 10.4268 20.3127C10.4268 19.2124 11.3154 18.2814 12.458 18.2814ZM12.458 11.5106C13.5583 11.5106 14.4893 12.4416 14.4893 13.5418C14.4893 14.6844 13.5583 15.5731 12.458 15.5731C11.3154 15.5731 10.4268 14.6844 10.4268 13.5418C10.4268 12.4416 11.3154 11.5106 12.458 11.5106ZM12.458 8.80225C11.3154 8.80225 10.4268 7.91357 10.4268 6.771C10.4268 5.67074 11.3154 4.73975 12.458 4.73975C13.5583 4.73975 14.4893 5.67074 14.4893 6.771C14.4893 7.91357 13.5583 8.80225 12.458 8.80225Z"/>`;
const back = `<path d="M23.8337 12.9776C23.8337 13.6091 23.3627 14.1053 22.8061 14.1053H5.72076L11.4154 19.789C11.8435 20.1949 11.8435 20.9167 11.4582 21.3227C11.0728 21.7737 10.4306 21.7737 10.0024 21.3678L2.46671 13.7896C2.25263 13.564 2.16699 13.2934 2.16699 12.9776C2.16699 12.707 2.25263 12.4363 2.46671 12.2108L10.0024 4.63256C10.4306 4.22659 11.0728 4.22659 11.4582 4.67767C11.8435 5.08365 11.8435 5.80538 11.4154 6.21135L5.72076 11.895H22.8061C23.4055 11.895 23.8337 12.3912 23.8337 12.9776Z"/>`;

// 피그마 아이콘 확인 후 viewBox가 같을 경우 통일하여 생략
customElements.define("sw-icon", class extends HTMLElement {
    connectedCallback() {
        this.classList.add("icon");
        const icon = this.getAttribute("icon");
        this.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor"/>`;
        const container = this.querySelector("svg");
        switch (icon) {
            case "outer-close":
                this.classList.add("outer-close");
                container.innerHTML = close;
                this.onclick = () => toggleLayerOpen(this);
                break;
            case "back":
                this.classList.add("back");
                container.innerHTML = back;
                this.onclick = () => toggleLayerOpen(this);
                break;
            case "left":
                this.classList.add("arrow");
                container.innerHTML = left;
                this.onclick = () => getFeedStore(this).goPrev();
                break;
            case "right":
                this.classList.add("arrow");
                container.innerHTML = right;
                this.onclick = () => getFeedStore(this).goNext();
                break;
            case "heart":
                this.classList.add("heart");
                container.innerHTML = heart;
                break;
            case "share":
                this.classList.add("share");
                container.innerHTML = share;
                break;
            case "elipsis":
                this.classList.add("elipsis");
                container.innerHTML = elipsis;
                break;
            case "play":
                this.classList.add("play");
                break;
            case "pause":
                this.classList.add("pause");
                break;
        }
    }
});

customElements.define("sw-interface-top", class extends HTMLElement {
    connectedCallback() {
        this.classList.add("interface-top");
        this.innerHTML = `
            <sw-icon icon="back"></sw-icon>
            <div class="interface-title"></div>
            <sw-icon icon="elipsis"></sw-icon>
        `;
    }
    static get observedAttributes() {
        return ["current-feed-id"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        const titleBar = this.querySelector(".interface-title");
        const title = getFeedStore(this).currentFeed.name;
        if (title !== undefined)
            titleBar.textContent = title;
    }
});

customElements.define("sw-interface-bottom", class extends HTMLElement {
    connectedCallback() {
        this.classList.add("interface-bottom");
        this.innerHTML = `
            <sw-icon icon="share"></sw-icon>
            <sw-icon icon="heart"></sw-icon>
        `;
    }
});

customElements.define("sw-interface", class extends HTMLElement {
    connectedCallback() {
        this.classList.add("interface");
        this.innerHTML = `
            <sw-timeline></sw-timeline>
            <sw-interface-top></sw-interface-top>
            <sw-interface-bottom></sw-interface-bottom>
        `;
        this.onmousedown = (event) => {
            progress.pause();
            this.amount = event.offsetX;
        };
        this.ontouchstart = (event) => {
            progress.pause();
            this.amount = event.touches[0].clientX;
        };
        this.onmouseup = (event) => {
            progress.play();
            this.amount -= event.offsetX;
            const touchPosition = event.offsetX / event.currentTarget.offsetWidth;
            Math.abs(this.amount) <= 10
                ? getTouchPosition(touchPosition) === "RIGHT" ? getFeedStore(this).goNext() : getFeedStore(this).goPrev()
                : getDirection(this.amount) === "RIGHT" ? getStoryStore(this).goNext() : getStoryStore(this).goPrev();
        };
        this.ontouchend = (event) => {
            progress.play();
            this.amount -= event.changedTouches[0].clientX;
            const touchPosition = event.changedTouches[0].clientX / event.currentTarget.offsetWidth;
            Math.abs(this.amount) <= 10
                ? getTouchPosition(touchPosition) === "RIGHT" ? getFeedStore(this).goNext() : getFeedStore(this).goPrev()
                : getDirection(this.amount) === "RIGHT" ? getStoryStore(this).goNext() : getStoryStore(this).goPrev();
        };
    }
});
function getDirection(movedPoint) {
    return movedPoint > 0 ? "RIGHT" : "LEFT";
}
function getTouchPosition(position) {
    return (position <= 0.25 && "LEFT") || (position >= 0.75 && "RIGHT") || "CENTER";
}

// 첫번째와 마지막 뷰 버튼 숨김 처리 필요
customElements.define("sw-controller", class extends HTMLElement {
    connectedCallback() {
        this.classList.add("controller");
        this.innerHTML = `
            <sw-icon icon="left"></sw-icon>
            <sw-icon icon="right"></sw-icon>
        `;
    }
});

customElements.define("sw-view", class extends HTMLElement {
    constructor() {
        super(...arguments);
        this.story = getStoryStore(this).getStoryById(this.getAttribute("story-id"));
        this.feedStore = new FeedStore(this);
    }
    connectedCallback() {
        this.classList.add("view");
        this.innerHTML = `           
            <div class="view-inner">
                <sw-canvas></sw-canvas>
                <sw-interface></sw-interface>
            </div>
            <sw-controller></sw-controller>
        `;
        this.insertAdjacentHTML("afterbegin", `<img alt="view-thumbnail" class="view-thumbnail" src="${this.story.thumbnail}"/>`);
        const thumbnail = this.querySelector(".view-thumbnail");
        thumbnail.onclick = () => getStoryStore(this).setStoryById(this.story.id);
    }
});

customElements.define("sw-view-container", class extends HTMLElement {
    connectedCallback() {
        this.classList.add("view-container");
        this.innerHTML =
            getStoryStore(this).stories.map((story) => `<sw-view story-id=${story.id}></sw-view>`).join("");
    }
});

const MOBILE_SIZE = 768;

class ResizeDetector {
    constructor() {
        this.isMobile = window.innerWidth <= MOBILE_SIZE;
        this.callbacks = [];
        this.whenResize = callback => this.callbacks.push(callback);
        window.onresize = () => {
            if (window.innerWidth <= MOBILE_SIZE) {
                this.isMobile = true;
                this.callbacks.forEach(callback => callback());
            }
            if (!(window.innerWidth <= MOBILE_SIZE) && this.isMobile) {
                this.isMobile = false;
                this.callbacks.forEach(callback => callback());
            }
        };
    }
}
var ResizeDetector$1 = new ResizeDetector();

customElements.define("sw-slider", class extends HTMLElement {
    connectedCallback() {
        this.classList.add("slider");
        this.innerHTML = `<sw-view-container></sw-view-container>`;
        ResizeDetector$1.whenResize(() => this.slide("resize"));
    }
    slide(when) {
        // if(this.closest("sw-layer").getAttribute("hidden") === "") return
        const currentIndex = getStoryStore(this).getIndex();
        const viewContainer = this.querySelector("sw-view-container");
        const views = this.querySelectorAll("sw-view");
        viewContainer.style.transitionProperty = "left";
        if (when === "selected")
            viewContainer.style.transitionDuration = "0.4s";
        if (when === "resize")
            viewContainer.style.transitionDuration = "0s";
        if (views.length !== 1) {
            const gap = views[1].offsetLeft - views[0].offsetLeft;
            viewContainer.style.left = -(gap * currentIndex) + "px";
        }
        if (this.offsetWidth > MOBILE_SIZE) {
            views.forEach((view) => {
                const indexGap = Math.abs(currentIndex - getStoryStore(this).getIndexById(view.story.id)) + 1;
                const scaleRate = 1.4 - (indexGap / 8);
                view.style.transform = `scale(${scaleRate})`;
            });
        }
        else
            views.forEach((view) => view.style.transform = "scale(1)");
    }
});

customElements.define("sw-embed", class extends HTMLElement {
    constructor() {
        super(...arguments);
        this.story = getStoryStore(this).getStoryById(this.getAttribute("story-id"));
    }
    connectedCallback() {
        this.classList.add("embed");
        this.innerHTML = `
            <img alt="thumbnail" src="${this.story.thumbnail}" class="embed-thumbnail"/>
            <sw-slider></sw-slider>
        `;
        let isHover = false;
        const { currentStory, setStoryById } = getStoryStore(this);
        this.onmouseenter = () => {
            if (!isHover) {
                isHover = !isHover;
                if (currentStory === undefined)
                    setStoryById(this.story.id);
                else
                    setStoryById(currentStory.id);
            }
        };
        this.onmouseleave = () => isHover && (isHover = !isHover);
    }
});

class ReadStories {
    constructor(element) {
        this.addReadStory = (selectedStoryId) => {
            const readStoriesId = new Set(this.readStoriesId);
            readStoriesId.add(selectedStoryId);
            sessionStorage.setItem("readStories", JSON.stringify([...readStoriesId]));
            this.render(selectedStoryId);
        };
        this.checkReadStories = () => this.readStoriesId.map(readStoryId => this.render(readStoryId));
        this.element = element;
        this.readStoriesId = JSON.parse(sessionStorage.getItem("readStories")) || new Array;
    }
    render(selectedStoryId) {
        const currentStory = Array.from(this.element.querySelectorAll("sw-story")).find((storyElement) => storyElement.story.id === selectedStoryId);
        if (currentStory?.firstElementChild !== undefined)
            currentStory.firstElementChild.style.backgroundImage = "none";
    }
}

customElements.define("sw-story-container", class extends HTMLElement {
    constructor() {
        super(...arguments);
        this.readStories = new ReadStories(this);
    }
    connectedCallback() {
        this.classList.add("story-container");
        const type = getProperties(this)("type") || "group";
        const shape = getProperties(this)("shape") || "story";
        const stories = getStoryStore(this).stories;
        const shownStories = type === "group" ? stories : [stories[0]];
        if (shape === "story" || shape === "shorts") {
            this.innerHTML = shownStories.map(shownStory => `<sw-${shape} story-id=${shownStory.id}></sw-${shape}>`).join("");
        }
        if (shape === "embed") {
            this.innerHTML = `<sw-embed story-id=${stories[0].id}></sw-embed>`;
            getDOM(this).querySelector("sw-layer").remove();
        }
        this.readStories.checkReadStories();
    }
});

customElements.define("sw-layer", class extends HTMLElement {
    connectedCallback() {
        this.classList.add("layer");
        this.innerHTML = `
            <sw-icon icon="outer-close"></sw-icon>
            <sw-slider></sw-slider>
        `;
    }
});

function setIcon(element) {
    const getAttribute = getProperties(element);
    const size = getAttribute("size") || "200";
    if (size === "full") {
        element.style.height = "100vh";
        element.style.width = "100%";
    }
    if (size === "small")
        element.style.width = 120 + "px";
    if (size === "basic")
        element.style.width = 160 + "px";
    if (size === "large")
        element.style.width = 200 + "px";
    // else element.style.width = size + "px"
}

customElements.define("shorts-works", class extends HTMLElement {
    constructor() {
        super(...arguments);
        this.DOM = this.attachShadow({ mode: "closed" });
        this.properties = this.attributes;
    }
    getData(data) {
        this.stories = data;
        this.storyStore = new StoryStore(this);
    }
    render() {
        this.DOM.innerHTML = `
            <sw-story-container></sw-story-container>
            <sw-layer hidden></sw-layer>
        `;
        const styleSheet = document.createElement("style");
        styleSheet.textContent = css;
        this.DOM.appendChild(styleSheet);
    }
    customize() {
        setStoryContainer(this.DOM.querySelector("sw-story-container"));
        this.DOM.querySelectorAll("sw-story").forEach((element) => setStoryIcon(element));
        this.DOM.querySelectorAll("sw-shorts").forEach((element) => setIcon(element));
        this.DOM.querySelectorAll("sw-embed").forEach((element) => setIcon(element));
    }
});

var styles = "* {\n    pointer-events: auto;\n}\n\n/* 외부 CSS 먹히는 현상 발생 */\n.preview {\n    position: relative;\n    border: 2px dashed #C6CAD0 !important;\n    border-radius: 8px !important;\n    background-color: transparent !important;\n\n    width: fit-content;\n    height: fit-content;\n\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.plus {\n    position: absolute;\n}\n\n.attached {\n    border: 2px dashed #C6CAD0;\n    border-radius: 8px;\n    box-sizing: content-box;\n\n    width: fit-content;\n    height: fit-content;\n}\n\n.editor {\n    width: fit-content;\n    height: fit-content;\n}";

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;

const backendURL = "https://port-0-imgibble-dummy-db-54ouz2lllrv2ned.sel3.cloudtype.app";

const getStories = async () => {
    const response = await fetch(backendURL + "/publish");
    if (response.ok)
        return response.json();
};
const getAttributes = async () => {
    const response = await fetch(backendURL + "/design");
    if (response.ok)
        return response.json();
};
const getSetting = async () => {
    const response = await fetch(backendURL + "/settings");
    if (response.ok)
        return response.json();
};

const getData = async () => {
    const stories = await getStories();
    const attributes = await getAttributes();
    const setting = await getSetting();
    return { stories, attributes, setting };
};

const previewWidget = document.createElement("shorts-works");
getData().then(data => {
    previewWidget.getData(data.stories);
    previewWidget.render();
    previewWidget.customize();
    previewWidget.style.visibility = "hidden";
});
// 외부 CSS 먹히는 방지 필요
const preview = document.createElement("div");
preview.classList.add("preview");
preview.appendChild(previewWidget);
const plus = document.createElement("div");
plus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M28 15.9423C28 16.75 27.3654 17.3269 26.6154 17.3269H17.3846V26.5577C17.3846 27.3654 16.75 28 16 28C15.1923 28 14.6154 27.3654 14.6154 26.5577V17.3269H5.38462C4.57692 17.3269 4 16.75 4 16C4 15.1923 4.57692 14.5577 5.38462 14.5577H14.6154V5.32692C14.6154 4.57692 15.1923 4 16 4C16.75 4 17.3846 4.57692 17.3846 5.32692V14.5577H26.6154C27.3654 14.5577 28 15.1923 28 15.9423Z" fill="#C6CAD0"/>
</svg>`;
plus.classList.add("plus");
preview.appendChild(plus);
const editWidget = document.createElement("shorts-works");
getData().then(data => {
    editWidget.getData(data.stories);
    editWidget.render();
    editWidget.customize();
    editWidget.style.pointerEvents = "none";
});
const editor = document.createElement("div");
editor.classList.add("editor");
editor.insertAdjacentElement("afterbegin", editWidget);

const mode = {
    state: "preview"
};

// index
const sendMessage = (message) => window.parent.postMessage(message, "*");
const observeMessage = (observe) => callback => window.addEventListener("message", ({ data: { title, data } }) => title === observe && callback(data));
observeMessage("shape")(data => {
    const shape = data.shape;
    // editor.setAttribute("shape", shape)
    const innerWidget = editor.querySelector("shorts-works");
    innerWidget.setAttribute("shape", shape);
    innerWidget.render();
    const { left, bottom } = editor.getBoundingClientRect();
    sendMessage({ title: "attach", data: { left, top: bottom, state: true } });
});
observeMessage("size")(({ size }) => {
    // let newSize
    // if(size === "small") newSize = 68
    // if(size === "basic") newSize = 90
    // if(size === "large") newSize = 110
    const innerWidget = editor.querySelector("shorts-works");
    // 커스터마이즈 부분에서 해소하도록 변경 필요
    // 68, 90, 110
    // const currentShape =
    // 120, 160, 200
    innerWidget.setAttribute("size", size);
    innerWidget.customize();
    const { left, bottom } = editor.getBoundingClientRect();
    sendMessage({ title: "attach", data: { left, top: bottom, state: true } });
});
observeMessage("frame")(({ size }) => {
    console.log(size);
    const innerWidget = editor.querySelector("shorts-works");
    innerWidget.setAttribute("frame", size);
    innerWidget.customize();
});
// hooks
// observeMessage("attributes")((attribute) =>
//     Object.entries(attribute).forEach(([name, value]) =>
//         preview.setAttribute(name, value)))
//
// observeMessage("shape")(({shape}) => preview.changeShape(shape))
// export function attachPreviewController(state: boolean) {
//     const {left, bottom} = preview.element.getBoundingClientRect()
// }

// document.body.appendChild(preview)
document.body.appendChild(styleSheet);
let currentAttachedElement = null;
window.addEventListener("mouseover", event => {
    if (mode.state === "preview" || mode.state === "attach") {
        preview.clientWidth;
        // console.log(preview.querySelector("shorts-works").clientWidth)
        const currentTarget = event.target;
        currentTarget.getBoundingClientRect().width;
        // let elements = document.elementsFromPoint(event.clientX, event.clientY)
        // const attachableElement = elements.find((element: HTMLElement) => Number(element.getBoundingClientRect().width) >= width)
        // elements = elements.filter(element => element.tagName !== "BODY")
        // elements = elements.filter(element => element.tagName !== "HTML")
        // const attachElement = elements.filter(element => element.getBoundingClientRect().width>= 800)[0]
        if (currentTarget.getBoundingClientRect().width >= 800 && currentTarget !== editor && currentTarget !== currentAttachedElement) {
            currentTarget.insertAdjacentElement("afterend", preview);
            currentAttachedElement = currentTarget;
        }
        else {
            preview.remove();
        }
        // if(attachElement != undefined && attachElement !== editor && attachElement !== currentAttachedElement) {
        //     preview.style.visibility = "visible"
        // attachElement.insertAdjacentElement("afterend", preview)
        // currentAttachedElement = attachElement
        //
        // } else {
        //         preview.remove()
        // preview.style.visibility = "hidden"
        // }
        // elements.forEach(element => console.log(element.getBoundingClientRect().width >= 800))
        // if(attachableElement.tagName !== "BODY" && attachableElement.getBoundingClientRect().width >= width && attachableElement !== preview) {
        //     attachableElement.insertAdjacentElement("afterend", preview)
        // } else {
        //     preview.remove()
        //     preview.style.visibility = "hidden"
        // }
        // if(currentWidth >= width && currentTarget !== preview && currentTarget !== editor) {
        //     preview.style.visibility = "visible"
        //     currentTarget.insertAdjacentElement("afterend", preview)
        // }
        // else {
        //     preview.style.visibility = "hidden"
        // }
    }
    // const start = document.elementFromPoint(event.clientX - width/2 , event.clientY)
    // const end = document.elementFromPoint(event.clientX + width/2 , event.clientY)
    // console.log(start === end)
    // console.log(event.clientX)
    // console.log(document.elementFromPoint(event.clientX, event.clientY))
});
window.addEventListener("click", event => {
    if (mode.state === "preview" || mode.state === "attach") {
        preview.insertAdjacentElement("afterend", editor);
        preview.remove();
        mode.state = "attach";
    }
    if (mode.state === "edit") {
        if (event.target !== editor) {
            editor.classList.remove("attached");
            mode.state = "attach";
            // 중복
            const { left, bottom } = editor.getBoundingClientRect();
            window.parent.postMessage({
                title: "attach",
                data: {
                    left: left,
                    top: bottom,
                    state: false
                }
            }, "*");
        }
    }
});
editor.addEventListener("click", () => {
    if (mode.state === "attach") {
        editor.classList.add("attached");
        mode.state = "edit";
        const { left, bottom } = editor.getBoundingClientRect();
        window.parent.postMessage({
            title: "attach",
            data: {
                left: left,
                top: bottom,
                state: true
            }
        }, "*");
    }
});
window.addEventListener("scroll", () => {
    if (mode.state === "edit") {
        const { left, bottom } = editor.getBoundingClientRect();
        window.parent.postMessage({
            title: "attach",
            data: {
                left: left,
                top: bottom,
                state: true
            }
        }, "*");
    }
});
// 간격 찾기
