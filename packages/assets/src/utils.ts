import { BaseDataAsset } from "./dataAsset/BaseDataAsset";

/**
 * Creates JSON objects for Any assets
 * return { alias: this.alias, src: this.src }
 * @param id - Asset identifier
 * @param src - Path to json file
 */
export const createBaseJSON = (id: string, src: string) =>
  new BaseDataAsset(id, src).toJSON();
