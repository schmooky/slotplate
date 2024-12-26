import { FramePreparer } from "./src/framePreparer/index.js";
import { ObjectPool } from "./src/objectPool/index.js";
import { Reel } from "./src/reel/index.js";
import { ReelsConfig } from "./src/reelsConfig/index.js";
import { ReelsStateManager } from "./src/reelsStateManager/index.js";
import { AbstractReelSymbol } from "./src/abstractReelSymbol/index.js";
import { SymbolNameGenerator } from "./src/symbolNameGenerator/index.js";
import { Container } from "pixi.js";
import { ReelsContainer } from "./src/reelsContainer/index.js";

export type SimpleHandler = () => void;
export type Nullable<T> = T | null;

export interface ITicker {
  add(callback: (time: number, deltaTime: number) => void): void;
  remove(callback: (time: number, deltaTime: number) => void): void;
}

export enum ConfigKeys {
  SYMBOLS_PARAMETERS = "symbolsParameters",
  REELS_PARAMETERS = "reelsParameters",
  OBJECT_POOL_PARAMETERS = "objectPoolParameters",
  CONTAINER_PARAMETERS = "containerParameters",
}

export enum SpinningMode {
  Infinite,
  Frame,
  FrameOneStep,
}

export interface ISymbolData {
  weight: number;
  zIndex: number;
  unMaskSymbol: boolean;
}

export type ISymbolsData = Record<string, ISymbolData>;

export interface IReelSymbolsConfig {
  symbolsData: ISymbolsData;
  symbolWidth: number;
  symbolHeight: number;
}

export type ExtraSymbolsConfig = Record<string, ReelExtraSymbols>;

export interface ReelExtraSymbols {
  symbolsAbove: number;
  symbolsBelow: number;
}

export interface ReelsParameters {
  reelsQuantity: number;
  excludeRotateSymbols: string[];
  excludeAboveBelowSymbols: string[];
  extraSymbols: ExtraSymbolsConfig;
  reelsScale: Record<number, number>;
  reelsVisibleIndices: Record<number, number[]>;
}

export interface SymbolGeneratorParams {
  symbolsData: ISymbolsData;
  excludeRotateSymbols: string[];
  excludeAboveBelowSymbols: string[];
}

export interface ObjectPoolParameters<
  TextureType extends Container = Container,
> {
  maxTexturesPerSymbol: number;
  createTexture: (objectName: string) => TextureType;
}

export type Position = {
  x: number;
  y: number;
};

export interface ContainerParameters {
  position: Position;
}

export interface MaskParameters {
  mask: Container;
  position: Position;
}

export interface ReelsConfigParams {
  symbolsParameters: IReelSymbolsConfig;
  reelsParameters: ReelsParameters;
  objectPoolParameters: ObjectPoolParameters;
  containerParameters: ContainerParameters;
}

export interface ReelsManagerParams {
  reelsConfig: ReelsConfig;
  objectPool: ObjectPool;
  randomSymbolGenerator: SymbolNameGenerator;
  reelsContainer: ReelsContainer;
  reels: Reel[];
  framePreparer: FramePreparer;
  stateManager: ReelsStateManager;
}

export interface ReelParameters {
  reelsConfig: ReelsConfig;
  objectPool: ObjectPool;
  reelsContainer: ReelsContainer;
  randomSymbolGenerator: SymbolNameGenerator;
  symbols: AbstractReelSymbol[];
  reelIndex: number;
}

export interface SymbolFactoryParams {
  objectPool: ObjectPool;
  reelsConfig: ReelsConfig;
  symbolLink: SymbolLink;
}

export type Matrix<Type> = Array<Array<Type>>;

export type SymbolLink = new () => AbstractReelSymbol;
