import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser, updateProfile, clearMessages } from "../../features/auth/authSlice";
import Navbar from "../../components/userHeader/Navbar";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import "./Profile.css";

// Utility to crop image
const getCroppedImg = (imageSrc, crop, zoom, aspect = 1) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const size = Math.min(image.width, image.height);
      canvas.width = size;
      canvas.height = size;

      const sx = crop.x * image.width / 100;
      const sy = crop.y * image.height / 100;
      const sWidth = size / zoom;
      const sHeight = size / zoom;

      ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, size, size);
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    };
  });
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, successMessage } = useSelector(state => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setImageSrc(url);
    setPreview(url);
  };

  const handleCropComplete = useCallback(async () => {
    if (!imageSrc) return;
    const blob = await getCroppedImg(imageSrc, crop, zoom);
    setCroppedBlob(blob);
    setPreview(URL.createObjectURL(blob));
  }, [imageSrc, crop, zoom]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (croppedBlob) formData.append("profileImage", croppedBlob, "profile.jpg");

    await dispatch(updateProfile(formData));
    setEditMode(false);
    setFile(null);
    setImageSrc(null);
    setCroppedBlob(null);
  };

  if (loading && !user) return <p className="loading">Loading user...</p>;
  if (!user) return <p className="loading">No user found</p>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h2>Profile</h2>

        <div className="profile-card">
          <div className="profile-image-container">
            {preview ? (
              <img src={preview} alt="Profile" className="profile-image" />
            ) : user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="profile-image" />
            ) : (
              <div className="profile-placeholder">
                {user.name[0].toUpperCase()}
              </div>
            )}
          </div>

          {!editMode && (
            <>
              <div className="profile-info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
            </>
          )}

          {editMode && (
            <form onSubmit={handleUpdate} className="profile-edit-form">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input type="file" accept="image/*" onChange={handleFileChange} />

              {imageSrc && (
                <div className="crop-container">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                  <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e, zoom) => setZoom(zoom)}
                  />
                </div>
              )}

              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Save"}
              </button>
              <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
            </form>
          )}

          {successMessage && <p className="message">{successMessage}</p>}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default Profile;