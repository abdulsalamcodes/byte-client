import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Byte Lab - Coding Practice Studio';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '70px 80px',
        background: '#f4f0e8',
        color: '#1b1a18',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid #d7d0c4',
          paddingBottom: 24,
          fontSize: 22,
          letterSpacing: '0.16em',
        }}
      >
        <span style={{ fontWeight: 900 }}>BYTE / LAB</span>
        <span style={{ color: '#716d65' }}>CODING PRACTICE STUDIO</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <span style={{ color: '#b64627', fontSize: 20, letterSpacing: '0.12em' }}>
          BUILD A BETTER BRIEF
        </span>
        <h1
          style={{
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: '-0.06em',
            lineHeight: 0.95,
            margin: 0,
            maxWidth: 900,
          }}
        >
          Make the next question count.
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#716d65' }}>
        <span>Custom coding quizzes, without the noise.</span>
        <span style={{ color: '#b64627' }}>01 / 02</span>
      </div>
    </div>,
    { ...size }
  );
}
