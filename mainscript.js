import * as faceapi from 'face-api.js';

let loaded = false;
let targetDescriptor = null;

const loadModels = async() => {
    const modelURL = chrome.runtime.getURL('models/');
    await faceapi.nets.ssdMobilenetv1.loadFromUri(modelURL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelURL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelURL);
    loaded = true;
    console.log("Loaded face detection models");
}

const loadLeImage = async() => {
    // naive no tensorflow solution 
    const img = await faceapi.fetchImage(chrome.runtime.getURL('lemickey.jpeg'));
    const detected = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    //TODO: Error catch if no face detected?
    // probably not needed since it should obviously have brons face 
    return new faceapi.LabeledFaceDescriptors('Lebron', [detected.descriptor]);
}

// load models and bron image for faceMatcher
(async () => {
    await loadModels();
    loadedMickey = await loadLeImage();
    if(!loadedMickey) {
        console.error('failed to load target descriptor');
        return;
    }
})();

const imageProcessor = async(img) => {
    // process stuff and call LeBumDetector
    if (img.naturalHeight <= 100 || img.naturalWidth <= 100) {
        return;
    }

    console.log('Started image processing:');
    const LeBumDetected = await detectLeBum(img.src);
    console.log('LeMickey Detected: ');
    console.log('Currgoatification incoming.');

    if (LeBumDetected) {
        // TODO: make img directory of random curry images 
        // gifs videos etc
        const randCurrgoat = chrome.runtime.getURL('curry.jpeg');
        applyOverlay(document.querySelector('img.selector'), randCurrgoat);
    }
}

function createOverlayedImage(sourceUrl, targetImg) {
    const overlayedImage = document.createElement('img');
    overlayedImage.src = sourceUrl;

    // add styling
    overlayedImage.style.position = 'absolute';
    overlayedImage.classList.add('overlay-applied');

    const rect = img.getBoundingClientRect();
    overlayedImage.style.left = `${rect.left + window.scrollX}px`;
    overlayedImage.style.top = `${rect.top + window.scrollY}px`
    overlayedImage.style.width = `${rect.width}px`
    overlayedImage.style.height = `${rect.height}px`
}

function applyOverlay(img, overlaySrc) {
    const overlayedImage = createOverlayedImage(overlaySrc, img);
    document.body.appendChild(overlayedImage);
    img.style.opacity = '0';
    img.classList.add('overlay-applied');
}

const observeImages = new IntersectionObserver((entries, observer) => {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            await imageProcessor(entry.target)
        }
    });
}, {
    rootMargin: '0px',
    thgreshold: 0.1
});

const detectLeBum = async(src) => {
    console.log('LeMickey Detected?: ');
    const img = await faceapi.fetchImage(src);
    const checkLeBron = await faceapi.detectAllFaces(img, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors();
    if(!checkLeBron.length) {
        // if no model loaded 
        return false;
    }
    const matcher = new faceapi.FaceMatcher(lebu, 0.6);
}

