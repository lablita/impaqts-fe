export class PanelLabelStatus {
    panelDisplayMTD = false;
    panelDisplayOPT = false; 
    labelVisibleMTD = false;
    labelVisibleOPT = false;
    labelDisableMTD = false;
    labelDisableOPT = false;
    titleLabel = '';
    
    constructor(panelDisplayMTD: boolean, panelDisplayOPT: boolean,  
        labelVisibleMTD: boolean, labelVisibleOPT: boolean, 
        labelDisableMTD: boolean, labelDisableOPT: boolean, titleLabel: string) {
            this.panelDisplayMTD = panelDisplayMTD;
            this.panelDisplayOPT = panelDisplayOPT;
            this.labelVisibleMTD = labelVisibleMTD;
            this.labelVisibleOPT = labelVisibleOPT;
            this.labelDisableMTD = labelDisableMTD;
            this.labelDisableOPT = labelDisableOPT;
            this.titleLabel = titleLabel;
    }
}