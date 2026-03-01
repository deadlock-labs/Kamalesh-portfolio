'use client';

import { useEffect, useRef } from 'react';

const DEVOPS_WORDS = [
  'kubectl', 'docker', 'terraform', 'ansible', 'jenkins', 'prometheus',
  'grafana', 'kubernetes', 'helm', 'argocd', 'nginx', 'aws', 'gcp',
  'ci/cd', 'pipeline', 'deploy', 'build', 'container', 'pod', 'node',
  'cluster', 'yaml', 'git push', 'merge', 'rollback', 'canary',
  'blue-green', 'istio', 'envoy', 'vault', 'consul', 'etcd',
  'fluentd', 'kibana', 'datadog', 'dynatrace', 'openshift', 'tekton',
  'linux', 'bash', 'python', 'go', 'redis', 'postgres', 'mongodb',
  'rabbitmq', 'kafka', 'grpc', 'rest', 'api', 'microservice',
];

const PIPELINE_COMMANDS = [
  '$ docker build -t app:latest .',
  '$ kubectl apply -f deploy.yaml',
  '$ terraform plan',
  '$ helm upgrade --install',
  '$ ansible-playbook site.yml',
  '$ git push origin main',
  '$ npm run build && npm test',
  '$ docker-compose up -d',
  '$ kubectl get pods -n prod',
  '$ terraform apply -auto-approve',
  '$ prometheus --config.file=prom.yml',
  '$ grafana-server --config=grafana.ini',
  '$ argocd app sync my-app',
  '$ tekton pipeline start build',
  '$ curl -s http://healthcheck/api',
  '$ openssl req -new -x509',
  '$ systemctl restart nginx',
  '$ journalctl -u kubelet -f',
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface FloatingWord {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  opacity: number;
  fontSize: number;
}

interface PipelineLine {
  y: number;
  text: string;
  x: number;
  speed: number;
  opacity: number;
}

export default function DevOpsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const wordsRef = useRef<FloatingWord[]>([]);
  const pipelinesRef = useRef<PipelineLine[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const initRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 5; // Cover full scroll
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };
    window.addEventListener('mousemove', handleMouse);

    // Initialize particles
    if (!initRef.current) {
      initRef.current = true;
      const colors = ['#06b6d4', '#8b5cf6', '#22d3ee', '#a78bfa', '#0ea5e9'];

      for (let i = 0; i < 80; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.15 + 0.03,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      // Floating DevOps words
      for (let i = 0; i < 30; i++) {
        wordsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          text: DEVOPS_WORDS[Math.floor(Math.random() * DEVOPS_WORDS.length)],
          opacity: Math.random() * 0.06 + 0.02,
          fontSize: Math.random() * 10 + 10,
        });
      }

      // Pipeline command lines scrolling across
      for (let i = 0; i < 12; i++) {
        pipelinesRef.current.push({
          y: Math.random() * canvas.height,
          text: PIPELINE_COMMANDS[Math.floor(Math.random() * PIPELINE_COMMANDS.length)],
          x: -Math.random() * canvas.width * 2,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.06 + 0.02,
        });
      }
    }

    const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const gridSize = 60;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.015)';
      ctx.lineWidth = 0.5;

      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    };

    const drawPipelineNodes = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
      const nodeSpacing = 200;
      const rows = Math.ceil(h / 400);

      for (let row = 0; row < rows; row++) {
        const baseY = row * 400 + 200;
        const nodeCount = Math.floor(w / nodeSpacing);
        const offset = Math.sin(time * 0.0005 + row) * 20;

        for (let i = 0; i < nodeCount; i++) {
          const x = i * nodeSpacing + nodeSpacing / 2;
          const y = baseY + offset + Math.sin(time * 0.001 + i) * 10;

          // Draw connection lines
          if (i < nodeCount - 1) {
            const nx = (i + 1) * nodeSpacing + nodeSpacing / 2;
            const ny = baseY + offset + Math.sin(time * 0.001 + i + 1) * 10;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.03 + Math.sin(time * 0.002 + i) * 0.015})`;
            ctx.lineWidth = 1;
            ctx.moveTo(x, y);

            // Curved pipeline connections
            const cpx = (x + nx) / 2;
            const cpy = y + (Math.random() > 0.5 ? 20 : -20);
            ctx.quadraticCurveTo(cpx, cpy, nx, ny);
            ctx.stroke();

            // Animated data flow dot
            const t = ((time * 0.001 + i * 0.5) % 1);
            const dotX = x + (nx - x) * t;
            const dotY = y + (ny - y) * t + Math.sin(t * Math.PI) * (cpy - y) * 2 * t * (1 - t);
            ctx.beginPath();
            ctx.fillStyle = `rgba(6, 182, 212, ${0.12 + Math.sin(time * 0.003) * 0.06})`;
            ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Pipeline node circles
          const nodeOpacity = 0.04 + Math.sin(time * 0.002 + i * 0.7) * 0.02;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139, 92, 246, ${nodeOpacity})`;
          ctx.lineWidth = 1;
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.stroke();

          // Inner glow
          ctx.beginPath();
          ctx.fillStyle = `rgba(6, 182, 212, ${nodeOpacity * 0.5})`;
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const animate = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Grid
      drawGrid(ctx, w, h);

      // Pipeline nodes & connections
      drawPipelineNodes(ctx, w, h, time);

      // Particles
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`).replace('rgb', 'rgba');
        const hexToRgba = (hex: string, a: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r},${g},${b},${a})`;
        };
        ctx.fillStyle = hexToRgba(p.color, p.opacity);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connect nearby particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.02 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Floating DevOps words (watermarks)
      for (const word of wordsRef.current) {
        word.x += word.vx;
        word.y += word.vy;

        if (word.x < -100) word.x = w + 50;
        if (word.x > w + 100) word.x = -50;
        if (word.y < -50) word.y = h + 30;
        if (word.y > h + 50) word.y = -30;

        ctx.font = `${word.fontSize}px 'JetBrains Mono', 'SF Mono', monospace`;
        ctx.fillStyle = `rgba(139, 92, 246, ${word.opacity})`;
        ctx.fillText(word.text, word.x, word.y);
      }

      // Pipeline command lines scrolling
      for (const line of pipelinesRef.current) {
        line.x += line.speed;

        if (line.x > w + 500) {
          line.x = -500;
          line.text = PIPELINE_COMMANDS[Math.floor(Math.random() * PIPELINE_COMMANDS.length)];
          line.y = Math.random() * h;
        }

        ctx.font = '11px "JetBrains Mono", "SF Mono", monospace';
        ctx.fillStyle = `rgba(6, 182, 212, ${line.opacity})`;
        ctx.fillText(line.text, line.x, line.y);
      }

      // Hex grid overlay (honeycomb pattern) at intervals
      const hexSize = 40;
      const hexRows = Math.ceil(h / (hexSize * 1.5));
      const hexCols = Math.ceil(w / (hexSize * Math.sqrt(3)));
      for (let row = 0; row < hexRows; row++) {
        for (let col = 0; col < hexCols; col++) {
          if (Math.random() > 0.003) continue; // Very sparse
          const cx = col * hexSize * Math.sqrt(3) + (row % 2 ? hexSize * Math.sqrt(3) / 2 : 0);
          const cy = row * hexSize * 1.5;
          const pulseOpacity = 0.02 + Math.sin(time * 0.001 + row + col) * 0.01;

          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const angle = (Math.PI / 3) * k - Math.PI / 6;
            const hx = cx + hexSize * 0.4 * Math.cos(angle);
            const hy = cy + hexSize * 0.4 * Math.sin(angle);
            if (k === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(6, 182, 212, ${pulseOpacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.7 }}
      />
      {/* CSS-based animated elements that layer on top */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#06b6d4]/[0.03] rounded-full blur-[150px] animate-float" />
        <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-[#8b5cf6]/[0.03] rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[60%] left-[15%] w-[350px] h-[350px] bg-[#06b6d4]/[0.02] rounded-full blur-[100px] animate-float" style={{ animationDelay: '6s' }} />
        <div className="absolute top-[80%] right-[20%] w-[450px] h-[450px] bg-[#8b5cf6]/[0.02] rounded-full blur-[130px] animate-float" style={{ animationDelay: '9s' }} />

        {/* Scanning line effect */}
        <div className="devops-scan-line" />
      </div>
    </div>
  );
}
