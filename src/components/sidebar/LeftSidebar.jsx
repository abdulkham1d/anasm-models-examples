import React, { useMemo, useState, useCallback, memo } from "react";
import { FaSitemap, FaBone, FaVideo, FaSearch, FaTimes } from "react-icons/fa"; // Material + FontAwesome
import { MdFolder, MdAddBox } from "react-icons/md"; // More icons
import { FaRegFolderOpen } from "react-icons/fa";


const OrganRow = memo(function OrganRow({ organ, active, onPick }) {
  return (
    <button
      onClick={() => onPick(organ.id)}
      style={{
        display: "flex",
        width: "100%",
        border: 0,
        background: active
          ? "rgba(59,130,246,0.15)"
          : "transparent",
        boxShadow: active
          ? "inset 0 0 0 1px rgba(59,130,246,0.4)"
          : "none",
        textAlign: "left",
        cursor: "pointer",
        padding: "10px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        color: "#e2e8f0",
      }}
    >
      {/* thumb */}
      <div
        style={{
          width: "48px",
          height: "48px",
          minWidth: "48px",
          maxWidth: "48px",
          minHeight: "48px",
          maxHeight: "48px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#1e293b",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "10px",
          fontSize: "10px",
          color: "#64748b",
          flexShrink: 0,
        }}
      >
        {organ.thumb ? (
          <img
            src={organ.thumb}
            alt={organ.title || "thumb"}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          "no img"
        )}
      </div>

      {/* info */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontWeight: 500,
            color: "#fff",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            fontSize: "12px",
            lineHeight: 1.3,
          }}
        >
          {organ.title || "Untitled"}
        </div>

        <div
          style={{
            marginTop: "2px",
            fontSize: "10px",
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
            lineHeight: 1.3,
          }}
        >
          <span>{organ.type || ""}</span>
          {organ.hasParts && (
            <span
              style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.4)",
                color: "rgb(16,185,129)",
                padding: "2px 4px",
                borderRadius: "4px",
                lineHeight: 1.2,
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              parts
            </span>
          )}
        </div>
      </div>
    </button>
  );
});

export default function LeftSidebar({
  open,
  setOpen,
  organs,
  currentId,
  onPick,
}) {
  const [q, setQ] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState({}); // To track collapsed groups

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return organs;
    return organs.filter((o) =>
      (o.title || "").toLowerCase().includes(needle)
    );
  }, [organs, q]);

  // Group models dynamically based on the group property
  const groupedOrgans = useMemo(() => {
    return organs.reduce((acc, organ) => {
      // If the group doesn't exist, create it
      if (!acc[organ.group]) {
        acc[organ.group] = [];
      }
      // Add the model to its respective group
      acc[organ.group].push(organ);
      return acc;
    }, {});
  }, [organs]);

  const handlePick = useCallback(
    (id) => {
      onPick(id);
    },
    [onPick]
  );

  const toggleGroup = useCallback(
    (groupName) => {
      setCollapsedGroups((prev) => ({
        ...prev,
        [groupName]: !prev[groupName],
      }));
    },
    []
  );

  // COLLAPSED HOLAT (yopilganda)
  if (!open) {
    return (
      <aside
        className="leftPane"
        style={{
          width: "48px",
          minWidth: "48px",
          maxWidth: "48px",
          height: "100%",
          background: "#0f172a",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          padding: "8px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setOpen(true)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "14px",
            lineHeight: 1.2,
            padding: "6px 8px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </aside>
    );
  }

  // FULL HOLAT (ochiq)
  return (
    <aside
      className="leftPane"
      style={{
        width: "260px",
        minWidth: "260px",
        maxWidth: "260px",
        height: "100%",
        background: "#0f172a",
        color: "#fff",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", /* O'ZI scroll qilmasin */
      }}
    >
      {/* header */}
      <div
        style={{
          flexShrink: 0,
          padding: "12px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          lineHeight: 1.2,
        }}
      >
        <button
          onClick={() => setOpen(false)}
          style={{
            appearance: "none",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.07)",
            color: "#fff",
            borderRadius: "6px",
            fontSize: "12px",
            lineHeight: 1,
            padding: "4px 6px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: "#fff" }}>
            Anatomiya kutubxonasi
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              marginTop: "2px",
              whiteSpace: "nowrap",
            }}
          >
            {organs.length} modellar mavjud
          </div>
        </div>
      </div>

      {/* search */}
      <div
        style={{
          flexShrink: 0,
          padding: "10px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          style={{
            width: "100%",
            fontSize: "13px",
            lineHeight: 1.3,
            padding: "8px 10px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(15,23,42,0.6)",
            color: "#fff",
            outline: "none",
          }}
        />
      </div>

      {/* scrollable list */}
      <div
        style={{
          flex: 1,
          minHeight: 0,            /* <<< flex child ichida overflow ishlashi uchun shart */
          overflowY: "auto",       /* <<< scroll faqat shu DIV ichida */
          WebkitOverflowScrolling: "touch",
          fontSize: "12px",
          lineHeight: 1.3,
        }}
      >
        {Object.entries(groupedOrgans).map(([group, models]) => (
          <div key={group}>
            <div
              style={{
                padding: "12px",
                background: "#1e293b",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "bold",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={() => toggleGroup(group)}
            >
              <div>
              <span style={{ marginRight: "8px" }}>
                {/* {collapsedGroups[group] ? <MdFolder /> : <FaRegFolderOpen />} */}
              </span>
              {group} - <span style={{textTransform: "none"}}>{models.length} ta modellar</span>
              </div>
            <span >
            {collapsedGroups[group] ? <MdFolder /> : <FaRegFolderOpen />}
            </span>
            </div>
            {!collapsedGroups[group] && models.map((o) => (
            <OrganRow
                key={o.id}
                organ={o}
                active={currentId === o.id}
                onPick={handlePick}
              /> 
            ))}
            <div style={{ height: "1px", background: "rgb(255, 255, 255)", margin: "3px" }} />
          </div>
        ))}
      </div>
    </aside>
  );
}
