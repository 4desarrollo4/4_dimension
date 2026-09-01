import React from 'react';

const faceTransforms = (size) => [
    `rotateY(0deg) translateZ(${size / 2}px)`,
    `rotateY(90deg) translateZ(${size / 2}px)`,
    `rotateY(180deg) translateZ(${size / 2}px)`,
    `rotateY(270deg) translateZ(${size / 2}px)`,
    `rotateX(90deg) translateZ(${size / 2}px)`,
    `rotateX(-90deg) translateZ(${size / 2}px)`,
];

function Cube({ size, spinClass, faceStyle }) {
    return (
        <div className={`cube ${spinClass}`} style={{ width: size, height: size }}>
            {faceTransforms(size).map((t, i) => (
                <div key={i} className="absolute inset-0" style={{ transform: t, ...faceStyle }} />
            ))}
        </div>
    );
}

export default function Tesseract() {
    return (
        <div className="cube-scene relative flex h-[320px] items-center justify-center sm:h-[420px]" aria-hidden="true">
            <div
                className="absolute h-72 w-72 rounded-full opacity-40 blur-3xl"
                style={{ background: 'radial-gradient(circle, hsl(224 100% 62% / 0.35), transparent 70%)' }}
            />
            <div className="cube" style={{ width: 240, height: 240, transformStyle: 'preserve-3d' }}>
                <Cube
                    size={240}
                    spinClass="cube-spin-a"
                    faceStyle={{
                        border: '1px solid hsl(224 100% 70% / 0.4)',
                        background: 'linear-gradient(135deg, hsl(224 100% 62% / 0.07), hsl(220 16% 96% / 0.02))',
                    }}
                />
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transformStyle: 'preserve-3d', transform: 'translateZ(0)' }}
                >
                    <Cube
                        size={120}
                        spinClass="cube-spin-b"
                        faceStyle={{
                            border: '1px solid hsl(220 20% 85% / 0.55)',
                            background: 'linear-gradient(135deg, hsl(220 20% 85% / 0.10), hsl(224 100% 62% / 0.10))',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
