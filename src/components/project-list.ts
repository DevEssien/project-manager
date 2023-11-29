/// <reference path="base.ts" />
/// <reference path="../models/project.ts" />
/// <reference path="../models/drag-drop.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
  export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, `${type}-projects`);
      this.assignedProjects = [];

      this.configure();
      this.attachContent();
    }

    @AutoBind
    dragOverHandler(event: DragEvent): void {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
        const listElem = this.element.querySelector("ul")!;
        listElem.classList.add("droppable");
      }
    }

    @AutoBind
    dropHandler(event: DragEvent): void {
      const projectId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        projectId,
        this.type === "active" ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED
      );
    }

    @AutoBind
    dragLeaveHandler(_event: DragEvent): void {
      const listElem = this.element.querySelector("ul")!;
      listElem.classList.remove("droppable");
    }

    configure(): void {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("drop", this.dropHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);

      projectState.addListeners((projects: Project[]) => {
        const relevantProjects = projects.filter((project) => {
          if (this.type === "active")
            return project.status === ProjectStatus.ACTIVE;
          return project.status === ProjectStatus.FINISHED;
        });
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    attachContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }

    private renderProjects() {
      const listElem = <HTMLUListElement>(
        document.querySelector(`#${this.type}-projects-list`)!
      );
      listElem.innerHTML = "";
      for (const projectItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
      }
    }
  }
}
