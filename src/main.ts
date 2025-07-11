import './style.css'

// Get the panda image element from the DOM
const panda = document.getElementById('panda') as HTMLImageElement;

// Create or get the favicon link element
const faviconLink = document.createElement('link');
faviconLink.rel = 'icon';
faviconLink.type = 'image/svg+xml';
document.head.appendChild(faviconLink);

// Function to update the favicon
const updateFavicon = (src: string) => {
  faviconLink.href = src;
};

// Set the initial state to neutral
let interactionTimeout: number;
panda.src = '/Neutral.svg';
updateFavicon(panda.src);

const goSad = () => {
  panda.src = '/Sad.svg';
  updateFavicon(panda.src);
}

const goAngry = () => {
  panda.src = '/Angry.svg';
  updateFavicon(panda.src);
  interactionTimeout = setTimeout(goSad, 5000);
}

// Set a timeout to make the panda angry if there's no interaction from the start
interactionTimeout = setTimeout(goAngry, 5000);

// Function to handle user interaction
const handleInteraction = () => {
  // Change the panda to happy
  panda.src = '/Happy.svg';
  updateFavicon(panda.src);

  // Clear the previous timeout to prevent the panda from getting angry
  clearTimeout(interactionTimeout);

  // Set a new timeout to switch to angry after 5 seconds of inactivity
  interactionTimeout = setTimeout(goAngry, 5000);
};

let heartInterval: number;
let currentPointerPosition: { clientX: number, clientY: number } | null = null;

// Function to create and animate a single heart
const createHeart = (eventPoint?: { clientX: number, clientY: number }) => {
  const position = eventPoint || currentPointerPosition;
  if (!position) return; // Should not happen if called correctly

  const heart = document.createElement('span');
  heart.classList.add('heart');
  heart.innerHTML = '❤️';

  // Position the heart near the event
  heart.style.left = `${position.clientX + (Math.random() - 0.5) * 40}px`;
  heart.style.top = `${position.clientY + (Math.random() - 0.5) * 40}px`;

  document.body.appendChild(heart);

  // Remove the heart after the animation is complete
  setTimeout(() => {
    heart.remove();
  }, 2000);
};

const updatePointerPosition = (e: MouseEvent | TouchEvent) => {
  const eventPoint = e instanceof MouseEvent ? e : e.touches[0];
  currentPointerPosition = { clientX: eventPoint.clientX, clientY: eventPoint.clientY };
};

const startCreatingHearts = (e: MouseEvent | TouchEvent) => {
  handleInteraction();
  updatePointerPosition(e); // Set initial position

  // Add listeners to update position while dragging
  document.body.addEventListener('mousemove', updatePointerPosition);
  document.body.addEventListener('touchmove', updatePointerPosition);

  clearInterval(heartInterval); // Stop any previous interval
  heartInterval = setInterval(createHeart, 100);
};

const stopCreatingHearts = () => {
  clearInterval(heartInterval);
  // Remove listeners when dragging stops
  document.body.removeEventListener('mousemove', updatePointerPosition);
  document.body.removeEventListener('touchmove', updatePointerPosition);
  currentPointerPosition = null;
};

// Add event listeners for general interaction
panda.addEventListener('mousemove', handleInteraction);
panda.addEventListener('mouseover', handleInteraction);
panda.addEventListener('touchmove', handleInteraction);

// Event listeners for creating hearts (which also count as interaction)
panda.addEventListener('mousedown', startCreatingHearts);
panda.addEventListener('mouseup', stopCreatingHearts);
// Listen for mouseup anywhere on the document to stop creating hearts if released outside panda
document.body.addEventListener('mouseup', stopCreatingHearts);
panda.addEventListener('mouseleave', stopCreatingHearts); // If mouse leaves panda while down

panda.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startCreatingHearts(e);
});
panda.addEventListener('touchend', stopCreatingHearts);
document.body.addEventListener('touchend', stopCreatingHearts);
panda.addEventListener('touchcancel', stopCreatingHearts);

// Add a click listener to create a burst of hearts on single click
panda.addEventListener('click', (e) => {
  handleInteraction(); // Also count as interaction
  const eventPoint = { clientX: e.clientX, clientY: e.clientY }; // Set position for click
  for (let i = 0; i < 3; i++) { // Create 3 hearts on click
    setTimeout(() => createHeart(eventPoint), i * 50); // Stagger them slightly
  }
});

// Prevent the browser's default drag-and-drop behavior
panda.addEventListener('dragstart', (e) => e.preventDefault());