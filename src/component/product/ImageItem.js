import React from "react";

export default function ImageItem({ item, setSelectedImage, selectedImage }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "200px",
        height: "200px",
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
        marginLeft: "10px",
        marginRight: "10px",
      }}
      onClick={() => setSelectedImage(item.id)}
    >
      <img
        src={item.img}
        alt="avatar"
        style={{
          width: "200px",
          height: "200px",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          left: 0,
          top: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 100,
          width: "100%",
          height: "100%",
          opacity: selectedImage === item.id ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        {/* thay cái này bằng icon V gì đó */}
        <div style={{ color: "white" }}>V</div>
      </div>
    </div>
  );
}
