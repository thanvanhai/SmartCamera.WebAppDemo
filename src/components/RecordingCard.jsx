import React from "react";
import { Play, Clock } from "lucide-react";

export default function RecordingCard({ recording }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      <div className="aspect-video bg-black flex items-center justify-center">
        <Play className="w-10 h-10 text-gray-600" />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{recording.title || "Recording"}</h3>
        <p className="text-sm text-gray-400 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {new Date(recording.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
