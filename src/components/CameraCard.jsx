import React from "react";
import { Edit, Trash2, Video } from "lucide-react";

export default function CameraCard({ camera, onEdit, onDelete }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      <div className="aspect-video bg-black flex items-center justify-center">
        <Video className="w-10 h-10 text-gray-600" />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{camera.name}</h3>
        <p className="text-sm text-gray-400">{camera.location}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onEdit}
            className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
          >
            <Edit className="w-4 h-4 mr-1" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
