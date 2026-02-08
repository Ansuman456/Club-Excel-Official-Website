import React, { useEffect, useRef } from 'react';

const Vortex = ({
    backgroundColor = '#000000',
    rangeY = 100,
    particleCount = 500,
    baseHue = 160, // Emerald Green
    baseSpeed = 0.5,
    rangeSpeed = 1.5,
    baseRadius = 1,
    rangeRadius = 2,
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const hueRange = 30;
    const spawnRadius = 100;

    let canvas, ctx, particleProps, width, height, centerX, centerY;

    const rand = (n) => Math.random() * n;
    const fadeInOut = (t, m) => {
        let hm = 0.5 * m;
        return Math.abs(((t + hm) % m) - hm) / hm;
    };

    const setup = () => {
        canvas = canvasRef.current;
        ctx = canvas.getContext('2d');
        resize();
        initParticles();
        draw();
    };

    const initParticles = () => {
        particleProps = new Float32Array(particlePropsLength);
        for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            initParticle(i);
        }
    };

    const initParticle = (i) => {
        let x, y, vx, vy, life, ttl, speed, radius, hue;

        x = rand(width);
        y = rand(height);
        vx = 0;
        vy = 0;
        life = 0;
        ttl = baseSpeed + rand(rangeSpeed) * 100;
        speed = baseSpeed + rand(rangeSpeed);
        radius = baseRadius + rand(rangeRadius);
        hue = baseHue + rand(hueRange);

        particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
    };

    const drawParticle = (x, y, x2, y2, life, ttl, radius, hue) => {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineWidth = radius;
        ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };

    const updateParticle = (i) => {
        let x, y, vx, vy, life, ttl, speed, radius, hue;

        x = particleProps[i];
        y = particleProps[i + 1];
        vx = particleProps[i + 2];
        vy = particleProps[i + 3];
        life = particleProps[i + 4];
        ttl = particleProps[i + 5];
        speed = particleProps[i + 6];
        radius = particleProps[i + 7];
        hue = particleProps[i + 8];

        let x2 = x + vx * speed;
        let y2 = y + vy * speed;
        let lifeRatio = life / ttl;

        drawParticle(x, y, x2, y2, life, ttl, radius, hue);

        life++;

        // Flow logic
        let noiseScale = 0.0015;
        let angle = (Math.atan2(centerY - y, centerX - x) + (Math.PI / 2)) + (life * 0.01);
        vx = Math.cos(angle);
        vy = Math.sin(angle);

        particleProps[i] = x2;
        particleProps[i + 1] = y2;
        particleProps[i + 2] = vx;
        particleProps[i + 3] = vy;
        particleProps[i + 4] = life;

        if (life > ttl || x2 > width || x2 < 0 || y2 > height || y2 < 0) {
            initParticle(i);
        }
    };

    const resize = () => {
        const { offsetWidth, offsetHeight } = containerRef.current;
        width = canvas.width = offsetWidth;
        height = canvas.height = offsetHeight;
        centerX = 0.5 * width;
        centerY = 0.5 * height;
    };

    const draw = () => {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            updateParticle(i);
        }

        ctx.save();
        ctx.filter = 'blur(8px) brightness(200%)';
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();

        ctx.save();
        ctx.filter = 'blur(4px) brightness(150%)';
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();

        requestAnimationFrame(draw);
    };

    useEffect(() => {
        setup();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Vortex;
