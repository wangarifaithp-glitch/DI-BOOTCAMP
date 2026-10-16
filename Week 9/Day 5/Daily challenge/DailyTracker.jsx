import React, { useState } from "react";

import CategorySelector from "./CategorySelector.jsx";
import TaskList from "./TaskList.jsx";

export default function DailyTracker() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Make space for what matters</p>
        <h1>A little progress, every day.</h1>
        <p className="intro">
          Keep your tasks organized, and celebrate each thing you get done.
        </p>
      </header>
      <div className="tracker-layout">
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <TaskList selectedCategory={selectedCategory} />
      </div>
    </main>
  );
}
