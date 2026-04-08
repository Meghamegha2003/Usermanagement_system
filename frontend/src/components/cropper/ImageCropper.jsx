import React from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";

const ImageCropper = ({
  imageSrc,
  crop,
  zoom,
  setCrop,
  setZoom,
  setCroppedAreaPixels
}) => {
  return (
    <>
      <div className="crop-container">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(croppedArea, croppedAreaPixels) => {
            setCroppedAreaPixels(croppedAreaPixels);
          }}
        />
      </div>

      <Slider
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        onChange={(e, value) => setZoom(value)}
      />
    </>
  );
};

export default ImageCropper;