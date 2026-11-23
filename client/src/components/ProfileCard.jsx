import React, { useEffect, useRef, useState } from "react";
import "./ProfileCard.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function ProfileCard({
  avatarUrl = "",
  iconUrl = "",
  miniAvatarUrl = "",
  name = "Profile Name",
  title = "Title",
  handle = "",
  status = "",
  contactText = "",
  showUserInfo = true,
  theme = "dark",
  backdropColor = "",
  radius = 20,
  holo = 0.35,
  glare = 0.3,
  enableTilt = true,
  tiltStrength = 8,
  parallax = 5,
  enableMobileTilt = false,
  intro = true,
  onContactClick,
}) {
  const cardRef = useRef(null);
  const [isIntroDone, setIsIntroDone] = useState(!intro);

  useEffect(() => {
    if (!intro) {
      setIsIntroDone(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsIntroDone(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [intro]);

  useEffect(() => {
    const card = cardRef.current;

    if (!card || !enableTilt) return;

    const handlePointerMove = (event) => {
      if (
        event.pointerType === "touch" &&
        !enableMobileTilt
      ) {
        return;
      }

      const rect = card.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * tiltStrength * 2;
      const rotateX = (0.5 - y) * tiltStrength * 2;

      const glareX = x * 100;
      const glareY = y * 100;

      card.style.setProperty(
        "--rotate-x",
        `${clamp(rotateX, -tiltStrength, tiltStrength)}deg`
      );

      card.style.setProperty(
        "--rotate-y",
        `${clamp(rotateY, -tiltStrength, tiltStrength)}deg`
      );

      card.style.setProperty("--glare-x", `${glareX}%`);
      card.style.setProperty("--glare-y", `${glareY}%`);

      card.style.setProperty(
        "--parallax-x",
        `${(x - 0.5) * parallax}px`
      );

      card.style.setProperty(
        "--parallax-y",
        `${(y - 0.5) * parallax}px`
      );
    };

    const handlePointerLeave = () => {
      card.style.setProperty("--rotate-x", "0deg");
      card.style.setProperty("--rotate-y", "0deg");
      card.style.setProperty("--glare-x", "50%");
      card.style.setProperty("--glare-y", "50%");
      card.style.setProperty("--parallax-x", "0px");
      card.style.setProperty("--parallax-y", "0px");
    };

    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      card.removeEventListener("pointermove", handlePointerMove);
      card.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [enableTilt, enableMobileTilt, tiltStrength, parallax]);

  const handleContact = () => {
    if (onContactClick) {
      onContactClick();
    }
  };

  return (
    <div
      className={`profile-card-wrapper ${
        isIntroDone ? "profile-card-visible" : "profile-card-intro"
      }`}
    >
      <div
        ref={cardRef}
        className={`profile-card profile-card-${theme}`}
        style={{
          borderRadius: `${radius}px`,
          "--backdrop-color": backdropColor || "transparent",
          "--holo-opacity": holo,
          "--glare-opacity": glare,
        }}
      >
        <div className="profile-card-inner">
          <div className="profile-card-avatar-area">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="profile-card-avatar"
              />
            ) : (
              <div className="profile-card-avatar-placeholder">
                {name?.charAt(0)?.toUpperCase()}
              </div>
            )}

            {iconUrl && (
              <img
                src={iconUrl}
                alt=""
                className="profile-card-icon"
              />
            )}
          </div>

          <div className="profile-card-overlay" />

          <div className="profile-card-holo" />

          <div className="profile-card-content">
            <div className="profile-card-top">
              <div className="profile-card-mini">
                {miniAvatarUrl ? (
                  <img
                    src={miniAvatarUrl}
                    alt=""
                    className="profile-card-mini-avatar"
                  />
                ) : (
                  <div className="profile-card-mini-avatar-placeholder">
                    {name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>

              {status && (
                <span className="profile-card-status">
                  <span className="profile-card-status-dot" />
                  {status}
                </span>
              )}
            </div>

            <div
              className="profile-card-text"
              style={{
                transform: `translate3d(
                  var(--parallax-x),
                  var(--parallax-y),
                  0
                )`,
              }}
            >
              <h3 className="profile-card-name">{name}</h3>

              {title && (
                <p className="profile-card-title">{title}</p>
              )}

              {handle && (
                <p className="profile-card-handle">@{handle}</p>
              )}

              {showUserInfo && contactText && (
                <button
                  type="button"
                  className="profile-card-contact"
                  onClick={handleContact}
                >
                  {contactText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}