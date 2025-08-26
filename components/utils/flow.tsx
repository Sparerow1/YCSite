"use client"
import { Node, 
    Edge, 
    Position, 
    ReactFlow, 
    Controls, 
    useNodesState, 
    useEdgesState, 
    ConnectionLineType} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {initialNodes, nodeTypes, initialEdges} from './flowNodes';
import React from "react";
import dagre from 'dagre';



const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({})); // create a dagre graph object
const nodeWidth = 172;
const nodeHeight = 36; 



const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => { // get the layout of the elements
    const isHorizontal = direction === 'LR'; // check if the direction is horizontal, a boolean value
    dagreGraph.setGraph({ rankdir: direction }); // set the direction of the graph
   
    nodes.forEach((node) => { // for each node, set the node id, width, and height based on the nodeWidth and nodeHeight constants
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
   
    edges.forEach((edge) => { // for each edge, set the source and target of the edge based on the edge source and target properties
      dagreGraph.setEdge(edge.source, edge.target);
    });
   
    dagre.layout(dagreGraph); // layout the dagre graph
   
    const newNodes = nodes.map((node) => { // for each node, set the target and source position based on the direction
        const nodeWithPosition = dagreGraph.node(node.id); // get the node position from the dagre graph, which is default to the center of the node (x: 0, y: 0)
        const newNode = { // create a new node object with the target and source position based on the direction
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top, // if the direction is horizontal, set the target position to the left, otherwise set it to the top
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom, // if the direction is horizontal, set the source position to the right, otherwise set it to the bottom
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            position: {
              x: nodeWithPosition.x - nodeWidth / 2, // set the x position of the node to the node position x minus half of the node width
              y: nodeWithPosition.y - nodeHeight / 2, // set the y position of the node to the node position y minus half of the node height
            },
        };
        return newNode; // return the new node object
    });
      return { nodes: newNodes, edges }; // return the new nodes and the edges
    };
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements( 
        // get the layouted nodes and edges by calling the getLayoutedElements function with the initial nodes and edges imported from flowNodes.ts
        initialNodes, 
        initialEdges,
      );
 

export default function Flow() {
    const proOptions = { hideAttribution: true };
    const [nodes, , onNodesChange] = useNodesState(layoutedNodes); // use the useNodesState hook to set the nodes and handle node changes based on the layouted nodes
    const [edges, , onEdgesChange] = useEdgesState(layoutedEdges); // use the useEdgesState hook to set the edges and handle edge changes based on the layouted edges
 
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ReactFlow 
                proOptions={proOptions} 
                fitView
                nodes = {nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                connectionLineType={ConnectionLineType.SmoothStep}>
                <Controls/>
            </ReactFlow>
        </div>
    );
}