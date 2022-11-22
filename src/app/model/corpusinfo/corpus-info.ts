import { AlignedDetail } from "./aligned-detail";
import { CorpusAttribute } from "./corpus-attribute";
import { CorpusInfoStrucuture } from "./corpus-info-structure";
import { StructInfo } from "./struct-info";

export class CorpusInfo {
  aligned: Array<string> = [];
  alignedDetails: Array<AlignedDetail> = [];
  alsizes: Array<Array<string>> = [];
  attributes: Array<CorpusAttribute> = [];
  compiled = new Date();
  defaultattr = '';
  deffilterlink = false;
  diachronic: Array<string> = [];
  docStructure = '';
  encoding = '';
  errsetdoc = '';
  freqttattrs: Array<string> = [];
  // TODO
  // private List gramrels = new ArrayList();
  info = '';
  infohref = '';
  isErrorCorpus = false;
  lang = '';
  lposlist: Array<string> = [];
  name = '';
  newversion = '';
  righttoleft = false;
  shortref = '';
  sizes: any;
  structs: Array<StructInfo> = [];
  structctx = '';
  structures: Array<CorpusInfoStrucuture> = [];
  // TODO
  // private List subcorpattrs = new ArrayList();
  tagsetdoc = '';
  termdef = '';
  unicameral = false;
  wposlist: Array<string> = [];
  wsattr = '';
  wsdef = '';
}
