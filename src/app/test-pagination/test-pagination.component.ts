import { Component, OnInit } from '@angular/core';
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { KeyValueItem } from '../model/key-value-item';

@Component({
  selector: 'app-test-pagination',
  templateUrl: './test-pagination.component.html',
  styleUrls: ['./test-pagination.component.scss']
})
export class TestPaginationComponent implements OnInit {

  public data = {
    "inProgress": false,
    "kwicLines": [],
    "currentSize": 50,
    "metadataValues": [],
    "collocations": [
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "13.770",
        "concurrenceCount": 10,
        "candidateCount": 5,
        "mi": 20.323717706818837,
        "mi3": 26.967573896593567,
        "logLikelihood": 297.9151382446289,
        "minSensitivity": 0.007401924500370096,
        "logDice": 7.916786631751018,
        "miLogF": 48.73414661486943,
        "tScore": 3.1622752505329124
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "ero…prima",
        "concurrenceCount": 26,
        "candidateCount": 26,
        "mi": 19.323717706818837,
        "mi3": 28.724597143101025,
        "logLikelihood": 697.0010070800781,
        "minSensitivity": 0.01924500370096225,
        "logDice": 9.273126874006127,
        "miLogF": 63.687821206394155,
        "tScore": 5.0990117427519
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "trigemine",
        "concurrenceCount": 10,
        "candidateCount": 10,
        "mi": 19.323717706818837,
        "mi3": 25.967573896593564,
        "logLikelihood": 267.95782470703125,
        "minSensitivity": 0.007401924500370096,
        "logDice": 7.911476743383368,
        "miLogF": 46.33625134207106,
        "tScore": 3.162272840897445
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "71.741",
        "concurrenceCount": 5,
        "candidateCount": 5,
        "mi": 19.323717706818837,
        "mi3": 23.967573896593564,
        "logLikelihood": 133.96033477783203,
        "minSensitivity": 0.003700962250185048,
        "logDice": 6.916786631751019,
        "miLogF": 34.62345418188249,
        "tScore": 2.236064569760632
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "extrauterine",
        "concurrenceCount": 17,
        "candidateCount": 17,
        "mi": 19.323717706818837,
        "mi3": 27.49864338931952,
        "logLikelihood": 455.6169738769531,
        "minSensitivity": 0.012583271650629163,
        "logDice": 8.669610326364442,
        "miLogF": 55.8527279173472,
        "tScore": 4.123099342057128
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "scateniamoci",
        "concurrenceCount": 26,
        "candidateCount": 27,
        "mi": 19.269269922796465,
        "mi3": 28.67014935907865,
        "logLikelihood": 688.4468460083008,
        "minSensitivity": 0.01924500370096225,
        "logDice": 9.2720795454368,
        "miLogF": 63.50837019254098,
        "tScore": 5.099011443873405
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "ectopiche",
        "concurrenceCount": 46,
        "candidateCount": 49,
        "mi": 19.232569818760645,
        "mi3": 30.27969373087467,
        "logLikelihood": 1211.277229309082,
        "minSensitivity": 0.034048852701702444,
        "logDice": 10.072350844224683,
        "miLogF": 74.04823256242256,
        "tScore": 6.782318972841639
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "15.550",
        "concurrenceCount": 10,
        "candidateCount": 11,
        "mi": 19.186214183068905,
        "mi3": 25.83007037284363,
        "logLikelihood": 261.2558364868164,
        "minSensitivity": 0.007401924500370096,
        "logDice": 7.910417106875291,
        "miLogF": 46.006532292477985,
        "tScore": 3.1622723589703523
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "14.0",
        "concurrenceCount": 5,
        "candidateCount": 8,
        "mi": 18.645645801706202,
        "mi3": 23.289501991480925,
        "logLikelihood": 123.3753433227539,
        "minSensitivity": 0.003700962250185048,
        "logDice": 6.91359835411997,
        "miLogF": 33.408512425079415,
        "tScore": 2.2360625251171378
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "10.350",
        "concurrenceCount": 5,
        "candidateCount": 9,
        "mi": 18.47572080026389,
        "mi3": 23.119576990038613,
        "logLikelihood": 121.59503173828125,
        "minSensitivity": 0.003700962250185048,
        "logDice": 6.91253715874966,
        "miLogF": 33.104047694686564,
        "tScore": 2.2360618435693063
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "gemellari",
        "concurrenceCount": 53,
        "candidateCount": 110,
        "mi": 18.27027844785738,
        "mi3": 29.72611935698378,
        "logLikelihood": 1269.5433502197266,
        "minSensitivity": 0.03923019985196151,
        "logDice": 10.215179991759701,
        "miLogF": 72.87984925479019,
        "tScore": 7.280086862347756
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "intrauterine",
        "concurrenceCount": 6,
        "candidateCount": 21,
        "mi": 17.516362784761235,
        "mi3": 22.686287786203547,
        "logLikelihood": 135.62957000732422,
        "minSensitivity": 0.0044411547002220575,
        "logDice": 7.162897734548343,
        "miLogF": 34.085268117401675,
        "tScore": 2.4494766773139314
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "PPHN",
        "concurrenceCount": 13,
        "candidateCount": 53,
        "mi": 17.29623697039673,
        "mi3": 24.69711640667892,
        "logLikelihood": 289.3224182128906,
        "minSensitivity": 0.009622501850481125,
        "logDice": 8.24511249783653,
        "miLogF": 45.6457609514879,
        "tScore": 3.6055288735288253
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "73,2",
        "concurrenceCount": 5,
        "candidateCount": 21,
        "mi": 17.253328378927442,
        "mi3": 21.897184568702166,
        "logLikelihood": 110.90766143798828,
        "minSensitivity": 0.003700962250185048,
        "logDice": 6.899863328714549,
        "miLogF": 30.91381449864437,
        "tScore": 2.2360536649953278
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "84,6",
        "concurrenceCount": 4,
        "candidateCount": 21,
        "mi": 16.931400284040077,
        "mi3": 20.93140028404008,
        "logLikelihood": 86.71501922607422,
        "minSensitivity": 0.0029607698001480384,
        "logDice": 6.577935233827187,
        "miLogF": 27.250037527731592,
        "tScore": 1.9999839981335477
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "NTD",
        "concurrenceCount": 3,
        "candidateCount": 16,
        "mi": 16.908680207539994,
        "mi3": 20.07860520898231,
        "logLikelihood": 64.9293212890625,
        "minSensitivity": 0.0022205773501110288,
        "logDice": 6.168164973115096,
        "miLogF": 23.440408025692197,
        "tScore": 1.7320367295774048
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "gemellare",
        "concurrenceCount": 23,
        "candidateCount": 133,
        "mi": 16.79199722737466,
        "mi3": 25.83912113948869,
        "logLikelihood": 494.03199005126953,
        "minSensitivity": 0.017024426350851222,
        "logDice": 8.98828657943621,
        "miLogF": 53.36587110765013,
        "tScore": 4.79578925946183
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "indesiderate",
        "concurrenceCount": 97,
        "candidateCount": 776,
        "mi": 16.32371770681884,
        "mi3": 29.523543391193094,
        "logLikelihood": 2020.8630599975586,
        "minSensitivity": 0.07179866765358993,
        "logDice": 10.545308524226455,
        "miLogF": 74.84371481676335,
        "tScore": 9.848737725523913
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "Diminuiscono",
        "concurrenceCount": 10,
        "candidateCount": 84,
        "mi": 16.253328378927442,
        "mi3": 22.897184568702166,
        "logLikelihood": 206.6341552734375,
        "minSensitivity": 0.007401924500370096,
        "logDice": 7.835093073324312,
        "miLogF": 38.97377928706972,
        "tScore": 3.1622371782925365
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "39,9",
        "concurrenceCount": 3,
        "candidateCount": 27,
        "mi": 16.153792705376528,
        "mi3": 19.323717706818837,
        "logLikelihood": 61.53490447998047,
        "minSensitivity": 0.0022205773501110288,
        "logDice": 6.156602328016865,
        "miLogF": 22.3939117381631,
        "tScore": 1.7320270509582676
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "comprendiamo",
        "concurrenceCount": 58,
        "candidateCount": 539,
        "mi": 16.107557239193905,
        "mi3": 27.823519229449047,
        "logLikelihood": 1188.1350860595703,
        "minSensitivity": 0.04293116210214656,
        "logDice": 9.973810476019136,
        "miLogF": 65.67916777266778,
        "tScore": 7.615665246933089
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "322",
        "concurrenceCount": 12,
        "candidateCount": 124,
        "mi": 15.95448389715312,
        "mi3": 23.12440889859543,
        "logLikelihood": 242.71926879882812,
        "minSensitivity": 0.008882309400444115,
        "logDice": 8.05846326158459,
        "miLogF": 40.922443220633326,
        "tScore": 3.464047062920799
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "straordinarietà",
        "concurrenceCount": 22,
        "candidateCount": 242,
        "mi": 15.86428608818154,
        "mi3": 24.783149325456137,
        "logLikelihood": 442.2609558105469,
        "minSensitivity": 0.01628423390081421,
        "logDice": 8.821901067111988,
        "miLogF": 49.7423772693385,
        "tScore": 4.690337130349854
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "attesissime",
        "concurrenceCount": 4,
        "candidateCount": 45,
        "mi": 15.831864610489163,
        "mi3": 19.831864610489163,
        "logLikelihood": 80.16905975341797,
        "minSensitivity": 0.0029607698001480384,
        "logDice": 6.552916773790348,
        "miLogF": 25.480403128644987,
        "tScore": 1.9999657102861734
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "IUD",
        "concurrenceCount": 5,
        "candidateCount": 57,
        "mi": 15.812755787541459,
        "mi3": 20.456611977316182,
        "logLikelihood": 100.07637786865234,
        "minSensitivity": 0.003700962250185048,
        "logDice": 6.862496476250065,
        "miLogF": 28.332654916918138,
        "tScore": 2.236029129273393
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "ostetriche",
        "concurrenceCount": 13,
        "candidateCount": 156,
        "mi": 15.738755206097682,
        "mi3": 23.139634642379864,
        "logLikelihood": 258.8818130493164,
        "minSensitivity": 0.009622501850481125,
        "logDice": 8.142976016543269,
        "miLogF": 41.53547728567239,
        "tScore": 3.605485337692564
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "sovradosaggi",
        "concurrenceCount": 8,
        "candidateCount": 99,
        "mi": 15.69436108673923,
        "mi3": 21.694361086739228,
        "logLikelihood": 158.76839447021484,
        "minSensitivity": 0.005921539600296077,
        "logDice": 7.498162815097704,
        "miLogF": 34.484035905372615,
        "tScore": 2.8283737824700124
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "IVF",
        "concurrenceCount": 5,
        "candidateCount": 64,
        "mi": 15.6456458017062,
        "mi3": 20.289501991480925,
        "logLikelihood": 98.8672866821289,
        "minSensitivity": 0.003700962250185048,
        "logDice": 6.855341757168118,
        "miLogF": 28.033234017395248,
        "tScore": 2.236024358438573
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "constatata",
        "concurrenceCount": 7,
        "candidateCount": 91,
        "mi": 15.623277988677746,
        "mi3": 21.237987832792957,
        "logLikelihood": 138.19866180419922,
        "minSensitivity": 0.0051813471502590676,
        "logDice": 7.3134994728167815,
        "miLogF": 32.487693266868696,
        "tScore": 2.6456988938770762
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "ectopica",
        "concurrenceCount": 8,
        "candidateCount": 123,
        "mi": 15.3812032014796,
        "mi3": 21.3812032014796,
        "logLikelihood": 155.16280364990234,
        "minSensitivity": 0.005921539600296077,
        "logDice": 7.47447919090493,
        "miLogF": 33.795957703293524,
        "tScore": 2.8283608510091205
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "multiple",
        "concurrenceCount": 81,
        "candidateCount": 1373,
        "mi": 15.240451799556363,
        "mi3": 27.92015180532561,
        "logLikelihood": 1559.1835708618164,
        "minSensitivity": 0.05899490167516387,
        "logDice": 9.928339014872552,
        "miLogF": 67.16039228210815,
        "tScore": 8.99976750727366
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "veneree",
        "concurrenceCount": 7,
        "candidateCount": 133,
        "mi": 15.075790193375253,
        "mi3": 20.690500037490462,
        "logLikelihood": 132.70816802978516,
        "minSensitivity": 0.0051813471502590676,
        "logDice": 7.272079545436801,
        "miLogF": 31.349224401753986,
        "tScore": 2.645674701328993
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "tromboembolici",
        "concurrenceCount": 10,
        "candidateCount": 191,
        "mi": 15.068216973670452,
        "mi3": 21.71207316344518,
        "logLikelihood": 189.49754333496094,
        "minSensitivity": 0.007401924500370096,
        "logDice": 7.731341044972328,
        "miLogF": 36.132006250664546,
        "tScore": 3.1621856120935465
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "atosiban",
        "concurrenceCount": 8,
        "candidateCount": 183,
        "mi": 14.808017868534797,
        "mi3": 20.808017868534797,
        "logLikelihood": 148.62911224365234,
        "minSensitivity": 0.005921539600296077,
        "logDice": 7.416917232497066,
        "miLogF": 32.53654080237856,
        "tScore": 2.828328522356892
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "lansoprazolo",
        "concurrenceCount": 10,
        "candidateCount": 245,
        "mi": 14.709007862703633,
        "mi3": 21.352864052478356,
        "logLikelihood": 184.39891052246094,
        "minSensitivity": 0.007401924500370096,
        "logDice": 7.681683158665016,
        "miLogF": 35.270660421531105,
        "tScore": 3.1621595880305047
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "100/200",
        "concurrenceCount": 3,
        "candidateCount": 75,
        "mi": 14.679861517044115,
        "mi3": 17.849786518486425,
        "logLikelihood": 55.18035888671875,
        "minSensitivity": 0.0022205773501110288,
        "logDice": 6.107204234277268,
        "miLogF": 20.35060924309914,
        "tScore": 1.73198481698385
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "Complici",
        "concurrenceCount": 11,
        "candidateCount": 278,
        "mi": 14.664208252732628,
        "mi3": 21.583071490007224,
        "logLikelihood": 202.1497344970703,
        "minSensitivity": 0.008142116950407105,
        "logDice": 7.7896607301117795,
        "miLogF": 36.43918860109138,
        "tScore": 3.3164970495071135
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "retrospettive",
        "concurrenceCount": 6,
        "candidateCount": 158,
        "mi": 14.604899459362892,
        "mi3": 19.774824460805206,
        "logLikelihood": 109.73809051513672,
        "minSensitivity": 0.0044411547002220575,
        "logDice": 7.025585410194473,
        "miLogF": 28.41982208390671,
        "tScore": 2.4493914406812256
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "Gabapentin",
        "concurrenceCount": 7,
        "candidateCount": 186,
        "mi": 14.591913817768413,
        "mi3": 20.20662366188362,
        "logLikelihood": 127.90450286865234,
        "minSensitivity": 0.0051813471502590676,
        "logDice": 7.221453472366832,
        "miLogF": 30.343031765279648,
        "tScore": 2.6456441726373643
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "monitorate",
        "concurrenceCount": 18,
        "candidateCount": 491,
        "mi": 14.554063493946456,
        "mi3": 22.893913496831082,
        "logLikelihood": 328.08231353759766,
        "minSensitivity": 0.013323464100666173,
        "logDice": 8.322867655350976,
        "miLogF": 42.85355185683926,
        "tScore": 4.242464316361015
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "prospettici",
        "concurrenceCount": 12,
        "candidateCount": 347,
        "mi": 14.469888354961734,
        "mi3": 21.639813356404048,
        "logLikelihood": 217.2420654296875,
        "minSensitivity": 0.008882309400444115,
        "logDice": 7.855341757168118,
        "miLogF": 37.11453083859927,
        "tScore": 3.4639489569177253
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "ovociti",
        "concurrenceCount": 11,
        "candidateCount": 343,
        "mi": 14.361084559283325,
        "mi3": 21.279947796557916,
        "logLikelihood": 197.4430160522461,
        "minSensitivity": 0.008142116950407105,
        "logDice": 7.733213459305098,
        "miLogF": 35.68595451953091,
        "tScore": 3.316467182042586
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "Voluven",
        "concurrenceCount": 3,
        "candidateCount": 99,
        "mi": 14.279323587460386,
        "mi3": 17.449248588902698,
        "logLikelihood": 53.48485565185547,
        "minSensitivity": 0.0022205773501110288,
        "logDice": 6.08312531581886,
        "miLogF": 19.79534576990258,
        "tScore": 1.7319636999966415
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "cumulativa",
        "concurrenceCount": 6,
        "candidateCount": 202,
        "mi": 14.250468724788199,
        "mi3": 19.420393726230515,
        "logLikelihood": 106.73936462402344,
        "minSensitivity": 0.0044411547002220575,
        "logDice": 6.984120386333855,
        "miLogF": 27.730131720360685,
        "tScore": 2.4493640654123277
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "contraccezione",
        "concurrenceCount": 16,
        "candidateCount": 545,
        "mi": 14.233605287154552,
        "mi3": 22.23360528715455,
        "logLikelihood": 284.37769317626953,
        "minSensitivity": 0.011843079200592153,
        "logDice": 8.111256751101742,
        "miLogF": 40.326840433595386,
        "tScore": 3.9997923567329394
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "utilizzatrici",
        "concurrenceCount": 6,
        "candidateCount": 212,
        "mi": 14.180759752976796,
        "mi3": 19.35068475441911,
        "logLikelihood": 106.15099334716797,
        "minSensitivity": 0.0044411547002220575,
        "logDice": 6.974860437721492,
        "miLogF": 27.594484324632663,
        "tScore": 2.4493578437603056
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "Vaniqa",
        "concurrenceCount": 3,
        "candidateCount": 106,
        "mi": 14.180759752976796,
        "mi3": 17.35068475441911,
        "logLikelihood": 53.06883239746094,
        "minSensitivity": 0.0022205773501110288,
        "logDice": 6.076177338656643,
        "miLogF": 19.658707281947624,
        "tScore": 1.731957540875372
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "occorse",
        "concurrenceCount": 4,
        "candidateCount": 149,
        "mi": 14.104549186356678,
        "mi3": 18.104549186356678,
        "logLikelihood": 70.3328857421875,
        "minSensitivity": 0.0029607698001480384,
        "logDice": 6.449253214616757,
        "miLogF": 22.700396198313978,
        "tScore": 1.9998864629475521
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "gravidanze",
        "concurrenceCount": 36,
        "candidateCount": 1342,
        "mi": 14.10347375206097,
        "mi3": 24.44332375494559,
        "logLikelihood": 633.8026657104492,
        "minSensitivity": 0.026646928201332347,
        "logDice": 8.77492648694064,
        "miLogF": 50.9264860018246,
        "tScore": 5.9996591348447765
      },
      {
        "positiveFilter": null,
        "negativeFilter": null,
        "word": "aborti",
        "concurrenceCount": 12,
        "candidateCount": 470,
        "mi": 14.032163260974997,
        "mi3": 21.20208826241731,
        "logLikelihood": 209.84983825683594,
        "minSensitivity": 0.008882309400444115,
        "logDice": 7.754447293744318,
        "miLogF": 35.9917881400332,
        "tScore": 3.4638948446380025
      }
    ]
  };
  public collocations: Array<any> = Array.from<any>({ length: 0 });
  public paginations: number[] = [3, 6, 10, 23, 50];
  public initialPagination = 6;
  public pagination = 6;
  public maxSizeRequested = 6;
  public headerSortBy = '';
  public totalResults = 0;
  public colHeaderList: KeyValueItem[] = [
    new KeyValueItem('r', 'PAGE.COLLOCATION.CONC_COUNT'),
    new KeyValueItem('f', 'PAGE.COLLOCATION.CAND_COUNT'),
    new KeyValueItem('t', 'PAGE.COLLOCATION.T_SCORE'),
    new KeyValueItem('m', 'PAGE.COLLOCATION.MI'),
    new KeyValueItem('3', 'PAGE.COLLOCATION.MI3'),
    new KeyValueItem('l', 'PAGE.COLLOCATION.LOG_LIKELIHOOD'),
    new KeyValueItem('s', 'PAGE.COLLOCATION.MIN_SENS'),
    new KeyValueItem('d', 'PAGE.COLLOCATION.LOG_DICE'),
    new KeyValueItem('p', 'PAGE.COLLOCATION.MI_LOG_F')
  ];
  public colHeader = [
    'PAGE.COLLOCATION.CONC_COUNT',
    'PAGE.COLLOCATION.CAND_COUNT',
    'PAGE.COLLOCATION.T_SCORE',
    'PAGE.COLLOCATION.MI',
    'PAGE.COLLOCATION.MI3',
    'PAGE.COLLOCATION.LOG_LIKELIHOOD',
    'PAGE.COLLOCATION.MIN_SENS',
    'PAGE.COLLOCATION.LOG_DICE',
    'PAGE.COLLOCATION.MI_LOG_F'
  ];
  public colHeaderToField: any = {
    'PAGE.COLLOCATION.CONC_COUNT': 'concurrenceCount',
    'PAGE.COLLOCATION.CAND_COUNT': 'candidateCount',
    'PAGE.COLLOCATION.T_SCORE': 'tScore',
    'PAGE.COLLOCATION.MI': 'mi',
    'PAGE.COLLOCATION.MI3': 'mi3',
    'PAGE.COLLOCATION.LOG_LIKELIHOOD': 'logLikelihood',
    'PAGE.COLLOCATION.MIN_SENS': 'minSensitivity',
    'PAGE.COLLOCATION.LOG_DICE': 'logDice',
    'PAGE.COLLOCATION.MI_LOG_F': 'miLogF'
  };

  public loading = false;
  public visible = true;
  public totalRecords = 0;
  public faSortAmountDown = faSortAmountDown;

  constructor() { }

  ngOnInit(): void {
    this.totalResults = this.data.currentSize;
    // this.collocations = this.data.collocations.slice(0, 10);
    this.collocations = this.data.collocations;
    this.visible = this.collocations.length > 0;
    this.totalRecords = this.data.currentSize;
  }

  public loadResults(event: LazyLoadEvent): void {
    this.initialPagination = !!event.first ? event.first : 0;
    this.pagination = !!event.rows ? event.rows : 6;
    this.collocations = this.data.collocations.slice(this.initialPagination, this.initialPagination + this.pagination);
    this.headerSortBy = !!event.sortField ? this.colHeaderToField[`${event.sortField}`] : 'mi';
    this.collocations = this.collocations.sort((a, b) => b[`${this.headerSortBy}`] - a[`${this.headerSortBy}`])
    console.log('...loading...');
  }

  public customSort(event: SortEvent): void {
    this.headerSortBy = !!event.field ? this.colHeaderToField[`${event.field}`] : 'mi';
    this.collocations = this.collocations.sort((a, b) => b[`${this.headerSortBy}`] - a[`${this.headerSortBy}`])
  }

}
