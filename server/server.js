const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { port, clientUrl } = require("./config/env");
const connectDB = require("./config/db");

connectDB();

const app = express();
const PORT = port || 5000;

app.use(helmet());
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later." },
});

app.use("/api/weather", apiLimiter);
app.use("/api/auth", authLimiter);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));

app.get("/", (_req, res) => {
  const { version } = require("./package.json");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WeatherNow API</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      min-height:100vh;display:flex;align-items:center;justify-content:center;
      font-family:'Segoe UI',system-ui,-apple-system,sans-serif;
      background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%);
      color:#e2e8f0;overflow:hidden;position:relative;
    }
    body::before{
      content:'';position:absolute;top:-60px;right:-60px;
      width:220px;height:220px;border-radius:50%;
      background:radial-gradient(circle,#fbbf24 0%,#f59e0b 40%,transparent 70%);
      opacity:.25;filter:blur(2px);
    }
    body::after{
      content:'';position:absolute;bottom:20%;left:8%;
      width:180px;height:60px;border-radius:50px;
      background:rgba(255,255,255,.07);
      box-shadow:60px -30px 0 30px rgba(255,255,255,.05),
                 130px -10px 0 20px rgba(255,255,255,.04);
      filter:blur(1px);
    }
    .rain{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden}
    .drop{position:absolute;width:1px;background:linear-gradient(to bottom,transparent,rgba(148,197,248,.4));animation:fall linear infinite;opacity:.5}
    @keyframes fall{0%{transform:translateY(-100vh)}100%{transform:translateY(100vh)}}
    .container{
      text-align:center;z-index:1;padding:3rem 2rem;
      background:rgba(15,23,42,.55);backdrop-filter:blur(16px);
      border:1px solid rgba(148,197,248,.15);border-radius:24px;
      box-shadow:0 25px 60px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.05);
      max-width:480px;width:90%;
    }
    h1{
      font-size:2.4rem;font-weight:800;letter-spacing:-.02em;
      background:linear-gradient(135deg,#60a5fa,#38bdf8,#a5f3fc);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      background-clip:text;
      text-shadow:none;margin-bottom:.5rem;
    }
    .version{
      display:inline-block;font-size:.85rem;font-weight:600;
      color:#94a3b8;background:rgba(148,197,248,.1);
      padding:4px 14px;border-radius:20px;margin-bottom:2rem;
      border:1px solid rgba(148,197,248,.15);
    }
    .weather-icon{font-size:3rem;margin-bottom:1.2rem;display:block}
    .links{display:flex;flex-direction:column;gap:.75rem;margin-bottom:2rem}
    .btn-primary,.btn-secondary{
      display:inline-block;padding:12px 28px;border-radius:14px;
      text-decoration:none;font-weight:600;font-size:.95rem;
      transition:all .3s cubic-bezier(.4,0,.2,1);
    }
    .btn-primary{
      background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;
      box-shadow:0 4px 15px rgba(37,99,235,.35);
    }
    .btn-primary:hover{
      transform:translateY(-2px);
      box-shadow:0 8px 25px rgba(37,99,235,.5);
      background:linear-gradient(135deg,#1d4ed8,#2563eb);
    }
    .btn-secondary{
      background:rgba(148,197,248,.08);color:#93c5fd;
      border:1px solid rgba(148,197,248,.2);
    }
    .btn-secondary:hover{
      background:rgba(148,197,248,.15);transform:translateY(-2px);
      box-shadow:0 4px 12px rgba(59,130,246,.15);
    }
    .sign{
      font-size:.8rem;color:#64748b;padding-top:1.5rem;
      border-top:1px solid rgba(148,197,248,.1);
    }
    .sign a{color:#60a5fa;text-decoration:none;transition:color .2s}
    .sign a:hover{color:#93c5fd;text-decoration:underline}
    @media(max-width:480px){
      .container{padding:2rem 1.5rem}
      h1{font-size:1.8rem}
      .links{gap:.6rem}
    }
  </style>
</head>
<body>
  <div class="rain">
    <div class="drop" style="left:10%;height:18px;animation-duration:1.2s;animation-delay:.1s"></div>
    <div class="drop" style="left:20%;height:22px;animation-duration:1.5s;animation-delay:.4s"></div>
    <div class="drop" style="left:35%;height:16px;animation-duration:1.1s;animation-delay:.2s"></div>
    <div class="drop" style="left:50%;height:20px;animation-duration:1.4s;animation-delay:.6s"></div>
    <div class="drop" style="left:65%;height:24px;animation-duration:1.6s;animation-delay:.3s"></div>
    <div class="drop" style="left:75%;height:14px;animation-duration:1s;animation-delay:.5s"></div>
    <div class="drop" style="left:88%;height:19px;animation-duration:1.3s;animation-delay:.7s"></div>
  </div>
  <div class="container">
    <span class="weather-icon">⛅</span>
    <h1>WeatherNow API</h1>
    <p class="version">v${version}</p>
    <div class="links">
      <a href="/api/health" class="btn-primary">Health Check</a>
      <a href="https://weather-mern.netlify.app" class="btn-secondary" target="_blank" rel="noopener noreferrer">Open App</a>
    </div>
    <footer class="sign">
      Created by
      <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
      |
      <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
    </footer>
  </div>
</body>
</html>`);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
