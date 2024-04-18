import * as faceapi from 'face-api.js';

let loaded = false;
let loadedLeMickey = null;


const loadModels = async() => {
    const modelURL = chrome.runtime.getURL('models/');
    await faceapi.nets.ssdMobilenetv1.loadFromUri(modelURL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelURL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelURL);
    loaded = true;
    console.log("Loaded face detection models");
}

const loadLeImage = async() => {
    const img = await faceapi.fetchImage(chrome.runtime.getURL('LeBummy.jpeg'));
    const detected = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (!detected) {
        throw new Error("No face detected in the image.");
        return null
    }
    console.log(detected.descriptor);
    return new faceapi.LabeledFaceDescriptors('Lebron', [detected.descriptor]);
}

// load models and bron image for faceMatcher
(async () => {
    await loadModels();
    loadedLeMickey = await loadLeImage();
    if(!loadedLeMickey) {
        console.error('failed to load valid lebron image');
        return;
    }
})();

const imageProcessor = async(img) => {
    // process stuff and call LeBumDetector
    if (img.naturalHeight <= 50 || img.naturalWidth <= 50) {
        return;
    }

    console.log('Started image processing:');
    const LeBumDetected = await detectLeBum(img.src);

    if (LeBumDetected) {
        console.log('Currgoatification incoming.');
        // TODO: make img directory of random curry images 
        // gifs videos etc
        const overlayedImage = document.createElement('img');
        const randCurrgoat = chrome.runtime.getURL('curry.jpeg');
        overlayedImage.src = randCurrgoat;
        overlayedImage.style.position = 'absolute';
        overlayedImage.classList.add('overlay');

        const rect = img.getBoundingClientRect();
        overlayedImage.style.left = `${rect.left + window.scrollX}px`;
        overlayedImage.style.top = `${rect.top + window.scrollY}px`
        overlayedImage.style.width = `${rect.width}px`
        overlayedImage.style.height = `${rect.height}px`
        
        document.body.appendChild(overlayedImage);
        img.style.opacity = '0';
        img.classList.add('overlayed');
        // applyOverlay(randCurrgoat, document.querySelector('img.selector'));
    }
    else {
        console.log('Not Bron.');
    }
};

// const createOverlayedImage = async (sourceUrl, targetImg) => {
//     const overlayedImage = document.createElement('img');
//     overlayedImage.src = sourceUrl;

//     // add styling
//     overlayedImage.style.position = 'absolute';
//     overlayedImage.classList.add('overlay-applied');

//     const rect = targetImg.getBoundingClientRect();
//     overlayedImage.style.left = `${rect.left + window.scrollX}px`;
//     overlayedImage.style.top = `${rect.top + window.scrollY}px`
//     overlayedImage.style.width = `${rect.width}px`
//     overlayedImage.style.height = `${rect.height}px`
//     return overlayedImage
// }

// const applyOverlay = async(img, overlaySrc) => {
//     const overlayedImage = createOverlayedImage(overlaySrc, img);
//     document.body.appendChild(overlayedImage);
//     img.style.opacity = '0';
//     img.classList.add('overlay-applied');
// }

const observeImages = new IntersectionObserver((entries, observer) => {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            await imageProcessor(entry.target)
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.1
});

const setupObservers = () => {
    document.querySelectorAll('div[data-testid="tweetPhoto"] img').forEach(async img => {
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

    observeMutations.observe(document.body, { childList: true, subtree: true});
};

// check if models loaded and lebron image is set as a target
const intervalObservation = setInterval(() => {
    if (loaded && loadedLeMickey) {
        setupObservers();
        clearInterval(intervalObservation);
    }
}, 100);

const detectLeBum = async(src) => {
    console.log('detectLeBum: ');
    const img = await faceapi.fetchImage(src);
    const checkLeBron = await faceapi.detectAllFaces(img, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors();
    if(!checkLeBron.length) {
        // if no face detected 
        return false;
    }
    const matcher = new faceapi.FaceMatcher(loadedLeMickey, 0.5);
    const bestMatch = checkLeBron.map(d => matcher.findBestMatch(d.descriptor));
    return bestMatch.some(result => result.label === 'Lebron');
}
