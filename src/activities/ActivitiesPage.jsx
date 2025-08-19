// import useQuery from "../api/useQuery"

// export default function ActivitiesPage() {
//   return (
//     <>
//       <h1>Activities</h1>
//       <p>Imagine all the activities!</p>
//     </>
//   );
// }

// import useQuery from "../api/useQuery"

// export default function ActivitiesPage() {
//   // Fetch activities using your custom hook
//   const { data: activities, isLoading, error } = useQuery("/activities");

//   return (
//     <>
//       <h1>Activities</h1>
//       {activities && activities.length > 0 ? (
//         <ul>
//           {activities.map((activity) => (
//             <li key={activity.id}>
//               <strong>{activity.name}</strong>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No activities found.</p>
//       )}
//     </>
//   );
// }
import useQuery from "../api/useQuery";
import { useAuth } from "../auth/AuthContext";
import { API } from "../api/ApiContext";
import { useState } from "react";
import {useMutation} from "../api/useMutation"

export default function ActivitiesPage() {
  const { token } = useAuth();
  const {
    data: activities,
    isLoading,
    error,
    refetch,
  } = useQuery("/activities");
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (activityId) => {
    setDeletingId(activityId);
    try {
      await fetch(`${API}/activities/${activityId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      refetch(); // Refresh the activities list
    } catch (e) {
      // Optionally handle error
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <p>Loading activities...</p>;
  if (error) return <p>Error loading activities.</p>;

   const {
    mutate: addActivity,
    loading: adding,
    error: addError,
  } = useMutation("POST", "/activities", ["activities"]);


  return (
    <>
      <h1>Activities</h1>
      {activities && activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <strong>{activity.name}</strong>
              {token && (
                <button
                  onClick={() => handleDelete(activity.id)}
                  disabled={deletingId === activity.id}
                  style={{ marginLeft: "1em" }}
                >
                  {deletingId === activity.id ? "Deleting..." : "Delete"}
                </button>
              )}
            </li>
          ))}
          <h2> Add Activity</h2>
          <form>
            <div className="mb-3">
              <label  className="form-label">
                Add Activity Name
              </label>
              <input
                type="Text"
                className="form-control"
                
              />
              
            </div>
            <div className="mb-3">
              <label  className="form-label">
                Description
              </label>
              <input
                type="Text"
                className="form-control"
                
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </ul>
      ) : (
        <p>No activities found.</p>
      )}
    </>
  );
}
