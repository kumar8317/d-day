// vite.config.ts
import react from "file:///home/ankit/ak/2024/d-day/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import fs from "fs";
import { defineConfig } from "file:///home/ankit/ak/2024/d-day/node_modules/vite/dist/node/index.js";
import { crx } from "file:///home/ankit/ak/2024/d-day/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "D-Day",
  description: "A counter for creating countdown events and syncs with google calendar events",
  background: {
    service_worker: "src/pages/background/index.ts",
    type: "module"
  },
  action: {
    default_popup: "src/pages/popup/index.html"
  },
  permissions: [
    "storage",
    "identity",
    "notifications",
    "gcm"
  ],
  oauth2: {
    client_id: "867471131289-7c10u1t66qj0tjleu55tv3arng5rl18i.apps.googleusercontent.com",
    scopes: [
      "https://www.googleapis.com/auth/calendar"
    ]
  },
  host_permissions: ["https://515b-2405-201-601f-60bc-d3bc-69b5-6113-5cbf.ngrok-free.app/register"],
  web_accessible_resources: [
    {
      resources: [
        "contentStyle.css",
        "icon-128.png",
        "icon-32.png"
      ],
      matches: []
    }
  ]
};

// manifest.dev.json
var manifest_dev_default = {
  web_accessible_resources: [
    {
      resources: [
        "contentStyle.css",
        "dev-icon-128.png",
        "dev-icon-32.png"
      ],
      matches: []
    }
  ]
};

// package.json
var package_default = {
  name: "d-day",
  version: "0.0.1",
  description: "A chrome extension counter for creating countdown events and syncs with google calendar events",
  license: "MIT",
  scripts: {
    build: "vite build",
    dev: "nodemon"
  },
  type: "module",
  dependencies: {
    "@types/gapi.calendar": "^3.0.11",
    googleapis: "^134.0.0",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    rrule: "^2.8.1",
    "webextension-polyfill": "^0.10.0"
  },
  devDependencies: {
    "@crxjs/vite-plugin": "^1.0.14",
    "@types/chrome": "^0.0.253",
    "@types/node": "^18.17.1",
    "@types/react": "^18.2.39",
    "@types/react-dom": "^18.2.17",
    "@types/webextension-polyfill": "^0.10.0",
    "@typescript-eslint/eslint-plugin": "^5.49.0",
    "@typescript-eslint/parser": "^5.49.0",
    "@vitejs/plugin-react-swc": "^3.0.1",
    autoprefixer: "^10.4.16",
    eslint: "^8.32.0",
    "eslint-config-prettier": "^8.6.0",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-react": "^7.32.1",
    "eslint-plugin-react-hooks": "^4.3.0",
    "fs-extra": "^11.1.0",
    nodemon: "^2.0.20",
    postcss: "^8.4.31",
    tailwindcss: "^3.3.5",
    "ts-node": "^10.9.1",
    typescript: "^4.9.4",
    vite: "^4.5.0"
  }
};

