import { KeyValueItem } from "./key-value-item";

export class PanelLabelStatus {
    panelDisplayMTD = false;
    panelDisplayOPT = false; 
    labelVisibleMTD = false;
    labelVisibleOPT = false;
    labelDisableMTD = false;
    labelDisableOPT = false;
    titleLabelKeyValue = new KeyValueItem('','');
    
    constructor(panelDisplayMTD: boolean, panelDisplayOPT: boolean,  
        labelVisibleMTD: boolean, labelVisibleOPT: boolean, 
        labelDisableMTD: boolean, labelDisableOPT: boolean, titleLabelKeyValue: KeyValueItem) {
            this.panelDisplayMTD = panelDisplayMTD;
            this.panelDisplayOPT = panelDisplayOPT;
            this.labelVisibleMTD = labelVisibleMTD;
            this.labelVisibleOPT = labelVisibleOPT;
            this.labelDisableMTD = labelDisableMTD;
            this.labelDisableOPT = labelDisableOPT;
            this.titleLabelKeyValue = titleLabelKeyValue;
    }
}