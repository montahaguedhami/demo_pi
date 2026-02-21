import { useEffect } from "react";
import API from "../services/api";

function Dashboard() {

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        console.log("Users:", res.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchUsers();
  }, []);

  return <h1>Dashboard</h1>;
}

export default Dashboard;
