import { Widget } from "./core/Widget";
import { Button } from "./Button";
export class Dialog extends Widget {
    constructor(parent) {
        super(parent);
        this.enableFocusChange = false;
        this.enableSize = false;
        this.setWidth(500);
        this.setHeight(200);
        this.okButton = new Button(this);
        this.okButton.setWidth(100);
        this.okButton.setHeight(40);
        this.okButton.setColor([0.9, 0.9, 0.9]);
        this.okButton.setOrigin([100, 160]);
        this.cancelButton = new Button(this);
        this.cancelButton.setWidth(100);
        this.cancelButton.setHeight(40);
        this.cancelButton.setColor([0.9, 0.9, 0.9]);
        this.cancelButton.setOrigin([300, 160]);
        this.closeButton = new Button(this);
        this.closeButton.setWidth(40);
        this.closeButton.setHeight(40);
        this.closeButton.setColor([1, 0, 0]);
        this.closeButton.setOrigin([460, 0]);
    }
}
