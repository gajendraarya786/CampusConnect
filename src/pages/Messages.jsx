import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PersonalChat from "../components/PersonalChat";

export default function Messages() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [targetUserId, setTargetUserId] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/users/all", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));
  }, [token]);

  if (!user) return <div>Please log in to chat.</div>;

  return (
    <div>
      <h2>Start a chat:</h2>
      <ul>
        {users
          .filter(u => u._id !== user._id)
          .map(u => (
            <li key={u._id}>
              <button onClick={() => setTargetUserId(u._id)}>
                {u.fullname || u.username}
              </button>
            </li>
          ))}
      </ul>
      {targetUserId && (
        <PersonalChat
          userId={user._id}
          otherUserId={targetUserId}
          token={token}
        />
      )}
    </div>
  );
}