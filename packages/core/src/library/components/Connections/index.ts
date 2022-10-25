import { tick } from 'svelte';
import { get } from 'svelte/store';
import { Point } from '../..';
import { InternalNode } from '../Nodes';

export const getConnections = <T extends InternalNode<any, any>>(
  nodes: Record<string, T>,
): Promise<{ p1: Point; p2: Point }[]> =>
  new Promise((resolve) => {
    let newConnections: { p1: Point; p2: Point }[] = [];

    tick().then(() => {
      Object.keys(nodes).forEach((nodeId) => {
        const inputs = nodes[nodeId].inputs;
        if (inputs) {
          Object.keys(inputs).forEach((id) => {
            const input = inputs?.[id];
            if (input.connection) {
              const connection = get(input.connection);

              if (connection) {
                const output =
                  nodes[connection.connectedNodeId]?.outputs?.[connection.connectedSocketId];

                if (output) {
                  newConnections = [
                    ...newConnections,
                    {
                      p1: {
                        x: input.coordinates.x,
                        y: input.coordinates.y,
                      },
                      p2: {
                        x: output.coordinates?.x,
                        y: output.coordinates?.y,
                      },
                    },
                  ];
                }
              }
            }
          });
        }
      });
      resolve(newConnections);
    });
  });