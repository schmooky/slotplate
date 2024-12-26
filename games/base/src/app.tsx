import React, { FC, useEffect } from 'react';
import { GameApplication } from '@src/application';
import { observer } from 'mobx-react';
import { Globals } from '@lib/Globals';
import { rootStore } from '@src/stores/RootStore';
import { Phase } from '@src/flow/types';
import { CheatPanel } from '@lib/cheatPanel/cheatPanel';
import { Preloader } from '@src/reactComponents/preloader/preloader';
import { ReactModalWindows } from '@src/reactComponents/reactModalWindows/reactModalWindows';
import { changeHtmlFontSize } from '@gambit/react-components/dist/customHooks/changeHtmlFontSize';
import { GameHint } from '@components/hint/GameHint';
import { withHotkeys } from '@src/withHotkeys';
import {
  EventsAlertingModal,
  AlertingFilledButton,
  CreditCardIcon,
  ErrorIcon,
} from '@gambit/react-components';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import { WakeLockApi } from '@slotplate/wake';

declare const GAME_ENV: string;

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

      {
        statusStore.isGameStarted ? <ReactModalWindows /> : undefined
      }

      <EventsAlertingModal
        triggerAction={modalStatusStore.showErrorModal}
        header={{ color: errorStore.isInsufficientFunds ? '#FFA31A' : '#FF2D1A', text: errorStore.errorHeader }}
        alertingText={errorStore.errorMessage}
        buttons={[
          errorStore.isInsufficientFunds
            ? <AlertingFilledButton
              key={'filledButton'}
              onClick={() => {
                errorStore.setErrorId(0);
                modalStatusStore.setShowErrorModal(false);

                if (stateMachine.phase === Phase.Idle) {
                  errorStore.isInsufficientFunds = false;
                }
              }
              }>{simpleLocalize.getTranslation('modal.insufficientFunds.button')}
            </AlertingFilledButton>
            : <AlertingFilledButton
              key={'filledButton'}
              onClick={() => window.location.reload()}>{simpleLocalize.getTranslation('modal.error.button')}
            </AlertingFilledButton>,
        ]}
        svgIcon={errorStore.isInsufficientFunds ? <CreditCardIcon /> : <ErrorIcon />}
      />
      <GameHint />
      {GAME_ENV === 'development' && <CheatPanel />}
    </>
  );
});

export default withHotkeys(App);
