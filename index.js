const sendMessage = (message) => window.parent.postMessage(message, "*");
const observeMessage = (observe) => (callback) => window.addEventListener("message", (data) => observe && callback(data));
// when iframe window onload
sendMessage({ func: "init" });
function sendMaxHeight() {
    sendMessage({
        func: "setMaxHeight",
        params: document.body.scrollHeight
    });
}

customElements.define("sw-space", class extends HTMLElement {
    constructor() {
        super();
        this.isInit = false;
    }
    connectedCallback() {
        if (this.isInit)
            return;
        this.style.width = "100%";
        console.log("spacing");
        this.space = document.createElement("div");
        this.space.style.border = "1px solid red";
        this.space.style.height = "300px";
        this.append(this.space);
        this.isInit = true;
    }
    static get observedAttributes() {
        return ["height"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name);
        console.log(newValue + "입니다.");
        this.space.style.height = newValue;
    }
});
function createSpace(elementName) {
    const element = document.createElement("sw-space");
    element.id = elementName;
    // height 변경 인식 안되는 현상
    element.style.width = "100vw";
    return element;
}
const selectingSpace = createSpace("selecting-space");
selectingSpace.style.border = "1px solid red";
const attachedSpace = createSpace("attached-space");
attachedSpace.style.border = "1px solid blue";

const elements = {
    tempAttachedElement: null,
    currentAttachedElement: null
};

const status = {
    isAttached: false,
    isEditing: false
};

// import {observeMessage, useMessage} from "./hook"
// import {WidgetElement} from "shortsworks-types/widget"
// import {attachController} from "./send";
observeMessage("getMaxHeight")(sendMaxHeight);
// status
observeMessage("setStatus")(({ data }) => {
    var _a;
    const result = data.params;
    if (result === "attached") {
        (_a = elements.tempAttachedElement) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement("beforebegin", attachedSpace);
        selectingSpace.remove();
        elements.currentAttachedElement = elements.tempAttachedElement;
        status.isAttached = true;
        sendMessage({
            func: "setWidgetPosition",
            params: attachedSpace.getBoundingClientRect()
        });
    }
    if (result === "edit") {
        status.isEditing = true;
        selectingSpace.remove();
        sendMessage({
            func: "setWidgetPosition",
            params: attachedSpace.getBoundingClientRect()
        });
    }
});
//  변경 사항이 인식되지 않음
observeMessage("getWidgetPosition")(({ data }) => {
    var _a;
    if (((_a = data.params) === null || _a === void 0 ? void 0 : _a.height) === undefined)
        return;
    attachedSpace.setAttribute("height", data.params.height);
    selectingSpace.setAttribute("height", data.params.height);
    console.log(selectingSpace.style.height);
    console.log(attachedSpace.style.height);
});
observeMessage("initPreviewHeight")(({ data }) => {
    attachedSpace.style.height = data.params;
    selectingSpace.style.height = data.params;
});

function sendElementPosition(func, element) {
    const currentPosition = element.getBoundingClientRect();
    sendMessage({
        func,
        params: currentPosition
    });
}

function findFirstElement(margin = 0, value) {
    // const target = document.elementFromPoint(margin, event.clientY + value)
    // if(target === document.body) return findFirstElement(margin + 1, value)
    // return target
}
function validateElement(element) {
    return (element === selectingSpace
        || element === document.body
        || element === elements.tempAttachedElement
        || element === elements.currentAttachedElement
        || element === attachedSpace);
}

window.addEventListener("mousemove", (event) => {
    if (status.isEditing)
        return;
    const target = event.target;
    if (validateElement(target))
        return;
    // const bodyGap = Number(getComputedStyle(document.body).marginInline.replace("px", ""))
    // const contentsHeight = 10
    // const topStartPointElement = findFirstElement(0 , -10)
    // const bottomStartPointElement = findFirstElement(0, 10)
    // if(validateElement(topStartPointElement) || validateElement(bottomStartPointElement)) return;
    // if(topStartPointElement !== bottomStartPointElement) {
    target.insertAdjacentElement("beforebegin", selectingSpace);
    elements.tempAttachedElement = target;
    sendElementPosition("setCurrentPosition", selectingSpace);
    if (status.isAttached) {
        sendElementPosition("setWidgetPosition", attachedSpace);
    }
});

function attachElement({ attachedElement, target }) {
    attachedElement.insertAdjacentElement("beforebegin", target);
}

window.addEventListener("click", () => {
    if (status.isEditing)
        status.isEditing = false;
    sendMessage({ func: "clickOthers" });
});

function validateTarget(element) {
    return element.tagName !== "HTML"
        && element.tagName !== "BODY"
        && element.tagName !== "SHORTSWORKS-PREVIEW"
        && element.id !== "preview-space";
}
const getAttachable = (element) => (element.tagName !== "HTML" && element.tagName !== "BODY" && element.tagName !== "SHORTSWORKS-PREVIEW" && element.id !== "preview-space")
    && element;

// 한 타임 느린 것 같음
// import { attachElement } from "./events/attach"
// import { sendElementPosition, sendMaxHeight } from "./message"
// import {onMessage} from "shortsworks-functions"
//
// onMessage((func, params) => {
//     if(func === "setStatus" && params === "attached") {
//         selectingSpace.remove()
//         attachElement({target: attachedSpace, attachedElement: tempAttachedElement})
//         currentAttachedElement = tempAttachedElement
//         isAttached = true
//
//         sendElementPosition("setWidgetPosition", attachedSpace)
//     }
// })
//
//
//
// onMessage((func, params) => {
//     if(func === "setStatus" && params === "edit") {
//         isEditing = true
//         selectingSpace.remove()
//
//         sendElementPosition("setWidgetPosition", attachedSpace)
//     }
// })
//
//
//
