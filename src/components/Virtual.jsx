import { useEffect, useRef, useState } from "react";

const Virtual = ({ children, ...props }) => {
  const [isView, setIsView] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsView(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.0 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} {...props}>
      {isView ? children : null}
    </div>
  );
};

export default Virtual;
