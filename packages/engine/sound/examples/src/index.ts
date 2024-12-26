import { GlobalSound } from "../../index";

const settings = {
  gainNodesVolume: {
    ambient: 0.5,
    fx: 0.5,
  },
  isSoundEnabled: true,
};

const globalSound = new GlobalSound(settings);

// configuration example
const soundsConfig = {
  ambient: [
    {
      fileName: "ambient.mp3",
      soundName: "ambient",
      loop: true,
      volume: 1,
    },
  ],
  fx: [
    {
      fileName: "main.mp3",
      soundName: "main",
      loop: false,
      volume: 1,
    },
    {
      fileName: "winbox.mp3",
      soundName: "winbox",
      loop: false,
      volume: 1,
    },
  ],
};

function addVolumeControls() {
  Object.keys(soundsConfig).forEach((node) => {
    const slider = document.createElement("input");
    const span = document.createElement("span");
    span.innerText = node;
    slider.type = "range";

    document.getElementById("sound-controls")?.append(span);
    document.getElementById("sound-controls")?.append(slider);

    // volume control
    slider.onchange = (e) => {
      // @ts-ignore
      globalSound.setVolume(e.target.value / 100, node);
    };
  });
}

function addPlayButtons() {
  Object.values(soundsConfig)
    .flat(1)
    .forEach((soundOptions) => {
      const button = document.createElement("button");
      button.innerText = soundOptions.soundName;

      button.onclick = () => {
        // play/stop sound
        const sound = globalSound.getSound(soundOptions.soundName);
        if (sound?.howl.playing()) {
          sound?.stop();
        } else {
          sound?.play();
        }
      };
      document.getElementById("buttons")!.append(button);
    });
}

// Load sounds
globalSound
  .loadGroupedSounds(soundsConfig, "sounds/", (loadedSounds) => {
    // eslint-disable-next-line no-console
    console.log("loaded sounds: ", loadedSounds);
  })
  .then(() => {
    document.getElementById("main")!.style.visibility = "visible";
    document.getElementById("loading")!.style.visibility = "hidden";

    addPlayButtons();
    addVolumeControls();
  });
