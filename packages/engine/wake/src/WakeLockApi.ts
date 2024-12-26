export class WakeLockApi {
  wakeLock: WakeLockSentinel | null = null;

  public async request() {
    await this.lock();
    document.addEventListener("visibilitychange", this.reveal);
  }

  public dispose() {
    this.wakeLock = null;
    document.removeEventListener("visibilitychange", this.reveal);
    console.log(
      "%cg-slots/wake: wakeLock disposed",
      "background: #222; color: #bada55",
    );
  }

  private lock = async () => {
    try {
      this.wakeLock = await navigator.wakeLock.request("screen");
      console.log(
        "%cg-slots/wake: wakeLock success",
        "background: #222; color: #bada55",
      );
    } catch (err) {
      console.log(
        "%cg-slots/wake: wakeLock failed",
        "background: #222; color: #8a2222",
      );
    }
  };

  private reveal = async () => {
    if (this.wakeLock !== null && document.visibilityState === "visible") {
      this.lock();
    }
  };
}
