import React from "react";

export default function NotificationReadIcon({ read }) {
  return (
    <div
      style={{
        marginLeft: 12,
        alignSelf: "center",
        position: "relative",
        marginTop: 8,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          dislpay: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div>
          {read ? (
            <div
              style={{
                width: 12,
                height: 12,
              }}
            />
          ) : (
            <div
              style={{
                justifyContent: "center",
                width: 20,
                height: 48,
                position: "relative",
                paddingLeft: 4,
                alignItems: "center",
                display: "flex",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: 12,
                  height: 12,
                  "border-top-left-radius": "50%",
                  "border-bottom-left-radius": "50%",
                  "border-top-right-radius": "50%",
                  "border-bottom-right-radius": "50%",
                  backgroundColor: "hsl(214, 89%, 52%)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
