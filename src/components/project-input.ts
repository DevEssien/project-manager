/// <reference path="base.ts" />
/// <reference path="../utils/validation.ts" />

namespace App {
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
        titleInputElement: HTMLInputElement;
        descriptionInputElement: HTMLInputElement;
        peopleInputElement: HTMLInputElement;
    
        constructor() {
          super("project-input", "app", true, "user-input");
    
          this.titleInputElement = <HTMLInputElement>(
            this.element.querySelector("#title")!
          );
          this.descriptionInputElement = <HTMLInputElement>(
            this.element.querySelector("#description")
          );
          this.peopleInputElement = <HTMLInputElement>(
            this.element.querySelector("#people")
          );
    
          this.configure();
        }
    
        configure() {
          this.element.addEventListener("submit", this.submitHandler);
        }
    
        attachContent() {}
    
        private gatherUserInput(): [string, string, number] | void {
          const enteredTitle = this.titleInputElement.value;
          const enteredDescription = this.descriptionInputElement.value;
          const enteredPeople = this.peopleInputElement.value;
    
          const titleValidate: Validatable = {
            value: enteredTitle,
            required: true,
          };
          const descriptionValidate: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
          };
          const peopleValidate: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5,
          };
    
          if (
            !validate(titleValidate) ||
            !validate(descriptionValidate) ||
            !validate(peopleValidate)
          ) {
            alert("invalid Inputs");
            return;
          } else return [enteredTitle, enteredDescription, +enteredPeople];
        }
    
        private clearInputs() {
          this.titleInputElement.value = "";
          this.descriptionInputElement.value = "";
          this.peopleInputElement.value = "";
        }
    
        @AutoBind
        private submitHandler(event: Event) {
          event.preventDefault();
          const userInput = this.gatherUserInput();
    
          if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people); //called ProjectState
            this.clearInputs();
          }
        }
      }
}