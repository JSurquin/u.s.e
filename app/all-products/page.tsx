"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ChevronLeft, Filter, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent } from "@/components/ui/sheet"

// Type pour les produits
type Product = {
  title: string
  eu: string
  note: string
  popular?: boolean
  new?: boolean
  recommended?: boolean
}

type SubcategoryData = {
  title: string
  items: Product[]
}

type CategoryData = {
  [subcategory: string]: SubcategoryData
}

type AllProductsData = {
  [category: string]: CategoryData
}

type FilteredProduct = Product & {
  category: string
  subcategory: string
  subcategoryTitle: string
}

export default function AllProducts() {
  // État pour suivre si le composant est monté
  const [isMounted, setIsMounted] = useState(false)

  // Hooks de base - toujours appelés dans le même ordre
  const searchParams = useSearchParams()
  const [language, setLanguage] = useState("fr")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeSubcategory, setActiveSubcategory] = useState("all")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [debug, setDebug] = useState(false)

  // Initialisation des états à partir des paramètres d'URL
  useEffect(() => {
    setIsMounted(true)

    const query = searchParams?.get("q")
    const category = searchParams?.get("category")
    const subcategory = searchParams?.get("subcategory")

    if (query) setSearchQuery(query)
    if (category) setActiveCategory(category)
    if (subcategory) setActiveSubcategory(subcategory)
  }, [searchParams])

  const translations = {
    fr: {
      title: "Toutes les alternatives européennes",
      description:
        "Explorez notre base de données complète d'alternatives européennes aux produits et services américains.",
      search: "Rechercher un produit américain...",
      searchButton: "Rechercher",
      filters: "Filtres",
      clearFilters: "Effacer les filtres",
      categories: {
        all: "Toutes les catégories",
        food: "Alimentation",
        hygiene: "Soins personnels",
        household: "Maison",
        fashion: "Mode",
        tech: "Technologie",
        digital: "Services numériques",
      },
      subcategories: {
        all: "Toutes les sous-catégories",
        food: {
          drinks: "Boissons gazeuses",
          snacks: "Snacks",
          fastfood: "Fast-food",
          coffee: "Café",
          chocolate: "Chocolat",
          cereals: "Céréales",
          soda: "Sodas et boissons",
          chips: "Chips et snacks salés",
          condiments: "Condiments",
          desserts: "Desserts et pâtisseries",
          icecream: "Crèmes glacées",
          alcohol: "Boissons alcoolisées",
          energydrinks: "Boissons énergisantes",
          soup: "Soupes et conserves",
          cheese: "Fromages et produits laitiers",
          pasta: "Pâtes et plats préparés",
        },
        hygiene: {
          skincare: "Soins de la peau",
          toothpaste: "Dentifrice",
          deodorants: "Déodorants",
          makeup: "Maquillage",
          shampoo: "Shampooing",
          soap: "Savon",
        },
        household: {
          cleaning: "Produits de nettoyage",
          laundry: "Lessive",
          paper: "Produits en papier",
          furniture: "Meubles",
          kitchenware: "Ustensiles de cuisine",
          candles: "Bougies",
        },
        fashion: {
          clothing: "Vêtements",
          sportswear: "Vêtements de sport",
          shoes: "Chaussures",
          luxury: "Luxe",
          accessories: "Accessoires",
          jewelry: "Bijoux",
        },
        tech: {
          smartphones: "Smartphones",
          computers: "Ordinateurs",
          audio: "Audio",
          appliances: "Électroménager",
          gaming: "Jeux vidéo",
          cameras: "Appareils photo",
        },
        digital: {
          search: "Moteurs de recherche",
          cloud: "Stockage cloud",
          email: "Services de messagerie",
          social: "Réseaux sociaux",
          streaming: "Services de streaming",
          messaging: "Applications de messagerie",
          maps: "Cartes et navigation",
          music: "Streaming musical",
          productivity: "Productivité",
          payment: "Paiement en ligne",
          dating: "Applications de rencontre",
          education: "Éducation en ligne",
        },
      },
      sort: {
        label: "Trier par",
        options: {
          relevance: "Pertinence",
          alphabetical: "Ordre alphabétique",
          popular: "Popularité",
        },
      },
      noResults: "Aucun résultat trouvé pour votre recherche. Essayez d'autres termes ou filtres.",
      backToHome: "Retour à l'accueil",
      popular: "Populaire",
      new: "Nouveau",
      recommended: "Recommandé",
      compare: "Comparer",
      discover: "Découvrir",
      resultsCount: "résultats trouvés",
      loading: "Chargement...",
      alternatives: "Alternatives européennes",
      americanProducts: "Produits américains",
      notes: "Notes",
    },
    en: {
      title: "All European Alternatives",
      description: "Explore our comprehensive database of European alternatives to American products and services.",
      search: "Search for an American product...",
      searchButton: "Search",
      filters: "Filters",
      clearFilters: "Clear filters",
      categories: {
        all: "All categories",
        food: "Food & Beverages",
        hygiene: "Personal Care",
        household: "Household",
        fashion: "Fashion",
        tech: "Technology",
        digital: "Digital Services",
      },
      subcategories: {
        all: "All subcategories",
        food: {
          drinks: "Soft Drinks",
          snacks: "Snacks",
          fastfood: "Fast Food",
          coffee: "Coffee",
          chocolate: "Chocolate",
          cereals: "Cereals",
          soda: "Sodas & Beverages",
          chips: "Chips & Savory Snacks",
          condiments: "Condiments",
          desserts: "Desserts & Pastries",
          icecream: "Ice Cream",
          alcohol: "Alcoholic Beverages",
          energydrinks: "Energy Drinks",
          soup: "Soups & Canned Goods",
          cheese: "Cheese & Dairy Products",
          pasta: "Pasta & Ready Meals",
        },
        hygiene: {
          skincare: "Skincare",
          toothpaste: "Toothpaste",
          deodorants: "Deodorants",
          makeup: "Makeup",
          shampoo: "Shampoo",
          soap: "Soap",
        },
        household: {
          cleaning: "Cleaning Products",
          laundry: "Laundry Detergent",
          paper: "Paper Products",
          furniture: "Furniture",
          kitchenware: "Kitchenware",
          candles: "Candles",
        },
        fashion: {
          clothing: "Clothing",
          sportswear: "Sportswear",
          shoes: "Shoes",
          luxury: "Luxury",
          accessories: "Accessories",
          jewelry: "Jewelry",
        },
        tech: {
          smartphones: "Smartphones",
          computers: "Computers",
          audio: "Audio",
          appliances: "Appliances",
          gaming: "Gaming",
          cameras: "Cameras",
        },
        digital: {
          search: "Search Engines",
          cloud: "Cloud Storage",
          email: "Email Services",
          social: "Social Media",
          streaming: "Streaming Services",
          messaging: "Messaging Apps",
          maps: "Maps & Navigation",
          music: "Music Streaming",
          productivity: "Productivity",
          payment: "Online Payment",
          dating: "Dating Apps",
          education: "Online Education",
        },
      },
      sort: {
        label: "Sort by",
        options: {
          relevance: "Relevance",
          alphabetical: "Alphabetical",
          popular: "Popularity",
        },
      },
      noResults: "No results found for your search. Try different terms or filters.",
      backToHome: "Back to home",
      popular: "Popular",
      new: "New",
      recommended: "Recommended",
      compare: "Compare",
      discover: "Discover",
      resultsCount: "results found",
      loading: "Loading...",
      alternatives: "European alternatives",
      americanProducts: "American products",
      notes: "Notes",
    },
  }

  const t = translations[language]

  // Définition des produits - utiliser useMemo pour éviter les recréations inutiles
  const allProducts: AllProductsData = useMemo(
    () => ({
      food: {
        drinks: {
          title: t.subcategories.food.drinks,
          items: [
            {
              title: "Coca-Cola, Pepsi",
              eu: "Breizh Cola, Fritz-kola, Mecca-Cola, Corsica Cola, Elsass Cola",
              note: "Many European countries have local craft soda brands with natural ingredients.",
              popular: true,
            },
          ],
        },
        snacks: {
          title: t.subcategories.food.snacks,
          items: [
            {
              title: "Lay's, Doritos, Monster Munch",
              eu: "Brets, Tyrrell's, Sibell, Vico, Bénénuts",
              note: "European snacks often contain fewer additives and preservatives.",
            },
          ],
        },
        fastfood: {
          title: t.subcategories.food.fastfood,
          items: [
            {
              title: "McDonald's, Burger King, KFC, Subway, Domino's Pizza, Krispy Kreme",
              eu: "Quick, Big Fernand, O'Tacos, Pomme de Pain, La Boîte à Pizza, La Mie Câline, Bagelstein, Brioche Dorée",
              note: "Support local European fast food chains with regional specialties.",
              recommended: true,
            },
          ],
        },
        soda: {
          title: t.subcategories.food.soda,
          items: [
            {
              title: "Mountain Dew, Dr Pepper, Fanta, Sierra Mist",
              eu: "Club-Mate, Kofola, Orangina, 7Up, Lorina, Elixia, Finley",
              note: "Europe offers a wide variety of local sodas with original recipes and often less sugar.",
              new: true,
            },
          ],
        },
        chips: {
          title: t.subcategories.food.chips,
          items: [
            {
              title: "Pringles, Barbecue Lay's, Goldfish Crackers",
              eu: "Lorenz Chipsletten, Chips Vico, Belin Croustilles, Tyrrell's, Sibell",
              note: "European chips often use better quality ingredients and healthier oils.",
            },
          ],
        },
        condiments: {
          title: t.subcategories.food.condiments,
          items: [
            {
              title: "Heinz Ketchup, Cheez Whiz",
              eu: "Amora Ketchup, Kiri, Bénénaise, Maille, Savora",
              note: "European condiments generally contain fewer additives and preservatives.",
            },
          ],
        },
        chocolate: {
          title: t.subcategories.food.chocolate,
          items: [
            {
              title: "Reese's, Skittles, M&M's, Tootsie Roll",
              eu: "Cémoi, Smarties, Dragibus, Carambar, Kinder, Milka, Côte d'Or",
              note: "European confectionery often uses traditional recipes and quality ingredients.",
            },
          ],
        },
        desserts: {
          title: t.subcategories.food.desserts,
          items: [
            {
              title: "Oreo, Pop-Tarts, Twinkies, Jell-O",
              eu: "BN, Napolitain, Paille d'Or, Flamby, Petit Écolier, Savane, Chamonix",
              note: "European desserts often favor authentic recipes and natural ingredients.",
            },
          ],
        },
        icecream: {
          title: t.subcategories.food.icecream,
          items: [
            {
              title: "Ben & Jerry's, Häagen-Dazs",
              eu: "La Belle Aude, Carte d'Or, Miko, Picard, Thiriet, Amorino",
              note: "European ice creams are often made with high-quality milk and cream.",
            },
          ],
        },
        alcohol: {
          title: t.subcategories.food.alcohol,
          items: [
            {
              title: "Budweiser, Jack Daniel's",
              eu: "Kronenbourg, Bellevoye, Leffe, Grimbergen, Heineken, Absolut, Grey Goose",
              note: "Europe has a rich tradition of breweries and distilleries with ancestral methods.",
            },
          ],
        },
        energydrinks: {
          title: t.subcategories.food.energydrinks,
          items: [
            {
              title: "Red Bull (US), Gatorade",
              eu: "Dark Dog, Isostar, Powerade, Mixxed Up, Burn, Tiger",
              note: "European energy drinks often offer more natural formulations.",
            },
          ],
        },
        soup: {
          title: t.subcategories.food.soup,
          items: [
            {
              title: "Campbell's Soup, Spam",
              eu: "Liebig, Corned-beef Hénaff, Royco, Knorr, Maggi",
              note: "European soups and canned goods generally contain fewer additives and salt.",
            },
          ],
        },
        cheese: {
          title: t.subcategories.food.cheese,
          items: [
            {
              title: "Velveeta, Philadelphia Cream Cheese",
              eu: "Caprice des Dieux, St Môret, Boursin, Kiri, Tartare, Chavroux",
              note: "Europe is renowned for its cheese tradition and quality dairy products.",
            },
          ],
        },
        pasta: {
          title: t.subcategories.food.pasta,
          items: [
            {
              title: "Kraft Mac & Cheese, Hot Pockets",
              eu: "Lustucru Coquillettes Fromage, Buitoni Piccolinis, Panzani, Barilla, Sodebo",
              note: "European ready meals often favor traditional recipes and quality ingredients.",
            },
          ],
        },
      },
      hygiene: {
        skincare: {
          title: t.subcategories.hygiene.skincare,
          items: [
            {
              title: "Neutrogena, CeraVe",
              eu: "La Roche-Posay, Bioderma, Avène, Vichy, Nuxe, Caudalie",
              note: "European skincare brands often follow stricter ingredient regulations.",
              popular: true,
            },
          ],
        },
        toothpaste: {
          title: t.subcategories.hygiene.toothpaste,
          items: [
            {
              title: "Colgate, Crest",
              eu: "Elmex, Sanogyl, Sensodyne, Meridol, Vademecum",
              note: "Many European dental brands focus on preventative care and natural ingredients.",
            },
          ],
        },
        deodorants: {
          title: t.subcategories.hygiene.deodorants,
          items: [
            {
              title: "Old Spice, Dove",
              eu: "Nuxe, Le Petit Marseillais, Ushuaïa, Nivea, Garnier",
              note: "European deodorants often contain fewer aluminum compounds.",
              recommended: true,
            },
          ],
        },
      },
      household: {
        cleaning: {
          title: t.subcategories.household.cleaning,
          items: [
            {
              title: "Clorox, Lysol",
              eu: "Frosch, L'Arbre Vert, St Marc, La Croix, Briochin",
              note: "European cleaning brands often focus on eco-friendly formulations.",
            },
          ],
        },
      },
      fashion: {
        clothing: {
          title: t.subcategories.fashion.clothing,
          items: [
            {
              title: "Gap, Tommy Hilfiger",
              eu: "Zara, H&M, Celio, Jules, Kiabi, Promod, Camaïeu",
              note: "European clothing brands often offer more cutting-edge designs and better quality.",
              popular: true,
            },
          ],
        },
      },
      tech: {
        smartphones: {
          title: t.subcategories.tech.smartphones,
          items: [
            {
              title: "Apple, Google",
              eu: "Nokia, Wiko, Fairphone, Gigaset, Alcatel",
              note: "European smartphones often offer good value for money and better privacy.",
            },
          ],
        },
      },
      digital: {
        search: {
          title: t.subcategories.digital.search,
          items: [
            {
              title: "Google, Bing, Yahoo",
              eu: "Qwant, Ecosia, Lilo, Startpage, Swisscows",
              note: "European search engines that don't track your searches or build user profiles.",
            },
          ],
        },
      },
    }),
    [t],
  )

  // Filtrer les produits en fonction des critères sélectionnés
  const filteredProducts = useMemo(() => {
    if (!isMounted) return []

    const results: FilteredProduct[] = []

    // Helper function to check if a product matches the search query
    const matchesSearch = (product: Product) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        product.title.toLowerCase().includes(query) ||
        product.eu.toLowerCase().includes(query) ||
        product.note.toLowerCase().includes(query)
      )
    }

    try {
      // Process all products based on active filters
      if (activeCategory === "all") {
        // Get all products from all categories
        Object.keys(allProducts).forEach((category) => {
          Object.keys(allProducts[category]).forEach((subcategory) => {
            const subcategoryData = allProducts[category][subcategory]
            subcategoryData.items.forEach((product) => {
              if (matchesSearch(product)) {
                results.push({
                  ...product,
                  category,
                  subcategory,
                  subcategoryTitle: subcategoryData.title,
                })
              }
            })
          })
        })
      } else {
        // Get products from the selected category
        const categoryProducts = allProducts[activeCategory]
        if (categoryProducts) {
          if (activeSubcategory === "all") {
            // Get all products from the selected category
            Object.keys(categoryProducts).forEach((subcategory) => {
              const subcategoryData = categoryProducts[subcategory]
              subcategoryData.items.forEach((product) => {
                if (matchesSearch(product)) {
                  results.push({
                    ...product,
                    category: activeCategory,
                    subcategory,
                    subcategoryTitle: subcategoryData.title,
                  })
                }
              })
            })
          } else {
            // Get products from the selected subcategory
            const subcategoryData = categoryProducts[activeSubcategory]
            if (subcategoryData) {
              subcategoryData.items.forEach((product) => {
                if (matchesSearch(product)) {
                  results.push({
                    ...product,
                    category: activeCategory,
                    subcategory: activeSubcategory,
                    subcategoryTitle: subcategoryData.title,
                  })
                }
              })
            }
          }
        }
      }
    } catch (error) {
      console.error("Error filtering products:", error)
    }

    if (debug) {
      console.log("Active Category:", activeCategory)
      console.log("Active Subcategory:", activeSubcategory)
      console.log("Search Query:", searchQuery)
      console.log("Filtered Products:", results.length)
    }

    return results
  }, [activeCategory, activeSubcategory, searchQuery, isMounted, allProducts, debug])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // La recherche est déjà gérée par l'effet de filteredProducts
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setActiveCategory("all")
    setActiveSubcategory("all")
  }

  // Fonction pour diviser une chaîne en tableau d'éléments
  const splitItems = (items: string): string[] => {
    return items.split(",").map((item) => item.trim())
  }

  // Afficher un état de chargement pendant le montage du composant
  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] dark:bg-[#1d1d1f]">
        <div className="animate-pulse text-[#0066cc] dark:text-[#5ac8fa]">
          {language === "fr" ? "Chargement..." : "Loading..."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f7] dark:bg-[#1d1d1f]">
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#1d1d1f]/90 backdrop-blur-2xl shadow-sm">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center text-primary font-bold text-2xl">
            <Link href="/" className="flex items-center">
              <span className="text-3xl mr-2">🇪🇺</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] font-medium">
                U.S.E
              </span>
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center ml-4">
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

          {/* Back to Home */}
          <div className="flex flex-1 justify-end">
            <Link href="/">
              <Button variant="ghost" className="rounded-full flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                {t.backToHome}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 md:px-6 py-8 max-w-[1800px]">
        <div className="flex flex-col space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-[#0066cc] to-[#5ac8fa]">
            {t.title}
          </h1>
          <p className="text-[#6e6e73] dark:text-[#86868b] max-w-3xl">{t.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 xl:gap-12">
          {/* Filters - Desktop */}
          <div className="hidden lg:block space-y-6 sticky top-24 self-start">
            <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-sm p-6 space-y-4">
              <h3 className="font-medium text-lg">{t.filters}</h3>

              <div className="space-y-2">
                <h4 className="text-sm text-[#6e6e73] dark:text-[#86868b]">{t.categories.all}</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveCategory("all")
                      setActiveSubcategory("all")
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeCategory === "all"
                        ? "bg-[#0066cc] text-white"
                        : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                    }`}
                  >
                    {t.categories.all}
                  </button>
                  {Object.keys(t.categories)
                    .filter((cat) => cat !== "all")
                    .map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveCategory(category)
                          setActiveSubcategory("all")
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          activeCategory === category
                            ? "bg-[#0066cc] text-white"
                            : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                        }`}
                      >
                        {t.categories[category]}
                      </button>
                    ))}
                </div>
              </div>

              {activeCategory !== "all" && (
                <div className="space-y-2">
                  <h4 className="text-sm text-[#6e6e73] dark:text-[#86868b]">{t.subcategories.all}</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveSubcategory("all")
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeSubcategory === "all"
                          ? "bg-[#0066cc] text-white"
                          : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                      }`}
                    >
                      {t.subcategories.all}
                    </button>
                    {Object.keys(t.subcategories[activeCategory] || {}).map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() => {
                          setActiveSubcategory(subcategory)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          activeSubcategory === subcategory
                            ? "bg-[#0066cc] text-white"
                            : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                        }`}
                      >
                        {t.subcategories[activeCategory][subcategory]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="outline" size="sm" onClick={handleClearFilters} className="w-full rounded-lg mt-4">
                {t.clearFilters}
              </Button>

              {/* Debug toggle - hidden in production */}
              <div className="hidden">
                <label className="flex items-center space-x-2 text-xs mt-4">
                  <input type="checkbox" checked={debug} onChange={() => setDebug(!debug)} className="rounded" />
                  <span>Debug mode</span>
                </label>
              </div>
            </div>
          </div>

          {/* Filters - Mobile */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <Button
              variant="outline"
              className="rounded-full flex items-center gap-2"
              onClick={() => setIsFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" />
              {t.filters}
            </Button>

            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="space-y-6 py-6">
                  <h3 className="font-medium text-lg">{t.filters}</h3>

                  <div className="space-y-2">
                    <h4 className="text-sm text-[#6e6e73] dark:text-[#86868b]">{t.categories.all}</h4>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveCategory("all")
                          setActiveSubcategory("all")
                          setIsFiltersOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          activeCategory === "all"
                            ? "bg-[#0066cc] text-white"
                            : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                        }`}
                      >
                        {t.categories.all}
                      </button>
                      {Object.keys(t.categories)
                        .filter((cat) => cat !== "all")
                        .map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setActiveCategory(category)
                              setActiveSubcategory("all")
                              setIsFiltersOpen(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                              activeCategory === category
                                ? "bg-[#0066cc] text-white"
                                : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                            }`}
                          >
                            {t.categories[category]}
                          </button>
                        ))}
                    </div>
                  </div>

                  {activeCategory !== "all" && (
                    <div className="space-y-2">
                      <h4 className="text-sm text-[#6e6e73] dark:text-[#86868b]">{t.subcategories.all}</h4>
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setActiveSubcategory("all")
                            setIsFiltersOpen(false)
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            activeSubcategory === "all"
                              ? "bg-[#0066cc] text-white"
                              : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                          }`}
                        >
                          {t.subcategories.all}
                        </button>
                        {Object.keys(t.subcategories[activeCategory] || {}).map((subcategory) => (
                          <button
                            key={subcategory}
                            onClick={() => {
                              setActiveSubcategory(subcategory)
                              setIsFiltersOpen(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                              activeSubcategory === subcategory
                                ? "bg-[#0066cc] text-white"
                                : "hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c]"
                            }`}
                          >
                            {t.subcategories[activeCategory][subcategory]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleClearFilters()
                      setIsFiltersOpen(false)
                    }}
                    className="w-full rounded-lg mt-4"
                  >
                    {t.clearFilters}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8e8e93]" />
                <Input
                  type="text"
                  placeholder={t.search}
                  className="pl-10 pr-4 py-2 h-12 rounded-full border-[#d1d1d6] dark:border-[#3a3a3c] bg-white/90 dark:bg-[#2c2c2e]/90 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8e8e93] hover:text-[#3a3a3c] dark:hover:text-[#d1d1d6]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                className="h-12 rounded-full bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] hover:from-[#0055aa] hover:to-[#4ab8ea] text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                {t.searchButton}
              </Button>
            </form>

            {/* Results Count */}
            <div className="text-[#6e6e73] dark:text-[#86868b] text-sm mb-4">
              {filteredProducts.length} {t.resultsCount}
            </div>

            {/* Results */}
            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 max-w-[1800px]">
                {filteredProducts.map((product, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-[#2c2c2e] rounded-2xl transform hover:scale-[1.01]"
                  >
                    {(product.popular || product.new || product.recommended) && (
                      <div className="absolute top-4 right-4">
                        {product.popular && (
                          <Badge className="bg-gradient-to-r from-[#0066cc] to-[#5ac8fa] hover:from-[#0055aa] hover:to-[#4ab8ea] border-0 shadow-sm text-xs py-0.5">
                            {t.popular}
                          </Badge>
                        )}
                        {product.new && (
                          <Badge className="bg-gradient-to-r from-[#af52de] to-[#5856d6] hover:from-[#9f42ce] hover:to-[#4846c6] border-0 shadow-sm text-xs py-0.5">
                            {t.new}
                          </Badge>
                        )}
                        {product.recommended && (
                          <Badge className="bg-gradient-to-r from-[#34c759] to-[#30d158] hover:from-[#2eb350] hover:to-[#28bd4c] border-0 shadow-sm text-xs py-0.5">
                            {t.recommended}
                          </Badge>
                        )}
                      </div>
                    )}
                    <CardHeader className="pb-0 pt-5 px-5">
                      <CardTitle className="text-xl font-medium">{product.subcategoryTitle}</CardTitle>
                      <CardDescription className="text-[#6e6e73] dark:text-[#86868b]">
                        {t.categories[product.category]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-3 px-5 pb-5">
                      <div className="space-y-4 bg-[#f2f2f7] dark:bg-[#3a3a3c] p-4 rounded-xl">
                        {/* Improved layout for multiple alternatives */}
                        <div className="grid grid-cols-1 gap-4">
                          {/* American Products */}
                          <div>
                            <h4 className="text-xs font-medium text-[#8e8e93] mb-1">{t.americanProducts}</h4>
                            <div className="flex items-start gap-2">
                              <span className="font-medium text-[#ff3b30] shrink-0 mt-0.5">🇺🇸</span>
                              <span className="font-medium text-sm sm:text-base break-words">{product.title}</span>
                            </div>
                          </div>

                          {/* European Alternatives */}
                          <div>
                            <h4 className="text-xs font-medium text-[#8e8e93] mb-1">{t.alternatives}</h4>
                            <div className="flex items-start gap-2">
                              <span className="font-medium text-[#0066cc] shrink-0 mt-0.5">🇪🇺</span>
                              <div className="flex flex-col gap-1">
                                {splitItems(product.eu).map((item, i) => (
                                  <span key={i} className="font-medium text-sm sm:text-base break-words">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <h4 className="text-xs font-medium text-[#8e8e93] mb-1">{t.notes}</h4>
                            <p className="text-sm text-[#6e6e73] dark:text-[#86868b] italic">{product.note}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Button
                          variant="ghost"
                          className="text-[#0066cc] dark:text-[#5ac8fa] hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c] rounded-full px-3 py-1 h-auto text-xs"
                        >
                          {t.discover}
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-[#0066cc] dark:text-[#5ac8fa] hover:bg-[#f2f2f7] dark:hover:bg-[#3a3a3c] rounded-full px-3 py-1 h-auto text-xs"
                        >
                          {t.compare}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-[#6e6e73] dark:text-[#86868b] mb-4">{t.noResults}</p>
                <Button variant="outline" onClick={handleClearFilters} className="rounded-full">
                  {t.clearFilters}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 w-full shrink-0 border-t border-[#e5e5ea] dark:border-[#3a3a3c] bg-white dark:bg-[#1d1d1f]">
        <div className="container px-4 md:px-6 text-center">
          <p className="text-xs text-[#8e8e93] dark:text-[#98989d]">Designed with ❤️ for European alternatives</p>
        </div>
      </footer>
    </div>
  )
}

