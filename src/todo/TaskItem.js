import React, { useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskItem = ({ key, task, listIndex, taskIndex, onDelete, onUpdate }) => {
  useEffect(() => {
    console.log('key :', key)
    console.log('listIndex:', listIndex);
    console.log('task.id:', task.id);
    console.log('task:', task);

    console.log('draggableId:', `${listIndex}-${task.id}`);
  }, [listIndex, task.id, key, task]);

  return (
    <Draggable
      key={task.id}
      draggableId={`${listIndex}-${task.id}`}
      // draggableId={`${list.id}-${task.id}`}
      index={taskIndex}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-item ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <h6>{task.name}</h6>
          <p>{task.description}</p>
          <p>Due Date: {task.dueDate}</p>
          <p>Priority: {task.priority}</p>
          <div className="task-actions">
            <button className="btn btn-danger" onClick={onDelete}>
              Delete
            </button>
            <button className="btn btn-primary ms-2" onClick={onUpdate}>
              Update
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
