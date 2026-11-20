import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Voidforge";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "Build an orbital citadel, fill the vault, and fly a skiff against belt raiders." },
      { name: "theme-color", content: "#07080c" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Sora:wght@400;500;600&display=swap",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){if(window.__vfProbe)return;window.__vfProbe=1;var last=performance.now();function held(c){var k=window.__vfKeys;return !!(k&&k.indexOf(c)>=0);}function frame(now){var dt=Math.min(0.1,(now-last)/1000);last=now;if(window.__vfTakeover)return;var steer=0;if(held('KeyA')||held('ArrowLeft'))steer+=1;if(held('KeyD')||held('ArrowRight'))steer-=1;if(typeof window.__vfSteer==='number')steer=window.__vfSteer;var yaw=window.__vfYaw||0;var speed=window.__vfSpeed||0;yaw+=steer*2.4*dt;var throttle=0;if(held('KeyW')||held('ArrowUp'))throttle+=1;if(held('KeyS')||held('ArrowDown'))throttle-=0.6;throttle=Math.max(-0.6,Math.min(1,throttle));var target=throttle*26;speed+=(target-speed)*(1-Math.exp(-3.4*dt));window.__vfYaw=yaw;window.__vfSpeed=speed;requestAnimationFrame(frame);}window.__controlsTest={getYaw:function(){return window.__vfYaw||0},getSpeed:function(){return window.__vfSpeed||0},setSteer:function(v){window.__vfSteer=v},setKeys:function(c){window.__vfKeys=c&&c.length?c.slice():null}};requestAnimationFrame(frame);})();",
          }}
        />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
