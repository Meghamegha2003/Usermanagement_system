import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { showToast } from "../../utils/toastService";
import { updateProfile, clearMessages } from "../../features/auth/authSlice";
import Navbar from "../../components/userHeader/Navbar";
import ImageCropper from "../../components/cropper/ImageCropper";
import { getCroppedImg } from "../../components/cropper/cropUtils";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();

  const { user, authChecked, error, successMessage } = useSelector(
    (state) => state.auth
  );

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [preview, setPreview] = useState(null);

  const lockRef = useRef(false);
  const toastLock = useRef(false);

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (toastLock.current) return;

    if (successMessage) {
      toastLock.current = true;
      showToast.success(successMessage);
      dispatch(clearMessages());
    }

    if (error) {
      toastLock.current = true;
      showToast.error(error);
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateImage = (file) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 2 * 1024 * 1024;
    if (!allowed.includes(file.type)) return "Invalid image type";
    if (file.size > maxSize) return "Image must be under 2MB";
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const errorMsg = validateImage(file);
    if (errorMsg) {
      showToast.error(errorMsg);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setPreview(url);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (lockRef.current) return;

    lockRef.current = true;
    setLoading(true);
    toastLock.current = false;

    try {
      if (typeof showToast.dismiss === "function") {
        showToast.dismiss();
      }

      if (!name.trim()) {
        showToast.error("Name required");
        setLoading(false);
        lockRef.current = false;
        return;
      }
      if (!email.trim() || !validateEmail(email)) {
        showToast.error("Valid email required");
        setLoading(false);
        lockRef.current = false;
        return;
      }

      if (name === user?.name && email === user?.email && !imageSrc) {
        showToast.info("No changes made!");
        setLoading(false);
        lockRef.current = false;
        return;
      }

      let blob = null;
      if (imageSrc && croppedAreaPixels) {
        blob = await getCroppedImg(imageSrc, croppedAreaPixels);
        setPreview(URL.createObjectURL(blob));
      }

      const formData = new FormData();
      if (name !== user?.name) formData.append("name", name);
      if (email !== user?.email) formData.append("email", email);
      if (blob) formData.append("profileImage", blob, "profile.jpg");

      showToast.info("Updating profile...");
      const result = await dispatch(updateProfile(formData));

      if (updateProfile.fulfilled.match(result)) {
        setEditMode(false);
        setImageSrc(null);
      }
    } catch (err) {
      showToast.error("Something went wrong");
    } finally {
      setLoading(false);
      lockRef.current = false;
    }
  };

  if (!authChecked) return <p>Loading...</p>;
  if (!user) return <p>Please login again</p>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h2>Profile</h2>
        <div className="profile-card">
          <div className="profile-image-container">
            {preview ? (
              <img src={preview} alt="profile" className="profile-image" />
            ) : user?.profileImage ? (
              <img src={user.profileImage} alt="profile" className="profile-image" />
            ) : (
              <div className="profile-placeholder">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {!editMode ? (
            <>
              <div className="profile-info">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
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

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;