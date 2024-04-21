import * as faceapi from 'face-api.js';

const MODEL_URL = chrome.runtime.getURL('models/');
const LEBRON_IMAGE_URL = chrome.runtime.getURL('images/LeBummy.jpeg');
const CURRY_IMAGE_URL = chrome.runtime.getURL('images/curry.jpeg');
const TWEET_PHOTO_SELECTOR = 'div[data-testid="tweetPhoto"] img';
const GOOOGLE_PHOTO_SELECTOR = '';

let loaded = false;
let loadedLeMickey = null;

async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    loaded = true;
    console.log("Loaded face detection models");
}

async function loadLeImage() {
    const img = await faceapi.fetchImage(LEBRON_IMAGE_URL);
    const detected = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (!detected) throw new Error("No face detected in the image.");
    console.log(detected.descriptor);
    return new faceapi.LabeledFaceDescriptors('Lebron', [detected.descriptor]);
}

(async () => {
    await loadModels();
    loadedLeMickey = await loadLeImage();
    if (!loadedLeMickey) {
        console.error('Failed to load valid LeBron image');
        return;
    }
})();

async function imageProcessor(img) {
    if (img.naturalHeight <= 50 || img.naturalWidth <= 50) return;

    console.log('Started image processing:');
    const isLeBronDetected = await detectLeBum(img.src);

    if (isLeBronDetected) {
        console.log('Curryfication incoming.');
        applyOverlay(img, CURRY_IMAGE_URL);
    } else {
        console.log('Not LeBron.');
    }
}

function applyOverlay(targetImg, sourceUrl) {
    const overlayedImage = document.createElement('img');
    overlayedImage.src = sourceUrl;
    overlayedImage.style = `position: absolute; left: ${targetImg.getBoundingClientRect().left + window.scrollX}px; top: ${targetImg.getBoundingClientRect().top + window.scrollY}px; width: ${targetImg.getBoundingClientRect().width}px; height: ${targetImg.getBoundingClientRect().height}px;`;
    overlayedImage.classList.add('overlay');
    document.body.appendChild(overlayedImage);
    targetImg.style.opacity = '0';
    targetImg.classList.add('overlayed');
}

const observeImages = new IntersectionObserver((entries, observer) => {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            await imageProcessor(entry.target);
        }
    });
}, { rootMargin: '0px', threshold: 0.1 });

function setupObservers() {
    document.querySelectorAll(TWEET_PHOTO_SELECTOR).forEach(img => {
        observeImages.observe(img);
    });

    const observeMutations = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG') {
                    observeImages.observe(node);
                }
            });
        });
    });

    observeMutations.observe(document.body, { childList: true, subtree: true });
}

const intervalObservation = setInterval(() => {
    if (loaded && loadedLeMickey) {
        setupObservers();
        clearInterval(intervalObservation);
        console.log('Image observers set up.');
    }
}, 1000);

async function detectLeBum(imageSrc) {
    const img = await faceapi.fetchImage(imageSrc);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (!detection) return false;

    const faceMatcher = new faceapi.FaceMatcher(loadedLeMickey, 0.6);
    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
    return bestMatch.label === 'Lebron';
}

document.addEventListener('DOMContentLoaded', () => {
    if (!loaded) {
        console.warn('Models not loaded yet, waiting...');
    }
});
