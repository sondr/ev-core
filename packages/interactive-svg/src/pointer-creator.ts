// pointCreator.ts
import {
  Marker, MarkerId, CoordSpace, ScaleMode,
  CircleMarker, SquareMarker, TriangleMarker, RectMarker, PolygonMarker,
  // If you have IconMarker in your interfaces, uncomment:
  // IconMarker
} from "./interfaces";

type IdFactory = () => MarkerId;

// Default id generator (customize by using makePointCreator(...))
const defaultId: IdFactory = () => `mk_${Math.random().toString(36).slice(2, 10)}`;

// Common optional fields you may pass to any init
type CommonInit<D = unknown> = {
  id?: MarkerId;
  coordSpace?: CoordSpace;  // default "pct"
  scaleMode?: ScaleMode;    // default "world"
  className?: string;
  ariaLabel?: string;
  data?: D;
};

// Shape-specific init types (no `shape`; that’s implied by the factory)
export type CircleInit   = CommonInit & Pick<CircleMarker, "x" | "y" | "r">;
export type SquareInit   = CommonInit & Pick<SquareMarker, "x" | "y" | "size">;
export type TriangleInit = CommonInit & Pick<TriangleMarker, "x" | "y" | "size"> & { orientation?: number };
export type RectInit     = CommonInit & Pick<RectMarker, "x" | "y" | "width" | "height"> & { anchor?: RectMarker["anchor"] };
export type PolygonInit  = CommonInit & Pick<PolygonMarker, "points">;
// If you support icons:
// export type IconInit     = CommonInit & Pick<IconMarker, "x" | "y" | "size" | "symbolId">;

export function makePointCreator(idFactory: IdFactory = defaultId) {
  // Merge common defaults once
  const base = (o: CommonInit) => ({
    id: o.id ?? idFactory(),
    coordSpace: (o.coordSpace ?? "pct") as CoordSpace,
    scaleMode: (o.scaleMode ?? "world") as ScaleMode,
    className: o.className,
    ariaLabel: o.ariaLabel,
  });

  const api = {
    circle(o: CircleInit): CircleMarker {
      return Object.freeze({
        shape: "circle",
        ...base(o),
        x: o.x, y: o.y, r: o.r,
      });
    },

    square(o: SquareInit): SquareMarker {
      return Object.freeze({
        shape: "square",
        ...base(o),
        x: o.x, y: o.y, size: o.size,
      });
    },

    triangle(o: TriangleInit): TriangleMarker {
      return Object.freeze({
        shape: "triangle",
        ...base(o),
        x: o.x, y: o.y, size: o.size,
        orientation: o.orientation ?? 0,
      });
    },

    rect(o: RectInit): RectMarker {
      return Object.freeze({
        shape: "rect",
        ...base(o),
        x: o.x, y: o.y, width: o.width, height: o.height,
        anchor: o.anchor ?? "center",
      });
    },

    polygon(o: PolygonInit): PolygonMarker {
      return Object.freeze({
        shape: "polygon",
        ...base(o),
        points: o.points,
      });
    },

    // If you support icons, uncomment:
    // icon(o: IconInit): IconMarker {
    //   return Object.freeze({
    //     shape: "icon",
    //     ...base(o),
    //     x: o.x, y: o.y, size: o.size, symbolId: o.symbolId,
    //   });
    // },

    // One unified creator (overloads give correct return types)
    create(init: (
      ({ shape: "circle" }   & CircleInit)   |
      ({ shape: "square" }   & SquareInit)   |
      ({ shape: "triangle" } & TriangleInit) |
      ({ shape: "rect" }     & RectInit)     |
      ({ shape: "polygon" }  & PolygonInit)
      // | ({ shape: "icon" } & IconInit)
    )): Marker {
      switch (init.shape) {
        case "circle":   return api.circle(init);
        case "square":   return api.square(init);
        case "triangle": return api.triangle(init);
        case "rect":     return api.rect(init);
        case "polygon":  return api.polygon(init);
        // case "icon":     return api.icon(init);
      }
    },
  } as const;

  return api;
}

// Handy default instance
export const PointCreator = makePointCreator();