import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Layers, Sparkles } from "lucide-react";

const defaultMissionProtocols = [
  {
    id: "payload-bio",
    title: "Bio Extraction",
    subtitle: "Payload Rack A-1",
    description:
      "Automated human activity recognition for aseptic specimen transfer in microgravity.",
    image:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80",
    specs: [
      { label: "Steps", value: "8 Steps" },
      { label: "Latency", value: "12 ms" },
      { label: "Safety", value: "Level 1" },
      { label: "FPS", value: "30 fps" },
    ],
  },
  {
    id: "payload-fluidics",
    title: "Capillary Fluidics",
    subtitle: "Payload Rack B-2",
    description:
      "Multi-camera hand and pipette tracking to monitor zero-g meniscus alignment.",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
    specs: [
      { label: "Steps", value: "6 Steps" },
      { label: "Latency", value: "9 ms" },
      { label: "Safety", value: "Level 2" },
      { label: "Accuracy", value: "99.4%" },
    ],
  },
  {
    id: "payload-centrifuge",
    title: "Centrifuge Run",
    subtitle: "Payload Rack C-3",
    description:
      "Detects unlatched rotor covers and validates counterbalance insertion sequence.",
    image:
      "https://images.unsplash.com/photo-1517976487502-570a256df2e7?w=800&auto=format&fit=crop&q=80",
    specs: [
      { label: "Steps", value: "5 Steps" },
      { label: "Latency", value: "14 ms" },
      { label: "Safety", value: "Critical" },
      { label: "Assurance", value: "Zero Fail" },
    ],
  },
  {
    id: "payload-crystals",
    title: "Crystal Synthesis",
    subtitle: "Payload Rack D-4",
    description:
      "Thermal incubator lock verification and timed reagent valve injection sequence.",
    image:
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=80",
    specs: [
      { label: "Steps", value: "10 Steps" },
      { label: "Latency", value: "11 ms" },
      { label: "Safety", value: "Level 2" },
      { label: "Model", value: "Edge-YOLO" },
    ],
  },
];

const CARD_WIDTH = 320;
const CARD_OVERLAP = 240;

const Card = ({
  product,
  index,
  totalCards,
  isExpanded,
  reducedMotion,
}) => {
  const centerOffset = (totalCards - 1) * 5;
  const defaultX = index * 10 - centerOffset;
  const defaultY = index * 2;
  const defaultRotate = index * 1.5;

  const totalExpandedWidth =
    CARD_WIDTH + (totalCards - 1) * (CARD_WIDTH - CARD_OVERLAP);
  const expandedCenterOffset = totalExpandedWidth / 2;

  const spreadX =
    index * (CARD_WIDTH - CARD_OVERLAP) - expandedCenterOffset + CARD_WIDTH / 2;
  const spreadRotate = index * 5 - (totalCards - 1) * 2.5;

  const collapsedPose = {
    x: defaultX,
    y: defaultY,
    rotate: reducedMotion ? 0 : defaultRotate,
    scale: 1,
  };

  const expandedPose = {
    x: spreadX,
    y: 0,
    rotate: reducedMotion ? 0 : spreadRotate,
    scale: 1,
  };

  return (
    <motion.div
      animate={{
        ...(isExpanded ? expandedPose : collapsedPose),
        zIndex: totalCards - index,
      }}
      className={cn(
        "absolute inset-0 w-full rounded-2xl p-6",
        "bg-zinc-900/85 text-white",
        "border border-white/10 dark:border-neutral-800/80",
        "backdrop-blur-xl backdrop-saturate-150",
        "shadow-[0_8px_20px_rgb(0,0,0,0.4)]",
        "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
        "transition-[border-color,box-shadow] duration-300 ease-out",
        "transform-gpu overflow-hidden text-left"
      )}
      initial={collapsedPose}
      style={{
        maxWidth: `${CARD_WIDTH}px`,
        left: "50%",
        marginLeft: `-${CARD_WIDTH / 2}px`,
      }}
      transition={
        reducedMotion
          ? { duration: 0.2, ease: "easeOut" }
          : {
              type: "spring",
              stiffness: 220,
              damping: 28,
              mass: 1,
              delay: isExpanded ? index * 0.04 : 0,
            }
      }
    >
      <div className="relative z-10">
        <dl className="mb-4 grid grid-cols-4 justify-center gap-2">
          {product.specs.map((spec) => (
            <div
              className="flex flex-col items-start text-left text-[10px]"
              key={spec.label}
            >
              <dd className="w-full text-left font-bold text-cyan-400">
                {spec.value}
              </dd>
              <dt className="mb-0.5 w-full text-left text-zinc-400">
                {spec.label}
              </dt>
            </div>
          ))}
        </dl>

        <div
          className={cn(
            "relative aspect-[16/11] w-full overflow-hidden rounded-lg",
            "bg-black border border-white/10 shadow-inner"
          )}
        >
          <img
            alt={product.description}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            src={product.image}
            loading="lazy"
          />
        </div>

        <div className="mt-4">
          <div className="space-y-1">
            <span className="block text-left font-bold text-2xl text-white tracking-tight">
              {product.title}
            </span>
            <span className="block text-left font-semibold text-sm text-cyan-400 tracking-tight">
              {product.subtitle}
            </span>
          </div>
          <p className="mt-2 text-left text-zinc-400 text-xs leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function CardStack({
  items = defaultMissionProtocols,
  className,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  const handleToggle = () => setIsExpanded((prev) => !prev);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
        <Layers className="w-4 h-4" />
        <span>Click stack to {isExpanded ? "collapse" : "expand payload protocols"}</span>
      </div>

      <button
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse card stack" : "Expand card stack"}
        className={cn(
          "relative mx-auto cursor-pointer",
          "min-h-[440px] w-full max-w-[90vw]",
          "md:max-w-[1200px]",
          "appearance-none border-0 bg-transparent p-0",
          "mb-8 flex items-center justify-center focus:outline-none",
          className
        )}
        onClick={handleToggle}
        type="button"
      >
        {items.map((product, index) => (
          <Card
            index={index}
            isExpanded={isExpanded}
            key={product.id}
            product={product}
            reducedMotion={reducedMotion}
            totalCards={items.length}
          />
        ))}
      </button>
    </div>
  );
}
