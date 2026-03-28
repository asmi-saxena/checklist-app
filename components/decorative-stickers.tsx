export function DecorativeStickers() {
  return (
    <>
      {/* Floating clouds */}
      <div className="fixed top-20 left-10 w-16 h-12 opacity-60 pointer-events-none">
        <svg viewBox="0 0 100 75" className="w-full h-full">
          <path
            d="M 30 50 Q 20 35 35 20 Q 45 10 55 15 Q 65 8 70 20 Q 80 15 85 30 Q 90 40 80 55 Q 70 60 50 58 Q 40 60 30 50 Z"
            fill="white"
            opacity="0.8"
          />
        </svg>
      </div>

      <div className="fixed top-64 right-12 w-14 h-10 opacity-50 pointer-events-none">
        <svg viewBox="0 0 100 75" className="w-full h-full">
          <path
            d="M 30 50 Q 20 35 35 20 Q 45 10 55 15 Q 65 8 70 20 Q 80 15 85 30 Q 90 40 80 55 Q 70 60 50 58 Q 40 60 30 50 Z"
            fill="white"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Yellow flowers */}
      <div className="fixed bottom-96 left-5 w-12 h-12 opacity-70 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="12" fill="oklch(0.82 0.1 60)" />
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const x = 50 + 25 * Math.cos(rad)
            const y = 50 + 25 * Math.sin(rad)
            return (
              <ellipse
                key={angle}
                cx={x}
                cy={y}
                rx="10"
                ry="18"
                fill="oklch(0.82 0.1 60)"
                transform={`rotate(${angle} ${x} ${y})`}
              />
            )
          })}
        </svg>
      </div>

      {/* Pink flowers */}
      <div className="fixed bottom-80 right-8 w-10 h-10 opacity-75 pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="10" fill="oklch(0.7 0.12 50)" />
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const x = 50 + 22 * Math.cos(rad)
            const y = 50 + 22 * Math.sin(rad)
            return (
              <ellipse
                key={angle}
                cx={x}
                cy={y}
                rx="8"
                ry="16"
                fill="oklch(0.65 0.15 25)"
                transform={`rotate(${angle} ${x} ${y})`}
              />
            )
          })}
        </svg>
      </div>

      {/* Green leaf accent */}
      <div className="fixed bottom-72 left-32 w-10 h-10 opacity-60 pointer-events-none" style={{ transform: 'rotate(-30deg)' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 50 20 Q 70 40 60 80 Q 50 75 40 80 Q 30 40 50 20 Z"
            fill="oklch(0.58 0.18 140)"
            opacity="0.8"
          />
          <path d="M 50 30 Q 50 50 50 75" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" />
        </svg>
      </div>

      {/* Small pink dot stickers */}
      <div className="fixed bottom-64 right-24 w-3 h-3 rounded-full bg-pink-400 opacity-60 pointer-events-none"></div>
      <div className="fixed bottom-48 left-20 w-2.5 h-2.5 rounded-full bg-yellow-300 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-56 right-32 w-2 h-2 rounded-full bg-pink-300 opacity-50 pointer-events-none"></div>

      {/* Green curved leaf trails */}
      <div className="fixed bottom-64 left-48 w-32 h-6 opacity-50 pointer-events-none">
        <svg viewBox="0 0 200 50" className="w-full h-full" preserveAspectRatio="none">
          <path d="M 10 30 Q 50 10 100 25 T 190 20" stroke="oklch(0.58 0.18 140)" strokeWidth="8" fill="none" opacity="0.6" />
        </svg>
      </div>

      {/* Additional cute stickers - more flowers */}
      <div className="fixed top-48 right-20 w-8 h-8 opacity-65 pointer-events-none animate-bounce" style={{ animationDuration: '2.5s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="8" fill="oklch(0.75 0.15 30)" />
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const x = 50 + 18 * Math.cos(rad)
            const y = 50 + 18 * Math.sin(rad)
            return (
              <ellipse
                key={angle}
                cx={x}
                cy={y}
                rx="6"
                ry="12"
                fill="oklch(0.75 0.15 30)"
                transform={`rotate(${angle} ${x} ${y})`}
              />
            )
          })}
        </svg>
      </div>

      {/* Orange flower top left area */}
      <div className="fixed top-32 left-1/4 w-10 h-10 opacity-55 pointer-events-none animate-bounce" style={{ animationDuration: '3.5s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="11" fill="oklch(0.7 0.2 50)" />
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const x = 50 + 24 * Math.cos(rad)
            const y = 50 + 24 * Math.sin(rad)
            return (
              <ellipse
                key={angle}
                cx={x}
                cy={y}
                rx="9"
                ry="15"
                fill="oklch(0.7 0.2 50)"
                transform={`rotate(${angle} ${x} ${y})`}
              />
            )
          })}
        </svg>
      </div>

      {/* More colorful dots scattered */}
      <div className="fixed top-40 right-1/3 w-2 h-2 rounded-full bg-white opacity-70 pointer-events-none"></div>
      <div className="fixed top-96 left-1/2 w-3 h-3 rounded-full bg-pink-300 opacity-60 pointer-events-none"></div>
      <div className="fixed bottom-40 right-1/4 w-2.5 h-2.5 rounded-full bg-yellow-200 opacity-75 pointer-events-none"></div>

      {/* Additional leaf stems */}
      <div className="fixed top-1/3 right-10 w-8 h-20 opacity-45 pointer-events-none" style={{ transform: 'rotate(25deg)' }}>
        <svg viewBox="0 0 50 200" className="w-full h-full">
          <path
            d="M 25 10 Q 35 60 25 100 Q 15 140 25 190"
            stroke="oklch(0.58 0.18 140)"
            strokeWidth="4"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Mini flower cluster bottom right */}
      <div className="fixed bottom-32 right-1/3 w-9 h-9 opacity-60 pointer-events-none animate-bounce" style={{ animationDuration: '2s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="9" fill="oklch(0.65 0.15 25)" />
          {[0, 90, 180, 270].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const x = 50 + 20 * Math.cos(rad)
            const y = 50 + 20 * Math.sin(rad)
            return (
              <ellipse
                key={angle}
                cx={x}
                cy={y}
                rx="7"
                ry="13"
                fill="oklch(0.65 0.15 25)"
                transform={`rotate(${angle} ${x} ${y})`}
              />
            )
          })}
        </svg>
      </div>

      {/* Decorative line/vine on left side */}
      <div className="fixed top-1/4 left-2 w-4 h-32 opacity-40 pointer-events-none">
        <svg viewBox="0 0 50 400" className="w-full h-full">
          <path
            d="M 25 10 Q 15 80 25 150 Q 35 220 25 290"
            stroke="oklch(0.58 0.18 140)"
            strokeWidth="3"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>
    </>
  )
}
