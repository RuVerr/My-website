import React from "react";

interface AtomAvatarProp {
  imgSRC?: string;
  avatarRef: React.Ref<HTMLImageElement | null>;
}

export default function AtomAvatar({ imgSRC, avatarRef }: AtomAvatarProp) {
  return <img ref={avatarRef} src={imgSRC} alt="Ruben Vermishyan avatar" />;
}
