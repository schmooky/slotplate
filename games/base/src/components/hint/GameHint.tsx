import React, { FC, useEffect, useRef, useState } from 'react';
import { eventEmitter, POPUPS_EVENTS } from '@lib/eventEmminer/events';
import { Hint } from '@components/hint/Hint';
import gsap from 'gsap';
import { useResize } from '@slotplate/react-components';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import { rootStore } from '@src/stores/RootStore';
import { HintStyleTypes } from '@components/modal/announcers/types';

export enum HintTextKeys {
  BonusCapsule = 'hint.bonusCapsule',
  High1 = 'hint.high1',
  wild = 'hint.wild',
  Scatter = 'hint.counter',
  CloningWild = 'hint.cloningWild',
  Mystery = 'hint.mystery',
  Question = 'hint.question',
}

export const canBeSkippedSymbols = new Map([
  [HintTextKeys.wild, HintTextKeys.wild],
  [HintTextKeys.Scatter, HintTextKeys.Scatter],
]);

export const GameHint: FC = () => {
  const reference = useRef<HTMLDivElement>(null);
  const { isPortrait } = useResize();
  const [text, setText] = useState<string>('');
  const isHintCurrentlyDisplayed = useRef(false);
  const shownHints = useRef<Set<HintTextKeys>>(new Set());

  const [hintStyle, setHintStyle] = useState<React.CSSProperties>({
    background: 'linear-gradient(90deg, rgba(37, 10, 49, 0.8), rgba(56, 0, 82, 0.8), rgba(37, 10, 49, 0.8))',
    color: 'white',
  });

  const playShowAnim = (): void => {
    gsap.to(reference.current, {
      duration: 0.5,
      top: isPortrait ? '2.1%' : '2.5%',
    });
  };

  const playHideAnim = (): void => {
    gsap.to(reference.current, {
      duration: 0.5,
      top: '-20%',
      onComplete: () => {
        rootStore.gameStatusStore.showHint = false;
        isHintCurrentlyDisplayed.current = false;
      },
    });
  };

  const selectType = (type: string): void => {
    if (type === HintStyleTypes.Main) {
      setHintStyle({
        background: 'linear-gradient(90deg, rgba(37, 10, 49, 0.8), rgba(56, 0, 82, 0.8), rgba(37, 10, 49, 0.8))',
        color: 'white',
      });
    }
  };

  const hideHintOnOrientationChange = (): void => {
    if (simpleLocalize.getTranslation(HintTextKeys.wild) === text) {
      eventEmitter.emit(POPUPS_EVENTS.hideHint);
    }
  };

  useEffect(() => {
    let delayedCall: gsap.core.Tween;

    const showHintHandler = (textKey: HintTextKeys, duration: number, styleType: HintStyleTypes) => {
      if (isHintCurrentlyDisplayed.current || shownHints.current.has(textKey)) return;

      if (canBeSkippedSymbols.get(textKey)) {
        rootStore.gameStatusStore.showHint = true;
      }

      if (textKey !== HintTextKeys.BonusCapsule && textKey !== HintTextKeys.Question) {
        shownHints.current.add(textKey);
      }

      isHintCurrentlyDisplayed.current = true;

      setText(simpleLocalize.getTranslation(textKey));
      selectType(styleType);
      playShowAnim();

      if (duration > 0) {
        delayedCall = gsap.delayedCall(duration, hideHintHandler);
      }
    };

    const hideHintHandler = () => {
      playHideAnim();
      delayedCall?.kill();
    };

    eventEmitter.on(POPUPS_EVENTS.showHint, showHintHandler);
    eventEmitter.on(POPUPS_EVENTS.hideHint, hideHintHandler);

    return () => {
      gsap.killTweensOf(reference.current);
      delayedCall?.kill();
      shownHints.current.clear();
      eventEmitter.off(POPUPS_EVENTS.showHint, showHintHandler);
      eventEmitter.off(POPUPS_EVENTS.hideHint, hideHintHandler);
    };
  }, []);

  useEffect(() => {
    hideHintOnOrientationChange();
  }, [isPortrait]);

  return (
    <>
      <Hint
        hintText={text}
        style={hintStyle}
        ref={reference}
      />
    </>
  );
};
