"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import {
  ArrowRight,
  CheckCircle,
  Menu,
  ShoppingBag,
  Shield,
  Smartphone,
  ChevronRight,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Inter } from "next/font/google";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { autoTable, UserOptions, ThemeType } from "jspdf-autotable";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import DynamicHelloComponent from "@/components/ui/DynamicHelloComponent";

const inter = Inter({ subsets: ["latin"] });

// Ajouter ce style au début du composant, juste après les imports
const hideScrollbarStyle = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  @media print {
    header, footer, .no-print {
      display: none !important;
    }
    
    body {
      background: white !important;
      color: black !important;
    }

    .container {
      max-width: none !important;
      padding: 0 !important;
    }

    .grid {
      display: block !important;
    }

    .card {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 1rem;
      border: 1px solid #ddd !important;
      box-shadow: none !important;
    }

    .bg-gradient-to-r, .bg-gradient-to-b, .bg-gradient-to-br {
      background: none !important;
    }

    .text-transparent {
      color: black !important;
    }

    .bg-clip-text {
      -webkit-background-clip: unset !important;
      background-clip: unset !important;
    }

    .dark\\:bg-\\[\\#1d1d1f\\], .dark\\:bg-\\[\\#2c2c2e\\] {
      background: white !important;
    }

    .dark\\:text-\\[\\#86868b\\] {
      color: #666 !important;
    }

    .dark\\:border-\\[\\#3a3a3c\\] {
      border-color: #ddd !important;
    }
  }
