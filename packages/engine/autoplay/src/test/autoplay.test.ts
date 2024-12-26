import { AutoplayStore } from "../autoplayStore.js";
import { IAutoplayStore } from "../types.js";

class TestAutoplayStore extends AutoplayStore {}

describe("AutoplayStore", () => {
  let store: IAutoplayStore;

  beforeEach(() => {
    store = new TestAutoplayStore();
  });

  test("should initialize autoplay rounds with init method", () => {
    const rounds = [10, 20, 30];
    store.init(rounds);
    expect(store.autoPlayRounds).toEqual(rounds);
  });

  test("should start autoplay and set spins left", () => {
    store.init([5, 10, 15]);
    store.start(1);
    expect(store.autoPlaySpinsLeft).toBe(9);
    expect(store.isActive).toBe(true);
  });

  test("should throw an error if autoplay rounds not found", () => {
    store.init([5, 10, 15]);
    expect(() => store.start(3)).toThrow("Autoplay rounds not found");
  });

  test("should throw an error if autoplay rounds not found", () => {
    store.init([5, 10, 15]);
    expect(() => store.start(0.1)).toThrow(
      "Index must be a non-negative integer"
    );
  });

  test("should throw an error if autoplay rounds not found", () => {
    store.init([5, 10, 15]);
    expect(() => store.start(undefined!)).toThrow(
      "Index must be a non-negative integer"
    );
  });

  test("should throw an error if autoplay rounds not found", () => {
    store.init([5, 10, 15]);
    expect(() => store.start(-1)).toThrow(
      "Index must be a non-negative integer"
    );
  });

  test("should decrease spins left", () => {
    store.init([5]);
    store.start(0);
    store.decreaseSpinsLeft();
    expect(store.autoPlaySpinsLeft).toBe(3);
  });

  test("should stop autoplay", () => {
    store.init([999]);
    store.start(0);
    store.stop();
    expect(store.isActive).toBe(false);
    expect(store.autoPlaySpinsLeft).toBe(0);
  });
});
