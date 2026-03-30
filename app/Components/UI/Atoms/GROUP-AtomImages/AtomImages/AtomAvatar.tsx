import React from "react";

import Image from "next/image";

interface AtomAvatarProp {
  imgSRC?: string;
  avatarRef: React.Ref<HTMLImageElement>;
}

export default function AtomAvatar({ imgSRC = "", avatarRef }: AtomAvatarProp) {
  return <Image ref={avatarRef} src={imgSRC} width={300} height={400} alt="Ruben Vermishyan avatar" />;
}
