import React, { forwardRef } from "react";

interface AtomAvatarProp {
  imgSRC?: string;
  className?: string;
  avatarRef: React.Ref<HTMLImageElement | null>;
}

export default function AtomAvatar({ imgSRC, className = "", avatarRef }: AtomAvatarProp) {
  return (
    <div className={`w-[300px] grayscale will-change-transform ${className}`}>
      <img ref={avatarRef} src={imgSRC} alt="Ruben Vermishyan avatar" />
    </div>
  );
}
