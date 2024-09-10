import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import { CommunityCollection } from "../../interfaces/interfaces";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export interface Courses {
  _id: string;
  name: string;
  community: string;
  desc: string;
  featured: boolean;
  media: string;
  hours: string;
  chapters: any[];
  files: any[];
  order: number;
  category?: string;
}
interface HomeProps {
  host?: string;
  channel?: string;
}
export default function CourseManagement({
  host,
  channel,
  roles,
  setRoles,
}: HomeProps) {
  const [groupedCourses, setGroupedCourses] = useState<{
    [key: string]: Courses[];
  }>({});
  const [community, setCommunity] = useState<CommunityCollection>();

  useEffect(() => {
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const communityResponse = await fetch(
          `${getApiDomain()}/community?name=${host}`,
        );
        if (!communityResponse.ok) {
          throw new Error("Network response was not ok for community fetch");
        }
        const communityData = await communityResponse.json();
        setCommunity(communityData);

        const postsResponse = await fetch(
          `${getApiDomain()}/community/courses?oid=${communityData.community.id}&page=1`,
        );
        if (!postsResponse.ok) {
          throw new Error("Network response was not ok for courses fetch");
        }
        const postsData = await postsResponse.json();
        groupCoursesByCategory(postsData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [host, channel]);

  const groupCoursesByCategory = (courses: Courses[]) => {
    const grouped = courses.reduce(
      (acc, course) => {
        const category = course.category || "Uncategorised";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(course);
        return acc;
      },
      {} as { [key: string]: Courses[] },
    );

    // Sort each category by order
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.order - b.order);
    });

    setGroupedCourses(grouped);
  };

  const handleDragEnd = (result: any, category: string) => {
    if (!result.destination) return;

    const updatedCourses = Array.from(groupedCourses[category]);
    const [reorderedCourse] = updatedCourses.splice(result.source.index, 1);
    updatedCourses.splice(result.destination.index, 0, reorderedCourse);

    // Update the order values
    updatedCourses.forEach((course, index) => {
      course.order = index + 1;
    });

    setGroupedCourses((prev) => ({ ...prev, [category]: updatedCourses }));

    // Save the reordered list
    saveReorderedCourses(updatedCourses);
  };

  const saveReorderedCourses = async (updatedCourses: Courses[]) => {
    try {
      toast("saving all courses, please wait...");
      await axios.post(
        `${getApiDomain()}/community/updatecourses`,
        updatedCourses,
      );
      console.log("Courses reordered successfully");
      toast.success("saved");
    } catch (error) {
      console.error("Error saving reordered courses:", error);
    }
  };

  return (
    <div className="course-management">
      <ToastContainer />
      {Object.keys(groupedCourses).map((category) => (
        <div key={category} className="course-category">
          <h2>{category}</h2>

          <DragDropContext
            onDragEnd={(result) => handleDragEnd(result, category)}
          >
            <Droppable droppableId={category}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="droppable-area"
                >
                  {groupedCourses[category].map((course, index) => (
                    <Draggable
                      key={course._id}
                      draggableId={course._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="group relative divide-gray-200 rounded-lg bg-white dark:bg-zinc-900 shadow p-4 mb-2"
                        >
                          <div className="course-content">
                            <div className="grid grid-cols-5 grid-rows-1 gap-4">
                              <div className="col-span-1">
                                <img src={course.media} className="h-24 " />{" "}
                              </div>
                              <div className="col-span-4 col-start-2">
                                <h3>{course.name}</h3>
                                <p>{course.desc}</p>
                              </div>
                            </div>

                            {/* Add more course details here */}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ))}
    </div>
  );
}
