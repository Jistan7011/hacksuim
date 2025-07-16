export class JsonTransformUtil {
  static parse<T = any>(v: string): T | null {
    if (!v) {
      return null;
    }

    try {
      return JSON.parse(v) as T;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static stringify(v: any): string | null {
    if (v === null || v === undefined) {
      return null;
    }

    try {
      return JSON.stringify(v);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
