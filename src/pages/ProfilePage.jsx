// ProfilePage.jsx
// User profile management page
// Displays user info with edit capability
// Includes account actions: order history, password change, logout
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/api";
import ChangePasswordModal from "../components/ChangePasswordModal";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    memberSince: "",
  });

  // Form state for editing
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Get user profile from API
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await getProfile();
      setProfileData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        memberSince: data.createdAt,
      });
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit profile updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Update profile via API
      const { data } = await updateProfile(formData);

      setProfileData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        memberSince: profileData.memberSince,
      });

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing and revert changes
  const handleCancel = () => {
    setFormData({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
    });
    setIsEditing(false);
    setError(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && !profileData.firstName) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing && (
            <button
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="profile-content">
          {/* Profile Info Card */}
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {profileData.firstName?.[0]}
                {profileData.lastName?.[0]}
              </div>
            </div>

            {!isEditing ? (
              // View Mode
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">
                    {profileData.firstName} {profileData.lastName}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profileData.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Role:</span>
                  <span className="info-value role-badge">
                    {profileData.role?.toUpperCase()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Member Since:</span>
                  <span className="info-value">
                    {formatDate(profileData.memberSince)}
                  </span>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="profile-edit-form">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="save-btn">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Account Actions Card */}
          <div className="actions-card">
            <h3>Account Actions</h3>
            <div className="actions-list">
              <button
                className="action-btn"
                onClick={() => navigate("/orders")}
              >
                View Order History
              </button>
              <button
                className="action-btn"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </button>
              <button
                className="action-btn logout-btn"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
