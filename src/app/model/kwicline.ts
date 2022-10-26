export class KWICline {
  ref = '';
  leftContext: Array<string> = Array.from<string>({ length: 0 });
  kwic = '';
  rightContext: Array<string> = Array.from<string>({ length: 0 });

  public static stripTags(context: Array<string>, withContextConcordance: boolean): string {
    let ret = '';
    if (!!context) {
      for (let i = 0; i < context.length; i += 2) {
        if (withContextConcordance) {
          if (context[i + 1] === 'coll') {
            ret += `<span class="text-red">${context[i]}</span>`;
          } else {
            ret += context[i];
          }
        } else {
          ret += context[i];
        }
        ret += ' ';
      }
    }
    return ret;
  }

}