`;

interface Product {
  title: string;
  description: string;
  us: string;
  eu: string;
  note: string;
}

interface Suggestion extends Product {
  key: string;
}

interface AutoTableUserOptions {
  startY: number;
  head: string[][];
  body: string[][];
  theme: string;
  headStyles: {
    fillColor: number[];
    textColor: number;
    fontSize: number;
    fontStyle: string;
  };
  styles: {
    fontSize: number;
    cellPadding: number;
  };
  columnStyles: {
    [key: number]: {
      cellWidth: number;
    };
  };
  didDrawPage: (data: any) => void;
}

export default function Home() {
  const router = useRouter();
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("food");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const { products, loading, error } = useProducts(language);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fonction pour générer les suggestions
  const generateSuggestions = (query: string): Suggestion[] => {
    if (!query.trim() || !products) return [];

    const result: Suggestion[] = [];

    try {
      // Traitement de chaque catégorie
      Object.entries(products).forEach(([category, categoryData]) => {
        Object.entries(categoryData).forEach(([subcategory, items]) => {
          // Conversion sécurisée en utilisant les propriétés appropriées
          const item = items as unknown as Record<string, any>;

          if (
            item &&
            typeof item === "object" &&
            "title" in item &&
            "eu" in item &&
            "note" in item
          ) {
            // Vérifier si l'élément correspond à la recherche
            const searchStr = query.toLowerCase();
            const title = String(item.title || "").toLowerCase();
            const description = String(item.description || "").toLowerCase();
            const us = String(item.us || "").toLowerCase();
            const eu = String(item.eu || "").toLowerCase();

            if (
              title.includes(searchStr) ||
              description.includes(searchStr) ||
              us.includes(searchStr) ||
              eu.includes(searchStr)
            ) {
              // Ajouter à nos résultats avec une clé unique
              result.push({
                key: `${category}-${subcategory}`,
                title: String(item.title || ""),
                description: String(item.description || ""),
                us: String(item.us || ""),
                eu: String(item.eu || ""),
                note: String(item.note || ""),
              });
            }
          }
        });
      });
    } catch (error) {
      console.error("Erreur lors de la génération des suggestions:", error);
    }

    return result.slice(0, 5);
  };

  // Gérer le clic en dehors des suggestions
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mettre à jour les suggestions quand la recherche change
  useEffect(() => {
    const newSuggestions = generateSuggestions(searchQuery);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
  }, [searchQuery, products]);

  const translations = {
    fr: {
      nav: {
        about: "À propos",
        products: "Produits",
        digital: "Services Numériques",
        fashion: "Mode",
        tech: "Technologie",
        getStarted: "Commencer",
      },
      hero: {
        welcome: "Bienvenue sur",
        subtitle:
          "Votre guide pour choisir des alternatives européennes aux produits et services américains.",
        wordplay: "Un jeu de mots : USA → U.S.E (nous + Europe)",
        explore: "Explorer les alternatives",
        learnMore: "En savoir plus",
        search: "Rechercher un produit ou service américain...",
        searchButton: "Rechercher",
      },
      about: {
        title: "Pourquoi choisir européen ?",
        description:
          "Notre mission est de promouvoir les produits et services européens comme alternatives aux produits américains. Il ne s'agit pas de boycotter, mais de faire des choix éclairés qui soutiennent les économies, les normes et les valeurs européennes.",
        privacy: {
          title: "Normes de confidentialité plus strictes",
          description:
            "Les réglementations européennes comme le RGPD offrent une meilleure protection des données et des droits à la vie privée.",
        },
        economy: {
          title: "Soutenir les économies locales",
          description:
            "Choisir des produits européens aide à créer des emplois et à renforcer l'indépendance économique européenne.",
        },
        quality: {
          title: "Qualité et normes",
          description:
            "Les produits européens respectent souvent des normes de qualité strictes et des pratiques durables.",
        },
      },
      products: {
        title: "Alternatives de produits",
        description:
          "Découvrez des alternatives européennes aux produits américains courants dans diverses catégories.",
        tabs: {
          food: "Alimentation",
          hygiene: "Soins personnels",
          household: "Maison",
          fashion: "Mode",
          tech: "Technologie",
        },
        food: {
          drinks: {
            title: "Boissons gazeuses",
            description: "Au lieu des sodas américains",
            us: "Coca-Cola, Pepsi",
            eu: "Breizh Cola, Fritz-kola",
            note: "De nombreux pays européens ont des marques locales de soda artisanal avec des ingrédients naturels.",
          },
          snacks: {
            title: "Snacks",
            description: "Alternatives européennes aux snacks américains",
            us: "Lay's, Doritos, Monster Munch",
            eu: "Brets, Tyrrell's, Sibell",
            note: "Les snacks européens contiennent souvent moins d'additifs et de conservateurs.",
          },
          fastfood: {
            title: "Fast-food",
            description: "Alternatives locales aux chaînes américaines",
            us: "McDonald's, Burger King, KFC, Subway, Domino's Pizza, Krispy Kreme",
            eu: "Quick, Big Fernand, O'Tacos, Pomme de Pain, La Boîte à Pizza, La Mie Câline",
            note: "Soutenez les chaînes de restauration rapide européennes locales avec des spécialités régionales.",
          },
          coffee: {
            title: "Café",
            description: "Alternatives aux chaînes de café américaines",
            us: "Starbucks, Dunkin'",
            eu: "Columbus Café, Café Malongo",
            note: "Les cafés européens proposent souvent des grains de meilleure qualité et un savoir-faire artisanal.",
          },
          chocolate: {
            title: "Chocolat",
            description: "Alternatives aux marques américaines",
            us: "Hershey's, Mars",
            eu: "Lindt, Côte d'Or, Milka",
            note: "Le chocolat européen est réputé pour sa qualité supérieure et ses méthodes de fabrication traditionnelles.",
          },
          cereals: {
            title: "Céréales",
            description: "Alternatives aux céréales américaines",
            us: "Kellogg's, General Mills",
            eu: "Jordans, Alpen, Bjorg",
            note: "Les céréales européennes contiennent généralement moins de sucre et plus d'ingrédients naturels.",
          },
          soda: {
            title: "Sodas et boissons",
            description: "Alternatives aux sodas américains",
            us: "Mountain Dew, Dr Pepper, Fanta, Sierra Mist",
            eu: "Club-Mate, Kofola, Orangina, 7Up",
            note: "L'Europe propose une grande variété de sodas locaux avec des recettes originales et souvent moins sucrées.",
          },
          chips: {
            title: "Chips et snacks salés",
            description: "Alternatives aux marques américaines",
            us: "Pringles, Barbecue Lay's, Goldfish Crackers",
            eu: "Lorenz Chipsletten, Chips Vico, Belin Croustilles",
            note: "Les chips européennes utilisent souvent des ingrédients de meilleure qualité et des huiles plus saines.",
          },
          condiments: {
            title: "Condiments",
            description: "Alternatives aux sauces américaines",
            us: "Heinz Ketchup, Cheez Whiz",
            eu: "Amora Ketchup, Kiri",
            note: "Les condiments européens contiennent généralement moins d'additifs et de conservateurs.",
          },
          chocolate_confectionery: {
            title: "Chocolat et confiseries",
            description: "Alternatives aux sucreries américaines",
            us: "Reese's, Skittles, M&M's, Tootsie Roll",
            eu: "Cémoi, Smarties, Dragibus, Carambar",
            note: "Les confiseries européennes utilisent souvent des recettes traditionnelles et des ingrédients de qualité.",
          },
          desserts: {
            title: "Desserts et pâtisseries",
            description: "Alternatives aux desserts américains",
            us: "Oreo, Pop-Tarts, Twinkies, Jell-O",
            eu: "BN, Napolitain, Paille d'Or, Flamby",
            note: "Les desserts européens privilégient souvent les recettes authentiques et les ingrédients naturels.",
          },
          icecream: {
            title: "Crèmes glacées",
            description: "Alternatives aux glaces américaines",
            us: "Ben & Jerry's, Häagen-Dazs",
            eu: "La Belle Aude, Carte d'Or",
            note: "Les glaces européennes sont souvent fabriquées avec du lait et de la crème de haute qualité.",
          },
          alcohol: {
            title: "Boissons alcoolisées",
            description: "Alternatives aux alcools américains",
            us: "Budweiser, Jack Daniel's",
            eu: "Kronenbourg, Bellevoye",
            note: "L'Europe possède une riche tradition de brasseries et distilleries avec des méthodes ancestrales.",
          },
          energydrinks: {
            title: "Boissons énergisantes",
            description: "Alternatives aux boissons américaines",
            us: "Red Bull (US), Gatorade",
            eu: "Dark Dog, Isostar",
            note: "Les boissons énergisantes européennes proposent souvent des formulations plus naturelles.",
          },
          soup: {
            title: "Soupes et conserves",
            description: "Alternatives aux conserves américaines",
            us: "Campbell's Soup, Spam",
            eu: "Liebig, Corned-beef Hénaff",
            note: "Les soupes et conserves européennes contiennent généralement moins d'additifs et de sel.",
          },
          cheese: {
            title: "Fromages et produits laitiers",
            description: "Alternatives aux fromages américains",
            us: "Velveeta, Philadelphia Cream Cheese",
            eu: "Caprice des Dieux, St Môret",
            note: "L'Europe est réputée pour sa tradition fromagère et ses produits laitiers de qualité.",
          },
          pasta: {
            title: "Pâtes et plats préparés",
            description: "Alternatives aux plats américains",
            us: "Kraft Mac & Cheese, Hot Pockets",
            eu: "Lustucru Coquillettes Fromage, Buitoni Piccolinis",
            note: "Les plats préparés européens privilégient souvent des recettes traditionnelles et des ingrédients de qualité.",
          },
        },
        hygiene: {
          skincare: {
            title: "Soins de la peau",
            description: "Alternatives européennes pour les soins de la peau",
            us: "Neutrogena, CeraVe",
            eu: "La Roche-Posay, Bioderma",
            note: "Les marques européennes de soins de la peau suivent souvent des réglementations d'ingrédients plus strictes.",
          },
          toothpaste: {
            title: "Dentifrice",
            description: "Alternatives pour les soins dentaires",
            us: "Colgate, Crest",
            eu: "Elmex, Sanogyl",
            note: "De nombreuses marques dentaires européennes se concentrent sur les soins préventifs et les ingrédients naturels.",
          },
          deodorants: {
            title: "Déodorants",
            description: "Alternatives pour les soins personnels",
            us: "Old Spice, Dove",
            eu: "Nuxe, Le Petit Marseillais",
            note: "Les déodorants européens contiennent souvent moins de composés d'aluminium.",
          },
          makeup: {
            title: "Maquillage",
            description: "Alternatives aux marques américaines",
            us: "Maybelline, MAC",
            eu: "Bourjois, Yves Rocher",
            note: "Les marques de maquillage européennes proposent souvent des formules plus naturelles et moins testées sur les animaux.",
          },
          shampoo: {
            title: "Shampooing",
            description: "Alternatives pour les soins capillaires",
            us: "Head & Shoulders, Pantene",
            eu: "Klorane, Ducray",
            note: "Les shampooings européens contiennent souvent moins de sulfates et de parabènes.",
          },
          soap: {
            title: "Savon",
            description: "Alternatives aux savons américains",
            us: "Dial, Ivory",
            eu: "Marseille, Roger & Gallet",
            note: "Les savons européens sont souvent fabriqués selon des méthodes traditionnelles avec des ingrédients naturels.",
          },
        },
        household: {
          cleaning: {
            title: "Produits de nettoyage",
            description: "Alternatives pour le nettoyage domestique",
            us: "Clorox, Lysol",
            eu: "Frosch, L'Arbre Vert",
            note: "Les marques de nettoyage européennes se concentrent souvent sur des formulations écologiques.",
          },
          laundry: {
            title: "Lessive",
            description: "Alternatives pour le lavage",
            us: "Tide, Gain",
            eu: "Le Chat, Rainett",
            note: "Les détergents européens sont souvent plus concentrés et respectueux de l'environnement.",
          },
          paper: {
            title: "Produits en papier",
            description: "Alternatives pour les mouchoirs et papiers",
            us: "Bounty, Charmin",
            eu: "Lotus, Renova",
            note: "Recherchez des produits en papier européens avec certification FSC pour une foresterie durable.",
          },
          furniture: {
            title: "Meubles",
            description: "Alternatives aux marques américaines",
            us: "Pottery Barn, Crate & Barrel",
            eu: "Maisons du Monde, BoConcept",
            note: "Les meubles européens sont souvent fabriqués avec des matériaux durables et un design intemporel.",
          },
          kitchenware: {
            title: "Ustensiles de cuisine",
            description: "Alternatives aux marques américaines",
            us: "KitchenAid, Cuisinart",
            eu: "Tefal, WMF",
            note: "Les ustensiles de cuisine européens sont réputés pour leur qualité et leur durabilité.",
          },
          candles: {
            title: "Bougies",
            description: "Alternatives aux marques américaines",
            us: "Yankee Candle, Bath & Body Works",
            eu: "Diptyque, Fragonard",
            note: "Les bougies européennes utilisent souvent des cires naturelles et des parfums de haute qualité.",
          },
        },
        fashion: {
          clothing: {
            title: "Vêtements",
            description: "Alternatives aux marques américaines",
            us: "Gap, Tommy Hilfiger",
            eu: "Zara, H&M",
            note: "Les marques de vêtements européennes proposent souvent des designs plus avant-gardistes et une meilleure qualité.",
          },
          sportswear: {
            title: "Vêtements de sport",
            description: "Alternatives aux marques américaines",
            us: "Nike, Under Armour",
            eu: "Adidas, Decathlon",
            note: "Les marques de sport européennes offrent souvent un bon rapport qualité-prix et des innovations techniques.",
          },
          shoes: {
            title: "Chaussures",
            description: "Alternatives aux marques américaines",
            us: "Converse, Timberland",
            eu: "Geox, Ecco",
            note: "Les chaussures européennes sont souvent fabriquées avec des matériaux de qualité supérieure et un savoir-faire artisanal.",
          },
          luxury: {
            title: "Luxe",
            description: "Alternatives aux marques américaines",
            us: "Ralph Lauren, Michael Kors",
            eu: "Louis Vuitton, Chanel",
            note: "Les marques de luxe européennes sont reconnues pour leur artisanat exceptionnel et leur héritage.",
          },
          accessories: {
            title: "Accessoires",
            description: "Alternatives aux marques américaines",
            us: "Fossil, Coach",
            eu: "Longchamp, Furla",
            note: "Les accessoires européens sont souvent fabriqués avec des matériaux de qualité supérieure et un design intemporel.",
          },
          jewelry: {
            title: "Bijoux",
            description: "Alternatives aux marques américaines",
            us: "Tiffany & Co., Pandora",
            eu: "Swarovski, APM Monaco",
            note: "Les bijoux européens sont souvent fabriqués avec un savoir-faire traditionnel et des matériaux de qualité.",
          },
        },
        tech: {
          smartphones: {
            title: "Smartphones",
            description: "Alternatives aux marques américaines",
            us: "Apple, Google",
            eu: "Nokia, Wiko",
            note: "Les smartphones européens offrent souvent un bon rapport qualité-prix et respectent davantage la vie privée.",
          },
          computers: {
            title: "Ordinateurs",
            description: "Alternatives aux marques américaines",
            us: "Dell, HP",
            eu: "Acer, ASUS",
            note: "Les ordinateurs européens proposent souvent des designs innovants et une bonne qualité de fabrication.",
          },
          audio: {
            title: "Audio",
            description: "Alternatives aux marques américaines",
            us: "Bose, Beats",
            eu: "Bang & Olufsen, Focal",
            note: "Les marques audio européennes sont réputées pour leur qualité sonore exceptionnelle et leur design élégant.",
          },
          appliances: {
            title: "Électroménager",
            description: "Alternatives aux marques américaines",
            us: "Whirlpool, GE",
            eu: "Bosch, Siemens",
            note: "L'électroménager européen est souvent plus économe en énergie et plus durable.",
          },
          gaming: {
            title: "Jeux vidéo",
            description: "Alternatives aux marques américaines",
            us: "Microsoft Xbox, EA",
            eu: "Ubisoft, CD Projekt",
            note: "Les studios de jeux européens créent souvent des jeux avec des histoires riches et des graphismes impressionnants.",
          },
          cameras: {
            title: "Appareils photo",
            description: "Alternatives aux marques américaines",
            us: "GoPro, Kodak",
            eu: "Leica, Olympus",
            note: "Les appareils photo européens sont réputés pour leur qualité d'image exceptionnelle et leur construction robuste.",
          },
        },
      },
      digital: {
        title: "Services numériques",
        description:
          "Alternatives européennes aux services et plateformes numériques américains.",
        search: {
          title: "Moteurs de recherche",
          description: "Alternatives axées sur la confidentialité",
          us: "Google",
          eu: "Qwant, Ecosia",
          note: "Moteurs de recherche européens qui ne suivent pas vos recherches ni ne créent de profils d'utilisateurs.",
        },
        cloud: {
          title: "Stockage cloud",
          description: "Alternatives européennes sécurisées",
          us: "Dropbox, Google Drive",
          eu: "pCloud, Tresorit",
          note: "Services cloud européens avec chiffrement de bout en bout et conformité RGPD.",
        },
        email: {
          title: "Services de messagerie",
          description: "Communication privée",
          us: "Gmail, Yahoo",
          eu: "ProtonMail, Tutanota",
          note: "Fournisseurs de messagerie européens avec chiffrement fort et accent sur la confidentialité.",
        },
        social: {
          title: "Réseaux sociaux",
          description: "Plateformes alternatives",
          us: "Facebook, Twitter",
          eu: "Mastodon, Diaspora",
          note: "Réseaux sociaux décentralisés avec serveurs européens et sans collecte de données.",
        },
        streaming: {
          title: "Services de streaming",
          description: "Plateformes de contenu européennes",
          us: "Netflix, Disney+",
          eu: "ARTE, MUBI",
          note: "Plateformes de streaming européennes axées sur les films et productions européens.",
        },
        messaging: {
          title: "Applications de messagerie",
          description: "Communication sécurisée",
          us: "WhatsApp, Messenger",
          eu: "Signal, Wire",
          note: "Applications de messagerie européennes avec chiffrement fort et fonctionnalités de confidentialité.",
        },
        maps: {
          title: "Cartes et navigation",
          description: "Alternatives aux services américains",
          us: "Google Maps, Waze",
          eu: "Here WeGo, Mappy",
          note: "Services de cartographie européens qui respectent davantage votre vie privée.",
        },
        music: {
          title: "Streaming musical",
          description: "Alternatives aux services américains",
          us: "Spotify, Apple Music",
          eu: "Deezer, Qobuz",
          note: "Services de streaming musical européens qui rémunèrent souvent mieux les artistes.",
        },
        productivity: {
          title: "Productivité",
          description: "Alternatives aux suites américaines",
          us: "Microsoft Office, Google Workspace",
          eu: "OnlyOffice, Nextcloud",
          note: "Suites bureautiques européennes qui respectent votre vie privée et vos données.",
        },
        payment: {
          title: "Paiement en ligne",
          description: "Alternatives aux services américains",
          us: "PayPal, Stripe",
          eu: "Klarna, Mollie",
          note: "Services de paiement européens conformes aux réglementations européennes.",
        },
        dating: {
          title: "Applications de rencontre",
          description: "Alternatives aux applications américaines",
          us: "Tinder, Bumble",
          eu: "Happn, Once",
          note: "Applications de rencontre européennes avec une meilleure protection des données personnelles.",
        },
        education: {
          title: "Éducation en ligne",
          description: "Alternatives aux plateformes américaines",
          us: "Coursera, Khan Academy",
          eu: "OpenClassrooms, FUN-MOOC",
          note: "Plateformes éducatives européennes proposant des cours de qualité dans de nombreuses langues.",
        },
      },
      newsletter: {
        title: "Rejoignez le mouvement",
        description:
          "Abonnez-vous à notre newsletter pour des mises à jour régulières sur les alternatives européennes et des conseils.",
        placeholder: "Entrez votre email",
        button: "S'abonner",
        privacy:
          "En vous abonnant, vous acceptez notre politique de confidentialité et nos conditions d'utilisation.",
      },
      footer: {
        rights: "© 2025 U.S.E. Tous droits réservés.",
        terms: "Conditions d'utilisation",
        privacy: "Confidentialité",
        contact: "Contact",
      },
      learnMore: "En savoir plus",
      new: "Nouveau",
      popular: "Populaire",
      recommended: "Recommandé",
      discover: "Découvrir",
      compare: "Comparer",
      viewAll: "Voir tout",
      allProducts: "Tous les produits",
    },
    en: {
      nav: {
        about: "About",
        products: "Products",
        digital: "Digital Services",
        fashion: "Fashion",
        tech: "Technology",
        getStarted: "Get Started",
      },
      hero: {
        welcome: "Welcome to",
        subtitle:
          "Your guide to choosing European alternatives over American products and services.",
        wordplay: "A play on words: USA → U.S.E (us + Europe)",
        explore: "Explore Alternatives",
        learnMore: "Learn More",
        search: "Search for an American product or service...",
        searchButton: "Search",
      },
      about: {
        title: "Why Choose European?",
        description:
          "Our mission is to promote European products and services as alternatives to American ones. This isn't about boycotting, but about making informed choices that support European economies, standards, and values.",
        privacy: {
          title: "Stronger Privacy Standards",
          description:
            "European regulations like GDPR provide stronger data protection and privacy rights.",
        },
        economy: {
          title: "Support Local Economies",
          description:
            "Choosing European products helps create jobs and strengthen European economic independence.",
        },
        quality: {
          title: "Quality & Standards",
          description:
            "European products often adhere to strict quality standards and sustainable practices.",
        },
      },
      products: {
        title: "Product Alternatives",
        description:
          "Discover European alternatives to common American products across various categories.",
        tabs: {
          food: "Food & Beverages",
          hygiene: "Personal Care",
          household: "Household",
          fashion: "Fashion",
          tech: "Technology",
        },
        food: {
          drinks: {
            title: "Soft Drinks",
            description: "Instead of American sodas",
            us: "Coca-Cola, Pepsi",
            eu: "Breizh Cola, Fritz-kola",
            note: "Many European countries have local craft soda brands with natural ingredients.",
          },
          snacks: {
            title: "Snacks",
            description: "European alternatives to American snacks",
            us: "Lay's, Doritos, Monster Munch",
            eu: "Brets, Tyrrell's, Sibell",
            note: "European snacks often contain fewer additives and preservatives.",
          },
          fastfood: {
            title: "Fast Food",
            description: "Local alternatives to American chains",
            us: "McDonald's, Burger King, KFC, Subway, Domino's Pizza, Krispy Kreme",
            eu: "Quick, Big Fernand, O'Tacos, Pomme de Pain, La Boîte à Pizza, La Mie Câline",
            note: "Support local European fast food chains with regional specialties.",
          },
          coffee: {
            title: "Coffee",
            description: "Alternatives to American coffee chains",
            us: "Starbucks, Dunkin'",
            eu: "Columbus Café, Café Malongo",
            note: "European cafés often offer better quality beans and artisanal craftsmanship.",
          },
          chocolate: {
            title: "Chocolate",
            description: "Alternatives to American brands",
            us: "Hershey's, Mars",
            eu: "Lindt, Côte d'Or, Milka",
            note: "European chocolate is known for its superior quality and traditional manufacturing methods.",
          },
          cereals: {
            title: "Cereals",
            description: "Alternatives to American cereals",
            us: "Kellogg's, General Mills",
            eu: "Jordans, Alpen, Bjorg",
            note: "European cereals generally contain less sugar and more natural ingredients.",
          },
          soda: {
            title: "Sodas & Beverages",
            description: "Alternatives to American sodas",
            us: "Mountain Dew, Dr Pepper, Fanta, Sierra Mist",
            eu: "Club-Mate, Kofola, Orangina, 7Up",
            note: "Europe offers a wide variety of local sodas with original recipes and often less sugar.",
          },
          chips: {
            title: "Chips & Savory Snacks",
            description: "Alternatives to American brands",
            us: "Pringles, Barbecue Lay's, Goldfish Crackers",
            eu: "Lorenz Chipsletten, Chips Vico, Belin Croustilles",
            note: "European chips often use better quality ingredients and healthier oils.",
          },
          condiments: {
            title: "Condiments",
            description: "Alternatives to American sauces",
            us: "Heinz Ketchup, Cheez Whiz",
            eu: "Amora Ketchup, Kiri",
            note: "European condiments generally contain fewer additives and preservatives.",
          },
          chocolate_confectionery: {
            title: "Chocolate & Confectionery",
            description: "Alternatives to American sweets",
            us: "Reese's, Skittles, M&M's, Tootsie Roll",
            eu: "Cémoi, Smarties, Dragibus, Carambar",
            note: "European confectionery often uses traditional recipes and quality ingredients.",
          },
          desserts: {
            title: "Desserts & Pastries",
            description: "Alternatives to American desserts",
            us: "Oreo, Pop-Tarts, Twinkies, Jell-O",
            eu: "BN, Napolitain, Paille d'Or, Flamby",
            note: "European desserts often favor authentic recipes and natural ingredients.",
          },
          icecream: {
            title: "Ice Cream",
            description: "Alternatives to American ice cream",
            us: "Ben & Jerry's, Häagen-Dazs",
            eu: "La Belle Aude, Carte d'Or",
            note: "European ice creams are often made with high-quality milk and cream.",
          },
          alcohol: {
            title: "Alcoholic Beverages",
            description: "Alternatives to American alcohol",
            us: "Budweiser, Jack Daniel's",
            eu: "Kronenbourg, Bellevoye",
            note: "Europe has a rich tradition of breweries and distilleries with ancestral methods.",
          },
          energydrinks: {
            title: "Energy Drinks",
            description: "Alternatives to American beverages",
            us: "Red Bull (US), Gatorade",
            eu: "Dark Dog, Isostar",
            note: "European energy drinks often offer more natural formulations.",
          },
          soup: {
            title: "Soups & Canned Goods",
            description: "Alternatives to American canned goods",
            us: "Campbell's Soup, Spam",
            eu: "Liebig, Corned-beef Hénaff",
            note: "European soups and canned goods generally contain fewer additives and salt.",
          },
          cheese: {
            title: "Cheese & Dairy Products",
            description: "Alternatives to American cheese",
            us: "Velveeta, Philadelphia Cream Cheese",
            eu: "Caprice des Dieux, St Môret",
            note: "Europe is renowned for its cheese tradition and quality dairy products.",
          },
          pasta: {
            title: "Pasta & Ready Meals",
            description: "Alternatives to American dishes",
            us: "Kraft Mac & Cheese, Hot Pockets",
            eu: "Lustucru Coquillettes Fromage, Buitoni Piccolinis",
            note: "European ready meals often favor traditional recipes and quality ingredients.",
          },
        },
        hygiene: {
          skincare: {
            title: "Skincare",
            description: "European skincare alternatives",
            us: "Neutrogena, CeraVe",
            eu: "La Roche-Posay, Bioderma",
            note: "European skincare brands often follow stricter ingredient regulations.",
          },
          toothpaste: {
            title: "Toothpaste",
            description: "Dental care alternatives",
            us: "Colgate, Crest",
            eu: "Elmex, Sanogyl",
            note: "Many European dental brands focus on preventative care and natural ingredients.",
          },
          deodorants: {
            title: "Deodorants",
            description: "Personal care alternatives",
            us: "Old Spice, Dove",
            eu: "Nuxe, Le Petit Marseillais",
            note: "European deodorants often contain fewer aluminum compounds.",
          },
          makeup: {
            title: "Makeup",
            description: "Alternatives to American brands",
            us: "Maybelline, MAC",
            eu: "Bourjois, Yves Rocher",
            note: "European makeup brands often offer more natural formulas and less animal testing.",
          },
          shampoo: {
            title: "Shampoo",
            description: "Hair care alternatives",
            us: "Head & Shoulders, Pantene",
            eu: "Klorane, Ducray",
            note: "European shampoos often contain fewer sulfates and parabens.",
          },
          soap: {
            title: "Soap",
            description: "Alternatives to American soaps",
            us: "Dial, Ivory",
            eu: "Marseille, Roger & Gallet",
            note: "European soaps are often made using traditional methods with natural ingredients.",
          },
        },
        household: {
          cleaning: {
            title: "Cleaning Products",
            description: "Home cleaning alternatives",
            us: "Clorox, Lysol",
            eu: "Frosch, L'Arbre Vert",
            note: "European cleaning brands often focus on eco-friendly formulations.",
          },
          laundry: {
            title: "Laundry Detergent",
            description: "Washing alternatives",
            us: "Tide, Gain",
            eu: "Le Chat, Rainett",
            note: "European detergents are often more concentrated and environmentally friendly.",
          },
          paper: {
            title: "Paper Products",
            description: "Tissue and paper alternatives",
            us: "Bounty, Charmin",
            eu: "Lotus, Renova",
            note: "Look for European paper products with FSC certification for sustainable forestry.",
          },
          furniture: {
            title: "Furniture",
            description: "Alternatives to American brands",
            us: "Pottery Barn, Crate & Barrel",
            eu: "Maisons du Monde, BoConcept",
            note: "European furniture is often made with sustainable materials and timeless design.",
          },
          kitchenware: {
            title: "Kitchenware",
            description: "Alternatives to American brands",
            us: "KitchenAid, Cuisinart",
            eu: "Tefal, WMF",
            note: "European kitchenware is known for its quality and durability.",
          },
          candles: {
            title: "Candles",
            description: "Alternatives to American brands",
            us: "Yankee Candle, Bath & Body Works",
            eu: "Diptyque, Fragonard",
            note: "European candles often use natural waxes and high-quality fragrances.",
          },
        },
        fashion: {
          clothing: {
            title: "Clothing",
            description: "Alternatives to American brands",
            us: "Gap, Tommy Hilfiger",
            eu: "Zara, H&M",
            note: "European clothing brands often offer more cutting-edge designs and better quality.",
          },
          sportswear: {
            title: "Sportswear",
            description: "Alternatives to American brands",
            us: "Nike, Under Armour",
            eu: "Adidas, Decathlon",
            note: "European sports brands often offer good value for money and technical innovations.",
          },
          shoes: {
            title: "Shoes",
            description: "Alternatives to American brands",
            us: "Converse, Timberland",
            eu: "Geox, Ecco",
            note: "European shoes are often made with higher quality materials and craftsmanship.",
          },
          luxury: {
            title: "Luxury",
            description: "Alternatives to American brands",
            us: "Ralph Lauren, Michael Kors",
            eu: "Louis Vuitton, Chanel",
            note: "European luxury brands are known for exceptional craftsmanship and heritage.",
          },
          accessories: {
            title: "Accessories",
            description: "Alternatives to American brands",
            us: "Fossil, Coach",
            eu: "Longchamp, Furla",
            note: "European accessories are often made with higher quality materials and timeless design.",
          },
          jewelry: {
            title: "Jewelry",
            description: "Alternatives to American brands",
            us: "Tiffany & Co., Pandora",
            eu: "Swarovski, APM Monaco",
            note: "European jewelry is often made with traditional craftsmanship and quality materials.",
          },
        },
        tech: {
          smartphones: {
            title: "Smartphones",
            description: "Alternatives to American brands",
            us: "Apple, Google",
            eu: "Nokia, Wiko",
            note: "European smartphones often offer good value for money and better privacy.",
          },
          computers: {
            title: "Computers",
            description: "Alternatives to American brands",
            us: "Dell, HP",
            eu: "Acer, ASUS",
            note: "European computers often offer innovative designs and good build quality.",
          },
          audio: {
            title: "Audio",
            description: "Alternatives to American brands",
            us: "Bose, Beats",
            eu: "Bang & Olufsen, Focal",
            note: "European audio brands are known for exceptional sound quality and elegant design.",
          },
          appliances: {
            title: "Appliances",
            description: "Alternatives to American brands",
            us: "Whirlpool, GE",
            eu: "Bosch, Siemens",
            note: "European appliances are often more energy-efficient and durable.",
          },
          gaming: {
            title: "Gaming",
            description: "Alternatives to American brands",
            us: "Microsoft Xbox, EA",
            eu: "Ubisoft, CD Projekt",
            note: "European game studios often create games with rich stories and impressive graphics.",
          },
          cameras: {
            title: "Cameras",
            description: "Alternatives to American brands",
            us: "GoPro, Kodak",
            eu: "Leica, Olympus",
            note: "European cameras are known for exceptional image quality and robust construction.",
          },
        },
      },
      digital: {
        title: "Digital Services",
        description:
          "European alternatives to American digital services and platforms.",
        search: {
          title: "Search Engines",
          description: "Privacy-focused alternatives",
          us: "Google",
          eu: "Qwant, Ecosia",
          note: "European search engines that don't track your searches or build user profiles.",
        },
        cloud: {
          title: "Cloud Storage",
          description: "Secure European alternatives",
          us: "Dropbox, Google Drive",
          eu: "pCloud, Tresorit",
          note: "European cloud services with end-to-end encryption and GDPR compliance.",
        },
        email: {
          title: "Email Services",
          description: "Private communication",
          us: "Gmail, Yahoo",
          eu: "ProtonMail, Tutanota",
          note: "European email providers with strong encryption and privacy focus.",
        },
        social: {
          title: "Social Media",
          description: "Alternative platforms",
          us: "Facebook, Twitter",
          eu: "Mastodon, Diaspora",
          note: "Decentralized social networks with European servers and no data harvesting.",
        },
        streaming: {
          title: "Streaming Services",
          description: "European content platforms",
          us: "Netflix, Disney+",
          eu: "ARTE, MUBI",
          note: "European streaming platforms with focus on European films and productions.",
        },
        messaging: {
          title: "Messaging Apps",
          description: "Secure communication",
          us: "WhatsApp, Messenger",
          eu: "Signal, Wire",
          note: "European messaging apps with strong encryption and privacy features.",
        },
        maps: {
          title: "Maps & Navigation",
          description: "Alternatives to American services",
          us: "Google Maps, Waze",
          eu: "Here WeGo, Mappy",
          note: "European mapping services that better respect your privacy.",
        },
        music: {
          title: "Music Streaming",
          description: "Alternatives to American services",
          us: "Spotify, Apple Music",
          eu: "Deezer, Qobuz",
          note: "European music streaming services that often pay artists better.",
        },
        productivity: {
          title: "Productivity",
          description: "Alternatives to American suites",
          us: "Microsoft Office, Google Workspace",
          eu: "OnlyOffice, Nextcloud",
          note: "European office suites that respect your privacy and data.",
        },
        payment: {
          title: "Online Payment",
          description: "Alternatives to American services",
          us: "PayPal, Stripe",
          eu: "Klarna, Mollie",
          note: "European payment services compliant with European regulations.",
        },
        dating: {
          title: "Dating Apps",
          description: "Alternatives to American apps",
          us: "Tinder, Bumble",
          eu: "Happn, Once",
          note: "European dating apps with better personal data protection.",
        },
        education: {
          title: "Online Education",
          description: "Alternatives to American platforms",
          us: "Coursera, Khan Academy",
          eu: "OpenClassrooms, FUN-MOOC",
          note: "European educational platforms offering quality courses in many languages.",
        },
      },
      newsletter: {
        title: "Join the Movement",
        description:
          "Subscribe to our newsletter for regular updates on European alternatives and tips.",
        placeholder: "Enter your email",
        button: "Subscribe",
        privacy:
          "By subscribing, you agree to our privacy policy and terms of service.",
      },
      footer: {
        rights: "© 2025 U.S.E. All rights reserved.",
        terms: "Terms of Service",
        privacy: "Privacy",
        contact: "Contact",
      },
      learnMore: "Learn More",
      new: "New",
      popular: "Popular",
      recommended: "Recommended",
      discover: "Discover",
      compare: "Compare",
      viewAll: "View All",
      allProducts: "All Products",
    },
  };

  const t = translations[language];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // En-tête
      doc.setFontSize(24);
      doc.setTextColor(0, 102, 204);
      doc.text("U.S.E - Alternatives Européennes", pageWidth / 2, 20, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(
        "Guide des alternatives européennes aux produits américains",
        pageWidth / 2,
        30,
        { align: "center" }
      );

      // Date de génération
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Généré le ${new Date().toLocaleDateString("fr-FR")}`,
        pageWidth / 2,
        40,
        { align: "center" }
      );

      let lastY = 40;

      // Fonction pour créer un tableau de catégorie
      const createCategoryTable = (
        category: string,
        products: Record<string, Product>
      ) => {
        const tableData = Object.entries(products).map(([key, product]) => [
          product.title,
          product.us,
          product.eu,
          product.note,
        ]);

        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204);
        doc.text(category, 14, lastY + 20);
        lastY += 25;

        const options: UserOptions = {
          startY: lastY,
          head: [["Produit", "Marques US", "Alternatives EU", "Note"]],
          body: tableData,
          theme: "grid" as ThemeType,
          headStyles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            fontSize: 10,
            fontStyle: "bold",
          },
          styles: {
            fontSize: 9,
            cellPadding: 3,
          },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 40 },
            2: { cellWidth: 40 },
            3: { cellWidth: 40 },
          },
          didDrawPage: (data: any) => {
            // Ajouter le numéro de page
            doc.setFontSize(10);
            doc.setTextColor(128, 128, 128);
            doc.text(
              `Page ${(doc as any).internal.getNumberOfPages()}`,
              pageWidth / 2,
              pageHeight - 10,
              { align: "center" }
            );
          },
        };

        autoTable(doc, options);
        lastY = (doc as any).lastAutoTable.finalY;
      };

      // Générer les tables pour chaque catégorie
      createCategoryTable("Alimentation", t.products.food);
      createCategoryTable("Soins Personnels", t.products.hygiene);
      createCategoryTable("Maison", t.products.household);
      createCategoryTable("Mode", t.products.fashion);
      createCategoryTable("Technologie", t.products.tech);

      // Pied de page
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        "© 2025 U.S.E - Tous droits réservés",
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" }
      );

      // Sauvegarder le PDF
      doc.save("USE-Alternatives-Europeennes.pdf");
      toast.success(
        language === "fr"
          ? "PDF généré avec succès !"
          : "PDF generated successfully!"
      );
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error(
        language === "fr"
          ? "Une erreur est survenue lors de la génération du PDF"
          : "An error occurred while generating the PDF"
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f7] dark:bg-[#1d1d1f]">
      <Toaster richColors position="top-center" />
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-2xl transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-[#1d1d1f]/90 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <div className="flex items-center">
              <span className="mr-2 text-3xl">🇪🇺</span>
              <span className="bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] bg-clip-text font-medium text-transparent">
                U.S.E
              </span>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="!ml-4 mr-4 flex items-center">
            <button
              onClick={() => setLanguage("fr")}
              className={`px-3 py-1.5 text-xs rounded-l-full transition-all ${
                language === "fr"
                  ? "bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] text-white font-medium shadow-md"
                  : "bg-[#f2f2f7] dark:bg-[#2c2c2e] hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c]"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 text-xs rounded-r-full transition-all ${
                language === "en"
                  ? "bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] text-white font-medium shadow-md"
                  : "bg-[#f2f2f7] dark:bg-[#2c2c2e] hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c]"
              }`}
            >
              EN
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-end space-x-4 md:flex">
            <nav className={`flex items-center space-x-4 ${inter.className}`}>
              <Link
                href="#about"
                className="text-sm font-medium transition-colors hover:text-[#0066cc] dark:hover:text-[#5ac8fa]"
              >
                {t.nav.about}
              </Link>
              <Link
                href="#products"
                className="text-sm font-medium transition-colors hover:text-[#0066cc] dark:hover:text-[#5ac8fa]"
              >
                {t.nav.products}
              </Link>
              <Link
                href="#digital"
                className="text-sm font-medium transition-colors hover:text-[#0066cc] dark:hover:text-[#5ac8fa]"
              >
                {t.nav.digital}
              </Link>
              <Link href="/all-products">
                <Button className="rounded-full bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] text-white shadow-md transition-all duration-300 hover:from-[#0055aa] hover:to-[#4ab8ea] hover:shadow-lg">
                  {t.nav.getStarted}
                </Button>
              </Link>
            </nav>
          </div>

          {/* Mobile Navigation */}
          <div className="flex flex-1 justify-end md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-[#e5e5ea] dark:border-[#3a3a3c]"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-l-[#e5e5ea] bg-white/95 backdrop-blur-2xl dark:border-l-[#3a3a3c] dark:bg-[#1d1d1f]/95"
              >
                <div className="mt-6 flex flex-col gap-6">
                  <Link
                    href="#about"
                    className="text-lg font-medium transition-colors hover:text-[#0066cc] dark:hover:text-[#5ac8fa]"
                  >
                    {t.nav.about}
                  </Link>
                  <Link
                    href="#products"
                    className="text-lg font-medium transition-colors hover:text-[#0066cc] dark:hover:text-[#5ac8fa]"
                  >
                    {t.nav.products}
                  </Link>
                  <Link
                    href="#digital"
                    className="text-lg font-medium transition-colors hover:text-[#0066cc] dark:hover:text-[#5ac8fa]"
                  >
                    {t.nav.digital}
                  </Link>
                  <Link href="/all-products">
                    <Button className="rounded-full bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] text-white shadow-md hover:from-[#0055aa] hover:to-[#4ab8ea]">
                      {t.nav.getStarted}
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full overflow-hidden bg-gradient-to-b from-[#f5f5f7] via-[#e5e5ea] to-white py-12 dark:from-[#1d1d1f] dark:via-[#2c2c2e] dark:to-[#1d1d1f] md:py-24 lg:py-8">
          <div className="container relative px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl xl:text-6xl/none">
                    {t.hero.welcome} <span className="text-primary">U.S.E</span>
                  </h1>
                  <p className="max-w-[600px] text-[#6e6e73] dark:text-[#86868b] md:text-xl">
                    {t.hero.subtitle}
                    <span className="mt-2 block text-sm italic">
                      {t.hero.wordplay}
                    </span>
                  </p>
                </div>

                {/* Search Bar */}
                <form
                  onSubmit={handleSearch}
                  className="mb-4 mt-4 flex flex-col gap-2 sm:flex-row"
                  ref={searchRef}
                >
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#8e8e93]" />
                    <Input
                      type="text"
                      placeholder={t.hero.search}
                      className="h-12 rounded-full border-[#d1d1d6] bg-white/90 py-2 pl-10 pr-4 backdrop-blur-sm dark:border-[#3a3a3c] dark:bg-[#2c2c2e]/90"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-auto rounded-xl border border-[#e5e5ea] bg-white/95 p-2 shadow-lg backdrop-blur-sm dark:border-[#3a3a3c] dark:bg-[#2c2c2e]/95">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.key}
                            type="button"
                            className="w-full rounded-lg p-3 text-left hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                            onClick={() => {
                              router.push(
                                `/all-products?q=${encodeURIComponent(
                                  suggestion.title
                                )}`
                              );
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">
                                  {suggestion.title}
                                </div>
                                <div className="text-sm text-[#6e6e73] dark:text-[#86868b]">
                                  {suggestion.description}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-[#ff3b30]">
                                  🇺🇸
                                </span>
                                <ArrowRight className="h-4 w-4 text-[#8e8e93]" />
                                <span className="text-sm text-[#0066cc]">
                                  🇪🇺
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="h-12 rounded-full bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] text-white shadow-md transition-all duration-300 hover:from-[#0055aa] hover:to-[#4ab8ea] hover:shadow-lg"
                  >
                    {t.hero.searchButton}
                  </Button>
                </form>

                <div className="relative z-10 flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/all-products">
                    <Button
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] text-white shadow-lg transition-all duration-300 hover:from-[#0055aa] hover:to-[#4ab8ea] hover:shadow-xl"
                    >
                      {t.hero.explore}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-[#d1d1d6] transition-all duration-300 hover:bg-[#f2f2f7] dark:border-[#3a3a3c] dark:hover:bg-[#2c2c2e]"
                  >
                    {t.hero.learnMore}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      try {
                        generatePDF();
                      } catch (error) {
                        console.error(
                          "Erreur lors de la génération du PDF:",
                          error
                        );
                        alert(
                          language === "fr"
                            ? "Une erreur est survenue lors de la génération du PDF"
                            : "An error occurred while generating the PDF"
                        );
                      }
                    }}
                    className="rounded-full border-[#d1d1d6] transition-all duration-300 hover:bg-[#f2f2f7] dark:border-[#3a3a3c] dark:hover:bg-[#2c2c2e]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {language === "fr" ? "Télécharger le PDF" : "Download PDF"}
                  </Button>
                </div>
              </div>
              <div className="relative mx-auto flex aspect-square transform items-center justify-center overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:scale-[1.02] sm:w-full lg:order-last">
                <DynamicHelloComponent />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute left-0 top-1/4 h-72 w-72 animate-blob rounded-full bg-[#0066cc] opacity-10 mix-blend-multiply blur-3xl filter"></div>
            <div className="animation-delay-2000 absolute right-0 top-1/3 h-72 w-72 animate-blob rounded-full bg-[#ffcc00] opacity-10 mix-blend-multiply blur-3xl filter"></div>
            <div className="animation-delay-4000 absolute bottom-0 left-1/4 h-72 w-72 animate-blob rounded-full bg-[#5ac8fa] opacity-10 mix-blend-multiply blur-3xl filter"></div>
          </div>
        </section>

        <section
          id="products"
          className="w-full bg-[#f5f5f7] py-12 dark:bg-[#1d1d1f] md:py-24 lg:py-32"
        >
          <div className="container max-w-[1800px] px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="max-w-3xl space-y-2">
                <Badge
                  variant="outline"
                  className="mb-2 border-0 bg-gradient-to-r from-[#5856d6] to-[#af52de] px-3 py-1 text-sm text-white shadow-sm"
                >
                  {t.nav.products}
                </Badge>
                <h2 className="bg-gradient-to-r from-[#5856d6] to-[#af52de] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
                  {t.products.title}
                </h2>
                <p className="text-[#6e6e73] dark:text-[#86868b] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.products.description}
                </p>
              </div>
            </div>

            <Tabs
              defaultValue="food"
              className="mx-auto mt-12 w-full max-w-4xl overflow-hidden"
              onValueChange={setActiveTab}
            >
              <div className="relative w-full">
                <div className="hide-scrollbar overflow-x-auto pb-2">
                  <TabsList className="flex w-max min-w-full rounded-full bg-[#e5e5ea] p-1 dark:bg-[#2c2c2e]">
                    <TabsTrigger
                      className="min-w-[120px] flex-1 rounded-full text-xs transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-[#3a3a3c] sm:text-sm"
                      value="food"
                    >
                      {t.products.tabs.food}
                    </TabsTrigger>
                    <TabsTrigger
                      className="min-w-[120px] flex-1 rounded-full text-xs transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-[#3a3a3c] sm:text-sm"
                      value="hygiene"
                    >
                      {t.products.tabs.hygiene}
                    </TabsTrigger>
                    <TabsTrigger
                      className="min-w-[120px] flex-1 rounded-full text-xs transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-[#3a3a3c] sm:text-sm"
                      value="household"
                    >
                      {t.products.tabs.household}
                    </TabsTrigger>
                    <TabsTrigger
                      className="min-w-[120px] flex-1 rounded-full text-xs transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-[#3a3a3c] sm:text-sm"
                      value="fashion"
                    >
                      {t.products.tabs.fashion}
                    </TabsTrigger>
                    <TabsTrigger
                      className="min-w-[120px] flex-1 rounded-full text-xs transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-[#3a3a3c] sm:text-sm"
                      value="tech"
                    >
                      {t.products.tabs.tech}
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="food" className="mt-6 p-4">
                <div className="mx-auto grid max-w-[1800px] gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                  <Card className="transform overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg dark:bg-[#2c2c2e]">
                    <div className="absolute right-4 top-4">
                      <Badge className="border-0 bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] py-0.5 text-xs shadow-sm hover:from-[#0055aa] hover:to-[#4ab8ea]">
                        {t.popular}
                      </Badge>
                    </div>
                    <CardHeader className="px-5 pb-0 pt-5">
                      <CardTitle className="text-xl font-medium">
                        {t.products.food.drinks.title}
                      </CardTitle>
                      <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                        {t.products.food.drinks.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-3">
                      <div className="space-y-2 rounded-xl bg-[#f2f2f7] p-4 dark:bg-[#3a3a3c]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#ff3b30]">
                              🇺🇸
                            </span>
                            <span className="font-medium">
                              {t.products.food.drinks.us}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#8e8e93]" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#0066cc]">
                              🇪🇺
                            </span>
                            <span className="font-medium">
                              {t.products.food.drinks.eu}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm italic text-[#6e6e73] dark:text-[#86868b]">
                          {t.products.food.drinks.note}
                        </p>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.discover}
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.compare}
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="transform overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg dark:bg-[#2c2c2e]">
                    <CardHeader className="px-5 pb-0 pt-5">
                      <CardTitle className="text-xl font-medium">
                        {t.products.food.snacks.title}
                      </CardTitle>
                      <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                        {t.products.food.snacks.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-3">
                      <div className="space-y-2 rounded-xl bg-[#f2f2f7] p-4 dark:bg-[#3a3a3c]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#ff3b30]">
                              🇺🇸
                            </span>
                            <span className="font-medium">
                              {t.products.food.snacks.us}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#8e8e93]" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#0066cc]">
                              🇪🇺
                            </span>
                            <span className="font-medium">
                              {t.products.food.snacks.eu}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm italic text-[#6e6e73] dark:text-[#86868b]">
                          {t.products.food.snacks.note}
                        </p>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.discover}
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.compare}
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="transform overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg dark:bg-[#2c2c2e]">
                    <div className="absolute right-4 top-4">
                      <Badge className="border-0 bg-gradient-to-r from-[#34c759] to-[#30d158] py-0.5 text-xs shadow-sm hover:from-[#2eb350] hover:to-[#28bd4c]">
                        {t.recommended}
                      </Badge>
                    </div>
                    <CardHeader className="px-5 pb-0 pt-5">
                      <CardTitle className="text-xl font-medium">
                        {t.products.food.fastfood.title}
                      </CardTitle>
                      <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                        {t.products.food.fastfood.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-3">
                      <div className="space-y-2 rounded-xl bg-[#f2f2f7] p-4 dark:bg-[#3a3a3c]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#ff3b30]">
                              🇺🇸
                            </span>
                            <span className="font-medium">
                              {t.products.food.fastfood.us}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#8e8e93]" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#0066cc]">
                              🇪🇺
                            </span>
                            <span className="font-medium">
                              {t.products.food.fastfood.eu}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm italic text-[#6e6e73] dark:text-[#86868b]">
                          {t.products.food.fastfood.note}
                        </p>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.discover}
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.compare}
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-8 text-center">
                  <Link href="/all-products?category=food">
                    <Button className="rounded-full bg-white px-6 text-[#0066cc] shadow-sm hover:bg-[#f2f2f7] dark:bg-[#2c2c2e] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]">
                      {t.viewAll}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="hygiene" className="mt-6 p-4">
                <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {/* Similar card structure for hygiene products */}
                  <Card className="transform overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg dark:bg-[#2c2c2e]">
                    <div className="absolute right-4 top-4">
                      <Badge className="border-0 bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] py-0.5 text-xs shadow-sm hover:from-[#0055aa] hover:to-[#4ab8ea]">
                        {t.popular}
                      </Badge>
                    </div>
                    <CardHeader className="px-5 pb-0 pt-5">
                      <CardTitle className="text-xl font-medium">
                        {t.products.hygiene.skincare.title}
                      </CardTitle>
                      <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                        {t.products.hygiene.skincare.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-3">
                      <div className="space-y-2 rounded-xl bg-[#f2f2f7] p-4 dark:bg-[#3a3a3c]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#ff3b30]">
                              🇺🇸
                            </span>
                            <span className="font-medium">
                              {t.products.hygiene.skincare.us}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#8e8e93]" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#0066cc]">
                              🇪🇺
                            </span>
                            <span className="font-medium">
                              {t.products.hygiene.skincare.eu}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm italic text-[#6e6e73] dark:text-[#86868b]">
                          {t.products.hygiene.skincare.note}
                        </p>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.discover}
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.compare}
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-8 text-center">
                  <Link href="/all-products?category=hygiene">
                    <Button className="rounded-full bg-white px-6 text-[#0066cc] shadow-sm hover:bg-[#f2f2f7] dark:bg-[#2c2c2e] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]">
                      {t.viewAll}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="household" className="mt-6 p-4">
                <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <Card className="transform overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg dark:bg-[#2c2c2e]">
                    <CardHeader className="px-5 pb-0 pt-5">
                      <CardTitle className="text-xl font-medium">
                        {t.products.household.cleaning.title}
                      </CardTitle>
                      <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                        {t.products.household.cleaning.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-3">
                      <div className="space-y-2 rounded-xl bg-[#f2f2f7] p-4 dark:bg-[#3a3a3c]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#ff3b30]">
                              🇺🇸
                            </span>
                            <span className="font-medium">
                              {t.products.household.cleaning.us}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#8e8e93]" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#0066cc]">
                              🇪🇺
                            </span>
                            <span className="font-medium">
                              {t.products.household.cleaning.eu}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm italic text-[#6e6e73] dark:text-[#86868b]">
                          {t.products.household.cleaning.note}
                        </p>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.discover}
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.compare}
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-8 text-center">
                  <Link href="/all-products?category=household">
                    <Button className="rounded-full bg-white px-6 text-[#0066cc] shadow-sm hover:bg-[#f2f2f7] dark:bg-[#2c2c2e] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]">
                      {t.viewAll}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="fashion" className="mt-6 p-4">
                <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <Card className="transform overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg dark:bg-[#2c2c2e]">
                    <div className="absolute right-4 top-4">
                      <Badge className="border-0 bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] py-0.5 text-xs shadow-sm hover:from-[#0055aa] hover:to-[#4ab8ea]">
                        {t.popular}
                      </Badge>
                    </div>
                    <CardHeader className="px-5 pb-0 pt-5">
                      <CardTitle className="text-xl font-medium">
                        {t.products.fashion.clothing.title}
                      </CardTitle>
                      <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                        {t.products.fashion.clothing.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-3">
                      <div className="space-y-2 rounded-xl bg-[#f2f2f7] p-4 dark:bg-[#3a3a3c]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#ff3b30]">
                              🇺🇸
                            </span>
                            <span className="font-medium">
                              {t.products.fashion.clothing.us}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#8e8e93]" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#0066cc]">
                              🇪🇺
                            </span>
                            <span className="font-medium">
                              {t.products.fashion.clothing.eu}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm italic text-[#6e6e73] dark:text-[#86868b]">
                          {t.products.fashion.clothing.note}
                        </p>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.discover}
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.compare}
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-8 text-center">
                  <Link href="/all-products?category=fashion">
                    <Button className="rounded-full bg-white px-6 text-[#0066cc] shadow-sm hover:bg-[#f2f2f7] dark:bg-[#2c2c2e] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]">
                      {t.viewAll}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="tech" className="mt-6 p-4">
                <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <Card className="transform overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-lg dark:bg-[#2c2c2e]">
                    <CardHeader className="px-5 pb-0 pt-5">
                      <CardTitle className="text-xl font-medium">
                        {t.products.tech.smartphones.title}
                      </CardTitle>
                      <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                        {t.products.tech.smartphones.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-3">
                      <div className="space-y-2 rounded-xl bg-[#f2f2f7] p-4 dark:bg-[#3a3a3c]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#ff3b30]">
                              🇺🇸
                            </span>
                            <span className="font-medium">
                              {t.products.tech.smartphones.us}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#8e8e93]" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#0066cc]">
                              🇪🇺
                            </span>
                            <span className="font-medium">
                              {t.products.tech.smartphones.eu}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm italic text-[#6e6e73] dark:text-[#86868b]">
                          {t.products.tech.smartphones.note}
                        </p>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.discover}
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-auto rounded-full px-3 py-1 text-xs text-[#0066cc] hover:bg-[#f2f2f7] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]"
                        >
                          {t.compare}
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-8 text-center">
                  <Link href="/all-products?category=tech">
                    <Button className="rounded-full bg-white px-6 text-[#0066cc] shadow-sm hover:bg-[#f2f2f7] dark:bg-[#2c2c2e] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]">
                      {t.viewAll}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section
          id="digital"
          className="w-full bg-white py-12 dark:bg-[#1d1d1f] md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="max-w-3xl space-y-2">
                <Badge
                  variant="outline"
                  className="mb-2 border-0 bg-gradient-to-r from-[#5ac8fa] to-[#34c759] px-3 py-1 text-sm text-white shadow-sm"
                >
                  {t.nav.digital}
                </Badge>
                <h2 className="bg-gradient-to-r from-[#5ac8fa] to-[#34c759] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
                  {t.digital.title}
                </h2>
                <p className="text-[#6e6e73] dark:text-[#86868b] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.digital.description}
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group transform overflow-hidden rounded-3xl border-0 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-[#2c2c2e]">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#5ac8fa] to-[#0066cc] text-white shadow-md transition-all group-hover:shadow-lg">
                    <Smartphone className="h-7 w-7" />
                  </div>
                  <div className="grid gap-1">
                    <CardTitle className="text-xl font-medium">
                      {t.digital.search.title}
                    </CardTitle>
                    <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                      {t.digital.search.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 rounded-2xl bg-[#f2f2f7] p-5 dark:bg-[#3a3a3c]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#ff3b30]">🇺🇸</span>
                        <span className="font-medium">
                          {t.digital.search.us}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#8e8e93]" />
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#0066cc]">🇪🇺</span>
                        <span className="font-medium">
                          {t.digital.search.eu}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm italic text-[#6e6e73] dark:text-[#86868b]">
                      {t.digital.search.note}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full rounded-full transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#0066cc] group-hover:to-[#5ac8fa] group-hover:text-white"
                    >
                      {t.learnMore}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group transform overflow-hidden rounded-3xl border-0 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-[#2c2c2e]">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#34c759] to-[#30d158] text-white shadow-md transition-all group-hover:shadow-lg">
                    <Smartphone className="h-7 w-7" />
                  </div>
                  <div className="grid gap-1">
                    <CardTitle className="text-xl font-medium">
                      {t.digital.cloud.title}
                    </CardTitle>
                    <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                      {t.digital.cloud.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 rounded-2xl bg-[#f2f2f7] p-5 dark:bg-[#3a3a3c]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#ff3b30]">🇺🇸</span>
                        <span className="font-medium">
                          {t.digital.cloud.us}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#8e8e93]" />
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#0066cc]">🇪🇺</span>
                        <span className="font-medium">
                          {t.digital.cloud.eu}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm italic text-[#6e6e73] dark:text-[#86868b]">
                      {t.digital.cloud.note}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full rounded-full transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#34c759] group-hover:to-[#30d158] group-hover:text-white"
                    >
                      {t.learnMore}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group transform overflow-hidden rounded-3xl border-0 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-[#2c2c2e]">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#af52de] to-[#5856d6] text-white shadow-md transition-all group-hover:shadow-lg">
                    <Smartphone className="h-7 w-7" />
                  </div>
                  <div className="grid gap-1">
                    <CardTitle className="text-xl font-medium">
                      {t.digital.email.title}
                    </CardTitle>
                    <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                      {t.digital.email.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 rounded-2xl bg-[#f2f2f7] p-5 dark:bg-[#3a3a3c]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#ff3b30]">🇺🇸</span>
                        <span className="font-medium">
                          {t.digital.email.us}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#8e8e93]" />
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#0066cc]">🇪🇺</span>
                        <span className="font-medium">
                          {t.digital.email.eu}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm italic text-[#6e6e73] dark:text-[#86868b]">
                      {t.digital.email.note}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full rounded-full transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#af52de] group-hover:to-[#5856d6] group-hover:text-white"
                    >
                      {t.learnMore}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Link href="/all-products?category=digital">
                <Button className="rounded-full bg-white px-6 text-[#0066cc] shadow-sm hover:bg-[#f2f2f7] dark:bg-[#2c2c2e] dark:text-[#5ac8fa] dark:hover:bg-[#3a3a3c]">
                  {t.viewAll}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="w-full overflow-hidden bg-white py-12 dark:bg-[#1d1d1f] md:py-24 lg:py-32"
        >
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="max-w-3xl space-y-2">
                <Badge
                  variant="outline"
                  className="mb-2 border-0 bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] px-3 py-1 text-sm text-white shadow-sm"
                >
                  {t.nav.about} U.S.E
                </Badge>
                <h2 className="bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
                  {t.about.title}
                </h2>
                <p className="text-[#6e6e73] dark:text-[#86868b] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.about.description}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex transform flex-col justify-center space-y-4 rounded-3xl border border-[#e5e5ea] bg-white p-8 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-[#3a3a3c] dark:bg-[#2c2c2e]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] text-white shadow-md">
                  <Shield className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{t.about.privacy.title}</h3>
                  <p className="text-[#6e6e73] dark:text-[#86868b]">
                    {t.about.privacy.description}
                  </p>
                </div>
              </div>
              <div className="flex transform flex-col justify-center space-y-4 rounded-3xl border border-[#e5e5ea] bg-white p-8 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-[#3a3a3c] dark:bg-[#2c2c2e]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#34c759] to-[#30d158] text-white shadow-md">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{t.about.economy.title}</h3>
                  <p className="text-[#6e6e73] dark:text-[#86868b]">
                    {t.about.economy.description}
                  </p>
                </div>
              </div>
              <div className="flex transform flex-col justify-center space-y-4 rounded-3xl border border-[#e5e5ea] bg-white p-8 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-[#3a3a3c] dark:bg-[#2c2c2e]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#ffcc00] to-[#ff9500] text-white shadow-md">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{t.about.quality.title}</h3>
                  <p className="text-[#6e6e73] dark:text-[#86868b]">
                    {t.about.quality.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full overflow-hidden bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] py-12 text-white md:py-24 lg:py-32">
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="max-w-3xl space-y-2">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                  {t.newsletter.title}
                </h2>
                <p className="text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.newsletter.description}
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <form className="flex space-x-2">
                  <input
                    className="flex h-14 w-full rounded-full border-0 bg-white/10 px-6 py-2 text-sm ring-offset-background backdrop-blur-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t.newsletter.placeholder}
                    type="email"
                  />
                  <Button
                    type="submit"
                    className="h-14 rounded-full bg-white px-6 font-medium text-[#0066cc] transition-all duration-300 hover:bg-blue-50"
                  >
                    {t.newsletter.button}
                  </Button>
                </form>
                <p className="text-xs text-blue-200">{t.newsletter.privacy}</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute left-0 top-1/4 h-72 w-72 animate-blob rounded-full bg-white opacity-10 mix-blend-soft-light blur-3xl filter"></div>
            <div className="animation-delay-2000 absolute bottom-0 right-0 h-72 w-72 animate-blob rounded-full bg-[#ffcc00] opacity-10 mix-blend-soft-light blur-3xl filter"></div>
          </div>
        </section>
      </main>
      <footer className="w-full shrink-0 border-t border-[#e5e5ea] bg-white py-12 dark:border-[#3a3a3c] dark:bg-[#1d1d1f]">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="mr-2 text-3xl">🇪🇺</span>
                <span className="bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] bg-clip-text text-xl font-bold text-transparent">
                  U.S.E
                </span>
              </div>
              <p className="mt-2 text-sm text-[#6e6e73] dark:text-[#86868b]">
                {t.footer.rights}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">{t.nav.about}</h3>
              <nav className="flex flex-col gap-3">
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="#"
                >
                  {t.about.privacy.title}
                </Link>
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="#"
                >
                  {t.about.economy.title}
                </Link>
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="#"
                >
                  {t.about.quality.title}
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">{t.nav.digital}</h3>
              <nav className="flex flex-col gap-3">
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="#"
                >
                  {t.footer.terms}
                </Link>
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="#"
                >
                  {t.footer.privacy}
                </Link>
                <Link
                  className="text-sm text-[#6e6e73] transition-colors hover:text-[#0066cc] dark:text-[#86868b] dark:hover:text-[#5ac8fa]"
                  href="#"
                >
                  {t.footer.contact}
                </Link>
              </nav>
            </div>
          </div>
          <div className="mt-12 border-t border-[#e5e5ea] pt-8 text-center dark:border-[#3a3a3c]">
            <p className="text-xs text-[#8e8e93] dark:text-[#98989d]">
              Designed with ❤️ for European alternatives
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
