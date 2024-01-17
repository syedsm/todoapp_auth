import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Todo = () => {
  const [listName, setListName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [todoLists, setTodoLists] = useState([]);
  const [selectedListIndex, setSelectedListIndex] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleListSelection = (event) => {
    const selectedIndex = event.target.value === '' ? null : parseInt(event.target.value);
    setSelectedListIndex(selectedIndex);
  };

  const handleListNameChange = (event) => {
    setListName(event.target.value);
  };

  const handleCreateList = () => {
    const newList = {
      id: Date.now(),
      name: listName,
      tasks: [],
    };

    setTodoLists((prevLists) => [...prevLists, newList]);
    setListName('');
  };

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleAddTask = () => {
    if (selectedListIndex !== null) {
      if (!taskName || !taskDescription || !dueDate || !priority) {
        alert('Please fill in all fields');
        return;
      }

      const newTask = {
        id: Date.now(),
        name: taskName,
        description: taskDescription,
        dueDate: dueDate,
        priority: priority,
      };

      setTodoLists((prevLists) => {
        const updatedLists = prevLists.map((list, index) => {
          if (index === selectedListIndex) {
            return { ...list, tasks: [...list.tasks, newTask] };
          }
          return list;
        });

        return updatedLists;
      });

      setTaskName('');
      setTaskDescription('');
      setDueDate('');
      setPriority('medium');
    } else {
      console.error('Selected List Index is not set correctly.');
    }
  };

  const handleDeleteTask = (listIndex, taskIndex) => {
    setTodoLists((prevLists) => {
      const updatedLists = prevLists.map((list, index) => {
        if (index === listIndex) {
          const updatedTasks = list.tasks.filter((task, i) => i !== taskIndex);
          return { ...list, tasks: updatedTasks };
        }
        return list;
      });
      return updatedLists;
    });
  };

  const handleUpdateTask = () => {
    if (selectedListIndex !== null && selectedTask !== null) {
      setTodoLists((prevLists) => {
        return prevLists.map((list, index) => {
          if (index === selectedListIndex) {
            return {
              ...list,
              tasks: list.tasks.map((task) => {
                if (task.id === selectedTask.id) {
                  return {
                    ...task,
                    name: selectedTask.name,
                    description: selectedTask.description,
                    dueDate: selectedTask.dueDate,
                    priority: selectedTask.priority,
                  };
                }
                return task;
              }),
            };
          }
          return list;
        });
      });
      closeUpdateForm();
    } else {
      console.error('Selected List Index or Task is not set correctly.');
    }
  };

  const openUpdateForm = (listIndex, taskIndex) => {
    setSelectedListIndex(listIndex);
    const selectedTask = todoLists[listIndex].tasks[taskIndex];
    setSelectedTask(selectedTask);
    setIsUpdateFormOpen(true);
  };

  const closeUpdateForm = () => {
    setSelectedTask(null);
    setIsUpdateFormOpen(false);
  };

  const handleDragEnd = (result) => {
    console.log('Drag End Result:', result);

    if (!result.destination) return;

    const sourceListIndex = parseInt(result.source.droppableId.split('-')[0]);
    const destinationListIndex = parseInt(result.destination.droppableId.split('-')[0]);
    console.log('Source List Index:', sourceListIndex);
    console.log('Destination List Index:', destinationListIndex);

    if (['low', 'medium', 'high'].includes(result.destination.droppableId)) {
      if (sourceListIndex === destinationListIndex) {
        // Same list move logic
        const sourceTaskIndex = result.source.index;
        const destinationTaskIndex = result.destination.index;

        setTodoLists((prevLists) => {
          const updatedLists = [...prevLists];
          const [removed] = updatedLists[sourceListIndex].tasks.splice(sourceTaskIndex, 1);
          updatedLists[destinationListIndex].tasks.splice(destinationTaskIndex, 0, removed);

          return updatedLists;
        });
      } else {
        // Different list move logic
        const sourceTaskIndex = result.source.index;
        const draggedTask = todoLists[sourceListIndex].tasks[sourceTaskIndex];

        const updatedTask = {
          ...draggedTask,
          priority: result.destination.droppableId.split('-')[1], // Use the provided priority directly
        };

        setTodoLists((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[sourceListIndex].tasks.splice(sourceTaskIndex, 1);
          updatedLists[destinationListIndex].tasks.push(updatedTask);

          return updatedLists;
        });

        handleListNameChangeOnDrop(sourceListIndex, destinationListIndex);
      }
    }
  };


  const getPriorityFromListIndex = (index) => {
    // Split the index to extract the priority
    const [, priority] = index.split('-');

    switch (priority) {
      case 'low':
        return 'low';
      case 'medium':
        return 'medium';
      case 'high':
        return 'high';
      default:
        return 'medium';
    }
  };


  const handleListNameChangeOnDrop = (sourceListIndex, destinationListIndex) => {
    setTodoLists((prevLists) => {
      const updatedLists = [...prevLists];

      // Get the source and destination list names
      const sourceListName = updatedLists[sourceListIndex].name;
      const destinationListName = updatedLists[destinationListIndex].name;

      // Update the destination list name with the source list name
      updatedLists[destinationListIndex] = {
        ...updatedLists[destinationListIndex],
        name: sourceListName,
      };

      // Update the source list name with the destination list name
      updatedLists[sourceListIndex] = {
        ...updatedLists[sourceListIndex],
        name: destinationListName,
      };

      return updatedLists;
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>

      <div className="container mt-5">
        <h2 className="text-center mb-4">Todo App</h2>
        <div className="mb-3">
          <label className="form-label">Todo List Name</label>
          <div className="input-group">
            <input
              type="text"
              value={listName}
              onChange={handleListNameChange}
              className="form-control"
            />
            <button onClick={handleCreateList} className="btn btn-primary ms-2">
              Create List
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="mb-3">Add Task</h3>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Task Name</label>
              <input
                type="text"
                value={taskName}
                onChange={handleTaskNameChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-8">
              <label className="form-label">Task Description</label>
              <textarea
                value={taskDescription}
                onChange={handleTaskDescriptionChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={handleDueDateChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Priority</label>
              <select
                value={priority}
                onChange={handlePriorityChange}
                className="form-control"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Select Todo List</label>
              <select
                value={selectedListIndex}
                onChange={handleListSelection}
                className="form-control"
              >
                <option value="">Select List</option>
                {todoLists.map((list, index) => (
                  <option key={list.id} value={index}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 mt-3">
              <button onClick={handleAddTask} className="btn btn-success">
                Add Task
              </button>
            </div>
          </div>
        </div>

        <div className="container mt-5 text-center">
          <div className="row">
            {todoLists.map((list, index) => (
              <div key={list.id} className="col-md-12">
                <div className="mt-4 border p-2 shadow-sm rounded">
                  <h5 className='text-center border p-2 shadow-sm rounded'>{list.name}</h5>
                  <Droppable droppableId={`${index}`} direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="priority-boxes row"
                      >
                        {['low', 'medium', 'high'].map((priority, priorityIndex) => (
                          <div key={priority} className="col-md-4">
                            <div className="mt-3 border p-2 shadow-sm rounded priority-box">
                              <h6 className="text-center">{priority}</h6>
                              <Droppable droppableId={`${index}-${priority}`} direction="vertical">
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="priority-box-inner"
                                  >
                                    {list.tasks
                                      .filter((task) => task.priority === priority)
                                      .map((task, taskIndex) => (
                                        <Draggable
                                          key={task.id}
                                          draggableId={`${index}-${taskIndex}`}  
                                          index={taskIndex}
                                        >
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              style={{
                                                zIndex: snapshot.isDragging ? 9999 : 'auto',
                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                                ...provided.draggableProps.style,
                                              }}
                                            >
                                              <TaskItem
                                                key={task.id}
                                                task={task}
                                                listIndex={index}
                                                taskIndex={taskIndex}
                                                onDelete={() => handleDeleteTask(index, taskIndex)}
                                                onUpdate={() => openUpdateForm(index, taskIndex)}
                                              />
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isUpdateFormOpen && (
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Task</h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={closeUpdateForm}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Task Name</label>
                    <input
                      type="text"
                      value={selectedTask?.name || ''}
                      onChange={(e) => setSelectedTask({ ...selectedTask, name: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Task Description</label>
                    <textarea
                      value={selectedTask?.description || ''}
                      onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      value={selectedTask?.dueDate || ''}
                      onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select
                      value={selectedTask?.priority || 'medium'}
                      onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                      className="form-control"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={handleUpdateTask}>
                    Update Task
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeUpdateForm}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </DragDropContext>
  );
};

export default Todo;

{/* <div className="row">
          {todoLists.map((list, index) => (
            <div key={list.id} className="col-md-2">
              <div className="mt-4 border p-2 shadow-sm rounded">
                <h5 className='text-center'>{list.name}</h5>
                <Droppable droppableId={`${index}`}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {list.tasks.map((task, taskIndex) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={taskIndex}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskItem
                                key={task.id}
                                task={task}
                                listIndex={index}
                                taskIndex={taskIndex}
                                onDelete={() => handleDeleteTask(index, taskIndex)}
                                onUpdate={() => openUpdateForm(index, taskIndex)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div> */}


import React, { useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskItem = ({ task, listIndex, taskIndex, onDelete, onUpdate }) => {
  useEffect(() => {
    console.log('listIndex:', listIndex);
    console.log('task.id:', task.id);
    console.log('draggableId:', `${listIndex}-${task.id}`);
  }, [listIndex, task.id]);

  return (
    <Draggable
      key={task.id}
      draggableId={`${listIndex}-${task.id}`}
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
