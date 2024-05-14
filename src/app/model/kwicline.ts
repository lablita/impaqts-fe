export class KWICline {
  ref = '';
  leftContext: Array<string> = [];
  kwic = '';
  rightContext: Array<string> = [];
  pos = 0;
  startTime: string | null = null;
  videoUrl: string | null = null;
  references: any = {};

  public static stripTags(context: Array<string>, withContextConcordance: boolean): string {
    let ret = '';
    if (!!context) {
      for (let i = 0; i < context.length; i = i + 2) {
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


