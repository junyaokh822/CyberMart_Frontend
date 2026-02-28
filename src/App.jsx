import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { getProducts, getCart, getOrders } from "./services/api";
import "./App.css";

const TestDashboard = () => {
  const { user, login, register, logout, isAuthenticated, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [apiResults, setApiResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        await register({ firstName, lastName, email, password });
      } else {
        await login(email, password);
      }
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const testApi = async (apiCall) => {
    setLoading(true);
    try {
      const result = await apiCall();
      setApiResults({
        success: true,
        data: result.data,
        status: result.status,
      });
    } catch (error) {
      setApiResults({
        success: false,
        error: error.response?.data?.error || error.message,
        status: error.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <h2>{isRegistering ? "Register" : "Login"} Test</h2>

        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ marginBottom: "10px" }}
          >
            Switch to {isRegistering ? "Login" : "Register"}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
            </>
          )}
          <div style={{ marginBottom: "10px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
            }}
          >
            {loading ? "Loading..." : isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <div style={{ marginTop: "30px" }}>
          <h3>Test Public API</h3>
          <button
            onClick={() => testApi(() => getProducts())}
            disabled={loading}
            style={{ padding: "8px", marginRight: "10px" }}
          >
            Test GET /products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>API Test Dashboard</h2>
        <button onClick={logout} style={{ padding: "8px 16px" }}>
          Logout
        </button>
      </div>

      <div
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <h3>User Info:</h3>
        <pre style={{ background: "#fff", padding: "10px" }}>
          {JSON.stringify(user, null, 2)}
        </pre>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
        <p>
          <strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Test API Endpoints:</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => testApi(() => getProducts())}
            disabled={loading}
          >
            GET /products
          </button>
          <button onClick={() => testApi(() => getCart())} disabled={loading}>
            GET /cart
          </button>
          <button onClick={() => testApi(() => getOrders())} disabled={loading}>
            GET /orders
          </button>
          {isAdmin && (
            <button
              onClick={() => testApi(() => getAllOrders())}
              disabled={loading}
            >
              GET /orders/admin/all (Admin)
            </button>
          )}
        </div>
      </div>

      {apiResults && (
        <div style={{ marginTop: "20px" }}>
          <h3>API Response:</h3>
          <div
            style={{
              background: apiResults.success ? "#d4edda" : "#f8d7da",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <p>
              <strong>Status:</strong> {apiResults.status}
            </p>
            <p>
              <strong>Success:</strong> {apiResults.success ? "✓" : "✗"}
            </p>
            {apiResults.error && (
              <p>
                <strong>Error:</strong> {apiResults.error}
              </p>
            )}
            <pre
              style={{ background: "#fff", padding: "10px", overflow: "auto" }}
            >
              {JSON.stringify(apiResults.data || apiResults.error, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return <TestDashboard />;
}

export default App;
