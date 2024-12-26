/**
 * Base class for assets
 */
export class BaseDataAsset {
  constructor(
    public alias: string,
    public src: string,
  ) {}

  /**
   * Converts the object to JSON format
   */
  toJSON() {
    return { alias: this.alias, src: this.src };
  }
}
