"use client";

import { useState } from 'react';
import { Button } from './ui/button';

export default function TestComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Test Component</h1>
      <p className="mb-4">Compteur: {count}</p>
      <Button onClick={() => setCount(count + 1)}>
        Incrémenter
      </Button>
    </div>
  );
} 