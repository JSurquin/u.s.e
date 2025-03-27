import dynamic from "next/dynamic";

// Importer HelloComponent de façon dynamique avec SSR désactivé
const DynamicHelloComponent = dynamic(() => import("./HelloComponent"), {
  ssr: false,
});

export default DynamicHelloComponent;
