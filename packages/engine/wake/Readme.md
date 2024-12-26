# @slotplate/wake

Package which provide implementation for [wake lock api](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API).

## Installation

```bash
npm install --save @slotplate/wake
```

### Example

Setup
```javascript
import { WakeLockApi } from 'g-slots/wake';

const wakeApi = new WakeLockApi();

...

useEffect(() => {
    wakeApi.request();

      return () => {
        wakeApi.dispose();
      }
  }, []);

...

```