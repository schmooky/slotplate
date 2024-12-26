import { resizeObject, SmartContainer } from '@slotplate/renderer';
import { Spine, TrackEntry } from '@esotericsoftware/spine-pixi-v8';
import { BitmapText, Container, FederatedPointerEvent, Rectangle } from 'pixi.js';
import { rootStore } from '@src/stores/RootStore';
import { ReelSymbol, symbolsMap } from '@lib/config/config';
import {
  CLONING_WILD_EVENTS,
  eventEmitter,
  FREE_SPIN_EVENTS,
  MYSTERY_FEATURE_EVENTS,
  POPUPS_EVENTS,
  REELS_EVENTS,
  SCREEN_EVENTS,
  SHAKE_EVENTS,
  SPIN_BUTTON_EVENTS,
  STATE_MACHINE_EVENTS,
} from '@lib/eventEmminer/events';
import { getRandomInt } from '@lib/utils/getRandomInt';
import { Paylines } from '@components/paylines/Paylines';
import { GameMode, PositionResponse, TransformationsResponse } from '@lib/nework/types';
import { Event } from '@esotericsoftware/spine-core/dist/Event';
import { Phase } from '@src/flow/types';
import { AnnouncerTypes } from '@components/modal/announcers/types';
import { HintTextKeys } from '@components/hint/GameHint';
import { gameSound } from '@src/stores/sound/GameSound';
import { SoundKey } from '@lib/sounds/soundsKeys';
import { gameSettingStore } from '@src/stores/gameSettings/GameSettingStore';
import { fsBonusShake, wildShake } from '@lib/utils/shakeUtils';
import { RegularWin } from '@components/regularWin/RegularWin';
import gsap from 'gsap';
import { AnalyticsManager } from '@lib/analytics/analyticsManager';

export class Reels extends SmartContainer {
  private reels: Spine[][] = [];

  static symbolContainers: Container<Spine>[][] = [];

  private cloningWildChangeSpines: Spine[][] = [];

  private wildChangeSpines: Spine[][] = [];

  private anticipationSpines: Spine[][] = [];

  private fsQuestionSpines: Spine[][] = [];

  private fsAimSpine = Spine.from({
    skeleton: 'fsAimData',
    atlas: 'fsAimAtlas',
  });

  private paylines = new Paylines();

  private isPortrait: boolean | undefined = undefined;

  private static REELS_COUNT = 5;

  private static ROWS_COUNT = 3;

  private static MIN_BASE_ROTATION_TIME = 1100;

  private static CLICKED_QUESTION_POSITIONS: number[][] = [];

  private static FS_AIM_REELS_POSITIONS: { reelIndex: number; rowIndex: number } = { reelIndex: 0, rowIndex: 0 };

  private static MIN_TURBO_ROTATION_TIME = 300;

  private static BASE_DELAY_BETWEEN_SYMBOLS = 20;

  private static TURBO_DELAY_BETWEEN_SYMBOLS = 0;

  private static IS_ANTICIPATION_PLAYED = false;

  private startRotationTime = 0;

  private isTurbo = false;

  private static reelsStopDelay: gsap.core.Tween;

  private static paylinesRepeatDelay: gsap.core.Tween;

  private static SYMBOL_TINT = 0x898989;

  private static SYMBOL_STRONG_TINT = 0x6e6e6e;

  private fsBonusShakeTimeline = new gsap.core.Timeline();

  private wildShakeTimeline = new gsap.core.Timeline();

  private regularWinContainer: RegularWin = new RegularWin();

  private cloningWildMultiplierTimeline = new gsap.core.Timeline();

  private isCloningWildMultiplierTimelineActive = false;

  private activeSlamStop = false;

  private anticipationEnd = false;

  private scatterSymbols: Spine[] = [];

  private cloningWildMultiplierSpine = Spine.from({
    skeleton: 'cloningWildMultiplier',
    atlas: 'cloningWildAtlas',
  });

  private cloningWildMultiplierText = new BitmapText({
    text: 'x2',
    style: { fontFamily: 'cloningWildFont', fontSize: 85 },
  });

  constructor() {
    super({
      landscapeData: {
        viewportWidth: 1920,
        viewportHeight: 1080,
        correctionOffsetX: -560,
        correctionOffsetY: -220,
      },
      portraitData: {
        viewportWidth: 1080,
        viewportHeight: 1920,
        correctionOffsetX: -290,
        correctionOffsetY: -580,
      },
    });

    this.createReels();
    this.createSymbolContainers();
    this.createChangeSpines();
    this.createCloningWildMultiplier();

    this.addChild(this.paylines);
    if (rootStore.gameStatusStore.isOnFSBonusMode) this.onQuestionRecovery();
    this.createFSAim();

    this.setupEvents();
    this.onResize(resizeObject.isPortrait);

    this.addChild(this.regularWinContainer);

    eventEmitter.on(CLONING_WILD_EVENTS.multiplierFlight, this.animateCloningWildMultiplier.bind(this));
  }

  private createCloningWildMultiplier(): void {
    this.cloningWildMultiplierSpine.visible = false;
    this.cloningWildMultiplierText.anchor.set(0.5, 1);

    this.cloningWildMultiplierSpine.addSlotObject('x_playsholder1', this.cloningWildMultiplierText);
    this.addChild(this.cloningWildMultiplierSpine);
  }

  private animateCloningWildMultiplier(): void {
    gameSound.playSound(SoundKey.CloningWildMultiplier);
    this.cloningWildMultiplierTimeline = gsap.timeline().to(this.cloningWildMultiplierSpine, {
      onStart: () => {
        this.isCloningWildMultiplierTimelineActive = true;
        const { cloningWildTransformations } = rootStore.dataStore;

        const cloningWildSymbol = Reels.symbolContainers![cloningWildTransformations!.position.reel]![
          cloningWildTransformations!.position.row
        ]!.children![0] as Spine;

        cloningWildSymbol.state.setAnimation(0, 'win');
        cloningWildSymbol.state.addAnimation(0, 'idle_1');
      },
      y: this.cloningWildMultiplierSpine.y - this.cloningWildMultiplierSpine.height / 2,
      duration: 0.4,
      onComplete: () => {
        this.cloningWildMultiplierTimeline.to(this.cloningWildMultiplierSpine, {
          y: this.regularWinContainer.position.y,
          x: this.regularWinContainer.position.x,
          duration: 0.6,
          ease: 'power2.in',
          onComplete: () => {
            this.regularWinContainer.regularWin.state.setAnimation(1, 'on_x2');

            this.regularWinContainer.bitMapText.text = rootStore.dataStore.withoutCurrency.formatCurrency(
              rootStore.dataStore.win,
            );

            this.removeAnimateCloningWildMultiplierTimelines();
          },
        });
      },
    });

    this.animateCloningWildMultiplierPulsation();
    this.animateCloningWildMultiplierScale();
  }

  private animateCloningWildMultiplierPulsation(): void {
    this.cloningWildMultiplierTimeline.to(
      this.cloningWildMultiplierSpine,
      {
        duration: 0.1,
        pixi: { alpha: 0.8 },
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      },
      0,
    );
  }

