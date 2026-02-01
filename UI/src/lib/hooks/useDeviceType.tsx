import { useEffect, useState } from "react";

type DeviceType = {
  isMobile: boolean;
  isDesktop: boolean;
};

const useDeviceType = (breakpoint: number = 700): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    if (typeof window === "undefined") {
      return { isMobile: true, isDesktop: false };
    }
    return {
      isMobile: window.innerWidth < breakpoint,
      isDesktop: window.innerWidth >= breakpoint,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType({
        isMobile: window.innerWidth < breakpoint,
        isDesktop: window.innerWidth >= breakpoint,
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return deviceType;
};

export default useDeviceType;
