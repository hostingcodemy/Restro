import React, { useEffect, useRef } from "react";

const CustomerForm = () => {

const svgRef = useRef(null);

  const users = [
    { id: "center", top: "50%", left: "50%", bg: "yellow" },
    { id: "topLeft", top: "10%", left: "15%", bg: "aquamarine" },
    { id: "bottomLeft", bottom: "10%", left: "15%", bg: "yellow" },
    { id: "topRight", top: "10%", right: "15%", bg: "aquamarine" },
    { id: "bottomRight", bottom: "10%", right: "15%", bg: "yellow" },
  ];

  const drawLines = () => {
    const svg = svgRef.current;
    const center = document.getElementById("center");
    const centerRect = center.getBoundingClientRect();
    const centerX = centerRect.left + centerRect.width / 2;
    const centerY = centerRect.top + centerRect.height / 2;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    svg.innerHTML = "";

    users.forEach((user) => {
      if (user.id === "center") return;
      const el = document.getElementById(user.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", centerX + scrollX);
        line.setAttribute("y1", centerY + scrollY);
        line.setAttribute("x2", x + scrollX);
        line.setAttribute("y2", y + scrollY);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-dasharray", "5,5");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
      }
    });
  };

  useEffect(() => {
    drawLines();
    window.addEventListener("resize", drawLines);
    return () => window.removeEventListener("resize", drawLines);
  }, []);

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  };

  const childStyleBase = {
    position: "absolute",
    width: "100px",
    height: "140px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    clipPath: "url(#mangoShape)",
    WebkitClipPath: "url(#mangoShape)",
    border: "1px solid #ccc",
    zIndex: 1,
  };

  const imgStyle = {
    width: "60%",
    height: "60%",
    objectFit: "cover",
    borderRadius: "50%",
  };

    return (

        <>
            <div style={containerStyle}>
                <svg
                    ref={svgRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 0,
                    }}
                ></svg>

                {/* SVG mango shape clipPath */}
                <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
                    <defs>
                        <clipPath id="mangoShape" clipPathUnits="objectBoundingBox">
                            <path d="M0.5,0.05 C0.8,0.1 0.95,0.4 0.9,0.7 C0.85,0.9 0.65,1.05 0.45,0.95 C0.25,0.85 0.05,0.55 0.1,0.25 C0.15,0.1 0.3,0 0.5,0.05 Z" />
                        </clipPath>
                    </defs>
                </svg>

                {/* Users */}
                {users.map((user, idx) => (
                    <div
                        key={user.id}
                        id={user.id}
                        style={{
                            ...childStyleBase,
                            backgroundColor: user.bg,
                            ...(user.top && { top: user.top }),
                            ...(user.bottom && { bottom: user.bottom }),
                            ...(user.left && { left: user.left }),
                            ...(user.right && { right: user.right }),
                            ...(user.id === "center" ? { transform: "translate(-50%, -50%)" } : {}),
                        }}
                    >
                        <img src="user.png" alt={`User ${idx}`} style={imgStyle} />
                    </div>
                ))}
            </div>
        </>
    )
}

export default CustomerForm