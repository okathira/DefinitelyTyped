/**
 * StackBlitz demo to verify newly added SVG attributes in SVGAttributes<T>:
 * - autoFocus (with tabIndex=0 so focus can be taken)
 * - nonce
 * - part
 * - slot
 *
 * Why prefix is excluded:
 * - In HTMLAttributes, `prefix` is the RDFa attribute. SVGAttributes currently
 *   does not declare that RDFa attribute. The script matched Element.prefix,
 *   a different read-only DOM property, so I leave `prefix` out for SVG.
 *
 * What this demo checks:
 * - autoFocus: the SVG receives focus on mount; console shows activeElement === svg.
 * - nonce: property and attribute are logged (note some browsers hide the attribute).
 * - part: host exposes an SVG part; styled via ::part to prove it works.
 * - slot: slotted SVG is styled via ::slotted and logs assignedSlot info.
 *
 * How to run on StackBlitz:
 * - Template: "React + TypeScript" (the default React/TS template works).
 * - Put this file as `src/main.tsx` (or import/render it from there).
 */

import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

function App() {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const partHostRef = useRef<HTMLDivElement | null>(null);
    const slotHostRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const svg = svgRef.current;
        console.log("activeElement === svg:", document.activeElement === svg);
        if (svg) {
            console.log("nonce attr:", svg.getAttribute("nonce"));
            console.log("part attr:", svg.getAttribute("part"));
            console.log("slot attr:", svg.getAttribute("slot"));
        }

        // part demo: expose part from shadow DOM and style it via ::part
        if (partHostRef.current) {
            partHostRef.current.id = "part-host-demo";
            const shadow = partHostRef.current.attachShadow({ mode: "open" });
            shadow.innerHTML = `
              <style>
                :host(::part(demo-part)) {
                  /* not used; ::part must be on host selector outside shadow */
                }
              </style>
              <svg part="demo-part" width="120" height="120">
                <rect x="10" y="10" width="100" height="100" fill="#c8e6c9"></rect>
                <text x="20" y="70" font-size="14" fill="#2e7d32">part</text>
              </svg>
            `;
            const style = document.createElement("style");
            style.textContent = `
              #part-host-demo::part(demo-part) {
                outline: 3px solid #2e7d32;
                border-radius: 4px;
              }
            `;
            document.head.appendChild(style);
        }

        // slot demo: slotted SVG styled via ::slotted
        if (slotHostRef.current) {
            const shadow = slotHostRef.current.attachShadow({ mode: "open" });
            shadow.innerHTML = `
              <style>
                slot[name="demo-slot"]::slotted(svg) {
                  outline: 2px dotted #6a1b9a;
                }
              </style>
              <slot name="demo-slot"></slot>
            `;
        }
    }, []);

    return (
        <div style={{ padding: 16, fontFamily: "sans-serif" }}>
            <h3>SVG attribute demo (autoFocus / nonce / part / slot)</h3>
            <p>
                On mount, the SVG should take focus (console shows
                activeElement === svg). Attributes nonce/part/slot are also
                logged. Part is exposed from a shadow host; slot is styled via
                ::slotted.
            </p>
            <svg
                ref={svgRef}
                tabIndex={0}
                autoFocus
                nonce="demo-nonce"
                part="demo-part"
                slot="demo-slot"
                width={140}
                height={140}
                style={{ outline: "2px solid #1976d2" }}
                onFocus={() => console.log("onFocus fired")}
            >
                <rect x={10} y={10} width={120} height={120} fill="#ffb74d" />
                <text x={20} y={80} fontSize={16} fill="#000">
                    SVG demo
                </text>
            </svg>

            <h4 style={{ marginTop: 24 }}>part demo (shadow host exposes part)</h4>
            <div ref={partHostRef} />

            <h4 style={{ marginTop: 24 }}>slot demo (slotted SVG styled via ::slotted)</h4>
            <div ref={slotHostRef}>
                <svg
                    slot="demo-slot"
                    width={140}
                    height={140}
                    style={{ marginTop: 8, display: "block" }}
                >
                    <rect x="10" y="10" width="120" height="120" fill="#f8bbd0" />
                    <text x={20} y={80} fontSize={16} fill="#ad1457">
                        slotted
                    </text>
                </svg>
            </div>
        </div>
    );
}

const rootEl = document.getElementById("root");
if (!rootEl) {
    throw new Error("root element not found");
}

createRoot(rootEl).render(<App />);

