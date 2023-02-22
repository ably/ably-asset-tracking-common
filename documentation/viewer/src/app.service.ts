import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

export interface Subgraph {
  name: string;
  label: string;
  nodes: Node[];
}

interface Node {
  name: string;
  label: string;
}

export enum RelatedNodes {
  Callers,
  Callees,
}

export type DataSource = 'subscriber' | 'publisher';

@Injectable()
export class AppService {
  async getSubgraphs(source: DataSource): Promise<Subgraph[]> {
    const allNodesGvprOutput = await this.getAllNodesGvprOutput(source);
    const allNodesGvprOutputLines = allNodesGvprOutput.split('\n');

    const subgraphs: Subgraph[] = [];

    for (let i = 0; i < allNodesGvprOutputLines.length - 3; i += 4) {
      /* allNodesGvprOutputLines is in groups of 4 lines, like:
       * node_name: AblyConnectionStateChange
       * node_label: AblyConnectionStateChange
       * subgraph_name: cluster_workers
       * subgraph_label: Workers
       */

      const nodeName = allNodesGvprOutputLines[i].slice('node_name: '.length);
      const nodeLabel = allNodesGvprOutputLines[i + 1].slice(
        'node_label: '.length,
      );
      const subgraphName = allNodesGvprOutputLines[i + 2].slice(
        'subgraph_name: '.length,
      );
      const subgraphLabel = allNodesGvprOutputLines[i + 3].slice(
        'subgraph_label: '.length,
      );

      const subgraph = subgraphs.find(
        (subgraph) => subgraph.name == subgraphName,
      );

      const node: Node = { name: nodeName, label: nodeLabel };

      if (subgraph === undefined) {
        const subgraph = {
          name: subgraphName,
          label: subgraphLabel,
          nodes: [node],
        };
        subgraphs.push(subgraph);
      } else {
        subgraph.nodes.push(node);
      }
    }

    // The listeners aren’t of any use to present in a list to the user; they’re only interesting on the rendered graph.
    const userFacingSubgraphs = subgraphs.filter(
      (subgraph) =>
        subgraph.name != 'passed_listeners' &&
        subgraph.name != 'ably_wrapper_listeners',
    );

    return userFacingSubgraphs;
  }

  private async getAllNodesGvprOutput(source: DataSource): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(`gvpr -f gvpr/all_nodes.gvpr ../${source}.dot`, (err, stdout) => {
        if (err) {
          reject(err);
        }
        resolve(stdout);
      });
    });
  }

  async generateFullSvgDiagram(source: DataSource): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(`dot -Tsvg ../${source}.dot`, (err, stdout) => {
        if (err) {
          reject(err);
        }
        resolve(stdout);
      });
    });
  }

  async generateSvgDiagramForNode(
    source: DataSource,
    nodeName: string,
    relatedNodes: RelatedNodes,
  ): Promise<string> {
    const dotSource = await new Promise((resolve, reject) => {
      let edgeDirectionArgument: string;

      switch (relatedNodes) {
        case RelatedNodes.Callers:
          edgeDirectionArgument = 'reverse';
          break;
        case RelatedNodes.Callees:
          edgeDirectionArgument = 'forward';
          break;
      }

      exec(
        `gvpr -f gvpr/subgraph.gvpr -a ${nodeName} -a ${edgeDirectionArgument} ../${source}.dot`,
        (err, stdout) => {
          if (err) {
            reject(err);
          }
          resolve(stdout);
        },
      );
    });

    return new Promise((resolve, reject) => {
      const childProcess = exec(`dot -Tsvg`, (err, stdout) => {
        if (err) {
          reject(err);
        }
        resolve(stdout);
      });

      childProcess.stdin.write(dotSource);
      childProcess.stdin.end();
    });
  }
}
