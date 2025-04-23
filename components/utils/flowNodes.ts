import { Position } from '@xyflow/react';
import CustomModalPopupNode from './flowNodeTypes';


export const nodeTypes = {
  custom: CustomModalPopupNode
};

const edgeType = 'smoothstep';

const position = {x: 0, y: 0};
export const initialNodes = [
    {
      id: '1',
      position,
      data: { label: 'About Me' },
      type: 'custom',
      draggable: false,
      sourcePosition: Position.Bottom,
    },
    {
        id: '2',
        position: { x: 200, y: 100 },
        data: { label: 'Aspiration' },
        type: 'custom',
        draggable: false,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
    },
    {
        id: '3',
        position: { x: 0, y: 100 },
        data: { label: 'Perserverance' },
        type: 'custom',
        draggable: false,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
    },
    {
        id: '4',
        position: { x: 300, y: 300 },
        data: { label: 'Culture' },
        type: 'custom',
        draggable: false,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
    },
    {
        id: '5',
        position: { x: 400, y: 400 },
        data: { label: 'University Life' },
        type: 'custom',
        draggable: false,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
    },
    {
        id: '6',
        position: { x: 500, y: 500 },
        data: { label: 'Came From' },
        type: 'custom',
        draggable: false,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
    },
    {
        id: '7',
        position: { x: 600, y: 600 },
        data: { label: 'Immigration' },
        type: 'custom',
        draggable: false,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
    },
    {
        id: '8',
        position: { x: 700, y: 700 },
        data: { label: 'Education' },
        type: 'custom',
        draggable: false,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
    }
  ];

export const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, type: edgeType, sourceHandle: 'bottom', targetHandle: 'top'},
    { id: 'e1-3', source: '1', target: '3', animated: true, type: edgeType, sourceHandle: 'bottom', targetHandle: 'top'},
    { id: 'e1-4', source: '1', target: '4', animated: true, type: edgeType, sourceHandle:'bottom', targetHandle: 'top'},
    { id: 'e1-5', source: '1', target: '5', animated: true, type: edgeType, sourceHandle:'bottom', targetHandle: 'top'},
    { id: 'e4-6', source: '4', target: '6', animated: true, type: edgeType, sourceHandle:'bottom', targetHandle: 'top'},
    { id: 'e3-7', source: '3', target: '7', animated: true, type: edgeType, sourceHandle:`bottom`, targetHandle: 'top'},
    { id: 'e5-8', source: '5', target: '8', animated: true, type: edgeType, sourceHandle:'bottom', targetHandle: 'top'}
];