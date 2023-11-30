import { Project, ProjectStatus } from '../models/project';


type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListeners(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

//PROJECT STATE MANAGEMENT
export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const generatedId = Math.random().toString();
    const newProject = new Project(
      generatedId,
      title,
      description,
      people,
      ProjectStatus.ACTIVE
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((project) => project.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();

