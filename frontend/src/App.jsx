import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur de connexion au backend");
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Liste des utilisateurs</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {users.length === 0 ? (
        <p>Aucun utilisateur trouvé</p>
      ) : (
        users.map((user) => (
          <div key={user._id} style={{ marginBottom: "10px" }}>
            <strong>{user.name}</strong>
            <p>{user.email}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;