// vite.config.ts
var __vite_injected_original_dirname = "/home/ankit/ak/2024/d-day";
var root = resolve(__vite_injected_original_dirname, "src");
var pagesDir = resolve(root, "pages");
var assetsDir = resolve(root, "assets");
var outDir = resolve(__vite_injected_original_dirname, "dist");
var publicDir = resolve(__vite_injected_original_dirname, "public");
var isDev = process.env.__DEV__ === "true";
var extensionManifest = {
  ...manifest_default,
  ...isDev ? manifest_dev_default : {},
  name: manifest_default.name,
  version: package_default.version
};
function stripDevIcons(apply) {
  if (apply)
    return null;
  return {
    name: "strip-dev-icons",
    resolveId(source) {
      return source === "virtual-module" ? source : null;
    },
    renderStart(outputOptions, inputOptions) {
      const outDir2 = outputOptions.dir;
      fs.rm(resolve(outDir2, "dev-icon-32.png"), () => console.log(`Deleted dev-icon-32.png frm prod build`));
      fs.rm(resolve(outDir2, "dev-icon-128.png"), () => console.log(`Deleted dev-icon-128.png frm prod build`));
    }
  };
}
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir
    }
  },
  plugins: [
    react(),
    crx({
      manifest: extensionManifest,
      contentScripts: {
        injectCss: true
      }
    }),
    stripDevIcons(isDev)
  ],
  publicDir,
  build: {
    outDir,
    sourcemap: isDev,
    emptyOutDir: !isDev
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiIsICJtYW5pZmVzdC5kZXYuanNvbiIsICJwYWNrYWdlLmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hbmtpdC9hay8yMDI0L2QtZGF5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hbmtpdC9hay8yMDI0L2QtZGF5L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Fua2l0L2FrLzIwMjQvZC1kYXkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGNyeCwgTWFuaWZlc3RWM0V4cG9ydCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbic7XG5cbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL21hbmlmZXN0Lmpzb24nO1xuaW1wb3J0IGRldk1hbmlmZXN0IGZyb20gJy4vbWFuaWZlc3QuZGV2Lmpzb24nO1xuaW1wb3J0IHBrZyBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5cbmNvbnN0IHJvb3QgPSByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpO1xuY29uc3QgcGFnZXNEaXIgPSByZXNvbHZlKHJvb3QsICdwYWdlcycpO1xuY29uc3QgYXNzZXRzRGlyID0gcmVzb2x2ZShyb290LCAnYXNzZXRzJyk7XG5jb25zdCBvdXREaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnKTtcbmNvbnN0IHB1YmxpY0RpciA9IHJlc29sdmUoX19kaXJuYW1lLCAncHVibGljJyk7XG5cbmNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5lbnYuX19ERVZfXyA9PT0gJ3RydWUnO1xuXG5jb25zdCBleHRlbnNpb25NYW5pZmVzdCA9IHtcbiAgLi4ubWFuaWZlc3QsXG4gIC4uLihpc0RldiA/IGRldk1hbmlmZXN0IDoge30gYXMgTWFuaWZlc3RWM0V4cG9ydCksXG4gIG5hbWU6IG1hbmlmZXN0Lm5hbWUsXG4gIHZlcnNpb246IHBrZy52ZXJzaW9uLFxufTtcblxuLy8gcGx1Z2luIHRvIHJlbW92ZSBkZXYgaWNvbnMgZnJvbSBwcm9kIGJ1aWxkXG5mdW5jdGlvbiBzdHJpcERldkljb25zIChhcHBseTogYm9vbGVhbikge1xuICBpZiAoYXBwbHkpIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnc3RyaXAtZGV2LWljb25zJyxcbiAgICByZXNvbHZlSWQgKHNvdXJjZTogc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc291cmNlID09PSAndmlydHVhbC1tb2R1bGUnID8gc291cmNlIDogbnVsbFxuICAgIH0sXG4gICAgcmVuZGVyU3RhcnQgKG91dHB1dE9wdGlvbnM6IGFueSwgaW5wdXRPcHRpb25zOiBhbnkpIHtcbiAgICAgIGNvbnN0IG91dERpciA9IG91dHB1dE9wdGlvbnMuZGlyXG4gICAgICBmcy5ybShyZXNvbHZlKG91dERpciwgJ2Rldi1pY29uLTMyLnBuZycpLCAoKSA9PiBjb25zb2xlLmxvZyhgRGVsZXRlZCBkZXYtaWNvbi0zMi5wbmcgZnJtIHByb2QgYnVpbGRgKSlcbiAgICAgIGZzLnJtKHJlc29sdmUob3V0RGlyLCAnZGV2LWljb24tMTI4LnBuZycpLCAoKSA9PiBjb25zb2xlLmxvZyhgRGVsZXRlZCBkZXYtaWNvbi0xMjgucG5nIGZybSBwcm9kIGJ1aWxkYCkpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0BzcmMnOiByb290LFxuICAgICAgJ0Bhc3NldHMnOiBhc3NldHNEaXIsXG4gICAgICAnQHBhZ2VzJzogcGFnZXNEaXIsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgY3J4KHtcbiAgICAgIG1hbmlmZXN0OiBleHRlbnNpb25NYW5pZmVzdCBhcyBNYW5pZmVzdFYzRXhwb3J0LFxuICAgICAgY29udGVudFNjcmlwdHM6IHtcbiAgICAgICAgaW5qZWN0Q3NzOiB0cnVlLFxuICAgICAgfVxuICAgIH0pLFxuICAgIHN0cmlwRGV2SWNvbnMoaXNEZXYpXG4gIF0sXG4gIHB1YmxpY0RpcixcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXIsXG4gICAgc291cmNlbWFwOiBpc0RldixcbiAgICBlbXB0eU91dERpcjogIWlzRGV2XG4gIH0sXG59KTtcbiIsICJ7XG4gIFwibWFuaWZlc3RfdmVyc2lvblwiOiAzLFxuICBcIm5hbWVcIjogXCJELURheVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSBjb3VudGVyIGZvciBjcmVhdGluZyBjb3VudGRvd24gZXZlbnRzIGFuZCBzeW5jcyB3aXRoIGdvb2dsZSBjYWxlbmRhciBldmVudHNcIixcbiAgXCJiYWNrZ3JvdW5kXCI6IHtcbiAgICBcInNlcnZpY2Vfd29ya2VyXCI6IFwic3JjL3BhZ2VzL2JhY2tncm91bmQvaW5kZXgudHNcIixcbiAgICBcInR5cGVcIjogXCJtb2R1bGVcIlxuICB9LFxuICBcImFjdGlvblwiOiB7XG4gICAgXCJkZWZhdWx0X3BvcHVwXCI6IFwic3JjL3BhZ2VzL3BvcHVwL2luZGV4Lmh0bWxcIlxuICB9LFxuICBcInBlcm1pc3Npb25zXCI6IFtcbiAgICBcInN0b3JhZ2VcIixcbiAgICBcImlkZW50aXR5XCIsXG4gICAgXCJub3RpZmljYXRpb25zXCIsXG4gICAgXCJnY21cIlxuICBdLFxuICBcIm9hdXRoMlwiOiB7XG4gICAgXCJjbGllbnRfaWRcIjogXCI4Njc0NzExMzEyODktN2MxMHUxdDY2cWowdGpsZXU1NXR2M2Fybmc1cmwxOGkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb21cIixcbiAgICBcInNjb3Blc1wiOiBbXG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvY2FsZW5kYXJcIlxuICAgIF1cbiAgfSAsXG4gIFwiaG9zdF9wZXJtaXNzaW9uc1wiOltcImh0dHBzOi8vNTE1Yi0yNDA1LTIwMS02MDFmLTYwYmMtZDNiYy02OWI1LTYxMTMtNWNiZi5uZ3Jvay1mcmVlLmFwcC9yZWdpc3RlclwiXSxcbiAgXCJ3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXNcIjogW1xuICAgIHtcbiAgICAgIFwicmVzb3VyY2VzXCI6IFtcbiAgICAgICAgXCJjb250ZW50U3R5bGUuY3NzXCIsXG4gICAgICAgIFwiaWNvbi0xMjgucG5nXCIsXG4gICAgICAgIFwiaWNvbi0zMi5wbmdcIlxuICAgICAgXSxcbiAgICAgIFwibWF0Y2hlc1wiOiBbXVxuICAgIH1cbiAgXVxufVxuIiwgIntcbiAgXCJ3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXNcIjogW1xuICAgIHtcbiAgICAgIFwicmVzb3VyY2VzXCI6IFtcbiAgICAgICAgXCJjb250ZW50U3R5bGUuY3NzXCIsXG4gICAgICAgIFwiZGV2LWljb24tMTI4LnBuZ1wiLFxuICAgICAgICBcImRldi1pY29uLTMyLnBuZ1wiXG4gICAgICBdLFxuICAgICAgXCJtYXRjaGVzXCI6IFtdXG4gICAgfVxuICBdXG59XG4iLCAie1xuICBcIm5hbWVcIjogXCJkLWRheVwiLFxuICBcInZlcnNpb25cIjogXCIwLjAuMVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSBjaHJvbWUgZXh0ZW5zaW9uIGNvdW50ZXIgZm9yIGNyZWF0aW5nIGNvdW50ZG93biBldmVudHMgYW5kIHN5bmNzIHdpdGggZ29vZ2xlIGNhbGVuZGFyIGV2ZW50c1wiLFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwidml0ZSBidWlsZFwiLFxuICAgIFwiZGV2XCI6IFwibm9kZW1vblwiXG4gIH0sXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAdHlwZXMvZ2FwaS5jYWxlbmRhclwiOiBcIl4zLjAuMTFcIixcbiAgICBcImdvb2dsZWFwaXNcIjogXCJeMTM0LjAuMFwiLFxuICAgIFwicmVhY3RcIjogXCJeMTguMi4wXCIsXG4gICAgXCJyZWFjdC1kb21cIjogXCJeMTguMi4wXCIsXG4gICAgXCJycnVsZVwiOiBcIl4yLjguMVwiLFxuICAgIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI6IFwiXjAuMTAuMFwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBjcnhqcy92aXRlLXBsdWdpblwiOiBcIl4xLjAuMTRcIixcbiAgICBcIkB0eXBlcy9jaHJvbWVcIjogXCJeMC4wLjI1M1wiLFxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJeMTguMTcuMVwiLFxuICAgIFwiQHR5cGVzL3JlYWN0XCI6IFwiXjE4LjIuMzlcIixcbiAgICBcIkB0eXBlcy9yZWFjdC1kb21cIjogXCJeMTguMi4xN1wiLFxuICAgIFwiQHR5cGVzL3dlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiOiBcIl4wLjEwLjBcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjUuNDkuMFwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl41LjQ5LjBcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiOiBcIl4zLjAuMVwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTZcIixcbiAgICBcImVzbGludFwiOiBcIl44LjMyLjBcIixcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOC42LjBcIixcbiAgICBcImVzbGludC1wbHVnaW4taW1wb3J0XCI6IFwiXjIuMjcuNVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1qc3gtYTExeVwiOiBcIl42LjcuMVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdFwiOiBcIl43LjMyLjFcIixcbiAgICBcImVzbGludC1wbHVnaW4tcmVhY3QtaG9va3NcIjogXCJeNC4zLjBcIixcbiAgICBcImZzLWV4dHJhXCI6IFwiXjExLjEuMFwiLFxuICAgIFwibm9kZW1vblwiOiBcIl4yLjAuMjBcIixcbiAgICBcInBvc3Rjc3NcIjogXCJeOC40LjMxXCIsXG4gICAgXCJ0YWlsd2luZGNzc1wiOiBcIl4zLjMuNVwiLFxuICAgIFwidHMtbm9kZVwiOiBcIl4xMC45LjFcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNC45LjRcIixcbiAgICBcInZpdGVcIjogXCJeNC41LjBcIlxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZQLE9BQU8sV0FBVztBQUMvUSxTQUFTLGVBQWU7QUFDeEIsT0FBTyxRQUFRO0FBQ2YsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxXQUE2Qjs7O0FDSnRDO0FBQUEsRUFDRSxrQkFBb0I7QUFBQSxFQUNwQixNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixZQUFjO0FBQUEsSUFDWixnQkFBa0I7QUFBQSxJQUNsQixNQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsUUFBVTtBQUFBLElBQ1IsZUFBaUI7QUFBQSxFQUNuQjtBQUFBLEVBQ0EsYUFBZTtBQUFBLElBQ2I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFVO0FBQUEsSUFDUixXQUFhO0FBQUEsSUFDYixRQUFVO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxrQkFBbUIsQ0FBQyw2RUFBNkU7QUFBQSxFQUNqRywwQkFBNEI7QUFBQSxJQUMxQjtBQUFBLE1BQ0UsV0FBYTtBQUFBLFFBQ1g7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVcsQ0FBQztBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBQ0Y7OztBQ2xDQTtBQUFBLEVBQ0UsMEJBQTRCO0FBQUEsSUFDMUI7QUFBQSxNQUNFLFdBQWE7QUFBQSxRQUNYO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFXLENBQUM7QUFBQSxJQUNkO0FBQUEsRUFDRjtBQUNGOzs7QUNYQTtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsU0FBVztBQUFBLEVBQ1gsU0FBVztBQUFBLElBQ1QsT0FBUztBQUFBLElBQ1QsS0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLE1BQVE7QUFBQSxFQUNSLGNBQWdCO0FBQUEsSUFDZCx3QkFBd0I7QUFBQSxJQUN4QixZQUFjO0FBQUEsSUFDZCxPQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixPQUFTO0FBQUEsSUFDVCx5QkFBeUI7QUFBQSxFQUMzQjtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakIsc0JBQXNCO0FBQUEsSUFDdEIsaUJBQWlCO0FBQUEsSUFDakIsZUFBZTtBQUFBLElBQ2YsZ0JBQWdCO0FBQUEsSUFDaEIsb0JBQW9CO0FBQUEsSUFDcEIsZ0NBQWdDO0FBQUEsSUFDaEMsb0NBQW9DO0FBQUEsSUFDcEMsNkJBQTZCO0FBQUEsSUFDN0IsNEJBQTRCO0FBQUEsSUFDNUIsY0FBZ0I7QUFBQSxJQUNoQixRQUFVO0FBQUEsSUFDViwwQkFBMEI7QUFBQSxJQUMxQix3QkFBd0I7QUFBQSxJQUN4QiwwQkFBMEI7QUFBQSxJQUMxQix1QkFBdUI7QUFBQSxJQUN2Qiw2QkFBNkI7QUFBQSxJQUM3QixZQUFZO0FBQUEsSUFDWixTQUFXO0FBQUEsSUFDWCxTQUFXO0FBQUEsSUFDWCxhQUFlO0FBQUEsSUFDZixXQUFXO0FBQUEsSUFDWCxZQUFjO0FBQUEsSUFDZCxNQUFRO0FBQUEsRUFDVjtBQUNGOzs7QUgzQ0EsSUFBTSxtQ0FBbUM7QUFVekMsSUFBTSxPQUFPLFFBQVEsa0NBQVcsS0FBSztBQUNyQyxJQUFNLFdBQVcsUUFBUSxNQUFNLE9BQU87QUFDdEMsSUFBTSxZQUFZLFFBQVEsTUFBTSxRQUFRO0FBQ3hDLElBQU0sU0FBUyxRQUFRLGtDQUFXLE1BQU07QUFDeEMsSUFBTSxZQUFZLFFBQVEsa0NBQVcsUUFBUTtBQUU3QyxJQUFNLFFBQVEsUUFBUSxJQUFJLFlBQVk7QUFFdEMsSUFBTSxvQkFBb0I7QUFBQSxFQUN4QixHQUFHO0FBQUEsRUFDSCxHQUFJLFFBQVEsdUJBQWMsQ0FBQztBQUFBLEVBQzNCLE1BQU0saUJBQVM7QUFBQSxFQUNmLFNBQVMsZ0JBQUk7QUFDZjtBQUdBLFNBQVMsY0FBZSxPQUFnQjtBQUN0QyxNQUFJO0FBQU8sV0FBTztBQUVsQixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixVQUFXLFFBQWdCO0FBQ3pCLGFBQU8sV0FBVyxtQkFBbUIsU0FBUztBQUFBLElBQ2hEO0FBQUEsSUFDQSxZQUFhLGVBQW9CLGNBQW1CO0FBQ2xELFlBQU1BLFVBQVMsY0FBYztBQUM3QixTQUFHLEdBQUcsUUFBUUEsU0FBUSxpQkFBaUIsR0FBRyxNQUFNLFFBQVEsSUFBSSx3Q0FBd0MsQ0FBQztBQUNyRyxTQUFHLEdBQUcsUUFBUUEsU0FBUSxrQkFBa0IsR0FBRyxNQUFNLFFBQVEsSUFBSSx5Q0FBeUMsQ0FBQztBQUFBLElBQ3pHO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsVUFBVTtBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixVQUFVO0FBQUEsTUFDVixnQkFBZ0I7QUFBQSxRQUNkLFdBQVc7QUFBQSxNQUNiO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxjQUFjLEtBQUs7QUFBQSxFQUNyQjtBQUFBLEVBQ0E7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMO0FBQUEsSUFDQSxXQUFXO0FBQUEsSUFDWCxhQUFhLENBQUM7QUFBQSxFQUNoQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbIm91dERpciJdCn0K
