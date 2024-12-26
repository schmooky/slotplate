import { button, folder, Leva, useControls } from "leva";
import React, { FC } from "react";
import { isMobile } from "react-device-detect";
import { createCheatRequest, deleteCheatRequest } from "@lib/cheatPanel/utils";
import { ReelsStopPositions } from "@lib/cheatPanel/types";
import { rootStore } from "@src/stores/RootStore";
import { AnnouncerTypes } from "@components/modal/announcers/types";

export const CheatPanel: FC = () => {
  const [, setManualCheats] = useControls(() => ({
    ["ManualCheats"]: folder(
      {
        reels: { value: "", label: "Reels" },
        collection: { value: "", label: "Collection" },
        inLoop: { options: [false, true] },
        ok: button((get) => {
          onClick(get).then((response) => {
            setManualCheats({ success: response.ok });
          });
        }),
        success: { value: false, disabled: true }
      },
      { collapsed: true }
    )
  }));

  function onClick(get: { (path: string): any; (arg0: string): string | number; }) {
    const reels = get("ManualCheats.reels");
    return createCheatRequest({
      inLoop: get("ManualCheats.inLoop"),
      reelFrames: [
        {
          reelCollectionIndex: +get("ManualCheats.collection"),
          reelsPositions: reels.split(
            reels.includes(",") ? "," : " "
          ) as unknown as ReelsStopPositions
        }
      ]
    })();
  }

  // const [, setTriggers] = useControls(() => ({
  //   ["Triggers"]: folder(
  //     {
  //       ["Big Win"]: button(() => {
  //         rootStore.gameStatusStore.setShowBigWin(true);
  //       }),
  //       ["Regular Win"]: button(() => {
  //         rootStore.gameStatusStore.setShowRegularWin(true);
  //       }),
  //       "Welcome FS": button(() => {
  //         rootStore.gameStatusStore.setShowAnnouncer(true, AnnouncerTypes.ShowFSBonus);
  //       }),
  //       "FS Total Win": button(() => {
  //         rootStore.gameStatusStore.setShowAnnouncer(true, AnnouncerTypes.ShowTotalWin);
  //       }),
  //       "FS Win": button(() => {
  //         rootStore.gameStatusStore.setShowAnnouncer(true, AnnouncerTypes.ShowFS);
  //       }),
  //       "Mystery Popup": button(() => {
  //         rootStore.gameStatusStore.setShowAnnouncer(true, AnnouncerTypes.ShowMystery);
  //       }),
  //       "Hints": button(() => {
  //         rootStore.gameStatusStore.setHint(true);
  //       })
  //
  //     },
  //
  //     { collapsed: true }
  //   )
  // }));

  const [, setCheats] = useControls(() => ({
    ["Cheats"]: folder(
      {
        ["Big win"]: button((get) => {
          createCheatRequest({
            inLoop: get("Cheats.inLoop"),
            reelFrames: [
              {
                reelCollectionIndex: 8,
                reelsPositions: [0, 0, 0, 0, 0]
              }
            ]
          })().then((response) => {
            setCheats({ success: response.ok });
          });
        }),
        ["Cloning feature"]: button((get) => {
          createCheatRequest({
            inLoop: get("Cheats.inLoop"),
            reelFrames: [
              {
                reelCollectionIndex: 19,
                reelsPositions: [0, 0, 3, 0, 0]
              }
            ]
          })().then((response) => {
            setCheats({ success: response.ok });
          });
        }),
        ["Wild feature"]: button((get) => {
          createCheatRequest({
            inLoop: get("Cheats.inLoop"),
            reelFrames: [
              {
                reelCollectionIndex: 11,
                reelsPositions: [3, 5, 0, 4, 0]
              }
            ]
          })().then((response) => {
            setCheats({ success: response.ok });
          });
        }),
        ["Scatter 3"]: button((get) => {
          createCheatRequest({
            inLoop: get("Cheats.inLoop"),
            reelFrames: [
              {
                reelCollectionIndex: 4,
                reelsPositions: [0, 0, 8, 3, 3]
              }
            ]
          })().then((response) => {
            setCheats({ success: response.ok });
          });
        }),
        ["Scatter 4"]: button((get) => {
          createCheatRequest({
            inLoop: get("Cheats.inLoop"),
            reelFrames: [
              {
                reelCollectionIndex: 4,
                reelsPositions: [7, 3, 8, 0, 3]
              }
            ]
          })().then((response) => {
            setCheats({ success: response.ok });
          });
        }),
        ["Scatter 5"]: button((get) => {
          createCheatRequest({
            inLoop: get("Cheats.inLoop"),
            reelFrames: [
              {
                reelCollectionIndex: 4,
                reelsPositions: [7, 3, 8, 3, 3]
              }
            ]
          })().then((response) => {
            setCheats({ success: response.ok });
          });
        }),
        ["Mystery Feature"]: button((get) => {
          createCheatRequest({
            inLoop: get("Cheats.inLoop"),
            reelFrames: [
              {
                reelCollectionIndex: 0,
                reelsPositions: [0, 0, 3, 0, 0]
              }
            ]
          })().then((response) => {
            setCheats({ success: response.ok });
          });
        }),
        ["Delete last cheat"]: button(() => {
          deleteCheatRequest()().then((response) => {
            setCheats({ success: response.ok });
          });
        }),
        inLoop: { options: [false, true] },
        success: { value: false, disabled: true }
      },
      { collapsed: true }
    )
  }));

  return (
    <div style={{ transform: `scale(${isMobile ? 0.7 : 1})` }}>
      <Leva collapsed={true} titleBar={{ position: { x: -window.innerWidth + 300, y: 0 } }} />
    </div>
  );
};
