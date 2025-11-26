/**
 * NanostoresInfo Component
 * Educational component showcasing Nanostores features
 */

import { useState } from 'react';

export function NanostoresInfo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="nanostores-info">
      <button
        className="info-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        ℹ️ About Nanostores {isExpanded ? '▼' : '▶'}
      </button>

      {isExpanded && (
        <div className="info-content">
          <h3>🎯 Nanostores Features</h3>
          <ul>
            <li>
              <strong>Ultra-lightweight:</strong> Less than 1KB (gzipped)
            </li>
            <li>
              <strong>Framework-agnostic:</strong> Works with React, Vue, Svelte,
              Preact, vanilla JS
            </li>
            <li>
              <strong>TypeScript-first:</strong> Excellent type inference
            </li>
            <li>
              <strong>Tree-shakeable:</strong> Only bundle what you use
            </li>
            <li>
              <strong>Simple API:</strong> atom, map, computed
            </li>
            <li>
              <strong>Built-in persistence:</strong> LocalStorage support
            </li>
          </ul>

          <h3>📦 Stores Used in This App</h3>
          <ul>
            <li>
              <code>$filter</code> - persistentAtom (filter state + localStorage)
            </li>
            <li>
              <code>$todos</code> - persistentAtom (todos + localStorage)
            </li>
            <li>
              <code>$editingId</code> - atom (transient editing state)
            </li>
            <li>
              <code>$filteredTodos</code> - computed (derived from $todos + $filter)
            </li>
            <li>
              <code>$stats</code> - computed (statistics from $todos)
            </li>
            <li>
              <code>$sortedFilteredTodos</code> - computed (sorted filtered todos)
            </li>
          </ul>

          <h3>🔄 Why Nanostores?</h3>
          <ul>
            <li>Perfect for small to medium apps</li>
            <li>No boilerplate or complex setup</li>
            <li>Can share state between different frameworks!</li>
            <li>Great for micro-frontends</li>
          </ul>

          <div className="code-example">
            <h4>Example: Framework-agnostic usage</h4>
            <pre>{`// Works anywhere!
import { atom } from 'nanostores';

const $count = atom(0);

// Subscribe (vanilla JS)
$count.listen((value) => {
  console.log('Count:', value);
});

// Update
$count.set($count.get() + 1);`}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
