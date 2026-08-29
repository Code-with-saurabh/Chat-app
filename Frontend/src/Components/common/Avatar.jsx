import React, { useState } from "react";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const colors = [
  "#E17076", "#7BC862", "#E5CA77", "#65AADD",
  "#A695E7", "#EE7AE9", "#6EC9CB", "#FAA774",
];

const getColor = (name) => {
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Avatar = ({ src, alt, size = 40, style = {}, className = "" }) => {
  const [imgError, setImgError] = useState(false);
  const name = alt || "";
  const shouldShow = !src || imgError;
  const initials = getInitials(name);
  const bgColor = getColor(name);

  if (shouldShow) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 600,
          fontSize: size * 0.4,
          flexShrink: 0,
          userSelect: "none",
          ...style,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      onError={() => setImgError(true)}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, ...style }}
      loading="lazy"
    />
  );
};

export default Avatar;
