import { DataSource, Subgraph } from './app.service';

interface SectionViewModel {
  title: string;
  links: LinksViewModel[];
}

interface LinksViewModel {
  text: string;
  calleesHref: string;
  callersHref: string;
}

export class SdkDetailsViewModel {
  constructor(
    private readonly source: DataSource,
    private readonly subgraphs: Subgraph[],
  ) {}

  readonly title = `${
    this.source.charAt(0).toUpperCase() + this.source.slice(1)
  } SDK`;

  readonly fullDiagramHref = `/${this.source}/diagram`;

  readonly sections: SectionViewModel[] = this.subgraphs.map((subgraph) => ({
    title: subgraph.label,
    links: subgraph.nodes.map((node) => ({
      text: node.label,
      calleesHref: `/${this.source}/diagram/${node.name}?relatedNodes=callees`,
      callersHref: `/${this.source}/diagram/${node.name}?relatedNodes=callers`,
    })),
  }));
}
