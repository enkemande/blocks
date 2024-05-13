export class BlockNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlockNotFoundError";
  }
}
