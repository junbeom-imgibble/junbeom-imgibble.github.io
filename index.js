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

function createSpace(elementName) {
    const element = document.createElement("div");
    element.id = elementName;
    return element;
}
const selectingSpace = createSpace("selecting-space");
const attachedSpace = createSpace("attached-space");

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
observeMessage("getWidgetPosition")(({ data }) => {
    attachedSpace.style.height = data.params.height;
    selectingSpace.style.height = data.params.height;
});
observeMessage("initPreviewHeight")(({ data }) => {
    attachedSpace.style.height = data.params;
    selectingSpace.style.height = data.params;
});
//     previewWidget.setAttribute("shape", shape)
//     previewWidget.render()
//     previewWidget.customize()
//
//     widget.setAttribute("shape", shape)
//     widget.render()
//     widget.customize()
//
//     attachController()
// })
//
// observeMessage("size")(({size}) => {
//     previewWidget.setAttribute("size", size)
//     previewWidget.render()
//     previewWidget.customize()
//
//     widget.setAttribute("size", size)
//     widget.render()
//     widget.customize()
//
//     attachController()
// })
//
// observeMessage("frame")(({size}) => {
//     previewWidget.setAttribute("frame", size)
//     previewWidget.render()
//     previewWidget.customize()
//
//     widget.setAttribute("frame", size)
//     widget.render()
//     widget.customize()
//
//     attachController()
// })
//
// // observeMessage("attributes")((attribute) =>
// //     Object.entries(attribute).forEach(([name, value]) =>
// //         preview.setAttribute(name, value)))
// //
// // observeMessage("shape")(({shape}) => preview.changeShape(shape))
//
// // export function attachPreviewController(state: boolean) {
// //     const {left, bottom} = preview.element.getBoundingClientRect()
// // }

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
    // console.log(target)
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
