import { bindable, bindingMode, customAttribute, DOM, inject } from "aurelia-framework";
import { Htmler } from "@ev-core/core";
import { UiIconValueConverter } from "../value-converter/icon-valueconverter";

@customAttribute('ui-icon')
@inject(DOM.Element)
export class UiIconAttribute {
  elMan: Htmler.ElementManager;
  @bindable({ defaultBindingMode: bindingMode.toView, primaryProperty: true }) icon: string;
  iconChanged(icon: string, prevIcon?: string) {
    this.build(icon);
  }

  constructor(
    private el: HTMLElement
  ) {
    this.elMan = Htmler.ElementManager.create({ el });
  }

  bind() { }

  attached() {
    this.iconChanged(this.icon);
  }


  unbind() {
    this.elMan.dispose();
  }

  private build(icon: string) {
    let classes = UiIconValueConverter.convertToClassList(icon);

    let cleanPrev = this.elMan.counter > 0;
    this.elMan
      .apply(props => {
        props.classes = classes;
      }, cleanPrev);
  }
}


