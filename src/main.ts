import './style.css'

// Get the panda image element from the DOM
const panda = document.getElementById('panda') as HTMLImageElement;

// Set the initial state to neutral
let interactionTimeout: number;
panda.src = '/Neutral.svg';

const goSad = () => {
  panda.src = '/Sad.svg';
}

const goAngry = () => {
  panda.src = '/Angry.svg';
  interactionTimeout = setTimeout(goSad, 5000);
}

// Set a timeout to make the panda angry if there's no interaction from the start
interactionTimeout = setTimeout(goAngry, 5000);

// Function to handle user interaction
const handleInteraction = () => {
  // Change the panda to happy
  panda.src = '/Happy.svg';

  // Clear the previous timeout to prevent the panda from getting angry
  clearTimeout(interactionTimeout);

  // Set a new timeout to switch to angry after 5 seconds of inactivity
  interactionTimeout = setTimeout(goAngry, 5000);
};

let heartInterval: number;

// Function to create and animate a single heart
const createHeart = (event: { clientX: number, clientY: number }) => {
  const heart = document.createElement('span');
  heart.classList.add('heart');
  heart.innerHTML = '❤️';

  // Position the heart near the event
  heart.style.left = `${event.clientX + (Math.random() - 0.5) * 40}px`;
  heart.style.top = `${event.clientY + (Math.random() - 0.5) * 40}px`;

  document.body.appendChild(heart);

  // Remove the heart after the animation is complete
  setTimeout(() => {
    heart.remove();
  }, 2000);
};

const startCreatingHearts = (e: MouseEvent | TouchEvent) => {
  handleInteraction();
  const eventPoint = e instanceof MouseEvent ? e : e.touches[0];
  clearInterval(heartInterval); // Stop any previous interval
  heartInterval = setInterval(() => {
    createHeart(eventPoint);
  }, 100);
};

const stopCreatingHearts = () => {
  clearInterval(heartInterval);
};

// Add event listeners for general interaction
panda.addEventListener('mousemove', handleInteraction);
panda.addEventListener('mouseover', handleInteraction);
panda.addEventListener('touchmove', handleInteraction);

// Event listeners for creating hearts (which also count as interaction)
panda.addEventListener('mousedown', startCreatingHearts);
panda.addEventListener('mouseup', stopCreatingHearts);
panda.addEventListener('mouseleave', stopCreatingHearts);

panda.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startCreatingHearts(e);
});
panda.addEventListener('touchend', stopCreatingHearts);
panda.addEventListener('touchcancel', stopCreatingHearts);

// Prevent the browser's default drag-and-drop behavior
panda.addEventListener('dragstart', (e) => e.preventDefault());