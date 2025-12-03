import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Byte Quiz - AI-Powered Quiz Generator';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #4c1d95, #7c3aed)',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 50,
            padding: '10px 30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: 12, color: '#ddd6fe' }}
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: '#ddd6fe',
              letterSpacing: '0.05em',
            }}
          >
            AI POWERED
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 100,
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.1,
              background: 'linear-gradient(to right, #fff, #ddd6fe)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
            }}
          >
            Byte Quiz
          </h1>
          <p
            style={{
              fontSize: 40,
              margin: 0,
              color: '#e9d5ff',
              maxWidth: 800,
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Generate intelligent coding quizzes instantly with AI
          </p>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#fff',
              opacity: 0.5,
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#fff',
              opacity: 0.5,
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#fff',
              opacity: 0.5,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