  private animateCloningWildMultiplierScale(): void {
    this.cloningWildMultiplierTimeline.to(this.cloningWildMultiplierSpine.scale, {
      duration: 0.4,
      x: 1.5,
      y: 1.5,
      onComplete: () => {
        this.cloningWildMultiplierTimeline.to(this.cloningWildMultiplierSpine.scale, {
          duration: 0.4,
          x: 0,
          y: 0,
          ease: 'power2.in',
        });
      },
    });
  }

  private removeAnimateCloningWildMultiplierTimelines(): void {
    gsap.globalTimeline.remove(this.cloningWildMultiplierTimeline);
    gsap.killTweensOf(this.cloningWildMultiplierTimeline);
    this.cloningWildMultiplierSpine.visible = false;
    this.cloningWildMultiplierSpine.scale.set(1);
    this.cloningWildMultiplierSpine.alpha = 1;
    this.cloningWildMultiplierSpine.state.setAnimation(0, 'hide_x2');
    this.isCloningWildMultiplierTimelineActive = false;
  }

  private setupEvents(): void {
    eventEmitter.on(REELS_EVENTS.startRotate, () => {
      this.startRotationTime = Date.now();
      this.isTurbo = gameSettingStore.isTurboMode;

      eventEmitter.once(REELS_EVENTS.stopRotate, () => {
        this.onStopRotate();
      });

      eventEmitter.once(REELS_EVENTS.slamStop, () => {
        this.activeSlamStop = true;

        Reels.reelsStopDelay.kill();
        this.onStop();
      });

      gameSound.playSounds([SoundKey.ReelsStart, SoundKey.ReelsLoop]);

      this.onStartRotate();
    });

    eventEmitter.on(REELS_EVENTS.playWinLines, () => {
      this.onPlayWinLines(0);
    });

    eventEmitter.on(REELS_EVENTS.cloningWildTransformations, () => {
      this.onCloningWildTransformations();
    });

    eventEmitter.on(REELS_EVENTS.wildTransformations, () => {
      rootStore.gameStatusStore.setHint(true, HintTextKeys.High1, 0);

      this.onWildTransformations(0);
    });

    eventEmitter.on(MYSTERY_FEATURE_EVENTS.playMysteryWinAnimation, (scatterReelPosition: PositionResponse) => {
      Reels.playMysteryAnimation(scatterReelPosition);
    });

    eventEmitter.on(MYSTERY_FEATURE_EVENTS.playQuestionSymbolChangeAnimation, (reelIndex: number, rowIndex: number) => {
      this.playQuestionSymbolChangeAnimation(reelIndex, rowIndex);
    });

    eventEmitter.on(
      MYSTERY_FEATURE_EVENTS.playAnticipationOnQuestionSymbol,
      (questionSymbol: Spine, reelIndex: number, rowIndex: number) => {
        this.playAnticipationOnQuestionSymbol(questionSymbol, reelIndex, rowIndex);
      },
    );

    eventEmitter.on(REELS_EVENTS.stopLines, () => {
      if (rootStore.gameStatusStore.isPaylinesRepeat) {
        Reels.paylinesRepeatDelay?.kill();
        rootStore.gameStatusStore.isPaylinesRepeat = false;
      }

      Reels.clearSymbolsTint();
      this.onStopWinLines();
    });

    eventEmitter.on(REELS_EVENTS.showFSBonusObjects, () => {
      this.onShowFSBonusSymbols();
      this.onShowFSAim();
      rootStore.gameStatusStore.setHint(true, HintTextKeys.BonusCapsule, 0);
    });

    eventEmitter.on(REELS_EVENTS.hideFSBonusObjects, () => {
      this.onHideFSBonusSymbols();
      this.fsAimSpine.renderable = false;
    });

    eventEmitter.on(SHAKE_EVENTS.fsBonusShake, () => {
      this.reels?.forEach((reelRow, reelIndex) => {
        reelRow.forEach((container, rowIndex) => {
          const x = this.isPortrait ? rowIndex * 289 : reelIndex * 270;
          const y = this.isPortrait ? reelIndex * 250 : rowIndex * 250;

          container.position.set(x, y);
        });
      });

      this.fsBonusShakeTimeline = fsBonusShake(this);
    });

    eventEmitter.on(SHAKE_EVENTS.wildShake, () => {
      this.reels?.forEach((reelRow, reelIndex) => {
        reelRow.forEach((container, rowIndex) => {
          const x = this.isPortrait ? rowIndex * 289 : reelIndex * 270;
          const y = this.isPortrait ? reelIndex * 250 : rowIndex * 250;

          container.position.set(x, y);
        });
      });

      this.wildShakeTimeline = wildShake(this);
    });
  }

