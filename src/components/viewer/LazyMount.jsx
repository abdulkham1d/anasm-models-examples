// src/components/viewer/LazyMount.jsx
import React from "react";
import PropTypes from "prop-types";

export default function LazyMount({ children, rootMargin = "200px" }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      style={{ height: "100%", width: "100%" }}
    >
      {visible ? children : null}
    </div>
  );
}

LazyMount.propTypes = {
  children: PropTypes.node,
  rootMargin: PropTypes.string,
};
