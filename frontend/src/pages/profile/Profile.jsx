import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser, updateProfile, clearMessages } from "../../features/auth/authSlice";
import Navbar from "../../components/userHeader/Navbar";
import ImageCropper from "../../components/cropper/ImageCropper";
import { getCroppedImg } from "../../components/cropper/cropUtils";
import { toast } from "react-toastify";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, successMessage } = useSelector(state => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [preview, setPreview] = useState(null);

  const toastDisplayed = useRef(false); 

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

  useEffect(() => {
    if (!toastDisplayed.current) {
      if (successMessage) {
        toast.success(successMessage);
        toastDisplayed.current = true;
        dispatch(clearMessages());
      } else if (error) {
        toast.error(error);
        toastDisplayed.current = true;
        dispatch(clearMessages());
      }
    }
  }, [successMessage, error, dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setPreview(url);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    toastDisplayed.current = false; 

    let blob = null;
    if (imageSrc && croppedAreaPixels) {
      blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      setPreview(URL.createObjectURL(blob));
    }

    const formData = new FormData();
    if (name !== user.name) formData.append("name", name);
    if (email !== user.email) formData.append("email", email);
    if (blob) formData.append("profileImage", blob, "profile.jpg");

    if (formData.entries().next().done) {
      toast.info("No changes made!");
      return;
    }

    const resultAction = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(resultAction)) {
      dispatch(fetchCurrentUser());
      setEditMode(false);
      setImageSrc(null);
    } else {
      toast.error(resultAction.payload || "Failed to update profile!");
    }
  };

  if (loading && !user) return <p>Loading...</p>;
  if (!user) return <p>No user found</p>;

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
              <div className="profile-placeholder">{user.name[0].toUpperCase()}</div>
            )}
          </div>

          {!editMode ? (
            <>
              <div className="profile-info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <button onClick={() => setEditMode(true)}>Edit</button>
            </>
          ) : (
            <form onSubmit={handleUpdate} className="profile-edit-form">
              <input value={name} onChange={(e) => setName(e.target.value)} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {imageSrc && (
                <ImageCropper
                  imageSrc={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  setCrop={setCrop}
                  setZoom={setZoom}
                  setCroppedAreaPixels={setCroppedAreaPixels}
                />
              )}
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;