  private onHideFSBonusSymbols(): void {
    const promises = [];
    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        promises.push(
          new Promise<void>((resolve) => {
            const symbol = Reels.symbolContainers![reelIndex]![rowIndex]!.children[0] as Spine;
            const questionSymbol = this.fsQuestionSpines[reelIndex]![rowIndex]!;
            symbol.state.setAnimation(0, 'show');
            symbol.renderable = true;

            const symbolListener = {
              complete: (entry: TrackEntry) => {
                if (entry.animation?.name.match(/show/)) {
                  symbol.state.setAnimation(0, Reels.getSymbolIdleAnim(symbol));
                  symbol.state.removeListener(symbolListener);
                }
              },
            };

            symbol.state.addListener(symbolListener);

            if (
              Reels.CLICKED_QUESTION_POSITIONS.some((element) => element[0] === reelIndex && element[1] === rowIndex)
            ) {
              questionSymbol.state.setAnimation(0, 'hide_crash');
            } else {
              questionSymbol.state.setAnimation(0, 'hide_question');
            }
            const questionSymbolListener = {
              complete: (entry: TrackEntry) => {
                if (entry.animation?.name.match(/hide/)) {
                  questionSymbol.renderable = false;
                  questionSymbol.removeSlotObject('numbers');
                  questionSymbol.off('pointerdown');
                  resolve();
                }
              },
            };
            questionSymbol.state.addListener(questionSymbolListener);
          }),
        );
      }
    }
    Promise.all(promises).then(() => {
      eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
    });
  }

  private onQuestionRecovery(): void {
    const { dataStore } = rootStore;

    this.onShowFSAim();

    rootStore.gameStatusStore.setHint(true, HintTextKeys.BonusCapsule, 0);

    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        const hit = dataStore.fsBonusShootResult?.hits.find(
          (element) => element.position.reel === reelIndex && element.position.row === rowIndex,
        );

        const questionSymbol = this.fsQuestionSpines[reelIndex]![rowIndex]!;

        if (hit) {
          if (hit.freespinsWon) {
            const bitMapText = new BitmapText({
              text: `+${hit.freespinsWon}`,
              style: { fontFamily: 'greenFont', fontSize: 45 },
            });

            bitMapText.anchor.set(0.5, 1.5);

            questionSymbol.addSlotObject('numbers', bitMapText);
          }

          questionSymbol.state.setAnimation(0, 'idle_crash', true);
        } else {
          questionSymbol.state.setAnimation(0, 'idle_question', true);
          this.setOnClickToQuestionSymbol(reelIndex, rowIndex);
        }

        questionSymbol.renderable = true;
      }
    }
  }

  private setOnClickToQuestionSymbol(reelIndex: number, rowIndex: number): void {
    const questionSymbol = this.fsQuestionSpines[reelIndex]![rowIndex]!;

    questionSymbol.hitArea = new Rectangle(-100, -150, 200, 200);

    questionSymbol.interactive = true;
    questionSymbol.cursor = 'pointer';

    questionSymbol.on('pointerdown', (event: FederatedPointerEvent) => {
      if (rootStore.gameStatusStore.canIShot && event.button === 0 && rootStore.gameStatusStore.isOnFSBonusMode) {
        questionSymbol.off('pointerdown');
        questionSymbol.interactive = false;
        questionSymbol.cursor = 'default';
        rootStore.gameStatusStore.canIShot = false;
        this.onFSAimShot(reelIndex, rowIndex).then(() => {
          const hit = rootStore.dataStore.hits.at(-1)!;
          const { fsBonusShootResult } = rootStore.dataStore;

          if (fsBonusShootResult) {
            const { hitsRemaining } = fsBonusShootResult;
            this.fsAimSpine.state.setAnimation(hitsRemaining + 1, `${hitsRemaining + 1}_hide`, false);
            eventEmitter.emit(SPIN_BUTTON_EVENTS.decrementSpinBtnCounter, hitsRemaining);
          }

          if (hit.freespinsWon) {
            const bitMapText = new BitmapText({
              text: `+${hit.freespinsWon}`,
              style: { fontFamily: 'greenFont', fontSize: 45 },
            });

            bitMapText.anchor.set(0.5, 1.5);

            questionSymbol.addSlotObject('numbers', bitMapText);
            gameSound.playSound(SoundKey.FSBonusShotWin);
          }

          eventEmitter.emit(SHAKE_EVENTS.fsBonusShake);
          questionSymbol.state.setAnimation(0, 'crash');

          const listener = {
            complete: (entry: TrackEntry) => {
              if (entry.animation?.name === 'crash') {
                questionSymbol.state.setAnimation(0, 'idle_crash', true);
                rootStore.gameStatusStore.canIShot = true;
                questionSymbol.state.removeListener(listener);
                eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
              }
            },
          };

          questionSymbol.state.addListener(listener);

          Reels.CLICKED_QUESTION_POSITIONS.push([reelIndex, rowIndex]);
        });
      }
    });
  }

  private createFSAim(): void {
    this.addChild(this.fsAimSpine);
    this.setupFSAimListeners();
  }

  private setupFSAimListeners(): void {
    this.fsAimSpine.state.addListener({
      complete: (entry: TrackEntry) => {
        if (entry.animation?.name === 'show') {
          this.fsAimSpine.state.setAnimation(0, 'idle', true);
        }

        if (entry.animation?.name === 'shot') {
          this.fsAimSpine.state.setAnimation(0, 'idle', true);
        }
      },
    });
  }

  private onShowFSAim(): void {
    this.fsAimSpine.state.setAnimation(0, 'show');
    this.fsAimSpine.renderable = true;
    const hitsRemaining = rootStore.dataStore.fsBonusShootResult?.hitsRemaining ?? 5;

    for (let index = 1; index <= hitsRemaining; index += 1) {
      this.fsAimSpine.state.setAnimation(index, `${index}`);
    }
    this.fsAimSpine.position.set(Reels.symbolContainers[2]![1]!.x + 10, Reels.symbolContainers[2]![1]!.y - 25);
    Reels.FS_AIM_REELS_POSITIONS = { reelIndex: 2, rowIndex: 1 };
  }

  private onFSAimShot(reel: number, row: number): Promise<void> {
    let canShowShootResult = false;
    let isFsAimShot = false;
    let isAnimationStopped = false;

    return new Promise<void>((resolve) => {
      eventEmitter.once(FREE_SPIN_EVENTS.showShootResult, () => {
        canShowShootResult = true;

        if (isFsAimShot) {
          resolve();
        }
      });

      Reels.FS_AIM_REELS_POSITIONS = { reelIndex: reel, rowIndex: row };

      eventEmitter.on(FREE_SPIN_EVENTS.aimShotAnimationStopped, () => {
        isAnimationStopped = true;
      });

      const completeAnimation = () => {
        isFsAimShot = true;
        this.setFsAimPosition(reel, row);
        this.fsAimSpine.state.setAnimation(0, 'shot');
        gameSound.playSound(SoundKey.FSBonusShot);

        if (canShowShootResult) {
          resolve();
        }
      };

      const targetX = Reels.symbolContainers[reel]![row]!.x + 10;
      const targetY = Reels.symbolContainers[reel]![row]!.y - 25;

      if (this.fsAimSpine.x === targetX && this.fsAimSpine.y === targetY) {
        eventEmitter.emit(FREE_SPIN_EVENTS.questionSymbolShotRequest, { reel, row });
        completeAnimation();
      } else {
        gsap.to(this.fsAimSpine, {
          duration: 0.5,
          x: targetX,
          y: targetY,
          onStart: () => {
            eventEmitter.emit(FREE_SPIN_EVENTS.questionSymbolShotRequest, { reel, row });
          },
          onUpdate: () => {
            if (isAnimationStopped) {
              gsap.killTweensOf(this.fsAimSpine);
              completeAnimation();
            }
          },
          onComplete: () => {
            if (!isAnimationStopped) {
              completeAnimation();
            }
          },
        });
      }
    });
  }

  private setFsAimPosition(reelIndex: number, rowIndex: number): void {
    if (reelIndex >= 0 && rowIndex >= 0) {
      const x = this.isPortrait ? rowIndex * 289 + 10 : reelIndex * 270 + 10;
      const y = this.isPortrait ? reelIndex * 250 - 25 : rowIndex * 250 - 25;

      this.fsAimSpine.position.set(x, y);
    }
  }

  private onShowFSBonusSymbols(): void {
    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        const symbol = Reels.symbolContainers![reelIndex]![rowIndex]!.children[0] as Spine;
        const questionSymbol = this.fsQuestionSpines[reelIndex]![rowIndex]!;
        symbol.state.setAnimation(0, 'hide');

        const listener = {
          complete: (entry: TrackEntry) => {
            if (entry.animation?.name === 'hide') {
              symbol.renderable = false;
              symbol.state.removeListener(listener);
            }
          },
        };
        symbol.state.addListener(listener);

        questionSymbol.renderable = true;
        questionSymbol.state.setAnimation(0, 'show_question');

        const questionSymbolListener = {
          complete: (entry: TrackEntry) => {
            if (entry.animation?.name === 'show_question') {
              questionSymbol.state.setAnimation(0, 'idle_question', true);
              this.setOnClickToQuestionSymbol(reelIndex, rowIndex);
              questionSymbol.state.removeListener(questionSymbolListener);
            }
          },
        };
        questionSymbol.state.addListener(questionSymbolListener);
      }
    }
  }

  private onWildTransformations(transformationIndex: number): void {
    const transformation = rootStore.dataStore.wildTransformations![transformationIndex];

    if (!transformation) {
      rootStore.gameStatusStore.setHint(false);
      eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
      return;
    }

    const promises: Promise<void>[] = [];
    const transformationTriggerSymbols: Spine[] = [];

    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        if (Array.isArray(transformation.position)) {
          if (
            !transformation.position.some((pos) => pos.reel === reelIndex && pos.row === rowIndex) &&
            !transformation.transformations!.some(
              (transformationSymbol) =>
                transformationSymbol.position.reel === reelIndex && transformationSymbol.position.row === rowIndex,
            )
          ) {
            const symbol = Reels.symbolContainers![reelIndex]![rowIndex]!.children![0] as Spine;
            symbol.tint = Reels.SYMBOL_TINT;
          }
        } else if (
          !(
            (transformation!.position as PositionResponse).reel === reelIndex &&
            (transformation!.position as PositionResponse).row === rowIndex
          ) &&
          !transformation.transformations!.some(
            (transformationSymbol) =>
              transformationSymbol.position.reel === reelIndex && transformationSymbol.position.row === rowIndex,
          )
        ) {
          const symbol = Reels.symbolContainers![reelIndex]![rowIndex]!.children![0] as Spine;
          symbol.tint = Reels.SYMBOL_TINT;
        }
      }
    }

    if (Array.isArray(transformation.position)) {
      transformation.position.forEach((position) => {
        transformationTriggerSymbols.push(Reels.symbolContainers![position.reel]![position.row]!.children![0] as Spine);
      });
    } else {
      transformationTriggerSymbols.push(
        Reels.symbolContainers![(transformation!.position as PositionResponse).reel]![
          (transformation!.position as PositionResponse).row
        ]!.children![0] as Spine,
      );
    }

    transformationTriggerSymbols.forEach((element, index) => {
      element.state.setAnimation(0, 'skip2');

      gameSound.restartSound(SoundKey.WildSkip);

      const triggerSymbolListener = {
        event: (entry: TrackEntry, event: Event) => {
          if (event.data.name === 'onStartChange' && index === transformationTriggerSymbols.length - 1) {
            transformation?.transformations?.forEach((transformationElement) => {
              promises.push(this.playWildTransformationAnim(transformationElement));
            });

            eventEmitter.emit(SHAKE_EVENTS.wildShake);

            Promise.all(promises).then(() => {
              transformationTriggerSymbols.forEach((element_) => {
                element_.state.clearTrack(1);
                element_.skeleton.setToSetupPose();
              });

              transformation?.transformations?.forEach((transformationElement) => {
                const symbol = Reels.symbolContainers![transformationElement.position.reel]![
                  transformationElement.position.row
                ]!.children![0] as Spine;

                symbol.state.clearTrack(1);
                symbol.skeleton.setToSetupPose();
              });
              Reels.clearSymbolsTint();
              this.onWildTransformations(transformationIndex + 1);
            });
          }

          if (event.data.name === 'onHandsHit' && index === transformationTriggerSymbols.length - 1) {
            eventEmitter.emit(SHAKE_EVENTS.wildShake);

            transformationTriggerSymbols.forEach((element_) => {
              element_.state.setAnimation(1, 'show_select_ring');
              element_.state.addAnimation(1, 'select_ring');
            });

            transformation?.transformations?.forEach((transformationElement) => {
              const symbol = Reels.symbolContainers![transformationElement.position.reel]![
                transformationElement.position.row
              ]!.children![0] as Spine;

              symbol.state.setAnimation(1, 'show_select_ring');
              symbol.state.addAnimation(1, 'select_ring');
            });
          }
        },
        complete: (entry: TrackEntry) => {
          if (entry!.animation!.name === 'skip') {
            element.state.setAnimation(0, Reels.getSymbolIdleAnim(element));
            element.state.removeListener(triggerSymbolListener);
          }
          if (entry!.animation!.name === 'skip2') {
            element.state.setAnimation(0, 'skip');
          }
        },
      };

      element.state.addListener(triggerSymbolListener);
    });
  }

  private playWildTransformationAnim(transformation: TransformationsResponse): Promise<void> {
    return new Promise<void>((resolve) => {
      const transformationFromSymbol =
        Reels.symbolContainers![transformation.position.reel]![transformation.position.row]!.children![0];
      let transformationToSymbol: Spine;

      const reelSymbol = symbolsMap.get(transformation.symbol);

      if (reelSymbol) {
        const skip = this.wildChangeSpines![transformation.position.reel]![transformation.position.row];

        if (skip) {
          skip!.position.set(
            Reels.symbolContainers[transformation.position.reel]![transformation.position.row]!.x,
            Reels.symbolContainers[transformation.position.reel]![transformation.position.row]!.y,
          );
          skip.state.setAnimation(0, 'skip_wild');

          setTimeout(() => {
            skip.renderable = true;
          }, 0);

          const skipEventCallback = {
            complete: () => {
              skip.renderable = false;
              skip.state.removeListener(skipEventCallback);
            },
            event: (entry: TrackEntry, event: Event) => {
              if (event.data.name === 'onStartChange') {
                transformationFromSymbol!.autoUpdate = false;
                transformationFromSymbol!.state.clearTracks();
                transformationFromSymbol!.skeleton.setToSetupPose();

                setTimeout(() => {
                  transformationFromSymbol!.destroy(true);

                  transformationToSymbol = Reels.createSymbol(
                    reelSymbol,
                    transformation.position.reel,
                    transformation.position.row,
                  );
                  transformationToSymbol.state.setAnimation(0, Reels.getSymbolIdleAnim(transformationToSymbol));
                  Reels.symbolContainers![transformation.position.reel]![transformation.position.row]!.addChild(
                    transformationToSymbol,
                  );
                  resolve();
                }, 0);
              }
            },
          };

          skip.state.addListener(skipEventCallback);
        } else {
          throw new Error(
            `Change spine [${transformation.position.reel}], [${transformation.position.row}] does not exist`,
          );
        }
      } else {
        throw new Error(`Reel symbol ${reelSymbol} does not exist`);
      }
    });
  }

  private onCloningWildTransformations(): void {
    const { cloningWildTransformations, cloningWildMultiplier } = rootStore.dataStore;

    const promises: Promise<void>[] = [];

    const { x, y } =
      Reels.symbolContainers![cloningWildTransformations!.position.reel]![cloningWildTransformations!.position.row]!
        .position;

    this.cloningWildMultiplierSpine.position.set(x, y);

    const cwSymbol = Reels.symbolContainers![cloningWildTransformations!.position.reel]![
      cloningWildTransformations!.position.row
    ]!.children![0] as Spine;

    this.cloningWildMultiplierText.text = `x${cloningWildMultiplier}`;

    this.cloningWildMultiplierSpine.visible = true;

    const multiplier = this.cloningWildMultiplierSpine;
    multiplier.state.setAnimation(0, 'show_x2');
    multiplier.state.addAnimation(0, 'idle_x2', true);

    cwSymbol.state.setAnimation(0, 'win');
    gameSound.restartSound(SoundKey.CloningWild);

    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        if (
          !(
            cloningWildTransformations!.position.reel === reelIndex &&
            cloningWildTransformations!.position.row === rowIndex
          ) &&
          !cloningWildTransformations!.transformations!.some(
            (transformationSymbol) =>
              transformationSymbol.position.reel === reelIndex && transformationSymbol.position.row === rowIndex,
          )
        ) {
          const symbol = Reels.symbolContainers![reelIndex]![rowIndex]!.children![0] as Spine;
          symbol.tint = Reels.SYMBOL_TINT;
        }
      }
    }

    const cwListener = {
      event: (entry: TrackEntry, event: Event) => {
        if (event.data.name === 'onStartChange') {
          cwSymbol.state.setAnimation(0, Reels.getSymbolIdleAnim(cwSymbol));
          cwSymbol.state.removeListener(cwListener);

          cloningWildTransformations?.transformations?.forEach((element) => {
            promises.push(this.playCloningWildTransformationAnim(element));
          });

          Promise.all(promises).then(() => {
            Reels.clearSymbolsTint();
            eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
          });
        }
      },
    };

    cwSymbol.state.addListener(cwListener);
  }

  private playCloningWildTransformationAnim(transformation: TransformationsResponse): Promise<void> {
    return new Promise<void>((resolve) => {
      const transformationFromSymbol =
        Reels.symbolContainers![transformation.position.reel]![transformation.position.row]!.children![0];
      let transformationToSymbol: Spine;

      const reelSymbol = symbolsMap.get(transformation.symbol);

      if (reelSymbol) {
        const change = this.cloningWildChangeSpines![transformation.position.reel]![transformation.position.row];

        if (change) {
          change.state.setAnimation(0, 'change');

          setTimeout(() => {
            change.renderable = true;
          }, 0);

          const changeCallback = {
            complete: (entry: TrackEntry) => {
              if (entry.animation?.name === 'change') {
                change.renderable = false;
                change.state.removeListener(changeCallback);
                resolve();
              }
            },
          };

          change.state.addListener(changeCallback);

          transformationFromSymbol!.state.setAnimation(0, 'hide');
          transformationFromSymbol!.state.addListener({
            complete: (entry: TrackEntry) => {
              if (entry.animation?.name === 'hide') {
                transformationFromSymbol!.destroy(true);

                transformationToSymbol = Reels.createSymbol(
                  reelSymbol,
                  transformation.position.reel,
                  transformation.position.row,
                );
                transformationToSymbol.state.setAnimation(0, 'show');
                Reels.symbolContainers![transformation.position.reel]![transformation.position.row]!.addChild(
                  transformationToSymbol,
                );

                const transformationToSymbolListener = {
                  complete: (toSymbolEntry: TrackEntry) => {
                    if (toSymbolEntry.animation?.name === 'show') {
                      transformationToSymbol.state.setAnimation(0, Reels.getSymbolIdleAnim(transformationToSymbol));
                      transformationToSymbol.state.removeListener(transformationToSymbolListener);
                    }
                  },
                };

                transformationToSymbol.state.addListener(transformationToSymbolListener);
              }
            },
          });
        } else {
          throw new Error(
            `Change spine [${transformation.position.reel}], [${transformation.position.row}] does not exist`,
          );
        }
      } else {
        throw new Error(`Reel symbol ${reelSymbol} does not exist`);
      }
    });
  }

  private onPlayWinLines(lineN: number): void {
    const { dataStore, gameStatusStore } = rootStore;
    const paylines = dataStore.payLines;
    const promises: Promise<void>[] = [];
    let symbolName: ReelSymbol;
    const uniqueWinLineSymbols = new Set<ReelSymbol>();

    if (paylines[lineN] === undefined) {
      if (gameStatusStore.isPaylinesRepeat) {
        Reels.paylinesRepeatDelay = gsap.delayedCall(3, () => {
          eventEmitter.emit(REELS_EVENTS.playWinLines);
        });
      } else {
        eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
      }
    } else {
      let wasCracksStarted = false;

      for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
        const symbolLineN = paylines[lineN].line[reelIndex];

        for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
          const symbol = Reels.symbolContainers![reelIndex]![rowIndex]!.children[0];

          if (symbolLineN === rowIndex) {
            promises.push(
              // eslint-disable-next-line @typescript-eslint/no-loop-func
              new Promise<void>((resolve) => {
                symbolName = dataStore.finalFrame![reelIndex]![rowIndex]!;

                const animationName = 'win';

                uniqueWinLineSymbols.add(symbolName);

                symbol!.state.setAnimation(0, animationName);

                const listener = {
                  event: (entry: TrackEntry, event: Event) => {
                    if (event.data.name === 'cracks' && !wasCracksStarted && !gameStatusStore.isPaylinesRepeat) {
                      wasCracksStarted = true;
                      eventEmitter.emit(SCREEN_EVENTS.high3);
                      for (let jumpReelIndex = 0; jumpReelIndex < Reels.REELS_COUNT; jumpReelIndex += 1) {
                        for (let jumpRowIndex = 0; jumpRowIndex < Reels.ROWS_COUNT; jumpRowIndex += 1) {
                          const jumpSymbol = Reels.symbolContainers![jumpReelIndex]![jumpRowIndex]!
                            .children[0] as Spine;

                          if (
                            jumpSymbol.skeleton.data.findAnimation('jump') &&
                            jumpSymbol.state.tracks[0]?.animation?.name !== 'win'
                          ) {
                            const jumpListener = {
                              complete: (jumpEntry: TrackEntry) => {
                                if (jumpEntry.animation?.name === 'jump') {
                                  jumpSymbol.state.setAnimation(0, Reels.getSymbolIdleAnim(symbol as Spine));
                                  jumpSymbol.state.removeListener(listener);
                                }
                              },
                            };

                            jumpSymbol.state.addListener(jumpListener);
                            jumpSymbol.state.setAnimation(0, 'jump');
                          }
                        }
                      }
                    }
                  },
                  complete: (entry: TrackEntry) => {
                    if (entry.animation?.name === animationName) {
                      symbol!.state.setAnimation(0, Reels.getSymbolIdleAnim(symbol as Spine));
                      symbol!.state.removeListener(listener);
                      resolve();
                    }
                  },
                };

                symbol!.state.addListener(listener);
              }),
            );
          } else {
            symbol!.tint = Reels.SYMBOL_TINT;
          }
        }
      }

      if (uniqueWinLineSymbols.has('wild') && !gameStatusStore.isPaylinesRepeat) {
        gameStatusStore.setHint(true, HintTextKeys.wild);
      }

      this.paylines.playPaylineAnim(resizeObject.isPortrait, paylines![lineN]!.lineId);
      eventEmitter.emit(POPUPS_EVENTS.showLineWin, paylines![lineN]!.value);

      const soundPromises = [...uniqueWinLineSymbols].map((symbol) => gameSound.playSymbolSound(symbol as ReelSymbol));

      Promise.all(soundPromises).then(() => {
        this.paylines.playPaylineAnim(resizeObject.isPortrait, paylines![lineN]!.lineId);
      });

      Promise.all(promises).then(() => {
        Reels.clearSymbolsTint();
        this.onPlayWinLines(lineN + 1);
      });
    }
  }

  private static clearSymbolsTint(): void {
    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        if (rootStore.dataStore.finalFrame![reelIndex]![rowIndex] !== 'question') {
          const symbol = Reels.symbolContainers![reelIndex]![rowIndex]!.children[0];
          symbol!.tint = 0xffffff;
        }
      }
    }
  }

  private onStopWinLines(): void {
    this.paylines.clearState();
    eventEmitter.emit(POPUPS_EVENTS.hideLineWin);

    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        const symbol = Reels.symbolContainers![reelIndex]![rowIndex]!.children![0] as Spine;
        symbol.state.clearListeners();

        symbol.state.addListener({
          complete: (entry: TrackEntry) => {
            if (entry.animation?.name.match(/idle/)) {
              symbol.state.setAnimation(0, Reels.getSymbolIdleAnim(symbol));
            }
          },
        });

        symbol.state.setAnimation(0, Reels.getSymbolIdleAnim(symbol));
      }
    }
    eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
  }

  private onStartRotate(): void {
    this.activeSlamStop = false;

    let symbolN = 0;

    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        gsap.delayedCall(
          (this.isTurbo ? Reels.TURBO_DELAY_BETWEEN_SYMBOLS : Reels.BASE_DELAY_BETWEEN_SYMBOLS * symbolN) / 1000,
          () => {
            this.reels![reelIndex]![rowIndex]!.state.setAnimation(0, Reels.getReelsRandomAnim('show'));
            Reels.symbolContainers![reelIndex]![rowIndex]!.children[0]!.state.setAnimation(0, 'hide');
          },
        );

        symbolN += 1;
      }
    }
  }

  private onStopRotate(): void {
    const time =
      ((this.isTurbo ? Reels.MIN_TURBO_ROTATION_TIME : Reels.MIN_BASE_ROTATION_TIME) -
        (Date.now() - this.startRotationTime)) /
      1000;

    Reels.reelsStopDelay = gsap.delayedCall(time < 0 ? 0.001 : time, () => {
      eventEmitter.off(REELS_EVENTS.slamStop);
      this.onStop();
    });
  }

  private onStop(): void {
    const anticipationInfo = Reels.getAnticipationInfo();

    const promises: Promise<void>[] = [];

    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      if (anticipationInfo[reelIndex]) {
        promises.push(this.startAnticipation(reelIndex, anticipationInfo));

        reelIndex = Reels.REELS_COUNT;
      } else {
        for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
          promises.push(this.stopReel(reelIndex, rowIndex, anticipationInfo));
        }
      }
    }

    Promise.all(promises).then(() => {
      gameSound.stopSounds([SoundKey.ReelsStart, SoundKey.ReelsLoop]);
      gameSound.playSound(SoundKey.ReelsStop);

      const { dataStore } = rootStore;

      for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
        for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
          const symbol = Reels.symbolContainers![reelIndex]![rowIndex]!.children[0];
          symbol!.tint = 0xffffff;
        }
      }

      if (dataStore.nextGameMode === GameMode.MysteryFeatureChosen) {
        for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
          for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
            if (dataStore.frame![reelIndex]![rowIndex] !== 'question') {
              const symbol = Reels.symbolContainers![reelIndex]![rowIndex]!.children[0];
              symbol!.tint = Reels.SYMBOL_STRONG_TINT;
            }
          }
        }
      }

      eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
    });
    AnalyticsManager.instance.logRoundInfo(
      gameSettingStore.isTurboMode,
      this.activeSlamStop,
      !!rootStore.autoplayStore.autoPlaySpinsLeft,
      rootStore.autoplayStore.autoPlaySpinsLeft,
    );
  }

  private stopReel(
    reelIndex: number,
    rowIndex: number,
    anticipationInfo: boolean[],
    isAnticipationStop = false,
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const { dataStore, errorStore } = rootStore;
      const frame = errorStore.isInsufficientFunds ? dataStore.finalFrame : dataStore.frame;

      gsap.delayedCall(
        (this.isTurbo
          ? Reels.TURBO_DELAY_BETWEEN_SYMBOLS
          : Reels.BASE_DELAY_BETWEEN_SYMBOLS * (isAnticipationStop ? 0 : reelIndex * Reels.ROWS_COUNT + rowIndex)) /
          1000,
        () => {
          this.reels![reelIndex]![rowIndex]!.state.setAnimation(0, Reels.getReelsRandomAnim('hide'));

          const symbolFrame = frame![reelIndex]![rowIndex];
          const symbol = Reels.createSymbol(symbolFrame as ReelSymbol, reelIndex, rowIndex);

          symbol.state.setAnimation(0, 'show');

          if (symbolFrame === 'wild') {
            gameSound.restartSound(SoundKey.Wild);
          }

          if (symbolFrame !== 'scatter' && anticipationInfo.some(Boolean)) {
            symbol.tint = Reels.SYMBOL_TINT;
          }

          const listener = {
            complete: (entry: TrackEntry) => {
              if (entry.animation?.name.match(/show/)) {
                if (symbolFrame === 'scatter' && anticipationInfo.some(Boolean)) {
                  symbol.state.setAnimation(0, 'anticipation', true);
                  this.scatterSymbols.push(symbol);
                } else {
                  symbol.state.setAnimation(0, Reels.getSymbolIdleAnim(symbol));
                }
                symbol.state.removeListener(listener);
                resolve();
              }
              if (anticipationInfo.some(Boolean) && this.anticipationEnd) {
                this.scatterSymbols.forEach((element_) => {
                  element_.state.setAnimation(0, 'idle_1');
                });

                this.scatterSymbols = [];
              }
            },
          };

          if (symbolFrame === 'scatter') {
            rootStore.gameStatusStore.setHint(true, HintTextKeys.Scatter);
          }

          symbol.state.addListener(listener);

          Reels.symbolContainers![reelIndex]![rowIndex]!.children[0]!.destroy(true);
          Reels.symbolContainers![reelIndex]![rowIndex]!.addChild(symbol);
        },
      );
    });
  }

  private async startAnticipation(index: number, anticipationInfo: boolean[]): Promise<void> {
    return new Promise<void>((resolve) => {
      this.anticipationEnd = false;

      eventEmitter.emit(SHAKE_EVENTS.playAnticipationShake);

      gameSound.playSound(SoundKey.AnticipationLoop);

      this.anticipationSpines![index]!.forEach((element) => {
        element.state.setAnimation(0, 'anticipation_show', false);

        element.state.addListener({
          complete: (entry: TrackEntry) => {
            if (entry.animation?.name === 'anticipation_show') {
              element.state.setAnimation(0, 'anticipation_idle', false);
            }

            if (entry.animation?.name === 'anticipation_idle') {
              element.state.setAnimation(0, 'anticipation_hide', false);
              element.state.clearListeners();

              const promises: Promise<void>[] = [];

              if (index + 1 <= Reels.REELS_COUNT && anticipationInfo[index + 1]) {
                for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
                  promises.push(this.stopReel(index, rowIndex, anticipationInfo, true));
                }
              } else {
                this.anticipationEnd = true;

                for (let reelIndex = index; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
                  for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
                    promises.push(this.stopReel(reelIndex, rowIndex, anticipationInfo, true));
                  }
                }
              }

              Promise.all(promises).then(() => {
                gameSound.pauseSound(SoundKey.AnticipationLoop);
                gameSound.playSound(SoundKey.AnticipationOut);
                if (this.anticipationEnd || index + 1 >= Reels.REELS_COUNT) {
                  resolve();
                  return;
                }

                this.startAnticipation(index + 1, anticipationInfo).then(() => {
                  gameSound.stopSound(SoundKey.AnticipationLoop);
                  resolve();
                });
              });
            }
          },
        });
      });
    });
  }

  private static getAnticipationInfo(): boolean[] {
    const { dataStore } = rootStore;
    const anticipationInfo: boolean[] = [false, false, false, false, false];
    let scattersCount = 0;

    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        if (dataStore.frame![reelIndex]![rowIndex] === 'scatter') {
          scattersCount += 1;
        }
      }

      if (reelIndex > 1 && scattersCount >= 2) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        return anticipationInfo.map((element, index) =>
          scattersCount === 2 ? reelIndex < index : reelIndex <= index,
        ) as [boolean, boolean, boolean, boolean, boolean];
      }
    }

    return anticipationInfo;
  }

  private static playMysteryAnimation = ({ reel, row }: PositionResponse) => {
    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        const symbol = Reels.symbolContainers![reelIndex]![rowIndex]!.children[0];
        if (reel === reelIndex && row === rowIndex) {
          gameSound.playSound(SoundKey.ScatterCoin);
          symbol!.state.setAnimation(0, 'win');

          symbol!.state.addListener({
            complete: (entry: TrackEntry) => {
              if (entry.animation?.name === 'win') {
                Reels.clearSymbolsTint();
                rootStore.gameStatusStore.setShowAnnouncer(true, AnnouncerTypes.ShowMystery);
              }
            },
          });
        } else {
          symbol!.tint = Reels.SYMBOL_STRONG_TINT;
        }
      }
    }
  };

  private playAnticipationOnQuestionSymbol(questionSymbol: Spine, reelIndex: number, rowIndex: number): void {
    questionSymbol.tint = 0xffffff;

    const anticipationSpine = this.anticipationSpines[reelIndex]![rowIndex]!;
    const reelRotateSpine = this.reels[reelIndex]![rowIndex]!;
    Reels.IS_ANTICIPATION_PLAYED = false;

    const questionSymbolListener = {
      complete: (entry: TrackEntry) => {
        if (entry.animation?.name === 'select') {
          reelRotateSpine.state.setAnimation(0, Reels.getReelsRandomAnim('show'));
          anticipationSpine.state.setAnimation(0, 'anticipation_question_show', false);
          gameSound.playSound(SoundKey.AnticipationLoop);
          questionSymbol.state.removeListener(questionSymbolListener);
        }
      },
    };
    questionSymbol.state.addListener(questionSymbolListener);

    const reelRotateListener = {
      complete: (entry: TrackEntry) => {
        if (entry.animation?.name.includes('show')) {
          reelRotateSpine.state.setAnimation(0, Reels.getReelsRandomAnim('idle'), true);
          reelRotateSpine.state.removeListener(reelRotateListener);
        }
      },
    };
    reelRotateSpine.state.addListener(reelRotateListener);

    const anticipationListener = {
      complete: (entry: TrackEntry) => {
        if (entry.animation?.name === 'anticipation_question_show') {
          anticipationSpine.state.setAnimation(0, 'anticipation_question_idle', true);
          Reels.IS_ANTICIPATION_PLAYED = true;
          anticipationSpine.state.removeListener(anticipationListener);
        }
      },
    };
    anticipationSpine.state.addListener(anticipationListener);
  }

  private playQuestionSymbolChangeAnimation(reelIndex: number, rowIndex: number): void {
    const anticipationSpine = this.anticipationSpines[reelIndex]![rowIndex]!;
    const reelRotateSpine = this.reels[reelIndex]![rowIndex]!;

    if (Reels.IS_ANTICIPATION_PLAYED) {
      anticipationSpine.state.setAnimation(0, 'anticipation_question_hide', false);
      reelRotateSpine.state.setAnimation(0, Reels.getReelsRandomAnim('hide'), false);
      gameSound.stopSound(SoundKey.AnticipationLoop);
      gameSound.playSound(SoundKey.AnticipationOut);

      Reels.replaceSymbol(reelIndex, rowIndex);
    } else {
      const anticipationSpineListener = {
        complete: (entry: TrackEntry) => {
          if (entry.animation?.name === 'anticipation_question_idle') {
            anticipationSpine.state.setAnimation(0, 'anticipation_question_hide', false);
            reelRotateSpine.state.setAnimation(0, Reels.getReelsRandomAnim('hide'), false);
            gameSound.stopSound(SoundKey.AnticipationLoop);
            gameSound.playSound(SoundKey.AnticipationOut);

            Reels.replaceSymbol(reelIndex, rowIndex);
            anticipationSpine.state.removeListener(anticipationSpineListener);
          }
        },
      };
      anticipationSpine.state.addListener(anticipationSpineListener);
    }
  }

  private static replaceSymbol(reelIndex: number, rowIndex: number) {
    const { mysteryFeatureData, frame } = rootStore.dataStore;
    if (!mysteryFeatureData) return;

    const changedSymbolName = symbolsMap.get(mysteryFeatureData.userSelect.symbol);
    const userSelectedPosition = Reels.symbolContainers[reelIndex]![rowIndex]!;

    userSelectedPosition.children[0]!.destroy(true);

    const changedSymbol = Reels.createSymbol(changedSymbolName!, reelIndex, rowIndex);
    changedSymbol.state.setAnimation(0, 'show');

    const symbolShowListener = {
      complete: (toSymbolEntry: TrackEntry) => {
        if (toSymbolEntry.animation?.name.match(/show/)) {
          changedSymbol.state.setAnimation(0, Reels.getSymbolIdleAnim(changedSymbol));
          eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
          changedSymbol.state.removeListener(symbolShowListener);
          Reels.clearSymbolsTint();
        }
      },
    };
    changedSymbol.state.addListener(symbolShowListener);

    userSelectedPosition.addChild(changedSymbol);
    frame![reelIndex]![rowIndex] = changedSymbolName!;
  }

  private createReels(): void {
    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      const reel = [];
      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        const reelSpine = Spine.from({
          skeleton: 'reelsData',
          atlas: 'reelsAtlas',
        });

        reelSpine.state.addListener({
          complete: (entry: TrackEntry) => {
            if (entry.animation?.name.match(/show/)) {
              reelSpine.state.setAnimation(0, Reels.getReelsRandomAnim('idle'));
            }

            if (entry.animation?.name.match(/idle/)) {
              reelSpine.state.setAnimation(0, Reels.getReelsRandomAnim('idle'));
            }
          },
        });

        reel.push(reelSpine);
        this.addChild(reelSpine);
      }

      this.reels.push(reel);
    }
  }

  private static getReelsRandomAnim(prefix: string): string {
    return `${prefix}_${getRandomInt(1, 4)}`;
  }

  static getSymbolIdleAnim(symbol: Spine): string {
    const idleAnim = `idle_${getRandomInt(1, 4)}`;
    return symbol.skeleton.data.findAnimation(idleAnim) ? idleAnim : 'idle_1';
  }

  private createChangeSpines(): void {
    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      const reelCWChangeSpines: Spine[] = [];
      const reelWildChangeSpines: Spine[] = [];
      const reelQuestionChangeSpines: Spine[] = [];

      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        const cwChangeSpine = Spine.from({
          skeleton: 'cloningWildChangeData',
          atlas: 'cloningWildAtlas',
        });

        cwChangeSpine.renderable = false;
        reelCWChangeSpines.push(cwChangeSpine);

        const wildChangeSpine = Spine.from({
          skeleton: 'skipVfxData',
          atlas: 'skipVfxAtlas',
        });

        wildChangeSpine.renderable = false;
        reelWildChangeSpines.push(wildChangeSpine);

        const questionSpine = Spine.from({
          skeleton: 'fsQuestionData',
          atlas: 'fsQuestionAtlas',
        });

        questionSpine.renderable = false;
        reelQuestionChangeSpines.push(questionSpine);

        this.addChild(cwChangeSpine, wildChangeSpine, questionSpine);
      }

      this.cloningWildChangeSpines.push(reelCWChangeSpines);
      this.wildChangeSpines.push(reelWildChangeSpines);
      this.fsQuestionSpines.push(reelQuestionChangeSpines);
    }
  }

  private createSymbolContainers(): void {
    for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
      const reelContainers = [];
      const anticipationContainers = [];

      for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
        const container = new Container<Spine>();
        reelContainers.push(container);

        const frame = rootStore.dataStore.finalFrame![reelIndex]![rowIndex];
        const symbol = Reels.createSymbol(frame as ReelSymbol, reelIndex, rowIndex);
        if (rootStore.gameStatusStore.isOnFSBonusMode) {
          symbol.renderable = false;
        } else {
          symbol.state.setAnimation(0, Reels.getSymbolIdleAnim(symbol));
        }

        if (rootStore.dataStore.nextGameMode === GameMode.MysteryFeatureChosen && frame !== 'question') {
          symbol.tint = Reels.SYMBOL_STRONG_TINT;
        }
        if (rootStore.dataStore.nextGameMode !== GameMode.MysteryFeatureChosen && frame === 'question') {
          symbol.tint = Reels.SYMBOL_STRONG_TINT;
        }

        container.addChild(symbol);

        const anticipation = Spine.from({
          skeleton: 'anticipationData',
          atlas: 'anticipationAtlas',
        });

        anticipationContainers.push(anticipation);
        this.addChild(container, anticipation);
      }

      this.anticipationSpines.push(anticipationContainers);
      Reels.symbolContainers.push(reelContainers);
    }
  }

  private static createSymbol(symbolName: ReelSymbol, reelIndex: number, rowIndex: number): Spine {
    let symbol: Spine;

    if (symbolName === 'question') {
      symbol = Spine.from({
        skeleton: 'lowQuestionData',
        atlas: 'lowSymbolAtlas',
      });
    } else if (symbolName === 'questionGold') {
      symbol = Spine.from({
        skeleton: 'lowQuestionGoldData',
        atlas: 'lowSymbolAtlas',
      });
    } else {
      symbol = Spine.from({
        skeleton: `${symbolName}Data`,
        atlas: symbolName.match('low') ? 'lowSymbolAtlas' : `${symbolName}Atlas`,
      });
    }

    if (symbolName !== 'wild' && symbolName !== 'scatter' && symbolName !== 'cloningWild') {
      symbol.hitArea = new Rectangle(-100, -150, 200, 200);
      symbol.interactive = true;
      symbol.cursor = 'pointer';
    }

    symbol.state.addListener({
      complete: (entry: TrackEntry) => {
        if (entry.animation?.name.match(/idle/)) {
          symbol.state.setAnimation(0, Reels.getSymbolIdleAnim(symbol));
        }
      },
    });

    if (symbolName === 'question') {
      symbol.on('pointerdown', (event: FederatedPointerEvent) => {
        if (event.button === 0 && rootStore.stateMachine.phase === Phase.MysteryFeatureChoose) {
          for (
            let questionSymbolReelIndex = 0;
            questionSymbolReelIndex < Reels.REELS_COUNT;
            questionSymbolReelIndex += 1
          ) {
            for (
              let questionSymbolRowIndex = 0;
              questionSymbolRowIndex < Reels.ROWS_COUNT;
              questionSymbolRowIndex += 1
            ) {
              if (rootStore.dataStore.frame[questionSymbolReelIndex]![questionSymbolRowIndex] === 'question') {
                const questionSymbol =
                  Reels.symbolContainers[questionSymbolReelIndex]![questionSymbolRowIndex]!.children[0];
                questionSymbol!.off('pointerdown');
                questionSymbol!.tint = Reels.SYMBOL_TINT;
              }
            }
          }

          symbol.state.setAnimation(0, 'select');
          eventEmitter.emit(MYSTERY_FEATURE_EVENTS.mysteryChosen, reelIndex, rowIndex);
          eventEmitter.emit(MYSTERY_FEATURE_EVENTS.playAnticipationOnQuestionSymbol, symbol, reelIndex, rowIndex);
          rootStore.gameStatusStore.setHint(false);
          gameSound.playSound(SoundKey.QuestTap);
        }
      });
    }

    symbol.on('pointerdown', (event: FederatedPointerEvent) => {
      if (
        rootStore.stateMachine.phase === Phase.Idle &&
        event.button === 0 &&
        !rootStore.modalStatusStore.isModalWindowOpened &&
        !rootStore.gameStatusStore.isBuyFeatureOpened &&
        (symbolName.startsWith('high') || symbolName.startsWith('low')) &&
        !rootStore.gameStatusStore.isSymbolPaytableOpened
      ) {
        eventEmitter.emit(REELS_EVENTS.showSymbolPaytable, symbolName);
      }
    });

    return symbol;
  }

  onResize(isPortrait: boolean) {
    this.fsBonusShakeTimeline.kill();
    this.wildShakeTimeline.kill();
    gsap.globalTimeline.remove(this.fsBonusShakeTimeline);
    gsap.globalTimeline.remove(this.wildShakeTimeline);

    if (this.isPortrait !== isPortrait) {
      this.isPortrait = isPortrait;

      for (let reelIndex = 0; reelIndex < Reels.REELS_COUNT; reelIndex += 1) {
        for (let rowIndex = 0; rowIndex < Reels.ROWS_COUNT; rowIndex += 1) {
          const x = this.isPortrait ? rowIndex * 289 : reelIndex * 270;
          const y = this.isPortrait ? reelIndex * 250 : rowIndex * 250;

          this.reels![reelIndex]![rowIndex]!.position.set(x, y);
          Reels.symbolContainers![reelIndex]![rowIndex]!.position.set(x, y);
          this.anticipationSpines![reelIndex]![rowIndex]!.position.set(x, y);
          this.cloningWildChangeSpines![reelIndex]![rowIndex]!.position.set(x, y);
          this.fsQuestionSpines![reelIndex]![rowIndex]!.position.set(x, y);
        }
      }

      eventEmitter.emit(FREE_SPIN_EVENTS.aimShotAnimationStopped);
      this.setFsAimPosition(Reels.FS_AIM_REELS_POSITIONS.reelIndex, Reels.FS_AIM_REELS_POSITIONS.rowIndex);

      this.paylines.position.set(this.isPortrait ? 290 : 560, this.isPortrait ? 580 : 220);
      this.paylines.clearState();
    }
    this.regularWinContainer.position.set(isPortrait ? 290 : 560, isPortrait ? 1025 : 585);

    const { cloningWildTransformations } = rootStore.dataStore;

    if (cloningWildTransformations) {
      const { x, y } =
        Reels.symbolContainers![cloningWildTransformations.position.reel]![cloningWildTransformations!.position.row]!
          .position;

      this.cloningWildMultiplierSpine.position.set(x, y);
      if (this.isCloningWildMultiplierTimelineActive) {
        this.cloningWildMultiplierTimeline.progress(1);
        this.regularWinContainer.regularWin.state.setAnimation(1, 'on_x2');

        this.regularWinContainer.bitMapText.text = rootStore.dataStore.withoutCurrency.formatCurrency(
          rootStore.dataStore.win,
        );
        this.removeAnimateCloningWildMultiplierTimelines();
      }
    }
  }
}
