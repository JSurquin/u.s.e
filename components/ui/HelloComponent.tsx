// app/components/HelloComponent.tsx

"use client";

import * as animationData from "./Hello.json";
import { useLottie } from "lottie-react";

const HelloComponent = () => {
  const defaultOptions = {
    animationData: animationData,
    loop: true,
  };

  const { View } = useLottie(defaultOptions);

  return (
    <>
      <div className="">
        <div className="w-full">{View}</div>
      </div>
    </>
  );
};

export default HelloComponent;
