import { bindable, customAttribute } from "aurelia-framework";
import { resolve } from "aurelia-dependency-injection";
import { DOM } from "aurelia-pal";
import { FileinputCall, IFileInputOptions } from "@ev-core/core";

@customAttribute('au-fileinput')
export class FileinputAttrComponent {
  private el = resolve(DOM.Element);
  private fi = resolve(FileinputCall);

  @bindable opts: IFileInputOptions;
  @bindable submit: (files: FileList | null) => void;

  handleOnClick: (e: MouseEvent) => {};

  constructor() {
    this.handleOnClick = async () => {
      const files = await this.fi.call(this.opts);
      this.submit(files);
    }
  }

  attached() {
    this.el.addEventListener('click', this.handleOnClick);
  }

  detached() {
    this.el.removeEventListener('click', this.handleOnClick);
  }

}

