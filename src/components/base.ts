export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = <HTMLTemplateElement>(
      document.querySelector(`#${templateId}`)!
    );
    this.hostElement = <T>document.querySelector(`#${hostElementId}`)!;

    const importElement = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = <U>importElement.firstElementChild!;
    if (newElementId) this.element.id = newElementId;
    this.render(insertAtStart);
  }

  private render(insertAfterBegin: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAfterBegin ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract attachContent(): void;
}
