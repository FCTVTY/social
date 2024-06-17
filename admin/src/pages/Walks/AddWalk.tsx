// WalkForm.tsx
import React from 'react';
import MapComponent from './MapComponent';

interface WalkFormProps {
    onSubmit: (walk: any) => void;
}

const WalkForm: React.FC<WalkFormProps> = ({ onSubmit }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Submit form data including geopoints
        const formData = new FormData(e.currentTarget);
        const walkData: any = {};
        formData.forEach((value, key) => {
            if (key === 'tags') {
                if (typeof value === "string") {
                    walkData[key] = value.split(',').map((tag: string) => tag.trim());
                }
            } else {
                walkData[key] = value;
            }
        });
        walkData.geo = JSON.stringify(walkData.geo); // Convert geopoints to JSON string
        onSubmit(walkData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" />
            </label>
            <label>
                Details:
                <textarea name="details" />
            </label>
            <label>
                Tags (comma-separated):
                <input type="text" name="tags" />
            </label>
            <label>
                Geopoints:
                <input type="hidden" name="geo" value={[]} /> {/* Placeholder for geopoints */}
                <MapComponent />
            </label>
            <button type="submit">Add Walk</button>
        </form>
    );
};

export default WalkForm;
