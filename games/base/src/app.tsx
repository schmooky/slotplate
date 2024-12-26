import React, { FC, useEffect } from 'react';
import { GameApplication } from '@src/application';
import { observer } from 'mobx-react';
import { Globals } from '@lib/Globals';
import { rootStore } from '@src/stores/RootStore';
import { Phase } from '@src/flow/types';
import { Preloader } from '@src/reactComponents/preloader/preloader';
import { WakeLockApi } from '@slotplate/engine/wake';
import { changeHtmlFontSize } from '@lib/changeHtmlFontSize';


const App: FC = observer(() => {
  const { stateMachine, statusStore, errorStore, modalStatusStore } = rootStore;

  useEffect(() => {
    Globals.gameApp = new GameApplication();
    const wake = new WakeLockApi();
    wake.request();

    return () => {
      wake.dispose();
    };
  }, []);

  useEffect(() => {
    if (stateMachine.phase === Phase.Splash) {
      const htmlElement = document.querySelector('html');

      changeHtmlFontSize(htmlElement as HTMLHtmlElement);

      window.addEventListener('resize', changeHtmlFontSize.bind(null, htmlElement as HTMLHtmlElement));
    }
  }, [stateMachine.phase]);

  return (
    <>
      {
        stateMachine.phase === Phase.Preload ? <Preloader /> : undefined
      }
    </>
  );
});

export default App;
