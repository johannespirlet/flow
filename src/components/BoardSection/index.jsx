// import { useState } from 'react';
import Task from '../Task';
import styles from './styles.module.css';
// import { DndContext, DragOverlay } from '@dnd-kit/core';
// import { useDraggable } from '@dnd-kit/core';

export default function BoardSection({ headingTitle, taskItems }) {
	// const [activeId, setActiveId] = useState(null);

	return (
		// <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
		<article className={styles.boardSection}>
			<h3>{headingTitle}</h3>
			<ul className={styles.taskList}>
				{taskItems.map(
					(task) =>
						task.section === headingTitle && (
							//<Draggable key={task._id} id={task._id}>
							<Task key={task._id} task={task} />
							//</Draggable>
						)
				)}
			</ul>
			{/* <DragOverlay>{activeId ? <Task value={activeId} /> : null}</DragOverlay> */}
		</article>
	);
	/* </DndContext> */

	/* 	function handleDragStart(event) {
		setActiveId(event.active.id);
	}

	function handleDragEnd() {
		setActiveId(null);
	}

	function Draggable(props) {
		const Element = props.element || 'div';
		const { attributes, listeners, setNodeRef } = useDraggable({
			id: props.id,
		});

		return (
			<Element ref={setNodeRef} {...listeners} {...attributes}>
				{props.children}
			</Element>
		);
	} */
}
