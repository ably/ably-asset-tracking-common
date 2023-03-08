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
      text: this.formatNodeLabel(node.label),
      calleesHref: `/${this.source}/diagram/${node.name}?relatedNodes=callees`,
      callersHref: `/${this.source}/diagram/${node.name}?relatedNodes=callers`,
    })),
  }));

  private formatNodeLabel(label: string) {
    // Strip the line break tag and anything that comes after it.
    // I’m assuming that my node labels are of the format of a plain-text label, followed by optionally by a line break tag and some extra markup (an expanded description of the node) which we’ll omit.
    const lineBreakIndex = label.indexOf('<BR />');

    if (lineBreakIndex == -1) {
      return label;
    } else {
      return label.slice(0, lineBreakIndex);
    }
  }
}
