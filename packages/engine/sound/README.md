# @slotplate/network

Package extends **howler** lib which provide api to work with audio context. Allows grouping sounds into gain nodes,
separate volume control, loading and play api.

## Installation

```bash
npm install --save @slotplate/sound
```

### Example

Setup network manager:

```javascript
import { GlobalSound, GainNodesConfig} from "@slotplate/sound";
import { soundsConfig } from "./some-abstract-config"
```

Init:
```javascript
const settings = { ... } // usually game settings object 
const soundsConfig: GainNodesConfig = { ... } // gain node name / sound options array map 
const globalSound = new GlobalSound(settings);
```
Load sounds:
```javascript
globalSound
  .loadGroupedSounds(
    soundsConfig, 
    "remote-filese-path/", 
    (loadedSounds) => { ... } // callback on single file load
  )

```
Volume change and update mute:
```javascript
// set gain node volume
globalSound.setVolume(0.8, "gain-node-name");

// mute all sound
settings.isSoundEnabled = false;
globalSound.updateMute()

// unmute all sound
settings.isSoundEnabled = true;
globalSound.updateMute()
```

Sound player API:
```javascript
const sound = globalSound.getSound("loaded-sound-name");
sound.play();
sound.stop();
sound.fadeIn();
sound.fadeOut();
```