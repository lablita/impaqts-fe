export class KWICline {
  ref = '';
  leftContext: Array<string> = Array.from<string>({ length: 0 });
  kwic = '';
  rightContext: Array<string> = Array.from<string>({ length: 0 });

  public static stripTags(context: Array<string>, withContextConcordance: boolean): string {
    let ret = '';
    for (let i = 0; i < context.length; i += 2) {
      if (withContextConcordance) {
        ret += context[i];
      } else {
        ret += context[i];
      }
      ret += ' ';
    }
    return ret;
  }

}


