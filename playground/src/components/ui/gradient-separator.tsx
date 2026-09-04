type GradientSeparatorProps = {
  height?: number
  width?: string
  className?: string
  speed?: string
  color?: string
  backgroundImageCss?: string
}

export default function GradientSeparator({
  height = 4,
  width = "100%",
  className = "",
  speed = "5s",
  color = "#a6cf98",
  backgroundImageCss,
}: GradientSeparatorProps = {}) {
  return (
    <div
      className={`radial-gradient-separator z-10 ${className}`}
      style={{
        height: `${height}px`,
        width: width,
      }}
    >
      <style>{`
        .radial-gradient-separator {
          background-image: ${backgroundImageCss || `radial-gradient(circle, ${color} 15%, white 95%)`};
          background-size: 400% 100%;
          animation: gradientMove ${speed} linear infinite;
        }

        @keyframes gradientMove {
          0% {
            background-position: 400% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}
