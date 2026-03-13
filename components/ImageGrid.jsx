'use client';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import ImageCard from './ImageCard';

export default function ImageGrid({ images, onReorder, onRemove, onMoveUp, onMoveDown, onMoveToPosition }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    onReorder(arrayMove(images, oldIndex, newIndex));
  };

  const activeImage = images.find((i) => i.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              index={index}
              total={images.length}
              onRemove={onRemove}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onMoveToPosition={onMoveToPosition}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeImage ? (
          <div className="opacity-80 rotate-2 scale-105 shadow-2xl rounded-xl overflow-hidden border-2 border-violet-400">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeImage.objectURL} alt="" className="w-32 h-24 object-cover" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
